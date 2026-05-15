import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createReservation } from '../services/api/reservationService';
import type { BackendReservationCreate } from '../types/reservation';

export function useCreateReservation(userId: string | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: BackendReservationCreate) => createReservation(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['reservations', 'user', userId] });
    },
  });
}
