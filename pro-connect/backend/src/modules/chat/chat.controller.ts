import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { RequestUser } from '../../common/types/request-user';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/send-message.dto';

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('conversations')
  list(@CurrentUser() user: RequestUser) {
    return this.chatService.listConversations(user.id);
  }

  @Get(':contractId')
  history(@CurrentUser() user: RequestUser, @Param('contractId') contractId: string) {
    return this.chatService.getMessages(user.id, contractId);
  }

  @Post('message')
  send(@CurrentUser() user: RequestUser, @Body() dto: SendMessageDto) {
    return this.chatService.sendMessage(user.id, dto);
  }
}
