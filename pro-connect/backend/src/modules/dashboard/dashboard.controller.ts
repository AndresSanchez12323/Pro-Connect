import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { RequestUser } from '../../common/types/request-user';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('client/summary')
  clientSummary(@CurrentUser() user: RequestUser) {
    return this.dashboardService.clientSummary(user.id);
  }

  @Get('professional/summary')
  professionalSummary(@CurrentUser() user: RequestUser) {
    return this.dashboardService.professionalSummary(user.id);
  }
}
