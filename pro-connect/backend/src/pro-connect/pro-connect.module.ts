import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, ProfessionalProfile, Service, AvailabilitySlot, Reservation, Review, ChatConversation, ChatMessage, Invoice, Notification } from './entities';
import { ProConnectController } from './pro-connect.controller';
import { ProConnectFacade } from './pro-connect.facade';
import { DomainEventBus } from './domain-event-bus.service';
import { ProConnectObserver } from './pro-connect.observer';
import { ProConnectGateway } from './pro-connect.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, ProfessionalProfile, Service, AvailabilitySlot, Reservation, Review, ChatConversation, ChatMessage, Invoice, Notification])
  ],
  controllers: [ProConnectController],
  providers: [ProConnectFacade, DomainEventBus, ProConnectObserver, ProConnectGateway],
})
export class ProConnectModule {}
