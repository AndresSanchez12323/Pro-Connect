import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contract } from '../contracts/entities/contract.entity';
import { ProfessionalProfile } from '../professionals/entities/professional-profile.entity';
import { Review } from './entities/review.entity';
import { ReputationController } from './reputation.controller';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';

@Module({
  imports: [TypeOrmModule.forFeature([Review, ProfessionalProfile, Contract])],
  controllers: [ReviewsController, ReputationController],
  providers: [ReviewsService],
})
export class ReviewsModule {}
