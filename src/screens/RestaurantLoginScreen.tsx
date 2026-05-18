import React, { useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import LoginTemplate from '../components/LoginTemplate';
import { colors } from '../theme/colors';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';
import { getUserByEmail } from '../services/api/userService';
import type { AuthStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'RestaurantLogin'>;

export default function RestaurantLoginScreen() {
  const navigation = useNavigation<Nav>();
  const { setRole, setUserId, setToken, setEmail, setBackendUserId } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (emailValue: string, passwordValue?: string) => {
    if (!emailValue || !passwordValue) {
      Alert.alert('Error', 'Ingresa tu correo y contraseña');
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailValue,
        password: passwordValue,
      });
      if (error) {
        Alert.alert('Error de acceso', error.message);
        return;
      }
      if (!data.session) {
        Alert.alert('Error', 'No se pudo iniciar sesión');
        return;
      }

      // TODO: Replace with GET /api/v1/users/me when backend adds it
      const backendUser = await getUserByEmail(emailValue);
      if (backendUser?.role !== 'OWNER') {
        await supabase.auth.signOut();
        Alert.alert('Sin acceso', 'Esta cuenta no tiene permisos de restaurante.');
        return;
      }

      setToken(data.session.access_token);
      setUserId(data.session.user.id);
      setEmail(emailValue);
      setBackendUserId(backendUser.id);
      setRole('restaurant');
    } catch {
      Alert.alert('Error', 'No se pudo verificar tu cuenta. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginTemplate
      mode="restaurant"
      headerBackgroundColor={colors.restaurantHeaderGreen}
      title="TasteMap"
      subtitle="Gestiona tu restaurante con TasteMap"
      badgeText="PORTAL RESTAURANTES"
      mainTitle="Acceso Restaurante 🏪"
      mainSubtitle="Inicia sesión para continuar"
      emailLabel="CORREO DEL NEGOCIO"
      emailPlaceholder="restaurante@correo.com"
      passwordLabel="CONTRASEÑA"
      passwordPlaceholder="Ingresa tu contraseña"
      primaryButtonText={loading ? 'Verificando...' : 'Ingresar al Dashboard →'}
      primaryButtonColor={colors.green}
      secondaryButtonText="Registrar mi restaurante"
      footerText="¿Eres cliente?"
      footerActionText="App de usuario →"
      footerActionColor={colors.teal}
      onPrimaryPress={handleLogin}
      onSecondaryPress={() => navigation.navigate('RestaurantRegister')}
      onFooterActionPress={() => navigation.navigate('UserLogin')}
    />
  );
}
