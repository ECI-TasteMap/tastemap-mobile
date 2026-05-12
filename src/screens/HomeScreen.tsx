import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import { getRestaurants } from '../services/api/restaurantService';

const getEmoji = (theme: string) => {
  const emojis: any = {
    anime: '🍣',
    italiano: '🍝',
    americano: '🍔',
    saludable: '🥗',
    mexicano: '🌮',
    mariscos: '🦞',
    cafe: '☕',
  };
  return emojis[theme] || '🍽️';
};

const getPrecio = (min: number) => {
  if (min < 20000) return '$';
  if (min < 40000) return '$$';
  if (min < 80000) return '$$$';
  return '$$$$';
};

const planes = [
  { id: 'romantico', label: 'Romántico', emoji: '👫❤️' },
  { id: 'familiar', label: 'Familiar', emoji: '👨‍👩‍👧' },
  { id: 'casual', label: 'Casual', emoji: '☕' },
  { id: 'negocios', label: 'Negocios', emoji: '💼' },
];

export default function HomeScreen() {
  const [query, setQuery] = useState('');
  const [categoriaActiva, setCategoriaActiva] = useState('');
  const [planActivo, setPlanActivo] = useState('');
  const [restaurantes, setRestaurantes] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    getRestaurants()
      .then((data) => setRestaurantes(data))
      .catch((err) => console.error(err))
      .finally(() => setCargando(false));
  }, []);

  const categorias = [...new Set(restaurantes.flatMap((r: any) => r.tags))];

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.direccion}>📍 Bogotá, Colombia</Text>
        <Text style={styles.bienvenida}>Hola, María</Text>
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
        <TouchableOpacity onPress={() => {}} style={styles.searchButtomContainer}>
          <Ionicons name="arrow-forward" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Categorías */}
      <View style={styles.seccion}>
        <Text style={styles.seccionTitulo}>Explorar</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
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

      {/* Planes */}
      <View style={styles.seccion}>
        <Text style={styles.seccionTitulo}>¿Cuál es tu plan?</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {planes.map((plan) => (
            <TouchableOpacity
              key={plan.id}
              style={[styles.planCard, planActivo === plan.id && styles.planCardActivo]}
              onPress={() => setPlanActivo(plan.id)}
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
          <TouchableOpacity>
            <Text style={styles.verTodo}>Ver todo</Text>
          </TouchableOpacity>
        </View>
        {cargando ? (
          <Text style={styles.restaurantSub}>Cargando...</Text>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {restaurantes.slice(0, 4).map((r: any) => (
              <TouchableOpacity key={r.id} style={styles.restaurantCard}>
                <View style={styles.restaurantImagen}>
                  <Image source={{ uri: r.logo }} style={{ width: '100%', height: '100%' }} />
                  <View style={styles.precioBadge}>
                    <Text style={styles.precioTexto}>{getPrecio(r.priceMin)}</Text>
                  </View>
                </View>
                <Text style={styles.restaurantNombre}>{r.name}</Text>
                <Text style={styles.restaurantSub}>
                  {r.tags[0]} · {r.locations[0]}
                </Text>
                <View style={styles.restaurantFooter}>
                  <Text style={styles.rating}>★ 4.5</Text>
                  <Text style={styles.distancia}>~1 km</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      {/* Más populares */}
      <View style={styles.seccion}>
        <View style={styles.seccionHeader}>
          <Text style={styles.seccionTitulo}>Más populares</Text>
          <TouchableOpacity>
            <Text style={styles.verTodo}>Ver todo</Text>
          </TouchableOpacity>
        </View>
        {cargando ? (
          <Text style={styles.restaurantSub}>Cargando...</Text>
        ) : (
          restaurantes.slice(4).map((r: any) => (
            <TouchableOpacity key={r.id} style={styles.popularCard}>
              <View style={[styles.popularImagen, { backgroundColor: '#1B2C3E' }]}>
                <Image source={{ uri: r.logo }} style={styles.popularImagen} />
              </View>
              <View style={styles.popularInfo}>
                <Text style={styles.restaurantNombre}>{r.name}</Text>
                <Text style={styles.restaurantSub}>
                  {r.tags[0]} · {getPrecio(r.priceMin)}
                </Text>
              </View>
              <View style={styles.popularDerecha}>
                <Text style={styles.rating}>★ 4.5</Text>
                <Text style={styles.distancia}>~1 km</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0C1D32', padding: 20, paddingVertical: 0 },
  direccion: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 20,
    fontFamily: 'serif',
  },
  bienvenida: {
    color: '#FFFFFF',
    fontFamily: 'serif',
    fontSize: 27,
    fontWeight: '700',
    fontStyle: 'italic',
  },
  header: { padding: 10 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 13,
    backgroundColor: '#1B2C3E',
    borderColor: '#7F8488',
    borderWidth: 0.5,
    width: '80%',
  },
  input: {
    padding: 8,
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'sans-serif-medium',
    color: '#fff',
  },
  searchButtomContainer: {
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 13,
    backgroundColor: '#c9a96e',
    width: '15%',
    height: 40,
  },
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 20 },
  seccion: { marginTop: 30 },
  seccionTitulo: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    fontFamily: 'serif',
  },
  seccionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  verTodo: { color: '#c9a96e', fontSize: 13, fontFamily: 'sans-serif-medium' },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#1B2C3E',
    marginRight: 10,
  },
  chipActivo: { backgroundColor: '#c9a96e' },
  chipTexto: { color: '#fff', fontSize: 13, fontFamily: 'sans-serif-medium' },
  planCard: {
    width: 100,
    height: 100,
    borderRadius: 16,
    backgroundColor: '#1B2C3E',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  planCardActivo: { backgroundColor: '#c9a96e' },
  planEmoji: { fontSize: 30, marginBottom: 8 },
  planLabel: { color: '#fff', fontSize: 13, fontFamily: 'sans-serif-medium' },
  restaurantCard: {
    width: 160,
    marginRight: 14,
    backgroundColor: '#1B2C3E',
    borderRadius: 16,
    overflow: 'hidden',
  },
  restaurantImagen: {
    height: 120,
    backgroundColor: '#2a3f55',
    alignItems: 'center',
    justifyContent: 'center',
  },
  restaurantEmoji: { fontSize: 48 },
  precioBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  precioTexto: { color: '#fff', fontSize: 11, fontFamily: 'sans-serif-medium' },
  restaurantNombre: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'serif',
    margin: 10,
    marginBottom: 2,
  },
  restaurantSub: {
    color: 'rgba(240,234,220,0.5)',
    fontSize: 11,
    marginHorizontal: 10,
    fontFamily: 'sans-serif-medium',
  },
  restaurantFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 10,
    marginTop: 6,
  },
  rating: { color: '#c9a96e', fontSize: 12, fontFamily: 'sans-serif-medium' },
  distancia: { color: '#4dd9c0', fontSize: 12, fontFamily: 'sans-serif-medium' },
  popularCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1B2C3E',
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
  },
  popularImagen: {
    width: 56,
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  popularInfo: { flex: 1 },
  popularDerecha: { alignItems: 'flex-end', gap: 4 },
});
