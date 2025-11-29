// FitRetro - 80s Retrowave Theme Configuration

export const colors = {
  // Primary neon colors
  neonPink: '#ff006e',
  neonCyan: '#00f5ff',
  neonPurple: '#b967ff',
  neonYellow: '#fbf236',
  neonGreen: '#05ffa1',

  // Dark backgrounds
  darkest: '#0a0a0a',
  darker: '#1a1a2e',
  dark: '#16213e',

  // Gradients
  gradientPink: ['#ff006e', '#8b00ff'],
  gradientCyan: ['#00f5ff', '#0088ff'],
  gradientSunset: ['#ff006e', '#fbf236', '#00f5ff'],
  gradientPurple: ['#b967ff', '#ff006e'],

  // UI colors
  success: '#05ffa1',
  warning: '#fbf236',
  error: '#ff006e',
  info: '#00f5ff',

  // Text colors
  textPrimary: '#ffffff',
  textSecondary: '#b0b0b0',
  textTertiary: '#808080',

  // Transparent overlays
  overlay: 'rgba(0, 0, 0, 0.7)',
  overlayLight: 'rgba(0, 0, 0, 0.5)',
};

export const fonts = {
  // Font families (use system fonts with fallbacks)
  primary: 'System',
  mono: 'Courier',

  // Font sizes
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,

  // Font weights
  light: '300',
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 16,
  xl: 24,
  round: 9999,
};

export const shadows = {
  neonPink: {
    shadowColor: colors.neonPink,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 5,
  },
  neonCyan: {
    shadowColor: colors.neonCyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 5,
  },
  neonPurple: {
    shadowColor: colors.neonPurple,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 5,
  },
  dark: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
};

export const animations = {
  timing: {
    fast: 150,
    normal: 300,
    slow: 500,
  },
};

export default {
  colors,
  fonts,
  spacing,
  borderRadius,
  shadows,
  animations,
};
