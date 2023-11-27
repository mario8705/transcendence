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
import { ChatService } from "src/chat/chat.service";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { ChatMessageEvent } from "src/events/chat/message.event";
import { GameJoinRandomEvent } from "src/events/game/joinRandom.event";
import { GameCancelSearchEvent } from "src/events/game/cancelSearch.event";
import { GameKeyUpEvent } from "src/events/game/keyUp.event";
import { GameKeyDownEvent } from "src/events/game/keyDown.event";

@Injectable()
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

	gameHandler: GameService;
	
	@WebSocketServer()
	server: Server;

	constructor(
			@Inject(forwardRef(() => ChatService))
			private readonly chatService: ChatService,
			private readonly eventEmitter: EventEmitter2
		) {}

	afterInit() {
		console.log("Init socket Gateway")
	}

	async handleConnection(client: Socket, ...args: any[]) {
		console.log(`Client connected: ${client.id}`);
		//TODO rajouter socket pour chaque user, utiliser le token, trouver le moyen de le passe dans le header
		client.join('server');
	}

	async handleDisconnect(client: Socket) {
		console.log(`Client disconnected: ${client.id}`);
	}

	sendToClient = (clientId: string, type: string, data: any) => {
		this.server.to(clientId).emit(type, data);
	}

	// CHAT EVENTS

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

	@SubscribeMessage('reset')
	resetAll(
		@ConnectedSocket() client: Socket
	) {
			this.chatService.resetAll(client);
	}

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
	onJoinRandomNormal(
		@ConnectedSocket() socket: Socket)
	{
		this.eventEmitter.emit('game.joinRandom', new GameJoinRandomEvent(socket, 0));
	}
	
	@SubscribeMessage("joinRandomSpecial")
	onRandomSpecial(
		@ConnectedSocket() socket: Socket)
	{
		this.eventEmitter.emit('game.joinRandom', new GameJoinRandomEvent(socket, 1));
	}

	@SubscribeMessage('cancelGameSearch')
	onCancelSearch(
		@ConnectedSocket() socket: Socket)
	{
		this.eventEmitter.emit('game.cancelSearch', new GameCancelSearchEvent(socket));
	}

	@SubscribeMessage("keyUp")
	onKeyUp(
		@ConnectedSocket() socket: Socket,
		@MessageBody() key: string)
	{
		this.eventEmitter.emit('game.keyUp', new GameKeyUpEvent(socket, key));
	}

	@SubscribeMessage("keyDown")
	onKeyDown(
		@ConnectedSocket() socket: Socket,
		@MessageBody() key: string)
	{
		this.eventEmitter.emit('game.keyDown', new GameKeyDownEvent(socket, key));
	}

}
