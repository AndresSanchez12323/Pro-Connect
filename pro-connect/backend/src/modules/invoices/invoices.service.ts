import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contract, ContractStatus } from '../contracts/entities/contract.entity';
import { Invoice } from './entities/invoice.entity';

const INVOICEABLE_STATUSES = [ContractStatus.ACCEPTED, ContractStatus.SIGNED, ContractStatus.COMPLETED];

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoice) private readonly invoicesRepository: Repository<Invoice>,
    @InjectRepository(Contract) private readonly contractsRepository: Repository<Contract>,
  ) {}

  async listForUser(userId: string) {
    return this.invoicesRepository.find({
      where: [{ clientId: userId }, { reservation: { professional: { userId } } }],
      relations: { reservation: { service: true, professional: { user: true }, client: true } },
      order: { issuedAt: 'DESC' },
    });
  }

  async generate(userId: string, reservationId: string) {
    const contract = await this.contractsRepository.findOne({
      where: { id: reservationId },
      relations: { service: true, professional: { user: true }, client: true },
    });

    if (!contract) {
      throw new NotFoundException('Contrato no encontrado.');
    }

    if (contract.clientId !== userId && contract.professional?.userId !== userId) {
      throw new ForbiddenException('No autorizado para facturar este contrato.');
    }

    if (!INVOICEABLE_STATUSES.includes(contract.status)) {
      throw new ForbiddenException('Solo puedes facturar contratos aceptados, firmados o completados.');
    }

    const existing = await this.invoicesRepository.findOne({
      where: { reservationId: contract.id },
      relations: { reservation: { service: true, professional: { user: true }, client: true } },
    });
    if (existing) {
      return existing;
    }

    const invoice = this.invoicesRepository.create({
      reservationId: contract.id,
      clientId: contract.clientId,
      professionalId: contract.professionalId,
      total: Number(contract.price),
    });

    const saved = await this.invoicesRepository.save(invoice);
    return this.invoicesRepository.findOne({
      where: { id: saved.id },
      relations: { reservation: { service: true, professional: { user: true }, client: true } },
    });
  }
}
