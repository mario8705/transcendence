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
		this.gameHandler.tick();
		console.log("Init socket Gateway")
	}

	handleConnection(client: Socket, ...args: any[]) {
		console.log(`Client connected: ${client.id}`);
	}

	handleDisconnect(client: Socket) {
		console.log(`Client disconnected: ${client.id}`);
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

	@SubscribeMessage('handshake')
	handshake(
		@ConnectedSocket() client: Socket )
	{
		console.log("Received Handshake");
		return {};
	}

}
