import apiClient from './apiClient';
import { restaurantListMock } from '../../mocks/restaurantListMock';
import type { Restaurant } from '../../types/restaurant';

/**
 * Minimum number of restaurants before dev mock data is injected.
 * Only active when __DEV__ === true (never in production builds).
 */
const DEV_MIN_RESTAURANTS = 5;

export async function getRestaurants(): Promise<Restaurant[]> {
  const response = await apiClient.get<Restaurant[]>('/api/v1/restaurants');
  const backendData: Restaurant[] = Array.isArray(response.data) ? response.data : [];

  // In development, pad the list with local mock data when the backend
  // doesn't have enough restaurants (e.g. after a Render DB reset).
  if (__DEV__ && backendData.length < DEV_MIN_RESTAURANTS) {
    const backendIds = new Set(backendData.map((r) => r.id));
    const fillers = restaurantListMock.filter((m) => !backendIds.has(m.id));
    return [...backendData, ...fillers];
  }

  return backendData;
}

export async function getRestaurantById(restaurantId: string): Promise<Restaurant> {
  const response = await apiClient.get<Restaurant>(`/api/v1/restaurants/${restaurantId}`);
  return response.data;
}
