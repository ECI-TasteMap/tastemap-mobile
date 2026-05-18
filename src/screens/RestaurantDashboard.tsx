import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useMemo } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useOwnerRestaurants } from '../hooks/useOwnerRestaurants';
import { isRestaurantOpenNow } from '../utils/restaurantSchedule';
import {
  useRestaurantReservations,
  useRestaurantReservationsByDate,
} from '../hooks/useRestaurantReservations';
import { useAuthStore } from '../store/authStore';
import { colors } from '../theme/colors';
import type { BackendLocalTime } from '../types/reservation';

const formatTime = ({ hour, minute }: BackendLocalTime): string =>
  `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;

const formatDate = (): string => {
  const opts: Intl.DateTimeFormatOptions = { weekday: 'long', day: '2-digit', month: 'long' };
  return new Date().toLocaleDateString('es-ES', opts).replace(/\b\w/g, (l) => l.toUpperCase());
};

const Stars = ({ count }: { count: number }) => (
  <Text style={styles.estrellas}>
    {'★'.repeat(Math.min(5, Math.round(count)))}
    {'☆'.repeat(Math.max(0, 5 - Math.round(count)))}
  </Text>
);

export default function RestaurantOwnerDashboard() {
  const insets = useSafeAreaInsets();
  const backendUserId = useAuthStore((s) => s.backendUserId);
  const activeRestaurantId = useAuthStore((s) => s.activeRestaurantId);
  const setActiveRestaurantId = useAuthStore((s) => s.setActiveRestaurantId);

  const { data: restaurants = [], isLoading: loadingRestaurants } =
    useOwnerRestaurants(backendUserId);

  // Auto-select first restaurant when none is active
  useEffect(() => {
    if (!activeRestaurantId && restaurants.length > 0) {
      setActiveRestaurantId(restaurants[0].id);
    }
  }, [restaurants, activeRestaurantId, setActiveRestaurantId]);

  const activeRestaurant = useMemo(
    () => restaurants.find((r) => r.id === activeRestaurantId) ?? restaurants[0] ?? null,
    [restaurants, activeRestaurantId],
  );

  const todayISO = useMemo(() => new Date().toISOString().split('T')[0], []);

  const { data: allReservations = [], isLoading: loadingAll } = useRestaurantReservations(
    activeRestaurant?.id ?? null,
  );
  const { data: todayReservations = [], isLoading: loadingToday } = useRestaurantReservationsByDate(
    activeRestaurant?.id ?? null,
    todayISO,
  );

  const reservasMes = useMemo(() => {
    const now = new Date();
    return allReservations.filter((r) => {
      const [y, m] = r.date.split('-').map(Number);
      return m - 1 === now.getMonth() && y === now.getFullYear();
    }).length;
  }, [allReservations]);

  // ── Loading ─────────────────────────────────────────────────────────────────
  if (loadingRestaurants) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator color={colors.gold} size="large" />
        <Text style={styles.cargandoText}>Cargando tu restaurante...</Text>
      </View>
    );
  }

  // ── Sin backendUserId: cuenta no sincronizada con el backend ─────────────────
  if (!backendUserId) {
    return (
      <View style={[styles.container, { paddingTop: insets.top + 24 }]}>
        <View style={styles.emptyContainer}>
          <Ionicons name="warning-outline" size={52} color={colors.gold} />
          <Text style={styles.emptyTitle}>Cuenta sin sincronizar</Text>
          <Text style={styles.emptyDesc}>
            Tu cuenta de Supabase aún no está vinculada al sistema backend.{'\n'}
            Contacta al administrador de TasteMap para completar la configuración.
          </Text>
          {/* TODO: When backend adds GET /api/v1/users/me, trigger auto-sync here */}
        </View>
      </View>
    );
  }

  // ── Sin restaurante registrado ───────────────────────────────────────────────
  if (!activeRestaurant) {
    return (
      <View style={[styles.container, { paddingTop: insets.top + 24 }]}>
        <View style={styles.emptyContainer}>
          <Ionicons name="storefront-outline" size={52} color={colors.gold} />
          <Text style={styles.emptyTitle}>Sin restaurante registrado</Text>
          <Text style={styles.emptyDesc}>
            No encontramos restaurantes asociados a tu cuenta.{'\n'}
            Registra tu primer local en la pestaña "Mi local".
          </Text>
        </View>
      </View>
    );
  }

  // ── Vista principal con datos reales ─────────────────────────────────────────
  const isOpen = isRestaurantOpenNow(activeRestaurant.hour);
  const rating = activeRestaurant.averageRating ?? 0;
  const priceLabel =
    activeRestaurant.priceMin != null && activeRestaurant.priceMax != null
      ? `$${activeRestaurant.priceMin.toLocaleString()} – $${activeRestaurant.priceMax.toLocaleString()}`
      : 'Sin precio';

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingTop: insets.top, paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={styles.restaurantName} numberOfLines={1}>
            {activeRestaurant.name}
          </Text>
          <View style={[styles.statusBadge, isOpen ? styles.statusOpen : styles.statusClosed]}>
            <Text style={styles.statusText}>{isOpen ? 'Abierto' : 'Cerrado'}</Text>
          </View>
        </View>
        <Text style={styles.fecha}>{formatDate()}</Text>
      </View>

      {/* Stats 2×2 */}
      <View style={styles.statsGrid}>
        {/* Reservas del mes */}
        <View style={styles.statCard}>
          {loadingAll ? (
            <ActivityIndicator color={colors.gold} size="small" style={{ marginBottom: 4 }} />
          ) : (
            <Text style={styles.statValor}>{reservasMes}</Text>
          )}
          <Text style={styles.statLabel}>RESERVAS ESTE MES</Text>
          <Text style={styles.statDelta}>Total acumulado</Text>
        </View>

        {/* Rating */}
        <View style={styles.statCard}>
          <Text style={styles.statValor}>{rating > 0 ? rating.toFixed(1) : '—'}</Text>
          <Text style={styles.statLabel}>RATING PROMEDIO</Text>
          {rating > 0 ? (
            <Stars count={rating} />
          ) : (
            <Text style={styles.statDelta}>Sin reseñas</Text>
          )}
        </View>

        {/* Reservas hoy */}
        <View style={styles.statCard}>
          {loadingToday ? (
            <ActivityIndicator color={colors.gold} size="small" style={{ marginBottom: 4 }} />
          ) : (
            <Text style={styles.statValor}>{todayReservations.length}</Text>
          )}
          <Text style={styles.statLabel}>RESERVAS HOY</Text>
          <Text style={styles.statDelta}>{todayISO}</Text>
        </View>

        {/* Rango de precios */}
        <View style={styles.statCard}>
          <Text style={[styles.statValor, styles.statValorSm]}>{priceLabel}</Text>
          <Text style={styles.statLabel}>RANGO DE PRECIOS</Text>
          <Text style={styles.statDelta}>{activeRestaurant.theme ?? '—'}</Text>
        </View>
      </View>

      {/* Reservas de hoy */}
      <View style={styles.seccion}>
        <Text style={styles.seccionTitulo}>Reservas de hoy</Text>

        {loadingToday && <ActivityIndicator color={colors.gold} style={{ marginVertical: 20 }} />}

        {!loadingToday && todayReservations.length === 0 && (
          <Text style={styles.sinReservas}>Sin reservas para hoy</Text>
        )}

        {todayReservations.map((r) => (
          <View key={r.id} style={styles.reservaCard}>
            <View style={styles.reservaCabecera}>
              <Text style={styles.reservaHora}>{formatTime(r.time)}</Text>
              <Text style={styles.reservaPersonas}>
                👥 {r.numberOfGuests} {r.numberOfGuests === 1 ? 'persona' : 'personas'}
              </Text>
            </View>
            {r.specialRequests ? (
              <Text style={styles.reservaDetalle}>"{r.specialRequests}"</Text>
            ) : null}
            {/* TODO: Enrich with user name via GET /api/v1/users/{userId} when a batch endpoint exists */}
            <Text style={styles.reservaUserId}>Reserva #{r.id.slice(-6)}</Text>
          </View>
        ))}
      </View>

      {/* Datos del restaurante */}
      <View style={styles.seccion}>
        <Text style={styles.seccionTitulo}>Mi restaurante</Text>

        {activeRestaurant.locations?.map((loc) => (
          <View key={loc} style={styles.infoRow}>
            <Ionicons name="location-outline" size={16} color={colors.gold} />
            <Text style={styles.infoText}>{loc}</Text>
          </View>
        ))}

        {activeRestaurant.hour ? (
          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={16} color={colors.gold} />
            <Text style={styles.infoText}>{activeRestaurant.hour}</Text>
          </View>
        ) : null}

        {activeRestaurant.phone ? (
          <View style={styles.infoRow}>
            <Ionicons name="call-outline" size={16} color={colors.gold} />
            <Text style={styles.infoText}>{activeRestaurant.phone}</Text>
          </View>
        ) : null}

        {activeRestaurant.description ? (
          <Text style={styles.descripcion}>{activeRestaurant.description}</Text>
        ) : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0C1D32',
    paddingHorizontal: 20,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  cargandoText: {
    color: 'rgba(240,234,220,0.5)',
    marginTop: 12,
    fontFamily: 'sans-serif-medium',
    fontSize: 14,
  },

  // Empty states
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingTop: 40,
    gap: 16,
  },
  emptyTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'serif',
    textAlign: 'center',
  },
  emptyDesc: {
    color: 'rgba(240,234,220,0.55)',
    fontSize: 14,
    fontFamily: 'sans-serif-medium',
    textAlign: 'center',
    lineHeight: 22,
  },

  // Header
  header: { paddingTop: 12, paddingBottom: 8 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  restaurantName: {
    flex: 1,
    color: '#FFFFFF',
    fontFamily: 'serif',
    fontSize: 30,
    fontWeight: '800',
    fontStyle: 'italic',
    letterSpacing: -0.5,
  },
  statusBadge: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
  },
  statusOpen: {
    backgroundColor: 'rgba(52,168,83,0.15)',
    borderColor: 'rgba(52,168,83,0.4)',
  },
  statusClosed: {
    backgroundColor: 'rgba(217,80,77,0.12)',
    borderColor: 'rgba(217,80,77,0.3)',
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontFamily: 'sans-serif-medium',
    fontWeight: '600',
  },
  fecha: {
    color: 'rgba(240,234,220,0.55)',
    fontSize: 13,
    fontFamily: 'serif',
    marginTop: 4,
  },

  // Stats
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 24,
  },
  statCard: {
    backgroundColor: '#1B2C3E',
    borderRadius: 16,
    padding: 16,
    width: '47%',
    flexGrow: 1,
  },
  statValor: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: '800',
    fontFamily: 'serif',
    lineHeight: 42,
  },
  statValorSm: {
    fontSize: 18,
    lineHeight: 26,
  },
  statLabel: {
    color: 'rgba(240,234,220,0.55)',
    fontSize: 10,
    fontFamily: 'sans-serif-medium',
    letterSpacing: 0.8,
    marginTop: 4,
    marginBottom: 6,
  },
  statDelta: {
    color: '#4dd9c0',
    fontSize: 11,
    fontFamily: 'sans-serif-medium',
  },
  estrellas: {
    color: '#c9a96e',
    fontSize: 14,
  },

  // Sección
  seccion: { marginTop: 32 },
  seccionTitulo: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 14,
    fontFamily: 'serif',
  },

  // Reserva card (simplificada, sin botones de estado — backend no tiene status)
  reservaCard: {
    backgroundColor: '#1B2C3E',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#c9a96e',
  },
  reservaCabecera: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  reservaHora: {
    color: '#c9a96e',
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'sans-serif-medium',
  },
  reservaPersonas: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'sans-serif-medium',
  },
  reservaDetalle: {
    color: 'rgba(240,234,220,0.65)',
    fontSize: 13,
    fontFamily: 'sans-serif-medium',
    fontStyle: 'italic',
    marginBottom: 6,
    lineHeight: 18,
  },
  reservaUserId: {
    color: 'rgba(240,234,220,0.3)',
    fontSize: 11,
    fontFamily: 'sans-serif-medium',
    marginTop: 4,
  },
  sinReservas: {
    color: 'rgba(240,234,220,0.5)',
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 20,
    fontFamily: 'serif',
  },

  // Info del restaurante
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  infoText: {
    color: 'rgba(240,234,220,0.75)',
    fontSize: 14,
    fontFamily: 'sans-serif-medium',
    flex: 1,
  },
  descripcion: {
    color: 'rgba(240,234,220,0.55)',
    fontSize: 13,
    fontFamily: 'sans-serif-medium',
    lineHeight: 20,
    marginTop: 8,
  },
});
