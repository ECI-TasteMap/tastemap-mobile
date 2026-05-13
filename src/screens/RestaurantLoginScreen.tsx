import React from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import LoginTemplate from '../components/LoginTemplate';
import { colors } from '../theme/colors';
import { useAuthStore } from '../store/authStore';
import type { AuthStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'RestaurantLogin'>;

export default function RestaurantLoginScreen() {
  const navigation = useNavigation<Nav>();
  const setRole = useAuthStore((s) => s.setRole);

  // TODO: Replace with real auth call to POST /api/v1/auth/restaurant/login when ready
  const handleLogin = () => setRole('restaurant');

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
      primaryButtonText="Ingresar al Dashboard →"
      primaryButtonColor={colors.green}
      secondaryButtonText="Registrar mi restaurante"
      footerText="¿Eres cliente?"
      footerActionText="App de usuario →"
      footerActionColor={colors.teal}
      onPrimaryPress={handleLogin}
      onSecondaryPress={() => {
        // TODO: Navigate to RestaurantNewLocal or register flow when ready
      }}
      onFooterActionPress={() => navigation.navigate('UserLogin')}
    />
  );
}
