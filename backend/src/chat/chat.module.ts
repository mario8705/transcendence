import { Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { SocketGateway } from 'src/socket/socket.gateway';
import { SocketModule } from 'src/socket/socket.module';
import { ChatService } from './chat.service';
import { RoomsModule } from './rooms/rooms.module';
import { RoomService } from './rooms/services/rooms.service';
import { UsersService } from './users/services/users.service';

@Module({
  providers: [ChatService, RoomService, UsersService, SocketGateway], //PrismaClient
  imports: [SocketModule, RoomsModule],
})
export class ChatModule {}
