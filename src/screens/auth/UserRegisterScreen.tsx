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

export default function UserRegisterScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const { loading, error, registerUser } = useSignUp();
  const setBackendUserId = useAuthStore((s) => s.setBackendUserId);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const validate = (): boolean => {
    if (!fullName.trim()) {
      Alert.alert('Error', 'Ingresa tu nombre completo');
      return false;
    }
    if (!email.trim() || !email.includes('@')) {
      Alert.alert('Error', 'Ingresa un correo válido');
      return false;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return false;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    const result = await registerUser({ email, password, fullName });
    if (!result.success) {
      Alert.alert('Error al registrarse', error ?? 'Intenta de nuevo');
      return;
    }
    if (result.backendUserId) {
      setBackendUserId(result.backendUserId);
    }
    if (result.needsVerification) {
      navigation.navigate('VerifyEmailCode', { email, role: 'USER' });
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
            { backgroundColor: colors.headerNavy, paddingTop: insets.top + 16 },
          ]}
        >
          <Text style={authStyles.tasteMapTitle}>TasteMap</Text>
          <View style={authStyles.headerDivider} />
          <Text style={authStyles.headerSubtitle}>Descubre tu lugar perfecto</Text>
        </View>

        {/* Form */}
        <View style={authStyles.formContainer}>
          <Text style={authStyles.mainTitle}>Crear cuenta 👤</Text>
          <Text style={authStyles.mainSubtitle}>Regístrate para comenzar</Text>

          <AuthInput
            label="NOMBRE COMPLETO"
            placeholder="Tu nombre completo"
            value={fullName}
            onChangeText={setFullName}
            autoCapitalize="words"
          />
          <AuthInput
            label="CORREO ELECTRÓNICO"
            placeholder="tu@correo.com"
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

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleRegister}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>
              {loading ? 'Creando cuenta...' : 'Crear cuenta →'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={authStyles.footerContainer}>
          <Text style={authStyles.footerText}>
            ¿Ya tienes cuenta?{' '}
            <Text
              style={[authStyles.footerActionText, { color: colors.gold }]}
              onPress={() => navigation.navigate('UserLogin')}
            >
              Inicia sesión →
            </Text>
          </Text>
          <Text style={authStyles.footerText}>
            ¿Tienes un restaurante?{' '}
            <Text
              style={[authStyles.footerActionText, { color: colors.teal }]}
              onPress={() => navigation.navigate('RestaurantRegister')}
            >
              Regístralo aquí →
            </Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  primaryButton: {
    backgroundColor: colors.gold,
    borderRadius: radius.md,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.md,
    elevation: 6,
    shadowColor: colors.gold,
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
