import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import UserTabNavigator from './UserTabNavigator';
import RestaurantDetailScreen from '../screens/RestaurantDetailScreen';
import CreateReservationScreen from '../screens/reservations/CreateReservationScreen';
import type { UserStackParamList } from './types';

const Stack = createNativeStackNavigator<UserStackParamList>();

export default function UserStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="UserTabs" component={UserTabNavigator} />
      <Stack.Screen
        name="RestaurantDetail"
        component={RestaurantDetailScreen}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name="CreateReservation"
        component={CreateReservationScreen}
        options={{ animation: 'slide_from_right' }}
      />
    </Stack.Navigator>
  );
}
