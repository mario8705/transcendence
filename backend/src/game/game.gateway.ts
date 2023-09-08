import { SubscribeMessage, WebSocketGateway, WsResponse } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@WebSocketGateway()
export class GameGateway {
  @SubscribeMessage('client.ping')
  onPing(client: Socket): WsResponse<{ message: string }>
  {
    return {
      event: 'server.pong',
      data: {
        message: 'pong'
      }
    }
  }
}
