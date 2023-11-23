import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { FriendsService } from './friends.service';

@Controller('friends')
export class FriendsController {
  constructor(private friendService: FriendsService) {}

  @Get(':userId')
  async getFriendsList(@Param('userId', ParseIntPipe) userId: number) {
    console.log('get called');
    return this.friendService.getFriendsList(userId);
  }

  // @Get(':userId/channels-list')
  // async getChannelList(@Param('userId', ParseIntPipe) userId: number) {
  //   console.log('bouuuuh', userId);
  //   return this.chatService.getChannelList(userId);
  // }
}
