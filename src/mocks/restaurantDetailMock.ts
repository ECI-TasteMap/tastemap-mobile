import { RestaurantDetailMock } from '../types/restaurant';

/**
 * Mock data for restaurant detail screen
 * Only includes fields not yet available from the backend
 */
export const restaurantDetailMock: RestaurantDetailMock = {
  averageRating: 4.8,
  reviewCount: 128,
  phone: '+57 310 555 0192',
  distanceLabel: '0.8 km',
  estimatedTimeLabel: '~10 min',
  openUntilLabel: 'Abierto hasta 10 PM',
  isOpen: true,
};

/**
 * Sample fallback restaurant for development
 * Used when backend data is unavailable
 */
export const sampleRestaurant = {
  id: '1',
  ownerId: 'owner-1',
  name: 'La Trattoria',
  description:
    'Auténtica cocina italiana en el corazón de Chapinero. Pastas artesanales, risottos cremosos y una selección de vinos importados que harán de tu velada algo especial.',
  logo: '',
  menu: 'Spaghetti Carbonara - $38.000, Risotto de Champiñones - $45.000, Tiramisu - $18.000, Vino Tinto Reserva - $55.000',
  theme: 'Italiana',
  locations: ['Cra 13 #67-42, Chapinero'],
  tags: ['Italiana', 'Auténtica', 'Pastas artesanales'],
  priceMin: 30000,
  priceMax: 100000,
  hour: 'Mar-Dom 12:00-22:00',
};
