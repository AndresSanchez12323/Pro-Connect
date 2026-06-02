import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly usersRepository: Repository<User>) {}

  async findById(userId: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado.');
    }
    return user;
  }

  async updateMe(userId: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.findById(userId);
    if (dto.fullName !== undefined) user.fullName = dto.fullName;
    if (dto.phone !== undefined) user.phone = dto.phone;
    if (dto.location !== undefined) user.location = dto.location;
    return this.usersRepository.save(user);
  }
}
