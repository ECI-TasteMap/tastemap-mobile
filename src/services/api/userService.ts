const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export const getUserById = async (id: string) => {
  const response = await fetch(`${BASE_URL}/users/${id}`);
  if (!response.ok) throw new Error('Error al obtener usuario');
  return response.json();
};
