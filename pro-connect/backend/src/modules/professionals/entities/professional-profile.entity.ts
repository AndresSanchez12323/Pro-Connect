import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Service } from '../../services/entities/service.entity';
import { Contract } from '../../contracts/entities/contract.entity';

@Entity()
export class ProfessionalProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  userId: string;

  @OneToOne(() => User, (user) => user.professionalProfile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ default: 'HTML/CSS' })
  specialty: string;

  @Column({ type: 'text' })
  headline: string;

  @Column({ type: 'text' })
  bio: string;

  @Column({ type: 'text', nullable: true })
  portfolioUrl: string | null;

  @OneToMany(() => Service, (service) => service.professional)
  services: Service[];

  @OneToMany(() => Contract, (contract) => contract.professional)
  contracts: Contract[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
