import React from 'react';
import { View, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors, spacing, borderRadius } from '../../styles/theme';

const GlowCard = ({
  children,
  glowColor = 'cyan', // cyan, pink, purple
  intensity = 'medium', // low, medium, high
  style,
}) => {
  const getGlowColor = () => {
    switch (glowColor) {
      case 'cyan':
        return colors.neonCyan;
      case 'pink':
        return colors.neonPink;
      case 'purple':
        return colors.neonPurple;
      case 'green':
        return colors.neonGreen;
      default:
        return colors.neonCyan;
    }
  };

  const getBorderWidth = () => {
    switch (intensity) {
      case 'low':
        return 0.5;
      case 'medium':
        return 1;
      case 'high':
        return 2;
      default:
        return 1;
    }
  };

  const glowStyle = {
    shadowColor: getGlowColor(),
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: intensity === 'high' ? 1 : intensity === 'medium' ? 0.7 : 0.5,
    shadowRadius: intensity === 'high' ? 15 : intensity === 'medium' ? 10 : 5,
    elevation: 8,
  };

  return (
    <View style={[styles.container, glowStyle, style]}>
      <View
        style={[
          styles.card,
          {
            borderColor: getGlowColor(),
            borderWidth: getBorderWidth(),
          },
        ]}
      >
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  card: {
    backgroundColor: colors.darker,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
  },
});

export default GlowCard;
