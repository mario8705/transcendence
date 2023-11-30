import { Injectable } from "@nestjs/common";
import { ChatService } from 'src/chat/DBchat.service';
import { UsersService } from 'src/users_chat/DBusers.service';
import { v4 as uuidv4 } from 'uuid';
import { PrismaClient } from '@prisma/client';
import { RoomService} from '../rooms/DBrooms.service'
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class MessagesService {

	constructor(
		private readonly prismaService: PrismaService
	) {};

	async getMessagesfromChannel(userId: number, channelId: number): Promise<any> {
		return await this.prismaService.message.findMany({
			where: {
				channelId: channelId
			}
		});
	}

	async getMessagesfromConversation(userId: number, friendId: number): Promise<any> {
		const user = await this.prismaService.user.findUnique({where: {id: userId}, include: {userConversations: true}});
		let conversationId = undefined;
		user.userConversations.map((conv) => {
			if (conv.receiverId === friendId) {
				conversationId = conv.conversationId;
			}
		});
		if (conversationId != undefined) {
			return await this.prismaService.privateMessage.findMany({where: {conversationId: conversationId}});
		}
		return undefined;
	}

	async newChannelMessage(user: any, channelId: number, message: any) : Promise<any> {
		const channel = await this.prismaService.channel.findUnique({
			where: 
			{id : channelId}});
		if (channel != null){
			return await this.prismaService.message.create({data: {
				authorId: user.id,
				content: message,
				channelId: channel.id
			}})
		};
	}

	async newPrivateMessage(userId: number, conversationId: number, message: string) : Promise<any> {
		return await this.prismaService.privateMessage.create({
			data: {
				authorId: userId,
				content: message,
				conversationId: conversationId
			}
		});
	}

	async clearAllMessages(channelId: number) : Promise<any> {
		return await this.prismaService.message.deleteMany({where: {channelId : channelId}});
	};
}
