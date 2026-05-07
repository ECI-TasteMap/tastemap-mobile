import React from 'react';
import LoginTemplate from '../components/LoginTemplate';
import { colors } from '../theme/colors';

export default function RestaurantLoginScreen() {
  return (
    <LoginTemplate
      mode="restaurant"
      headerBackgroundColor={colors.restaurantHeaderGreen}
      title="TasteMap"
      subtitle="Gestiona tu local desde aquí"
      badgeText="PORTAL RESTAURANTES"
      mainTitle="Acceso Restaurante 🏪"
      mainSubtitle="Gestiona tu local desde aquí"
      emailLabel="CORREO DEL NEGOCIO"
      emailPlaceholder="restaurante@correo.com"
      passwordLabel="CONTRASEÑA"
      passwordPlaceholder="••••••••"
      primaryButtonText="Ingresar al Dashboard →"
      primaryButtonColor={colors.green}
      secondaryButtonText="Registrar mi restaurante"
      footerText="¿Eres cliente?"
      footerActionText="App de usuario →"
      onPrimaryPress={() => console.log('Restaurant login pressed')}
      onSecondaryPress={() => console.log('Register restaurant pressed')}
      onFooterActionPress={() => console.log('User app access pressed')}
    />
  );
}
