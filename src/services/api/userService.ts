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

// TODO: Replace with GET /api/v1/users/me or GET /api/v1/users/by-email?email=X when backend adds it.
// Fetches all users and filters client-side — temporary until a targeted endpoint exists.
export async function getAllUsers(): Promise<UserProfile[]> {
  const response = await apiClient.get<UserProfile[]>('/api/v1/users');
  return Array.isArray(response.data) ? response.data : [];
}

export async function getUserByEmail(email: string): Promise<UserProfile | null> {
  const users = await getAllUsers();
  return users.find((u) => u.email === email) ?? null;
}
