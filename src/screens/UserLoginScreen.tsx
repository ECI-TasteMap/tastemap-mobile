import React from 'react';
import LoginTemplate from '../components/LoginTemplate';
import { colors } from '../theme/colors';

export default function UserLoginScreen() {
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
      footerText="¿Ya tienes cuenta?"
      footerActionText="Inicia sesión"
      footerSecondaryText="¿Dueño de restaurante?"
      footerSecondaryActionText="Accede aquí →"
      onPrimaryPress={() => console.log('User login pressed')}
      onSecondaryPress={() => console.log('Create account pressed')}
      onFooterActionPress={() => console.log('Login pressed')}
      onFooterSecondaryActionPress={() => console.log('Restaurant access pressed')}
    />
  );
}
