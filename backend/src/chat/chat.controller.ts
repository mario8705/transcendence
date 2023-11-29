import { Controller, Post, Body, Get, Req } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ChatService } from './DBchat.service';
import { RoomService } from '../rooms/DBrooms.service';
import { MessagesService } from '../messages/messages.service'
import { UsersService } from '../users_chat/DBusers.service';
import { PrismaService } from 'src/prisma/prisma.service';


@Controller("chat")
export class ChatController {

    constructor(
        private readonly chatService: ChatService,
        private readonly roomService: RoomService,
    ) {}

    /**
     * @returns list of channels the user can join
     */
    @Get('get-channels') // ne pas oublier les guards.
    async getChannels( 
		@Body() userId: number
	) {
		return this.roomService.getPublicRooms(userId);
    }

	@Post('join-channel')
	async joinChannel(
		// @Body() data: {userId: number, type: string, roomname: string, roomId: number, option: any}
	) {
		// return await this.chatService.chatRoom(data);
		console.log('marche');
	}

	@Get('private-conv')
	async privateMessages(
		// @Body() data: {userId: number, targetId: number}
	) {
		console.log('passe ici');
		// return await this.chatService.getPrivateConversations(data.userId, data.targetId);
	}

    // /**
    //  * @param {User} user
    //  * @param {string} friend
    //  * @return all messages from the private conversation between two users.
    //  */
    // @Get('friend-conv')
    // async friendMessages(
	// 	@Body() data: {curruser: any, friendId: number}
	// ) {
	// 	// const user = this.userService.getUserById() //! ici il faut retrouver le user avec le token
	// 	const user = await this.userService.getUserById(data.curruser.id)
    //     return this.messagesService.getMessagesfromConversation(user, data.friendId);
    // }
}
