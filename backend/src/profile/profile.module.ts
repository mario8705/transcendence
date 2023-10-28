/* eslint-disable prettier/prettier */
import { Module } from "@nestjs/common";
import { ProfileController } from "./profile.controller";
import { ProfileService } from "./profile.service";
import { PrismaClient } from "@prisma/client";

@Module({
    controllers: [ProfileController],
    providers: [
        ProfileService,
        PrismaClient
    ],
    imports: []
})
export class ProfileModule {}