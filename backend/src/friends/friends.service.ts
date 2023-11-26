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
    return friends;
  }

  async unblockFriend(userId: number, friendId: number): Promise<any> {
    const blockedId = friendId;

    const blockedFriend = await this.prisma.blocked.findUnique({
      where: {
        userId_blockedId: { userId, blockedId },
      },
    });

    if (blockedFriend) {
      const statusFriend = await this.prisma.friendship.update({
        where: {
          userId_friendId: { userId, friendId },
        },
        data: {
          status: 2,
        },
      });

      const unblockFriend = await this.prisma.blocked.delete({
        where: {
          userId_blockedId: { userId, blockedId },
        },
      });
    }
    console.log(this.unblockFriend);

    // return this.getFriendsList(userId);
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
    return friends;
  }

  async blockFriend(userId: number, friendId: number): Promise<any> {
    const statusFriend = await this.prisma.friendship.update({
      where: {
        userId_friendId: { userId, friendId },
      },
      data: {
        status: 3,
      },
    });

    const unblockFriend = await this.prisma.blocked.create({
      data: {
        userId: userId,
        blockedId: friendId,
      },
    });

    console.log(unblockFriend, statusFriend);
    // return { unblockFriend, statusFriend };
    // return this.getFriendsList(userId);
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
    console.log(friends);
    return friends;
  }
}
