import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { ProfessionalProfile } from './professional-profile.entity';

@Entity()
export class AvailabilitySlot {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  professionalId: string;

  @Column()
  startAt: Date;

  @Column()
  endAt: Date;

  @ManyToOne(() => ProfessionalProfile, (professional) => professional.availability, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'professionalId' })
  professional: ProfessionalProfile;

  @CreateDateColumn()
  createdAt: Date;
}