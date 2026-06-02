import { IsDateString, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UpdateContractDto {
  @IsOptional()
  @IsDateString()
  scheduledAt?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  price?: number;

  @IsOptional()
  @IsString()
  terms?: string;

  @IsOptional()
  @IsString()
  changesNote?: string;
}
