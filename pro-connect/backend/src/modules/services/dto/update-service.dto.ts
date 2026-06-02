import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UpdateServiceDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  price?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  deliveryDays?: number;
}
