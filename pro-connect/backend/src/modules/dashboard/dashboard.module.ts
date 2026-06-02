import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contract } from '../contracts/entities/contract.entity';
import { Notification } from '../notifications/entities/notification.entity';
import { ProfessionalProfile } from '../professionals/entities/professional-profile.entity';
import { Service } from '../services/entities/service.entity';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
  imports: [TypeOrmModule.forFeature([Contract, Notification, ProfessionalProfile, Service])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
