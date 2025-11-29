import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts, spacing } from '../../styles/theme';
import { globalStyles } from '../../styles/globalStyles';

// Placeholder for future exercise library feature
const ExerciseLibraryScreen = () => {
  return (
    <View style={globalStyles.centerContainer}>
      <Text style={styles.title}>Exercise Library</Text>
      <Text style={styles.subtitle}>Coming Soon! 🏋️</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: fonts.xxxl,
    fontWeight: fonts.bold,
    color: colors.neonPink,
    textShadowColor: colors.neonPink,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: fonts.lg,
    color: colors.textSecondary,
  },
});

export default ExerciseLibraryScreen;
