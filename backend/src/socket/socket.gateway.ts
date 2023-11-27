import { Server, Socket } from "socket.io";
import {
	ConnectedSocket,
	MessageBody,
	OnGatewayConnection,
	OnGatewayDisconnect,
	OnGatewayInit,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer
} from "@nestjs/websockets";
import { GameService } from "src/game/game.service";
import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { ChatService } from "src/chat/DBchat.service";
import { User } from "src/users_chat/user.model";
import { SocketService } from "./socket.service";
import { RoomService } from "src/rooms/DBrooms.service";

@WebSocketGateway({
	cors: {
		origin: ["http://localhost:5173"],
	},
})
export class SocketGateway implements
	OnGatewayInit,
	OnGatewayConnection,
	OnGatewayDisconnect
{

	sockets: Socket[] = [];
	gameHandler: GameService;
	
	@WebSocketServer()
	server: Server;

	constructor(
		@Inject(forwardRef(() => ChatService))
		private readonly chatService: ChatService,
		private readonly socketService: SocketService,
		private readonly roomService: RoomService
		) {}

	afterInit() {
		this.gameHandler = new GameService(this.server);
		this.gameHandler.tick();
		console.log("Init socket Gateway")
	}

	async handleConnection(client: Socket, ...args: any[]) {
		console.log(`Client connected: ${client.id}`);
		//TODO rajouter socket pour chaque user, utiliser le token, trouver le moyen de le passe dans le header
		client.join('server');
		this.socketService.addSocket(token.id, client);
	}

	async handleDisconnect(client: Socket) {
		console.log(`Client disconnected: ${client.id}`);
		client.leave('server');
		this.socketService.removeSocket(token.id, client);
		
	}

	sendToClient = (userId: number, type: string, data: any) => {
		const sockets = this.socketService.getSockets(userId);
		sockets.map((sock) => {
			this.server.to(sock.id).emit('info', {type: type, msg: data});
		});
	}

	sendPrivateMessage = (userId: number, type : string, data: any) => {
		const sockets = this.socketService.getSockets(userId);
		sockets.map((sock) => {
			this.server.to(sock.id).emit('message', {type, from: data.from, to : data.to, message: data.message});
			//TODO ne pas oublier de transmettre le moment ou le message a été invoyé aussi. Genre le DTO
		});
	}

	sendChannelMessage = (userId: number, channelName: string, channelId: number, type: string, data: any) => {
	}

	// CHAT EVENTS

	@SubscribeMessage('user')
	chatUser(
		@MessageBody('') data : any, //ici il faut faire le truc de block
		@ConnectedSocket()  client:Socket
		) :void  {
		// this.chatService.chatUser(client, data);
	}

	@SubscribeMessage('message')
	// @UseGuards(AuthGuard)
	chatMessage(
		@MessageBody('') data: {curruser: any, type: string, to: string, channelId: number, message: string, options: string},
		@ConnectedSocket() client : Socket
	) {
		this.chatService.chatMessage(client, data);
	}

	// @SubscribeMessage('room')
	// // @UseGuards(AuthGuard)
	// chatRoom(
	// 	@MessageBody('') data : {type: string, roomname: string, option: any},
	// 	@ConnectedSocket()  client:Socket
	// ) {
	// 	this.chatService.chatRoom(client, data);
	// }

	// @SubscribeMessage('friend')
	// // @UseGuards(AuthGuard)
	// chatFriend(
	// 	@MessageBody('') data: {type: string, target: string, options: string},
	// 	@ConnectedSocket() client: Socket
	// ) {
	// 	this.chatService.chatFriend(client, data);
	// }

	// @SubscribeMessage('reset')
	// resetAll(
	// 	@ConnectedSocket() client: Socket
	// ) {
	// 		this.chatService.resetAll(client);
	// }

	@SubscribeMessage('handshake')
	// @UseGuards(AuthGuard)
	chatHandshake(
		@ConnectedSocket()  client:Socket
	) {
		console.log("Received Handshake");
		return {}
	}

	// GAME EVENTS

	@SubscribeMessage("joinRandomNormal")
	onRandomNormal(
		@ConnectedSocket() socket: Socket)
	{
		this.gameHandler.joinRandomMatch(socket, 0);
	}
	
	@SubscribeMessage("joinRandomSpecial")
	onRandomSpecial(
		@ConnectedSocket() socket: Socket)
	{
			this.gameHandler.joinRandomMatch(socket, 1);
	}

	@SubscribeMessage('cancelGameSearch')
	onCancelSearch(
		@ConnectedSocket() socket: Socket)
	{
		this.gameHandler.removeFromGame(socket);
	}

	@SubscribeMessage("keyUp")
	onKeyUp(
		@ConnectedSocket() socket: Socket,
		@MessageBody() key: string)
	{
		this.gameHandler.keyUp(socket.id, key);
	}

	@SubscribeMessage("keyDown")
	onKeyDown(
		@ConnectedSocket() socket: Socket,
		@MessageBody() key: string)
	{
		this.gameHandler.keyDown(socket.id, key);
	}

}
