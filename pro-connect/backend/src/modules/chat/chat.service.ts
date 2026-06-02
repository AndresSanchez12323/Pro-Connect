import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatConversation, ChatMessage } from './entities/chat.entity';
import { Contract, ContractStatus } from '../contracts/entities/contract.entity';
import { SendMessageDto } from './dto/send-message.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType } from '../notifications/entities/notification.entity';
import { ChatGateway } from './chat.gateway';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatConversation)
    private readonly conversationsRepository: Repository<ChatConversation>,
    @InjectRepository(ChatMessage)
    private readonly messagesRepository: Repository<ChatMessage>,
    @InjectRepository(Contract)
    private readonly contractsRepository: Repository<Contract>,
    private readonly notificationsService: NotificationsService,
    private readonly gateway: ChatGateway,
  ) {}

  async listConversations(userId: string) {
    const contracts = await this.contractsRepository.find({
      where: [{ clientId: userId }, { professional: { userId } }],
    });

    const contractIds = contracts.map((contract) => contract.id);
    if (contractIds.length === 0) return [];

    return this.conversationsRepository.find({
      where: contractIds.map((id) => ({ contractId: id })),
      relations: { messages: true },
      order: { createdAt: 'DESC' },
    });
  }

  async listConversationSummaries(userId: string) {
    const contracts = await this.contractsRepository.find({
      where: [{ clientId: userId }, { professional: { userId } }],
      relations: { professional: { user: true }, client: true },
      order: { createdAt: 'DESC' },
    });

    return Promise.all(
      contracts.map(async (contract) => {
        const conversation = await this.ensureConversation(contract.id);
        const messages = await this.messagesRepository.find({
          where: { conversationId: conversation.id },
          order: { createdAt: 'DESC' },
          take: 1,
        });
        const messageCount = await this.messagesRepository.count({ where: { conversationId: conversation.id } });
        const peer = contract.clientId === userId ? contract.professional.user : contract.client;

        return {
          id: conversation.id,
          reservationId: contract.id,
          contractId: contract.id,
          peer: peer
            ? {
                id: peer.id,
                fullName: peer.fullName,
                email: peer.email,
              }
            : null,
          messageCount,
          lastMessage: messages[0] ?? null,
        };
      }),
    );
  }

  async openConversation(userId: string, contractId?: string) {
    if (!contractId) {
      throw new NotFoundException('Contrato no encontrado.');
    }

    const contract = await this.getContractForUser(userId, contractId);
    return this.ensureConversation(contract.id);
  }

  async getMessages(userId: string, contractId: string) {
    const contract = await this.getContractForUser(userId, contractId);
    const conversation = await this.ensureConversation(contract.id);

    const messages = await this.messagesRepository.find({
      where: { conversationId: conversation.id },
      order: { createdAt: 'ASC' },
    });

    return { conversationId: conversation.id, messages };
  }

  async sendMessage(userId: string, dto: SendMessageDto) {
    const contractId = dto.contractId ?? dto.reservationId;
    if (!contractId) {
      throw new NotFoundException('Contrato no encontrado.');
    }

    const contract = await this.getContractForUser(userId, contractId);
    if (![ContractStatus.ACCEPTED, ContractStatus.SIGNED].includes(contract.status)) {
      throw new ForbiddenException('El chat se habilita cuando el contrato es aceptado.');
    }

    const conversation = await this.ensureConversation(contract.id);
    const message = this.messagesRepository.create({
      conversationId: conversation.id,
      senderId: userId,
      content: dto.content,
    });

    const saved = await this.messagesRepository.save(message);

    const receiverUserId = contract.clientId === userId ? contract.professional.userId : contract.clientId;
    await this.notificationsService.notify(
      receiverUserId,
      NotificationType.CHAT_MESSAGE,
      'Nuevo mensaje',
      'Recibiste un nuevo mensaje en el chat.',
    );

    this.gateway.pushMessage(contract.id, saved);

    return saved;
  }

  private async ensureConversation(contractId: string) {
    const existing = await this.conversationsRepository.findOne({ where: { contractId } });
    if (existing) return existing;

    const conversation = this.conversationsRepository.create({ contractId });
    return this.conversationsRepository.save(conversation);
  }

  private async getContractForUser(userId: string, contractId: string) {
    const contract = await this.contractsRepository.findOne({
      where: { id: contractId },
      relations: { professional: true },
    });
    if (!contract) {
      throw new NotFoundException('Contrato no encontrado.');
    }

    if (contract.clientId !== userId && contract.professional.userId !== userId) {
      throw new ForbiddenException('No autorizado para este chat.');
    }

    return contract;
  }
}
