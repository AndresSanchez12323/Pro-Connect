import { Injectable } from '@nestjs/common';
import { EventEmitter } from 'events';
import { ChatMessage, Reservation } from './entities';

export interface ReservationEventPayload {
  reservation: Reservation;
  actorUserId: string;
}

export interface ChatMessageEventPayload {
  message: ChatMessage;
  reservationId: string;
  receiverUserId: string;
}

@Injectable()
export class DomainEventBus {
  private readonly emitter = new EventEmitter();

  emitReservationCreated(payload: ReservationEventPayload): void {
    this.emitter.emit('reservation.created', payload);
  }

  emitReservationUpdated(payload: ReservationEventPayload): void {
    this.emitter.emit('reservation.updated', payload);
  }

  emitReservationCancelled(payload: ReservationEventPayload): void {
    this.emitter.emit('reservation.cancelled', payload);
  }

  emitChatMessage(payload: ChatMessageEventPayload): void {
    this.emitter.emit('message.created', payload);
  }

  onReservationCreated(callback: (payload: ReservationEventPayload) => void): void {
    this.emitter.on('reservation.created', callback);
  }

  onReservationUpdated(callback: (payload: ReservationEventPayload) => void): void {
    this.emitter.on('reservation.updated', callback);
  }

  onReservationCancelled(callback: (payload: ReservationEventPayload) => void): void {
    this.emitter.on('reservation.cancelled', callback);
  }

  onChatMessage(callback: (payload: ChatMessageEventPayload) => void): void {
    this.emitter.on('message.created', callback);
  }
}
