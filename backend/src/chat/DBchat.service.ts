import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { UsersService } from '../users_chat/DBusers.service';
import { RoomService } from '../rooms/DBrooms.service';
import { SocketGateway } from '../socket/socket.gateway'
import { MessagesService } from '../messages/messages.service'
import { ConversationsService } from '../conversations/conversations.service'
import { PrismaClient } from '@prisma/client';
import { SocketService } from 'src/socket/socket.service';

@Injectable()
export class ChatService {
	constructor(
		private readonly usersService: UsersService,
		@Inject(forwardRef(() => RoomService))
		private readonly roomService: RoomService,
		@Inject(forwardRef(() => SocketGateway))
		private readonly socketGateway: SocketGateway,
		private readonly messagesService: MessagesService,
		private readonly conversationsService: ConversationsService,
		private readonly prismaService : PrismaClient,
		private readonly socketService: SocketService
		) {}


	async chatUser(
		userId: number,
		type: string,
		targetId: number
	) {
		const user = await this.usersService.getUserById(userId);
		const target = await this.usersService.getUserById(targetId);
		if (user && target)
		if (type === "block") {
			if (await this.usersService.isUserBlocked(user.id, target.id) === true) {
				this.socketGateway.sendToClient(user.id, 'blocked', "You have already blocked " + target.name);
				return;
			}
			const result = await this.usersService.blockUser(user.id, target.id);
			if (result !== null) {
				this.socketGateway.sendToClient(user.id, 'blocked', target.name + "has been blocked");
				return;
			}
			this.socketGateway.sendToClient(userId, 'blocked', "Couldn't block " + target.name + ", please retry later");
			return;
		}
		else if (type === "unblock") {
			if (await this.usersService.isUserBlocked(user.id, target.id) === false) {
				this.socketGateway.sendToClient(user.id, 'blocked', target.name + " was not blocked");
				return;
			}
			const result = await this.usersService.unBlockUser(user.id, target.id);
			if (result !== null) {
				this.socketGateway.sendToClient(user.id, 'blocked', target.name + " has been successfully unblocked");
				return;
			}
			this.socketGateway.sendToClient(userId, 'blocked', "Couldn't unblock " + target.name + ", please retry later");
			return;
		}
	}
	
	// async chatUser(
	// 	client: Socket, 
	// 	data : {type: string, option: {target: string}}
	// 	) {
	// 	// console.log('userid in user: ', data);
	// 	// if(this.usersService.alreadyRegisterdByName() != undefined) {
	// 	// 	console.log("already registerd, updating socket...");
	// 	// 	this.usersService.updateSocketId(data, client.id);
	// 	// 	this.usersService.updateSocket(data, client);
	// 	// }
	// 	// else if (this.usersService.alreadyRegisterdById(data) != undefined) {
	// 	// 	console.log("already registered, updating name...");
	// 	// 	this.usersService.updateName(data, client.id);
	// 	// }
	// 	// else {
	// 	// 	console.log("Registering...");
	// 	// 	this.socketGateway.server.to('server').emit('usersConnected', {type: 'new', user: data});
	// 	// 	client.join('server');
	// 	// 	this.usersService.addUser(client.id, client, data);
	// 	// 	client.broadcast.emit('newUser', {id: client.id, name: data});
	// 	// }
	// 	// console.log(data);
	// }

	async chatMessage(
		client: Socket,
		data: {curruser: any, type: string, to: string, channelId: number, message: string, options: string}
	) {
		const user = await this.usersService.getUserById(data.curruser.id); //! Il me faut le token
		if (data.type === 'private') {
			if (data.to != user?.name && data.to != '') {
				const dest = await this.usersService.getUserById(data.curruser.id);
				if (dest != undefined) {	
					if (this.usersService.isUserBlocked(user, dest))
					{
						const msg = dest.name + " has been blocked";
						this.socketGateway.sendToClient(user.id, 'blocked', msg)
						return;
					}
					else if (this.usersService.blockedByUser(user, dest)){
						const msg = dest.name + " has blocked you";
						this.socketGateway.sendToClient(user.id, 'blocked', msg);
						return;
					}
					let conversation = await this.conversationsService.conversationExists(user.id, dest.id);
					if (conversation === null) {
						conversation = await this.conversationsService.createConversation(user.id, dest.id);
						const convSocketId = await this.conversationsService.getConversationSocketId(user.id, dest.id);
						if (convSocketId !== null && conversation !== null)
							this.socketService.joinConversation(user.id, dest.id, convSocketId.socketId);
						else {
							this.socketGateway.sendToClient(user.id, 'error', "The server failed to create this conversation, please try again later");
							return;
						}
					}
					const newMsg = this.messagesService.newPrivateMessage(user.id, conversation.id, data.message);
					//! il faut émettre le message sur la conversation maintenant.
					// this.socketGateway.server.to(conversationId.id).emit('message', {from : user.pseudo, to: data.to, message: data.message}); //! revoir comment j'envoie le message
				} else
					this.socketGateway.sendToClient(user.id, 'message', "No such connected user");
					return;
			}
		}
		else if (data.type === 'channel') {
			if (this.roomService.roomExists(data.channelId)) {
				if (this.roomService.isUserinRoom(user.id, data.channelId)) {
					const room = await this.roomService.getRoom(data.channelId);
					if (room !== null) {
						if (await this.roomService.isMute(user.id, room.id) === true) {
							this.socketGateway.sendToClient(user.id, 'mute', "You are mute on " + room.name);
							return;
						}
						if (await this.roomService.isBan(user.id, room.id) === true) {
							this.socketGateway.sendToClient(user.id, 'ban', "You are banned from " + room.name);
							return;
						}
						const newMsg = await this.messagesService.newChannelMessage(user.id, data.channelId, data.message);
						this.socketGateway.sendChannelMessage(user.id, data.to, data.channelId, 'message', newMsg);
						// this.socketGateway.server.to(room.id).emit('message', {from : user.pseudo, to: data.to, message: data.message});
						return;
					}
				}
			}
			const msg = data.to + " does not exist or you are not a member";
			this.socketGateway.sendToClient(user.id, 'channel', msg)
		}
	}

