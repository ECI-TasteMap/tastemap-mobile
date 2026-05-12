import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { getRestaurants } from '../services/api/restaurantService';

// ── Mock data (reemplazar con llamadas al backend) ──────────────────────────
const STATS = {
  reservasMes: 24,
  reservasMesDelta: '+8 vs. mes anterior',
  rating: 4.8,
  ratingReviews: 128,
  pendientesHoy: 3,
  tasaConfirmacion: 89,
};

const RESERVAS_HOY = [
  {
    id: '1',
    nombre: 'María García',
    hora: '8:00 PM',
    personas: 2,
    mesa: 'Mesa interior',
    nota: '"Aniversario, flores si es posible"',
    estado: 'pendiente', // pendiente | confirmada | completada
  },
  {
    id: '2',
    nombre: 'Carlos Herrera',
    hora: '7:30 PM',
    personas: 4,
    mesa: 'Mesa exterior',
    nota: null,
    estado: 'confirmada',
  },
];

const RESENAS = [
  {
    id: '1',
    nombre: 'Valentina R.',
    estrellas: 5,
    texto: 'La pasta es increíble. Ambiente perfecto para una cita romántica.',
  },
  {
    id: '2',
    nombre: 'Andrés M.',
    estrellas: 4,
    texto: 'Muy buena atención y tiempo de espera razonable.',
  },
];

// ───────────────────────────────────────────────────────────────────────────

const formatearFecha = () => {
  const opciones: Intl.DateTimeFormatOptions = { weekday: 'long', day: '2-digit', month: 'long' };
  const str = new Date().toLocaleDateString('es-ES', opciones);
  return str.replace(/\b\w/g, (l) => l.toUpperCase());
};

const Estrellas = ({ cantidad }: { cantidad: number }) => (
  <Text style={styles.estrellas}>
    {'★'.repeat(cantidad)}{'☆'.repeat(5 - cantidad)}
  </Text>
);

