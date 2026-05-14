import React, { useRef, useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Animated,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ReservationCard from '../../components/reservations/ReservationCard';
import { useUserReservations } from '../../hooks/useUserReservations';
import { useCancelReservation } from '../../hooks/useCancelReservation';
import { useRestaurants } from '../../hooks/useRestaurants';
import { useAuthStore } from '../../store/authStore';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { typography } from '../../theme/typography';
import type { UserReservation, ReservationType } from '../../types/reservation';

export default function UserReservationsScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<ReservationType>('upcoming');
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const { userId } = useAuthStore();

  const { data: rawReservations, isLoading, isError, refetch } = useUserReservations(userId);
  const { data: restaurants } = useRestaurants();
  const { mutate: cancelReservation } = useCancelReservation(userId);

  const restaurantMap = useMemo(() => {
    const map = new Map<string, { name: string; logo: string | null }>();
    restaurants?.forEach((r) => map.set(r.id, { name: r.name, logo: r.logo }));
    return map;
  }, [restaurants]);

  const reservations: UserReservation[] = useMemo(() => {
    return (rawReservations ?? []).map((r) => {
      const cached = restaurantMap.get(r.restaurantId);
      const logo = cached?.logo;
      return {
        ...r,
        restaurantName: cached?.name ?? r.restaurantName,
        restaurantLogo: logo != null ? logo : undefined,
      };
    });
  }, [rawReservations, restaurantMap]);

  const filtered = useMemo(
    () => reservations.filter((r) => r.type === activeTab),
    [reservations, activeTab]
  );

  const switchTab = (tab: ReservationType) => {
    if (tab === activeTab) return;
    Animated.timing(fadeAnim, { toValue: 0, duration: 100, useNativeDriver: true }).start(() => {
      setActiveTab(tab);
      Animated.timing(fadeAnim, { toValue: 1, duration: 180, useNativeDriver: true }).start();
    });
  };

  const handleCancel = (id: string) => {
    cancelReservation(id);
  };

  const renderItem = ({ item }: { item: UserReservation }) => (
    <ReservationCard reservation={item} onCancel={handleCancel} />
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + spacing.lg }]}>
        <Text style={styles.title}>Mis Reservas</Text>

        {/* Segmented control */}
        <View style={styles.segmented}>
          <TouchableOpacity
            style={[styles.segBtn, activeTab === 'upcoming' && styles.segBtnActive]}
            onPress={() => switchTab('upcoming')}
            activeOpacity={0.8}
          >
            <Text style={[styles.segText, activeTab === 'upcoming' && styles.segTextActive]}>
              Próximas
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.segBtn, activeTab === 'past' && styles.segBtnActive]}
            onPress={() => switchTab('past')}
            activeOpacity={0.8}
          >
            <Text style={[styles.segText, activeTab === 'past' && styles.segTextActive]}>
              Pasadas
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Loading */}
      {isLoading && (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.gold} />
          <Text style={styles.loadingText}>Cargando reservas...</Text>
        </View>
      )}

      {/* Error */}
      {!isLoading && isError && (
        <View style={styles.centerContainer}>
          <Ionicons name="wifi-outline" size={48} color={colors.textMuted} />
          <Text style={styles.errorText}>No se pudieron cargar las reservas</Text>
          <Text style={styles.loadingText}>Revisa tu conexión e intenta de nuevo.</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => void refetch()}>
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* List with fade animation */}
      {!isLoading && !isError && (
        <Animated.View style={[styles.listWrapper, { opacity: fadeAnim }]}>
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={<EmptyState tab={activeTab} hasAuth={Boolean(userId)} />}
          />
        </Animated.View>
      )}
    </View>
  );
}

function EmptyState({
  tab,
  hasAuth,
}: Readonly<{ tab: ReservationType; hasAuth: boolean }>) {
  if (!hasAuth) {
    return (
      <View style={styles.empty}>
        <Ionicons name="person-outline" size={52} color={colors.gold} />
        <Text style={styles.emptyTitle}>Inicia sesión</Text>
        <Text style={styles.emptySubtitle}>
          Conéctate con tu cuenta para ver y gestionar tus reservas.
        </Text>
      </View>
    );
  }

  const isUpcoming = tab === 'upcoming';
  return (
    <View style={styles.empty}>
      <Ionicons
        name={isUpcoming ? 'calendar-outline' : 'time-outline'}
        size={52}
        color={colors.gold}
      />
      <Text style={styles.emptyTitle}>
        {isUpcoming ? 'Sin reservas próximas' : 'Sin reservas pasadas'}
      </Text>
      <Text style={styles.emptySubtitle}>
        {isUpcoming
          ? 'Tus reservas activas aparecerán aquí cuando reserves en un restaurante.'
          : 'Aquí verás el historial de tus visitas anteriores.'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // Header
  header: {
    paddingHorizontal: spacing.screen,
    paddingBottom: spacing.lg,
    backgroundColor: colors.background,
  },
  title: {
    color: colors.textPrimary,
    fontSize: typography.size.xxl,
    fontWeight: typography.weight.bold,
    fontFamily: typography.fontFamily.serif,
    fontStyle: 'italic',
    marginBottom: spacing.lg,
  },

  // Segmented control
  segmented: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: 4,
  },
  segBtn: {
    flex: 1,
    paddingVertical: spacing.sm + 2,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  segBtnActive: {
    backgroundColor: colors.gold,
  },
  segText: {
    color: colors.textMuted,
    fontSize: typography.size.sm,
    fontFamily: typography.fontFamily.body,
    fontWeight: typography.weight.semibold,
  },
  segTextActive: {
    color: colors.background,
  },

  // List
  listWrapper: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl + spacing.xl,
  },

  // Center states (loading / error)
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  loadingText: {
    color: colors.textSecondary,
    fontSize: typography.size.sm,
    fontFamily: typography.fontFamily.body,
    textAlign: 'center',
  },
  errorText: {
    color: colors.textPrimary,
    fontSize: typography.size.base,
    fontWeight: typography.weight.semibold,
    fontFamily: typography.fontFamily.body,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: colors.gold,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.md,
    marginTop: spacing.sm,
  },
  retryButtonText: {
    color: colors.background,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.bold,
    fontFamily: typography.fontFamily.body,
  },

  // Empty state
  empty: {
    alignItems: 'center',
    paddingTop: 72,
    paddingHorizontal: spacing.xxl,
    gap: spacing.sm,
  },
  emptyTitle: {
    color: colors.textPrimary,
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    fontFamily: typography.fontFamily.serif,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  emptySubtitle: {
    color: colors.textSecondary,
    fontSize: typography.size.sm,
    fontFamily: typography.fontFamily.body,
    textAlign: 'center',
    lineHeight: 20,
  },
});
