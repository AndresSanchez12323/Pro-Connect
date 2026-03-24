import { Body, Controller, Get, Headers, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { CreateAvailabilityDto, CreateProfessionalProfileDto, CreateReservationDto, CreateReviewDto, CreateServiceDto, LoginDto, OpenChatDto, RegisterDto, RequestPasswordRecoveryDto, RescheduleReservationDto, ResetPasswordDto, RespondReservationDto, SendMessageDto, UpdateMeDto, UpdateProfessionalProfileDto } from './dto/pro-connect.dto';
import { ProConnectFacade } from './pro-connect.facade';

@Controller()
export class ProConnectController {
  constructor(private readonly facade: ProConnectFacade) {}

  @Get('health')
  health(): { status: string } {
    return { status: 'ok' };
  }

  @Post('auth/register')
  register(@Body() dto: RegisterDto) {
    return this.facade.register(dto);
  }

  @Post('auth/login')
  login(@Body() dto: LoginDto) {
    return this.facade.login(dto);
  }

  @Post('auth/recover-password/request')
  requestPasswordRecovery(@Body() dto: RequestPasswordRecoveryDto) {
    return this.facade.requestPasswordRecovery(dto);
  }

  @Post('auth/recover-password/reset')
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.facade.resetPassword(dto);
  }

  @Get('auth/me')
  me(@Headers('x-user-id') userId: string) {
    return this.facade.getSessionUser(userId);
  }

  @Patch('auth/me')
  updateMe(@Headers('x-user-id') userId: string, @Body() dto: UpdateMeDto) {
    return this.facade.updateSessionUser(userId, dto);
  }

  @Get('services/mine')
  getMyServices(@Headers('x-user-id') userId: string) {
    return this.facade.getMyServices(userId);
  }

  @Get('reservations/mine')
  getMyReservations(@Headers('x-user-id') userId: string) {
    return this.facade.getMyReservations(userId);
  }

  @Get('chat/mine')
  getMyConversations(@Headers('x-user-id') userId: string) {
    return this.facade.getMyConversations(userId);
  }

  @Get('notifications/mine')
  getMyNotifications(@Headers('x-user-id') userId: string) {
    return this.facade.getMyNotifications(userId);
  }

  @Patch('notifications/:notificationId/read')
  markNotificationRead(@Headers('x-user-id') userId: string, @Param('notificationId', ParseUUIDPipe) notificationId: string) {
    return this.facade.markNotificationRead(userId, notificationId);
  }

  @Get('dashboard/client/summary')
  getClientSummary(@Headers('x-user-id') userId: string) {
    return this.facade.getClientSummary(userId);
  }

  @Get('dashboard/professional/summary')
  getProfessionalSummary(@Headers('x-user-id') userId: string) {
    return this.facade.getProfessionalSummary(userId);
  }

  @Post('profiles')
  createProfile(@Headers('x-user-id') userId: string, @Body() dto: CreateProfessionalProfileDto) {
    return this.facade.createProfessionalProfile(userId, dto);
  }

  @Patch('profiles/:profileId')
  updateProfile(@Headers('x-user-id') userId: string, @Param('profileId', ParseUUIDPipe) profileId: string, @Body() dto: UpdateProfessionalProfileDto) {
    return this.facade.updateProfessionalProfile(userId, profileId, dto);
  }

  @Post('services')
  createService(@Headers('x-user-id') userId: string, @Body() dto: CreateServiceDto) {
    return this.facade.createService(userId, dto);
  }

  @Post('availability')
  createAvailability(@Headers('x-user-id') userId: string, @Body() dto: CreateAvailabilityDto) {
    return this.facade.createAvailability(userId, dto);
  }

  @Get('professionals/search')
  searchProfessionals(
    @Query('specialty') specialty?: string,
    @Query('mode') mode?: 'ONLINE' | 'IN_PERSON',
    @Query('date') date?: string,
  ) {
    return this.facade.searchProfessionals({ specialty, mode, date });
  }

  @Get('professionals/:professionalId/services')
  getProfessionalServices(@Param('professionalId', ParseUUIDPipe) professionalId: string) {
    return this.facade.getProfessionalServices(professionalId);
  }

  @Post('reservations')
  createReservation(@Headers('x-user-id') userId: string, @Body() dto: CreateReservationDto) {
    return this.facade.createReservation(userId, dto);
  }

  @Patch('reservations/:reservationId/reschedule')
  rescheduleReservation(
    @Headers('x-user-id') userId: string,
    @Param('reservationId', ParseUUIDPipe) reservationId: string,
    @Body() dto: RescheduleReservationDto,
  ) {
    return this.facade.rescheduleReservation(userId, reservationId, dto);
  }

  @Patch('reservations/:reservationId/cancel')
  cancelReservation(@Headers('x-user-id') userId: string, @Param('reservationId', ParseUUIDPipe) reservationId: string) {
    return this.facade.cancelReservation(userId, reservationId);
  }

  @Patch('reservations/:reservationId/respond')
  respondReservation(
    @Headers('x-user-id') userId: string,
    @Param('reservationId', ParseUUIDPipe) reservationId: string,
    @Body() dto: RespondReservationDto,
  ) {
    return this.facade.respondReservation(userId, reservationId, dto);
  }

  @Patch('reservations/:reservationId/accept-counter')
  acceptCounterOffer(@Headers('x-user-id') userId: string, @Param('reservationId', ParseUUIDPipe) reservationId: string) {
    return this.facade.acceptCounterOffer(userId, reservationId);
  }

  @Post('chat/open')
  openChat(@Headers('x-user-id') userId: string, @Body() dto: OpenChatDto) {
    return this.facade.openChat(userId, dto.reservationId);
  }

  @Post('chat/message')
  sendMessage(@Headers('x-user-id') userId: string, @Body() dto: SendMessageDto) {
    return this.facade.sendMessage(userId, dto);
  }

  @Get('chat/:reservationId')
  getChat(@Headers('x-user-id') userId: string, @Param('reservationId', ParseUUIDPipe) reservationId: string) {
    return this.facade.getChatHistory(userId, reservationId);
  }

  @Post('invoices/generate/:reservationId')
  generateInvoice(@Headers('x-user-id') userId: string, @Param('reservationId', ParseUUIDPipe) reservationId: string) {
    return this.facade.generateInvoice(userId, reservationId);
  }

  @Get('invoices')
  getInvoices(@Headers('x-user-id') userId: string) {
    return this.facade.getInvoices(userId);
  }

  @Post('reviews')
  createReview(@Headers('x-user-id') userId: string, @Body() dto: CreateReviewDto) {
    return this.facade.createReview(userId, dto);
  }

  @Get('reputation/:professionalId')
  getReputation(@Param('professionalId', ParseUUIDPipe) professionalId: string) {
    return this.facade.getReputation(professionalId);
  }
}
