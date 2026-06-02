import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ProfessionalProfile } from '../../professionals/entities/professional-profile.entity';

@Entity()
export class Service {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  professionalId: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'int', default: 3 })
  deliveryDays: number;

  @ManyToOne(() => ProfessionalProfile, (professional) => professional.services, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'professionalId' })
  professional: ProfessionalProfile;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
