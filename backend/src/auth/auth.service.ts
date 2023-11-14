import { BadGatewayException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma, PrismaClient } from '@prisma/client';
import { FortyTwoService } from 'src/ft/ft.service';
import { PrismaService } from 'src/prisma.service';
import { TicketPayload, TicketService } from './ticket.service';
import * as bcrypt from 'bcrypt';
import { MailService } from 'src/mail/mail.service';
import * as _ from 'lodash';
import * as speakeasy from 'speakeasy';

type Ticket = {
    ticket: string;
    mfa: string[];
};

type Token = {
    token: string;
    type: string;
};

const fortyTwoUserWithUser = Prisma.validator<Prisma.FortyTwoUserDefaultArgs>()({
    include: {
        user: true,
    },
});

const user = Prisma.validator<Prisma.UserDefaultArgs>()({});
type User = Prisma.UserGetPayload<typeof user>;

type FortyTwoUserWithUser = Prisma.FortyTwoUserGetPayload<typeof fortyTwoUserWithUser>;

@Injectable()
export class AuthService {
    constructor(
        private ft: FortyTwoService,
        private jwtService: JwtService,
        private prismaService: PrismaService,
        private ticketService: TicketService,
        private readonly mailService: MailService) {}
    
    async authorizeCodeFortyTwo(code: string): Promise<object> {
        /* First we exchange the code for an access token and a refresh token */
        const credentials = await this.ft.authorizeWithCode(code);

        /**
         * Then we retrieve the token information containing the resource owner id (the 42 user id)
         * that we use to uniquely identify a user within the database.
         */
        const tokenInfo = await this.ft.fetchTokenInfo(credentials);
        /**
         * Now we fetch or create the user record in the database
         */
        const ftUser: FortyTwoUserWithUser = await this.prismaService.fortyTwoUser.upsert({
            create: {
                id: tokenInfo.resource_owner_id,
                accessToken: credentials.access_token,
                user: {
                    create: {
                        email: 'noemail@example.com',
                        authMethod: 'oauth2',
                    }
                }
            },
            where: {
                id: tokenInfo.resource_owner_id,
            },
            update: {
                accessToken: credentials.access_token,
            },
            include: {
                user: true,
            },
        });

        return await this.loginUser(ftUser.user);
    }

    private async loginUser(user: User): Promise<Ticket | Token> {
        const methods = [ 'qrcode', 'sms' ];

        if (user.emailVerified)
            methods.push('email');

        if (user.totpEnabled)
            methods.push('otp');

        if (methods.length > 0) {
            return {
                ticket: await this.ticketService.generateTicket(user.id, methods as any),
                mfa: methods,
            };
        }

        return {
            token: await this.jwtService.signAsync({

            }, { subject: `${user.id}` }),
            type: 'bearer',
        };
    }

    async loginWithPassword(email: string, password: string): Promise<Ticket | Token> {
        const user = await this.prismaService.user.findUniqueOrThrow({
            where: {
                email,
            },
        });

        if (!await bcrypt.compare(password, user.password)) {
            throw 'Password does not match';
        }

        return await this.loginUser(user);
    }

    private generateCode(): number {
        const digits = [ '0', '1', '2', '3', '4', '5', '6', '7', '8', '9' ];
        const firstDigit = _.shuffle(digits.slice(1))[0];

        digits.push(...digits); /* Double it */
        return parseInt(firstDigit.concat(_.shuffle(digits).slice(0, 5).join('')));
    }

    private async generateToken(ticket: TicketPayload): Promise<Token> {
        await this.prismaService.ticket.delete({
            where: {
                id: ticket.ticketId,
            },
        });

        return {
            type: 'bearer',
            token: await this.jwtService.signAsync({

            }, {
                subject: `${ticket.userId}`,
            }),
        };
    }

    async verifyEmailCode(ticket: TicketPayload, code: number): Promise<Token> {
        const emailCode = await this.prismaService.emailCode.findUniqueOrThrow({
            where: {
                ticketId: ticket.ticketId,
            },
        });

        if (emailCode.code !== code) {
            throw 'Invalid code';
        }

        return await this.generateToken(ticket);
    }

    async verifyOtpCode(ticket: TicketPayload, code: string): Promise<Token> {
        const user = await this.prismaService.user.findUniqueOrThrow({
            where: {
                id: ticket.userId,
                totpEnabled: true,
            },
        });

        if (!speakeasy.totp.verify({
            secret: user.totpSecret,
            encoding: 'base32',
            token: code,
        })) {
            throw 'Invalid TOTP token';
        }

        return await this.generateToken(ticket);
    }

    async sendEmailVerification(ticket: TicketPayload) {
        /* TODO check if the user can use email verification */

        const user = await this.prismaService.user.findFirstOrThrow({
            where: {
                id: ticket.userId,
            },
            select: {
                email: true,
            },
        });

        const emailCode = await this.prismaService.emailCode.upsert({
            create: {
                ticket: {
                    connect: {
                        id: ticket.ticketId,
                    },
                },
                code: this.generateCode(),
            },
            update: {},
            where: {
                ticketId: ticket.ticketId,
            },
        });

        await this.mailService.sendConfirmationMail(user.email, `${emailCode.code}`);
    }
}