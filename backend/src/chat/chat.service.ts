import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { UsersService } from './users/services/users.service';
import { RoomService } from './rooms/services/rooms.service';
import { SocketGateway } from '../socket/socket.gateway'
import { v4 as uuidv4 } from 'uuid';
import { PrismaClient } from '@prisma/client';

/**
 * TODO Recoder les fonctions avec prisma
 * TODO Les messages purée
 */


@Injectable()
export class ChatService {
	constructor(
		private readonly usersService: UsersService,
		private readonly roomService: RoomService,
		@Inject(forwardRef(() => SocketGateway))
		private readonly socketGateway: SocketGateway,
		private readonly prismaService : PrismaClient
		) {}

	chatUser(
		client: Socket, 
		data : string
		) {
		//TODO: enelever tout ce qui relève de l'authentification, mais plus tard
		//TODO: gérer block
		console.log('userid in user: ', data);
		if(this.usersService.alreadyRegisterdByName(data) != undefined) {
			console.log("already registerd, updating socket...");
			this.usersService.updateSocketId(data, client.id);
			this.usersService.updateSocket(data, client);
		}
		else if (this.usersService.alreadyRegisterdById(data) != undefined) {
			console.log("already registered, updating name...");
			this.usersService.updateName(data, client.id);
		}
		else {
			console.log("Registering...");
			this.socketGateway.server.to('server').emit('usersConnected', {type: 'new', user: data});
			client.join('server');
			this.usersService.addUser(client.id, client, data);
			client.broadcast.emit('newUser', {id: client.id, name: data});
		}
		console.log(data);
	}

	// chatMessage(
	// 	client: Socket,
	// 	data: {type: string, to: string, message: string, options: string}
	// ) {
	// 	const user = this.usersService.getUserbyId(client.id);
	// 	if (user === null)
	// 		return;
	// 	if (data.type === "private") {
	// 		if(data.to !== user?.name && data.to !== '') {
	// 			const dest = this.usersService.getUserbyName(data.to);
	// 			if (dest === null)
	// 				return;
	// 			if ()
	// 		}
	// 	}
	// }

	chatMessage(
		client: Socket,
		data: {type: string, to: string, message: string, options: string}
	) {
		console.log(this.usersService.getUsers());
		console.log('received', data.message, ' ', data.type);
		const user = this.usersService.getUserbyId(client.id);
		if (data.type === 'priv') {
			if (data.to != user?.name && data.to != '') {
				const dest = this.usersService.getUserbyName(data.to);
				if (dest != undefined) {	
					if (user.conversations.find((conv) => conv.with === dest) === undefined) {
						const id = uuidv4();
						client.join(id);
						dest.socket.join(id);
						user.conversations.push({with: dest, id: id});
						dest.conversations.push({with: user, id: id});
						console.log('creating conversation');
						this.socketGateway.server.to(id).emit('message', {from : user.name, to: data.to, message: data.message});
					}
					else{
						console.log('existing conversation')
						const conversation = user.conversations.find((conv) => conv.with === dest);
						this.socketGateway.server.to(conversation.id).emit('message', {from : user.name, to: data.to, message: data.message});
					}
				}
				else 
					this.socketGateway.server.to(client.id).emit('message', "No such connected user");
			}
			else { //the freak is that about ? 
				const essai = 'le broadcast';
				this.socketGateway.server.emit('message', {from: user.name, to: '', message: data.message});
			}
		}
		else if (data.type === 'room') {
			if (this.roomService.roomExists(data.to)) {
				console.log('exists');
				if (this.roomService.isUserinRoom(user, data.to)) {
					const room = this.roomService.getRoom(data.to);
					if (room !== undefined) {
						this.socketGateway.server.to(room.id).emit('message', {from : user.name, to: data.to, message: data.message});
						return;
					}
				}
			this.socketGateway.server.to(client.id).emit('error', {errmsg: 'This room does not exists or you are not a memeber'});
			}
		}
	}

