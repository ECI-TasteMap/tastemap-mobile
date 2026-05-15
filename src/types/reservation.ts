// ── Backend DTOs (exact match with ReservationResponseDto / ReservationRequestDto) ──

export interface BackendLocalTime {
  hour: number;
  minute: number;
  second: number;
  nano: number;
}

export interface BackendReservation {
  id: string;
  userId: string;
  restaurantId: string;
  date: string; // ISO date: "2026-05-14"
  time: BackendLocalTime;
  numberOfGuests: number;
  specialRequests?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BackendReservationCreate {
  userId: string;
  restaurantId: string;
  date: string; // ISO date: "2026-05-14"
  time: BackendLocalTime;
  numberOfGuests: number;
  specialRequests?: string;
}

// ── UI model (displayed in UserReservationsScreen / ReservationCard) ──────────
// Backend has no status field — we derive: upcoming → confirmed, past → completed.
// Cancelled reservations are removed from the backend (DELETE), not status-updated.

export type ReservationStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';
export type ReservationType = 'upcoming' | 'past';

export interface UserReservation {
  id: string;
  restaurantId: string;
  restaurantName: string;
  restaurantEmoji: string;
  restaurantLogo?: string;
  dateLabel: string;
  timeLabel: string;
  peopleCount: number;
  specialRequests?: string;
  status: ReservationStatus;
  type: ReservationType;
  canCancel: boolean;
}
