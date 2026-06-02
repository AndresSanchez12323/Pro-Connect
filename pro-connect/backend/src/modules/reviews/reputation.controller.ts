import { Controller, Get, Param } from '@nestjs/common';
import { ReviewsService } from './reviews.service';

@Controller('reputation')
export class ReputationController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get(':professionalId')
  get(@Param('professionalId') professionalId: string) {
    return this.reviewsService.reputation(professionalId);
  }
}
