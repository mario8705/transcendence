import { Controller, Post, Body, Get, Req } from '@nestjs/common';
import { ContextCreator } from '@nestjs/core/helpers/context-creator';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { PrismaClient } from '@prisma/client';
import { AuthGuard } from 'src/auth/auth.guard';
import { ChatService } from './chat.service';
import { Room } from './rooms/model/room.model';
import { RoomService } from './rooms/services/rooms.service';
import { MessageService } from './messages/services/messages.service'
import { Message } from './messages/model/message.model';
import { UsersService } from './users/services/users.service';
// import { User } from './users/model/user.model';


@Controller("chat")
export class ChatController {

    constructor(
         private readonly prismaService: PrismaClient,
        private readonly chatService: ChatService,
		private readonly userService: UsersService,
        private readonly roomService: RoomService,
		private readonly authguard: AuthGuard,
		private readonly messagesService: MessageService
    ) {}

    /**
	 * TODO: demander à max des précisions sur la route selon le type de channel
     * @returns list of channels the user can join
     */
    @Get('get-channels') // ne pas oublier les guards.
    async getChannels() {
        // const rooms = this.roomService.getRooms();
        // let public : Room[] = [];
        // rooms.map((room, i) => {
        //     if (room.visibility == "public")
        //         public.push(room);
        // });
        // return public;
        // les channels qui sont publics et dans lesquels il n'est pas déjà.
        return await this.prismaService.channel.findMany({
         where: {
             visibility: "public",
			 ChannelMembership: {
				userId: {
					not : user.id //of course récupérer le user du Guards
				}
			 }
			}
        });
    }


    /**
     * @param {User} user // from the authguard
     * @param {any} data
	 * @return //je ne sais pas encore
     */
    @Post('join-channel')
	//@UseGuards(AuthGuard)
    async joinChannel(
		@Body() data : {type: string, roomname: string, option : any},
		// canActivate: [AuthGuard]
	) {
		if(this.authguard.canActivate()){ // Qu'est ce que c'est que cette histoire de contexte encore ? Puréeeeeeeeee 

			this.chatService.chatRoom(user, data); //récupérer le user de l'authGuard
		}
    }

    /**
     * @param {User} user
     * @param {string} friend
     * @return all messages from the private conversation between two users.
     */
    @Get('friend-conv')
    async friendMessages(
		@Req() request: Request	
	) {
		// const user = this.userService.getUserbyId() //! ici il faut retrouver le user avec le token
        return this.messagesService.getMessages(user, request.body[roomname]);
    }
}
