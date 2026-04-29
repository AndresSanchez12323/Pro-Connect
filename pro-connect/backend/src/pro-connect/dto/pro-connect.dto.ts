import { IsDateString, IsEmail, IsEnum, IsIn, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';
import { Role, ServiceMode } from '../entities/enums';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  fullName!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;

  @IsEnum(Role)
  role!: Role;

  @IsOptional()
  @IsString()
  specialty?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  experience?: number;

  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  nationalId?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  phone?: string;
}

export class LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;
}

export class UpdateMeDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  fullName?: string;

  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  nationalId?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  phone?: string;
}

export class RequestPasswordRecoveryDto {
  @IsEmail()
  email!: string;
}

export class ResetPasswordDto {
  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  code!: string;

  @IsString()
  @IsNotEmpty()
  newPassword!: string;
}

export class CreateProfessionalProfileDto {
  @IsUUID()
  userId!: string;

  @IsString()
  @IsNotEmpty()
  specialty!: string;

  @IsInt()
  @Min(0)
  experience!: number;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsString()
  @IsNotEmpty()
  contactInfo!: string;

  @IsString()
  @IsNotEmpty()
  fullName!: string;

  @IsEmail()
  email!: string;
}

export class UpdateProfessionalProfileDto {
  @IsOptional()
  @IsString()
  specialty?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  experience?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  contactInfo?: string;
}

export class CreateServiceDto {
  @IsUUID()
  professionalId!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsInt()
  @Min(1)
  price!: number;

  @IsEnum(ServiceMode)
  mode!: ServiceMode;
}

export class CreateAvailabilityDto {
  @IsUUID()
  professionalId!: string;

  @IsDateString()
  startAt!: string;

  @IsDateString()
  endAt!: string;
}

export class CreateReservationDto {
  @IsUUID()
  professionalId!: string;

  @IsUUID()
  serviceId!: string;

  @IsDateString()
  scheduledAt!: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  proposedPrice?: number;

  @IsOptional()
  @IsString()
  negotiationMessage?: string;

  @IsOptional()
  @IsString()
  onlineLink?: string;

  @IsOptional()
  @IsString()
  travelAddress?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  travelCost?: number;
}

export class RescheduleReservationDto {
  @IsDateString()
  scheduledAt!: string;
}

export class RespondReservationDto {
  @IsIn(['ACCEPT', 'REJECT', 'COUNTER'])
  action!: 'ACCEPT' | 'REJECT' | 'COUNTER';

  @IsOptional()
  @IsInt()
  @Min(1)
  counterPrice?: number;

  @IsOptional()
  @IsString()
  counterMessage?: string;
}

export class OpenChatDto {
  @IsUUID()
  reservationId!: string;
}

export class SendMessageDto {
  @IsUUID()
  reservationId!: string;

  @IsString()
  @IsNotEmpty()
  content!: string;
}

export class CreateReviewDto {
  @IsUUID()
  professionalId!: string;

  @IsInt()
  @Min(1)
  @Max(5)
  rating!: number;

  @IsString()
  @IsNotEmpty()
  comment!: string;
}
