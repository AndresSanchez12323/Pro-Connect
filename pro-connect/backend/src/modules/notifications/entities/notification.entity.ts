import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum NotificationType {
  CONTRACT_CREATED = 'CONTRACT_CREATED',
  CONTRACT_UPDATED = 'CONTRACT_UPDATED',
  CONTRACT_RESPONSE = 'CONTRACT_RESPONSE',
  CHAT_MESSAGE = 'CHAT_MESSAGE',
}

@Entity()
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'enum', enum: NotificationType })
  type: NotificationType;

  @Column()
  title: string;

  @Column()
  message: string;

  @Column({ type: 'timestamp', nullable: true })
  readAt: Date | null;

  @ManyToOne(() => User, (user) => user.notifications, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}
