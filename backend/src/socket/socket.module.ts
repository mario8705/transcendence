import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { SocketService } from './socket.service';
import { GameModule } from 'src/game/game.module';
import { UsersModule } from 'src/users_chat/users.module';
import { RoomsModule } from 'src/rooms/rooms.module';
import { ChatModule } from 'src/chat/chat.module';

@Module({
	providers: [SocketService, SocketGateway],
	imports: [RoomsModule, ChatModule],
	exports: [SocketService, SocketGateway]
})

export class SocketModule {}
