import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationType, Notification, ProfessionalProfile } from './entities';
import { DomainEventBus } from './domain-event-bus.service';
import { notificationChannelFromMode } from './patterns/reservation.factory';

@Injectable()
export class ProConnectObserver implements OnModuleInit {
  constructor(
    private readonly bus: DomainEventBus,
    @InjectRepository(Notification) private readonly notificationRepository: Repository<Notification>,
    @InjectRepository(ProfessionalProfile) private readonly professionalRepository: Repository<ProfessionalProfile>,
  ) {}

  onModuleInit(): void {
    this.bus.onReservationCreated(async ({ reservation }) => {
      const channel = notificationChannelFromMode(reservation.mode);
      await this.createReservationNotifications(
        reservation.userId,
        reservation.professionalId,
        NotificationType.RESERVATION_CREATED,
        channel,
        'Reserva creada',
        'Tu reserva fue creada exitosamente.',
      );
    });

    this.bus.onReservationUpdated(async ({ reservation }) => {
      const channel = notificationChannelFromMode(reservation.mode);
      await this.createReservationNotifications(
        reservation.userId,
        reservation.professionalId,
        NotificationType.RESERVATION_UPDATED,
        channel,
        'Reserva modificada',
        'Tu reserva cambió de fecha u hora.',
      );
    });

    this.bus.onReservationCancelled(async ({ reservation }) => {
      const channel = notificationChannelFromMode(reservation.mode);
      await this.createReservationNotifications(
        reservation.userId,
        reservation.professionalId,
        NotificationType.RESERVATION_CANCELLED,
        channel,
        'Reserva cancelada',
        'Tu reserva fue cancelada.',
      );
    });

    this.bus.onChatMessage(async ({ message, receiverUserId }) => {
      const notification = this.notificationRepository.create({
          userId: receiverUserId,
          type: NotificationType.NEW_CHAT_MESSAGE,
          channel: 'IN_APP',
          title: 'Nuevo mensaje',
          message: 'Tienes un nuevo mensaje en tu chat.',
      });
      await this.notificationRepository.save(notification);
    });
  }

  private async createReservationNotifications(
    userId: string,
    professionalId: string,
    type: NotificationType,
    channel: string,
    title: string,
    message: string,
  ): Promise<void> {
    const professional = await this.professionalRepository.findOneBy({ id: professionalId });
    if (!professional) return;

    const notifUser = this.notificationRepository.create({ userId, type, channel, title, message });
    const notifPro = this.notificationRepository.create({ userId: professional.userId, type, channel, title, message });
    
    await this.notificationRepository.save([notifUser, notifPro]);
  }
}
