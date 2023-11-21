import { Injectable } from "@nestjs/common";
import { ChatService } from 'src/chat/chat.service';
import { UsersService } from 'src/chat/users/services/users.service';
import { v4 as uuidv4 } from 'uuid';
import { PrismaClient } from '@prisma/client';
import { RoomService} from '../../rooms/services/rooms.service'
import { User } from "src/chat/users/model/user.model";

@Injectable()
export class MessageService {

	constructor(
		private readonly roomService : RoomService,
		private readonly prismaService: PrismaClient
	) {};

	async getMessages(user: User, roomname: string): Promise<any> {
		const channel = await this.prismaService.findUnique({where: {name : roomname}});
		return await this.prismaService.messages.findMany({
			where: {
				channelId: channel.id
			}
		});
	}

	async getOneMessage(user: User, roomname: string, time: Date) : Promise<any> {
		const channel = this.roomService.getRoom();
		return await this.prismaService.message.findUnique({
			where: {
				channelId: channel.id,
				createdAt: time
			}
		});
	}

	async newMessage(user: User, roomname: string, message: any) : Promise<any> {
		const channel = await this.prismaService.channel.findUnique({
			where: 
			{name : roomname}});
		if (channel != null){
			return await this.prismaService.message.create({data: {
				authorId: user.id, //purééééééééééééé
				content: message,
				channelId: channel.id
			}})
		};
	}

	async clearAllMessages(roomname: string) : Promise<any> {
		const channel = this.roomService.getRoom(roomname);
		return await this.prismaService.message.deleteMany({where: {channelId : channel.id}});
	};
}
