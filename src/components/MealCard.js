import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import GlowCard from './ui/GlowCard';
import { colors, fonts, spacing } from '../styles/theme';

const MealCard = ({ meal, onPress }) => {
  const { name, calories, protein, carbs, fats, timestamp } = meal;

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <GlowCard glowColor="cyan" intensity="medium">
        <View style={styles.header}>
          <Text style={styles.mealName}>{name}</Text>
          <Text style={styles.time}>{formatTime(timestamp)}</Text>
        </View>

        <View style={styles.macrosContainer}>
          <View style={styles.macroItem}>
            <Text style={styles.macroValue}>{calories}</Text>
            <Text style={styles.macroLabel}>Calories</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.macroItem}>
            <Text style={[styles.macroValue, { color: colors.neonPink }]}>
              {protein}g
            </Text>
            <Text style={styles.macroLabel}>Protein</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.macroItem}>
            <Text style={[styles.macroValue, { color: colors.neonYellow }]}>
              {carbs}g
            </Text>
            <Text style={styles.macroLabel}>Carbs</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.macroItem}>
            <Text style={[styles.macroValue, { color: colors.neonPurple }]}>
              {fats}g
            </Text>
            <Text style={styles.macroLabel}>Fats</Text>
          </View>
        </View>
      </GlowCard>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  mealName: {
    fontSize: fonts.lg,
    fontWeight: fonts.bold,
    color: colors.textPrimary,
    flex: 1,
  },
  time: {
    fontSize: fonts.sm,
    color: colors.textSecondary,
  },
  macrosContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  macroItem: {
    flex: 1,
    alignItems: 'center',
  },
  macroValue: {
    fontSize: fonts.lg,
    fontWeight: fonts.bold,
    color: colors.neonCyan,
  },
  macroLabel: {
    fontSize: fonts.xs,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  divider: {
    width: 1,
    height: 30,
    backgroundColor: colors.dark,
  },
});

export default MealCard;
