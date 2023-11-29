import { Module } from '@nestjs/common';
// import { AuthModule } from './auth/auth.module';
import { GameModule } from './game/game.module';
import { SocketModule } from './socket/socket.module';
// import { TestModule } from './users/users.module';

@Module({
  imports: [
	GameModule, 
	SocketModule,
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
