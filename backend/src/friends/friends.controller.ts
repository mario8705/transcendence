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
  @Post(':userId/block/:friendId')
  async blockFriend(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('friendId', ParseIntPipe) friendId: number,
  ) {
    return this.friendService.blockFriend(userId, friendId);
  }
  // @Post(':userId/delete/:friendId')
  // async deleteFriend(
  //   @Param('userId', ParseIntPipe) userId: number,
  //   @Param('friendId', ParseIntPipe) friendId: number,
  // ) {
  //   return this.friendService.deleteFriend(userId, friendId);
  // }
  // @Post(':userId/cancel/:friendId')
  // async cancelFriend(
  //   @Param('userId', ParseIntPipe) userId: number,
  //   @Param('friendId', ParseIntPipe) friendId: number,
  // ) {
  //   return this.friendService.cancelFriend(userId, friendId);
  // }
  // @Post(':userId/accept/:friendId')
  // async acceptFriend(
  //   @Param('userId', ParseIntPipe) userId: number,
  //   @Param('friendId', ParseIntPipe) friendId: number,
  // ) {
  //   return this.friendService.acceptFriend(userId, friendId);
  // }
  // @Post(':userId/decline/:friendId')
  // async declineFriend(
  //   @Param('userId', ParseIntPipe) userId: number,
  //   @Param('friendId', ParseIntPipe) friendId: number,
  // ) {
  //   return this.friendService.declineFriend(userId, friendId);
  // }
}
