import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contract, ContractStatus } from './entities/contract.entity';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { RespondContractDto } from './dto/respond-contract.dto';
import { SignContractDto } from './dto/sign-contract.dto';
import { ProfessionalProfile } from '../professionals/entities/professional-profile.entity';
import { Service } from '../services/entities/service.entity';
import { Role } from '../users/entities/user.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType } from '../notifications/entities/notification.entity';

@Injectable()
export class ContractsService {
  constructor(
    @InjectRepository(Contract) private readonly contractsRepository: Repository<Contract>,
    @InjectRepository(ProfessionalProfile)
    private readonly professionalsRepository: Repository<ProfessionalProfile>,
    @InjectRepository(Service) private readonly servicesRepository: Repository<Service>,
    private readonly notificationsService: NotificationsService,
  ) {}

  async listForUser(userId: string) {
    return this.contractsRepository.find({
      where: [{ clientId: userId }, { professional: { userId } }],
      relations: { service: true, professional: { user: true }, client: true },
      order: { createdAt: 'DESC' },
    });
  }

  async getById(userId: string, contractId: string) {
    const contract = await this.contractsRepository.findOne({
      where: { id: contractId },
      relations: { service: true, professional: { user: true }, client: true },
    });
    if (!contract) {
      throw new NotFoundException('Contrato no encontrado.');
    }

    if (contract.clientId !== userId && contract.professional?.userId !== userId) {
      throw new ForbiddenException('No autorizado para ver este contrato.');
    }
    return contract;
  }

  async create(userId: string, dto: CreateContractDto) {
    const professional = await this.professionalsRepository.findOne({ where: { id: dto.professionalId } });
    if (!professional) {
      throw new NotFoundException('Profesional no encontrado.');
    }

    const service = await this.servicesRepository.findOne({ where: { id: dto.serviceId } });
    if (!service || service.professionalId !== professional.id) {
      throw new NotFoundException('Servicio no encontrado para este profesional.');
    }

    const contract = this.contractsRepository.create({
      clientId: userId,
      professionalId: professional.id,
      serviceId: service.id,
      scheduledAt: new Date(dto.scheduledAt),
      status: ContractStatus.SENT,
      price: dto.price,
      terms: dto.terms,
      changesNote: null,
    });

    const saved = await this.contractsRepository.save(contract);

    await this.notificationsService.notify(
      professional.userId,
      NotificationType.CONTRACT_CREATED,
      'Nuevo contrato recibido',
      'Tienes una nueva solicitud de contrato para revisar.',
    );

    return saved;
  }

  async update(userId: string, contractId: string, dto: UpdateContractDto) {
    const contract = await this.getById(userId, contractId);

    if ([ContractStatus.REJECTED, ContractStatus.CANCELLED, ContractStatus.COMPLETED].includes(contract.status)) {
      throw new ForbiddenException('No puedes modificar un contrato cerrado.');
    }

    if (dto.scheduledAt !== undefined) contract.scheduledAt = new Date(dto.scheduledAt);
    if (dto.price !== undefined) contract.price = dto.price;
    if (dto.terms !== undefined) contract.terms = dto.terms;
    if (dto.changesNote !== undefined) contract.changesNote = dto.changesNote;

    contract.status = ContractStatus.CHANGES_REQUESTED;

    const updated = await this.contractsRepository.save(contract);
    const receiverUserId = contract.clientId === userId ? contract.professional.userId : contract.clientId;

    await this.notificationsService.notify(
      receiverUserId,
      NotificationType.CONTRACT_UPDATED,
      'Contrato actualizado',
      'Hay cambios nuevos en el contrato. Revisa los detalles.',
    );

    return updated;
  }

  async respond(userId: string, contractId: string, dto: RespondContractDto) {
    const contract = await this.getById(userId, contractId);

    if (contract.professional.userId !== userId) {
      throw new ForbiddenException('Solo el profesional puede responder el contrato.');
    }

    if (dto.action === 'ACCEPT') {
      contract.status = ContractStatus.ACCEPTED;
      contract.changesNote = null;
    }
    if (dto.action === 'REJECT') {
      contract.status = ContractStatus.REJECTED;
    }
    if (dto.action === 'CHANGES') {
      contract.status = ContractStatus.CHANGES_REQUESTED;
      contract.changesNote = dto.changesNote ?? null;
    }

    const updated = await this.contractsRepository.save(contract);

    await this.notificationsService.notify(
      contract.clientId,
      NotificationType.CONTRACT_RESPONSE,
      'Respuesta del profesional',
      'El profesional ha respondido a tu contrato.',
    );

    return updated;
  }

  async sign(userId: string, role: Role, contractId: string, dto: SignContractDto) {
    const contract = await this.getById(userId, contractId);

    if (contract.status !== ContractStatus.ACCEPTED && contract.status !== ContractStatus.SIGNED) {
      throw new ForbiddenException('Solo puedes firmar contratos aceptados.');
    }

    if (role === Role.USER) {
      if (contract.clientId !== userId) {
        throw new ForbiddenException('No autorizado para firmar este contrato.');
      }
      contract.clientSignature = dto.signature;
    } else {
      if (contract.professional.userId !== userId) {
        throw new ForbiddenException('No autorizado para firmar este contrato.');
      }
      contract.professionalSignature = dto.signature;
    }

    if (contract.clientSignature && contract.professionalSignature) {
      contract.status = ContractStatus.SIGNED;
      contract.signedAt = new Date();
    }

    const updated = await this.contractsRepository.save(contract);

    const receiverUserId = contract.clientId === userId ? contract.professional.userId : contract.clientId;
    await this.notificationsService.notify(
      receiverUserId,
      NotificationType.CONTRACT_UPDATED,
      'Contrato firmado',
      'Hay una nueva firma en el contrato.',
    );

    return updated;
  }

  async cancel(userId: string, contractId: string) {
    const contract = await this.getById(userId, contractId);
    contract.status = ContractStatus.CANCELLED;
    const updated = await this.contractsRepository.save(contract);

    const receiverUserId = contract.clientId === userId ? contract.professional.userId : contract.clientId;
    await this.notificationsService.notify(
      receiverUserId,
      NotificationType.CONTRACT_UPDATED,
      'Contrato cancelado',
      'El contrato fue cancelado.',
    );

    return updated;
  }
}
