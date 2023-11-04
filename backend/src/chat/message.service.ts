import { Injectable } from '@nestjs/common';
import { PrismaClient, User } from '@prisma/client';
import { Socket } from 'socket.io';
import { ChatService } from 'src/chat/chat.service';

/**
 * ? Comment ça marche exactement la différence entre je reçois et j'envoie le message ?
 */

@Injectable()
export class UsersService {

	constructor(
		private readonly prismaService : PrismaClient
		) {}
	
	async getMessages(channelId: number) : Promise<any> {
		return this.prismaService.message.findMany({ 
			where: {
				channelId: channelId
			}
		});
	}

	async newChannelMessage(from: User, to: string, content: string) : Promise<any> {
		const channel = this.prismaService.channel.findUnique({where: {name: to}})
		const message = await this.prismaService.message.create({
			data: {
				content: content,
				createdAt: Date(),
				authorId: from.id,
				channelId: channel.id
			}
		});
		return message;
	}

	async newPrivateMessage(from: User, to: User, content: string) : Promise<any> {
		const conversations = this.prismaService.conversations.findUnique({
			where: {
				userId: from.id,
				converserId: to.id
			}
		});
		const message = await this.prismaService.message.create({
			data: {
				content : content,
				createdAt: Date(),
				authorId: from.id,
				channelId: conversation.id
			}
		});
		return message;

	}
	
}

