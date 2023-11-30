// /* eslint-disable prettier/prettier */
// import { Injectable } from '@nestjs/common';
// import { PrismaClient } from '@prisma/client';

// @Injectable()
// export class AvatarService {
//     constructor(private prisma: PrismaClient) {}

//     async seeUploadedFile(pseudo: string) {
//         const getAvatar = await this.prisma.user.findUnique({
//             where: { pseudo: pseudo }
//         });
//         return { "avatar": getAvatar.avatar };
//     }
// }