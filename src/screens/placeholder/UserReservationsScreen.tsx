import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '../../components/layout/ScreenContainer';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

export default function UserReservationsScreen() {
  return (
    <ScreenContainer contentStyle={styles.inner}>
      <Ionicons name="calendar-outline" size={48} color={colors.gold} />
      <Text style={styles.title}>Mis reservas</Text>
      <Text style={styles.subtitle}>
        Próximamente: gestiona aquí tus reservas en restaurantes.{'\n'}
        {/* TODO: endpoint GET /api/v1/users/:id/reservations */}
      </Text>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  inner: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  title: {
    color: colors.textPrimary,
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    fontFamily: typography.fontFamily.serif,
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: typography.size.sm,
    fontFamily: typography.fontFamily.body,
    textAlign: 'center',
    lineHeight: 20,
  },
});
