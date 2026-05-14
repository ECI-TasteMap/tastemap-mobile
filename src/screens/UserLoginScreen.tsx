import React from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import LoginTemplate from '../components/LoginTemplate';
import { colors } from '../theme/colors';
import { useAuthStore } from '../store/authStore';
import type { AuthStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'UserLogin'>;

export default function UserLoginScreen() {
  const navigation = useNavigation<Nav>();
  const setRole = useAuthStore((s) => s.setRole);

  // TODO: Replace with real auth call to POST /api/v1/auth/login when ready
  const handleLogin = () => setRole('user');

  return (
    <LoginTemplate
      mode="user"
      headerBackgroundColor={colors.headerNavy}
      title="TasteMap"
      subtitle="Descubre tu lugar perfecto"
      mainTitle="Bienvenido 👋"
      mainSubtitle="Inicia sesión para continuar"
      emailLabel="CORREO ELECTRÓNICO"
      emailPlaceholder="tu@correo.com"
      passwordLabel="CONTRASEÑA"
      passwordPlaceholder="Mínimo 8 caracteres"
      primaryButtonText="Ingresar →"
      primaryButtonColor={colors.gold}
      secondaryButtonText="Crear cuenta nueva"
      footerSecondaryText="¿Dueño de restaurante?"
      footerSecondaryActionText="Accede aquí →"
      footerSecondaryActionColor={colors.teal}
      onPrimaryPress={handleLogin}
      onSecondaryPress={() => {
        // TODO: Navigate to RegisterScreen when it exists
      }}
      onFooterSecondaryActionPress={() => navigation.navigate('RestaurantLogin')}
    />
  );
}
