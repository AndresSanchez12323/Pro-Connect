import { Logger } from '@nestjs/common';
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatMessage } from './entities';

@WebSocketGateway({ cors: { origin: '*' } })
export class ProConnectGateway implements OnGatewayInit, OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ProConnectGateway.name);

  afterInit(): void {
    this.logger.log('WebSocket gateway ready');
  }

  handleConnection(client: Socket): void {
    this.logger.log(`Client connected: ${client.id}`);
  }

  @SubscribeMessage('joinReservationRoom')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { reservationId: string },
  ): { ok: boolean } {
    client.join(payload.reservationId);
    return { ok: true };
  }

  pushMessage(reservationId: string, message: ChatMessage): void {
    this.server.to(reservationId).emit('chatMessage', message);
  }
}
