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

export async function getRestaurantReservations(restaurantId: string): Promise<BackendReservation[]> {
  const response = await apiClient.get<BackendReservation[]>(
    `/api/v1/reservations/restaurant/${restaurantId}`
  );
  return Array.isArray(response.data) ? response.data : [];
}

// date must be ISO format: YYYY-MM-DD
export async function getRestaurantReservationsByDate(
  restaurantId: string,
  date: string
): Promise<BackendReservation[]> {
  const response = await apiClient.get<BackendReservation[]>(
    `/api/v1/reservations/restaurant/${restaurantId}/date/${date}`
  );
  return Array.isArray(response.data) ? response.data : [];
}
