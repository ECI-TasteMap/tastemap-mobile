import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQueryClient } from '@tanstack/react-query';
import { useRestaurantById } from '../hooks/useRestaurantById';
import { createRestaurant, updateRestaurant } from '../services/api/restaurantService';
import { useAuthStore } from '../store/authStore';
import { colors } from '../theme/colors';
import type { RestaurantStackParamList } from '../navigation/types';

// ── Types ──────────────────────────────────────────────────────────────────

interface RestaurantFormState {
  name: string;
  locations: string[];
  tags: string[];
  priceMin: string;
  priceMax: string;
  phone: string;
  hour: string;
  description: string;
  theme: string;
}

const INITIAL_FORM: RestaurantFormState = {
  name: '',
  locations: [],
  tags: [],
  priceMin: '',
  priceMax: '',
  phone: '',
  hour: '',
  description: '',
  theme: '',
};

// ── Helpers ─────────────────────────────────────────────────────────────────

function validateRestaurantForm(
  form: RestaurantFormState,
  mode: 'create' | 'edit',
  backendUserId: string | null,
): string | null {
  if (!form.name.trim()) return 'El nombre del restaurante es obligatorio.';
  if (mode === 'create' && form.locations.length === 0) return 'Agrega al menos una dirección.';
  if (mode === 'create' && !backendUserId) {
    return 'No se encontró tu cuenta. Cierra sesión e ingresa nuevamente.';
  }

  const minStr = form.priceMin.trim();
  const maxStr = form.priceMax.trim();
  if (minStr !== '' || maxStr !== '') {
    const min = Number(minStr);
    const max = Number(maxStr);
    if (minStr !== '' && (Number.isNaN(min) || min < 0)) return 'El precio mínimo debe ser un número positivo.';
    if (maxStr !== '' && (Number.isNaN(max) || max < 0)) return 'El precio máximo debe ser un número positivo.';
    if (minStr !== '' && maxStr !== '' && min > max) {
      return 'El precio mínimo no puede ser mayor al máximo.';
    }
  }
  return null;
}

function buildRestaurantFormData(
  form: RestaurantFormState,
  mode: 'create' | 'edit',
  backendUserId: string | null,
): FormData {
  const fd = new FormData();
  if (mode === 'create') fd.append('ownerId', backendUserId!);
  fd.append('name', form.name.trim());
  if (form.phone.trim() !== '') fd.append('phone', form.phone.trim());
  if (form.description.trim() !== '') fd.append('description', form.description.trim());
  if (form.theme.trim() !== '') fd.append('theme', form.theme.trim());
  if (form.hour.trim() !== '') fd.append('hour', form.hour.trim());

  // Each entry is a separate append so Spring receives List<String>.
  form.locations
    .filter((l) => l.trim() !== '')
    .forEach((l) => fd.append('locations', l.trim()));
  form.tags
    .filter((t) => t.trim() !== '')
    .forEach((t) => fd.append('tags', t.trim()));

  const minStr = form.priceMin.trim();
  const maxStr = form.priceMax.trim();
  if (minStr !== '') {
    const val = Number(minStr);
    if (!Number.isNaN(val) && val >= 0) fd.append('priceMin', String(val));
  }
  if (maxStr !== '') {
    const val = Number(maxStr);
    if (!Number.isNaN(val) && val >= 0) fd.append('priceMax', String(val));
  }
  return fd;
}

// ── Component ──────────────────────────────────────────────────────────────

