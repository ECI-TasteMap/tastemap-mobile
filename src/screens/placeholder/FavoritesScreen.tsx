import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '../../components/layout/ScreenContainer';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

export default function FavoritesScreen() {
  return (
    <ScreenContainer contentStyle={styles.inner}>
      <Ionicons name="heart" size={48} color={colors.orange} />
      <Text style={styles.title}>Mis Favoritos</Text>
      <Text style={styles.subtitle}>
        Próximamente: guarda tus restaurantes favoritos aquí.
        {/* TODO: endpoint GET /api/v1/users/:id/favorites */}
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
