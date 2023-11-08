import { Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { UsersService } from '../users/services/users.service';
import { RoomController } from './rooms.controller';
import { RoomService } from './services/rooms.service';
//import { MessagesGateway } from './messages.gateway';

@Module({
  providers: [RoomService, UsersService], //PrismaClient
  controllers: [RoomController],
})
export class RoomsModule {}
