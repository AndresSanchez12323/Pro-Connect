import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { RequestUser } from '../../common/types/request-user';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/send-message.dto';
import { OpenChatDto } from './dto/open-chat.dto';

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('conversations')
  list(@CurrentUser() user: RequestUser) {
    return this.chatService.listConversations(user.id);
  }

  @Get('mine')
  listMine(@CurrentUser() user: RequestUser) {
    return this.chatService.listConversationSummaries(user.id);
  }

  @Post('open')
  open(@CurrentUser() user: RequestUser, @Body() dto: OpenChatDto) {
    return this.chatService.openConversation(user.id, dto.contractId ?? dto.reservationId);
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
