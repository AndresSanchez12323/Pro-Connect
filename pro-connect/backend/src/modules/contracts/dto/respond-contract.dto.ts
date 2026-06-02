import { IsIn, IsOptional, IsString } from 'class-validator';

export class RespondContractDto {
  @IsIn(['ACCEPT', 'REJECT', 'CHANGES'])
  action: 'ACCEPT' | 'REJECT' | 'CHANGES';

  @IsOptional()
  @IsString()
  changesNote?: string;
}
