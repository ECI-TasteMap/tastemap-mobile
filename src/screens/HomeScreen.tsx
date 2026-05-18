import React, { useState, useRef } from 'react';
import {
  ScrollView,
  FlatList,
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useRestaurants } from '../hooks/useRestaurants';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { radius } from '../theme/radius';
import { typography } from '../theme/typography';
import type { Restaurant } from '../types/restaurant';
import type { UserTabParamList, UserStackParamList } from '../navigation/types';

type HomeNav = CompositeNavigationProp<
  BottomTabNavigationProp<UserTabParamList, 'Home'>,
  NativeStackNavigationProp<UserStackParamList>
>;

const getPrecio = (min: number | null): string => {
  if (min == null) return '—';
  if (min < 20000) return '$';
  if (min < 40000) return '$$';
  if (min < 80000) return '$$$';
  return '$$$$';
};

const PLANES = [
  { id: 'romantico', label: 'Romántico', emoji: '👫❤️' },
  { id: 'familiar', label: 'Familiar', emoji: '👨‍👩‍👧' },
  { id: 'casual', label: 'Casual', emoji: '☕' },
  { id: 'negocios', label: 'Negocios', emoji: '💼' },
];

function RestaurantCardHorizontal({
  item,
  onPress,
}: {
  item: Restaurant;
  onPress: () => void;
}) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () =>
    Animated.spring(scale, { toValue: 0.96, useNativeDriver: true, speed: 50 }).start();
  const onPressOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 50 }).start();

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={styles.restaurantCard}
      >
        <View style={styles.restaurantImagen}>
          {item.logo ? (
            <Image
              source={{ uri: item.logo }}
              style={{ width: '100%', height: '100%' }}
              defaultSource={require('../../assets/icon.png')}
            />
          ) : (
            <Ionicons name="restaurant" size={36} color={colors.gold} />
          )}
          <View style={styles.precioBadge}>
            <Text style={styles.precioTexto}>{getPrecio(item.priceMin)}</Text>
          </View>
        </View>
        <Text style={styles.restaurantNombre} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.restaurantSub} numberOfLines={1}>
          {item.tags[0]} · {item.locations[0]}
        </Text>
        <View style={styles.restaurantFooter}>
          <Text style={styles.rating}>
            ★ {item.averageRating != null ? item.averageRating.toFixed(1) : '—'}
          </Text>
          <Text style={styles.distancia}>~1 km</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

