import { Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { UsersService } from '../users/services/users.service';
import { RoomController } from '../rooms/rooms.controller';
import { MessageService } from './services/messages.service';

@Module({
  providers: [MessageService, UsersService], //PrismaClient
//   controllers: [RoomController],
})
export class RoomsModule {}
