import { Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { SocketGateway } from 'src/socket/socket.gateway';
import { SocketModule } from 'src/socket/socket.module';
import { ChatService } from './DBchat.service';
import { RoomsModule } from '../rooms/rooms.module';
import { RoomService } from '../rooms/DBrooms.service';
import { UsersService } from '../users_chat/DBusers.service';

@Module({
  providers: [ChatService, RoomService, UsersService, SocketGateway], //PrismaClient
  imports: [SocketModule, RoomsModule],
})
export class ChatModule {}
