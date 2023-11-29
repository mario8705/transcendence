import { Module } from '@nestjs/common';
import { ChatModule } from './chat/chat.module';
// import { AuthModule } from './auth/auth.module';
import { GameModule } from './game/game.module';
import { SocketModule } from './socket/socket.module';
// import { TestModule } from './users/users.module';

@Module({
  imports: [
	GameModule, 
	SocketModule,
	ChatModule
], //AuthModule, TestModule
  controllers: [],
  providers: [],
})

export class AppModule {}

// imports: [
//     AuthModule,
//     GameModule,
//     SocketModule,
//     UsersModule,
//     RoomsModule,
//     ProfileModule,
//     FriendsModule,
//     TestModule,
//     PrismaModule,
//   ],
//   controllers: [],
//   providers: [],
// })
