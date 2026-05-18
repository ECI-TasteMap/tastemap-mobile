import apiClient from './apiClient';
import { restaurantsMock } from '../../mocks/restaurantsMock';
import { applyRestaurantLogoMock, applyRestaurantLogoMocks } from '../../mocks/restaurantImagesMock';
import type { Restaurant } from '../../types/restaurant';

export async function getRestaurants(): Promise<Restaurant[]> {
  try {
    const response = await apiClient.get<Restaurant[]>('/api/v1/restaurants');
    const backendData: Restaurant[] = Array.isArray(response.data) ? response.data : [];
    if (backendData.length > 0) {
      // Apply logo overrides only — all other fields (averageRating, menu, etc.) stay as-is.
      return applyRestaurantLogoMocks(backendData);
    }
    return restaurantsMock;
  } catch {
    // Backend unreachable — return presentable fallback so the UI stays functional.
    return restaurantsMock;
  }
}

export async function getRestaurantById(restaurantId: string): Promise<Restaurant> {
  const response = await apiClient.get<Restaurant>(`/api/v1/restaurants/${restaurantId}`);
  return applyRestaurantLogoMock(response.data);
}

// TODO: Replace filter with GET /api/v1/restaurants/owner/{ownerId} when backend adds it.
// Fetches all restaurants and filters by ownerId client-side.
export async function getRestaurantsByOwnerId(ownerId: string): Promise<Restaurant[]> {
  const response = await apiClient.get<Restaurant[]>('/api/v1/restaurants');
  const all: Restaurant[] = Array.isArray(response.data) ? response.data : [];
  return applyRestaurantLogoMocks(all.filter((r) => r.ownerId === ownerId));
}

export async function createRestaurant(formData: FormData): Promise<Restaurant> {
  const response = await apiClient.post<Restaurant>('/api/v1/restaurants', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
}

export async function updateRestaurant(restaurantId: string, formData: FormData): Promise<Restaurant> {
  const response = await apiClient.put<Restaurant>(`/api/v1/restaurants/${restaurantId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
}
