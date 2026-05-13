import apiClient from './apiClient';

export interface UserProfile {
  id: string;
  fullname: string;
  email: string;
  role: string;
}

export async function getUserById(id: string): Promise<UserProfile> {
  const response = await apiClient.get<UserProfile>(`/api/v1/users/${id}`);
  return response.data;
}
