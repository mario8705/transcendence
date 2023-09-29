import { Module } from '@nestjs/common';
import { MessagesService } from 'src/modules/messages/services/messages.service';
import { UsersService } from 'src/modules/users/services/users.service';
import { SocketGateway } from './socket.gateway';
import { SocketService } from './socket.service';
import { RoomService } from '../rooms/services/rooms.service'

@Module({
  providers: [SocketGateway, SocketService, MessagesService, UsersService, RoomService]
})
export class SocketModule {}