	async chatRoom( //! modifier cette fonction pour qu'elle renvoie par API et non pas par socket
		// client: Socket,
		data: {userId: number, type: string, roomname: string, roomId: number, option: any},
	) {
		const user = await this.usersService.getUserById(data.userId);
		if (data.type === 'join') {
			if (this.roomService.joinRoom(user.id, data.roomId, data.roomname, data.option)) {
				this.socketService.joinChannel(user.id, data.roomname);
				//TODO prévenir les autres qu'il est entré dans la room.
				// this.socketGateway.server.to(data.roomname).emit('message', {from: 'server', to: 'moi', message: user.pseudo + ' has joined this room'});
				// this.socketGateway.server.to('server').emit('roomupdate', {type: 'add', room: data.roomname});
			}
		} else if(data.type === 'exit') {
			if (this.roomService.roomExists(data.roomId)){
				if (this.roomService.isUserinRoom(user.id, data.roomId)) {
					this.roomService.removeUserfromRoom(user.id, data.roomId);
					this.socketService.leaveChannel(user.id, data.roomname);
					//TODO prévenir les autres qu'il est parti.
					// this.socketGateway.server.to(data.roomname).emit('message', {from: 'server', to: 'users', message: user.pseudo + ' has left this room'});
				} else
					this.socketGateway.sendToClient(user.id, 'channel', "You are not in this room");
			} else this.socketGateway.sendToClient(user.id, 'channel', "This channel does not exsits");
		} else if (data.type === 'invite') {
			if (this.roomService.roomExists(data.roomId)) {
				if (this.roomService.isUserinRoom(user.id, data.roomId)) {
					if (this.roomService.isUserinRoom(data.option.target, data.roomId)) {
						this.socketGateway.sendToClient(user.id, 'invite', data.option.target + ' is already in ' + data.roomname);
						return;
					} else {
						if (await this.roomService.isBan(data.option.targetId, data.roomId) === true) {
							this.socketGateway.sendToClient(user.id, 'ban', data.option.target + " is banned from " + data.roomname);
							return;
						}
						const membership = await this.roomService.joinByInvite(user.id, data.roomId, data.roomname);
						if (membership === null) {
							this.socketGateway.sendToClient(user.id, "error", "Server error, please retry later");
							return;
						}
					}
				}
			}
		}
		else if (data.type === 'manage') {
			//! Options for owner: addadmin, kickAdmin, changePwd, addPwd, rmPwd, addInvite, rmInvite
			//! Options for administrators: kick, ban and mute (expcept for the owner, and temporally)
			if (this.roomService.roomExists(data.roomId)) {
				if (data.option.type === 'invite') {
					const target = await this.usersService.getUserById(data.option.targetId);
					if (target && !this.roomService.isUserinRoom(target.id, data.roomId)) {
						this.socketGateway.server.to(target.id).emit('room', {type: 'invite', roomname: data.roomname});
					} 
				}
				if (this.roomService.isRoomAdmin(user, data.roomId)) {
					switch (data.option.type) {
						case 'kick': {
							const result = await this.roomService.kickUser(data.option.targetId, data.roomId);
							if (result.status === false)
								this.socketGateway.sendToClient(data.userId, 'error', result.msg);
							break;
						}
						case 'ban': {
							const result = await this.roomService.banUser(data.option.targetId, data.roomId);
							if (result.status === false)
								this.socketGateway.sendToClient(data.userId, 'error', result.msg);
							break;
						}
						case 'unban': {
							const result = await this.roomService.unBanUser(data.option.targetId, data.roomId);
							if (result.status === false) 
								this.socketGateway.sendToClient(data.userId, 'error', result.msg);
						}
						case 'mute': {
							const result = await this.roomService.muteUser(data.option.targetId, data.roomId);
							if (result.status === false)
								this.socketGateway.sendToClient(data.userId, 'error', result.msg);
							break;
						}
						case 'unmute' : {
							const result = await this.roomService.unMuteUser(data.option.targetId, data.roomId);
							if (result.status === false) 
								this.socketGateway.sendToClient(data.userId, 'error', result.msg); 
						}
						default: 
							break;
					}
					if (this.roomService.isRoomOwner(user, data.roomId)) {
						switch (data.option.type) {
							case 'addAdmin': {
								const result = await this.roomService.addAdmin(data.roomId, data.option.target);
								if (result.status === false)
									this.socketGateway.sendToClient(data.userId, 'error', result.msg);
								break;
							}
							case 'kickAdmin': {
								const result = await this.roomService.kickAdmin(data.roomId, data.option.target);
								if (result.status === false)
								this.socketGateway.sendToClient(data.userId, 'error', result.msg);
								break;
							}
							case 'addPwd': {
								const result = await this.roomService.addPwd(data.roomId, data.option.target);
								if (result.status === false)
								this.socketGateway.sendToClient(data.userId, 'error', result.msg);
								break;
							}
							case 'rmPwd' : {
								const result = await this.roomService.rmPwd(data.roomId);
								if (result.status === false)
								this.socketGateway.sendToClient(data.userId, 'error', result.msg);
								break;
							}
							case 'changePwd' : {
								const result = await this.roomService.addPwd(data.roomId, data.option.target);
								if (result.status === false)
								this.socketGateway.sendToClient(data.userId, 'error', result.msg);
								break;
							}
							case 'addInvite' : {
								const result = await this.roomService.addInvite(data.roomId);
								if (result.status === false)
								this.socketGateway.sendToClient(data.userId, 'error', result.msg);
								break;
							}
							case 'rmInvite' : {
								const result = await this.roomService.rmInvite(data.roomId);
								if (result.status === false)
								this.socketGateway.sendToClient(data.userId, 'error', result.msg);
								break;
							}
							case 'delete' : {
								this.roomService.clearUsersfromRoom(data.roomId);
								const result = await this.roomService.deleteRoom(data.roomId); //vérifier qu'on a bien tout enlevé partout
								if (result.status === false)
								this.socketGateway.sendToClient(data.userId, 'error', result.msg);
							}
							default: 
								break;
						}
					}
				}
			}
			
		}
	}

