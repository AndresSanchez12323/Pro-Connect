import { Logger } from '@nestjs/common';
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatMessage } from './entities/chat.entity';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway implements OnGatewayInit, OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ChatGateway.name);

  afterInit(): void {
    this.logger.log('Chat gateway ready');
  }

  handleConnection(client: Socket): void {
    this.logger.log(`Client connected: ${client.id}`);
  }

  @SubscribeMessage('joinContractRoom')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { contractId: string },
  ): { ok: boolean } {
    client.join(payload.contractId);
    return { ok: true };
  }

  pushMessage(contractId: string, message: ChatMessage): void {
    this.server.to(contractId).emit('chatMessage', message);
  }
}
