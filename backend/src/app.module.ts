import { Module } from '@nestjs/common';
import { RoomsModule } from './chat/rooms/rooms.module';
import { UsersModule } from './chat/users/users.module';
import {SocketModule} from './socket/socket.module'
import { GameModule } from './game/game.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
	SocketModule,
	ChatModule,
],
})

export class AppModule {}
