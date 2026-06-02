import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { RequestUser } from '../../common/types/request-user';
import { InvoicesService } from './invoices.service';

@Controller('invoices')
@UseGuards(JwtAuthGuard)
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Get()
  list(@CurrentUser() user: RequestUser) {
    return this.invoicesService.listForUser(user.id);
  }

  @Post('generate/:reservationId')
  generate(@CurrentUser() user: RequestUser, @Param('reservationId') reservationId: string) {
    return this.invoicesService.generate(user.id, reservationId);
  }
}
