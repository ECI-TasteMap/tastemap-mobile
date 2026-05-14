import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  StyleSheet,
} from 'react-native';
import ReservationStatusBadge from './ReservationStatusBadge';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { typography } from '../../theme/typography';
import type { UserReservation } from '../../types/reservation';

interface Props {
  reservation: UserReservation;
  onCancel: (id: string) => void;
}

export default function ReservationCard({ reservation, onCancel }: Readonly<Props>) {
  const {
    id,
    restaurantName,
    restaurantEmoji,
    restaurantLogo,
    dateLabel,
    timeLabel,
    peopleCount,
    status,
    canCancel,
  } = reservation;

  const handleCancel = () => {
    Alert.alert(
      'Cancelar reserva',
      `¿Seguro que deseas cancelar tu reserva en ${restaurantName}?`,
      [
        { text: 'Volver', style: 'cancel' },
        {
          text: 'Sí, cancelar',
          style: 'destructive',
          onPress: () => {
            // TODO: DELETE /api/v1/reservations/:id  (endpoint pending)
            onCancel(id);
          },
        },
      ]
    );
  };

  const peopleLabel = `${peopleCount} ${peopleCount === 1 ? 'persona' : 'personas'}`;

  return (
    <View style={styles.card}>
      {/* Main row */}
      <View style={styles.row}>
        {/* Logo / emoji */}
        <View style={styles.logoBox}>
          {restaurantLogo ? (
            <Image source={{ uri: restaurantLogo }} style={styles.logoImage} />
          ) : (
            <Text style={styles.emoji}>{restaurantEmoji}</Text>
          )}
        </View>

        {/* Info */}
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>
            {restaurantName}
          </Text>
          <Text style={styles.detail}>
            {dateLabel} · {timeLabel} · {peopleLabel}
          </Text>
        </View>

        {/* Status badge */}
        <ReservationStatusBadge status={status} />
      </View>

      {/* Cancel button */}
      {canCancel && (
        <TouchableOpacity
          style={styles.cancelBtn}
          activeOpacity={0.65}
          onPress={handleCancel}
        >
          <Text style={styles.cancelText}>Cancelar</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  logoBox: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    backgroundColor: colors.cardAlt,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  logoImage: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
  },
  emoji: {
    fontSize: 26,
  },
  info: {
    flex: 1,
    gap: 4,
  },
  name: {
    color: colors.textPrimary,
    fontSize: typography.size.base,
    fontWeight: typography.weight.bold,
    fontFamily: typography.fontFamily.serif,
  },
  detail: {
    color: colors.textSecondary,
    fontSize: typography.size.xs,
    fontFamily: typography.fontFamily.body,
    lineHeight: 17,
  },
  cancelBtn: {
    marginTop: spacing.md,
    paddingVertical: spacing.sm + 1,
    borderRadius: radius.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  cancelText: {
    color: colors.textSecondary,
    fontSize: typography.size.sm,
    fontFamily: typography.fontFamily.body,
    fontWeight: typography.weight.medium,
  },
});
