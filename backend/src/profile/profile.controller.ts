/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Param, UploadedFile } from '@nestjs/common';
import { UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProfileService } from './profile.service';

@Controller('profile')
export class ProfileController {
    constructor( 
        private readonly profileService: ProfileService
    ) {}

    @Get(':pseudo')
    async getProfileInfos(@Param('pseudo') pseudo: string) {
        return this.profileService.getProfileInfos(pseudo);
    }

    @Post(':pseudo')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
        console.log("1");
        console.log("2", file);
        return { "avatar": file.originalname };
    }
}

// TODO: store this file in server / prisma