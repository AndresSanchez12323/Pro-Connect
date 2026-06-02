import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfessionalProfile } from './entities/professional-profile.entity';
import { ProfessionalsController } from './professionals.controller';
import { ProfessionalsService } from './professionals.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProfessionalProfile])],
  controllers: [ProfessionalsController],
  providers: [ProfessionalsService],
  exports: [ProfessionalsService],
})
export class ProfessionalsModule {}
