import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '../components/layout/ScreenContainer';
import { RestaurantDetail } from '../types/restaurant';
import { getRestaurantById } from '../services/api/restaurantService';
import { restaurantDetailMock, sampleRestaurant } from '../mocks/restaurantDetailMock';
import { parseMenuField } from '../utils/menuParser';
import { restaurantDetailStyles as styles } from './RestaurantDetailScreen.styles';

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

  const location = restaurant.locations?.[0] || 'Dirección no disponible';
  const parsedMenu = parseMenuField(restaurant.menu);
  const priceLabel = `$${restaurant.priceMin.toLocaleString()} - $$${restaurant.priceMax.toLocaleString()}`;
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
              <Image source={{ uri: restaurant.logo }} style={styles.logo} />
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
              <Text style={styles.badgeText}>{restaurant.isOpen ? 'Abierto' : 'Cerrado'}</Text>
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
            <Text style={styles.ratingText}>{restaurant.averageRating.toFixed(1)}</Text>
            <Text style={styles.reviewCountText}>· {restaurant.reviewCount} reseñas</Text>
          </View>

          {/* Description */}
          <Text style={styles.description}>{restaurant.description}</Text>

          {/* Info Cards Grid */}
          <View style={styles.infoGrid}>
            {/* Address Card */}
            <View style={styles.infoCard}>
              <Ionicons name="location" size={20} color="#c9a96e" />
              <Text style={styles.infoLabel}>DIRECCIÓN</Text>
              <Text style={styles.infoValue}>{location}</Text>
            </View>

            {/* Hours Card */}
            <View style={styles.infoCard}>
              <Ionicons name="time" size={20} color="#c9a96e" />
              <Text style={styles.infoLabel}>HORARIO</Text>
              <Text style={styles.infoValue}>{restaurant.hour || 'Mar-Dom 12:00-22:00'}</Text>
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

            {parsedMenu.type === 'items' && (
              <View style={styles.menuItems}>
                {parsedMenu.content.map((item, idx) => (
                  <View key={idx} style={styles.menuItem}>
                    <Ionicons name="checkmark-circle" size={16} color="#c9a96e" />
                    <View style={styles.menuItemContent}>
                      <Text style={styles.menuItemName}>{item.name}</Text>
                    </View>
                    {item.price && (
                      <Text style={styles.menuItemPrice}>${item.price.toLocaleString()}</Text>
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
