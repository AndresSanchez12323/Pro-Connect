import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, In, IsNull } from 'typeorm';
import { 
  User, ProfessionalProfile, Service, AvailabilitySlot, Reservation, 
  Review, ChatConversation, ChatMessage, Invoice, Notification,
  Role, ServiceMode, ReservationStatus 
} from './entities';
import { 
  CreateAvailabilityDto, CreateProfessionalProfileDto, CreateReservationDto, 
  CreateReviewDto, CreateServiceDto, LoginDto, RegisterDto, RequestPasswordRecoveryDto, RescheduleReservationDto, ResetPasswordDto, RespondReservationDto, SendMessageDto,
  UpdateMeDto,
  UpdateProfessionalProfileDto 
} from './dto/pro-connect.dto';
import { DomainEventBus } from './domain-event-bus.service';
import { ReservationBuilder } from './patterns/reservation.builder';
import { reservationFactoryByMode } from './patterns/reservation.factory';
import { ProConnectGateway } from './pro-connect.gateway';

@Injectable()
export class ProConnectFacade {
  private readonly unauthorizedMessage = 'No autorizado para acceder a esta reserva.';

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(ProfessionalProfile) private readonly professionalRepository: Repository<ProfessionalProfile>,
    @InjectRepository(Service) private readonly serviceRepository: Repository<Service>,
    @InjectRepository(AvailabilitySlot) private readonly availabilityRepository: Repository<AvailabilitySlot>,
    @InjectRepository(Reservation) private readonly reservationRepository: Repository<Reservation>,
    @InjectRepository(Review) private readonly reviewRepository: Repository<Review>,
    @InjectRepository(ChatConversation) private readonly conversationRepository: Repository<ChatConversation>,
    @InjectRepository(ChatMessage) private readonly messageRepository: Repository<ChatMessage>,
    @InjectRepository(Invoice) private readonly invoiceRepository: Repository<Invoice>,
    @InjectRepository(Notification) private readonly notificationRepository: Repository<Notification>,
    private readonly eventBus: DomainEventBus,
    private readonly gateway: ProConnectGateway,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.userRepository.findOne({ where: { email: dto.email.toLowerCase() } });
    if (existing) {
      throw new ConflictException('Ya existe una cuenta con este correo.');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = this.userRepository.create({
      fullName: dto.fullName,
      email: dto.email.toLowerCase(),
      passwordHash,
      birthDate: dto.birthDate ? new Date(dto.birthDate) : null,
      nationalId: dto.nationalId ?? null,
      phone: dto.phone ?? null,
      passwordRecoveryCode: null,
      passwordRecoveryCodeExpiresAt: null,
      role: dto.role,
    });
    const savedUser = await this.userRepository.save(user);

    let profile: ProfessionalProfile | null = null;
    if (dto.role === Role.PROFESSIONAL) {
      profile = this.professionalRepository.create({
        id: savedUser.id,
        userId: savedUser.id,
        specialty: dto.specialty ?? 'Generalista',
        experience: dto.experience ?? 0,
        description: `Perfil profesional de ${savedUser.fullName}`,
        contactInfo: savedUser.email,
      });
      profile = await this.professionalRepository.save(profile);
    }

    return {
      user: this.sanitizeUser(savedUser),
      profile,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.userRepository.findOne({ where: { email: dto.email.toLowerCase() } });
    if (!user || !user.passwordHash) {
      throw new ForbiddenException('Credenciales inválidas.');
    }

    const validPassword = await bcrypt.compare(dto.password, user.passwordHash);
    if (!validPassword) {
      throw new ForbiddenException('Credenciales inválidas.');
    }

    const profile = await this.professionalRepository.findOne({ where: { userId: user.id } });

    return {
      user: this.sanitizeUser(user),
      profile,
    };
  }

  async requestPasswordRecovery(dto: RequestPasswordRecoveryDto) {
    const user = await this.userRepository.findOne({ where: { email: dto.email.toLowerCase() } });
    if (!user) {
      return { success: true, message: 'Si el correo existe, se enviaron instrucciones de recuperación.' };
    }

    const code = `${Math.floor(100000 + Math.random() * 900000)}`;
    user.passwordRecoveryCode = code;
    user.passwordRecoveryCodeExpiresAt = new Date(Date.now() + 1000 * 60 * 15);
    await this.userRepository.save(user);

    // En produccion el codigo se envia por correo.
    return {
      success: true,
      message: 'Código de recuperación generado.',
      recoveryCode: code,
      expiresAt: user.passwordRecoveryCodeExpiresAt,
    };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const user = await this.userRepository.findOne({ where: { email: dto.email.toLowerCase() } });
    if (!user || !user.passwordRecoveryCode || !user.passwordRecoveryCodeExpiresAt) {
      throw new ForbiddenException('Solicitud de recuperación inválida.');
    }

    if (user.passwordRecoveryCode !== dto.code) {
      throw new ForbiddenException('Código de recuperación inválido.');
    }

    if (user.passwordRecoveryCodeExpiresAt.getTime() < Date.now()) {
      throw new ForbiddenException('El código de recuperación expiró.');
    }

    user.passwordHash = await bcrypt.hash(dto.newPassword, 10);
    user.passwordRecoveryCode = null;
    user.passwordRecoveryCodeExpiresAt = null;
    await this.userRepository.save(user);

    return { success: true, message: 'Contraseña actualizada correctamente.' };
  }

  async getSessionUser(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado.');
    }

    const profile = await this.professionalRepository.findOne({ where: { userId: user.id } });
    return {
      user: this.sanitizeUser(user),
      profile,
    };
  }

