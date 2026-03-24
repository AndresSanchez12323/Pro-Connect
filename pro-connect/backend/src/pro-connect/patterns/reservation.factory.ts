import { ServiceMode } from '../entities/enums';

export interface ReservationFactory {
  getNotificationChannel(): string;
  getInvoiceTotal(basePrice: number, travelCost?: number): number;
}

class OnlineReservationFactory implements ReservationFactory {
  getNotificationChannel(): string {
    return 'EMAIL';
  }

  getInvoiceTotal(basePrice: number): number {
    return Math.max(basePrice * 0.9, 0);
  }
}

class InPersonReservationFactory implements ReservationFactory {
  getNotificationChannel(): string {
    return 'SMS';
  }

  getInvoiceTotal(basePrice: number, travelCost = 0): number {
    return basePrice + travelCost;
  }
}

export function reservationFactoryByMode(mode: ServiceMode): ReservationFactory {
  return mode === ServiceMode.ONLINE ? new OnlineReservationFactory() : new InPersonReservationFactory();
}

export function notificationChannelFromMode(mode: ServiceMode): string {
  return reservationFactoryByMode(mode).getNotificationChannel();
}
