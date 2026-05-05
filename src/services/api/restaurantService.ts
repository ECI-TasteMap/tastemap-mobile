const BASE_URL = 'https://tastemapbackend.onrender.com';

export const getRestaurants = async () => {
  const response = await fetch(`${BASE_URL}/api/v1/restaurants`);
  if (!response.ok) throw new Error('Error al obtener restaurantes');
  return response.json();
};
