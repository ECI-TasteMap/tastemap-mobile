import { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// ── Mock data (reemplazar con llamadas al backend) ──────────────────────────
type EstadoReserva = 'pendiente' | 'confirmada' | 'completada' | 'rechazada';
type TabId = 'hoy' | 'semana' | 'historial';

interface Reserva {
  id: string;
  nombre: string;
  hora: string;
  dia: 'Hoy' | 'Mañana' | string;
  personas: number;
  mesa: string;
  nota?: string;
  estado: EstadoReserva;
  tab: TabId;
}

const RESERVAS_MOCK: Reserva[] = [
  {
    id: '1',
    nombre: 'María García',
    hora: '8:00 PM',
    dia: 'Hoy',
    personas: 2,
    mesa: 'Mesa interior',
    nota: 'Aniversario 🤌',
    estado: 'pendiente',
    tab: 'hoy',
  },
  {
    id: '2',
    nombre: 'Luis Martínez',
    hora: '9:00 PM',
    dia: 'Hoy',
    personas: 6,
    mesa: 'Mesa grande',
    nota: 'Sin gluten',
    estado: 'pendiente',
    tab: 'hoy',
  },
  {
    id: '3',
    nombre: 'Carlos Herrera',
    hora: '7:30 PM',
    dia: 'Hoy',
    personas: 4,
    mesa: 'Mesa exterior',
    nota: undefined,
    estado: 'completada',
    tab: 'hoy',
  },
  {
    id: '4',
    nombre: 'Ana Rodríguez',
    hora: '1:00 PM',
    dia: 'Mañana',
    personas: 2,
    mesa: '',
    nota: '"Menú vegetariano por favor"',
    estado: 'pendiente',
    tab: 'semana',
  },
  {
    id: '5',
    nombre: 'Roberto Salcedo',
    hora: '7:00 PM',
    dia: 'Mié 12',
    personas: 3,
    mesa: 'Mesa bar',
    estado: 'confirmada',
    tab: 'semana',
  },
];

const TABS: { id: TabId; label: string }[] = [
  { id: 'hoy', label: 'Hoy' },
  { id: 'semana', label: 'Esta semana' },
  { id: 'historial', label: 'Historial' },
];
// ───────────────────────────────────────────────────────────────────────────

const BORDER_COLORS: Record<EstadoReserva, string> = {
  pendiente: '#c9a96e',
  confirmada: '#4dd9c0',
  completada: '#4a5568',
  rechazada: '#d9504d',
};

export default function GestionReservas() {
  const insets = useSafeAreaInsets();
  const [tabActiva, setTabActiva] = useState<TabId>('hoy');
  const [reservas, setReservas] = useState<Reserva[]>(RESERVAS_MOCK);

  const reservasFiltradas = reservas.filter((r) => {
    if (tabActiva === 'hoy') return r.tab === 'hoy' && r.estado !== 'rechazada';
    if (tabActiva === 'semana') return r.tab === 'semana' && r.estado !== 'rechazada';
    if (tabActiva === 'historial')
      return r.estado === 'completada' || r.estado === 'rechazada';
    return false;
  });

  const pendientesHoy = reservas.filter(
    (r) => r.tab === 'hoy' && r.estado === 'pendiente'
  ).length;

  const cambiarEstado = (id: string, nuevoEstado: EstadoReserva) =>
    setReservas((prev) =>
      prev.map((r) => (r.id === id ? { ...r, estado: nuevoEstado } : r))
    );

  return (
    <View style={styles.wrapper}>
      {/* Header con gradiente simulado */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Text style={styles.headerTitulo}>Gestión de Reservas</Text>
        <Text style={styles.headerSub}>La Trattoria · Lunes 10 Mar 2026</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {TABS.map((tab) => {
          const activa = tabActiva === tab.id;
          const label =
            tab.id === 'hoy' && pendientesHoy > 0
              ? `${tab.label} (${pendientesHoy})`
              : tab.label;
          return (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tab, activa && styles.tabActivo]}
              onPress={() => setTabActiva(tab.id)}
            >
              <Text style={[styles.tabTexto, activa && styles.tabTextoActivo]}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Lista de reservas */}
      <ScrollView
        style={styles.lista}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {reservasFiltradas.length === 0 && (
          <Text style={styles.sinResultados}>
            No hay reservas en esta sección 🎉
          </Text>
        )}

        {reservasFiltradas.map((r) => (
          <View
            key={r.id}
            style={[
              styles.reservaCard,
              { borderLeftColor: BORDER_COLORS[r.estado] },
            ]}
          >
            {/* Cabecera */}
            <View style={styles.reservaCabecera}>
              <Text style={styles.reservaNombre}>{r.nombre}</Text>
              <Text style={styles.reservaHoraBadge}>
                {r.hora} · {r.dia}
              </Text>
            </View>

            {/* Detalle */}
            <Text style={styles.reservaDetalle}>
              {'👥 '}
              {r.personas} {r.personas === 1 ? 'persona' : 'personas'}
              {r.mesa ? ` · ${r.mesa}` : ''}
              {r.nota ? ` · ${r.nota}` : ''}
            </Text>

            {/* Acciones por estado */}
            {r.estado === 'pendiente' && (
              <View style={styles.botonesRow}>
                <TouchableOpacity
                  style={[styles.boton, styles.botonConfirmar]}
                  onPress={() => cambiarEstado(r.id, 'confirmada')}
                >
                  <Text style={styles.botonTexto}>✓ Confirmar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.boton, styles.botonRechazar]}
                  onPress={() => cambiarEstado(r.id, 'rechazada')}
                >
                  <Text style={styles.botonTexto}>✗ Rechazar</Text>
                </TouchableOpacity>
              </View>
            )}

            {r.estado === 'confirmada' && (
              <TouchableOpacity
                style={[styles.boton, styles.botonCompletar]}
                onPress={() => cambiarEstado(r.id, 'completada')}
              >
                <Text style={styles.botonTexto}>✓ Completar</Text>
              </TouchableOpacity>
            )}

            {r.estado === 'completada' && (
              <View style={[styles.boton, styles.botonCompletada]}>
                <Text style={[styles.botonTexto, { color: '#4dd9c0' }]}>
                  ✓ Completada
                </Text>
              </View>
            )}

            {r.estado === 'rechazada' && (
              <View style={[styles.boton, styles.botonRechazada]}>
                <Text style={[styles.botonTexto, { color: '#d9504d' }]}>
                  ✗ Rechazada
                </Text>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#0C1D32',
  },

  // Header
  header: {
    backgroundColor: '#0f2a1e',
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 24,
  },
  headerTitulo: {
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
  tabActivo: {
    backgroundColor: '#243d2b',
    borderWidth: 1,
    borderColor: '#4dd9c0',
  },
  tabTexto: {
    color: 'rgba(240,234,220,0.5)',
    fontSize: 12,
    fontFamily: 'sans-serif-medium',
    fontWeight: '600',
  },
  tabTextoActivo: {
    color: '#FFFFFF',
  },

  // Lista
  lista: {
    flex: 1,
    paddingHorizontal: 16,
    marginTop: 12,
  },
  sinResultados: {
    color: 'rgba(240,234,220,0.5)',
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 30,
    fontFamily: 'serif',
  },

  // Reserva card
  reservaCard: {
    backgroundColor: '#1B2C3E',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 3,
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
  reservaHoraBadge: {
    color: '#c9a96e',
    fontSize: 13,
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

  // Botones
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
  botonCompletada: {
    backgroundColor: 'rgba(77,217,192,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(77,217,192,0.3)',
  },
  botonRechazada: {
    backgroundColor: 'rgba(217,80,77,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(217,80,77,0.3)',
  },
  botonTexto: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    fontFamily: 'sans-serif-medium',
  },
});