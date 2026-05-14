import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthNavigator from './AuthNavigator';
import UserStackNavigator from './UserStackNavigator';
import RestaurantStackNavigator from './RestaurantStackNavigator';
import { useAuthStore } from '../store/authStore';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const role = useAuthStore((s) => s.role);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
      {role === null && <Stack.Screen name="Auth" component={AuthNavigator} />}
      {role === 'user' && <Stack.Screen name="UserApp" component={UserStackNavigator} />}
      {role === 'restaurant' && (
        <Stack.Screen name="RestaurantApp" component={RestaurantStackNavigator} />
      )}
    </Stack.Navigator>
  );
}
