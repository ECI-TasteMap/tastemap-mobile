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
