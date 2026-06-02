import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from './entities/service.entity';
import { ProfessionalProfile } from '../professionals/entities/professional-profile.entity';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';

@Module({
  imports: [TypeOrmModule.forFeature([Service, ProfessionalProfile])],
  controllers: [ServicesController],
  providers: [ServicesService],
})
export class ServicesModule {}
