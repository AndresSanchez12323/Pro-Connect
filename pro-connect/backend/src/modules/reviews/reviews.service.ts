import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contract, ContractStatus } from '../contracts/entities/contract.entity';
import { ProfessionalProfile } from '../professionals/entities/professional-profile.entity';
import { Review } from './entities/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';

const REVIEWABLE_STATUSES = [ContractStatus.ACCEPTED, ContractStatus.SIGNED, ContractStatus.COMPLETED];

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review) private readonly reviewsRepository: Repository<Review>,
    @InjectRepository(ProfessionalProfile)
    private readonly professionalsRepository: Repository<ProfessionalProfile>,
    @InjectRepository(Contract) private readonly contractsRepository: Repository<Contract>,
  ) {}

  async create(clientId: string, dto: CreateReviewDto) {
    const professional = await this.professionalsRepository.findOne({ where: { id: dto.professionalId } });
    if (!professional) {
      throw new NotFoundException('Profesional no encontrado.');
    }

    const contract = dto.contractId
      ? await this.contractsRepository.findOne({ where: { id: dto.contractId } })
      : await this.contractsRepository.findOne({
          where: REVIEWABLE_STATUSES.map((status) => ({
            clientId,
            professionalId: dto.professionalId,
            status,
          })),
          order: { createdAt: 'DESC' },
        });

    if (!contract || contract.clientId !== clientId || contract.professionalId !== dto.professionalId) {
      throw new ForbiddenException('Solo puedes calificar profesionales con contratos activos, firmados o completados.');
    }

    if (!REVIEWABLE_STATUSES.includes(contract.status)) {
      throw new ForbiddenException('Solo puedes calificar contratos aceptados, firmados o completados.');
    }

    const existing = await this.reviewsRepository.findOne({
      where: { clientId, professionalId: dto.professionalId },
    });

    const review = existing ?? this.reviewsRepository.create({ clientId, professionalId: dto.professionalId });
    review.contractId = contract.id;
    review.rating = dto.rating;
    review.comment = dto.comment;

    return this.reviewsRepository.save(review);
  }

  async listByProfessional(professionalId: string) {
    return this.reviewsRepository.find({
      where: { professionalId },
      relations: { client: true },
      order: { createdAt: 'DESC' },
    });
  }

  async reputation(professionalId: string) {
    const result = await this.reviewsRepository
      .createQueryBuilder('review')
      .select('COALESCE(AVG(review.rating), 0)', 'average')
      .addSelect('COUNT(review.id)', 'count')
      .where('review.professionalId = :professionalId', { professionalId })
      .getRawOne<{ average: string; count: string }>();

    return {
      average: Number(result?.average ?? 0),
      count: Number(result?.count ?? 0),
    };
  }
}
