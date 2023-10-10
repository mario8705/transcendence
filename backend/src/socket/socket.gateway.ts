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
import { Injectable } from "@nestjs/common";
import { GameService } from "src/game/game.service";

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

	afterInit() {
		this.gameHandler = new GameService(this.server);
		console.log("Init socket Gateway")
	}

	handleConnection(client: Socket, ...args: any[]) {
		console.log(`Client connected: ${client.id}`);
	}

	handleDisconnect(client: Socket) {
		console.log(`Client disconnected: ${client.id}`);
	}

	@SubscribeMessage("joinRandomMatch")
	onRandomMatch(@ConnectedSocket() socket: Socket) {
		this.gameHandler.joinRandomGame(socket);
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

	@SubscribeMessage('handshake')
	handshake(
		@ConnectedSocket() client: Socket)
	{
	  console.log("Received Handshake");
	  return {}
	//   this.server.emit('test', 'géééénial');
	//   this.server.to(client.id).emit('handshake', 'coucou');
	}
}
