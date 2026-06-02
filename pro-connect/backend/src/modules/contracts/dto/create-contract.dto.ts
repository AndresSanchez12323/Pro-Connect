import { IsDateString, IsNotEmpty, IsString, IsUUID, Min } from 'class-validator';
import { IsInt } from 'class-validator';

export class CreateContractDto {
  @IsUUID()
  professionalId: string;

  @IsUUID()
  serviceId: string;

  @IsDateString()
  scheduledAt: string;

  @IsInt()
  @Min(1)
  price: number;

  @IsString()
  @IsNotEmpty()
  terms: string;
}
