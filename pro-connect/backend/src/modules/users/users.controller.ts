import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { RequestUser } from '../../common/types/request-user';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@CurrentUser() user: RequestUser) {
    return this.usersService.findById(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  async updateMe(@CurrentUser() user: RequestUser, @Body() dto: UpdateUserDto) {
    return this.usersService.updateMe(user.id, dto);
  }
}