	async getPrivateConversations(
		userId: number,
		targetId: number
	){
		const conversation = await this.conversationsService.conversationExists(userId, targetId);
		if (conversation) {
			return await this.messagesService.getMessagesfromConversation(userId, targetId);
		}else {
			return "No such Conversation";
		}
	}

	// chatFriend(
	// 	client: Socket,
	// 	data: {type: string, target: string, options: any}
	// ) {
	// 	const user = this.usersService.getUserById(client.id);
	// 	const target = this.usersService.getUserbyName(data.target);
	// 	if (target) {
	// 		if (data.type === 'befriend') {
	// 			if (target && !this.usersService.areFriends(user, target)) {
	// 				// if (!this.usersService.blockedByUser)
	// 				this.socketGateway.server.to(target.id).emit('friend', {type: 'request', from: user.pseudo})
	// 			}
	// 		}
	// 		else if (data.type === 'response') {
	// 			if (data.options.response === true) {
	// 				this.usersService.addFriend(user, target);
	// 			}
	// 			else {
	// 				this.socketGateway.server.to(target.id).emit('error', {errmsg: user.pseudo + " doesn't want to be your friend"});
	// 				return;
	// 			}
	// 		}
	// 		else if (data.type === 'unfriendRequest') {
	// 			//Il faut supprimer l'amitié dans le profil du user
	// 			//Envoyer la notification à l'autre qu'il faut unfriend aussi	
	// 			if (user.friends.find((user) => user.pseudo === data.options.target) !== undefined) {
	// 				const target = user.friends.find((user) => user.pseudo === data.options.target);
	// 				user.friends.splice(user.friends.indexOf(target), 1);
	// 				this.socketGateway.server.to(target.socket.id).emit('unfriend', {from: user.pseudo}); //vérifier le format de la communication.
	// 				console.log(user.friends);
	// 			}
	// 			else {
	// 				this.socketGateway.server.to(client.id).emit('error', 'This user does not exists');
	// 			}
	// 		}
	// 		else if (data.type === 'unfriended') {
	// 			if (user.friends.find((user) => user.pseudo === data.options.target) !== undefined) {
	// 				const target = user.friends.find((user) => user.pseudo === data.options.target);
	// 				user.friends.splice(user.friends.indexOf(target), 1);
	// 				this.socketGateway.server.to(user.socket.id).emit('unfriended', 'You are no longer friends with ' + target.name);
	// 				console.log(user.friends);
	// 			}
	// 			else {
	// 				const msg = 'You'
	// 				this.socketGateway.server.to(client.id).emit('error', 'You are not friend with ' + data.options.target);
	// 			}
	// 		}
	// 	}
	// 	else {
	// 		const msg = data.target + ': unknown user';
	// 		this.socketGateway.sendToClient(user.id, 'error', msg);
			
	// 	}
	// }

}
