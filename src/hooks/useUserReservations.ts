import { useQuery } from '@tanstack/react-query';
import { getUserReservations } from '../services/api/reservationService';
import type {
  BackendReservation,
  UserReservation,
  ReservationStatus,
  ReservationType,
} from '../types/reservation';

function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-').map(Number);
  // Construct date in local time to avoid UTC-offset shift
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('es-CO', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

function formatTime(time: BackendReservation['time']): string {
  return `${String(time.hour).padStart(2, '0')}:${String(time.minute).padStart(2, '0')}`;
}

function resolveType(isoDate: string): ReservationType {
  const [year, month, day] = isoDate.split('-').map(Number);
  const resDate = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return resDate >= today ? 'upcoming' : 'past';
}

function toUserReservation(r: BackendReservation): UserReservation {
  const type = resolveType(r.date);
  const status: ReservationStatus = type === 'upcoming' ? 'confirmed' : 'completed';
  return {
    id: r.id,
    restaurantId: r.restaurantId,
    restaurantName: 'Restaurante', // enriched in UserReservationsScreen via useRestaurants cache
    restaurantEmoji: '🍽️',
    dateLabel: formatDate(r.date),
    timeLabel: formatTime(r.time),
    peopleCount: r.numberOfGuests,
    specialRequests: r.specialRequests,
    status,
    type,
    canCancel: type === 'upcoming',
  };
}

export function useUserReservations(userId: string | null) {
  return useQuery({
    queryKey: ['reservations', 'user', userId],
    queryFn: async () => {
      if (!userId) return [];
      const data = await getUserReservations(userId);
      return data.map(toUserReservation);
    },
    enabled: Boolean(userId),
  });
}