  async updateSessionUser(userId: string, dto: UpdateMeDto) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado.');
    }

    if (dto.fullName) {
      user.fullName = dto.fullName;
    }

    if (dto.birthDate !== undefined) {
      user.birthDate = dto.birthDate ? new Date(dto.birthDate) : null;
    }
    if (dto.nationalId !== undefined) {
      user.nationalId = dto.nationalId;
    }
    if (dto.phone !== undefined) {
      user.phone = dto.phone;
    }

    await this.userRepository.save(user);

    const profile = await this.professionalRepository.findOne({ where: { userId: user.id } });
    return {
      user: this.sanitizeUser(user),
      profile,
    };
  }

  async getMyServices(userId: string) {
    await this.requireRole(userId, Role.PROFESSIONAL);
    const professional = await this.requireProfessionalByUserId(userId);

    const services = await this.serviceRepository.find({
      where: { professionalId: professional.id },
      relations: { reservations: true },
      order: { createdAt: 'DESC' },
    });

    return services.map((service) => ({
      id: service.id,
      name: service.name,
      price: Number(service.price),
      mode: service.mode,
      contracts: service.reservations?.length ?? 0,
      createdAt: service.createdAt,
    }));
  }

  async getMyReservations(userId: string) {
    const professional = await this.professionalRepository.findOne({ where: { userId } });

    const reservations = await this.reservationRepository.find({
      where: professional ? { professionalId: professional.id } : { userId },
      relations: {
        service: true,
        user: true,
        professional: { user: true },
      },
      order: { scheduledAt: 'DESC' },
    });

    return reservations.map((reservation) => ({
      id: reservation.id,
      status: reservation.status,
      scheduledAt: reservation.scheduledAt,
      mode: reservation.mode,
      onlineLink: reservation.onlineLink,
      travelAddress: reservation.travelAddress,
      travelCost: reservation.travelCost ? Number(reservation.travelCost) : null,
      proposedPrice: reservation.proposedPrice ? Number(reservation.proposedPrice) : null,
      negotiationMessage: reservation.negotiationMessage,
      counterOfferPrice: reservation.counterOfferPrice ? Number(reservation.counterOfferPrice) : null,
      counterOfferMessage: reservation.counterOfferMessage,
      service: reservation.service
        ? {
            id: reservation.service.id,
            name: reservation.service.name,
            price: Number(reservation.service.price),
            mode: reservation.service.mode,
          }
        : null,
      client: reservation.user
        ? {
            id: reservation.user.id,
            fullName: reservation.user.fullName,
            email: reservation.user.email,
          }
        : null,
      professional: reservation.professional?.user
        ? {
            id: reservation.professional.user.id,
            fullName: reservation.professional.user.fullName,
            email: reservation.professional.user.email,
          }
        : null,
      professionalProfileId: reservation.professionalId,
      userId: reservation.userId,
    }));
  }

  async getMyConversations(userId: string) {
    const reservations = await this.getMyReservations(userId);
    const reservationIds = reservations.map((item) => item.id);
    if (reservationIds.length === 0) {
      return [];
    }

    const conversations = await this.conversationRepository.find({
      where: { reservationId: In(reservationIds) },
      relations: { messages: true },
      order: { createdAt: 'DESC' },
    });

    return conversations.map((conversation) => {
      const relatedReservation = reservations.find((item) => item.id === conversation.reservationId) ?? null;
      const sortedMessages = [...conversation.messages].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
      const lastMessage = sortedMessages.at(-1) ?? null;
      const peer = relatedReservation
        ? relatedReservation.userId === userId
          ? relatedReservation.professional
          : relatedReservation.client
        : null;

      return {
        id: conversation.id,
        reservationId: conversation.reservationId,
        peer,
        messageCount: sortedMessages.length,
        lastMessage,
      };
    });
  }

  async getMyNotifications(userId: string) {
    const notifications = await this.notificationRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: 50,
    });

    return notifications.map((item) => ({
      id: item.id,
      type: item.type,
      channel: item.channel,
      title: item.title,
      message: item.message,
      createdAt: item.createdAt,
      readAt: item.readAt,
      isRead: Boolean(item.readAt),
    }));
  }

  async markNotificationRead(userId: string, notificationId: string) {
    const notification = await this.notificationRepository.findOneBy({ id: notificationId, userId });
    if (!notification) {
      throw new NotFoundException('Notificacion no encontrada.');
    }

    if (!notification.readAt) {
      notification.readAt = new Date();
      await this.notificationRepository.save(notification);
    }

    return {
      id: notification.id,
      readAt: notification.readAt,
    };
  }

  async getClientSummary(userId: string) {
    await this.requireRole(userId, Role.USER);

    const reservations = await this.reservationRepository.find({
      where: { userId },
      relations: { service: true, professional: { user: true } },
      order: { scheduledAt: 'DESC' },
    });

    const notifications = await this.notificationRepository.count({
      where: { userId, readAt: IsNull() },
    });

    return {
      contractsCount: reservations.length,
      nextReservation: reservations.find((item) => item.status !== ReservationStatus.CANCELLED) ?? null,
      unreadNotifications: notifications,
      recentReservations: reservations.slice(0, 3).map((item) => ({
        id: item.id,
        status: item.status,
        scheduledAt: item.scheduledAt,
        serviceName: item.service?.name ?? 'Servicio',
        professionalName: item.professional?.user?.fullName ?? 'Profesional',
      })),
    };
  }

  async getProfessionalSummary(userId: string) {
    await this.requireRole(userId, Role.PROFESSIONAL);
    const professional = await this.requireProfessionalByUserId(userId);

    const services = await this.serviceRepository.find({ where: { professionalId: professional.id } });
    const reservations = await this.reservationRepository.find({
      where: { professionalId: professional.id },
      relations: { service: true, user: true },
      order: { scheduledAt: 'DESC' },
    });
    const unreadNotifications = await this.notificationRepository.count({ where: { userId, readAt: IsNull() } });

    const activeJobs = reservations.filter((item) => item.status !== ReservationStatus.CANCELLED).length;
    const revenue = reservations
      .filter((item) => item.status === ReservationStatus.COMPLETED || item.status === ReservationStatus.CONFIRMED)
      .reduce((sum, item) => sum + Number(item.service?.price ?? 0), 0);

    return {
      servicesCount: services.length,
      activeJobs,
      unreadNotifications,
      estimatedRevenue: revenue,
      recentJobs: reservations.slice(0, 4).map((item) => ({
        id: item.id,
        status: item.status,
        scheduledAt: item.scheduledAt,
        clientName: item.user?.fullName ?? 'Cliente',
        serviceName: item.service?.name ?? 'Servicio',
      })),
    };
  }

  async createProfessionalProfile(actorUserId: string, dto: CreateProfessionalProfileDto) {
    if (actorUserId !== dto.userId) {
      throw new ForbiddenException('No autorizado para crear este perfil profesional.');
    }

    await this.requireRole(actorUserId, Role.PROFESSIONAL);

    let user = await this.userRepository.findOneBy({ id: dto.userId });
    if (user) {
        user.fullName = dto.fullName;
        user.email = dto.email;
        user.role = Role.PROFESSIONAL;
    } else {
        user = this.userRepository.create({
            id: dto.userId,
            fullName: dto.fullName,
            email: dto.email,
            role: Role.PROFESSIONAL,
        });
    }
    await this.userRepository.save(user);

    let profile = await this.professionalRepository.findOneBy({ userId: dto.userId });
    if (profile) {
        profile.specialty = dto.specialty;
        profile.experience = dto.experience;
        profile.description = dto.description;
        profile.contactInfo = dto.contactInfo;
    } else {
        profile = this.professionalRepository.create({
            userId: dto.userId,
            specialty: dto.specialty,
            experience: dto.experience,
            description: dto.description,
            contactInfo: dto.contactInfo,
            id: dto.userId,
        });
    }
    return this.professionalRepository.save(profile);
  }

  async updateProfessionalProfile(actorUserId: string, profileId: string, dto: UpdateProfessionalProfileDto) {
     await this.requireRole(actorUserId, Role.PROFESSIONAL);
     const profile = await this.requireProfessionalByUserId(actorUserId);
     if (profile.id !== profileId) {
      throw new ForbiddenException('No autorizado para actualizar este perfil.');
     }

     await this.professionalRepository.update(profileId, dto);
     return this.professionalRepository.findOneBy({ id: profileId });
  }

  async createService(userId: string, dto: CreateServiceDto) {
    await this.requireRole(userId, Role.PROFESSIONAL);
    const profile = await this.requireProfessionalByUserId(userId);
    if (profile.id !== dto.professionalId) {
      throw new ForbiddenException('No autorizado para crear servicios para otro profesional.');
    }

    const service = this.serviceRepository.create({
        professionalId: dto.professionalId,
        name: dto.name,
        price: dto.price,
        mode: dto.mode as ServiceMode,
    });
    return this.serviceRepository.save(service);
  }

  async createAvailability(userId: string, dto: CreateAvailabilityDto) {
    await this.requireRole(userId, Role.PROFESSIONAL);
    const profile = await this.requireProfessionalByUserId(userId);
    if (profile.id !== dto.professionalId) {
      throw new ForbiddenException('No autorizado para gestionar disponibilidad de otro profesional.');
    }

    const slot = this.availabilityRepository.create({
        professionalId: dto.professionalId,
        startAt: new Date(dto.startAt),
        endAt: new Date(dto.endAt),
    });
    return this.availabilityRepository.save(slot);
  }

  async searchProfessionals(filters: { specialty?: string; mode?: 'ONLINE' | 'IN_PERSON'; date?: string }) {
    const query = this.professionalRepository.createQueryBuilder('professional')
        .leftJoinAndSelect('professional.user', 'user')
        .leftJoinAndSelect('professional.services', 'services')
        .leftJoinAndSelect('professional.availability', 'availability');

    if (filters.specialty) {
        query.andWhere('(professional.specialty ILIKE :term OR user.fullName ILIKE :term OR services.name ILIKE :term)', {
          term: `%${filters.specialty}%`,
        });
    }

    if (filters.mode) {
        query.andWhere('services.mode = :mode', { mode: filters.mode });
    }

    if (filters.date) {
        const date = new Date(filters.date);
        query.andWhere('availability.startAt <= :date AND availability.endAt >= :date', { date });
    }

    query.andWhere('services.id IS NOT NULL');
    return query.getMany();
  }

  async getProfessionalServices(professionalId: string) {
    const professional = await this.professionalRepository.findOne({
      where: { id: professionalId },
      relations: { user: true },
    });

    if (!professional) {
      throw new NotFoundException('Profesional no encontrado.');
    }

    const services = await this.serviceRepository.find({
      where: { professionalId },
      order: { createdAt: 'DESC' },
    });

    return services.map((service) => ({
      id: service.id,
      name: service.name,
      price: Number(service.price),
      mode: service.mode,
      professional: {
        id: professional.id,
        fullName: professional.user?.fullName ?? 'Profesional',
        specialty: professional.specialty,
      },
    }));
  }

  async createReservation(userId: string, dto: CreateReservationDto) {
    await this.requireRole(userId, Role.USER);

    const service = await this.serviceRepository.findOneBy({ id: dto.serviceId });
    if (!service || service.professionalId !== dto.professionalId) {
      throw new NotFoundException('Servicio no válido para el profesional.');
    }

    const scheduledAt = new Date(dto.scheduledAt);
    await this.ensureInsideAvailabilityWindow(dto.professionalId, scheduledAt);
    await this.ensureNoDoubleReservation(dto.professionalId, scheduledAt);

    const builder = new ReservationBuilder().setCore(
      userId,
      dto.professionalId,
      dto.serviceId,
      service.mode as unknown as ServiceMode, 
      scheduledAt,
    );

    if (service.mode === ServiceMode.ONLINE) {
      builder.setOnlineExtras(dto.onlineLink ?? `https://meet.jit.si/proconnect-${dto.professionalId.slice(0, 8)}-${Date.now()}`);
    } else {
      builder.setInPersonExtras(dto.travelAddress, dto.travelCost);
    }

    const draft = builder.build();

    const reservation = this.reservationRepository.create({
        userId: draft.userId,
        professionalId: draft.professionalId,
        serviceId: draft.serviceId,
        mode: draft.mode as ServiceMode,
        scheduledAt: draft.scheduledAt,
        onlineLink: draft.onlineLink,
        travelAddress: draft.travelAddress,
        travelCost: draft.travelCost,
        proposedPrice: dto.proposedPrice ?? null,
        negotiationMessage: dto.negotiationMessage ?? null,
        counterOfferPrice: null,
        counterOfferMessage: null,
        status: ReservationStatus.PENDING,
    });
    
    await this.reservationRepository.save(reservation);

    this.eventBus.emitReservationCreated({ reservation, actorUserId: userId });
    return reservation;
  }

  async respondReservation(userId: string, reservationId: string, dto: RespondReservationDto) {
    await this.requireRole(userId, Role.PROFESSIONAL);
    const reservation = await this.getReservationForParticipant(userId, reservationId);
    const professional = await this.requireProfessionalByUserId(userId);
    if (reservation.professionalId !== professional.id) {
      throw new ForbiddenException(this.unauthorizedMessage);
    }

    if (dto.action === 'ACCEPT') {
      reservation.status = ReservationStatus.CONFIRMED;
      reservation.counterOfferPrice = null;
      reservation.counterOfferMessage = null;
    }

    if (dto.action === 'REJECT') {
      reservation.status = ReservationStatus.CANCELLED;
    }

    if (dto.action === 'COUNTER') {
      if (!dto.counterPrice) {
        throw new ConflictException('Para contraofertar debes indicar un precio.');
      }
      reservation.counterOfferPrice = dto.counterPrice;
      reservation.counterOfferMessage = dto.counterMessage ?? null;
      reservation.status = ReservationStatus.PENDING;
    }

    await this.reservationRepository.save(reservation);
    this.eventBus.emitReservationUpdated({ reservation, actorUserId: userId });
    return reservation;
  }

  async acceptCounterOffer(userId: string, reservationId: string) {
    await this.requireRole(userId, Role.USER);
    const reservation = await this.getReservationForParticipant(userId, reservationId);
    if (reservation.userId !== userId) {
      throw new ForbiddenException(this.unauthorizedMessage);
    }
    if (!reservation.counterOfferPrice) {
      throw new ConflictException('No hay contraoferta pendiente para aceptar.');
    }

    reservation.proposedPrice = reservation.counterOfferPrice;
    reservation.counterOfferPrice = null;
    reservation.status = ReservationStatus.CONFIRMED;
    await this.reservationRepository.save(reservation);
    this.eventBus.emitReservationUpdated({ reservation, actorUserId: userId });
    return reservation;
  }

  async rescheduleReservation(userId: string, reservationId: string, dto: RescheduleReservationDto) {
    const reservation = await this.getReservationForParticipant(userId, reservationId);
    const nextDate = new Date(dto.scheduledAt);
    await this.ensureNoDoubleReservation(reservation.professionalId, nextDate, reservation.id);

    reservation.scheduledAt = nextDate;
    await this.reservationRepository.save(reservation);

    this.eventBus.emitReservationUpdated({ reservation, actorUserId: userId });
    return reservation;
  }

  async cancelReservation(userId: string, reservationId: string) {
    const reservation = await this.getReservationForParticipant(userId, reservationId);
    reservation.status = ReservationStatus.CANCELLED;
    await this.reservationRepository.save(reservation);

    this.eventBus.emitReservationCancelled({ reservation, actorUserId: userId });
    return reservation;
  }

  async openChat(userId: string, reservationId: string) {
    await this.getReservationForParticipant(userId, reservationId);
    // Crea la conversacion si no existe para la reserva.
    const existing = await this.conversationRepository.findOneBy({ reservationId });
    if(existing) return existing;
    
    const conversation = this.conversationRepository.create({ reservationId });
    return this.conversationRepository.save(conversation);
  }

  async sendMessage(userId: string, dto: SendMessageDto) {
    const reservation = await this.getReservationForParticipant(userId, dto.reservationId);
    const conversation = await this.openChat(userId, dto.reservationId);

    const message = this.messageRepository.create({
      conversationId: conversation.id,
      senderId: userId,
      content: dto.content,
    });
    await this.messageRepository.save(message);

    const professional = await this.professionalRepository.findOneBy({ id: reservation.professionalId });
    // La reserva siempre referencia un profesional valido.
    const receiverUserId = userId === reservation.userId ? professional!.userId : reservation.userId;
    
    this.eventBus.emitChatMessage({ message, reservationId: reservation.id, receiverUserId });
    this.gateway.pushMessage(dto.reservationId, message);

    return message;
  }

  async getChatHistory(userId: string, reservationId: string) {
    await this.getReservationForParticipant(userId, reservationId);
    let conversation = await this.conversationRepository.findOne({
      where: { reservationId },
      relations: { messages: true },
    });

    if (!conversation) {
      return { reservationId, messages: [] };
    }
    // Mantener el historial en orden cronologico.
    conversation.messages.sort((a,b) => a.createdAt.getTime() - b.createdAt.getTime());
    return conversation;
  }

  async generateInvoice(userId: string, reservationId: string) {
    const reservation = await this.getReservationForParticipant(userId, reservationId);

    const service = await this.serviceRepository.findOneBy({ id: reservation.serviceId });
    if (!service) throw new NotFoundException('Service not found');

    const factory = reservationFactoryByMode(reservation.mode as ServiceMode);
    const total = factory.getInvoiceTotal(Number(service.price), reservation.travelCost ? Number(reservation.travelCost) : 0);

    let invoice = await this.invoiceRepository.findOneBy({ reservationId });
    if (invoice) {
        invoice.total = total;
    } else {
        invoice = this.invoiceRepository.create({
            reservationId,
            professionalId: reservation.professionalId,
            total,
        });
    }
    return this.invoiceRepository.save(invoice);
  }

  async getInvoices(userId: string) {
    const professional = await this.professionalRepository.findOneBy({ userId });

    const query = this.invoiceRepository.createQueryBuilder('invoice')
        .leftJoinAndSelect('invoice.reservation', 'reservation')
        .orderBy('invoice.issuedAt', 'DESC');

    if (professional) {
         query.where('invoice.professionalId = :pid', { pid: professional.id })
              .orWhere('reservation.userId = :uid', { uid: userId });
    } else {
         query.where('reservation.userId = :uid', { uid: userId });
    }

    return query.getMany();
  }

  async createReview(userId: string, dto: CreateReviewDto) {
    await this.requireRole(userId, Role.USER);

    const completedReservation = await this.reservationRepository.findOne({
      where: {
        userId,
        professionalId: dto.professionalId,
        status: ReservationStatus.COMPLETED,
      },
      order: { scheduledAt: 'DESC' },
    });

    if (!completedReservation) {
      throw new ConflictException('Solo puedes calificar profesionales con servicios completados.');
    }

    const existingReview = await this.reviewRepository.findOne({
      where: {
        userId,
        professionalId: dto.professionalId,
      },
    });

    if (existingReview) {
      throw new ConflictException('Ya registraste una calificación para este profesional.');
    }

    const review = this.reviewRepository.create({
        userId,
        professionalId: dto.professionalId,
        rating: dto.rating,
        comment: dto.comment
    });
    return this.reviewRepository.save(review);
  }

  async getReputation(professionalId: string) {
     const reviews = await this.reviewRepository.find({
        where: { professionalId },
        order: { createdAt: 'DESC' }
     });

    const average = reviews.length > 0 ? reviews.reduce((acc, item) => acc + item.rating, 0) / reviews.length : 0;

    return {
      professionalId,
      average,
      count: reviews.length,
      reviews,
    };
  }

  private async requireUser(userId: string): Promise<User> {
    if (!userId) {
      throw new ForbiddenException('Debes autenticarte para continuar.');
    }

    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new ForbiddenException('Usuario inválido o sesión no encontrada.');
    }

    return user;
  }

  private async requireRole(userId: string, role: Role): Promise<User> {
    const user = await this.requireUser(userId);
    if (user.role !== role) {
      throw new ForbiddenException(`Acceso restringido: se requiere rol ${role}.`);
    }

    return user;
  }

  private async requireProfessionalByUserId(userId: string): Promise<ProfessionalProfile> {
    const profile = await this.professionalRepository.findOne({ where: { userId } });
    if (!profile) {
      throw new NotFoundException('Perfil profesional no encontrado.');
    }

    return profile;
  }

  private sanitizeUser(user: User) {
    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      birthDate: user.birthDate,
      nationalId: user.nationalId,
      phone: user.phone,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  private async ensureNoDoubleReservation(professionalId: string, scheduledAt: Date, excludeReservationId?: string): Promise<void> {
    const durationMs = 60 * 60 * 1000;
    const nextEnd = new Date(scheduledAt.getTime() + durationMs);

    const query = this.reservationRepository
      .createQueryBuilder('reservation')
      .where('reservation.professionalId = :professionalId', { professionalId })
      .andWhere('reservation.status IN (:...statuses)', {
        statuses: [ReservationStatus.PENDING, ReservationStatus.CONFIRMED],
      })
      .andWhere('reservation.scheduledAt < :nextEnd', { nextEnd })
      .andWhere("reservation.scheduledAt + INTERVAL '1 hour' > :nextStart", { nextStart: scheduledAt });

    if (excludeReservationId) {
      query.andWhere('reservation.id != :excludeReservationId', { excludeReservationId });
    }

    const existing = await query.getOne();

    if (existing) {
      throw new ConflictException('Ya existe una reserva en conflicto para este profesional dentro de ese rango horario.');
    }
  }

  private async ensureInsideAvailabilityWindow(professionalId: string, scheduledAt: Date): Promise<void> {
    const hasAnyAvailability = await this.availabilityRepository.exist({ where: { professionalId } });
    if (!hasAnyAvailability) {
      return;
    }

    const reservationEnd = new Date(scheduledAt.getTime() + 60 * 60 * 1000);
    const availableSlot = await this.availabilityRepository
      .createQueryBuilder('slot')
      .where('slot.professionalId = :professionalId', { professionalId })
      .andWhere('slot.startAt <= :startAt', { startAt: scheduledAt })
      .andWhere('slot.endAt >= :endAt', { endAt: reservationEnd })
      .getOne();

    if (!availableSlot) {
      throw new ConflictException('El horario solicitado está fuera de la disponibilidad del profesional.');
    }
  }

  private async getReservationForParticipant(userId: string, reservationId: string) {
    const reservation = await this.reservationRepository.findOneBy({ id: reservationId });
    if (!reservation) {
      throw new NotFoundException('Reserva no encontrada.');
    }

    const professional = await this.professionalRepository.findOneBy({ id: reservation.professionalId });

    if (!professional || (reservation.userId !== userId && professional.userId !== userId)) {
      throw new ForbiddenException(this.unauthorizedMessage);
    }

    return reservation;
  }
}
