import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import RestaurantDashboard from '../screens/RestaurantDashboard';
import RestaurantReservations from '../screens/RestaurantReservations';
import RestaurantDetailOwner from '../screens/RestaurantDetailOwner';
import OwnerScreen from '../screens/OwnerScreen';

const Tab = createBottomTabNavigator();

export default function RestaurantBottomNavBar() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          height: 70,
          backgroundColor: '#091727',
          borderTopColor: '#3f4a5e',
        },
        tabBarActiveTintColor:   '#c9a96e',
        tabBarInactiveTintColor: 'rgba(240,234,220,0.4)',
        tabBarLabelStyle: { fontSize: 11 },
        tabBarIcon: ({ color, size }) => {
          const icons: Record<string, any> = {
            Dashboard: 'stats-chart',
            Reservas:  'reader',
            'Mi local': 'restaurant',
            Perfil:    'person',
          };
          return <Ionicons name={icons[route.name]} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard"  component={RestaurantDashboard} />
      <Tab.Screen name="Reservas"   component={RestaurantReservations} />
      <Tab.Screen name="Mi local"   component={RestaurantDetailOwner} />
      <Tab.Screen name="Perfil"     component={OwnerScreen} />
    </Tab.Navigator>
  );
}