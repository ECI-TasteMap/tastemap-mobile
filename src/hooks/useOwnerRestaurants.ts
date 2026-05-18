import { useQuery } from '@tanstack/react-query';
import { getRestaurantsByOwnerId } from '../services/api/restaurantService';

export function useOwnerRestaurants(ownerId: string | null) {
  return useQuery({
    queryKey: ['restaurants', 'owner', ownerId],
    queryFn: () => getRestaurantsByOwnerId(ownerId!),
    enabled: Boolean(ownerId),
    staleTime: 2 * 60 * 1000,
  });
}
