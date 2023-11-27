import { Controller, Post, Body, Get, Req } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { AuthGuard } from 'src/auth/auth.guard';
import { ChatService } from './DBchat.service';
import { RoomService } from '../rooms/DBrooms.service';
import { MessagesService } from '../messages/messages.service'
import { UsersService } from '../users_chat/DBusers.service';
// import { User } from './users/model/user.model';


@Controller("chat")
export class ChatController {

    constructor(
        private readonly prismaService: PrismaClient,
        private readonly chatService: ChatService,
		private readonly userService: UsersService,
        private readonly roomService: RoomService,
		private readonly authguard: AuthGuard,
		private readonly messagesService: MessagesService
    ) {}

    /**
	 * TODO: demander à max des précisions sur la route selon le type de channel
     * @returns list of channels the user can join
     */
    @Get('get-channels') // ne pas oublier les guards.
    async getChannels() {
        // les channels qui sont publics et dans lesquels il n'est pas déjà.
		// const user = AuthGuard.caller; //c'est juste pour essayer
        // return await this.prismaService.channel.findMany({
        //  where: {
		// 	 ChannelMembership: {
		// 		userId: {
		// 			not : user.id //of course récupérer le user du Guards
		// 		}
		// 	 },
		// 	}
        // });
    }


    /**
     * @param {User} user // from the authguard
     * @param {any} data
	 * @return //je ne sais pas encore
     */
    @Post('join-channel')
	//@UseGuards(AuthGuard)
    async joinChannel(
		@Body() data : {userId: number, type: string, roomname: string,roomId: number, option : any},
		// canActivate: [AuthGuard]
	) {
		// if(this.authguard.canActivate()){ // Qu'est ce que c'est que cette histoire de contexte encore ? Puréeeeeeeeee 

			this.chatService.chatRoom(data.userId, data); //récupérer le user de l'authGuard
		// }
    }

    /**
     * @param {User} user
     * @param {string} friend
     * @return all messages from the private conversation between two users.
     */
    @Get('friend-conv')
    async friendMessages(
		@Body() data: {curruser: any, friendId: number}
	) {
		// const user = this.userService.getUserById() //! ici il faut retrouver le user avec le token
		const user = await this.userService.getUserById(data.curruser.id)
        return this.messagesService.getMessagesfromConversation(user, data.friendId);
    }
}
