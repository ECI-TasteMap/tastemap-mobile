import { StyleSheet } from 'react-native';
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
    paddingBottom: spacing.xl,
    alignItems: 'center',
    borderBottomLeftRadius: radius.xl,
    borderBottomRightRadius: radius.xl,
    minHeight: 180,
    justifyContent: 'center',
  },

  tasteMapTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    fontFamily: 'serif',
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
    fontFamily: 'sans-serif-medium',
    letterSpacing: 0.5,
  },

  badgeContainer: {
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },

  badge: {
    fontSize: 11,
    color: colors.textMuted,
    fontFamily: 'sans-serif-medium',
    letterSpacing: 2,
    fontWeight: '600',
  },

  formContainer: {
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
  },

  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'serif',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },

  mainSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    fontFamily: 'sans-serif-medium',
    marginBottom: spacing.xl,
  },

  inputGroup: {
    marginBottom: spacing.lg,
  },

  inputLabel: {
    fontSize: 12,
    color: colors.textMuted,
    fontFamily: 'sans-serif-medium',
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
    fontFamily: 'sans-serif-medium',
  },

  textInputPlaceholder: {
    color: colors.textMuted,
  },

  primaryButton: {
    backgroundColor: colors.gold,
    borderRadius: radius.md,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.md,
    elevation: 6,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },

  primaryButtonGold: {
    elevation: 6,
    shadowColor: colors.gold,
    shadowOpacity: 0.2,
  },

  primaryButtonGreen: {
    elevation: 6,
    shadowColor: colors.green,
    shadowOpacity: 0.2,
  },

  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'sans-serif-medium',
    color: colors.background,
    letterSpacing: 0.5,
  },

  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.md,
  },

  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },

  dividerText: {
    marginHorizontal: spacing.md,
    color: colors.textMuted,
    fontFamily: 'sans-serif-medium',
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
    fontFamily: 'sans-serif-medium',
    fontWeight: '500',
  },

  footerContainer: {
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.lg,
    gap: spacing.md,
  },

  footerText: {
    textAlign: 'center',
    color: colors.textMuted,
    fontFamily: 'sans-serif-medium',
    fontSize: 12,
  },

  footerActionText: {
    color: colors.teal,
    fontFamily: 'sans-serif-medium',
    fontWeight: '600',
  },

  footerPrimaryText: {
    color: colors.gold,
  },
});
