import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { ProgressRing, GlowCard } from '../../components/ui';
import StreakCounter from '../../components/StreakCounter';
import { useAuth } from '../../hooks/useAuth';
import { useMeals } from '../../hooks/useMeals';
import firestoreService from '../../services/firestoreService';
import { calculateProgress } from '../../utils/nutritionCalculator';
import { getLevelInfo } from '../../utils/gamification';
import { colors, fonts, spacing } from '../../styles/theme';
import { globalStyles } from '../../styles/globalStyles';

const DashboardScreen = () => {
  const { user, userProfile } = useAuth();
  const { dailyTotals, loading: mealsLoading } = useMeals(user?.uid);
  const [gamificationData, setGamificationData] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user) {
      loadGamificationData();
    }
  }, [user]);

  const loadGamificationData = async () => {
    const result = await firestoreService.getGamificationData(user.uid);
    if (result.success) {
      setGamificationData(result.data);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadGamificationData();
    setRefreshing(false);
  };

  const goals = userProfile?.goals || {
    calories: 2000,
    protein: 150,
    carbs: 200,
    fats: 65,
  };

  const levelInfo = gamificationData
    ? getLevelInfo(gamificationData.points)
    : { level: 1, title: 'Beginner', progress: 0 };

  return (
    <ScrollView
      style={globalStyles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={colors.neonCyan}
        />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>
          Welcome back, {userProfile?.name || 'Trainer'}!
        </Text>
        <View style={styles.levelBadge}>
          <Text style={styles.levelText}>
            Level {levelInfo.level} - {levelInfo.title}
          </Text>
          <Text style={styles.pointsText}>
            {gamificationData?.points || 0} pts
          </Text>
        </View>
      </View>

      {/* Streaks */}
      <StreakCounter
        streak={gamificationData?.streaks?.daily || 0}
        type="daily"
        isActive={true}
      />

      {/* Daily Nutrition Overview */}
      <GlowCard glowColor="cyan" intensity="high">
        <Text style={styles.cardTitle}>Today's Nutrition</Text>
        <View style={styles.progressRingsContainer}>
          <View style={styles.progressRingWrapper}>
            <ProgressRing
              size={100}
              progress={calculateProgress(dailyTotals.calories, goals.calories)}
              color={colors.neonCyan}
              centerText={dailyTotals.calories.toString()}
              centerSubtext="cal"
            />
            <Text style={styles.ringLabel}>Calories</Text>
          </View>

          <View style={styles.progressRingWrapper}>
            <ProgressRing
              size={100}
              progress={calculateProgress(dailyTotals.protein, goals.protein)}
              color={colors.neonPink}
              centerText={`${dailyTotals.protein}g`}
              centerSubtext="protein"
            />
            <Text style={styles.ringLabel}>Protein</Text>
          </View>
        </View>

        <View style={styles.macroRow}>
          <View style={styles.macroItem}>
            <Text style={styles.macroLabel}>Carbs</Text>
            <Text style={[styles.macroValue, { color: colors.neonYellow }]}>
              {dailyTotals.carbs}g / {goals.carbs}g
            </Text>
          </View>

          <View style={styles.macroItem}>
            <Text style={styles.macroLabel}>Fats</Text>
            <Text style={[styles.macroValue, { color: colors.neonPurple }]}>
              {dailyTotals.fats}g / {goals.fats}g
            </Text>
          </View>
        </View>
      </GlowCard>

      {/* Quick Stats */}
      <View style={styles.statsRow}>
        <GlowCard glowColor="pink" style={styles.statCard}>
          <Text style={styles.statValue}>
            {gamificationData?.streaks?.workout || 0}
          </Text>
          <Text style={styles.statLabel}>Workout Streak</Text>
        </GlowCard>

        <GlowCard glowColor="purple" style={styles.statCard}>
          <Text style={styles.statValue}>
            {gamificationData?.streaks?.meal || 0}
          </Text>
          <Text style={styles.statLabel}>Meal Streak</Text>
        </GlowCard>
      </View>

      {/* Motivation Message */}
      <GlowCard glowColor="green">
        <Text style={styles.motivationTitle}>🌟 Today's Mission</Text>
        <Text style={styles.motivationText}>
          Keep crushing it! You're {levelInfo.pointsToNext || 0} points away from
          leveling up!
        </Text>
      </GlowCard>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: spacing.md,
  },
  header: {
    marginBottom: spacing.lg,
  },
  greeting: {
    fontSize: fonts.xxl,
    fontWeight: fonts.bold,
    color: colors.neonCyan,
    textShadowColor: colors.neonCyan,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
    marginBottom: spacing.sm,
  },
  levelBadge: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  levelText: {
    fontSize: fonts.md,
    color: colors.textPrimary,
    fontWeight: fonts.medium,
  },
  pointsText: {
    fontSize: fonts.md,
    color: colors.neonPink,
    fontWeight: fonts.bold,
  },
  cardTitle: {
    fontSize: fonts.lg,
    fontWeight: fonts.bold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  progressRingsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.md,
  },
  progressRingWrapper: {
    alignItems: 'center',
  },
  ringLabel: {
    fontSize: fonts.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  macroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  macroItem: {
    flex: 1,
    alignItems: 'center',
  },
  macroLabel: {
    fontSize: fonts.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  macroValue: {
    fontSize: fonts.md,
    fontWeight: fonts.bold,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: fonts.xxxl,
    fontWeight: fonts.bold,
    color: colors.neonCyan,
  },
  statLabel: {
    fontSize: fonts.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  motivationTitle: {
    fontSize: fonts.lg,
    fontWeight: fonts.bold,
    color: colors.neonGreen,
    marginBottom: spacing.sm,
  },
  motivationText: {
    fontSize: fonts.md,
    color: colors.textPrimary,
    lineHeight: 22,
  },
});

export default DashboardScreen;
