import apiClient from './apiClient';
import { Restaurant } from '../../types/restaurant';

export async function getRestaurants(): Promise<Restaurant[]> {
  const response = await apiClient.get<Restaurant[]>('/api/v1/restaurants');
  return response.data;
}

export async function getRestaurantById(restaurantId: string): Promise<Restaurant> {
  const response = await apiClient.get<Restaurant>(`/api/v1/restaurants/${restaurantId}`);
  return response.data;
}