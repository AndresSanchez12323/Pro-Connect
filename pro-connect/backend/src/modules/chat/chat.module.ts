import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { ChatConversation, ChatMessage } from './entities/chat.entity';
import { Contract } from '../contracts/entities/contract.entity';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [TypeOrmModule.forFeature([ChatConversation, ChatMessage, Contract]), NotificationsModule],
  controllers: [ChatController],
  providers: [ChatService, ChatGateway],
})
export class ChatModule {}
