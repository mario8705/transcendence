import { Module } from '@nestjs/common';
import { RoomService } from './services/rooms.service';
//import { MessagesGateway } from './messages.gateway';

@Module({
  providers: [RoomService],
})
export class RoomsModule {}
