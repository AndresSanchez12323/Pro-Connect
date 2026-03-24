import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProConnectModule } from './pro-connect/pro-connect.module';
import { User } from './pro-connect/entities/user.entity';
import { ProfessionalProfile } from './pro-connect/entities/professional-profile.entity';
import { Service } from './pro-connect/entities/service.entity';
import { AvailabilitySlot } from './pro-connect/entities/availability-slot.entity';
import { Reservation } from './pro-connect/entities/reservation.entity';
import { Review } from './pro-connect/entities/review.entity';
import { ChatConversation, ChatMessage } from './pro-connect/entities/chat.entity';
import { Invoice } from './pro-connect/entities/invoice.entity';
import { Notification } from './pro-connect/entities/notification.entity';

const asBool = (value: string | undefined, fallback: boolean): boolean => {
  if (value == null) return fallback;
  return value.toLowerCase() === 'true';
};

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      ...(process.env.DATABASE_URL
        ? {
            url: process.env.DATABASE_URL,
          }
        : {
            host: process.env.DB_HOST ?? 'localhost',
            port: Number(process.env.DB_PORT ?? 5434),
            username: process.env.DB_USER ?? 'postgres',
            password: process.env.DB_PASSWORD ?? 'postgres',
            database: process.env.DB_NAME ?? 'proconnect',
          }),
      ssl: asBool(process.env.DB_SSL, false)
        ? { rejectUnauthorized: false }
        : false,
      entities: [User, ProfessionalProfile, Service, AvailabilitySlot, Reservation, Review, ChatConversation, ChatMessage, Invoice, Notification],
      synchronize: asBool(process.env.DB_SYNCHRONIZE, true),
      logging: asBool(process.env.DB_LOGGING, false),
    }),
    ProConnectModule,
  ],
})
export class AppModule {}
