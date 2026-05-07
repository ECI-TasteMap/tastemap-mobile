import React from 'react';
import LoginTemplate from '../components/LoginTemplate';
import { colors } from '../theme/colors';

export default function RestaurantLoginScreen() {
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
      onPrimaryPress={() => console.log('Restaurant login pressed')}
      onSecondaryPress={() => console.log('Register restaurant pressed')}
      onFooterActionPress={() => console.log('User app access pressed')}
    />
  );
}
