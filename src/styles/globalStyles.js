import { StyleSheet } from 'react-native';
import { colors, fonts, spacing, borderRadius } from './theme';

export const globalStyles = StyleSheet.create({
  // Containers
  container: {
    flex: 1,
    backgroundColor: colors.darkest,
  },
  screenContainer: {
    flex: 1,
    backgroundColor: colors.darkest,
    padding: spacing.md,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.darkest,
  },

  // Cards
  card: {
    backgroundColor: colors.darker,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  glowCard: {
    backgroundColor: colors.darker,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.neonCyan,
  },

  // Text styles
  heading1: {
    fontSize: fonts.huge,
    fontWeight: fonts.bold,
    color: colors.neonPink,
    marginBottom: spacing.md,
  },
  heading2: {
    fontSize: fonts.xxxl,
    fontWeight: fonts.bold,
    color: colors.neonCyan,
    marginBottom: spacing.sm,
  },
  heading3: {
    fontSize: fonts.xxl,
    fontWeight: fonts.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  bodyText: {
    fontSize: fonts.md,
    fontWeight: fonts.regular,
    color: colors.textPrimary,
    lineHeight: 22,
  },
  secondaryText: {
    fontSize: fonts.sm,
    fontWeight: fonts.regular,
    color: colors.textSecondary,
  },

  // Inputs
  input: {
    backgroundColor: colors.dark,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: fonts.md,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.neonPurple,
    marginBottom: spacing.md,
  },

  // Buttons
  button: {
    backgroundColor: colors.neonPink,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  buttonText: {
    fontSize: fonts.lg,
    fontWeight: fonts.bold,
    color: colors.textPrimary,
  },

  // Layout
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  // Spacing
  marginBottom: {
    marginBottom: spacing.md,
  },
  marginTop: {
    marginTop: spacing.md,
  },
  paddingHorizontal: {
    paddingHorizontal: spacing.md,
  },

  // Neon glow text
  neonTextPink: {
    color: colors.neonPink,
    textShadowColor: colors.neonPink,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  neonTextCyan: {
    color: colors.neonCyan,
    textShadowColor: colors.neonCyan,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  neonTextPurple: {
    color: colors.neonPurple,
    textShadowColor: colors.neonPurple,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
});

export default globalStyles;
