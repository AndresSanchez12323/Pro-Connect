import 'reflect-metadata';
import * as bcrypt from 'bcryptjs';
import { DataSource } from 'typeorm';
import { User, Role } from '../modules/users/entities/user.entity';
import { ProfessionalProfile } from '../modules/professionals/entities/professional-profile.entity';
import { Service } from '../modules/services/entities/service.entity';
import { Contract, ContractStatus } from '../modules/contracts/entities/contract.entity';
import { ChatConversation, ChatMessage } from '../modules/chat/entities/chat.entity';
import { Notification, NotificationType } from '../modules/notifications/entities/notification.entity';
import { Invoice } from '../modules/invoices/entities/invoice.entity';
import { Review } from '../modules/reviews/entities/review.entity';

const appDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 5434),
  username: process.env.DB_USER ?? 'postgres',
  password: process.env.DB_PASSWORD ?? 'postgres',
  database: process.env.DB_NAME ?? 'proconnect',
  entities: [User, ProfessionalProfile, Service, Contract, ChatConversation, ChatMessage, Notification, Invoice, Review],
  synchronize: false,
  logging: false,
});

async function seed() {
  await appDataSource.initialize();
  await appDataSource.synchronize(true);

  const userRepo = appDataSource.getRepository(User);
  const profileRepo = appDataSource.getRepository(ProfessionalProfile);
  const serviceRepo = appDataSource.getRepository(Service);
  const contractRepo = appDataSource.getRepository(Contract);
  const conversationRepo = appDataSource.getRepository(ChatConversation);
  const messageRepo = appDataSource.getRepository(ChatMessage);
  const notificationRepo = appDataSource.getRepository(Notification);

  const passwordHash = await bcrypt.hash('ProConnect123!', 10);

  const [client, proA, proB] = await userRepo.save([
    userRepo.create({
      fullName: 'Camila Ruiz',
      email: 'camila.user@proconnect.dev',
      role: Role.USER,
      passwordHash,
      phone: '+57 310 111 2233',
      location: 'Bogota',
    }),
    userRepo.create({
      fullName: 'Diego Herrera',
      email: 'diego.pro@proconnect.dev',
      role: Role.PROFESSIONAL,
      passwordHash,
      phone: '+57 320 333 4455',
      location: 'Medellin',
    }),
    userRepo.create({
      fullName: 'Laura Morales',
      email: 'laura.pro@proconnect.dev',
      role: Role.PROFESSIONAL,
      passwordHash,
      phone: '+57 320 555 6677',
      location: 'Cali',
    }),
  ]);

  const [diegoProfile, lauraProfile] = await profileRepo.save([
    profileRepo.create({
      userId: proA.id,
      specialty: 'HTML/CSS',
      headline: 'Maquetador HTML y CSS con enfoque responsive',
      bio: 'Construyo interfaces pixel perfect con buenas practicas de accesibilidad.',
      portfolioUrl: 'https://portfolio-diego.dev',
    }),
    profileRepo.create({
      userId: proB.id,
      specialty: 'HTML/CSS',
      headline: 'Especialista en componentes HTML y estilos escalables',
      bio: 'Trabajo con sistemas de disenio y diseño responsivo para landing pages.',
      portfolioUrl: 'https://portfolio-laura.dev',
    }),
  ]);

  const [landingService, auditService] = await serviceRepo.save([
    serviceRepo.create({
      professionalId: diegoProfile.id,
      title: 'Landing page HTML/CSS',
      description: 'Maquetacion completa con secciones, CTA y version mobile.',
      price: 240000,
      deliveryDays: 5,
    }),
    serviceRepo.create({
      professionalId: lauraProfile.id,
      title: 'Auditoria de estilos CSS',
      description: 'Revision de estilos, mejoras de accesibilidad y performance.',
      price: 180000,
      deliveryDays: 3,
    }),
  ]);

  const contract = await contractRepo.save(
    contractRepo.create({
      clientId: client.id,
      professionalId: diegoProfile.id,
      serviceId: landingService.id,
      scheduledAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      status: ContractStatus.ACCEPTED,
      price: 240000,
      terms: 'Entrega en 5 dias. Incluye 1 ronda de ajustes.',
      changesNote: null,
    }),
  );

  const conversation = await conversationRepo.save(
    conversationRepo.create({ contractId: contract.id }),
  );

  await messageRepo.save([
    messageRepo.create({
      conversationId: conversation.id,
      senderId: client.id,
      content: 'Hola Diego, confirmo el alcance de la landing.',
    }),
    messageRepo.create({
      conversationId: conversation.id,
      senderId: proA.id,
      content: 'Perfecto, inicio con el wireframe y te comparto avances.',
    }),
  ]);

  await notificationRepo.save([
    notificationRepo.create({
      userId: proA.id,
      type: NotificationType.CONTRACT_CREATED,
      title: 'Nuevo contrato',
      message: 'Camila envio un contrato para tu servicio.',
    }),
    notificationRepo.create({
      userId: client.id,
      type: NotificationType.CONTRACT_RESPONSE,
      title: 'Contrato aceptado',
      message: 'Diego acepto tu solicitud.',
    }),
  ]);

  console.log('Seed ejecutado correctamente.');
  console.table([
    { role: 'USER', email: client.email, password: 'ProConnect123!' },
    { role: 'PROFESSIONAL', email: proA.email, password: 'ProConnect123!' },
    { role: 'PROFESSIONAL', email: proB.email, password: 'ProConnect123!' },
  ]);

  await appDataSource.destroy();
}

seed().catch(async (error) => {
  console.error('Error ejecutando seed:', error);
  if (appDataSource.isInitialized) {
    await appDataSource.destroy();
  }
  process.exit(1);
});
