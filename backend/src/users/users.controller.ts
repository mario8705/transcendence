import { Controller, Get, UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/auth/auth.guard";
import { PrismaService } from "src/prisma.service";

@Controller({
    version: '1',
    path: '/users',
})
export class UsersController {
    constructor(private prismaService: PrismaService) {}

    @Get('/@me')
    // @UseGuards(AuthGuard)
    async retrieveSelfProfile() {
      /*  const user = await this.prismaService.user.findFirst({
            where: {
                id: 1,
            },
        })

        return {
            user,
        };*/
        return {
            firstName: 'Jack',
            lastName: 'Daniels',
            avatar: 'non',
        };
    }
}