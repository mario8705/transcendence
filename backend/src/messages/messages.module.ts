import { Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { UsersService } from '../users_chat/DBusers.service';
import { RoomController } from '../rooms/rooms.controller';
import { MessagesService } from './messages.service';

@Module({
  providers: [MessagesService, UsersService], //PrismaClient
//   controllers: [RoomController],
})
export class RoomsModule {}
