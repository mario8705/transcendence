import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { FriendsService } from './friends.service';

@Controller('friends')
export class FriendsController {
  constructor(private friendService: FriendsService) {}

  @Get(':userId')
  async getFriendsList(@Param('userId', ParseIntPipe) userId: number) {
    return this.friendService.getFriendsList(userId);
  }
}
