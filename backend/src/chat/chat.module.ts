import { Module } from '@nestjs/common';
import { SocketModule } from 'src/socket/socket.module';
import { ChatService } from './DBchat.service';
import { RoomsModule } from '../rooms/rooms.module';
import { UsersModule } from 'src/users_chat/users.module';
import { ChatController } from './chat.controller';
import { MessagesModule } from 'src/messages/messages.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
	providers: [ChatService],
	imports: [RoomsModule, MessagesModule, UsersModule, PrismaModule], //socketGateway
	controllers: [ChatController],
	exports: [ChatService]
})
export class ChatModule {}
