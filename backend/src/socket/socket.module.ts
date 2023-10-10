import { Module } from "@nestjs/common";
import { SocketGateway } from "./socket.gateway";
import { GameService } from "src/game/game.service";

@Module({
	imports: [GameService],
	providers: [SocketGateway]
})
export class SocketModule {}
