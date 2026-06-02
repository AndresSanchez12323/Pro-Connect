import { IsUUID } from 'class-validator';

export class OpenChatDto {
  @IsUUID()
  contractId: string;
}
