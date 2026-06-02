import { Body, Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { RequestUser } from '../../common/types/request-user';
import { ProfessionalsService } from './professionals.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('professionals')
export class ProfessionalsController {
  constructor(private readonly professionalsService: ProfessionalsService) {}

  @Get('search')
  search(@Query('q') query?: string, @Query('specialty') specialty?: string) {
    return this.professionalsService.list(query ?? specialty);
  }

  @Get()
  list(@Query('q') query?: string) {
    return this.professionalsService.list(query);
  }

  @Get(':profileId/services')
  listServices(@Param('profileId') profileId: string) {
    return this.professionalsService.listServices(profileId);
  }

  @Get(':profileId')
  getById(@Param('profileId') profileId: string) {
    return this.professionalsService.findById(profileId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  updateMe(@CurrentUser() user: RequestUser, @Body() dto: UpdateProfileDto) {
    return this.professionalsService.updateProfile(user.id, dto);
  }
}
