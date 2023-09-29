import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
//import { MessagesGateway } from './messages.gateway';

@Module({
  providers: [UsersService],
})
export class UsersModule {}
