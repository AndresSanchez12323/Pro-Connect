import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { RequestUser } from '../../common/types/request-user';
import { ContractsService } from './contracts.service';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { RespondContractDto } from './dto/respond-contract.dto';
import { SignContractDto } from './dto/sign-contract.dto';

@Controller('contracts')
@UseGuards(JwtAuthGuard)
export class ContractsController {
  constructor(private readonly contractsService: ContractsService) {}

  @Get()
  list(@CurrentUser() user: RequestUser) {
    return this.contractsService.listForUser(user.id);
  }

  @Get(':contractId')
  get(@CurrentUser() user: RequestUser, @Param('contractId') contractId: string) {
    return this.contractsService.getById(user.id, contractId);
  }

  @Post()
  create(@CurrentUser() user: RequestUser, @Body() dto: CreateContractDto) {
    return this.contractsService.create(user.id, dto);
  }

  @Patch(':contractId')
  update(@CurrentUser() user: RequestUser, @Param('contractId') contractId: string, @Body() dto: UpdateContractDto) {
    return this.contractsService.update(user.id, contractId, dto);
  }

  @Patch(':contractId/respond')
  respond(@CurrentUser() user: RequestUser, @Param('contractId') contractId: string, @Body() dto: RespondContractDto) {
    return this.contractsService.respond(user.id, contractId, dto);
  }

  @Patch(':contractId/sign')
  sign(@CurrentUser() user: RequestUser, @Param('contractId') contractId: string, @Body() dto: SignContractDto) {
    return this.contractsService.sign(user.id, user.role, contractId, dto);
  }

  @Patch(':contractId/cancel')
  cancel(@CurrentUser() user: RequestUser, @Param('contractId') contractId: string) {
    return this.contractsService.cancel(user.id, contractId);
  }
}
