import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import UserLoginScreen from '../screens/UserLoginScreen';
import RestaurantLoginScreen from '../screens/RestaurantLoginScreen';
import type { AuthStackParamList } from './types';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
      <Stack.Screen name="UserLogin" component={UserLoginScreen} />
      <Stack.Screen name="RestaurantLogin" component={RestaurantLoginScreen} />
    </Stack.Navigator>
  );
}
