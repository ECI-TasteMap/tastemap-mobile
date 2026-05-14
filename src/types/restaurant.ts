/**
 * Restaurant DTO matching the real backend response.
 * GET /api/v1/restaurants  and  GET /api/v1/restaurants/:id
 */
export interface Restaurant {
  id: string;
  ownerId: string;
  name: string;
  description: string;
  /** Can be null when the owner has not uploaded a logo yet. */
  logo: string | null;
  /** Can be null when the owner has not uploaded a menu yet. */
  menu: string | null;
  theme?: string;
  locations: string[];
  tags: string[];
  priceMin: number;
  priceMax: number;
  hour?: string;
  /** Nullable — not all restaurants have a phone number registered. */
  phone?: string | null;
  /** "ABIERTO" | "CERRADO" — derive isOpen with: openStatus === "ABIERTO" */
  openStatus?: string;
  // TODO: request backend to add reservationUrl to the DTO
  reservationUrl?: string;
}

/**
 * Fields that the backend does NOT provide yet.
 * Used as a local overlay until real endpoints exist.
 */
export interface RestaurantDetailMock {
  /** TODO: GET /api/v1/restaurants/:id/stats (rating endpoint pending) */
  averageRating: number;
  /** TODO: count from GET /api/v1/restaurants/:id/reviews */
  reviewCount: number;
  /** TODO: compute from user GPS + restaurant coords */
  distanceLabel: string;
  /** TODO: compute from distance */
  estimatedTimeLabel: string;
  /** TODO: compute from hour + openStatus */
  openUntilLabel: string;
  /** Derived from openStatus — kept here so UI code has a single boolean. */
  isOpen: boolean;
}

/**
 * Combined shape used by RestaurantDetailScreen.
 * Real backend fields + local mock overlay for missing ones.
 */
export interface RestaurantDetail extends Restaurant, RestaurantDetailMock {}
