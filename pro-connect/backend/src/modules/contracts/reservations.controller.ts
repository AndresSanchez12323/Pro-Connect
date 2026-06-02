import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { RequestUser } from '../../common/types/request-user';
import { ContractsService } from './contracts.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { RespondReservationDto } from './dto/respond-reservation.dto';

@Controller('reservations')
@UseGuards(JwtAuthGuard)
export class ReservationsController {
  constructor(private readonly contractsService: ContractsService) {}

  @Get('mine')
  listMine(@CurrentUser() user: RequestUser) {
    return this.contractsService.listReservationsForUser(user.id);
  }

  @Post()
  create(@CurrentUser() user: RequestUser, @Body() dto: CreateReservationDto) {
    return this.contractsService.createFromReservation(user.id, dto);
  }

  @Patch(':reservationId/respond')
  respond(@CurrentUser() user: RequestUser, @Param('reservationId') reservationId: string, @Body() dto: RespondReservationDto) {
    return this.contractsService.respondToReservation(user.id, reservationId, dto);
  }

  @Patch(':reservationId/accept-counter')
  acceptCounter(@CurrentUser() user: RequestUser, @Param('reservationId') reservationId: string) {
    return this.contractsService.acceptReservationChanges(user.id, reservationId);
  }

  @Patch(':reservationId/cancel')
  cancel(@CurrentUser() user: RequestUser, @Param('reservationId') reservationId: string) {
    return this.contractsService.cancel(user.id, reservationId);
  }
}
