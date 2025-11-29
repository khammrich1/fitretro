import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors, fonts, spacing, borderRadius, shadows } from '../styles/theme';

const StreakCounter = ({ streak = 0, type = 'daily', isActive = true }) => {
  const getStreakIcon = () => {
    if (streak >= 30) return '🔥🔥🔥';
    if (streak >= 7) return '🔥🔥';
    if (streak >= 1) return '🔥';
    return '❄️';
  };

  const getStreakLabel = () => {
    switch (type) {
      case 'daily':
        return 'Day Streak';
      case 'workout':
        return 'Workout Streak';
      case 'meal':
        return 'Meal Logging Streak';
      default:
        return 'Streak';
    }
  };

  return (
    <LinearGradient
      colors={
        isActive
          ? [colors.neonPink, colors.neonPurple]
          : [colors.dark, colors.darker]
      }
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={[styles.container, isActive && shadows.neonPink]}
    >
      <View style={styles.content}>
        <Text style={styles.icon}>{getStreakIcon()}</Text>
        <View style={styles.textContainer}>
          <Text style={styles.streakNumber}>{streak}</Text>
          <Text style={styles.streakLabel}>{getStreakLabel()}</Text>
        </View>
      </View>
      {!isActive && streak > 0 && (
        <View style={styles.inactiveBadge}>
          <Text style={styles.inactiveText}>Broken</Text>
        </View>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontSize: fonts.huge,
    marginRight: spacing.md,
  },
  textContainer: {
    flex: 1,
  },
  streakNumber: {
    fontSize: fonts.xxxl,
    fontWeight: fonts.bold,
    color: colors.textPrimary,
  },
  streakLabel: {
    fontSize: fonts.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  inactiveBadge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: colors.error,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  inactiveText: {
    fontSize: fonts.xs,
    fontWeight: fonts.bold,
    color: colors.textPrimary,
  },
});

export default StreakCounter;
