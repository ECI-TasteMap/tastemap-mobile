import { useQuery } from '@tanstack/react-query';
import { getRestaurantById } from '../services/api/restaurantService';

export function useRestaurantById(restaurantId: string) {
  return useQuery({
    queryKey: ['restaurant', restaurantId],
    queryFn: () => getRestaurantById(restaurantId),
    staleTime: 5 * 60 * 1000,
    enabled: !!restaurantId,
  });
}
