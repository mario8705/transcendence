import { Module } from '@nestjs/common';
// import { MessagesService } from 'src/modules/messages/services/messages.service';
import { UsersService } from '../users_chat/DBusers.service';
import { SocketGateway } from './socket.gateway';
import { RoomService } from '../rooms/DBrooms.service'
import { ChatService } from 'src/chat/DBchat.service';
import { GameService } from 'src/game/game.service';

@Module({
	imports: [GameService],
	providers: [ChatService, GameService, UsersService, RoomService, SocketGateway],
	controllers: [],
})

export class SocketModule {}
