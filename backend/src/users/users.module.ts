import { Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { JwtModule } from "@nestjs/jwt";
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
    // providers: [ UsersService]
    providers: [ PrismaService ],
    controllers: [ UsersController ],
    imports: [ JwtModule ]
})
export class TestModule {}
