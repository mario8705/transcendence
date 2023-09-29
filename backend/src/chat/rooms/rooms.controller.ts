import { Controller, Post, Body, Get } from '@nestjs/common';
import { RoomService } from './services/rooms.service';

@Controller("room")
export class RoomController {
	roomService: RoomService;

	@Get("allMessages")
	GetMessages(
		@Body('room') roomname: string
		) {
		const room = this.roomService.getRoom(roomname);
		//Aller chercher dans la database les messages de cette room pour pouvoir les display dans le front
	}

	@Get('allUsers')
	getUsers(
		@Body('room') roomname: string
	) {
		return this.roomService.getUsersfromRoom(roomname);
	}
	

	// @Post("messages")
	// async messages(
	// @Body('username') username : string,
	// @Body('message') message : string
	// ) {
	// return 'test';
	// }
}
