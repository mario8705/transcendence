import { Module } from '@nestjs/common';
// import { SocketModule } from './chat/socket/socket.module';
import { SocketModule } from './socket/socket.module';

import { RoomsModule } from './chat/rooms/rooms.module';
import { UsersModule } from './chat/users/users.module';
import { GameModule } from './game/game.module';

@Module({
  imports: [GameModule, SocketModule, UsersModule, RoomsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
