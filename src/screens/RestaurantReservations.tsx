import React, { useMemo, useState } from 'react';
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
import { useRestaurantReservations } from '../hooks/useRestaurantReservations';
import { useRestaurantById } from '../hooks/useRestaurantById';
import { useAuthStore } from '../store/authStore';
import { colors } from '../theme/colors';
import type { BackendLocalTime, BackendReservation } from '../types/reservation';

// ── Helpers ─────────────────────────────────────────────────────────────────

type TabId = 'hoy' | 'proximas' | 'todas';

const TABS: { id: TabId; label: string }[] = [
  { id: 'hoy', label: 'Hoy' },
  { id: 'proximas', label: 'Próximas' },
  { id: 'todas', label: 'Todas' },
];

function formatTime({ hour, minute }: BackendLocalTime): string {
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

function getTodayISO(): string {
  return new Date().toISOString().split('T')[0];
}

function getDateLabel(isoDate: string, todayISO: string): string {
  if (isoDate === todayISO) return 'Hoy';
  const d = new Date(todayISO);
  d.setDate(d.getDate() + 1);
  const tomorrowISO = d.toISOString().split('T')[0];
  if (isoDate === tomorrowISO) return 'Mañana';
  const [y, m, day] = isoDate.split('-').map(Number);
  return new Date(y, m - 1, day).toLocaleDateString('es-ES', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
  });
}

function filterByTab(
  reservations: BackendReservation[],
  tab: TabId,
  todayISO: string,
): BackendReservation[] {
  if (tab === 'hoy') return reservations.filter((r) => r.date === todayISO);
  if (tab === 'proximas') return reservations.filter((r) => r.date > todayISO);
  return reservations;
}

function sortReservations(reservations: BackendReservation[]): BackendReservation[] {
  return [...reservations].sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    return a.time.hour * 60 + a.time.minute - (b.time.hour * 60 + b.time.minute);
  });
}

// ── Sub-component ────────────────────────────────────────────────────────────

function ReservationCard({
  reservation,
  todayISO,
}: Readonly<{
  reservation: BackendReservation;
  todayISO: string;
}>) {
  const dateLabel = getDateLabel(reservation.date, todayISO);
  const timeLabel = formatTime(reservation.time);

  return (
    <View style={cardStyles.card}>
      <View style={cardStyles.header}>
        <Text style={cardStyles.time}>{timeLabel}</Text>
        <Text style={cardStyles.date}>{dateLabel}</Text>
      </View>
      <Text style={cardStyles.guests}>
        {'👥 '}
        {reservation.numberOfGuests}{' '}
        {reservation.numberOfGuests === 1 ? 'persona' : 'personas'}
      </Text>
      {Boolean(reservation.specialRequests) && (
        <Text style={cardStyles.note}>"{reservation.specialRequests}"</Text>
      )}
      <Text style={cardStyles.reservationId}>Reserva #{reservation.id.slice(-6)}</Text>
    </View>
  );
}

const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: '#1B2C3E',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: colors.gold,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  time: {
    color: colors.gold,
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'sans-serif-medium',
  },
  date: {
    color: '#FFFFFF',
    fontSize: 13,
    fontFamily: 'sans-serif-medium',
    fontWeight: '600',
  },
  guests: {
    color: 'rgba(240,234,220,0.8)',
    fontSize: 14,
    fontFamily: 'sans-serif-medium',
    marginBottom: 4,
  },
  note: {
    color: 'rgba(240,234,220,0.55)',
    fontSize: 13,
    fontFamily: 'sans-serif-medium',
    fontStyle: 'italic',
    marginBottom: 6,
    lineHeight: 18,
  },
  reservationId: {
    color: 'rgba(240,234,220,0.3)',
    fontSize: 11,
    fontFamily: 'sans-serif-medium',
    marginTop: 4,
  },
});

// ── Main component ───────────────────────────────────────────────────────────

