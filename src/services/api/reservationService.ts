import apiClient from './apiClient';
import type { BackendReservation, BackendReservationCreate } from '../../types/reservation';

export async function getUserReservations(userId: string): Promise<BackendReservation[]> {
  const response = await apiClient.get<BackendReservation[]>(`/api/v1/reservations/user/${userId}`);
  return Array.isArray(response.data) ? response.data : [];
}

export async function createReservation(
  data: BackendReservationCreate
): Promise<BackendReservation> {
  const response = await apiClient.post<BackendReservation>('/api/v1/reservations', data);
  return response.data;
}

export async function deleteReservation(id: string): Promise<void> {
  await apiClient.delete(`/api/v1/reservations/${id}`);
}
