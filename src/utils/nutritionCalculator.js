/**
 * Nutrition calculation utilities
 */

// Calculate BMR (Basal Metabolic Rate) using Mifflin-St Jeor Equation
export const calculateBMR = (weight, height, age, gender) => {
  // weight in kg, height in cm
  if (gender === 'male') {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    return 10 * weight + 6.25 * height - 5 * age - 161;
  }
};

// Calculate TDEE (Total Daily Energy Expenditure)
export const calculateTDEE = (bmr, activityLevel) => {
  const multipliers = {
    sedentary: 1.2, // Little or no exercise
    light: 1.375, // Light exercise 1-3 days/week
    moderate: 1.55, // Moderate exercise 3-5 days/week
    active: 1.725, // Hard exercise 6-7 days/week
    veryActive: 1.9, // Very hard exercise, physical job
  };

  return bmr * (multipliers[activityLevel] || multipliers.moderate);
};

// Calculate recommended macros based on goals
export const calculateMacros = (tdee, goal, preferences = {}) => {
  let calories = tdee;
  let proteinRatio = 0.3;
  let carbsRatio = 0.4;
  let fatsRatio = 0.3;

  // Adjust calories based on goal
  switch (goal) {
    case 'lose':
      calories = tdee * 0.85; // 15% deficit
      proteinRatio = 0.35;
      carbsRatio = 0.35;
      fatsRatio = 0.3;
      break;
    case 'gain':
      calories = tdee * 1.1; // 10% surplus
      proteinRatio = 0.3;
      carbsRatio = 0.45;
      fatsRatio = 0.25;
      break;
    case 'maintain':
    default:
      calories = tdee;
      break;
  }

  // Apply custom ratios if provided
  if (preferences.proteinRatio) proteinRatio = preferences.proteinRatio;
  if (preferences.carbsRatio) carbsRatio = preferences.carbsRatio;
  if (preferences.fatsRatio) fatsRatio = preferences.fatsRatio;

  // Calculate macros in grams
  const protein = Math.round((calories * proteinRatio) / 4); // 4 cal/g
  const carbs = Math.round((calories * carbsRatio) / 4); // 4 cal/g
  const fats = Math.round((calories * fatsRatio) / 9); // 9 cal/g

  return {
    calories: Math.round(calories),
    protein,
    carbs,
    fats,
  };
};

// Calculate macro totals for a day
export const calculateDailyTotals = (meals) => {
  return meals.reduce(
    (totals, meal) => ({
      calories: totals.calories + (meal.calories || 0),
      protein: totals.protein + (meal.protein || 0),
      carbs: totals.carbs + (meal.carbs || 0),
      fats: totals.fats + (meal.fats || 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fats: 0 }
  );
};

// Calculate progress towards goals
export const calculateProgress = (current, goal) => {
  if (!goal || goal === 0) return 0;
  return Math.min(Math.round((current / goal) * 100), 100);
};

// Calculate remaining macros
export const calculateRemaining = (current, goal) => {
  return {
    calories: Math.max(goal.calories - current.calories, 0),
    protein: Math.max(goal.protein - current.protein, 0),
    carbs: Math.max(goal.carbs - current.carbs, 0),
    fats: Math.max(goal.fats - current.fats, 0),
  };
};

// Check if goals are met
export const areGoalsMet = (current, goal, tolerance = 0.05) => {
  const caloriesInRange =
    current.calories >= goal.calories * (1 - tolerance) &&
    current.calories <= goal.calories * (1 + tolerance);

  const proteinMet = current.protein >= goal.protein * (1 - tolerance);
  const carbsInRange =
    current.carbs >= goal.carbs * (1 - tolerance) &&
    current.carbs <= goal.carbs * (1 + tolerance);
  const fatsInRange =
    current.fats >= goal.fats * (1 - tolerance) &&
    current.fats <= goal.fats * (1 + tolerance);

  return {
    allMet: caloriesInRange && proteinMet && carbsInRange && fatsInRange,
    caloriesInRange,
    proteinMet,
    carbsInRange,
    fatsInRange,
  };
};

// Get nutrition status message
export const getNutritionStatus = (current, goal) => {
  const progress = calculateProgress(current.calories, goal.calories);

  if (progress < 50) {
    return { message: 'Just getting started!', color: '#00f5ff' };
  } else if (progress < 75) {
    return { message: 'Making progress!', color: '#fbf236' };
  } else if (progress < 95) {
    return { message: 'Almost there!', color: '#ff006e' };
  } else if (progress >= 95 && progress <= 105) {
    return { message: 'Perfect! Goals met!', color: '#05ffa1' };
  } else {
    return { message: 'Over your goal', color: '#ff006e' };
  }
};

// Calculate weekly averages
export const calculateWeeklyAverages = (dailyData) => {
  if (!dailyData || dailyData.length === 0) {
    return { calories: 0, protein: 0, carbs: 0, fats: 0 };
  }

  const totals = dailyData.reduce(
    (acc, day) => ({
      calories: acc.calories + day.calories,
      protein: acc.protein + day.protein,
      carbs: acc.carbs + day.carbs,
      fats: acc.fats + day.fats,
    }),
    { calories: 0, protein: 0, carbs: 0, fats: 0 }
  );

  const days = dailyData.length;

  return {
    calories: Math.round(totals.calories / days),
    protein: Math.round(totals.protein / days),
    carbs: Math.round(totals.carbs / days),
    fats: Math.round(totals.fats / days),
  };
};

export default {
  calculateBMR,
  calculateTDEE,
  calculateMacros,
  calculateDailyTotals,
  calculateProgress,
  calculateRemaining,
  areGoalsMet,
  getNutritionStatus,
  calculateWeeklyAverages,
};
