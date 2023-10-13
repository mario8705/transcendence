import { Module } from '@nestjs/common';
import { UsersService } from '../users/services/users.service';
import { RoomController } from './rooms.controller';
import { RoomService } from './services/rooms.service';
//import { MessagesGateway } from './messages.gateway';

@Module({
  providers: [RoomService, UsersService],
  controllers: [RoomController],
})
export class RoomsModule {}
