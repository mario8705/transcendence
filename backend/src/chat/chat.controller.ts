import { Controller, Post, Body, Get } from '@nestjs/common';
import { RoomService } from '../rooms/DBrooms.service';
import { ChatService } from './DBchat.service';


@Controller("chat")
export class ChatController {

    constructor(
        private readonly roomService: RoomService,
		private readonly chatService: ChatService
    ) {}

    /**
     * @returns list of channels the user can join
     */
    @Get('get-channels')
    async getChannels( 
		@Body() userId: number
	) {
		return this.roomService.getPublicRooms(userId);
    }

	@Post('join-channel')
	async joinChannel(
		@Body() data: {userId: number, type: string, roomname: string, roomId: number, option: any}
	) {
		console.log(await this.chatService.chatRoom(data));
		return 'worked';
	}

	@Get('private-conv')
	async privateMessages(
		@Body() data: {userId: number, targetId: number}
	) {
		console.log('passe ici');
		return await this.chatService.getPrivateConversations(data.userId, data.targetId);
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
