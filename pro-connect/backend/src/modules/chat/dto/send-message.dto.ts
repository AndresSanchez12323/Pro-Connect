import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class SendMessageDto {
  @IsUUID()
  contractId: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}
