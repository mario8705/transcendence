import { Module } from '@nestjs/common';
// import { MessagesService } from 'src/modules/messages/services/messages.service';
import { UsersService } from '../chat/users/services/users.service';
import { SocketGateway } from './socket.gateway';
import { RoomService } from '../chat/rooms/services/rooms.service'
import { ChatService } from 'src/chat/chat.service';
import { GameService } from 'src/game/game.service';

@Module({
  providers: [ChatService, GameService, UsersService, RoomService, SocketGateway],
  controllers: [],
})
export class SocketModule {}

  