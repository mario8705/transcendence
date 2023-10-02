import { Server, Socket } from "socket.io";
import {
	OnGatewayConnection,
	OnGatewayDisconnect,
	WebSocketGateway,
	WebSocketServer
} from "@nestjs/websockets";
import { Injectable } from "@nestjs/common";

@Injectable()
@WebSocketGateway({
	cors: {
		origin: ["http://localhost:5173"],
	},
	transports: ["websocket"],
})
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {

	@WebSocketServer()
	server: Server;

	async handleConnection(client: Socket, ...args: any[]) {
		console.log(`Client connected: ${client.id}`);
	}

	async handleDisconnect(client: Socket) {
		console.log(`Client disconnected: ${client.id}`);
	}
}
