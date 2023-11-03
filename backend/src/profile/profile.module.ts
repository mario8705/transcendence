/* eslint-disable prettier/prettier */
import { Module } from "@nestjs/common";
import { ProfileController } from "./profile.controller";
import { ProfileService } from "./profile.service";
import { PrismaClient } from "@prisma/client";
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from "path";

@Module({
    controllers: [ProfileController],
    providers: [
        ProfileService,
        PrismaClient
    ],
    imports: [
        ServeStaticModule.forRoot({
            rootPath: join(process.cwd(), 'uploads'),
            serveRoot: '/static/',
        }),
    ],
})
export class ProfileModule {
    constructor() {
    console.log(join(__dirname, '..', '..', '..', 'uploads'));
  }}