	chatRoom(
		client: Socket,
		data: {type: string, roomname: string, option: any},
	) {
		const user = this.usersService.getUserbyId(client.id);
		if (data.type === 'join') {
			if (this.roomService.joinRoom(user, data.roomname, data.option)) {
				client.join(data.roomname);
				this.socketGateway.server.to(data.roomname).emit('message', {from: 'server', to: 'moi', message: user.name + ' has joined this room'});
				this.socketGateway.server.to('server').emit('roomupdate', {type: 'add', room: data.roomname});
			}
			console.log(this.roomService.getRooms());
		}
		else if(data.type === 'exit') {
			if (this.roomService.roomExists(data.roomname)){
				if (this.roomService.isUserinRoom(user, data.roomname)) {
					this.roomService.removeUserfromRoom(user, data.roomname);
					client.leave(data.roomname);
					this.socketGateway.server.to(data.roomname).emit('message', {from: 'server', to: 'users', message: user.name + ' has left this room'});
					console.log(this.roomService.getUsersfromRoom(data.roomname));
				}
				else
					this.socketGateway.sendToClient(client.id, 'error', {errmsg: "You are not in this room"});
			}
			else this.socketGateway.sendToClient(client.id, 'error', {errmsg: "This room does not exist"});
		}
		else if (data.type === 'invited') {
			if (this.roomService.roomExists(data.roomname)) {
				//il faut que je regarde: si la room existe, si il ne fait pas déjà partie de la room
				if (this.roomService.isUserinRoom(user, data.roomname)) {
					return 'already in room';
				}
				else {
					//inscrire dans la database qu'il a été invité dans une room, et du coup envoyer l'information au front
					this.socketGateway.server.to(client.id).emit('invite', {type: 'invited', roomname: data.roomname}); // revoir comment je rtansmets l'information
				}
			}
		}
		else if (data.type === 'manage') {
			//! Options for owner: addadmin, kickAdmin, changePwd, addPwd, rmPwd, addInvite, rmInvite
			//? invite, owners or administrators?
			//! Options for administrators: kick, ban and mute (expcept for the owner, and temporally)
			if (this.roomService.roomExists(data.roomname)) {
				if (data.option.type === 'invite') {
					const target = this.usersService.getUserbyName(data.option.target);
					if (target && !this.roomService.isUserinRoom(target, data.roomname)) {
						this.socketGateway.server.to(target.id).emit('room', {type: 'invite', roomname: data.roomname});
					}
				}
				if (this.roomService.isRoomAdmin(user, data.roomname)) {
					switch (data.option.type) {
						case 'kick': {
							const result = this.roomService.kickUser(user, data.roomname, data.option.target);
							if (result.status === false)
								this.socketGateway.server.to(client.id).emit('error', result.msg);
							break;
						}
						case 'ban': {
							const result = this.roomService.banUser(user, data.roomname, data.option.target);
							if (result.status === false)
								this.socketGateway.server.to(client.id).emit('error', result.msg);
							break;
						}
						case 'mute': {
							const result = this.roomService.muteUser(user, data.roomname, data.option.target);
							if (result.status === false)
								this.socketGateway.server.to(client.id).emit('error', result.msg);
							break;
						}
						default: 
							break;
					}
					if (this.roomService.isRoomOwner(user, data.roomname)) {
						switch (data.option.type) { //? Est ce que seulement le owner peut inviter ou tous les administrateurs?
							case 'addAdmin': {
								const result = this.roomService.addAdmin(data.roomname, data.option.target);
								if (result.status === false)
									this.socketGateway.server.to(client.id).emit('error', result.msg);
								break;
							}
							case 'kickAdmin': {
								const result = this.roomService.kickAdmin(data.roomname, data.option.target);
								if (result.status === false)
									this.socketGateway.server.to(client.id).emit('error', result.msg);
								break;
							}
							case 'addPwd': {
								const result = this.roomService.addPwd(data.roomname, data.option.target);
								if (result.status === false)
									this.socketGateway.server.to(client.id).emit('error', result.msg);
								break;
							}
							case 'rmPwd' : {
								const result = this.roomService.rmPwd(data.roomname);
								if (result.status === false)
									this.socketGateway.server.to(client.id).emit('error', result.msg);
								break;
							}
							case 'changePwd' : {
								const result = this.roomService.addPwd(data.roomname, data.option.target);
								if (result.status === false)
									this.socketGateway.server.to(client.id).emit('error', result.msg);
								break;
							}
							case 'addInvite' : {
								const result = this.roomService.addInvite(data.roomname);
								if (result.status === false)
									this.socketGateway.server.to(client.id).emit('error', result.msg);
								break;
							}
							case 'rmInvite' : {
								const result = this.roomService.rmInvite(data.roomname);
								if (result.status === false)
									this.socketGateway.server.to(client.id).emit('error', result.msg);
								break;
							}
							case 'delete' : {
								this.roomService.clearUsersfromRoom(data.roomname);
								const result = this.roomService.deleteRoom(data.roomname);
								if (result.status === false)
									this.socketGateway.server.to(client.id).emit('error', result.msg);
							}
							default: 
								break;
						}
					}
				}
			}
			
		}
		else
			console.log("room does not exist");
	}

	chatFriend(
		client: Socket,
		data: {type: string, target: string, options: any}
	) {
		//rajouter block
		const user = this.usersService.getUserbyId(client.id);
		const target = this.usersService.getUserbyName(data.target);
		if (target) {
			if (data.type === 'befriend') {
				if (target) {
					this.socketGateway.server.to(target.id).emit('friend', {type: 'request', from: user.name})
				}
			}
			else if (data.type === 'requestresponse') {
				if (data.options.response === true) {
					this.usersService.addFriend(user, target);
				}
				else {
					this.socketGateway.server.to(target.id).emit('error', {errmsg: user.name + " doesn't want to be your friend"});
					return;
				}
			}
			else if (data.type === 'unfriendRequest') {
				//Il faut supprimer l'amitié dans le profil du user
				//Envoyer la notification à l'autre qu'il faut unfriend aussi	
				if (user.friends.find((user) => user.name === data.options.target) !== undefined) {
					const target = user.friends.find((user) => user.name === data.options.target);
					user.friends.splice(user.friends.indexOf(target), 1);
					this.socketGateway.server.to(target.socket.id).emit('unfriend', {from: user.name}); //vérifier le format de la communication.
					console.log(user.friends);
				}
				else {
					this.socketGateway.server.to(client.id).emit('error', 'This user does not exists');
				}
			}
			else if (data.type === 'unfriended') {
				if (user.friends.find((user) => user.name === data.options.target) !== undefined) {
					const target = user.friends.find((user) => user.name === data.options.target);
					user.friends.splice(user.friends.indexOf(target), 1);
					this.socketGateway.server.to(user.socket.id).emit('unfriended', 'You are no longer friends with ' + target.name);
					console.log(user.friends);
				}
				else {
					this.socketGateway.server.to(client.id).emit('error', 'You are not friend with ' + data.options.target);
				}
			}
		}
		else 
			this.socketGateway.server.to(client.id).emit('error', {errmsg: data.target + ': unknown user'});
	}

	resetAll(client: Socket) {
		this.roomService.clearRooms();
		console.log(this.roomService.getRooms());
		console.log("rooms cleaned");
		this.socketGateway.server.to(client.id).emit('cleaned', 'rooms');
		return;
	}


}
