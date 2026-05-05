import { useLocalSearchParams } from 'expo-router';
import RestaurantDetailScreen from '../src/screens/RestaurantDetailScreen';

export default function RestaurantDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <RestaurantDetailScreen restaurantId={id || '1'} />;
}
