import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors, fonts, spacing, borderRadius, shadows } from '../../styles/theme';

const NeonButton = ({
  title,
  onPress,
  variant = 'pink', // pink, cyan, purple, gradient
  disabled = false,
  loading = false,
  style,
  textStyle,
}) => {
  const getGradientColors = () => {
    switch (variant) {
      case 'pink':
        return [colors.neonPink, '#cc0057'];
      case 'cyan':
        return [colors.neonCyan, '#0099cc'];
      case 'purple':
        return colors.gradientPurple;
      case 'gradient':
        return colors.gradientSunset;
      default:
        return [colors.neonPink, '#cc0057'];
    }
  };

  const getShadowColor = () => {
    switch (variant) {
      case 'pink':
        return shadows.neonPink;
      case 'cyan':
        return shadows.neonCyan;
      case 'purple':
        return shadows.neonPurple;
      default:
        return shadows.neonPink;
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[styles.container, style, disabled && styles.disabled]}
    >
      <LinearGradient
        colors={getGradientColors()}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.gradient, getShadowColor()]}
      >
        {loading ? (
          <ActivityIndicator color={colors.textPrimary} />
        ) : (
          <Text style={[styles.text, textStyle]}>{title}</Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  gradient: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  text: {
    fontSize: fonts.lg,
    fontWeight: fonts.bold,
    color: colors.textPrimary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  disabled: {
    opacity: 0.5,
  },
});

export default NeonButton;
