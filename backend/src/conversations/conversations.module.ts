import { Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { UsersService } from '../users_chat/DBusers.service';
import { ConversationsService } from './conversations.service';

@Module({
  providers: [ConversationsService, UsersService, PrismaClient],
//   controllers: [RoomController],
})
export class RoomsModule {}
