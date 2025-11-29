import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { NeonButton, RetroInput, GlowCard, ProgressRing } from '../../components/ui';
import { useAuth } from '../../hooks/useAuth';
import { useMeals } from '../../hooks/useMeals';
import firestoreService from '../../services/firestoreService';
import { calculateProgress } from '../../utils/nutritionCalculator';
import { colors, fonts, spacing } from '../../styles/theme';
import { globalStyles } from '../../styles/globalStyles';

const GoalsScreen = () => {
  const { user, userProfile } = useAuth();
  const { dailyTotals } = useMeals(user?.uid);
  const [editing, setEditing] = useState(false);
  const [goals, setGoals] = useState({
    calories: 2000,
    protein: 150,
    carbs: 200,
    fats: 65,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userProfile?.goals) {
      setGoals(userProfile.goals);
    }
  }, [userProfile]);

  const handleSaveGoals = async () => {
    setLoading(true);
    await firestoreService.updateUserProfile(user.uid, {
      goals: goals,
    });
    setLoading(false);
    setEditing(false);
  };

  const updateGoal = (key, value) => {
    setGoals({
      ...goals,
      [key]: parseInt(value) || 0,
    });
  };

  return (
    <ScrollView style={globalStyles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Nutrition Goals</Text>
        <Text style={styles.subtitle}>Track your daily targets 🎯</Text>
      </View>

      {/* Today's Progress */}
      <GlowCard glowColor="cyan" intensity="high">
        <Text style={styles.cardTitle}>Today's Progress</Text>

        <View style={styles.progressContainer}>
          <View style={styles.progressRing}>
            <ProgressRing
              size={140}
              progress={calculateProgress(dailyTotals.calories, goals.calories)}
              color={colors.neonCyan}
              centerText={dailyTotals.calories.toString()}
              centerSubtext={`/ ${goals.calories}`}
            />
            <Text style={styles.ringLabel}>Calories</Text>
          </View>

          <View style={styles.progressRing}>
            <ProgressRing
              size={140}
              progress={calculateProgress(dailyTotals.protein, goals.protein)}
              color={colors.neonPink}
              centerText={`${dailyTotals.protein}g`}
              centerSubtext={`/ ${goals.protein}g`}
            />
            <Text style={styles.ringLabel}>Protein</Text>
          </View>
        </View>

        <View style={styles.macroRow}>
          <View style={styles.macroItem}>
            <Text style={styles.macroLabel}>Carbs</Text>
            <ProgressRing
              size={80}
              progress={calculateProgress(dailyTotals.carbs, goals.carbs)}
              color={colors.neonYellow}
              showPercentage={false}
              centerText={`${dailyTotals.carbs}g`}
            />
            <Text style={styles.macroGoal}>Goal: {goals.carbs}g</Text>
          </View>

          <View style={styles.macroItem}>
            <Text style={styles.macroLabel}>Fats</Text>
            <ProgressRing
              size={80}
              progress={calculateProgress(dailyTotals.fats, goals.fats)}
              color={colors.neonPurple}
              showPercentage={false}
              centerText={`${dailyTotals.fats}g`}
            />
            <Text style={styles.macroGoal}>Goal: {goals.fats}g</Text>
          </View>
        </View>
      </GlowCard>

      {/* Goals Settings */}
      <GlowCard glowColor="pink">
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Your Goals</Text>
          {!editing && (
            <NeonButton
              title="Edit"
              onPress={() => setEditing(true)}
              variant="cyan"
              style={styles.editButton}
            />
          )}
        </View>

        {editing ? (
          <>
            <RetroInput
              label="Daily Calories"
              value={goals.calories.toString()}
              onChangeText={(value) => updateGoal('calories', value)}
              keyboardType="numeric"
              glowColor="cyan"
            />

            <RetroInput
              label="Protein (grams)"
              value={goals.protein.toString()}
              onChangeText={(value) => updateGoal('protein', value)}
              keyboardType="numeric"
              glowColor="pink"
            />

            <RetroInput
              label="Carbs (grams)"
              value={goals.carbs.toString()}
              onChangeText={(value) => updateGoal('carbs', value)}
              keyboardType="numeric"
              glowColor="purple"
            />

            <RetroInput
              label="Fats (grams)"
              value={goals.fats.toString()}
              onChangeText={(value) => updateGoal('fats', value)}
              keyboardType="numeric"
              glowColor="purple"
            />

            <NeonButton
              title="Save Goals"
              onPress={handleSaveGoals}
              loading={loading}
              variant="gradient"
            />

            <NeonButton
              title="Cancel"
              onPress={() => {
                setEditing(false);
                setGoals(userProfile?.goals || goals);
              }}
              variant="cyan"
            />
          </>
        ) : (
          <View style={styles.goalsDisplay}>
            <View style={styles.goalRow}>
              <Text style={styles.goalLabel}>Calories:</Text>
              <Text style={[styles.goalValue, { color: colors.neonCyan }]}>
                {goals.calories}
              </Text>
            </View>

            <View style={styles.goalRow}>
              <Text style={styles.goalLabel}>Protein:</Text>
              <Text style={[styles.goalValue, { color: colors.neonPink }]}>
                {goals.protein}g
              </Text>
            </View>

            <View style={styles.goalRow}>
              <Text style={styles.goalLabel}>Carbs:</Text>
              <Text style={[styles.goalValue, { color: colors.neonYellow }]}>
                {goals.carbs}g
              </Text>
            </View>

            <View style={styles.goalRow}>
              <Text style={styles.goalLabel}>Fats:</Text>
              <Text style={[styles.goalValue, { color: colors.neonPurple }]}>
                {goals.fats}g
              </Text>
            </View>
          </View>
        )}
      </GlowCard>

      {/* Tips */}
      <GlowCard glowColor="green">
        <Text style={styles.tipsTitle}>💡 Pro Tips</Text>
        <Text style={styles.tipsText}>
          • Adjust your goals based on your activity level{'\n'}
          • Aim for 0.8-1g of protein per pound of body weight{'\n'}
          • Stay consistent with your tracking{'\n'}
          • Small progress is still progress!
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
  title: {
    fontSize: fonts.xxxl,
    fontWeight: fonts.bold,
    color: colors.neonPink,
    textShadowColor: colors.neonPink,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: fonts.md,
    color: colors.textSecondary,
  },
  cardTitle: {
    fontSize: fonts.lg,
    fontWeight: fonts.bold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  editButton: {
    marginBottom: 0,
    paddingHorizontal: spacing.lg,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.lg,
  },
  progressRing: {
    alignItems: 'center',
  },
  ringLabel: {
    fontSize: fonts.sm,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
  macroRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  macroItem: {
    alignItems: 'center',
  },
  macroLabel: {
    fontSize: fonts.sm,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  macroGoal: {
    fontSize: fonts.xs,
    color: colors.textTertiary,
    marginTop: spacing.xs,
  },
  goalsDisplay: {
    gap: spacing.md,
  },
  goalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  goalLabel: {
    fontSize: fonts.lg,
    color: colors.textPrimary,
    fontWeight: fonts.medium,
  },
  goalValue: {
    fontSize: fonts.xl,
    fontWeight: fonts.bold,
  },
  tipsTitle: {
    fontSize: fonts.lg,
    fontWeight: fonts.bold,
    color: colors.neonGreen,
    marginBottom: spacing.sm,
  },
  tipsText: {
    fontSize: fonts.sm,
    color: colors.textSecondary,
    lineHeight: 22,
  },
});

export default GoalsScreen;
