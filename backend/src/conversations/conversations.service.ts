import { Injectable } from "@nestjs/common";
import { ChatService } from 'src/chat/DBchat.service';
import { UsersService } from 'src/users_chat/DBusers.service';
import { v4 as uuidv4 } from 'uuid';
import { PrismaClient } from '@prisma/client';
import { RoomService} from '../rooms/DBrooms.service'
import { User } from "src/users_chat/user.model";

@Injectable()
export class ConversationsService {

	constructor(
		private readonly userService: UsersService,
		private readonly prismaService: PrismaClient
	) {};

	async conversationExists(userId: number, targetId: number) : Promise<any> {
		const user = await this.prismaService.user.findUnique({where: {id: userId}, include : {userConversations: true}});
		user.userConversations.map((conv) => {
			if (conv.receiverId === targetId)
				return conv.conversationId;
		});
		return null;
	}


	async createConversation(userId: number, targetId: number) : Promise<any> {
		const id : string = uuidv4();
		const conversation = await this.prismaService.conversation.create({
			data: {
				socketId : id
			}
		})
		if(conversation) {
			const conversation1 = await this.prismaService.userConversation.create({
				data: {
					userId: userId, receiverId: targetId, conversationId: conversation.id
				}
			});
			const conversation2 = await this.prismaService.userConversation.create({
				data: {
					userId: userId, receiverId: targetId, conversationId: conversation.id
				}
			});
			if (!conversation1 || !conversation2)
				return "coulnd't create user conversation."
			
		}
		return conversation
	}

	async getConversationSocketId(userId: number, destId: number) : Promise<any> {
		const user = await this.prismaService.user.findUnique({where : {id: userId}, include : {userConversations: true}});
		let conversationId = undefined;
		user.userConversations.map((conv) => {
			if (conv.receiverId === destId) {
				conversationId = conv.conversationId;	
			}
		})
		if (conversationId !== undefined) {
			return await this.prismaService.conversation.findUnique({where: {id: conversationId}});
		}
		return null;
	}

	async getConversationId(userId: number, destId: number) : Promise<any> {
		const user = await this.prismaService.user.findUnique({where : {id : userId}, include : {userConversations:true}});
		let conversationId = undefined;
		user.userConversations.map((conv) => {
			if (conv.receiverId === destId) {
				return conv.conversationId;
			}
		});
		return null;
	}
}
