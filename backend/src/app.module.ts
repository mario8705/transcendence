import { Module } from '@nestjs/common';
// import { AuthModule } from './auth/auth.module';
import { GameModule } from './game/game.module';
import { ChatModule } from './chat/chat.module';
import { SocketModule } from './socket/socket.module';
import { TestModule } from './users/users.module';

@Module({
  imports: [
    AuthModule,
    GameModule,
    SocketModule,
	ChatModule,
    ProfileModule,
    FriendsModule,
    TestModule,
    PrismaModule,
  ],
  controllers: [],
  providers: [],
})

export class AppModule {}
