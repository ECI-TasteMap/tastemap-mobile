import type { RestaurantDetailMock } from '../types/restaurant';

/**
 * Local overlay for fields the backend does NOT provide yet.
 * phone and openStatus now come from the real API — do not add them here.
 */
export const restaurantDetailMock: RestaurantDetailMock = {
  reviewCount: 128,
  distanceLabel: '0.8 km',
  estimatedTimeLabel: '~10 min',
  openUntilLabel: 'Abierto hasta 10 PM',
  isOpen: true, // overridden at runtime using openStatus from the API
};

/**
 * Fallback restaurant used when the network request fails entirely.
 * Keeps the screen functional during development / offline mode.
 */
export const sampleRestaurant = {
  id: '1',
  ownerId: 'owner-1',
  name: 'La Trattoria',
  description:
    'Auténtica cocina italiana en el corazón de Chapinero. Pastas artesanales, risottos cremosos y una selección de vinos importados que harán de tu velada algo especial.',
  logo: null,
  menu: 'Spaghetti Carbonara - $38.000, Risotto de Champiñones - $45.000, Tiramisu - $18.000, Vino Tinto Reserva - $55.000',
  theme: 'Italiana',
  locations: ['Cra 13 #67-42, Chapinero'],
  tags: ['Italiana', 'Auténtica', 'Pastas artesanales'],
  priceMin: 30000,
  priceMax: 100000,
  hour: 'Mar-Dom 12:00-22:00',
  phone: null,
  openStatus: 'CERRADO',
};
