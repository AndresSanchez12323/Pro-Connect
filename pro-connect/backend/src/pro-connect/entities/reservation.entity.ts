import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import { ServiceMode, ReservationStatus } from './enums';
import { User } from './user.entity';
import { ProfessionalProfile } from './professional-profile.entity';
import { Service } from './service.entity';

@Entity()
@Index(['professionalId', 'scheduledAt'])
export class Reservation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'uuid' })
  professionalId: string;

  @Column({ type: 'uuid' })
  serviceId: string;

  @Column({ type: 'enum', enum: ServiceMode })
  mode: ServiceMode;

  @Column()
  scheduledAt: Date;

  @Column({ type: 'enum', enum: ReservationStatus, default: ReservationStatus.PENDING })
  status: ReservationStatus;

  @Column({ nullable: true })
  onlineLink: string;

  @Column({ nullable: true })
  travelAddress: string;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  travelCost: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  proposedPrice: number | null;

  @Column({ type: 'text', nullable: true })
  negotiationMessage: string | null;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  counterOfferPrice: number | null;

  @Column({ type: 'text', nullable: true })
  counterOfferMessage: string | null;

  @ManyToOne(() => User, (user) => user.reservationsAsUser, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => ProfessionalProfile, (professional) => professional.reservations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'professionalId' })
  professional: ProfessionalProfile;

  @ManyToOne(() => Service, (service) => service.reservations, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'serviceId' })
  service: Service;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}