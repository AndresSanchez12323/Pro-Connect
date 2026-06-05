import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ProfessionalsModule } from './modules/professionals/professionals.module';
import { ServicesModule } from './modules/services/services.module';
import { ContractsModule } from './modules/contracts/contracts.module';
import { ChatModule } from './modules/chat/chat.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { InvoicesModule } from './modules/invoices/invoices.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { User } from './modules/users/entities/user.entity';
import { ProfessionalProfile } from './modules/professionals/entities/professional-profile.entity';
import { Service } from './modules/services/entities/service.entity';
import { Contract } from './modules/contracts/entities/contract.entity';
import { ChatConversation, ChatMessage } from './modules/chat/entities/chat.entity';
import { Notification } from './modules/notifications/entities/notification.entity';
import { Invoice } from './modules/invoices/entities/invoice.entity';
import { Review } from './modules/reviews/entities/review.entity';
import { HealthController } from './health.controller';

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
      entities: [User, ProfessionalProfile, Service, Contract, ChatConversation, ChatMessage, Notification, Invoice, Review],
      synchronize: asBool(process.env.DB_SYNCHRONIZE, true),
      logging: asBool(process.env.DB_LOGGING, false),
    }),
    AuthModule,
    UsersModule,
    ProfessionalsModule,
    ServicesModule,
    ContractsModule,
    ChatModule,
    NotificationsModule,
    DashboardModule,
    InvoicesModule,
    ReviewsModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