export default function RestaurantFormScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RestaurantStackParamList>>();
  const route = useRoute<RouteProp<RestaurantStackParamList, 'RestaurantForm'>>();
  const { mode, restaurantId } = route.params;
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const backendUserId = useAuthStore((s) => s.backendUserId);

  const [form, setForm] = useState<RestaurantFormState>(INITIAL_FORM);
  const [tagInput, setTagInput] = useState('');
  const [locationInput, setLocationInput] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isEdit = mode === 'edit';
  const targetId = isEdit ? (restaurantId ?? '') : '';

  // Only runs the query in edit mode when restaurantId is present.
  const { data: existing, isLoading: loadingExisting } = useRestaurantById(targetId);

  // Prefill form once the restaurant data arrives in edit mode.
  useEffect(() => {
    if (isEdit && existing) {
      setForm({
        name: existing.name ?? '',
        locations: existing.locations ?? [],
        tags: existing.tags ?? [],
        priceMin: existing.priceMin != null ? String(existing.priceMin) : '',
        priceMax: existing.priceMax != null ? String(existing.priceMax) : '',
        phone: existing.phone ?? '',
        hour: existing.hour ?? '',
        description: existing.description ?? '',
        theme: existing.theme ?? '',
      });
    }
  }, [isEdit, existing]);

  const set = <K extends keyof RestaurantFormState>(field: K, value: RestaurantFormState[K]) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  // ── Tags ────────────────────────────────────────────────────────────────

  const addTag = () => {
    const tag = tagInput.trim().replace(/,$/, '');
    if (tag && !form.tags.includes(tag)) {
      set('tags', [...form.tags, tag]);
    }
    setTagInput('');
  };

  const removeTag = (tag: string) =>
    set('tags', form.tags.filter((t) => t !== tag));

  const handleTagChange = (text: string) => {
    if (text.endsWith(',')) {
      setTagInput(text.slice(0, -1));
      addTag();
    } else {
      setTagInput(text);
    }
  };

  // ── Locations ───────────────────────────────────────────────────────────

  const addLocation = () => {
    const loc = locationInput.trim();
    if (loc && !form.locations.includes(loc)) {
      set('locations', [...form.locations, loc]);
    }
    setLocationInput('');
  };

  const removeLocation = (loc: string) =>
    set('locations', form.locations.filter((l) => l !== loc));

  // ── Submit ──────────────────────────────────────────────────────────────

  const handleSubmit = async () => {
    const validationError = validateRestaurantForm(form, mode, backendUserId);
    if (validationError) {
      Alert.alert('Campo inválido', validationError);
      return;
    }

    const fd = buildRestaurantFormData(form, mode, backendUserId);
    const successTitle = isEdit ? 'Cambios guardados' : 'Restaurante registrado';
    const successMsg = isEdit
      ? 'La información fue actualizada correctamente.'
      : 'Tu restaurante fue enviado para revisión.';
    const errorMsg = isEdit
      ? 'No se pudieron guardar los cambios. Intenta de nuevo.'
      : 'No se pudo registrar el restaurante. Intenta de nuevo.';

    setSubmitting(true);
    try {
      if (mode === 'create') {
        await createRestaurant(fd);
      } else {
        await updateRestaurant(targetId, fd);
      }
      void queryClient.invalidateQueries({ queryKey: ['restaurants'] });
      if (targetId) {
        void queryClient.invalidateQueries({ queryKey: ['restaurant', targetId] });
      }
      Alert.alert(successTitle, successMsg, [{ text: 'OK', onPress: () => navigation.goBack() }]);
    } catch {
      Alert.alert('Error', errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Loading (edit mode only) ─────────────────────────────────────────────

  if (isEdit && loadingExisting) {
    return (
      <View style={[styles.wrapper, styles.centered]}>
        <ActivityIndicator size="large" color={colors.gold} />
        <Text style={styles.loadingText}>Cargando datos del restaurante...</Text>
      </View>
    );
  }

  // ── Render ──────────────────────────────────────────────────────────────

  return (
    <View style={styles.wrapper}>
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitulo}>
            {isEdit ? 'Editar mi local' : 'Registrar Restaurante'}
          </Text>
          <Text style={styles.headerSub}>
            {isEdit
              ? 'Actualiza la información de tu restaurante'
              : 'Aparece en TasteMap y atrae nuevos clientes'}
          </Text>
        </View>

        {!isEdit && (
          <View style={styles.banner}>
            <Text style={styles.bannerTexto}>
              ⏳ Estado inicial "En revisión" hasta aprobación del equipo TasteMap
            </Text>
          </View>
        )}

        {/* Nombre */}
        <View style={styles.campo}>
          <Text style={styles.label}>NOMBRE DEL RESTAURANTE *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: La Trattoria Italiana"
            placeholderTextColor="#4a6070"
            value={form.name}
            onChangeText={(v) => set('name', v)}
          />
        </View>

        {/* Direcciones */}
        <View style={styles.campo}>
          <Text style={styles.label}>DIRECCIONES{mode === 'create' ? ' *' : ''}</Text>
          <Text style={styles.labelHint}>Agrega una o más sedes</Text>
          {form.locations.length > 0 && (
            <View style={styles.tagsWrap}>
              {form.locations.map((loc) => (
                <View key={loc} style={styles.tag}>
                  <Text style={styles.tagTexto}>{loc}</Text>
                  <TouchableOpacity
                    onPress={() => removeLocation(loc)}
                    hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                  >
                    <Text style={styles.tagX}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
          <View style={styles.tagInputRow}>
            <TextInput
              style={styles.tagInput}
              placeholder="Ej: Cra 13 #67–42, Chapinero, Bogotá"
              placeholderTextColor="#4a6070"
              value={locationInput}
              onChangeText={setLocationInput}
              onSubmitEditing={addLocation}
              returnKeyType="done"
            />
            <TouchableOpacity style={styles.tagAddBtn} onPress={addLocation}>
              <Text style={styles.tagAddBtnTexto}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tipo de cocina */}
        <View style={styles.campo}>
          <Text style={styles.label}>TIPO DE COCINA</Text>
          <Text style={styles.labelHint}>Escribe y presiona "+" o separa con coma</Text>
          {form.tags.length > 0 && (
            <View style={styles.tagsWrap}>
              {form.tags.map((tag) => (
                <View key={tag} style={styles.tag}>
                  <Text style={styles.tagTexto}>{tag}</Text>
                  <TouchableOpacity
                    onPress={() => removeTag(tag)}
                    hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                  >
                    <Text style={styles.tagX}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
          <View style={styles.tagInputRow}>
            <TextInput
              style={styles.tagInput}
              placeholder="Ej: Italiana, Japonesa…"
              placeholderTextColor="#4a6070"
              value={tagInput}
              onChangeText={handleTagChange}
              onSubmitEditing={addTag}
              returnKeyType="done"
            />
            <TouchableOpacity style={styles.tagAddBtn} onPress={addTag}>
              <Text style={styles.tagAddBtnTexto}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Temática */}
        <View style={styles.campo}>
          <Text style={styles.label}>TEMÁTICA / AMBIENTE</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Romántico, Familiar, Casual…"
            placeholderTextColor="#4a6070"
            value={form.theme}
            onChangeText={(v) => set('theme', v)}
          />
        </View>

        {/* Rango de precios — inputs numéricos directos */}
        <View style={styles.campo}>
          <Text style={styles.label}>RANGO DE PRECIOS</Text>
          <Text style={styles.labelHint}>Valores en pesos colombianos (COP)</Text>
          <View style={styles.precioRow}>
            <View style={styles.precioField}>
              <Text style={styles.precioLabel}>PRECIO MÍNIMO</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej: 25000"
                placeholderTextColor="#4a6070"
                keyboardType="numeric"
                value={form.priceMin}
                onChangeText={(v) => set('priceMin', v.replace(/\D/g, ''))}
              />
            </View>
            <View style={styles.precioField}>
              <Text style={styles.precioLabel}>PRECIO MÁXIMO</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej: 70000"
                placeholderTextColor="#4a6070"
                keyboardType="numeric"
                value={form.priceMax}
                onChangeText={(v) => set('priceMax', v.replace(/\D/g, ''))}
              />
            </View>
          </View>
        </View>

        {/* Teléfono */}
        <View style={styles.campo}>
          <Text style={styles.label}>TELÉFONO</Text>
          <TextInput
            style={styles.input}
            placeholder="+57 310 555 0000"
            placeholderTextColor="#4a6070"
            keyboardType="phone-pad"
            value={form.phone}
            onChangeText={(v) => set('phone', v)}
          />
        </View>

        {/* Horario */}
        <View style={styles.campo}>
          <Text style={styles.label}>HORARIO DE ATENCIÓN</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: 11:00-21:00"
            placeholderTextColor="#4a6070"
            value={form.hour}
            onChangeText={(v) => set('hour', v)}
          />
        </View>

        {/* Descripción */}
        <View style={styles.campo}>
          <Text style={styles.label}>DESCRIPCIÓN</Text>
          <TextInput
            style={[styles.input, styles.textarea]}
            placeholder="Describe tu restaurante, especialidades y ambiente..."
            placeholderTextColor="#4a6070"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            value={form.description}
            onChangeText={(v) => set('description', v)}
          />
        </View>

        {/* Logo placeholder */}
        <View style={styles.campo}>
          <Text style={styles.label}>LOGO (PRÓXIMAMENTE)</Text>
          <View style={styles.fotoUpload}>
            <Text style={styles.fotoEmoji}>📷</Text>
            <Text style={styles.fotoTexto}>Subida de imágenes próximamente</Text>
            <Text style={styles.fotoHint}>JPG, PNG · Máx 10 MB</Text>
          </View>
        </View>
      </ScrollView>

      {/* CTA fijo en la parte inferior */}
      <View style={[styles.ctaContainer, { paddingBottom: insets.bottom + 20 }]}>
        <TouchableOpacity
          style={[styles.ctaBtn, submitting && styles.ctaBtnDisabled]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.ctaBtnTexto}>
              {isEdit ? 'Guardar cambios →' : 'Enviar para revisión →'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: '#0C1D32' },
  centered: { justifyContent: 'center', alignItems: 'center' },
  scroll: { flex: 1, paddingHorizontal: 20 },
  loadingText: {
    color: 'rgba(240,234,220,0.5)',
    marginTop: 12,
    fontSize: 14,
    fontFamily: 'sans-serif-medium',
  },

  // Header
  header: { paddingBottom: 16 },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
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

  // Banner (create only)
  banner: {
    backgroundColor: '#1a3028',
    borderRadius: 12,
    padding: 14,
    marginBottom: 24,
    borderLeftWidth: 3,
    borderLeftColor: '#4dd9c0',
  },
  bannerTexto: {
    color: '#c9e8c0',
    fontSize: 13,
    fontFamily: 'sans-serif-medium',
    lineHeight: 18,
  },

  // Campo genérico
  campo: { marginBottom: 22 },
  label: {
    color: 'rgba(240,234,220,0.6)',
    fontSize: 11,
    letterSpacing: 1,
    fontFamily: 'sans-serif-medium',
    marginBottom: 8,
  },
  labelHint: {
    color: 'rgba(240,234,220,0.35)',
    fontSize: 11,
    fontFamily: 'sans-serif-medium',
    marginBottom: 8,
    marginTop: -4,
  },

  // Input base
  input: {
    backgroundColor: '#1B2C3E',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: '#FFFFFF',
    fontSize: 15,
    fontFamily: 'sans-serif-medium',
    borderWidth: 1,
    borderColor: 'rgba(127,132,136,0.3)',
  },
  textarea: { height: 100, paddingTop: 14 },

  // Price range row
  precioRow: { flexDirection: 'row', gap: 12 },
  precioField: { flex: 1 },
  precioLabel: {
    color: 'rgba(240,234,220,0.45)',
    fontSize: 10,
    letterSpacing: 0.8,
    fontFamily: 'sans-serif-medium',
    marginBottom: 6,
  },

  // Tag / location chip list
  tagsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#243d2b',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#4dd9c0',
    gap: 6,
  },
  tagTexto: {
    color: '#FFFFFF',
    fontSize: 13,
    fontFamily: 'sans-serif-medium',
  },
  tagX: { color: '#4dd9c0', fontSize: 11, fontWeight: 'bold' },
  tagInputRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  tagInput: {
    flex: 1,
    backgroundColor: '#1B2C3E',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: '#FFFFFF',
    fontSize: 15,
    fontFamily: 'sans-serif-medium',
    borderWidth: 1,
    borderColor: 'rgba(127,132,136,0.3)',
  },
  tagAddBtn: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#c9a96e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagAddBtnTexto: {
    color: '#0C1D32',
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 28,
  },

  // Logo placeholder
  fotoUpload: {
    backgroundColor: '#1B2C3E',
    borderRadius: 12,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: 'rgba(127,132,136,0.4)',
    paddingVertical: 36,
    alignItems: 'center',
    gap: 6,
  },
  fotoEmoji: { fontSize: 36 },
  fotoTexto: {
    color: 'rgba(240,234,220,0.75)',
    fontSize: 14,
    fontFamily: 'sans-serif-medium',
    fontWeight: '600',
  },
  fotoHint: {
    color: 'rgba(240,234,220,0.35)',
    fontSize: 11,
    fontFamily: 'sans-serif-medium',
  },

  // CTA
  ctaContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: '#0C1D32',
    borderTopWidth: 1,
    borderTopColor: 'rgba(127,132,136,0.15)',
  },
  ctaBtn: {
    backgroundColor: '#2d6a4f',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  ctaBtnDisabled: { opacity: 0.5 },
  ctaBtnTexto: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    fontFamily: 'sans-serif-medium',
    letterSpacing: 0.3,
  },
});
