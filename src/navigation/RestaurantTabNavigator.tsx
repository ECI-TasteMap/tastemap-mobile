import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import RestaurantDashboard from '../screens/RestaurantDashboard';
import RestaurantReservations from '../screens/RestaurantReservations';
import RestaurantDetailOwner from '../screens/RestaurantDetailOwner';
import OwnerScreen from '../screens/OwnerScreen';
import { colors } from '../theme/colors';
import type { RestaurantTabParamList } from './types';

const Tab = createBottomTabNavigator<RestaurantTabParamList>();

const ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  Dashboard: 'stats-chart',
  Reservations: 'reader',
  MyLocal: 'restaurant',
  OwnerProfile: 'person',
};

export default function RestaurantTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          height: 70,
          backgroundColor: colors.bottomNavBackground,
          borderTopColor: '#3f4a5e',
          borderTopWidth: 1,
        },
        tabBarActiveTintColor: colors.gold,
        tabBarInactiveTintColor: 'rgba(240,234,220,0.4)',
        tabBarLabelStyle: { fontSize: 11 },
        tabBarIcon: ({ color, size }) => (
          <Ionicons name={ICONS[route.name]} size={size} color={color} />
        ),
      })}
    >
      <Tab.Screen name="Dashboard" component={RestaurantDashboard} options={{ tabBarLabel: 'Dashboard' }} />
      <Tab.Screen name="Reservations" component={RestaurantReservations} options={{ tabBarLabel: 'Reservas' }} />
      <Tab.Screen name="MyLocal" component={RestaurantDetailOwner} options={{ tabBarLabel: 'Mi local' }} />
      <Tab.Screen name="OwnerProfile" component={OwnerScreen} options={{ tabBarLabel: 'Perfil' }} />
    </Tab.Navigator>
  );
}
