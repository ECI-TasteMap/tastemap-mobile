import { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';

// ── Tipos ──────────────────────────────────────────────────────────────────
type RangoPrecio = '$' | '$$' | '$$$' | '$$$$';

interface FormData {
  nombre: string;
  direccion: string;
  tipoCocina: string[];       // lista de strings → se manda tal cual al backend
  rangoPrecio: RangoPrecio | '';
  telefono: string;
  horario: string;
  descripcion: string;
  // fotos: File[] → se agrega cuando conectes al backend / ImagePicker
}

const RANGOS: RangoPrecio[] = ['$', '$$', '$$$', '$$$$'];
// ───────────────────────────────────────────────────────────────────────────

export default function RegistrarRestaurante() {
  const [form, setForm] = useState<FormData>({
    nombre: '',
    direccion: '',
    tipoCocina: [],
    rangoPrecio: '',
    telefono: '',
    horario: '',
    descripcion: '',
  });

  // Input temporal para el tag de cocina
  const [cocinaInput, setCocinaInput] = useState('');

  const set = (campo: keyof FormData, valor: any) =>
    setForm((prev) => ({ ...prev, [campo]: valor }));

  // Agrega un tag al presionar coma, Enter o el botón "+"
  const agregarTag = () => {
    const tag = cocinaInput.trim().replace(/,$/, '');
    if (!tag) return;
    if (!form.tipoCocina.includes(tag)) {
      set('tipoCocina', [...form.tipoCocina, tag]);
    }
    setCocinaInput('');
  };

  const eliminarTag = (tag: string) =>
    set(
      'tipoCocina',
      form.tipoCocina.filter((t) => t !== tag)
    );

  const handleCocinaChange = (text: string) => {
    // Si escribe una coma, auto-agrega
    if (text.endsWith(',')) {
      setCocinaInput(text.slice(0, -1));
      agregarTag();
    } else {
      setCocinaInput(text);
    }
  };

  const enviar = () => {
    // Validación básica
    if (!form.nombre || !form.direccion || form.tipoCocina.length === 0 || !form.rangoPrecio) {
      Alert.alert('Faltan campos', 'Completa todos los campos obligatorios.');
      return;
    }
    // payload listo para el backend
    const payload = { ...form };
    console.log('Payload →', JSON.stringify(payload, null, 2));
    Alert.alert('Enviado', 'Tu restaurante fue enviado para revisión.');
  };

  return (
    <View style={styles.wrapper}>
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitulo}>Registrar Restaurante</Text>
          <Text style={styles.headerSub}>
            Aparece en TasteMap y atrae nuevos clientes
          </Text>
        </View>

        {/* Banner info */}
        <View style={styles.banner}>
          <Text style={styles.bannerTexto}>
            ⏳ Estado inicial "En revisión" hasta aprobación del equipo TasteMap
          </Text>
        </View>

        {/* ── Nombre ── */}
        <View style={styles.campo}>
          <Text style={styles.label}>NOMBRE DEL RESTAURANTE *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: La Trattoria Italiana"
            placeholderTextColor="#4a6070"
            value={form.nombre}
            onChangeText={(v) => set('nombre', v)}
          />
        </View>

        {/* ── Dirección ── */}
        <View style={styles.campo}>
          <Text style={styles.label}>DIRECCIÓN COMPLETA *</Text>
          <TextInput
            style={styles.input}
            placeholder="Cra 13 #67–42, Chapinero, Bogotá"
            placeholderTextColor="#4a6070"
            value={form.direccion}
            onChangeText={(v) => set('direccion', v)}
          />
        </View>

        {/* ── Tipo de cocina (tag input) ── */}
        <View style={styles.campo}>
          <Text style={styles.label}>TIPO DE COCINA *</Text>
          <Text style={styles.labelHint}>
            Escribe y presiona "+" o separa con coma
          </Text>

          {/* Tags existentes */}
          {form.tipoCocina.length > 0 && (
            <View style={styles.tagsWrap}>
              {form.tipoCocina.map((tag) => (
                <View key={tag} style={styles.tag}>
                  <Text style={styles.tagTexto}>{tag}</Text>
                  <TouchableOpacity
                    onPress={() => eliminarTag(tag)}
                    hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                  >
                    <Text style={styles.tagX}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          {/* Input + botón */}
          <View style={styles.tagInputRow}>
            <TextInput
              style={styles.tagInput}
              placeholder="Ej: Italiana, Japonesa…"
              placeholderTextColor="#4a6070"
              value={cocinaInput}
              onChangeText={handleCocinaChange}
              onSubmitEditing={agregarTag}
              returnKeyType="done"
            />
            <TouchableOpacity style={styles.tagAddBtn} onPress={agregarTag}>
              <Text style={styles.tagAddBtnTexto}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Rango de precio ── */}
        <View style={styles.campo}>
          <Text style={styles.label}>RANGO DE PRECIO *</Text>
          <View style={styles.rangosRow}>
            {RANGOS.map((r) => (
              <TouchableOpacity
                key={r}
                style={[
                  styles.rangoBtn,
                  form.rangoPrecio === r && styles.rangoBtnActivo,
                ]}
                onPress={() => set('rangoPrecio', r)}
              >
                <Text
                  style={[
                    styles.rangoBtnTexto,
                    form.rangoPrecio === r && styles.rangoBtnTextoActivo,
                  ]}
                >
                  {r}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── Teléfono ── */}
        <View style={styles.campo}>
          <Text style={styles.label}>TELÉFONO *</Text>
          <TextInput
            style={styles.input}
            placeholder="+57 310 555 0000"
            placeholderTextColor="#4a6070"
            keyboardType="phone-pad"
            value={form.telefono}
            onChangeText={(v) => set('telefono', v)}
          />
        </View>

        {/* ── Horario ── */}
        <View style={styles.campo}>
          <Text style={styles.label}>HORARIO DE ATENCIÓN *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Mar–Dom 12:00–22:00"
            placeholderTextColor="#4a6070"
            value={form.horario}
            onChangeText={(v) => set('horario', v)}
          />
        </View>

        {/* ── Descripción ── */}
        <View style={styles.campo}>
          <Text style={styles.label}>DESCRIPCIÓN *</Text>
          <TextInput
            style={[styles.input, styles.textarea]}
            placeholder="Describe tu restaurante, especialidades y ambiente..."
            placeholderTextColor="#4a6070"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            value={form.descripcion}
            onChangeText={(v) => set('descripcion', v)}
          />
        </View>

        {/* ── Fotos ── */}
        <View style={styles.campo}>
          <Text style={styles.label}>FOTOS (MÍNIMO 3) *</Text>
          <TouchableOpacity style={styles.fotoUpload} onPress={() => {}}>
            <Text style={styles.fotoEmoji}>📷</Text>
            <Text style={styles.fotoTexto}>Toca para subir fotos</Text>
            <Text style={styles.fotoHint}>JPG, PNG · Máx 10MB c/u</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* CTA fijo en la parte inferior */}
      <View style={styles.ctaContainer}>
        <TouchableOpacity style={styles.ctaBtn} onPress={enviar}>
          <Text style={styles.ctaBtnTexto}>Enviar para revisión →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: '#0C1D32' },
  scroll: { flex: 1, paddingHorizontal: 20 },

  // Header
  header: {
    paddingTop: 28,
    paddingBottom: 16,
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

  // Banner
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
  textarea: {
    height: 100,
    paddingTop: 14,
  },

  // Tag input
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
  tagX: {
    color: '#4dd9c0',
    fontSize: 11,
    fontWeight: 'bold',
  },
  tagInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
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

  // Rango de precio
  rangosRow: {
    flexDirection: 'row',
    gap: 10,
  },
  rangoBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#1B2C3E',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(127,132,136,0.3)',
  },
  rangoBtnActivo: {
    backgroundColor: '#c9a96e',
    borderColor: '#c9a96e',
  },
  rangoBtnTexto: {
    color: 'rgba(240,234,220,0.55)',
    fontSize: 15,
    fontWeight: '700',
    fontFamily: 'sans-serif-medium',
  },
  rangoBtnTextoActivo: {
    color: '#0C1D32',
  },

  // Fotos
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
  ctaBtnTexto: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    fontFamily: 'sans-serif-medium',
    letterSpacing: 0.3,
  },
});