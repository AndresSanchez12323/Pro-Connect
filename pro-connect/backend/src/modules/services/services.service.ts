import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from './entities/service.entity';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ProfessionalProfile } from '../professionals/entities/professional-profile.entity';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service) private readonly servicesRepository: Repository<Service>,
    @InjectRepository(ProfessionalProfile)
    private readonly professionalsRepository: Repository<ProfessionalProfile>,
  ) {}

  async listByProfessional(profileId: string) {
    return this.servicesRepository.find({ where: { professionalId: profileId }, order: { createdAt: 'DESC' } });
  }

  async getById(serviceId: string) {
    const service = await this.servicesRepository.findOne({ where: { id: serviceId } });
    if (!service) {
      throw new NotFoundException('Servicio no encontrado.');
    }
    return service;
  }

  async create(userId: string, dto: CreateServiceDto) {
    const profile = await this.professionalsRepository.findOne({ where: { userId } });
    if (!profile) {
      throw new ForbiddenException('Solo profesionales pueden crear servicios.');
    }

    const service = this.servicesRepository.create({
      professionalId: profile.id,
      title: dto.title,
      description: dto.description,
      price: dto.price,
      deliveryDays: dto.deliveryDays,
    });

    return this.servicesRepository.save(service);
  }

  async update(userId: string, serviceId: string, dto: UpdateServiceDto) {
    const profile = await this.professionalsRepository.findOne({ where: { userId } });
    if (!profile) {
      throw new ForbiddenException('Solo profesionales pueden actualizar servicios.');
    }

    const service = await this.getById(serviceId);
    if (service.professionalId !== profile.id) {
      throw new ForbiddenException('No autorizado para modificar este servicio.');
    }

    if (dto.title !== undefined) service.title = dto.title;
    if (dto.description !== undefined) service.description = dto.description;
    if (dto.price !== undefined) service.price = dto.price;
    if (dto.deliveryDays !== undefined) service.deliveryDays = dto.deliveryDays;

    return this.servicesRepository.save(service);
  }

  async remove(userId: string, serviceId: string) {
    const profile = await this.professionalsRepository.findOne({ where: { userId } });
    if (!profile) {
      throw new ForbiddenException('Solo profesionales pueden eliminar servicios.');
    }

    const service = await this.getById(serviceId);
    if (service.professionalId !== profile.id) {
      throw new ForbiddenException('No autorizado para eliminar este servicio.');
    }

    await this.servicesRepository.remove(service);
    return { ok: true };
  }
}
