import { Entity, PrimaryGeneratedColumn, Column, OneToOne, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Reservation } from './reservation.entity';
import { ProfessionalProfile } from './professional-profile.entity';

@Entity()
export class Invoice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  reservationId: string;

  @Column()
  professionalId: string;

  @Column('decimal', { precision: 10, scale: 2 })
  total: number;

  @CreateDateColumn()
  issuedAt: Date;

  @OneToOne(() => Reservation)
  @JoinColumn({ name: 'reservationId' })
  reservation: Reservation;

  @ManyToOne(() => ProfessionalProfile)
  @JoinColumn({ name: 'professionalId' })
  professional: ProfessionalProfile;
}