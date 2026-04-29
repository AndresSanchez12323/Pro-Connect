import { Entity, PrimaryColumn, Column, OneToOne, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { Service } from './service.entity';
import { AvailabilitySlot } from './availability-slot.entity';
import { Reservation } from './reservation.entity';
import { Review } from './review.entity';

@Entity()
export class ProfessionalProfile {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ unique: true })
  userId: string;

  @OneToOne(() => User, (user) => user.professionalProfile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  specialty: string;

  @Column('int')
  experience: number;

  @Column('text')
  description: string;

  @Column()
  contactInfo: string;

  @OneToMany(() => Service, (service) => service.professional)
  services: Service[];

  @OneToMany(() => AvailabilitySlot, (slot) => slot.professional)
  availability: AvailabilitySlot[];

  @OneToMany(() => Reservation, (reservation) => reservation.professional)
  reservations: Reservation[];

  @OneToMany(() => Review, (review) => review.professional)
  reviews: Review[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}