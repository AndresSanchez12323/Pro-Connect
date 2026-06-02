import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { RequestUser } from '../../common/types/request-user';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @UseGuards(JwtAuthGuard)
  @Get('mine')
  listMine(@CurrentUser() user: RequestUser) {
    return this.servicesService.listMine(user.id);
  }

  @Get()
  list(@Query('professionalId') professionalId?: string, @Query('q') query?: string) {
    if (!professionalId) {
      return this.servicesService.listAvailable(query);
    }
    return this.servicesService.listByProfessional(professionalId);
  }

  @Get(':serviceId')
  getById(@Param('serviceId') serviceId: string) {
    return this.servicesService.getById(serviceId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@CurrentUser() user: RequestUser, @Body() dto: CreateServiceDto) {
    return this.servicesService.create(user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':serviceId')
  update(@CurrentUser() user: RequestUser, @Param('serviceId') serviceId: string, @Body() dto: UpdateServiceDto) {
    return this.servicesService.update(user.id, serviceId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':serviceId')
  remove(@CurrentUser() user: RequestUser, @Param('serviceId') serviceId: string) {
    return this.servicesService.remove(user.id, serviceId);
  }
}
