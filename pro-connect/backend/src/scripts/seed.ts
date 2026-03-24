import 'reflect-metadata';
import * as bcrypt from 'bcryptjs';
import { DataSource } from 'typeorm';
import {
  AvailabilitySlot,
  ChatConversation,
  ChatMessage,
  Invoice,
  Notification,
  NotificationType,
  ProfessionalProfile,
  Reservation,
  ReservationStatus,
  Review,
  Role,
  Service,
  ServiceMode,
  User,
} from '../pro-connect/entities';

const appDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 5434),
  username: process.env.DB_USER ?? 'postgres',
  password: process.env.DB_PASSWORD ?? 'postgres',
  database: process.env.DB_NAME ?? 'proconnect',
  entities: [User, ProfessionalProfile, Service, AvailabilitySlot, Reservation, Review, ChatConversation, ChatMessage, Invoice, Notification],
  synchronize: true,
  logging: false,
});

async function seed() {
  await appDataSource.initialize();
  await appDataSource.synchronize(true);

  const userRepo = appDataSource.getRepository(User);
  const profileRepo = appDataSource.getRepository(ProfessionalProfile);
  const serviceRepo = appDataSource.getRepository(Service);
  const slotRepo = appDataSource.getRepository(AvailabilitySlot);
  const reservationRepo = appDataSource.getRepository(Reservation);
  const reviewRepo = appDataSource.getRepository(Review);
  const conversationRepo = appDataSource.getRepository(ChatConversation);
  const messageRepo = appDataSource.getRepository(ChatMessage);
  const invoiceRepo = appDataSource.getRepository(Invoice);
  const notificationRepo = appDataSource.getRepository(Notification);

  const basePassword = 'ProConnect123!';
  const passwordHash = await bcrypt.hash(basePassword, 10);

  const [ana, carlos, maria, juan, laura] = await userRepo.save([
    userRepo.create({
      fullName: 'Ana Torres',
      email: 'ana.user@proconnect.dev',
      role: Role.USER,
      passwordHash,
      birthDate: new Date('1996-03-12'),
      nationalId: 'CC-1001001001',
      phone: '+57 310 111 2233',
    }),
    userRepo.create({
      fullName: 'Carlos Mejia',
      email: 'carlos.user@proconnect.dev',
      role: Role.USER,
      passwordHash,
      birthDate: new Date('1993-11-04'),
      nationalId: 'CC-1002002002',
      phone: '+57 310 222 3344',
    }),
    userRepo.create({
      fullName: 'Maria Rojas',
      email: 'maria.pro@proconnect.dev',
      role: Role.PROFESSIONAL,
      passwordHash,
      birthDate: new Date('1990-09-21'),
      nationalId: 'CC-2001001001',
      phone: '+57 320 333 4455',
    }),
    userRepo.create({
      fullName: 'Juan Perez',
      email: 'juan.pro@proconnect.dev',
      role: Role.PROFESSIONAL,
      passwordHash,
      birthDate: new Date('1988-07-03'),
      nationalId: 'CC-2002002002',
      phone: '+57 320 444 5566',
    }),
    userRepo.create({
      fullName: 'Laura Gomez',
      email: 'laura.pro@proconnect.dev',
      role: Role.PROFESSIONAL,
      passwordHash,
      birthDate: new Date('1992-05-15'),
      nationalId: 'CC-2003003003',
      phone: '+57 320 555 6677',
    }),
  ]);

  const [mariaProfile, juanProfile, lauraProfile] = await profileRepo.save([
    profileRepo.create({
      id: maria.id,
      userId: maria.id,
      specialty: 'Desarrollo Web Fullstack',
      experience: 7,
      description: 'Implemento plataformas web con NestJS, React y PostgreSQL, incluyendo CI/CD.',
      contactInfo: 'Disponible para proyectos remotos y mentoring tecnico.',
    }),
    profileRepo.create({
      id: juan.id,
      userId: juan.id,
      specialty: 'Diseno UX/UI y Branding',
      experience: 6,
      description: 'Ayudo a equipos a convertir ideas en productos intuitivos con foco en conversion.',
      contactInfo: 'Atencion en linea de lunes a sabado.',
    }),
    profileRepo.create({
      id: laura.id,
      userId: laura.id,
      specialty: 'Coaching de carrera TI',
      experience: 5,
      description: 'Simulacros de entrevistas tecnicas, mejora de CV y estrategia profesional.',
      contactInfo: 'Sesiones virtuales de 60 y 90 minutos.',
    }),
  ]);

  const [devAudit, devMentor, uxReview, coaching] = await serviceRepo.save([
    serviceRepo.create({
      professionalId: mariaProfile.id,
      name: 'Auditoria tecnica de arquitectura',
      mode: ServiceMode.ONLINE,
      price: 240000,
    }),
    serviceRepo.create({
      professionalId: mariaProfile.id,
      name: 'Mentoria Fullstack por sprint',
      mode: ServiceMode.ONLINE,
      price: 180000,
    }),
    serviceRepo.create({
      professionalId: juanProfile.id,
      name: 'Revision UX completa de producto',
      mode: ServiceMode.IN_PERSON,
      price: 210000,
    }),
    serviceRepo.create({
      professionalId: lauraProfile.id,
      name: 'Coaching de entrevista tecnica',
      mode: ServiceMode.ONLINE,
      price: 120000,
    }),
  ]);

  await slotRepo.save([
    slotRepo.create({
      professionalId: mariaProfile.id,
      startAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      endAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000),
    }),
    slotRepo.create({
      professionalId: juanProfile.id,
      startAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      endAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000),
    }),
  ]);

  const [reservationNegotiation, reservationConfirmed, reservationCompleted] = await reservationRepo.save([
    reservationRepo.create({
      userId: ana.id,
      professionalId: mariaProfile.id,
      serviceId: devAudit.id,
      mode: ServiceMode.ONLINE,
      scheduledAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      status: ReservationStatus.PENDING,
      onlineLink: 'https://meet.jit.si/proconnect-negociacion-ana-maria',
      proposedPrice: 200000,
      negotiationMessage: 'Podemos ajustar el alcance para un presupuesto de 200k?',
      counterOfferPrice: 220000,
      counterOfferMessage: 'Puedo incluir entregable reducido y 1 reunion de seguimiento.',
    }),
    reservationRepo.create({
      userId: carlos.id,
      professionalId: juanProfile.id,
      serviceId: uxReview.id,
      mode: ServiceMode.IN_PERSON,
      scheduledAt: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      status: ReservationStatus.CONFIRMED,
      travelAddress: 'Calle 85 #13-50, Bogota',
      travelCost: 25000,
    }),
    reservationRepo.create({
      userId: ana.id,
      professionalId: lauraProfile.id,
      serviceId: coaching.id,
      mode: ServiceMode.ONLINE,
      scheduledAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      status: ReservationStatus.COMPLETED,
      onlineLink: 'https://meet.jit.si/proconnect-coaching-ana-laura',
    }),
  ]);

  const [conversationNegotiation, conversationConfirmed] = await conversationRepo.save([
    conversationRepo.create({ reservationId: reservationNegotiation.id }),
    conversationRepo.create({ reservationId: reservationConfirmed.id }),
  ]);

  await messageRepo.save([
    messageRepo.create({
      conversationId: conversationNegotiation.id,
      senderId: ana.id,
      content: 'Hola Maria, te envie una propuesta de precio para iniciar rapido.',
    }),
    messageRepo.create({
      conversationId: conversationNegotiation.id,
      senderId: maria.id,
      content: 'Perfecto Ana, te deje una contraoferta con alcance ajustado.',
    }),
    messageRepo.create({
      conversationId: conversationConfirmed.id,
      senderId: carlos.id,
      content: 'Juan, ya quedo confirmada la sesion presencial del jueves.',
    }),
  ]);

  await reviewRepo.save(
    reviewRepo.create({
      userId: ana.id,
      professionalId: lauraProfile.id,
      rating: 5,
      comment: 'Excelente sesion, me ayudo a mejorar mi presentacion tecnica.',
    }),
  );

  await invoiceRepo.save(
    invoiceRepo.create({
      reservationId: reservationCompleted.id,
      professionalId: lauraProfile.id,
      total: 120000,
    }),
  );

  await notificationRepo.save([
    notificationRepo.create({
      userId: maria.id,
      type: NotificationType.RESERVATION_CREATED,
      channel: 'IN_APP',
      title: 'Nueva solicitud con negociacion',
      message: 'Ana Torres envio una nueva solicitud con oferta inicial.',
      readAt: null,
    }),
    notificationRepo.create({
      userId: ana.id,
      type: NotificationType.RESERVATION_UPDATED,
      channel: 'IN_APP',
      title: 'Recibiste una contraoferta',
      message: 'Maria Rojas envio una contraoferta en tu reserva.',
      readAt: null,
    }),
    notificationRepo.create({
      userId: juan.id,
      type: NotificationType.NEW_CHAT_MESSAGE,
      channel: 'IN_APP',
      title: 'Nuevo mensaje de Carlos',
      message: 'Carlos Mejia te escribio en la reserva confirmada.',
      readAt: null,
    }),
    notificationRepo.create({
      userId: carlos.id,
      type: NotificationType.RESERVATION_UPDATED,
      channel: 'IN_APP',
      title: 'Reserva confirmada',
      message: 'Tu reserva con Juan Perez fue confirmada.',
      readAt: new Date(),
    }),
  ]);

  const credentials = [
    { role: 'USER', email: ana.email, password: basePassword },
    { role: 'USER', email: carlos.email, password: basePassword },
    { role: 'PROFESSIONAL', email: maria.email, password: basePassword },
    { role: 'PROFESSIONAL', email: juan.email, password: basePassword },
    { role: 'PROFESSIONAL', email: laura.email, password: basePassword },
  ];

  console.log('Seed ejecutado correctamente.');
  console.table(credentials);

  await appDataSource.destroy();
}

seed().catch(async (error) => {
  console.error('Error ejecutando seed:', error);
  if (appDataSource.isInitialized) {
    await appDataSource.destroy();
  }
  process.exit(1);
});
