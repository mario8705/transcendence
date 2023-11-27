import { Module } from '@nestjs/common';
import { UsersService } from './DBusers.service';

@Module({
  providers: [UsersService],
})
export class UsersModule {}
