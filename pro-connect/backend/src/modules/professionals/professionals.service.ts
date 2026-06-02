import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { ProfessionalProfile } from './entities/professional-profile.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfessionalsService {
  constructor(
    @InjectRepository(ProfessionalProfile)
    private readonly professionalsRepository: Repository<ProfessionalProfile>,
  ) {}

  async list(query?: string) {
    const where = query
      ? [
          { headline: Like(`%${query}%`) },
          { bio: Like(`%${query}%`) },
          { specialty: Like(`%${query}%`) },
        ]
      : undefined;

    return this.professionalsRepository.find({
      where,
      relations: { user: true, services: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findById(profileId: string) {
    const profile = await this.professionalsRepository.findOne({
      where: { id: profileId },
      relations: { user: true, services: true },
    });
    if (!profile) {
      throw new NotFoundException('Perfil profesional no encontrado.');
    }
    return profile;
  }

  async listServices(profileId: string) {
    const profile = await this.findById(profileId);
    return profile.services ?? [];
  }

  async findByUserId(userId: string) {
    const profile = await this.professionalsRepository.findOne({ where: { userId } });
    if (!profile) {
      throw new NotFoundException('Perfil profesional no encontrado.');
    }
    return profile;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const profile = await this.findByUserId(userId);
    if (dto.headline !== undefined) profile.headline = dto.headline;
    if (dto.bio !== undefined) profile.bio = dto.bio;
    if (dto.portfolioUrl !== undefined) profile.portfolioUrl = dto.portfolioUrl;
    return this.professionalsRepository.save(profile);
  }
}
