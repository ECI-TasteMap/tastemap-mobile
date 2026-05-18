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
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getUserById, type UserProfile } from '../services/api/userService';
import { useRestaurantById } from '../hooks/useRestaurantById';
import { useAuthStore } from '../store/authStore';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { radius } from '../theme/radius';
import { typography } from '../theme/typography';
import type { RestaurantTabParamList } from '../navigation/types';

type OwnerNav = BottomTabNavigationProp<RestaurantTabParamList, 'OwnerProfile'>;

interface MenuItem {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  sublabel?: string;
  onPress?: () => void;
  color?: string;
  disabled?: boolean;
}

export default function OwnerScreen() {
  const navigation = useNavigation<OwnerNav>();
  const insets = useSafeAreaInsets();
  const logout = useAuthStore((s) => s.logout);
  const backendUserId = useAuthStore((s) => s.backendUserId);
  const activeRestaurantId = useAuthStore((s) => s.activeRestaurantId);
  const storeEmail = useAuthStore((s) => s.email);

  const [owner, setOwner] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const { data: restaurant } = useRestaurantById(activeRestaurantId ?? '');

  useEffect(() => {
    if (!backendUserId) {
      if (storeEmail) {
        setOwner({ id: '', fullname: storeEmail.split('@')[0], email: storeEmail, role: 'OWNER' });
      }
      setLoading(false);
      return;
    }
    getUserById(backendUserId)
      .then(setOwner)
      .catch(() => {
        if (storeEmail) {
          setOwner({
            id: backendUserId,
            fullname: storeEmail.split('@')[0],
            email: storeEmail,
            role: 'OWNER',
          });
        }
      })
      .finally(() => setLoading(false));
  }, [backendUserId, storeEmail]);

  const menuItems: MenuItem[] = [
    {
      icon: 'storefront-outline',
      label: 'Mi restaurante',
      sublabel: restaurant?.name,
      onPress: () => navigation.navigate('MyLocal'),
    },
    {
      icon: 'stats-chart-outline',
      label: 'Estadísticas',
      sublabel: 'Próximamente',
      disabled: true,
    },
    {
      icon: 'settings-outline',
      label: 'Configuración',
      sublabel: 'Próximamente',
      disabled: true,
    },
    {
      icon: 'log-out-outline',
      label: 'Cerrar sesión',
      color: colors.orange,
      onPress: logout,
    },
  ];

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.gold} size="large" />
      </View>
    );
  }

  const initial = owner?.fullname?.charAt(0).toUpperCase() ?? '?';

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Profile header */}
      <View style={[styles.header, { paddingTop: insets.top + 24 }]}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initial}</Text>
        </View>
        <Text style={styles.name}>{owner?.fullname ?? '—'}</Text>
        <Text style={styles.email}>{owner?.email ?? '—'}</Text>
        <View style={styles.roleBadge}>
          <Text style={styles.roleText}>PROPIETARIO</Text>
        </View>
      </View>

      {/* Menu options */}
      <View style={styles.section}>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.label}
            style={[styles.option, item.disabled && styles.optionDisabled]}
            activeOpacity={item.disabled ? 1 : 0.7}
            onPress={item.onPress}
            disabled={item.disabled}
          >
            <Ionicons name={item.icon} size={22} color={item.color ?? colors.gold} />
            <View style={styles.optionContent}>
              <Text style={[styles.optionLabel, item.color ? { color: item.color } : undefined]}>
                {item.label}
              </Text>
              {Boolean(item.sublabel) && (
                <Text style={styles.optionSublabel}>{item.sublabel}</Text>
              )}
            </View>
            {!item.disabled && (
              <Ionicons name="chevron-forward" size={18} color="rgba(240,234,220,0.3)" />
            )}
          </TouchableOpacity>
        ))}
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

  // Header
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
  avatarText: {
    fontSize: 36,
    color: colors.textPrimary,
    fontWeight: typography.weight.bold,
    fontFamily: typography.fontFamily.serif,
  },
  name: {
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
  roleText: {
    color: colors.green,
    fontSize: typography.size.xs,
    fontFamily: typography.fontFamily.body,
    letterSpacing: 1,
  },

  // Menu
  section: { padding: spacing.xl, marginTop: spacing.sm },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1B2C3E',
    borderRadius: radius.md,
    padding: spacing.lg,
    marginBottom: spacing.sm,
    gap: 14,
  },
  optionDisabled: { opacity: 0.45 },
  optionContent: { flex: 1 },
  optionLabel: {
    color: colors.textPrimary,
    fontSize: typography.size.base,
    fontFamily: typography.fontFamily.body,
  },
  optionSublabel: {
    color: colors.textMuted,
    fontSize: typography.size.xs,
    fontFamily: typography.fontFamily.body,
    marginTop: 2,
  },
});
