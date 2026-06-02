import { IsIn, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class RespondReservationDto {
  @IsIn(['ACCEPT', 'REJECT', 'COUNTER', 'CHANGES'])
  action: 'ACCEPT' | 'REJECT' | 'COUNTER' | 'CHANGES';

  @IsOptional()
  @IsInt()
  @Min(1)
  counterPrice?: number;

  @IsOptional()
  @IsString()
  counterMessage?: string;

  @IsOptional()
  @IsString()
  changesNote?: string;
}
