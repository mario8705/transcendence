import { Controller, Post, Body, UsePipes, ValidationPipe, BadRequestException } from '@nestjs/common';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { AuthService } from './auth.service';

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
        const token = await this.authService.authorizeCodeFortyTwo(code);

        return {
            token,
        };
    }
}