function PopularRow({ item, onPress }: { item: Restaurant; onPress: () => void }) {
  return (
    <TouchableOpacity activeOpacity={0.75} onPress={onPress} style={styles.popularCard}>
      <View style={styles.popularImagen}>
        {item.logo ? (
          <Image source={{ uri: item.logo }} style={styles.popularImagen} />
        ) : (
          <Ionicons name="restaurant" size={24} color={colors.gold} />
        )}
      </View>
      <View style={styles.popularInfo}>
        <Text style={styles.restaurantNombre} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.restaurantSub} numberOfLines={1}>
          {item.tags[0]} · {getPrecio(item.priceMin)}
        </Text>
      </View>
      <View style={styles.popularDerecha}>
        <Text style={styles.rating}>
          ★ {item.averageRating != null ? item.averageRating.toFixed(1) : '—'}
        </Text>
        <Text style={styles.distancia}>~1 km</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function HomeScreen() {
  const navigation = useNavigation<HomeNav>();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [categoriaActiva, setCategoriaActiva] = useState('');
  const [planActivo, setPlanActivo] = useState('');

  const { data: restaurantes = [], isLoading } = useRestaurants();

  const categorias = [...new Set(restaurantes.flatMap((r) => r.tags))];

  const filtrados =
    categoriaActiva
      ? restaurantes.filter((r) => r.tags.includes(categoriaActiva))
      : restaurantes;

  const cercanos = filtrados.slice(0, 4);
  const populares = filtrados.slice(4);

  const goToDetail = (id: string) =>
    navigation.navigate('RestaurantDetail', { restaurantId: id });

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingTop: insets.top }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.direccion}>📍 Bogotá, Colombia</Text>
        <Text style={styles.bienvenida}>Hola, bienvenido</Text>
        <Text style={styles.bienvenida}>¿Dónde comemos?</Text>
      </View>

      {/* Búsqueda */}
      <View style={styles.searchRow}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.input}
            placeholder="¿Qué se te antoja hoy?"
            placeholderTextColor="#7F8488"
            value={query}
            onChangeText={setQuery}
          />
        </View>
        <TouchableOpacity activeOpacity={0.8} style={styles.searchBtn}>
          <Ionicons name="arrow-forward" size={22} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Categorías */}
      {categorias.length > 0 && (
        <View style={styles.seccion}>
          <Text style={styles.seccionTitulo}>Explorar</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity
              style={[styles.chip, categoriaActiva === '' && styles.chipActivo]}
              onPress={() => setCategoriaActiva('')}
            >
              <Text style={styles.chipTexto}>Todos</Text>
            </TouchableOpacity>
            {categorias.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[styles.chip, categoriaActiva === cat && styles.chipActivo]}
                onPress={() => setCategoriaActiva(cat)}
              >
                <Text style={styles.chipTexto}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Planes */}
      <View style={styles.seccion}>
        <Text style={styles.seccionTitulo}>¿Cuál es tu plan?</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {PLANES.map((plan) => (
            <TouchableOpacity
              key={plan.id}
              activeOpacity={0.8}
              style={[styles.planCard, planActivo === plan.id && styles.planCardActivo]}
              onPress={() => setPlanActivo(planActivo === plan.id ? '' : plan.id)}
            >
              <Text style={styles.planEmoji}>{plan.emoji}</Text>
              <Text style={styles.planLabel}>{plan.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Cerca de ti */}
      <View style={styles.seccion}>
        <View style={styles.seccionHeader}>
          <Text style={styles.seccionTitulo}>Cerca de ti</Text>
          {/* TODO: navigate to full list when SearchScreen supports filters */}
        </View>
        {isLoading ? (
          <ActivityIndicator color={colors.gold} style={{ marginTop: 12 }} />
        ) : (
          <FlatList
            horizontal
            data={cercanos}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <RestaurantCardHorizontal item={item} onPress={() => goToDetail(item.id)} />
            )}
            ListEmptyComponent={
              <Text style={styles.restaurantSub}>No hay restaurantes disponibles.</Text>
            }
          />
        )}
      </View>

      {/* Más populares */}
      <View style={[styles.seccion, { marginBottom: 32 }]}>
        <View style={styles.seccionHeader}>
          <Text style={styles.seccionTitulo}>Más populares</Text>
        </View>
        {isLoading ? (
          <ActivityIndicator color={colors.gold} style={{ marginTop: 12 }} />
        ) : (
          <FlatList
            data={populares}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <PopularRow item={item} onPress={() => goToDetail(item.id)} />
            )}
            ListEmptyComponent={
              <Text style={styles.restaurantSub}>No hay más restaurantes.</Text>
            }
          />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.screen,
    paddingVertical: 0,
  },
  header: { padding: spacing.sm, paddingTop: spacing.md },
  direccion: {
    color: colors.textPrimary,
    fontSize: typography.size.xs,
    fontWeight: typography.weight.bold,
    marginBottom: spacing.xl,
    fontFamily: typography.fontFamily.serif,
  },
  bienvenida: {
    color: colors.textPrimary,
    fontFamily: typography.fontFamily.serif,
    fontSize: typography.size.xxl,
    fontWeight: typography.weight.bold,
    fontStyle: 'italic',
  },
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.xl },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.md,
    backgroundColor: '#1B2C3E',
    borderColor: '#7F8488',
    borderWidth: 0.5,
  },
  input: {
    flex: 1,
    padding: spacing.sm,
    fontSize: typography.size.base,
    fontFamily: typography.fontFamily.body,
    color: colors.textPrimary,
  },
  searchBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    backgroundColor: colors.gold,
    width: 44,
    height: 44,
  },
  seccion: { marginTop: spacing.xxl + spacing.sm },
  seccionTitulo: {
    color: colors.textPrimary,
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    marginBottom: spacing.md,
    fontFamily: typography.fontFamily.serif,
  },
  seccionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  chip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.round,
    backgroundColor: '#1B2C3E',
    marginRight: spacing.sm,
  },
  chipActivo: { backgroundColor: colors.gold },
  chipTexto: { color: colors.textPrimary, fontSize: typography.size.sm, fontFamily: typography.fontFamily.body },
  planCard: {
    width: 100,
    height: 100,
    borderRadius: radius.lg,
    backgroundColor: '#1B2C3E',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  planCardActivo: { backgroundColor: colors.gold },
  planEmoji: { fontSize: 28, marginBottom: spacing.sm },
  planLabel: { color: colors.textPrimary, fontSize: typography.size.sm, fontFamily: typography.fontFamily.body },
  restaurantCard: {
    width: 160,
    marginRight: spacing.md,
    backgroundColor: '#1B2C3E',
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  restaurantImagen: {
    height: 120,
    backgroundColor: '#2a3f55',
    alignItems: 'center',
    justifyContent: 'center',
  },
  precioBadge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: radius.sm,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  precioTexto: { color: colors.textPrimary, fontSize: typography.size.xs, fontFamily: typography.fontFamily.body },
  restaurantNombre: {
    color: colors.textPrimary,
    fontSize: typography.size.md,
    fontWeight: typography.weight.bold,
    fontFamily: typography.fontFamily.serif,
    margin: spacing.sm,
    marginBottom: 2,
  },
  restaurantSub: {
    color: 'rgba(240,234,220,0.5)',
    fontSize: typography.size.xs,
    marginHorizontal: spacing.sm,
    fontFamily: typography.fontFamily.body,
  },
  restaurantFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: spacing.sm,
    marginTop: spacing.xs,
  },
  rating: { color: colors.gold, fontSize: typography.size.xs, fontFamily: typography.fontFamily.body },
  distancia: { color: colors.teal, fontSize: typography.size.xs, fontFamily: typography.fontFamily.body },
  popularCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1B2C3E',
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  popularImagen: {
    width: 56,
    height: 56,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
    backgroundColor: '#2a3f55',
  },
  popularInfo: { flex: 1 },
  popularDerecha: { alignItems: 'flex-end', gap: spacing.xs },
});
