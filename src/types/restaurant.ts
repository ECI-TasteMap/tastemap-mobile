/**
 * Restaurant type matching the backend DTO
 */
export interface Restaurant {
  id: string;
  ownerId: string;
  name: string;
  description: string;
  logo?: string; // URL to restaurant logo or fallback
  menu: string; // Plain text, comma/semicolon separated items, URL, or PDF link
  theme?: string; // e.g., 'Italiana', 'Mexicana', etc.
  locations: string[];
  tags: string[]; // e.g., ['Auténtica', 'Pastas artesanales']
  priceMin: number;
  priceMax: number;
  hour?: string; // Opening/closing hours if available from backend
}

/**
 * Mock-specific data for restaurant detail screen
 * This data doesn't come from the backend yet
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
 * Combined restaurant detail with mock data
 */
export interface RestaurantDetail extends Restaurant, RestaurantDetailMock {}