export default function RestaurantOwnerDashboard() {
  const [reservas, setReservas] = useState(RESERVAS_HOY);

  const confirmar = (id: string) =>
    setReservas((prev) =>
      prev.map((r) => (r.id === id ? { ...r, estado: 'confirmada' } : r))
    );

  const rechazar = (id: string) =>
    setReservas((prev) => prev.filter((r) => r.id !== id));

  const completar = (id: string) =>
    setReservas((prev) =>
      prev.map((r) => (r.id === id ? { ...r, estado: 'completada' } : r))
    );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.direccion}> </Text>
        <Text style={styles.bienvenida}>Hola, Restaurante</Text>
        <Text style={styles.fecha}>{formatearFecha()}</Text>
      </View>

      {/* Stats grid 2×2 */}
      <View style={styles.statsGrid}>
        {/* Reservas este mes */}
        <View style={styles.statCard}>
          <Text style={styles.statValor}>{STATS.reservasMes}</Text>
          <Text style={styles.statLabel}>RESERVAS ESTE MES</Text>
          <Text style={styles.statDelta}>↑ {STATS.reservasMesDelta}</Text>
        </View>

        {/* Rating */}
        <View style={styles.statCard}>
          <Text style={styles.statValor}>{STATS.rating}</Text>
          <Text style={styles.statLabel}>RATING PROMEDIO</Text>
          <Text style={styles.statDelta}>
            {'★'.repeat(Math.round(STATS.rating))} {STATS.ratingReviews} reseñas
          </Text>
        </View>

        {/* Pendientes hoy */}
        <View style={styles.statCard}>
          <Text style={styles.statValor}>{STATS.pendientesHoy}</Text>
          <Text style={styles.statLabel}>PENDIENTES HOY</Text>
          <Text style={[styles.statDelta, styles.statDeltaWarning]}>
            ⚠ Requieren acción
          </Text>
        </View>

        {/* Tasa confirmación */}
        <View style={styles.statCard}>
          <Text style={styles.statValor}>{STATS.tasaConfirmacion}%</Text>
          <Text style={styles.statLabel}>TASA CONFIRMACIÓN</Text>
          <Text style={styles.statDelta}>↑ Buena gestión</Text>
        </View>
      </View>

      {/* Reservas de hoy */}
      <View style={styles.seccion}>
        <Text style={styles.seccionTitulo}>Reservas de hoy</Text>

        {reservas.map((r) => (
          <View key={r.id} style={styles.reservaCard}>
            {/* Cabecera */}
            <View style={styles.reservaCabecera}>
              <Text style={styles.reservaNombre}>{r.nombre}</Text>
              <Text style={styles.reservaHora}>{r.hora}</Text>
            </View>

            {/* Detalle */}
            <Text style={styles.reservaDetalle}>
              👥 {r.personas} {r.personas === 1 ? 'persona' : 'personas'} · {r.mesa}
              {r.nota ? ` · ${r.nota}` : ''}
            </Text>

            {/* Acciones */}
            {r.estado === 'pendiente' && (
              <View style={styles.botonesRow}>
                <TouchableOpacity
                  style={[styles.boton, styles.botonConfirmar]}
                  onPress={() => confirmar(r.id)}
                >
                  <Text style={styles.botonTexto}>✓ Confirmar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.boton, styles.botonRechazar]}
                  onPress={() => rechazar(r.id)}
                >
                  <Text style={styles.botonTexto}>✗ Rechazar</Text>
                </TouchableOpacity>
              </View>
            )}

            {r.estado === 'confirmada' && (
              <TouchableOpacity
                style={[styles.boton, styles.botonCompletar]}
                onPress={() => completar(r.id)}
              >
                <Text style={styles.botonTexto}>✓ Completar</Text>
              </TouchableOpacity>
            )}

            {r.estado === 'completada' && (
              <View style={styles.estadoBadge}>
                <Text style={styles.estadoBadgeTexto}>✓ Completada</Text>
              </View>
            )}
          </View>
        ))}

        {reservas.length === 0 && (
          <Text style={styles.sinReservas}>Sin reservas pendientes por hoy 🎉</Text>
        )}
      </View>

      {/* Últimas reseñas */}
      <View style={[styles.seccion, { marginBottom: 40 }]}>
        <Text style={styles.seccionTitulo}>Últimas reseñas</Text>

        {RESENAS.map((resena) => (
          <View key={resena.id} style={styles.resenaCard}>
            <View style={styles.resenaCabecera}>
              <Text style={styles.resenaNombre}>{resena.nombre}</Text>
              <Estrellas cantidad={resena.estrellas} />
            </View>
            <Text style={styles.resenaTexto}>{resena.texto}</Text>
          </View>
        ))}
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

  // Header
  header: { paddingTop: 24, paddingBottom: 8 },
  direccion: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
    fontFamily: 'serif',
  },
  bienvenida: {
    color: '#FFFFFF',
    fontFamily: 'serif',
    fontSize: 27,
    fontWeight: '700',
    fontStyle: 'italic',
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
  statDeltaWarning: {
    color: '#e8a838',
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

  // Reserva card
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
  reservaNombre: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'serif',
  },
  reservaHora: {
    color: '#c9a96e',
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'sans-serif-medium',
  },
  reservaDetalle: {
    color: 'rgba(240,234,220,0.65)',
    fontSize: 12,
    fontFamily: 'sans-serif-medium',
    marginBottom: 14,
    lineHeight: 18,
  },

  // Botones de acción
  botonesRow: {
    flexDirection: 'row',
    gap: 10,
  },
  boton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  botonConfirmar: {
    backgroundColor: '#1e3d2a',
    borderWidth: 1,
    borderColor: '#4dd9c0',
  },
  botonRechazar: {
    backgroundColor: '#3d1e1e',
    borderWidth: 1,
    borderColor: '#d9504d',
  },
  botonCompletar: {
    backgroundColor: '#1B2C3E',
    borderWidth: 1,
    borderColor: '#7F8488',
  },
  botonTexto: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    fontFamily: 'sans-serif-medium',
  },
  estadoBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(77,217,192,0.15)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  estadoBadgeTexto: {
    color: '#4dd9c0',
    fontSize: 12,
    fontFamily: 'sans-serif-medium',
  },
  sinReservas: {
    color: 'rgba(240,234,220,0.5)',
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 20,
    fontFamily: 'serif',
  },

  // Reseñas
  resenaCard: {
    backgroundColor: '#1B2C3E',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  resenaCabecera: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  resenaNombre: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
    fontFamily: 'serif',
  },
  estrellas: {
    color: '#c9a96e',
    fontSize: 14,
  },
  resenaTexto: {
    color: 'rgba(240,234,220,0.7)',
    fontSize: 13,
    fontFamily: 'sans-serif-medium',
    lineHeight: 20,
  },
});