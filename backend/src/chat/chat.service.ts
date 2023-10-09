import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { UsersService } from './users/services/users.service';
import { RoomService } from './rooms/services/rooms.service';
import { SocketGateway } from '../socket/socket.gateway' 

@Injectable()
export class ChatService {
	constructor(
		private readonly usersService: UsersService,
		private readonly roomService: RoomService,
		@Inject(forwardRef(() => SocketGateway))
		private readonly socketGateway: SocketGateway
		) {}

	chatUser(
		client: Socket, 
		data : string
		) {
		console.log('userid in user: ', data);
		if(this.usersService.alreadyRegisterdByName(data) != undefined) {
			console.log("already registerd, updating socket...");
			this.usersService.updateSocket(data, client.id);
		}
		else if (this.usersService.alreadyRegisterdById(data) != undefined) {
			console.log("already registered, updating name...");
			this.usersService.updateName(data, client.id);
		}
		else {
			console.log("Registering...");
			const users = this.usersService.getUsers();
			users.map((user) => {
				this.socketGateway.server.to(user.id).emit('usersConnected', {type: 'new', user: data});
				// this.socketGateway.sendToClient(user.id, 'usersConnected', {type: 'new', user: data});
				// this.socketGateway.sendToClient(client.id, 'usersConnected', {type: 'new', user: user.name});
			})
			this.usersService.addUser(client.id, data);
			client.broadcast.emit('newUser', {id: client.id, name: data});
		}
		console.log(data);
	}

	chatMessage(
		client: Socket,
		data: {type: string, to: string, message: string, options: string}
	) {
		console.log(this.usersService.getUsers());
		console.log('received', data.message);
		const user = this.usersService.getUserbyId(client.id);
		if (data.type === 'priv') {
			if (data.to != user?.name && data.to != '') {
				console.log("pas à moi");
				const dest = this.usersService.getUserbyName(data.to);
				if (dest != undefined)
					this.socketGateway.server.to(dest.id).emit('message', {from : user.name, to: data.to, message: data.message});
				else 
					this.socketGateway.server.to(client.id).emit('message', "No such connected user");
			}
			else {
				const essai = 'le broadcast';
				this.socketGateway.server.emit('message', {from: user.name, to: '', message: data.message});
			}
		}
		else if (data.type === 'room') {
			if (this.roomService.roomExists(data.to)) {
				console.log('exists');
				if (this.roomService.isUserinRoom(user, data.to)) {
					this.socketGateway.server.to(data.to).emit('message', {from : user.name, to: data.to, message: data.message});
					return;
				}
			this.socketGateway.server.to(client.id).emit('error', {errmsg: 'This room does not exists or you are not a memeber'});
			}
		}
	}

	chatRoom(
		client: Socket,
		data: {type: string, roomname: string, option: any}
	) {
		const user = this.usersService.getUserbyId(client.id);
		if (data.type === 'join') {
			if (this.roomService.joinRoom(user, data.roomname, data.option)) {
				client.join(data.roomname);
				this.socketGateway.server.to(data.roomname).emit('message', {from: 'server', to: 'moi', message: user.name + ' has joined this room'});
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
		else if (data.type === 'manage') {
			if (this.roomService.roomExists(data.roomname) && this.roomService.isRoomAdmin(user, data.roomname)) {
				console.log('là je peux faire les manipulations qui reviennet aux administrateurs');
			}
		}	
		else if (data.type === 'delete'){
			if (this.roomService.roomExists(data.roomname))
				this.roomService.clearUsersfromRoom(data.roomname);
				this.roomService.deleteRoom(data.roomname);
		}
		else
			console.log("room does not exist");
	}

	chatFriend(
		client: Socket,
		data: {type: string, target: string, options: string}
	) {
		console.log("wants a new friend");
		const user = this.usersService.getUserbyId(client.id);
		if (this.usersService.addFriend(user, this.usersService.getUserbyName(data.target)) === false) {
			console.log('cannot become friends because the target does not exist on our database');
			this.socketGateway.server.to(client.id).emit('error', {errmsg: 'Targeted friend does not exists'});
			return;
		}
		//TODO inform the other client that he has a new friend
		// TODO also ask the other client if he wants to be friends
		const target = this.usersService.getUserbyName(data.target);
		this.socketGateway.server.to(client.id).emit('friend', {type: 'new', from: user.name, friend: target.name, status: 'befriended'});
		this.socketGateway.server.to(target.id).emit('friend', {type: 'new', from: user.name, friend:user.name, status: 'newfriend'});
		return;
	}
}
