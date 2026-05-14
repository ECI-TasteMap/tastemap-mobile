export type ReservationStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';
export type ReservationType = 'upcoming' | 'past';

export interface UserReservation {
  id: string;
  restaurantName: string;
  restaurantEmoji: string;
  restaurantLogo?: string;
  dateLabel: string;
  timeLabel: string;
  peopleCount: number;
  status: ReservationStatus;
  type: ReservationType;
  canCancel: boolean;
  // TODO: use to open external booking link (POST /api/v1/reservations/:id/cancel not yet available)
  externalReservationUrl?: string;
}
