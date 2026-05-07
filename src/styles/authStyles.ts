import { StyleSheet, Platform } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { radius } from '../theme/radius';

export const authStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  scrollContent: {
    flexGrow: 1,
  },

  header: {
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl,
    alignItems: 'center',
    borderBottomLeftRadius: radius.xl,
    borderBottomRightRadius: radius.xl,
  },

  tasteMapTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: spacing.md,
    letterSpacing: 1,
  },

  headerDivider: {
    width: 40,
    height: 2,
    backgroundColor: colors.gold,
    marginBottom: spacing.md,
  },

  headerSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },

  badgeContainer: {
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },

  badge: {
    fontSize: 11,
    color: colors.textMuted,
    letterSpacing: 2,
    fontWeight: '600',
  },

  formContainer: {
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl,
  },

  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },

  mainSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },

  inputGroup: {
    marginBottom: spacing.lg,
  },

  inputLabel: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '600',
    marginBottom: spacing.sm,
    letterSpacing: 0.5,
  },

  textInput: {
    backgroundColor: colors.cardAlt,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    color: colors.textPrimary,
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },

  textInputPlaceholder: {
    color: colors.textMuted,
  },

  primaryButton: {
    backgroundColor: colors.gold,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },

  primaryButtonGreen: {
    backgroundColor: colors.green,
  },

  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.background,
    letterSpacing: 0.5,
  },

  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.lg,
  },

  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },

  dividerText: {
    marginHorizontal: spacing.md,
    color: colors.textMuted,
    fontSize: 12,
  },

  secondaryButton: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },

  secondaryButtonText: {
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: '500',
  },

  footerContainer: {
    paddingHorizontal: spacing.screen,
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },

  footerText: {
    textAlign: 'center',
    color: colors.textMuted,
    fontSize: 12,
  },

  footerActionText: {
    color: colors.teal,
    fontWeight: '600',
  },

  footerPrimaryText: {
    color: colors.gold,
  },
});
