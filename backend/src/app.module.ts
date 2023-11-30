import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { GameModule } from './game/game.module';
import { SocketModule } from './socket/socket.module';
import { UsersModule } from './chat/users/users.module';
import { RoomsModule } from './chat/rooms/rooms.module';
import { TestModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { FriendsModule } from './friends/friends.module';
import { ProfileModule } from './profile/profile.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    AuthModule,
    GameModule,
    SocketModule,
    UsersModule,
    RoomsModule,
    ProfileModule,
    FriendsModule,
    TestModule,
    PrismaModule,
    EventEmitterModule.forRoot(),
  ],
  controllers: [],
  providers: [],
})

export class AppModule {}
