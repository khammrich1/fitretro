import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors, fonts, spacing, borderRadius } from '../styles/theme';

const AchievementBadge = ({ achievement, unlocked = false, size = 'medium' }) => {
  const { name, description, icon } = achievement;

  const getBadgeSize = () => {
    switch (size) {
      case 'small':
        return 60;
      case 'medium':
        return 80;
      case 'large':
        return 100;
      default:
        return 80;
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'small':
        return fonts.xxl;
      case 'medium':
        return fonts.xxxl;
      case 'large':
        return fonts.huge;
      default:
        return fonts.xxxl;
    }
  };

  const badgeSize = getBadgeSize();
  const iconSize = getIconSize();

  return (
    <View style={styles.container}>
      {unlocked ? (
        <LinearGradient
          colors={colors.gradientSunset}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.badge,
            {
              width: badgeSize,
              height: badgeSize,
              shadowColor: colors.neonCyan,
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 1,
              shadowRadius: 15,
              elevation: 8,
            },
          ]}
        >
          <Text style={[styles.icon, { fontSize: iconSize }]}>{icon}</Text>
        </LinearGradient>
      ) : (
        <View
          style={[
            styles.badge,
            styles.lockedBadge,
            { width: badgeSize, height: badgeSize },
          ]}
        >
          <Text style={[styles.icon, styles.lockedIcon, { fontSize: iconSize }]}>
            🔒
          </Text>
        </View>
      )}
      {size !== 'small' && (
        <>
          <Text style={[styles.name, unlocked ? styles.unlockedText : styles.lockedText]}>
            {name}
          </Text>
          {description && (
            <Text style={styles.description} numberOfLines={2}>
              {description}
            </Text>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: spacing.sm,
    maxWidth: 120,
  },
  badge: {
    borderRadius: borderRadius.round,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  lockedBadge: {
    backgroundColor: colors.dark,
  },
  icon: {
    textAlign: 'center',
  },
  lockedIcon: {
    opacity: 0.3,
  },
  name: {
    fontSize: fonts.sm,
    fontWeight: fonts.bold,
    textAlign: 'center',
  },
  unlockedText: {
    color: colors.neonCyan,
  },
  lockedText: {
    color: colors.textTertiary,
  },
  description: {
    fontSize: fonts.xs,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
});

export default AchievementBadge;
