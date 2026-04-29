import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Role } from './enums';
import { ProfessionalProfile } from './professional-profile.entity';
import { Reservation } from './reservation.entity';
import { Review } from './review.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fullName: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'text', nullable: true })
  passwordHash: string | null;

  @Column({ type: 'date', nullable: true })
  birthDate: Date | null;

  @Column({ type: 'text', nullable: true, unique: true })
  nationalId: string | null;

  @Column({ type: 'text', nullable: true })
  phone: string | null;

  @Column({ type: 'text', nullable: true })
  passwordRecoveryCode: string | null;

  @Column({ type: 'timestamp', nullable: true })
  passwordRecoveryCodeExpiresAt: Date | null;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => ProfessionalProfile, (profile) => profile.user)
  professionalProfile: ProfessionalProfile;

  @OneToMany(() => Reservation, (reservation) => reservation.user)
  reservationsAsUser: Reservation[];

  @OneToMany(() => Review, (review) => review.user)
  reviewsGiven: Review[];
}