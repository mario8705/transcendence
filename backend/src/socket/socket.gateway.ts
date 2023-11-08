import { Server, Socket } from "socket.io";
import {
	MessageBody,
	OnGatewayConnection,
	OnGatewayDisconnect,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
	ConnectedSocket
} from "@nestjs/websockets";
import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { ChatService } from "src/chat/chat.service";

@WebSocketGateway({
	cors: {
		origin: 'http://localhost:5173',
	}, 
	// transports: ["websocket"],
})
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {

	@WebSocketServer()
	server: Server;

	constructor(
		@Inject(forwardRef(() => ChatService))
		private readonly chatService: ChatService
		) {}

	async handleConnection(client: Socket, ...args: any[]) {
		console.log(`Client connected: ${client.id}`);
		//TODO rajouter socket pour chaque user, utiliser le token, trouver le moyen de le passe dans le header
		client.join('server');
	}

	async handleDisconnect(client: Socket) {
		console.log(`Client disconnected: ${client.id}`);
	}

	@SubscribeMessage('user')
	chatUser(
		@MessageBody('') data : string,
		@ConnectedSocket()  client:Socket
		) :void  {
		this.chatService.chatUser(client, data);
	}

	@SubscribeMessage('message')
	// @UseGuards(AuthGuard)
	chatMessage(
		@MessageBody('') data: {type: string, to: string, message: string, options: string},
		@ConnectedSocket() client : Socket
	) {
		this.chatService.chatMessage(client, data);
	}

	@SubscribeMessage('handshake')
	// @UseGuards(AuthGuard)
	chatHandshake(
		@ConnectedSocket()  client:Socket
	) {
		console.log("Received Handshake");
		return {}
	}

	@SubscribeMessage('room')
	// @UseGuards(AuthGuard)
	chatRoom(
		@MessageBody('') data : {type: string, roomname: string, option: any},
		@ConnectedSocket()  client:Socket
	) {
		this.chatService.chatRoom(client, data);
	}

	@SubscribeMessage('friend')
	// @UseGuards(AuthGuard)
	chatFriend(
		@MessageBody('') data: {type: string, target: string, options: string},
		@ConnectedSocket() client: Socket
	) {
		this.chatService.chatFriend(client, data);
	}

	sendToClient = (clientId: string, type: string, data: any) => {
		this.server.to(clientId).emit(type, data);
	}

	@SubscribeMessage('reset')
	resetAll(
		@ConnectedSocket() client: Socket
	) {
			this.chatService.resetAll(client);
	}

}