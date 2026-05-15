import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthNavigator from './AuthNavigator';
import UserStackNavigator from './UserStackNavigator';
import RestaurantStackNavigator from './RestaurantStackNavigator';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const { role, setToken, setRole, setUserId } = useAuthStore();

  useEffect(() => {
  supabase.auth.getSession().then(({ data: { session } }) => {
    if (session?.access_token) {
      setToken(session.access_token);
      setUserId(session.user.id);
      setRole('user');
    }
  });

  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (_event, session) => {
      setToken(session?.access_token ?? null);
      setUserId(session?.user?.id ?? null);
      if (session?.user) {
        setRole('user');
      } else {
        setRole(null);
      }
    }
  );
  return () => subscription.unsubscribe();
}, []);

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