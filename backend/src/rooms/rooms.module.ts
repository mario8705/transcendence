import { Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { UsersService } from '../users_chat/DBusers.service';
import { RoomController } from './rooms.controller';
import { RoomService } from './DBrooms.service';

@Module({
  providers: [RoomService, UsersService], //PrismaClient
  controllers: [RoomController],
})
export class RoomsModule {}
