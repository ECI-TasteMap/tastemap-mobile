import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { getUserById } from '../services/api/userService';

const USER_ID = '69f14e016faf3c38a1f58978'; // temporal hasta tener auth

export default function ProfileScreen() {
  const [usuario, setUsuario] = useState<any>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    getUserById(USER_ID)
      .then((data) => setUsuario(data))
      .catch((err) => console.error(err))
      .finally(() => setCargando(false));
  }, []);

  if (cargando)
    return (
      <View style={styles.centered}>
        <ActivityIndicator color="#c9a96e" size="large" />
      </View>
    );

  return (
    <ScrollView style={styles.container}>
      {/* Avatar y nombre */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarTexto}>{usuario?.fullname?.charAt(0).toUpperCase()}</Text>
        </View>
        <Text style={styles.nombre}>{usuario?.fullname}</Text>
        <Text style={styles.email}>{usuario?.email}</Text>
        <View style={styles.roleBadge}>
          <Text style={styles.roleTexto}>{usuario?.role}</Text>
        </View>
      </View>

      {/* Opciones */}
      <View style={styles.seccion}>
        {[
          { icon: 'calendar-outline', label: 'Mis reservas' },
          { icon: 'heart-outline', label: 'Favoritos' },
          { icon: 'star-outline', label: 'Mis reseñas' },
          { icon: 'settings-outline', label: 'Configuración' },
          { icon: 'log-out-outline', label: 'Cerrar sesión' },
        ].map((item) => (
          <TouchableOpacity key={item.label} style={styles.opcion}>
            <Ionicons name={item.icon as any} size={22} color="#c9a96e" />
            <Text style={styles.opcionTexto}>{item.label}</Text>
            <Ionicons name="chevron-forward" size={18} color="rgba(240,234,220,0.3)" />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0C1D32' },
  centered: { flex: 1, backgroundColor: '#0C1D32', alignItems: 'center', justifyContent: 'center' },
  header: { alignItems: 'center', paddingTop: 60, paddingBottom: 30, backgroundColor: '#091727' },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#c9a96e',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarTexto: { fontSize: 36, color: '#0C1D32', fontWeight: 'bold', fontFamily: 'serif' },
  nombre: { color: '#fff', fontSize: 22, fontWeight: 'bold', fontFamily: 'serif' },
  email: {
    color: 'rgba(240,234,220,0.5)',
    fontSize: 13,
    marginTop: 4,
    fontFamily: 'sans-serif-medium',
  },
  roleBadge: {
    marginTop: 10,
    backgroundColor: 'rgba(201,169,110,0.15)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(201,169,110,0.3)',
  },
  roleTexto: { color: '#c9a96e', fontSize: 11, fontFamily: 'sans-serif-medium' },
  seccion: { padding: 20, marginTop: 10 },
  opcion: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1B2C3E',
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    gap: 14,
  },
  opcionTexto: { flex: 1, color: '#fff', fontSize: 15, fontFamily: 'sans-serif-medium' },
});
