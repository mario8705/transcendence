import { Module } from "@nestjs/common";
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { SocketGateway } from "src/socket/socket.gateway";

@Module({
  imports: [],
  controllers: [GameController],
  providers: [GameService]
})
export class GameModule {}
