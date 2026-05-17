import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Linking,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import ScreenContainer from '../components/layout/ScreenContainer';
import { useRestaurantById } from '../hooks/useRestaurantById';
import { restaurantDetailMock } from '../mocks/restaurantDetailMock';
import { parseMenuField } from '../utils/menuParser';
import { restaurantDetailStyles as styles } from './RestaurantDetailScreen.styles';
import { colors } from '../theme/colors';
import type { UserStackParamList } from '../navigation/types';
import type { RestaurantDetail } from '../types/restaurant';

type Props = NativeStackScreenProps<UserStackParamList, 'RestaurantDetail'>;

/** Derive boolean open state from the backend's string field. */
function resolveIsOpen(openStatus?: string | null): boolean {
  return (openStatus ?? '').toUpperCase() === 'ABIERTO';
}

export default function RestaurantDetailScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<UserStackParamList>>();
  const route = useRoute<Props['route']>();
  const { restaurantId } = route.params;

  const [isFavorite, setIsFavorite] = useState(false);
  const [logoLoadError, setLogoLoadError] = useState(false);

  const { data: apiData, isLoading, isError, refetch } = useRestaurantById(restaurantId);

  // Build RestaurantDetail only when we have real data from the API.
  // Real data wins over the mock overlay; isOpen is derived from openStatus.
  const restaurant: RestaurantDetail | null = apiData
    ? { ...restaurantDetailMock, ...apiData, isOpen: resolveIsOpen(apiData.openStatus) }
    : null;

  const handleReservation = () => {
    if (!restaurant) return;
    navigation.navigate('CreateReservation', {
      restaurantId,
      restaurantName: restaurant.name,
    });
  };

  const handleOpenMenu = (url: string) => {
    Linking.openURL(url).catch(() => Alert.alert('Error', 'No se pudo abrir el menú.'));
  };

  if (isLoading) {
    return (
      <ScreenContainer noPadding>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.gold} />
          <Text style={styles.loadingText}>Cargando restaurante...</Text>
        </View>
      </ScreenContainer>
    );
  }

  if (isError || !restaurant) {
    return (
      <ScreenContainer noPadding>
        <View style={styles.centerContainer}>
          <Ionicons name="wifi-outline" size={48} color={colors.textMuted} />
          <Text style={styles.errorText}>No se pudo cargar el restaurante</Text>
          <Text style={styles.loadingText}>Revisa tu conexión e intenta de nuevo.</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => void refetch()}>
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.retryButton, { marginTop: 8, backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.border }]}
            onPress={() => navigation.goBack()}
          >
            <Text style={[styles.retryButtonText, { color: colors.textSecondary }]}>Volver</Text>
          </TouchableOpacity>
        </View>
      </ScreenContainer>
    );
  }

  const location = restaurant.locations?.[0] || 'Dirección no disponible';
  const parsedMenu = parseMenuField(restaurant.menu);
  const priceLabel = `$${restaurant.priceMin.toLocaleString()} - $${restaurant.priceMax.toLocaleString()}`;
  const cuisineTag = restaurant.theme || restaurant.tags?.[0] || 'Restaurante';
  const showLogo = Boolean(restaurant.logo) && !logoLoadError;
  const displayPhone = restaurant.phone || 'No disponible';

  return (
    <ScreenContainer noPadding>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={styles.heroSection}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={28} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={() => setIsFavorite(!isFavorite)}
          >
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={24}
              color={isFavorite ? colors.orange : '#fff'}
            />
          </TouchableOpacity>

          <View style={styles.logoContainer}>
            {showLogo ? (
              <Image
                source={{ uri: restaurant.logo! }}
                style={styles.logo}
                onError={() => setLogoLoadError(true)}
              />
            ) : (
              <View style={styles.logoFallback}>
                <Ionicons name="restaurant" size={80} color={colors.gold} />
              </View>
            )}
          </View>
        </View>

        {/* Content */}
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

          {/* Rating — mock until reviews endpoint is available */}
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

          {/* Info Grid */}
          <View style={styles.infoGrid}>
            <View style={styles.infoCard}>
              <Ionicons name="location" size={20} color={colors.gold} />
              <Text style={styles.infoLabel}>DIRECCIÓN</Text>
              <Text style={styles.infoValue}>{location}</Text>
            </View>
            <View style={styles.infoCard}>
              <Ionicons name="time" size={20} color={colors.gold} />
              <Text style={styles.infoLabel}>HORARIO</Text>
              <Text style={styles.infoValue}>{restaurant.hour || 'Consultar horario'}</Text>
              <Text style={styles.infoExtra}>{restaurant.openUntilLabel}</Text>
            </View>
            <View style={styles.infoCard}>
              <Ionicons name="call" size={20} color={colors.gold} />
              <Text style={styles.infoLabel}>TELÉFONO</Text>
              <Text style={styles.infoValue}>{displayPhone}</Text>
            </View>
            <View style={styles.infoCard}>
              <Ionicons name="walk" size={20} color={colors.gold} />
              <Text style={styles.infoLabel}>DISTANCIA</Text>
              <Text style={styles.infoValue}>{restaurant.distanceLabel}</Text>
              <Text style={styles.infoExtra}>{restaurant.estimatedTimeLabel}</Text>
            </View>
          </View>

          {/* Menu */}
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
                {parsedMenu.content.map((item) => (
                  <View key={item.name} style={styles.menuItem}>
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

          {/* Reservation */}
          <TouchableOpacity style={styles.reservationButton} onPress={handleReservation}>
            <Ionicons name="calendar" size={20} color="#fff" />
            <Text style={styles.reservationButtonText}>Reservar mesa</Text>
          </TouchableOpacity>

          <View style={styles.bottomSpacer} />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
