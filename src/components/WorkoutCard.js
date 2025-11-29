import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import GlowCard from './ui/GlowCard';
import { colors, fonts, spacing } from '../styles/theme';

const WorkoutCard = ({ workout, onPress }) => {
  const { name, type, duration, exercises, timestamp } = workout;

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const getTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'cardio':
        return colors.neonCyan;
      case 'strength':
        return colors.neonPink;
      case 'flexibility':
        return colors.neonPurple;
      default:
        return colors.neonGreen;
    }
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <GlowCard glowColor="pink" intensity="medium">
        <View style={styles.header}>
          <View>
            <Text style={styles.workoutName}>{name}</Text>
            <Text style={[styles.type, { color: getTypeColor(type) }]}>
              {type}
            </Text>
          </View>
          <Text style={styles.date}>{formatDate(timestamp)}</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{duration}</Text>
            <Text style={styles.statLabel}>Minutes</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {exercises?.length || 0}
            </Text>
            <Text style={styles.statLabel}>Exercises</Text>
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
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  workoutName: {
    fontSize: fonts.lg,
    fontWeight: fonts.bold,
    color: colors.textPrimary,
  },
  type: {
    fontSize: fonts.sm,
    fontWeight: fonts.medium,
    marginTop: spacing.xs,
    textTransform: 'uppercase',
  },
  date: {
    fontSize: fonts.sm,
    color: colors.textSecondary,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: fonts.xxl,
    fontWeight: fonts.bold,
    color: colors.neonPink,
  },
  statLabel: {
    fontSize: fonts.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: colors.dark,
  },
});

export default WorkoutCard;
