import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RestaurantTabNavigator from './RestaurantTabNavigator';
import RestaurantNewLocal from '../screens/RestaurantNewLocal';
import type { RestaurantStackParamList } from './types';

const Stack = createNativeStackNavigator<RestaurantStackParamList>();

export default function RestaurantStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="RestaurantTabs" component={RestaurantTabNavigator} />
      <Stack.Screen
        name="NewLocal"
        component={RestaurantNewLocal}
        options={{ animation: 'slide_from_bottom' }}
      />
    </Stack.Navigator>
  );
}
