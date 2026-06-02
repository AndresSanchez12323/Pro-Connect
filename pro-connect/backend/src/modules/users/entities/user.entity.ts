import { Column, CreateDateColumn, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ProfessionalProfile } from '../../professionals/entities/professional-profile.entity';
import { Contract } from '../../contracts/entities/contract.entity';
import { ChatMessage } from '../../chat/entities/chat.entity';
import { Notification } from '../../notifications/entities/notification.entity';

export enum Role {
  USER = 'USER',
  PROFESSIONAL = 'PROFESSIONAL',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fullName: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'text' })
  passwordHash: string;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;

  @Column({ type: 'text', nullable: true })
  phone: string | null;

  @Column({ type: 'text', nullable: true })
  location: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => ProfessionalProfile, (profile) => profile.user)
  professionalProfile: ProfessionalProfile;

  @OneToMany(() => Contract, (contract) => contract.client)
  contractsAsClient: Contract[];

  @OneToMany(() => ChatMessage, (message) => message.sender)
  messages: ChatMessage[];

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];
}
