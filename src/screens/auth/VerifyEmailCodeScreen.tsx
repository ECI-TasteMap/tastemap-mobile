import React, { useState, useEffect } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';
import { resendVerificationCode } from '../../services/auth/authService';
import { useAuthStore } from '../../store/authStore';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { typography } from '../../theme/typography';
import type { AuthStackParamList } from '../../navigation/types';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'VerifyEmailCode'>;
type RouteParams = RouteProp<AuthStackParamList, 'VerifyEmailCode'>;

const RESEND_COOLDOWN_S = 60;

export default function VerifyEmailCodeScreen() {
  const navigation = useNavigation<Nav>();
  const { params } = useRoute<RouteParams>();
  const { email, role } = params;
  const { setRole: setStoreRole, setEmail: setStoreEmail } = useAuthStore();
  const insets = useSafeAreaInsets();

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleVerify = async () => {
    if (!otp.trim()) {
      Alert.alert('Error', 'Ingresa el código recibido');
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otp.trim(),
        type: 'email',
      });
      if (error) {
        Alert.alert('Código incorrecto', error.message);
        return;
      }
      // Set role explicitly for immediate navigation.
      // AppNavigator's onAuthStateChange will also run and confirm via backend or metadata fallback.
      const metadataRole = data.user?.user_metadata?.role as string | undefined;
      const isOwner = metadataRole === 'OWNER' || role === 'OWNER';
      setStoreEmail(email);
      setStoreRole(isOwner ? 'restaurant' : 'user');
    } catch {
      Alert.alert('Error', 'No se pudo verificar el código. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0 || resending) return;
    setResending(true);
    try {
      const { error } = await resendVerificationCode(email);
      if (error) {
        Alert.alert('Error', error.message);
      } else {
        setCooldown(RESEND_COOLDOWN_S);
        Alert.alert('Código reenviado', `Revisa tu correo: ${email}`);
      }
    } catch {
      Alert.alert('Error', 'No se pudo reenviar el código.');
    } finally {
      setResending(false);
    }
  };

  const accentColor = role === 'OWNER' ? colors.green : colors.gold;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      {/* Safe area top */}
      <View style={{ height: insets.top, backgroundColor: colors.background }} />

      {/* Back button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="chevron-back" size={22} color={colors.textSecondary} />
        <Text style={styles.backText}>Volver</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        {/* Icon circle */}
        <View style={[styles.iconCircle, { borderColor: accentColor }]}>
          <Ionicons name="mail-outline" size={44} color={accentColor} />
        </View>

        {/* Heading */}
        <Text style={styles.title}>Verifica tu correo</Text>
        <Text style={styles.subtitle}>Ingresa el código que enviamos a</Text>
        <Text style={[styles.emailHighlight, { color: accentColor }]}>{email}</Text>

        {/* OTP input */}
        <View style={[styles.otpWrapper, { borderColor: accentColor }]}>
          <TextInput
            style={styles.otpInput}
            placeholder="● ● ● ● ● ●"
            placeholderTextColor={colors.textMuted}
            value={otp}
            onChangeText={setOtp}
            keyboardType="number-pad"
            maxLength={8}
            textAlign="center"
            autoFocus
            selectionColor={accentColor}
          />
        </View>

        {/* Verify button */}
        <TouchableOpacity
          style={[styles.verifyButton, { backgroundColor: accentColor }, loading && styles.disabledOp]}
          onPress={handleVerify}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator color={colors.background} />
          ) : (
            <Text style={styles.verifyButtonText}>Verificar código →</Text>
          )}
        </TouchableOpacity>

        {/* Resend */}
        <View style={styles.resendRow}>
          <Text style={styles.resendLabel}>¿No recibiste el código?  </Text>
          <TouchableOpacity onPress={handleResend} disabled={cooldown > 0 || resending}>
            <Text style={[styles.resendAction, (cooldown > 0 || resending) && styles.resendMuted]}>
              {resending ? 'Enviando...' : cooldown > 0 ? `Reenviar en ${cooldown}s` : 'Reenviar'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Note about email link */}
        <Text style={styles.noteText}>
          Si usaste un link de confirmación, revisa tu bandeja de entrada y confirma directamente desde el correo.
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.screen,
    paddingVertical: spacing.md,
    gap: spacing.xs,
  },
  backText: {
    color: colors.textSecondary,
    fontSize: typography.size.sm,
    fontFamily: typography.fontFamily.body,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.screen,
    alignItems: 'center',
    paddingTop: spacing.xxl,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: radius.round,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.cardAlt,
    marginBottom: spacing.xxl,
  },
  title: {
    fontSize: typography.size.xxl,
    fontWeight: typography.weight.bold,
    fontFamily: typography.fontFamily.serif,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.size.md,
    color: colors.textSecondary,
    fontFamily: typography.fontFamily.body,
    textAlign: 'center',
  },
  emailHighlight: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
    fontFamily: typography.fontFamily.body,
    marginBottom: spacing.xxl,
    textAlign: 'center',
  },
  otpWrapper: {
    width: '100%',
    borderWidth: 2,
    borderRadius: radius.md,
    backgroundColor: colors.cardAlt,
    marginBottom: spacing.xl,
    overflow: 'hidden',
  },
  otpInput: {
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.md,
    fontSize: 30,
    color: colors.textPrimary,
    letterSpacing: 14,
    fontWeight: typography.weight.bold,
  },
  verifyButton: {
    width: '100%',
    paddingVertical: spacing.lg,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  disabledOp: {
    opacity: 0.7,
  },
  verifyButtonText: {
    color: colors.background,
    fontSize: typography.size.base,
    fontWeight: typography.weight.semibold,
    fontFamily: typography.fontFamily.body,
    letterSpacing: 0.5,
  },
  resendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: spacing.xxl,
  },
  resendLabel: {
    color: colors.textMuted,
    fontSize: typography.size.sm,
    fontFamily: typography.fontFamily.body,
  },
  resendAction: {
    color: colors.teal,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    fontFamily: typography.fontFamily.body,
  },
  resendMuted: {
    color: colors.textMuted,
  },
  noteText: {
    fontSize: typography.size.xs,
    color: colors.textMuted,
    textAlign: 'center',
    fontFamily: typography.fontFamily.body,
    lineHeight: 18,
    paddingHorizontal: spacing.md,
  },
});
