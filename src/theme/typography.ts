import { Platform } from 'react-native';

// Serif: títulos, bienvenidas, nombres de restaurante
// Body: texto de interfaz, etiquetas, botones
const serif = Platform.select({ ios: 'Georgia', android: 'serif' }) as string;
const body = Platform.select({ ios: 'System', android: 'sans-serif-medium' }) as string;

export const typography = {
  fontFamily: {
    serif,
    body,
  },
  size: {
    xs: 11,
    sm: 13,
    md: 14,
    base: 15,
    lg: 18,
    xl: 22,
    xxl: 27,
    xxxl: 32,
  },
  weight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
  },
} as const;
