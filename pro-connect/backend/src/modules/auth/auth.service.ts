import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User, Role } from '../users/entities/user.entity';
import { ProfessionalProfile } from '../professionals/entities/professional-profile.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @InjectRepository(ProfessionalProfile)
    private readonly professionalsRepository: Repository<ProfessionalProfile>,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const email = dto.email.toLowerCase();
    const existing = await this.usersRepository.findOne({ where: { email } });
    if (existing) {
      throw new ConflictException('Ya existe una cuenta con este correo.');
    }

    const user = this.usersRepository.create({
      fullName: dto.fullName,
      email,
      passwordHash: await bcrypt.hash(dto.password, 10),
      role: dto.role,
      phone: dto.phone ?? null,
      location: dto.location ?? null,
    });

    const savedUser = await this.usersRepository.save(user);

    let profile: ProfessionalProfile | null = null;
    if (dto.role === Role.PROFESSIONAL) {
      profile = this.professionalsRepository.create({
        userId: savedUser.id,
        specialty: 'HTML/CSS',
        headline: dto.headline ?? 'Especialista en HTML y CSS',
        bio: dto.bio ?? 'Profesional especializado en maquetacion y estilos web.',
        portfolioUrl: dto.portfolioUrl ?? null,
      });
      profile = await this.professionalsRepository.save(profile);
    }

    return {
      token: this.signToken(savedUser),
      user: this.sanitizeUser(savedUser),
      profile,
    };
  }

  async login(dto: LoginDto) {
    const email = dto.email.toLowerCase();
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new ForbiddenException('Credenciales invalidas.');
    }

    const isValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isValid) {
      throw new ForbiddenException('Credenciales invalidas.');
    }

    const profile = await this.professionalsRepository.findOne({ where: { userId: user.id } });

    return {
      token: this.signToken(user),
      user: this.sanitizeUser(user),
      profile,
    };
  }

  async me(userId: string) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado.');
    }
    const profile = await this.professionalsRepository.findOne({ where: { userId: user.id } });
    return {
      user: this.sanitizeUser(user),
      profile,
    };
  }

  private signToken(user: User) {
    return this.jwtService.sign({ sub: user.id, role: user.role });
  }

  private sanitizeUser(user: User) {
    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      phone: user.phone,
      location: user.location,
      createdAt: user.createdAt,
    };
  }
}
