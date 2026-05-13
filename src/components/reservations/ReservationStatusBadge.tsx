import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { radius } from '../../theme/radius';
import { typography } from '../../theme/typography';
import type { ReservationStatus } from '../../types/reservation';

interface StatusConfig {
  label: string;
  textColor: string;
  bgColor: string;
  borderColor: string;
}

const STATUS_CONFIG: Record<ReservationStatus, StatusConfig> = {
  pending: {
    label: 'PENDIENTE',
    textColor: colors.gold,
    bgColor: 'rgba(201,169,110,0.15)',
    borderColor: 'rgba(201,169,110,0.35)',
  },
  confirmed: {
    label: 'CONFIRMADA',
    textColor: colors.teal,
    bgColor: 'rgba(45,212,191,0.15)',
    borderColor: 'rgba(45,212,191,0.35)',
  },
  completed: {
    label: 'COMPLETADA',
    textColor: colors.textMuted,
    bgColor: 'rgba(255,255,255,0.07)',
    borderColor: 'rgba(255,255,255,0.15)',
  },
  cancelled: {
    label: 'CANCELADA',
    textColor: colors.error,
    bgColor: 'rgba(244,67,54,0.12)',
    borderColor: 'rgba(244,67,54,0.3)',
  },
};

interface Props {
  status: ReservationStatus;
}

export default function ReservationStatusBadge({ status }: Readonly<Props>) {
  const cfg = STATUS_CONFIG[status];
  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: cfg.bgColor, borderColor: cfg.borderColor },
      ]}
    >
      <Text style={[styles.label, { color: cfg.textColor }]}>{cfg.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: radius.round,
    borderWidth: 1,
    paddingHorizontal: 9,
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  label: {
    fontSize: typography.size.xs,
    fontFamily: typography.fontFamily.body,
    fontWeight: typography.weight.semibold,
    letterSpacing: 0.4,
  },
});
