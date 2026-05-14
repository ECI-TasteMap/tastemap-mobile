import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteReservation } from '../services/api/reservationService';

export function useCancelReservation(userId: string | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reservationId: string) => deleteReservation(reservationId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['reservations', 'user', userId] });
    },
  });
}
