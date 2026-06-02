import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ProfessionalProfile } from '../../professionals/entities/professional-profile.entity';
import { Service } from '../../services/entities/service.entity';

export enum ContractStatus {
  DRAFT = 'DRAFT',
  SENT = 'SENT',
  CHANGES_REQUESTED = 'CHANGES_REQUESTED',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  SIGNED = 'SIGNED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

@Entity()
export class Contract {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  clientId: string;

  @Column({ type: 'uuid' })
  professionalId: string;

  @Column({ type: 'uuid' })
  serviceId: string;

  @Column({ type: 'timestamp' })
  scheduledAt: Date;

  @Column({ type: 'enum', enum: ContractStatus, default: ContractStatus.DRAFT })
  status: ContractStatus;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'text' })
  terms: string;

  @Column({ type: 'text', nullable: true })
  changesNote: string | null;

  @Column({ type: 'text', nullable: true })
  clientSignature: string | null;

  @Column({ type: 'text', nullable: true })
  professionalSignature: string | null;

  @Column({ type: 'timestamp', nullable: true })
  signedAt: Date | null;

  @ManyToOne(() => User, (user) => user.contractsAsClient, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'clientId' })
  client: User;

  @ManyToOne(() => ProfessionalProfile, (professional) => professional.contracts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'professionalId' })
  professional: ProfessionalProfile;

  @ManyToOne(() => Service, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'serviceId' })
  service: Service;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
