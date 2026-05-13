/**
 * Restaurant type matching the backend DTO
 */
export interface Restaurant {
  id: string;
  ownerId: string;
  name: string;
  description: string;
  logo?: string;
  menu: string; // Plain text, comma/semicolon separated items, URL, or PDF link
  theme?: string;
  locations: string[];
  tags: string[];
  priceMin: number;
  priceMax: number;
  hour?: string;
  // TODO: add reservationUrl to backend DTO (GET /api/v1/restaurants/:id)
  reservationUrl?: string;
}

/**
 * Mock-only fields not yet available from the backend
 */
export interface RestaurantDetailMock {
  averageRating: number;
  reviewCount: number;
  phone: string;
  distanceLabel: string;
  estimatedTimeLabel: string;
  openUntilLabel: string;
  isOpen: boolean;
}

/**
 * Combined restaurant detail (API data + mock data for missing fields)
 */
export interface RestaurantDetail extends Restaurant, RestaurantDetailMock {}
