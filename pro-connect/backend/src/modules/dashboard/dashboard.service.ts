import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { Contract, ContractStatus } from '../contracts/entities/contract.entity';
import { Notification } from '../notifications/entities/notification.entity';
import { ProfessionalProfile } from '../professionals/entities/professional-profile.entity';
import { Service } from '../services/entities/service.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Contract) private readonly contractsRepository: Repository<Contract>,
    @InjectRepository(Notification) private readonly notificationsRepository: Repository<Notification>,
    @InjectRepository(ProfessionalProfile) private readonly professionalsRepository: Repository<ProfessionalProfile>,
    @InjectRepository(Service) private readonly servicesRepository: Repository<Service>,
  ) {}

  async clientSummary(userId: string) {
    const [contractsCount, unreadNotifications, recentContracts] = await Promise.all([
      this.contractsRepository.count({ where: { clientId: userId } }),
      this.notificationsRepository.count({ where: { userId, readAt: IsNull() } }),
      this.contractsRepository.find({
        where: { clientId: userId },
        relations: { service: true, professional: { user: true } },
        order: { createdAt: 'DESC' },
        take: 5,
      }),
    ]);

    return {
      contractsCount,
      unreadNotifications,
      recentReservations: recentContracts.map((contract) => ({
        id: contract.id,
        status: contract.status,
        scheduledAt: contract.scheduledAt,
        serviceName: contract.service?.title ?? 'Servicio HTML/CSS',
        professionalName: contract.professional?.user?.fullName ?? 'Profesional',
      })),
    };
  }

  async professionalSummary(userId: string) {
    const profile = await this.professionalsRepository.findOne({ where: { userId } });
    if (!profile) {
      throw new NotFoundException('Perfil profesional no encontrado.');
    }

    const [servicesCount, unreadNotifications, activeJobs, recentJobs, acceptedContracts] = await Promise.all([
      this.servicesRepository.count({ where: { professionalId: profile.id } }),
      this.notificationsRepository.count({ where: { userId, readAt: IsNull() } }),
      this.contractsRepository.count({
        where: {
          professionalId: profile.id,
          status: Not(ContractStatus.CANCELLED),
        },
      }),
      this.contractsRepository.find({
        where: { professionalId: profile.id },
        relations: { service: true, client: true },
        order: { createdAt: 'DESC' },
        take: 5,
      }),
      this.contractsRepository.find({
        where: [{ professionalId: profile.id, status: ContractStatus.ACCEPTED }, { professionalId: profile.id, status: ContractStatus.SIGNED }],
      }),
    ]);

    return {
      servicesCount,
      activeJobs,
      unreadNotifications,
      estimatedRevenue: acceptedContracts.reduce((sum, contract) => sum + Number(contract.price), 0),
      recentJobs: recentJobs.map((contract) => ({
        id: contract.id,
        status: contract.status,
        scheduledAt: contract.scheduledAt,
        clientName: contract.client?.fullName ?? 'Cliente',
        serviceName: contract.service?.title ?? 'Servicio HTML/CSS',
      })),
    };
  }
}
