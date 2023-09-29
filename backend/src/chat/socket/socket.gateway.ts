import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
// import { CreateMessageDto } from '../modules/messages/dto/create-message.dto';
import { Socket, Server } from 'socket.io';
// import { MessagesService } from '../modules/messages/services/messages.service'
import { SocketService } from './socket.service'
import { UsersService } from '../users/services/users.service';
import { RoomService } from '../rooms/services/rooms.service';

@WebSocketGateway({
	cors: {
		origin: '*',
	}, 
})
export class SocketGateway {
	@WebSocketServer()
	server: Server;
	
	constructor(
		private readonly socketService: SocketService,
		// private readonly messagesService: MessagesService,
		private readonly usersService: UsersService,
		private readonly roomService: RoomService
		) {}

	
	/**Connection */
	handleConnection(client: Socket) {
		console.log(`client connected: ${client.id}`);
	}

	/**Deconnection */
	handleDisconnect(client: Socket) {
		console.log(`client disconnected: ${client.id}`);
	}

	@SubscribeMessage('user')
	getUser(
		client: Socket,
		data: string
	) : void {
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
				this.sendToClient(user.id, 'usersConnected', {type: 'new', user: data});
				this.sendToClient(client.id, 'usersConnected', {type: 'new', user: user.name});
			})
			this.usersService.addUser(client.id, data);
			client.broadcast.emit('newUser', {id: client.id, name: data});
		}
		console.log(data);
	}

	/**Recevoir un message */
	@SubscribeMessage('message')
	handleEvent(
		@MessageBody('') data: {type: string, to: string, message: string, options: string},
		@ConnectedSocket() client : Socket
		){
		console.log(this.usersService.getUsers());
		console.log('received', data.message);
		const user = this.usersService.getUserbyId(client.id);
		if (data.type === 'priv') {
			if (data.to != user?.name && data.to != '') {
				console.log("pas à moi");
				const dest = this.usersService.getUserbyName(data.to);
				if (dest != undefined)
					this.server.to(dest.id).emit('message', {from : user.name, to: data.to, message: data.message});
				else 
					this.server.to(client.id).emit('message', "No such connected user");
			}
			else {
				const essai = 'le broadcast';
				this.server.emit('message', {from: user.name, to: '', message: data.message});
			}
		}
		else if (data.type === 'room') {
			console.log('coucou');
			if (this.roomService.roomExists(data.to)) {
				console.log('exists');
				const usersfromRoom = this.roomService.getUsersfromRoom(data.to);
				usersfromRoom.map((el) => { 
					console.log(el.name);
					this.server.to(el.id).emit('message', {from : user.name, to: data.to, message: data.message});
				});
			}
		}
	}
	
	@SubscribeMessage('handshake')
	handshake(
	  @ConnectedSocket() client: Socket
  ) {
	  console.log("Received Handshake");
	  return {}
	//   this.server.emit('test', 'géééénial');
	  this.server.to(client.id).emit('handshake', 'coucou');
	}

	@SubscribeMessage('room')
	joinRoom(
	  @MessageBody('') data : {type: string, roomname: string, option: {invite: boolean, key: boolean, value: string}},
	  @ConnectedSocket()  client:Socket
	  ) {
	  console.log('ici');
	  const user = this.usersService.getUserbyId(client.id);
	  if (data.type === 'join') {
		this.roomService.joinRoom(user, data.roomname, data.option);
		console.log(this.roomService.getRooms());
	  }
	  else if(data.type === 'exit') {
		  if (this.roomService.roomExists(data.roomname)){
				if (this.roomService.isUserinRoom(user, data.roomname)) {
					this.roomService.removeUserfromRoom(user, data.roomname);
					console.log(this.roomService.getUsersfromRoom(data.roomname));
				}
				else
					this.sendToClient(client.id, 'error', {errmsg: "You are not in this room"});
		  }
		  else this.sendToClient(client.id, 'error', {errmsg: "This room does not exist"});
	  }		
	  else if (data.type === 'delete'){
		  if (this.roomService.roomExists(data.roomname))
			  this.roomService.clearUsersfromRoom(data.roomname);
			  this.roomService.deleteRoom(data.roomname);
	  }
	  else
	  	console.log("room does not exist");
	}

	@SubscribeMessage('friend')
	befriend(
		@MessageBody('') data: {type: string, target: string, options: string},
		@ConnectedSocket() client: Socket
	) {
		console.log("wants a new friend");
		//Find the client user
		const user = this.usersService.getUserbyId(client.id);
		//add the friend to the friend lists
		if (this.usersService.addFriend(user, this.usersService.getUserbyName(data.target)) === false) {
			console.log('cannot become friends because the target does not exist on our database');
			this.sendToClient(client.id, 'error', {errmsg: "Targeted friend does not exist"});
		}
		//Send the information to the clients that they are friends //TODO inform the other client that he has a new friend
		// TODO also ask the other client if he wants to be friends
		const list: string[] = this.usersService.getFriends(user);
		const target = this.usersService.getUserbyName(data.target);
		const target_list = this.usersService.getFriends(target);
		this.sendToClient(client.id, 'friend', {type: 'new', from: user.name, friend: target.name, status: 'befriended'})
		// this.server.to(target.id).emit('friend', {type: 'status', from: user.name, list: target_list, status: 'newfriend'});
		this.sendToClient(target.id, 'friend', {type: 'new', from: user.name, friend: user.name, status: 'newfriend'})
		return;
		// this.server.to(client.id).emit('friend', {type: 'status', from: user.name, list: list, status: 'befriended'});
	}

	sendToClient = (clientId: string, type: string, data: any) => {
		this.server.to(clientId).emit(type, data);
	}

	// @SubscribeMessage('createMessage')
	// async create(@MessageBody() createMessageDto: CreateMessageDto) {
	// const message = await this.messagesService.create(createMessageDto);

	// this.server.emit('message', message);
	// 	console.log('received');
	// 	return message;
	// }

	// @SubscribeMessage('getUsers')
	// updateUsers() {
	// 	console.log('')
	// 	this.server.emit('updateUsers', {users : this.usersService.getUsers()});
	// 	// return (this.usersService?.getUsers());
	// }

  	// @SubscribeMessage('findAllMessages')
  	// findAll() {
    // 	return this.messagesService.findAll();
  	// }

  	// @SubscribeMessage('typing')
  	// async typing(
	// 	@MessageBody('isTyping') isTyping: boolean,
	// 	@ConnectedSocket() client: Socket
	// 	) {
	// 		const name = await this.messagesService.getClientName[client.id];
	// 		client.broadcast.emit('typing', {name, isTyping});
	// 	}
}

