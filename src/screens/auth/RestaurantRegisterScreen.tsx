import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AuthInput from '../../components/AuthInput';
import { useSignUp } from '../../hooks/useSignUp';
import { useAuthStore } from '../../store/authStore';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { typography } from '../../theme/typography';
import { authStyles } from '../../styles/authStyles';
import type { AuthStackParamList } from '../../navigation/types';

type Nav = NativeStackNavigationProp<AuthStackParamList>;

export default function RestaurantRegisterScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const { loading, error, registerOwner } = useSignUp();
  const setBackendUserId = useAuthStore((s) => s.setBackendUserId);
  const setActiveRestaurantId = useAuthStore((s) => s.setActiveRestaurantId);

  // Owner data
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Restaurant data
  const [restaurantName, setRestaurantName] = useState('');
  const [phone, setPhone] = useState('');
  const [description, setDescription] = useState('');
  const [theme, setTheme] = useState('');
  const [location, setLocation] = useState('');

  const validate = (): boolean => {
    if (!fullName.trim()) { Alert.alert('Error', 'Ingresa tu nombre'); return false; }
    if (!email.trim() || !email.includes('@')) { Alert.alert('Error', 'Ingresa un correo válido'); return false; }
    if (password.length < 6) { Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres'); return false; }
    if (password !== confirmPassword) { Alert.alert('Error', 'Las contraseñas no coinciden'); return false; }
    if (!restaurantName.trim()) { Alert.alert('Error', 'Ingresa el nombre del restaurante'); return false; }
    return true;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    const result = await registerOwner({
      email,
      password,
      fullName,
      restaurantName,
      phone,
      theme,
      location,
      description,
    });
    if (!result.success) {
      Alert.alert('Error al registrarse', error ?? 'Intenta de nuevo');
      return;
    }
    if (result.backendUserId) {
      setBackendUserId(result.backendUserId);
    }
    if (result.restaurantId) {
      setActiveRestaurantId(result.restaurantId);
    } else if (result.restaurantId === null) {
      // Account + OWNER user created, but restaurant could not be created yet
      // (most likely because email verification is pending and there is no active session).
      Alert.alert(
        'Cuenta creada',
        'Tu cuenta fue creada correctamente. El restaurante no pudo registrarse automáticamente porque tu sesión aún no está activa. Verifica tu correo y luego créalo desde "Mi local".',
      );
    }
    if (result.needsVerification) {
      navigation.navigate('VerifyEmailCode', { email, role: 'OWNER' });
    }
    // If !needsVerification, Supabase auto-signed in → AppNavigator handles navigation via onAuthStateChange
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={authStyles.container}
    >
      <ScrollView contentContainerStyle={authStyles.scrollContent}>
        {/* Header */}
        <View
          style={[
            authStyles.header,
            { backgroundColor: colors.restaurantHeaderGreen, paddingTop: insets.top + 16 },
          ]}
        >
          <Text style={authStyles.tasteMapTitle}>TasteMap</Text>
          <View style={authStyles.badgeContainer}>
            <Text style={authStyles.badge}>PORTAL RESTAURANTES</Text>
          </View>
          <View style={authStyles.headerDivider} />
          <Text style={authStyles.headerSubtitle}>Gestiona tu restaurante con TasteMap</Text>
        </View>

        {/* Form */}
        <View style={authStyles.formContainer}>
          <Text style={authStyles.mainTitle}>Registrar restaurante 🏪</Text>
          <Text style={authStyles.mainSubtitle}>Crea tu cuenta de propietario</Text>

          {/* Section: Owner */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>DATOS DEL PROPIETARIO</Text>
          </View>

          <AuthInput
            label="NOMBRE COMPLETO"
            placeholder="Tu nombre"
            value={fullName}
            onChangeText={setFullName}
            autoCapitalize="words"
          />
          <AuthInput
            label="CORREO DEL NEGOCIO"
            placeholder="restaurante@correo.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <AuthInput
            label="CONTRASEÑA"
            placeholder="Mínimo 6 caracteres"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <AuthInput
            label="CONFIRMAR CONTRASEÑA"
            placeholder="Repite tu contraseña"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />

          {/* Section: Restaurant */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>DATOS DEL RESTAURANTE</Text>
          </View>

          <AuthInput
            label="NOMBRE DEL RESTAURANTE *"
            placeholder="Ej: La Trattoria"
            value={restaurantName}
            onChangeText={setRestaurantName}
            autoCapitalize="words"
          />
          <AuthInput
            label="TELÉFONO"
            placeholder="Ej: +57 300 000 0000"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
          <AuthInput
            label="TIPO DE COCINA / TEMÁTICA"
            placeholder="Ej: Italiana, Colombiana..."
            value={theme}
            onChangeText={setTheme}
            autoCapitalize="sentences"
          />
          <AuthInput
            label="UBICACIÓN PRINCIPAL"
            placeholder="Ej: Bogotá, Chapinero"
            value={location}
            onChangeText={setLocation}
            autoCapitalize="sentences"
          />
          <AuthInput
            label="DESCRIPCIÓN BREVE"
            placeholder="Describe tu restaurante..."
            value={description}
            onChangeText={setDescription}
            autoCapitalize="sentences"
          />

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleRegister}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>
              {loading ? 'Registrando...' : 'Registrar restaurante →'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={authStyles.footerContainer}>
          <Text style={authStyles.footerText}>
            ¿Ya tienes cuenta?{' '}
            <Text
              style={[authStyles.footerActionText, { color: colors.green }]}
              onPress={() => navigation.navigate('RestaurantLogin')}
            >
              Inicia sesión →
            </Text>
          </Text>
          <Text style={authStyles.footerText}>
            ¿Eres cliente?{' '}
            <Text
              style={[authStyles.footerActionText, { color: colors.teal }]}
              onPress={() => navigation.navigate('UserRegister')}
            >
              Crea una cuenta de usuario →
            </Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: spacing.xs,
  },
  sectionTitle: {
    fontSize: typography.size.xs,
    color: colors.gold,
    letterSpacing: 1.5,
    fontWeight: typography.weight.semibold,
    fontFamily: typography.fontFamily.body,
  },
  primaryButton: {
    backgroundColor: colors.green,
    borderRadius: radius.md,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.md,
    elevation: 6,
    shadowColor: colors.green,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  primaryButtonText: {
    color: colors.background,
    fontSize: typography.size.base,
    fontWeight: typography.weight.semibold,
    fontFamily: typography.fontFamily.body,
    letterSpacing: 0.5,
  },
});
