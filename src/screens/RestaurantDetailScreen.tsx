import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '../components/layout/ScreenContainer';
import { Restaurant, RestaurantDetail } from '../types/restaurant';
import { getRestaurantById } from '../services/api/restaurantApi';
import { restaurantDetailMock, sampleRestaurant } from '../mocks/restaurantDetailMock';
import { parseMenuField } from '../utils/menuParser';

interface RestaurantDetailScreenProps {
  restaurantId?: string;
}

export default function RestaurantDetailScreen({
  restaurantId = '1',
}: RestaurantDetailScreenProps) {
  const [restaurant, setRestaurant] = useState<RestaurantDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    loadRestaurant();
  }, [restaurantId]);

  const loadRestaurant = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getRestaurantById(restaurantId);
      const restaurantDetail: RestaurantDetail = {
        ...data,
        ...restaurantDetailMock,
      };
      setRestaurant(restaurantDetail);
    } catch (err) {
      console.error('Failed to load restaurant:', err);
      setError('No se pudo cargar el restaurante');
      // Use sample restaurant for development
      const restaurantDetail: RestaurantDetail = {
        ...sampleRestaurant,
        ...restaurantDetailMock,
      } as RestaurantDetail;
      setRestaurant(restaurantDetail);
    } finally {
      setLoading(false);
    }
  };

  const handleReservation = () => {
    // TODO: Navigate to reservation flow
    console.log('Reservation button pressed');
  };

  const handleOpenMenu = (url: string) => {
    Linking.openURL(url).catch(() => {
      console.error('Failed to open menu URL');
    });
  };

  if (loading && !restaurant) {
    return (
      <ScreenContainer>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#c9a96e" />
          <Text style={styles.loadingText}>Cargando restaurante...</Text>
        </View>
      </ScreenContainer>
    );
  }

  if (!restaurant) {
    return (
      <ScreenContainer>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>No se pudo cargar el restaurante</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadRestaurant}>
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      </ScreenContainer>
    );
  }

  const location = restaurant.locations?.[0];
  const parsedMenu = parseMenuField(restaurant.menu);
  const priceLabel = `$$${restaurant.priceMin} - $${restaurant.priceMax}`;
  const cuisineTag = restaurant.theme || restaurant.tags?.[0] || 'Restaurante';

  return (
    <ScreenContainer style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          {/* Back Button */}
          <TouchableOpacity style={styles.backButton}>
            <Ionicons name="chevron-back" size={28} color="#fff" />
          </TouchableOpacity>

          {/* Favorite Button */}
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={() => setIsFavorite(!isFavorite)}
          >
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={24}
              color={isFavorite ? '#FF6B35' : '#fff'}
            />
          </TouchableOpacity>

          {/* Restaurant Logo */}
          <View style={styles.logoContainer}>
            {restaurant.logo ? (
              <Image
                source={{ uri: restaurant.logo }}
                style={styles.logo}
              />
            ) : (
              <View style={styles.logoFallback}>
                <Ionicons name="restaurant" size={80} color="#c9a96e" />
              </View>
            )}
          </View>
        </View>

        {/* Content Section */}
        <View style={styles.contentSection}>
          {/* Restaurant Name */}
          <Text style={styles.restaurantName}>{restaurant.name}</Text>

          {/* Badges Row */}
          <View style={styles.badgesRow}>
            <View style={styles.badge}>
              <Ionicons name="restaurant" size={14} color="#fff" />
              <Text style={styles.badgeText}>{cuisineTag}</Text>
            </View>
            <View style={[styles.badge, restaurant.isOpen ? styles.badgeOpen : styles.badgeClosed]}>
              <View style={[styles.statusDot, restaurant.isOpen && styles.statusDotOpen]} />
              <Text style={styles.badgeText}>
                {restaurant.isOpen ? 'Abierto' : 'Cerrado'}
              </Text>
            </View>
            <View style={styles.badge}>
              <Ionicons name="cash" size={14} color="#c9a96e" />
              <Text style={[styles.badgeText, styles.badgePriceText]}>{priceLabel}</Text>
            </View>
          </View>

          {/* Rating Row */}
          <View style={styles.ratingRow}>
            <View style={styles.starsContainer}>
              {[...Array(5)].map((_, i) => (
                <Ionicons
                  key={i}
                  name={i < Math.floor(restaurant.averageRating) ? 'star' : 'star-outline'}
                  size={16}
                  color="#c9a96e"
                  style={{ marginRight: 2 }}
                />
              ))}
            </View>
            <Text style={styles.ratingText}>
              {restaurant.averageRating.toFixed(1)}
            </Text>
            <Text style={styles.reviewCountText}>
              · {restaurant.reviewCount} reseñas
            </Text>
          </View>

          {/* Description */}
          <Text style={styles.description}>{restaurant.description}</Text>

          {/* Info Cards Grid */}
          <View style={styles.infoGrid}>
            {/* Address Card */}
            <View style={styles.infoCard}>
              <Ionicons name="location" size={20} color="#c9a96e" />
              <Text style={styles.infoLabel}>DIRECCIÓN</Text>
              <Text style={styles.infoValue}>
                {location?.address || 'Dirección no disponible'}
              </Text>
              {location?.city && (
                <Text style={styles.infoCity}>{location.city}</Text>
              )}
            </View>

            {/* Hours Card */}
            <View style={styles.infoCard}>
              <Ionicons name="time" size={20} color="#c9a96e" />
              <Text style={styles.infoLabel}>HORARIO</Text>
              <Text style={styles.infoValue}>
                {restaurant.hour || 'Mar-Dom 12:00-22:00'}
              </Text>
              <Text style={styles.infoExtra}>{restaurant.openUntilLabel}</Text>
            </View>

            {/* Phone Card */}
            <View style={styles.infoCard}>
              <Ionicons name="call" size={20} color="#c9a96e" />
              <Text style={styles.infoLabel}>TELÉFONO</Text>
              <Text style={styles.infoValue}>{restaurant.phone}</Text>
            </View>

            {/* Distance Card */}
            <View style={styles.infoCard}>
              <Ionicons name="walk" size={20} color="#c9a96e" />
              <Text style={styles.infoLabel}>DISTANCIA</Text>
              <Text style={styles.infoValue}>{restaurant.distanceLabel}</Text>
              <Text style={styles.infoExtra}>{restaurant.estimatedTimeLabel}</Text>
            </View>
          </View>

          {/* Menu Section */}
          <View style={styles.menuSection}>
            <Text style={styles.menuTitle}>
              {parsedMenu.type === 'url' ? 'Menú del restaurante' : 'Platos disponibles'}
            </Text>

            {parsedMenu.type === 'empty' && (
              <View style={styles.menuEmptyState}>
                <Ionicons name="document-text-outline" size={40} color="#c9a96e" />
                <Text style={styles.menuEmptyText}>{parsedMenu.content}</Text>
              </View>
            )}

            {parsedMenu.type === 'text' && (
              <Text style={styles.menuText}>{parsedMenu.content}</Text>
            )}

            {parsedMenu.type === 'items' && Array.isArray(parsedMenu.content) && (
              <View style={styles.menuItems}>
                {(parsedMenu.content as Array<{ name: string; price?: number }>).map((item, idx) => (
                  <View key={idx} style={styles.menuItem}>
                    <Ionicons name="checkmark-circle" size={16} color="#c9a96e" />
                    <View style={styles.menuItemContent}>
                      <Text style={styles.menuItemName}>{item.name}</Text>
                    </View>
                    {item.price && (
                      <Text style={styles.menuItemPrice}>
                        ${item.price.toLocaleString()}
                      </Text>
                    )}
                  </View>
                ))}
              </View>
            )}

            {parsedMenu.type === 'url' && parsedMenu.displayUrl && (
              <TouchableOpacity
                style={styles.menuUrlButton}
                onPress={() => handleOpenMenu(parsedMenu.displayUrl!)}
              >
                <Ionicons name="document" size={20} color="#fff" />
                <Text style={styles.menuUrlButtonText}>Abrir menú</Text>
                <Ionicons name="open-outline" size={16} color="#fff" />
              </TouchableOpacity>
            )}
          </View>

          {/* Reservation Button */}
          <TouchableOpacity style={styles.reservationButton} onPress={handleReservation}>
            <Ionicons name="calendar" size={20} color="#fff" />
            <Text style={styles.reservationButtonText}>Reservar mesa</Text>
          </TouchableOpacity>

          {/* Bottom spacing for scroll */}
          <View style={styles.bottomSpacer} />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 12,
    fontSize: 14,
  },
  errorText: {
    color: '#FF6B35',
    fontSize: 16,
    marginBottom: 20,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#c9a96e',
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#0C1D32',
    fontWeight: 'bold',
    fontSize: 14,
  },

  /* Hero Section */
  heroSection: {
    height: 280,
    backgroundColor: '#2D4356',
    position: 'relative',
    marginHorizontal: 0,
    marginBottom: 24,
  },
  backButton: {
    position: 'absolute',
    top: 12,
    left: 20,
    zIndex: 10,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 22,
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 20,
    zIndex: 10,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 22,
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#1a2a3a',
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  logoFallback: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(201, 169, 110, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(201, 169, 110, 0.3)',
  },

  /* Content Section */
  contentSection: {
    paddingHorizontal: 20,
  },
  restaurantName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  badgesRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(201, 169, 110, 0.15)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(201, 169, 110, 0.3)',
  },
  badgeOpen: {
    backgroundColor: 'rgba(76, 175, 80, 0.15)',
    borderColor: 'rgba(76, 175, 80, 0.3)',
  },
  badgeClosed: {
    backgroundColor: 'rgba(244, 67, 54, 0.15)',
    borderColor: 'rgba(244, 67, 54, 0.3)',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#F44336',
  },
  statusDotOpen: {
    backgroundColor: '#4CAF50',
  },
  badgeText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    fontWeight: '500',
  },
  badgePriceText: {
    color: '#c9a96e',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  starsContainer: {
    flexDirection: 'row',
  },
  ratingText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  reviewCountText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
  },
  description: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 20,
  },

  /* Info Grid */
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  infoCard: {
    flex: 1,
    minWidth: '48%',
    backgroundColor: '#132238',
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  infoLabel: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 10,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  infoValue: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  infoExtra: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 11,
    marginTop: 2,
  },
  infoCity: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 11,
    marginTop: 2,
  },

  /* Menu Section */
  menuSection: {
    marginBottom: 24,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  menuEmptyState: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: 'rgba(201, 169, 110, 0.08)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(201, 169, 110, 0.2)',
  },
  menuEmptyText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
    marginTop: 12,
    textAlign: 'center',
  },
  menuText: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 13,
    lineHeight: 20,
    backgroundColor: '#132238',
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  menuItems: {
    gap: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#132238',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    gap: 10,
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemName: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '500',
  },
  menuItemPrice: {
    color: '#c9a96e',
    fontSize: 12,
    fontWeight: 'bold',
  },
  menuUrlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#c9a96e',
    paddingVertical: 14,
    borderRadius: 8,
  },
  menuUrlButtonText: {
    color: '#0C1D32',
    fontSize: 14,
    fontWeight: 'bold',
  },

  /* Reservation Button */
  reservationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#FF6B35',
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 12,
  },
  reservationButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomSpacer: {
    height: 20,
  },
});
