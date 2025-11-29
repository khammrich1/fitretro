import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { NeonButton, RetroInput, GlowCard } from '../../components/ui';
import MealCard from '../../components/MealCard';
import { useAuth } from '../../hooks/useAuth';
import { useMeals } from '../../hooks/useMeals';
import claudeApi from '../../services/claudeApi';
import firestoreService from '../../services/firestoreService';
import { calculatePoints, POINTS } from '../../utils/gamification';
import { colors, fonts, spacing } from '../../styles/theme';
import { globalStyles } from '../../styles/globalStyles';

const MealLoggingScreen = ({ navigation }) => {
  const { user, userProfile } = useAuth();
  const { meals, addMeal, dailyTotals } = useMeals(user?.uid);
  const [mealDescription, setMealDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [parsedMeal, setParsedMeal] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const handleParseMeal = async () => {
    if (!mealDescription.trim()) {
      setError('Please describe your meal');
      return;
    }

    setError('');
    setLoading(true);

    // Parse meal with Claude API
    const result = await claudeApi.parseMeal(mealDescription);

    setLoading(false);

    if (result.success) {
      setParsedMeal(result.data);
      setError('');
    } else {
      setError(result.error);
    }
  };

  const handleSaveMeal = async () => {
    if (!parsedMeal) return;

    setLoading(true);

    // Save meal to Firestore
    const result = await addMeal({
      ...parsedMeal,
      timestamp: new Date().toISOString(),
    });

    if (result.success) {
      // Award points
      const points = calculatePoints('MEAL_LOG');
      const gamificationResult = await firestoreService.getGamificationData(
        user.uid
      );

      if (gamificationResult.success) {
        const currentPoints = gamificationResult.data.points || 0;
        await firestoreService.updateGamificationData(user.uid, {
          points: currentPoints + points,
          streaks: {
            ...gamificationResult.data.streaks,
            meal: (gamificationResult.data.streaks?.meal || 0) + 1,
          },
        });
      }

      // Reset form
      setMealDescription('');
      setParsedMeal(null);
      setError('');
    } else {
      setError('Failed to save meal');
    }

    setLoading(false);
  };

  const handleEditMeal = (field, value) => {
    setParsedMeal({
      ...parsedMeal,
      [field]: value,
    });
  };

  const handleGetSuggestions = async () => {
    setLoadingSuggestions(true);
    setError('');

    // Get user's goals
    const goals = userProfile?.goals || {
      calories: 2000,
      protein: 150,
      carbs: 200,
      fats: 65,
    };

    // Calculate remaining macros
    const remaining = {
      calories: Math.max(goals.calories - dailyTotals.calories, 0),
      protein: Math.max(goals.protein - dailyTotals.protein, 0),
      carbs: Math.max(goals.carbs - dailyTotals.carbs, 0),
      fats: Math.max(goals.fats - dailyTotals.fats, 0),
    };

    // Get AI suggestions
    const result = await claudeApi.getMealSuggestions(remaining, {
      dietary: userProfile?.preferences?.dietary,
      allergies: userProfile?.preferences?.allergies,
    });

    setLoadingSuggestions(false);

    if (result.success) {
      setSuggestions(result.data);
    } else {
      setError(result.error);
      setSuggestions([]);
    }
  };

  const handleSelectSuggestion = (suggestion) => {
    setMealDescription(suggestion.name);
    setParsedMeal({
      name: suggestion.name,
      calories: suggestion.calories,
      protein: suggestion.protein,
      carbs: suggestion.carbs,
      fats: suggestion.fats,
      confidence: 'high',
      suggestions: suggestion.description,
    });
    setSuggestions([]);
  };

  return (
    <ScrollView style={globalStyles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Log Your Meal</Text>
        <Text style={styles.subtitle}>
          Tell me what you ate and I'll track it! ✨
        </Text>
      </View>

      {/* Today's Progress Summary */}
      <GlowCard glowColor="cyan">
        <Text style={styles.cardTitle}>Today's Totals</Text>
        <View style={styles.totalsRow}>
          <View style={styles.totalItem}>
            <Text style={[styles.totalValue, { color: colors.neonCyan }]}>
              {dailyTotals.calories}
            </Text>
            <Text style={styles.totalLabel}>Calories</Text>
          </View>
          <View style={styles.totalItem}>
            <Text style={[styles.totalValue, { color: colors.neonPink }]}>
              {dailyTotals.protein}g
            </Text>
            <Text style={styles.totalLabel}>Protein</Text>
          </View>
          <View style={styles.totalItem}>
            <Text style={[styles.totalValue, { color: colors.neonYellow }]}>
              {dailyTotals.carbs}g
            </Text>
            <Text style={styles.totalLabel}>Carbs</Text>
          </View>
          <View style={styles.totalItem}>
            <Text style={[styles.totalValue, { color: colors.neonPurple }]}>
              {dailyTotals.fats}g
            </Text>
            <Text style={styles.totalLabel}>Fats</Text>
          </View>
        </View>
      </GlowCard>

      {/* Meal Input */}
      <GlowCard glowColor="pink">
        <RetroInput
          label="What did you eat?"
          value={mealDescription}
          onChangeText={setMealDescription}
          placeholder="e.g., Grilled chicken salad with avocado"
          multiline
          numberOfLines={3}
          glowColor="cyan"
        />

        {error && <Text style={styles.errorText}>{error}</Text>}

        <NeonButton
          title="Analyze Meal"
          onPress={handleParseMeal}
          loading={loading && !parsedMeal}
          variant="cyan"
          disabled={loading}
        />

        <View style={styles.divider} />

        <Text style={styles.orText}>OR</Text>

        <NeonButton
          title="Get AI Meal Suggestions 🤖"
          onPress={handleGetSuggestions}
          loading={loadingSuggestions}
          variant="purple"
          disabled={loading || loadingSuggestions}
        />
      </GlowCard>

      {/* AI Meal Suggestions */}
      {suggestions.length > 0 && (
        <GlowCard glowColor="purple" intensity="high">
          <Text style={styles.cardTitle}>🤖 AI Meal Suggestions</Text>
          <Text style={styles.suggestionsIntro}>
            Based on your remaining macros, here's what I recommend:
          </Text>

          {suggestions.map((suggestion, index) => (
            <TouchableOpacity
              key={index}
              style={styles.suggestionCard}
              onPress={() => handleSelectSuggestion(suggestion)}
              activeOpacity={0.7}
            >
              <View style={styles.suggestionHeader}>
                <Text style={styles.suggestionName}>{suggestion.name}</Text>
                <Text style={styles.tapHint}>Tap to use →</Text>
              </View>

              <Text style={styles.suggestionDescription}>
                {suggestion.description}
              </Text>

              <View style={styles.suggestionMacros}>
                <View style={styles.suggestionMacroItem}>
                  <Text style={[styles.suggestionMacroValue, { color: colors.neonCyan }]}>
                    {suggestion.calories}
                  </Text>
                  <Text style={styles.suggestionMacroLabel}>cal</Text>
                </View>

                <View style={styles.suggestionMacroItem}>
                  <Text style={[styles.suggestionMacroValue, { color: colors.neonPink }]}>
                    {suggestion.protein}g
                  </Text>
                  <Text style={styles.suggestionMacroLabel}>protein</Text>
                </View>

                <View style={styles.suggestionMacroItem}>
                  <Text style={[styles.suggestionMacroValue, { color: colors.neonYellow }]}>
                    {suggestion.carbs}g
                  </Text>
                  <Text style={styles.suggestionMacroLabel}>carbs</Text>
                </View>

                <View style={styles.suggestionMacroItem}>
                  <Text style={[styles.suggestionMacroValue, { color: colors.neonPurple }]}>
                    {suggestion.fats}g
                  </Text>
                  <Text style={styles.suggestionMacroLabel}>fats</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}

          <TouchableOpacity onPress={() => setSuggestions([])}>
            <Text style={styles.cancelText}>Close Suggestions</Text>
          </TouchableOpacity>
        </GlowCard>
      )}

      {/* Parsed Meal Preview */}
      {parsedMeal && (
        <GlowCard glowColor="green" intensity="high">
          <Text style={styles.cardTitle}>📊 Nutrition Breakdown</Text>

          <RetroInput
            label="Meal Name"
            value={parsedMeal.name}
            onChangeText={(value) => handleEditMeal('name', value)}
          />

          <View style={styles.macrosGrid}>
            <View style={styles.macroInput}>
              <RetroInput
                label="Calories"
                value={parsedMeal.calories?.toString()}
                onChangeText={(value) =>
                  handleEditMeal('calories', parseInt(value) || 0)
                }
                keyboardType="numeric"
              />
            </View>

            <View style={styles.macroInput}>
              <RetroInput
                label="Protein (g)"
                value={parsedMeal.protein?.toString()}
                onChangeText={(value) =>
                  handleEditMeal('protein', parseInt(value) || 0)
                }
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.macrosGrid}>
            <View style={styles.macroInput}>
              <RetroInput
                label="Carbs (g)"
                value={parsedMeal.carbs?.toString()}
                onChangeText={(value) =>
                  handleEditMeal('carbs', parseInt(value) || 0)
                }
                keyboardType="numeric"
              />
            </View>

            <View style={styles.macroInput}>
              <RetroInput
                label="Fats (g)"
                value={parsedMeal.fats?.toString()}
                onChangeText={(value) =>
                  handleEditMeal('fats', parseInt(value) || 0)
                }
                keyboardType="numeric"
              />
            </View>
          </View>

          {parsedMeal.suggestions && (
            <View style={styles.suggestionsBox}>
              <Text style={styles.suggestionsTitle}>💡 Suggestions:</Text>
              <Text style={styles.suggestionsText}>
                {parsedMeal.suggestions}
              </Text>
            </View>
          )}

          <NeonButton
            title={`Save Meal (+${POINTS.MEAL_LOG} pts)`}
            onPress={handleSaveMeal}
            loading={loading && parsedMeal}
            variant="gradient"
          />

          <TouchableOpacity onPress={() => setParsedMeal(null)}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </GlowCard>
      )}

      {/* Recent Meals */}
      <Text style={styles.sectionTitle}>Today's Meals</Text>
      {meals.length === 0 ? (
        <Text style={styles.emptyText}>No meals logged yet today</Text>
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
  totalsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalItem: {
    alignItems: 'center',
  },
  totalValue: {
    fontSize: fonts.lg,
    fontWeight: fonts.bold,
  },
  totalLabel: {
    fontSize: fonts.xs,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  errorText: {
    color: colors.error,
    fontSize: fonts.sm,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  macrosGrid: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  macroInput: {
    flex: 1,
  },
  suggestionsBox: {
    backgroundColor: colors.dark,
    padding: spacing.md,
    borderRadius: 8,
    marginBottom: spacing.md,
  },
  suggestionsTitle: {
    fontSize: fonts.md,
    fontWeight: fonts.bold,
    color: colors.neonYellow,
    marginBottom: spacing.xs,
  },
  suggestionsText: {
    fontSize: fonts.sm,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  cancelText: {
    color: colors.textSecondary,
    fontSize: fonts.md,
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
  emptyText: {
    color: colors.textSecondary,
    fontSize: fonts.md,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
  divider: {
    height: 1,
    backgroundColor: colors.dark,
    marginVertical: spacing.md,
  },
  orText: {
    fontSize: fonts.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  suggestionsIntro: {
    fontSize: fonts.sm,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    lineHeight: 20,
  },
  suggestionCard: {
    backgroundColor: colors.dark,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.neonPurple,
  },
  suggestionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  suggestionName: {
    fontSize: fonts.lg,
    fontWeight: fonts.bold,
    color: colors.neonPurple,
    flex: 1,
  },
  tapHint: {
    fontSize: fonts.xs,
    color: colors.neonCyan,
    fontStyle: 'italic',
  },
  suggestionDescription: {
    fontSize: fonts.sm,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    lineHeight: 20,
  },
  suggestionMacros: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  suggestionMacroItem: {
    alignItems: 'center',
  },
  suggestionMacroValue: {
    fontSize: fonts.md,
    fontWeight: fonts.bold,
  },
  suggestionMacroLabel: {
    fontSize: fonts.xs,
    color: colors.textTertiary,
    marginTop: spacing.xs,
  },
});

export default MealLoggingScreen;
