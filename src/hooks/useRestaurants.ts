import { useQuery } from '@tanstack/react-query';
import { getRestaurants } from '../services/api/restaurantService';

export function useRestaurants() {
  return useQuery({
    queryKey: ['restaurants'],
    queryFn: getRestaurants,
    staleTime: 5 * 60 * 1000,
  });
}
