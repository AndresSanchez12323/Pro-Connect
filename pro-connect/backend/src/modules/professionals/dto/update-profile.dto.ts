import { IsOptional, IsString } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  headline?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  portfolioUrl?: string;
}
