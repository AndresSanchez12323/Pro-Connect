import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, NotificationType } from './entities/notification.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationsRepository: Repository<Notification>,
  ) {}

  async list(userId: string) {
    return this.notificationsRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: 50,
    });
  }

  async markRead(userId: string, notificationId: string) {
    const notification = await this.notificationsRepository.findOne({
      where: { id: notificationId, userId },
    });
    if (!notification) {
      throw new NotFoundException('Notificacion no encontrada.');
    }

    if (!notification.readAt) {
      notification.readAt = new Date();
      await this.notificationsRepository.save(notification);
    }

    return notification;
  }

  async notify(userId: string, type: NotificationType, title: string, message: string) {
    const notification = this.notificationsRepository.create({
      userId,
      type,
      title,
      message,
      readAt: null,
    });
    return this.notificationsRepository.save(notification);
  }
}
