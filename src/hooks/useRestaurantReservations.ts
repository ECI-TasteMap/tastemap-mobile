import { useQuery } from '@tanstack/react-query';
import {
  getRestaurantReservations,
  getRestaurantReservationsByDate,
} from '../services/api/reservationService';

export function useRestaurantReservations(restaurantId: string | null) {
  return useQuery({
    queryKey: ['reservations', 'restaurant', restaurantId],
    queryFn: () => getRestaurantReservations(restaurantId!),
    enabled: Boolean(restaurantId),
    staleTime: 60_000,
  });
}

export function useRestaurantReservationsByDate(restaurantId: string | null, date: string) {
  return useQuery({
    queryKey: ['reservations', 'restaurant', restaurantId, 'date', date],
    queryFn: () => getRestaurantReservationsByDate(restaurantId!, date),
    enabled: Boolean(restaurantId) && Boolean(date),
    staleTime: 60_000,
  });
}
