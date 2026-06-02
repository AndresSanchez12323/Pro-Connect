import { Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { RequestUser } from '../../common/types/request-user';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('mine')
  listMine(@CurrentUser() user: RequestUser) {
    return this.notificationsService.list(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  list(@CurrentUser() user: RequestUser) {
    return this.notificationsService.list(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':notificationId/read')
  markRead(@CurrentUser() user: RequestUser, @Param('notificationId') notificationId: string) {
    return this.notificationsService.markRead(user.id, notificationId);
  }
}
