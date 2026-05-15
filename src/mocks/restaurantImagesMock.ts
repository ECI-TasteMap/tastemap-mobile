/**
 * TEMPORARY — Logo overrides for restaurants whose backend logo is a placeholder.
 * Remove this file (and its usages in restaurantService.ts) once the backend
 * serves real image URLs per restaurant.
 *
 * Match priority: restaurant id (exact). Name is stored for readability only.
 */

interface RestaurantImageEntry {
  name: string;
  logo: string;
  images: string[];
}

const restaurantImagesById: Readonly<Record<string, RestaurantImageEntry>> = {
  '6a053a74ac2aaf23df80f85c': {
    name: 'Tokyo Ramen House',
    logo: 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400&q=80',
    images: [
      'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=800&q=80',
      'https://images.unsplash.com/photo-1591814468924-caf88d1232e1?w=800&q=80',
      'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=800&q=80',
    ],
  },
  '6a053a74ac2aaf23df80f85d': {
    name: 'Sushi Otaku',
    logo: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=400&q=80',
    images: [
      'https://images.unsplash.com/photo-1553621042-f6e147245754?w=800&q=80',
      'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=800&q=80',
      'https://images.unsplash.com/photo-1562802378-063ec186a863?w=800&q=80',
    ],
  },
  '6a053a74ac2aaf23df80f85e': {
    name: 'Manga Café',
    logo: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80',
    images: [
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80',
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80',
      'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&q=80',
    ],
  },
  '6a053a74ac2aaf23df80f85f': {
    name: 'Bella Italia',
    logo: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80',
    images: [
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80',
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
      'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=800&q=80',
    ],
  },
  '6a053a74ac2aaf23df80f860': {
    name: 'La Trattoria',
    logo: 'https://images.unsplash.com/photo-1551183053-bf91798d792a?w=400&q=80',
    images: [
      'https://images.unsplash.com/photo-1551183053-bf91798d792a?w=800&q=80',
      'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=800&q=80',
      'https://images.unsplash.com/photo-1481931098730-318b6f776db0?w=800&q=80',
    ],
  },
  '6a053a74ac2aaf23df80f861': {
    name: 'Burger Bros',
    logo: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80',
    images: [
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80',
      'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&q=80',
      'https://images.unsplash.com/photo-1586816001966-79b736744398?w=800&q=80',
    ],
  },
  '6a053a74ac2aaf23df80f862': {
    name: 'Smash & Co',
    logo: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=400&q=80',
    images: [
      'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=800&q=80',
      'https://images.unsplash.com/photo-1561758033-7e924f619b47?w=800&q=80',
      'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=800&q=80',
    ],
  },
  '6a053a74ac2aaf23df80f863': {
    name: 'Green Garden',
    logo: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80',
    images: [
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80',
      'https://images.unsplash.com/photo-1540914124281-342587941389?w=800&q=80',
      'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800&q=80',
    ],
  },
  '6a053a74ac2aaf23df80f864': {
    name: 'Raíces Vivas',
    logo: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&q=80',
    images: [
      'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80',
      'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&q=80',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80',
    ],
  },
  '6a053a74ac2aaf23df80f865': {
    name: 'El Mariachi',
    logo: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80',
    images: [
      'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&q=80',
      'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?w=800&q=80',
      'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=800&q=80',
    ],
  },
  '6a053a74ac2aaf23df80f866': {
    name: 'Taquería del Norte',
    logo: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400&q=80',
    images: [
      'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=800&q=80',
      'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=800&q=80',
      'https://images.unsplash.com/photo-1543340904-0eb4c42b3b1c?w=800&q=80',
    ],
  },
  '6a053a74ac2aaf23df80f867': {
    name: 'Mar y Sabor',
    logo: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&q=80',
    images: [
      'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80',
      'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&q=80',
      'https://images.unsplash.com/photo-1534482421-64566f976cfa?w=800&q=80',
    ],
  },
  '6a053a74ac2aaf23df80f868': {
    name: 'La Fonda Paisa',
    logo: 'https://images.unsplash.com/photo-1544025162-d76594e09e4f?w=400&q=80',
    images: [
      'https://images.unsplash.com/photo-1544025162-d76594e09e4f?w=800&q=80',
      'https://images.unsplash.com/photo-1529543544282-ea669407fca3?w=800&q=80',
      'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=800&q=80',
    ],
  },
  '6a053a74ac2aaf23df80f869': {
    name: 'The Cozy Corner',
    logo: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&q=80',
    images: [
      'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&q=80',
      'https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=800&q=80',
      'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80',
    ],
  },
  '6a053a74ac2aaf23df80f86a': {
    name: 'Steakhouse 57',
    logo: 'https://images.unsplash.com/photo-1558030006-450675393462?w=400&q=80',
    images: [
      'https://images.unsplash.com/photo-1558030006-450675393462?w=800&q=80',
      'https://images.unsplash.com/photo-1546964124-0cce460f38ef?w=800&q=80',
      'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=800&q=80',
    ],
  },
};

/** Returns true when the URL is a placeholder or invalid and should be overridden. */
function isMockLogo(url: string | null | undefined): boolean {
  if (!url) return true;
  if (url.includes('example.com')) return true;
  if (!url.startsWith('http://') && !url.startsWith('https://')) return true;
  return false;
}

/**
 * Returns the restaurant with its logo replaced by the Unsplash mock
 * if the backend logo is missing or a known placeholder.
 * All other fields (menu, averageRating, description, etc.) are untouched.
 */
export function applyRestaurantLogoMock<T extends { id: string; logo: string | null }>(
  restaurant: T
): T {
  if (!isMockLogo(restaurant.logo)) return restaurant;
  const entry = restaurantImagesById[restaurant.id];
  if (!entry) return restaurant;
  return { ...restaurant, logo: entry.logo };
}

/** Applies applyRestaurantLogoMock to every item in the array. */
export function applyRestaurantLogoMocks<T extends { id: string; logo: string | null }>(
  restaurants: T[]
): T[] {
  return restaurants.map(applyRestaurantLogoMock);
}
