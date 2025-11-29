import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { GlowCard } from '../../components/ui';
import MealCard from '../../components/MealCard';
import { useAuth } from '../../hooks/useAuth';
import { useMeals } from '../../hooks/useMeals';
import { colors, fonts, spacing } from '../../styles/theme';
import { globalStyles } from '../../styles/globalStyles';

const MealHistoryScreen = () => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { meals, dailyTotals, loading } = useMeals(user?.uid, selectedDate);

  const goToPreviousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
  };

  const goToNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    if (newDate <= new Date()) {
      setSelectedDate(newDate);
    }
  };

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  };

  const isToday = () => {
    const today = new Date();
    return selectedDate.toDateString() === today.toDateString();
  };

  return (
    <ScrollView style={globalStyles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Meal History</Text>
      </View>

      {/* Date Navigator */}
      <GlowCard glowColor="purple">
        <View style={styles.dateNavigator}>
          <TouchableOpacity onPress={goToPreviousDay}>
            <Text style={styles.navButton}>←</Text>
          </TouchableOpacity>

          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
            {!isToday() && (
              <TouchableOpacity onPress={goToToday}>
                <Text style={styles.todayButton}>Go to Today</Text>
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            onPress={goToNextDay}
            disabled={isToday()}
          >
            <Text style={[styles.navButton, isToday() && styles.navButtonDisabled]}>
              →
            </Text>
          </TouchableOpacity>
        </View>
      </GlowCard>

      {/* Daily Summary */}
      <GlowCard glowColor="cyan">
        <Text style={styles.cardTitle}>Daily Summary</Text>
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryValue, { color: colors.neonCyan }]}>
              {dailyTotals.calories}
            </Text>
            <Text style={styles.summaryLabel}>Calories</Text>
          </View>

          <View style={styles.summaryItem}>
            <Text style={[styles.summaryValue, { color: colors.neonPink }]}>
              {dailyTotals.protein}g
            </Text>
            <Text style={styles.summaryLabel}>Protein</Text>
          </View>

          <View style={styles.summaryItem}>
            <Text style={[styles.summaryValue, { color: colors.neonYellow }]}>
              {dailyTotals.carbs}g
            </Text>
            <Text style={styles.summaryLabel}>Carbs</Text>
          </View>

          <View style={styles.summaryItem}>
            <Text style={[styles.summaryValue, { color: colors.neonPurple }]}>
              {dailyTotals.fats}g
            </Text>
            <Text style={styles.summaryLabel}>Fats</Text>
          </View>
        </View>

        <Text style={styles.mealCount}>
          {meals.length} meal{meals.length !== 1 ? 's' : ''} logged
        </Text>
      </GlowCard>

      {/* Meals List */}
      <Text style={styles.sectionTitle}>Meals</Text>
      {loading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : meals.length === 0 ? (
        <Text style={styles.emptyText}>No meals logged for this day</Text>
      ) : (
        meals.map((meal) => (
          <MealCard key={meal.id} meal={meal} onPress={() => {}} />
        ))
      )}
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
  },
  dateNavigator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navButton: {
    fontSize: fonts.xxxl,
    color: colors.neonCyan,
    fontWeight: fonts.bold,
    paddingHorizontal: spacing.md,
  },
  navButtonDisabled: {
    opacity: 0.3,
  },
  dateContainer: {
    flex: 1,
    alignItems: 'center',
  },
  dateText: {
    fontSize: fonts.lg,
    fontWeight: fonts.bold,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  todayButton: {
    fontSize: fonts.sm,
    color: colors.neonPink,
    marginTop: spacing.xs,
  },
  cardTitle: {
    fontSize: fonts.lg,
    fontWeight: fonts.bold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: fonts.xl,
    fontWeight: fonts.bold,
  },
  summaryLabel: {
    fontSize: fonts.xs,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  mealCount: {
    fontSize: fonts.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  sectionTitle: {
    fontSize: fonts.xl,
    fontWeight: fonts.bold,
    color: colors.neonCyan,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  loadingText: {
    color: colors.textSecondary,
    fontSize: fonts.md,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: fonts.md,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
});

export default MealHistoryScreen;
