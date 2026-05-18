import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Linking,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ScreenContainer from '../components/layout/ScreenContainer';
import { useRestaurantById } from '../hooks/useRestaurantById';
import { useRestaurantReservations } from '../hooks/useRestaurantReservations';
import { restaurantDetailMock } from '../mocks/restaurantDetailMock';
import { parseMenuField } from '../utils/menuParser';
import { isRestaurantOpenNow } from '../utils/restaurantSchedule';
import { restaurantDetailStyles as styles } from './RestaurantDetailScreen.styles';
import { colors } from '../theme/colors';
import { useAuthStore } from '../store/authStore';
import type { RestaurantDetail } from '../types/restaurant';
import type { RestaurantTabParamList, RestaurantStackParamList } from '../navigation/types';

type MyLocalNav = CompositeNavigationProp<
  BottomTabNavigationProp<RestaurantTabParamList, 'MyLocal'>,
  NativeStackNavigationProp<RestaurantStackParamList>
>;

export default function RestaurantDetailOwner() {
  const navigation = useNavigation<MyLocalNav>();
  const activeRestaurantId = useAuthStore((s) => s.activeRestaurantId);

  // React Query manages fetching and cache. When useUpdateRestaurant invalidates
  // ['restaurant', id], this query refetches automatically even while the edit
  // screen is on top of the stack, so data is fresh when the user navigates back.
  const { data: rawData, isLoading, isError, refetch } = useRestaurantById(
    activeRestaurantId ?? '',
  );
  const { data: reservations = [] } = useRestaurantReservations(activeRestaurantId);

  const restaurant: RestaurantDetail | null = rawData
    ? {
        ...restaurantDetailMock,
        ...rawData,
        // Derive open/closed from the device clock + hour field, not openStatus.
        isOpen: isRestaurantOpenNow(rawData.hour),
      }
    : null;

  const handleOpenMenu = (url: string) => {
    Linking.openURL(url).catch(() => {
      // URL could not be opened — no further action needed.
    });
  };

  const handleEdit = () => {
    if (!activeRestaurantId) return;
    navigation.navigate('RestaurantForm', { mode: 'edit', restaurantId: activeRestaurantId });
  };

  // ── No restaurant linked ─────────────────────────────────────────────────
  if (!activeRestaurantId) {
    return (
      <ScreenContainer>
        <View style={styles.centerContainer}>
          <Ionicons name="storefront-outline" size={52} color={colors.gold} />
          <Text style={[styles.errorText, { textAlign: 'center', marginTop: 16 }]}>
            Sin restaurante registrado
          </Text>
          <Text style={[styles.loadingText, { textAlign: 'center' }]}>
            Ve a "Registrar Restaurante" para agregar tu local.
          </Text>
        </View>
      </ScreenContainer>
    );
  }

  // ── Loading ──────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <ScreenContainer>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.gold} />
          <Text style={styles.loadingText}>Cargando restaurante...</Text>
        </View>
      </ScreenContainer>
    );
  }

  // ── Error / no data ──────────────────────────────────────────────────────
  if (isError || !restaurant) {
    return (
      <ScreenContainer>
        <View style={styles.centerContainer}>
          <Ionicons name="wifi-outline" size={48} color={colors.textMuted} />
          <Text style={styles.errorText}>No se pudo cargar el restaurante</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => void refetch()}>
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      </ScreenContainer>
    );
  }

  const parsedMenu = parseMenuField(restaurant.menu);
  const priceLabel =
    restaurant.priceMin != null && restaurant.priceMax != null
      ? `$${restaurant.priceMin.toLocaleString()} - $${restaurant.priceMax.toLocaleString()}`
      : 'Sin precio';
  const cuisineTag = restaurant.theme || restaurant.tags?.[0] || 'Restaurante';

  return (
    <ScreenContainer noPadding>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.logoContainer}>
            {restaurant.logo ? (
              <Image source={{ uri: restaurant.logo }} style={styles.logo} />
            ) : (
              <View style={styles.logoFallback}>
                <Ionicons name="restaurant" size={80} color={colors.gold} />
              </View>
            )}
          </View>
        </View>

        {/* Content Section */}
        <View style={styles.contentSection}>
          <Text style={styles.restaurantName}>{restaurant.name}</Text>

          {/* Badges */}
          <View style={styles.badgesRow}>
            <View style={styles.badge}>
              <Ionicons name="restaurant" size={14} color="#fff" />
              <Text style={styles.badgeText}>{cuisineTag}</Text>
            </View>
            <View style={[styles.badge, restaurant.isOpen ? styles.badgeOpen : styles.badgeClosed]}>
              <View style={[styles.statusDot, restaurant.isOpen && styles.statusDotOpen]} />
              <Text style={styles.badgeText}>{restaurant.isOpen ? 'Abierto' : 'Cerrado'}</Text>
            </View>
            <View style={styles.badge}>
              <Ionicons name="cash" size={14} color={colors.gold} />
              <Text style={[styles.badgeText, styles.badgePriceText]}>{priceLabel}</Text>
            </View>
          </View>

          {/* Rating */}
          <View style={styles.ratingRow}>
            <View style={styles.starsContainer}>
              {([1, 2, 3, 4, 5] as const).map((pos) => (
                <Ionicons
                  key={`star-${pos}`}
                  name={pos <= Math.floor(restaurant.averageRating ?? 0) ? 'star' : 'star-outline'}
                  size={16}
                  color={colors.gold}
                  style={{ marginRight: 2 }}
                />
              ))}
            </View>
            <Text style={styles.ratingText}>
              {restaurant.averageRating != null ? restaurant.averageRating.toFixed(1) : '—'}
            </Text>
            <Text style={styles.reviewCountText}>· {restaurant.reviewCount} reseñas</Text>
          </View>

          <Text style={styles.description}>{restaurant.description}</Text>

          {/* Info Cards Grid */}
          <View style={styles.infoGrid}>
            {/* Locations — all entries shown in bold */}
            <View style={styles.infoCard}>
              <Ionicons name="location" size={20} color={colors.gold} />
              <Text style={styles.infoLabel}>DIRECCIONES</Text>
              {restaurant.locations?.length > 0 ? (
                restaurant.locations.map((loc) => (
                  <Text key={loc} style={ownerStyles.locationValue}>
                    {loc}
                  </Text>
                ))
              ) : (
                <Text style={styles.infoValue}>No disponible</Text>
              )}
            </View>

            <View style={styles.infoCard}>
              <Ionicons name="time" size={20} color={colors.gold} />
              <Text style={styles.infoLabel}>HORARIO</Text>
              <Text style={styles.infoValue}>{restaurant.hour || 'Consultar horario'}</Text>
            </View>

            <View style={styles.infoCard}>
              <Ionicons name="call" size={20} color={colors.gold} />
              <Text style={styles.infoLabel}>TELÉFONO</Text>
              <Text style={styles.infoValue}>{restaurant.phone || 'No disponible'}</Text>
            </View>

            <View style={styles.infoCard}>
              <Ionicons name="calendar" size={20} color={colors.gold} />
              <Text style={styles.infoLabel}>RESERVAS</Text>
              <Text style={styles.infoValue}>{reservations.length}</Text>
            </View>
          </View>

          {/* Menu Section */}
          <View style={styles.menuSection}>
            <Text style={styles.menuTitle}>
              {parsedMenu.type === 'url' ? 'Menú del restaurante' : 'Platos disponibles'}
            </Text>

            {parsedMenu.type === 'empty' && (
              <View style={styles.menuEmptyState}>
                <Ionicons name="document-text-outline" size={40} color={colors.gold} />
                <Text style={styles.menuEmptyText}>{parsedMenu.content}</Text>
              </View>
            )}

            {parsedMenu.type === 'text' && (
              <Text style={styles.menuText}>{parsedMenu.content}</Text>
            )}

            {parsedMenu.type === 'items' && (
              <View style={styles.menuItems}>
                {parsedMenu.content.map((item, idx) => (
                  <View key={`${item.name}-${idx}`} style={styles.menuItem}>
                    <Ionicons name="checkmark-circle" size={16} color={colors.gold} />
                    <View style={styles.menuItemContent}>
                      <Text style={styles.menuItemName}>{item.name}</Text>
                    </View>
                    {item.price !== undefined && (
                      <Text style={styles.menuItemPrice}>${item.price.toLocaleString()}</Text>
                    )}
                  </View>
                ))}
              </View>
            )}

            {parsedMenu.type === 'url' && Boolean(parsedMenu.displayUrl) && (
              <TouchableOpacity
                style={styles.menuUrlButton}
                onPress={() => handleOpenMenu(parsedMenu.displayUrl)}
              >
                <Ionicons name="document" size={20} color="#fff" />
                <Text style={styles.menuUrlButtonText}>Abrir menú</Text>
                <Ionicons name="open-outline" size={16} color="#fff" />
              </TouchableOpacity>
            )}
          </View>

          {/* Edit Button */}
          <TouchableOpacity style={ownerStyles.editButton} onPress={handleEdit}>
            <Ionicons name="create-outline" size={20} color={colors.background} />
            <Text style={ownerStyles.editButtonText}>Editar información del restaurante</Text>
          </TouchableOpacity>

          <View style={styles.bottomSpacer} />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const ownerStyles = StyleSheet.create({
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.gold,
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 12,
  },
  editButtonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
  locationValue: {
    color: 'rgba(240,234,220,0.9)',
    fontSize: 13,
    fontWeight: 'bold',
    marginTop: 4,
  },
});
