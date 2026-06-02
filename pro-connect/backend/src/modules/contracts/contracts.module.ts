import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContractsController } from './contracts.controller';
import { ReservationsController } from './reservations.controller';
import { ContractsService } from './contracts.service';
import { Contract } from './entities/contract.entity';
import { ProfessionalProfile } from '../professionals/entities/professional-profile.entity';
import { Service } from '../services/entities/service.entity';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [TypeOrmModule.forFeature([Contract, ProfessionalProfile, Service]), NotificationsModule],
  controllers: [ContractsController, ReservationsController],
  providers: [ContractsService],
  exports: [ContractsService],
})
export class ContractsModule {}
