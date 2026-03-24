import { ServiceMode } from '../entities/enums';

export interface ReservationDraft {
  userId: string;
  professionalId: string;
  serviceId: string;
  mode: ServiceMode;
  scheduledAt: Date;
  onlineLink?: string;
  travelAddress?: string;
  travelCost?: number;
}

export class ReservationBuilder {
  private draft: Partial<ReservationDraft> = {};

  setCore(userId: string, professionalId: string, serviceId: string, mode: ServiceMode, scheduledAt: Date): this {
    this.draft = { userId, professionalId, serviceId, mode, scheduledAt };
    return this;
  }

  setOnlineExtras(onlineLink: string): this {
    this.draft.onlineLink = onlineLink;
    this.draft.travelAddress = undefined;
    this.draft.travelCost = undefined;
    return this;
  }

  setInPersonExtras(travelAddress?: string, travelCost?: number): this {
    this.draft.travelAddress = travelAddress;
    this.draft.travelCost = travelCost;
    this.draft.onlineLink = undefined;
    return this;
  }

  build(): ReservationDraft {
    const { userId, professionalId, serviceId, mode, scheduledAt } = this.draft as ReservationDraft;
    if (!userId || !professionalId || !serviceId || !mode || !scheduledAt) {
      throw new Error('Reservation core data is incomplete.');
    }

    return {
      userId,
      professionalId,
      serviceId,
      mode,
      scheduledAt,
      onlineLink: this.draft.onlineLink,
      travelAddress: this.draft.travelAddress,
      travelCost: this.draft.travelCost,
    };
  }
}
