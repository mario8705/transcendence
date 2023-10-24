import { Controller, Post, Body, UsePipes, ValidationPipe, BadRequestException, UnauthorizedException, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsNumberString, IsString, Length } from 'class-validator';
import { AuthService } from './auth.service';
import { TicketGuard } from './ticket.guard';
import { Request as ExpressRequest } from 'express';
import { TicketPayload } from './ticket.service';

export enum AuthorizationProviderType {
    FortyTwo = 'ft',
}

export class AuthorizeCodeDto {
    @IsString()
    @IsNotEmpty()
    code: string;

    @IsEnum(AuthorizationProviderType)
    provider: AuthorizationProviderType;
}

export class PasswordLoginDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}

export class VerifyOtpDto {
    @IsString()
    ticket: string;

    @Length(6, 6)
    @IsNumberString()
    code: string;
}

export class VerifyEmailDto {
    @IsString()
    ticket: string;

    @Length(6, 6)
    @IsNumberString()
    code: string;
}

export class SendVerificationMailDto {
    @IsString()
    ticket: string;
}

@Controller({
    version: '1',
    path: 'auth',
})
@UsePipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
}))
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('/authorize_code')
    async authorizeCode(@Body() { provider, code }: AuthorizeCodeDto) {
        if (provider !== 'ft')
            throw new BadRequestException();
        return await this.authService.authorizeCodeFortyTwo(code);
    }

    @Post('/login')
    async loginWithPassword(@Body() { email, password }: PasswordLoginDto) {
        try {
            return await this.authService.loginWithPassword(email, password);
        } catch {
            throw new UnauthorizedException();
        }
    }

    @UseGuards(TicketGuard)
    @Post('/mfa/otp')
    async verifyOtp(@Body() { code }: VerifyOtpDto, @Request() req: ExpressRequest) {
        try {
            return await this.authService.verifyOtpCode(req.ticket!, code);
        } catch {
            throw new UnauthorizedException();
        }
    }

    @UseGuards(TicketGuard)
    @Post('/mfa/email')
    async verifyEmail(@Body() { code }: VerifyEmailDto, @Request() req: ExpressRequest) {
        try {
            return await this.authService.verifyEmailCode(req.ticket!, parseInt(code, 10));
        } catch {
            throw new UnauthorizedException();
        }
    }

    @UseGuards(TicketGuard)
    @Post('/mfa/email/send')
    async sendVerificationMail(@Body() {}: SendVerificationMailDto, @Request() req: ExpressRequest) {
        try {
            return await this.authService.sendEmailVerification(req.ticket!);
        } catch {
            throw new UnauthorizedException();
        }
    }
}

declare global {
    namespace Express {
        export interface Request {
            ticket?: TicketPayload;
        }
    }
}