import { IsOptional, IsUUID } from 'class-validator';

export class OpenChatDto {
  @IsOptional()
  @IsUUID()
  contractId?: string;

  @IsOptional()
  @IsUUID()
  reservationId?: string;
}
