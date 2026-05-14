import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCreateReservation } from '../../hooks/useCreateReservation';
import { useAuthStore } from '../../store/authStore';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { typography } from '../../theme/typography';
import type { UserStackParamList } from '../../navigation/types';
import type { BackendReservationCreate } from '../../types/reservation';

type Props = NativeStackScreenProps<UserStackParamList, 'CreateReservation'>;

function isValidDate(s: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  return !isNaN(new Date(s + 'T00:00:00').getTime());
}

function isValidTime(s: string): boolean {
  if (!/^\d{2}:\d{2}$/.test(s)) return false;
  const [h, m] = s.split(':').map(Number);
  return h >= 0 && h <= 23 && m >= 0 && m <= 59;
}

function todayISO(): string {
  return new Date().toISOString().split('T')[0];
}

export default function CreateReservationScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<UserStackParamList>>();
  const route = useRoute<Props['route']>();
  const { restaurantId, restaurantName } = route.params;
  const insets = useSafeAreaInsets();

  const { userId } = useAuthStore();
  const { mutate: submitReservation, isPending } = useCreateReservation(userId);

  const [date, setDate] = useState(todayISO());
  const [timeInput, setTimeInput] = useState('19:00');
  const [guests, setGuests] = useState(2);
  const [specialRequests, setSpecialRequests] = useState('');

  const dateValid = isValidDate(date);
  const timeValid = isValidTime(timeInput);
  const canSubmit = Boolean(userId) && dateValid && timeValid && guests >= 1 && !isPending;

  const handleSubmit = () => {
    if (!userId) return;
    const [hour, minute] = timeInput.split(':').map(Number);
    const payload: BackendReservationCreate = {
      userId,
      restaurantId,
      date,
      time: { hour, minute, second: 0, nano: 0 },
      numberOfGuests: guests,
      specialRequests: specialRequests.trim() || undefined,
    };
    submitReservation(payload, {
      onSuccess: () => {
        Alert.alert(
          '¡Reserva creada!',
          'Tu reserva ha sido registrada correctamente.',
          [
            {
              text: 'Ver mis reservas',
              onPress: () => navigation.navigate('UserTabs', { screen: 'UserReservations' }),
            },
          ],
          { cancelable: false }
        );
      },
      onError: () => {
        Alert.alert(
          'Error al crear reserva',
          'No se pudo registrar la reserva. Revisa los datos e intenta de nuevo.'
        );
      },
    });
  };

  const header = (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Ionicons name="chevron-back" size={28} color={colors.textPrimary} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Reservar mesa</Text>
      <View style={styles.headerSpacer} />
    </View>
  );

  if (!userId) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        {header}
        <View style={styles.centerContent}>
          <Ionicons name="person-outline" size={52} color={colors.gold} />
          <Text style={styles.noAuthTitle}>Inicia sesión</Text>
          <Text style={styles.noAuthSubtitle}>
            Debes iniciar sesión para crear una reserva.
          </Text>
          <TouchableOpacity style={styles.goBackBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.goBackBtnText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {header}

        <ScrollView
          style={styles.flex}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + spacing.xxl },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Restaurant badge */}
          <View style={styles.restaurantBadge}>
            <Ionicons name="restaurant" size={18} color={colors.gold} />
            <Text style={styles.restaurantName} numberOfLines={1}>
              {restaurantName ?? 'Restaurante'}
            </Text>
          </View>

          {/* Form card */}
          <View style={styles.card}>
            {/* Date */}
            <View style={styles.field}>
              <Text style={styles.label}>Fecha</Text>
              <Text style={styles.hint}>Formato: AAAA-MM-DD</Text>
              <View
                style={[
                  styles.inputRow,
                  !dateValid && date.length > 0 && styles.inputRowError,
                ]}
              >
                <Ionicons name="calendar-outline" size={18} color={colors.gold} />
                <TextInput
                  style={styles.input}
                  value={date}
                  onChangeText={setDate}
                  placeholder="2026-05-20"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="numeric"
                  maxLength={10}
                  returnKeyType="next"
                />
              </View>
              {!dateValid && date.length > 0 && (
                <Text style={styles.fieldError}>Fecha inválida. Usa el formato AAAA-MM-DD.</Text>
              )}
            </View>

            {/* Time */}
            <View style={styles.field}>
              <Text style={styles.label}>Hora</Text>
              <Text style={styles.hint}>Formato 24 h: HH:MM</Text>
              <View
                style={[
                  styles.inputRow,
                  !timeValid && timeInput.length > 0 && styles.inputRowError,
                ]}
              >
                <Ionicons name="time-outline" size={18} color={colors.gold} />
                <TextInput
                  style={styles.input}
                  value={timeInput}
                  onChangeText={setTimeInput}
                  placeholder="19:00"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="numeric"
                  maxLength={5}
                  returnKeyType="next"
                />
              </View>
              {!timeValid && timeInput.length > 0 && (
                <Text style={styles.fieldError}>Hora inválida. Usa el formato HH:MM.</Text>
              )}
            </View>

            {/* Guests counter */}
            <View style={styles.field}>
              <Text style={styles.label}>Número de personas</Text>
              <View style={styles.counterRow}>
                <TouchableOpacity
                  style={[styles.counterBtn, guests <= 1 && styles.counterBtnDisabled]}
                  onPress={() => setGuests((g) => Math.max(1, g - 1))}
                  disabled={guests <= 1}
                  hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
                >
                  <Ionicons
                    name="remove"
                    size={22}
                    color={guests <= 1 ? colors.textMuted : colors.textPrimary}
                  />
                </TouchableOpacity>
                <Text style={styles.counterValue}>{guests}</Text>
                <TouchableOpacity
                  style={[styles.counterBtn, guests >= 20 && styles.counterBtnDisabled]}
                  onPress={() => setGuests((g) => Math.min(20, g + 1))}
                  disabled={guests >= 20}
                  hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
                >
                  <Ionicons
                    name="add"
                    size={22}
                    color={guests >= 20 ? colors.textMuted : colors.textPrimary}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Special requests */}
            <View style={styles.field}>
              <Text style={styles.label}>
                Solicitudes especiales{' '}
                <Text style={styles.optional}>(opcional)</Text>
              </Text>
              <TextInput
                style={styles.textAreaInput}
                value={specialRequests}
                onChangeText={setSpecialRequests}
                placeholder="Alergias, silla para bebé, ocasión especial..."
                placeholderTextColor={colors.textMuted}
                multiline
                numberOfLines={3}
                maxLength={300}
                textAlignVertical="top"
              />
            </View>
          </View>

          {/* Submit button */}
          <TouchableOpacity
            style={[styles.submitButton, !canSubmit && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={!canSubmit}
            activeOpacity={0.8}
          >
            {isPending ? (
              <ActivityIndicator size="small" color={colors.background} />
            ) : (
              <>
                <Ionicons name="checkmark-circle" size={20} color={colors.background} />
                <Text style={styles.submitButtonText}>Confirmar reserva</Text>
              </>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },

  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.screen,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    color: colors.textPrimary,
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    fontFamily: typography.fontFamily.serif,
    fontStyle: 'italic',
  },
  headerSpacer: { width: 28 },

  // Scroll
  scrollContent: {
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.lg,
    gap: spacing.lg,
  },

  // Restaurant badge
  restaurantBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  restaurantName: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: typography.size.base,
    fontWeight: typography.weight.semibold,
    fontFamily: typography.fontFamily.serif,
  },

  // Form card
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.lg,
  },

  // Field
  field: { gap: spacing.xs },
  label: {
    color: colors.textPrimary,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    fontFamily: typography.fontFamily.body,
  },
  hint: {
    color: colors.textMuted,
    fontSize: typography.size.xs,
    fontFamily: typography.fontFamily.body,
  },
  optional: {
    color: colors.textMuted,
    fontWeight: typography.weight.regular,
  },
  fieldError: {
    color: colors.error,
    fontSize: typography.size.xs,
    fontFamily: typography.fontFamily.body,
  },

  // Input row (icon + TextInput inside a View)
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.cardAlt,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    minHeight: 48,
  },
  inputRowError: {
    borderColor: colors.error,
  },
  input: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: typography.size.base,
    fontFamily: typography.fontFamily.body,
    padding: 0,
  },

  // Multiline text area
  textAreaInput: {
    backgroundColor: colors.cardAlt,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    minHeight: 80,
    color: colors.textPrimary,
    fontSize: typography.size.base,
    fontFamily: typography.fontFamily.body,
  },

  // Guest counter
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xl,
  },
  counterBtn: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.cardAlt,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterBtnDisabled: { opacity: 0.4 },
  counterValue: {
    color: colors.textPrimary,
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    fontFamily: typography.fontFamily.serif,
    minWidth: 32,
    textAlign: 'center',
  },

  // Submit button
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.gold,
    borderRadius: radius.md,
    paddingVertical: spacing.md + 2,
  },
  submitButtonDisabled: { opacity: 0.45 },
  submitButtonText: {
    color: colors.background,
    fontSize: typography.size.base,
    fontWeight: typography.weight.bold,
    fontFamily: typography.fontFamily.body,
  },

  // No-auth state
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  noAuthTitle: {
    color: colors.textPrimary,
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    fontFamily: typography.fontFamily.serif,
    marginTop: spacing.sm,
  },
  noAuthSubtitle: {
    color: colors.textSecondary,
    fontSize: typography.size.sm,
    fontFamily: typography.fontFamily.body,
    textAlign: 'center',
    lineHeight: 20,
  },
  goBackBtn: {
    marginTop: spacing.sm,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.xl,
  },
  goBackBtnText: {
    color: colors.textSecondary,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
    fontFamily: typography.fontFamily.body,
  },
});
