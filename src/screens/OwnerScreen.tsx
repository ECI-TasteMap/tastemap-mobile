import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getUserById, type UserProfile } from '../services/api/userService';
import { useAuthStore } from '../store/authStore';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { radius } from '../theme/radius';
import { typography } from '../theme/typography';

// TODO: replace with real owner ID from auth token (POST /api/v1/auth/restaurant/login)
const TEMP_OWNER_ID = '69f14e016faf3c38a1f58978';

export default function OwnerScreen() {
  const insets = useSafeAreaInsets();
  const logout = useAuthStore((s) => s.logout);
  const [owner, setOwner] = useState<UserProfile | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    getUserById(TEMP_OWNER_ID)
      .then(setOwner)
      .catch((err) => console.error('Failed to load owner profile:', err))
      .finally(() => setCargando(false));
  }, []);

  if (cargando) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.gold} size="large" />
      </View>
    );
  }

  const initial = owner?.fullname?.charAt(0).toUpperCase() ?? '?';

  return (
    <ScrollView style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 24 }]}>
        <View style={styles.avatar}>
          <Text style={styles.avatarTexto}>{initial}</Text>
        </View>
        <Text style={styles.nombre}>{owner?.fullname ?? '—'}</Text>
        <Text style={styles.email}>{owner?.email ?? '—'}</Text>
        <View style={styles.roleBadge}>
          <Text style={styles.roleTexto}>PROPIETARIO</Text>
        </View>
      </View>

      <View style={styles.seccion}>
        {(
          [
            { icon: 'storefront-outline', label: 'Mi restaurante' },
            { icon: 'stats-chart-outline', label: 'Estadísticas' },
            { icon: 'settings-outline', label: 'Configuración' },
          ] as { icon: React.ComponentProps<typeof Ionicons>['name']; label: string }[]
        ).map((item) => (
          <TouchableOpacity key={item.label} style={styles.opcion} activeOpacity={0.7}>
            <Ionicons name={item.icon} size={22} color={colors.gold} />
            <Text style={styles.opcionTexto}>{item.label}</Text>
            <Ionicons name="chevron-forward" size={18} color="rgba(240,234,220,0.3)" />
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.opcion} activeOpacity={0.7} onPress={logout}>
          <Ionicons name="log-out-outline" size={22} color={colors.orange} />
          <Text style={[styles.opcionTexto, { color: colors.orange }]}>Cerrar sesión</Text>
          <Ionicons name="chevron-forward" size={18} color="rgba(240,234,220,0.3)" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  centered: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    paddingBottom: 30,
    backgroundColor: '#0f2a1e',
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: radius.round,
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  avatarTexto: {
    fontSize: 36,
    color: colors.textPrimary,
    fontWeight: typography.weight.bold,
    fontFamily: typography.fontFamily.serif,
  },
  nombre: {
    color: colors.textPrimary,
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    fontFamily: typography.fontFamily.serif,
  },
  email: {
    color: colors.textMuted,
    fontSize: typography.size.sm,
    marginTop: spacing.xs,
    fontFamily: typography.fontFamily.body,
  },
  roleBadge: {
    marginTop: spacing.sm,
    backgroundColor: 'rgba(52,168,83,0.15)',
    borderRadius: radius.round,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderWidth: 1,
    borderColor: 'rgba(52,168,83,0.3)',
  },
  roleTexto: {
    color: colors.green,
    fontSize: typography.size.xs,
    fontFamily: typography.fontFamily.body,
    letterSpacing: 1,
  },
  seccion: { padding: spacing.xl, marginTop: spacing.sm },
  opcion: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1B2C3E',
    borderRadius: radius.md,
    padding: spacing.lg,
    marginBottom: spacing.sm,
    gap: 14,
  },
  opcionTexto: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: typography.size.base,
    fontFamily: typography.fontFamily.body,
  },
});