export default function GestionReservas() {
  const insets = useSafeAreaInsets();
  const activeRestaurantId = useAuthStore((s) => s.activeRestaurantId);
  const [activeTab, setActiveTab] = useState<TabId>('hoy');

  const todayISO = useMemo(() => getTodayISO(), []);

  const { data: restaurant } = useRestaurantById(activeRestaurantId ?? '');
  const {
    data: allReservations = [],
    isLoading,
    isError,
    refetch,
  } = useRestaurantReservations(activeRestaurantId);

  const filtered = useMemo(
    () => sortReservations(filterByTab(allReservations, activeTab, todayISO)),
    [allReservations, activeTab, todayISO],
  );

  const todayCount = useMemo(
    () => allReservations.filter((r) => r.date === todayISO).length,
    [allReservations, todayISO],
  );

  const upcomingCount = useMemo(
    () => allReservations.filter((r) => r.date > todayISO).length,
    [allReservations, todayISO],
  );

  const getTabLabel = (tab: (typeof TABS)[number]): string => {
    if (tab.id === 'hoy' && todayCount > 0) return `${tab.label} (${todayCount})`;
    if (tab.id === 'proximas' && upcomingCount > 0) return `${tab.label} (${upcomingCount})`;
    return tab.label;
  };

  const restaurantName = restaurant?.name ?? 'Mi restaurante';
  const today = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
  });

  // ── No restaurant ──────────────────────────────────────────────────────────
  if (!activeRestaurantId) {
    return (
      <View style={[styles.wrapper, styles.centered]}>
        <Ionicons name="storefront-outline" size={52} color={colors.gold} />
        <Text style={styles.emptyTitle}>Sin restaurante registrado</Text>
        <Text style={styles.emptyDesc}>Ve a "Mi local" para configurar tu restaurante.</Text>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Text style={styles.headerTitle}>Gestión de Reservas</Text>
        <Text style={styles.headerSub}>
          {restaurantName} · {today}
        </Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tab, isActive && styles.tabActive]}
              onPress={() => setActiveTab(tab.id)}
            >
              <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                {getTabLabel(tab)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Content */}
      {isLoading && (
        <View style={styles.centered}>
          <ActivityIndicator color={colors.gold} size="large" />
          <Text style={styles.loadingText}>Cargando reservas...</Text>
        </View>
      )}

      {isError && !isLoading && (
        <View style={styles.centered}>
          <Ionicons name="wifi-outline" size={48} color="rgba(240,234,220,0.3)" />
          <Text style={styles.emptyTitle}>No se pudieron cargar las reservas</Text>
          <Text style={styles.emptyDesc}>Revisa tu conexión e intenta de nuevo.</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={() => void refetch()}>
            <Text style={styles.retryBtnText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      )}

      {!isLoading && !isError && (
        <ScrollView
          style={styles.list}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {filtered.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="calendar-outline" size={40} color="rgba(240,234,220,0.2)" />
              <Text style={styles.emptyTitle}>
                {activeTab === 'hoy' && 'Sin reservas para hoy'}
                {activeTab === 'proximas' && 'Sin reservas próximas'}
                {activeTab === 'todas' && 'Sin reservas registradas'}
              </Text>
            </View>
          ) : (
            filtered.map((r) => (
              <ReservationCard key={r.id} reservation={r} todayISO={todayISO} />
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: '#0C1D32' },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 12,
  },

  // Header
  header: {
    backgroundColor: '#0f2a1e',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
    fontFamily: 'serif',
    fontStyle: 'italic',
    marginBottom: 4,
  },
  headerSub: {
    color: 'rgba(240,234,220,0.55)',
    fontSize: 13,
    fontFamily: 'sans-serif-medium',
    textTransform: 'capitalize',
  },

  // Tabs
  tabsContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    backgroundColor: '#1B2C3E',
    borderRadius: 14,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 10,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: '#243d2b',
    borderWidth: 1,
    borderColor: '#4dd9c0',
  },
  tabText: {
    color: 'rgba(240,234,220,0.5)',
    fontSize: 12,
    fontFamily: 'sans-serif-medium',
    fontWeight: '600',
  },
  tabTextActive: { color: '#FFFFFF' },

  // List
  list: { flex: 1, paddingHorizontal: 16, marginTop: 4 },

  // Loading
  loadingText: {
    color: 'rgba(240,234,220,0.5)',
    fontSize: 14,
    fontFamily: 'sans-serif-medium',
  },

  // Empty / error
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  emptyTitle: {
    color: 'rgba(240,234,220,0.6)',
    fontSize: 16,
    fontFamily: 'serif',
    textAlign: 'center',
  },
  emptyDesc: {
    color: 'rgba(240,234,220,0.4)',
    fontSize: 13,
    fontFamily: 'sans-serif-medium',
    textAlign: 'center',
    lineHeight: 20,
  },

  // Retry
  retryBtn: {
    marginTop: 8,
    backgroundColor: colors.gold,
    borderRadius: 10,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  retryBtnText: {
    color: '#0C1D32',
    fontWeight: '700',
    fontSize: 14,
    fontFamily: 'sans-serif-medium',
  },
});
