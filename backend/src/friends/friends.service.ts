import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FriendsService {
  constructor(private prisma: PrismaService) {}

  async getFriendsList(userId: number): Promise<any> {
    const friends = await this.prisma.friendship.findMany({
      where: {
        userId,
      },
      select: {
        status: true,
        friend: {
          select: {
            id: true,
            pseudo: true,
          },
        },
      },
    });
    // console.log(friends);
    return friends;
  }

  async unblockFriend(userId: number, friendId: number): Promise<any> {
    const statusFriend = await this.prisma.friendship.update({
      where: {
        userId_friendId: { userId, friendId },
      },
      data: {
        status: 2,
      },
    });

    const blockedId = friendId;

    const blockFriend = await this.prisma.blocked.delete({
      where: {
        // userId_friendId: { userId, friendId },
        userId_blockedId: { userId, blockedId },
      },
    });

    // const blockedFriendIndex = blockFriend.findIndex(
    //   (friend) => friend.blocked.id === blockedFriendId,
    // );

    // if (blockedFriendIndex !== -1) {
    //   blockFriend[blockedFriendIndex].blocked.friends.status = 2;
    //   blockFriend.splice(blockedFriendIndex, 1);
    // }

    // const blockedFriendIndex = blockFriend.findIndex(
    //   (friend) => friend.blocked.id === blockedFriendId,
    // );
    // if (blockedFriendIndex !== -1) {
    //   const blockedFriend = blockFriend[blockedFriendIndex].blocked;
    //   const friendToUnblock = blockedFriend.friends.find(
    //     (friend) => friend.userId === blockedFriendId,
    //   );

    //   if (friendToUnblock) {
    //     friendToUnblock.status = 2;
    //     blockedFriend.friends = blockedFriend.friends.filter(
    //       (friend) => friend.userId !== blockedFriendId,
    //     );
    //   }
    // }

    return { blockFriend, statusFriend };
  }
  // async unblockFriend(userId: number, friendId: number): Promise<any> {
  //   const blockFriend = await this.prisma.blocked.findMany({
  //     where: {
  //       userId,
  //       // friendId,
  //     },
  //     select: {
  //       user: {
  //         select: {
  //           id: true,
  //           pseudo: true,
  //         },
  //       },
  //       blocked: {
  //         select: {
  //           id: true,
  //           pseudo: true,
  //         },
  //         include: {
  //           friends: {
  //             select: {
  //               userId: true,
  //               status: true,
  //             },
  //           },
  //         },
  //       },
  //     },
  //   });

  //   const blockedFriendIndex = blockFriend.findIndex(
  //     (friend) => friend.blocked.id === blockedFriendId,
  //   );

  //   if (blockedFriendIndex !== -1) {
  //     blockFriend[blockedFriendIndex].blocked.friends.status = 2;
  //     blockFriend.splice(blockedFriendIndex, 1);
  //   }

  //   // const blockedFriendIndex = blockFriend.findIndex(
  //   //   (friend) => friend.blocked.id === blockedFriendId,
  //   // );
  //   // if (blockedFriendIndex !== -1) {
  //   //   const blockedFriend = blockFriend[blockedFriendIndex].blocked;
  //   //   const friendToUnblock = blockedFriend.friends.find(
  //   //     (friend) => friend.userId === blockedFriendId,
  //   //   );

  //   //   if (friendToUnblock) {
  //   //     friendToUnblock.status = 2;
  //   //     blockedFriend.friends = blockedFriend.friends.filter(
  //   //       (friend) => friend.userId !== blockedFriendId,
  //   //     );
  //   //   }
  //   // }

  //   return { blockFriend, statusFriend};
  // }
}
