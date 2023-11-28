// import { Controller, Get, UseGuards } from "@nestjs/common";
// import { PrismaClient } from "@prisma/client";
// import { AuthGuard } from "src/auth/auth.guard";

// @Controller({
//     version: '1',
//     path: '/users',
// })
// export class UsersController {
//     constructor(private prismaService: PrismaClient) {}

//     @Get('/@me')
//     // @UseGuards(AuthGuard)
//     async retrieveSelfProfile() {
//       /*  const user = await this.prismaService.user.findFirst({
//             where: {
//                 id: 1,
//             },
//         })

//         return {
//             user,
//         };*/
//         return {
//             firstName: 'Jack',
//             lastName: 'Daniels',
//             avatar: 'non',
//         };
//     }
// }