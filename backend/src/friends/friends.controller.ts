import { Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { FriendsService } from './friends.service';

@Controller('friends')
export class FriendsController {
  constructor(private friendService: FriendsService) {}

  @Get(':userId')
  async getFriendsList(@Param('userId', ParseIntPipe) userId: number) {
    return this.friendService.getFriendsList(userId);
  }
  @Post(':userId/unblock/:friendId')
  async unblockFriend(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('friendId', ParseIntPipe) friendId: number,
  ) {
    return this.friendService.unblockFriend(userId, friendId);
  }
}
