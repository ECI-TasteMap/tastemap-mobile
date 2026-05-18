import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateRestaurant } from '../services/api/restaurantService';

interface UpdateRestaurantVars {
  restaurantId: string;
  formData: FormData;
}

export function useUpdateRestaurant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ restaurantId, formData }: UpdateRestaurantVars) =>
      updateRestaurant(restaurantId, formData),
    onSuccess: (_, { restaurantId }) => {
      void queryClient.invalidateQueries({ queryKey: ['restaurants'] });
      void queryClient.invalidateQueries({ queryKey: ['restaurant', restaurantId] });
    },
  });
}
