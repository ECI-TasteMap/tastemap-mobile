import apiClient from './apiClient';
import { Restaurant } from '../../types/restaurant';

/**
 * Fetch restaurant details by ID
 */
export async function getRestaurantById(restaurantId: string): Promise<Restaurant> {
  const response = await apiClient.get<Restaurant>(`/api/v1/restaurants/${restaurantId}`);
  return response.data;
}

/**
 * Fetch all restaurants
 */
export async function getAllRestaurants(): Promise<Restaurant[]> {
  const response = await apiClient.get<Restaurant[]>('/api/v1/restaurants');
  return response.data;
}
