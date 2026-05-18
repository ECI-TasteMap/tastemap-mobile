import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { Session } from '@supabase/supabase-js';
import AuthNavigator from './AuthNavigator';
import UserStackNavigator from './UserStackNavigator';
import RestaurantStackNavigator from './RestaurantStackNavigator';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';
import { getUserByEmail } from '../services/api/userService';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

async function resolveRoleFromSession(
  session: Session,
  setToken: (t: string | null) => void,
  setUserId: (id: string | null) => void,
  setEmail: (e: string | null) => void,
  setBackendUserId: (id: string | null) => void,
  setRole: (r: 'user' | 'restaurant' | null) => void,
) {
  setToken(session.access_token);
  setUserId(session.user.id);
  const userEmail = session.user.email ?? null;
  setEmail(userEmail);

  // TODO: Replace with GET /api/v1/users/me when backend adds it
  if (userEmail) {
    try {
      const backendUser = await getUserByEmail(userEmail);
      if (backendUser) {
        setBackendUserId(backendUser.id);
        setRole(backendUser.role === 'OWNER' ? 'restaurant' : 'user');
        return;
      }
    } catch {
      // Backend unavailable — fall through to metadata fallback
    }
  }

  // Fallback: read role from Supabase metadata (set during registration).
  // Covers newly registered OWNER users not yet synced to the backend.
  const metadataRole = session.user.user_metadata?.role as string | undefined;
  setRole(metadataRole === 'OWNER' ? 'restaurant' : 'user');
}

export default function AppNavigator() {
  const { role, setToken, setRole, setUserId, setEmail, setBackendUserId } = useAuthStore();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setToken(null);
        setUserId(null);
        setEmail(null);
        setBackendUserId(null);
        setRole(null);
        return;
      }
      // TOKEN_REFRESHED: only refresh the token without re-querying the backend
      if (_event === 'TOKEN_REFRESHED') {
        setToken(session.access_token);
        return;
      }
      // INITIAL_SESSION (app launch restore) and SIGNED_IN (active login):
      // resolve role from backend so OWNER users reach the restaurant flow.
      void resolveRoleFromSession(session, setToken, setUserId, setEmail, setBackendUserId, setRole);
    });
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
