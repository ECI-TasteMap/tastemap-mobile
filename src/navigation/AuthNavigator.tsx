import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import UserLoginScreen from '../screens/UserLoginScreen';
import RestaurantLoginScreen from '../screens/RestaurantLoginScreen';
import UserRegisterScreen from '../screens/auth/UserRegisterScreen';
import RestaurantRegisterScreen from '../screens/auth/RestaurantRegisterScreen';
import VerifyEmailCodeScreen from '../screens/auth/VerifyEmailCodeScreen';
import type { AuthStackParamList } from './types';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
      <Stack.Screen name="UserLogin" component={UserLoginScreen} />
      <Stack.Screen name="RestaurantLogin" component={RestaurantLoginScreen} />
      <Stack.Screen name="UserRegister" component={UserRegisterScreen} />
      <Stack.Screen name="RestaurantRegister" component={RestaurantRegisterScreen} />
      <Stack.Screen
        name="VerifyEmailCode"
        component={VerifyEmailCodeScreen}
        options={{ animation: 'slide_from_right' }}
      />
    </Stack.Navigator>
  );
}
