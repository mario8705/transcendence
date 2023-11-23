import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FriendsService {
  constructor(private prisma: PrismaService) {}

  // async getFriendsList(userId: number): Promise<any> {
  //   const friends = await this.prisma.user.findMany({
  //     where: {
  //       friends: {
  //         some: {
  //           userId, //include everyone, but we want only friends so it must fix the db
  //         },
  //       },
  //     },
  //     include: {
  //       friends: {
  //         select: {
  //           pseudo: true,
  //           status: true,
  //           friend: true,
  //         },
  //       },
  //     },
  //   });
  //   console.log(friends);
  //   return friends;
  // }

  // async getFriendsList(userId: number): Promise<any> {
  //   const friends = await this.prisma.user.findMany({
  //     where: {
  //       id: userId,
  //     },
  //     include: {
  //       friends: true,
  //       },
  //   });
  //   console.log(friends);
  //   return friends;
  // }

  // async getFriendsList(userId: number): Promise<any> {
  //   const friends = await this.prisma.user.findMany({
  //     where: {
  //       id: userId,
  //     },
  //     select: {
  //       friends: {
  //         select: {
  //           status: true,
  //           friend: {
  //             select: {
  //               pseudo: true,
  //             },
  //           },
  //         },
  //       },
  //     },
  //     include: {
  //       friends: true,
  //     },
  //   });
  //   console.log(friends);
  //   return friends;
  //  }

  // async getFriendsList(userId: number): Promise<any> {
  //   const friends = await this.prisma.user.findMany({
  //    where: {
  //      id: userId,
  //    },
  //    include: {
  //      friends: {
  //        select: {
  //          status: true,
  //          friend: {
  //            select: {
  //              pseudo: true,
  //            },
  //          },
  //        },
  //      },
  //    },
  //   });
  //   console.log(friends);
  //   return friends;
  //  }

  // async getFriendsList(userId: number): Promise<any> {
  //   const friends = await this.prisma.user.findMany({
  //   where: {
  //     id: userId,
  //   },
  //   include: {
  //     friends: {
  //       select: {
  //         status: true,
  //         friend: {
  //           select: {
  //             pseudo: true,
  //           },
  //         },
  //       },
  //     },
  //   },
  //   });
  //   console.log(friends);
  //   return friends;
  //  }

  async getFriendsList(userId: number): Promise<any> {
    // const friends = await this.prisma.user.findMany({
    //   where: {
    //     id: userId,
    //   },
    //   select: {
    //     friends: {
    //       select: {
    //         status: true,
    //         userId: true,
    //         friend: {
    //           select: {
    //             pseudo: true,
    //           },
    //         },
    //       },
    //     },
    //   },
    // });
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
  // async getFriendsList(userId: number): Promise<any> {
  //   const friends = await this.prisma.user.findMany({
  //     where: {
  //       id: userId,
  //     },
  //     include: {
  //       friends: {
  //         select: {
  //           status: true,
  //           friend: {
  //             select: {
  //               pseudo: true,
  //             },
  //           },
  //         },
  //       },
  //     },
  //   });
  //   console.log(friends);
  //   return friends;
  // }

  // async getFriendsList(userId: number): Promise<any> {
  //   const friends = await this.prisma.user.findMany({
  //     where: {
  //       friends: {
  //         some: {
  //           userId, //include everyone, but we want only friends so it must fix the db
  //         },
  //       },
  //     },
  //     include: {
  //       friends: true,
  //     },
  //   });
  //   console.log(friends);
  //   return friends;
  // }

  // async getChannelList(userId: number): Promise<any> {
  //   const elem = await this.prisma.channel.findMany({
  //     where: {
  //       memberships: {
  //         some: {
  //           userId,
  //         },
  //       },
  //     },
  //   });
  //   console.log(elem);
  //   return elem;
  // }
}
