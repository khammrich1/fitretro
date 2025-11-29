/**
 * Gamification utilities for points, levels, streaks, and achievements
 */

// Points configuration
export const POINTS = {
  MEAL_LOG: 10,
  WORKOUT_COMPLETE: 25,
  DAILY_GOAL_MET: 50,
  WEEKLY_GOAL_MET: 100,
  STREAK_MILESTONE: 50,
  ACHIEVEMENT_UNLOCK: 100,
};

// Level configuration
export const LEVELS = [
  { level: 1, pointsRequired: 0, title: 'Beginner' },
  { level: 2, pointsRequired: 100, title: 'Novice' },
  { level: 3, pointsRequired: 250, title: 'Apprentice' },
  { level: 4, pointsRequired: 500, title: 'Intermediate' },
  { level: 5, pointsRequired: 1000, title: 'Advanced' },
  { level: 6, pointsRequired: 2000, title: 'Expert' },
  { level: 7, pointsRequired: 4000, title: 'Master' },
  { level: 8, pointsRequired: 7000, title: 'Champion' },
  { level: 9, pointsRequired: 12000, title: 'Legend' },
  { level: 10, pointsRequired: 20000, title: 'Mythic' },
];

// Achievement definitions
export const ACHIEVEMENTS = [
  {
    id: 'first_meal',
    name: 'First Meal',
    description: 'Log your first meal',
    icon: '🍽️',
    condition: (stats) => stats.totalMeals >= 1,
    points: 50,
  },
  {
    id: 'first_workout',
    name: 'First Workout',
    description: 'Complete your first workout',
    icon: '💪',
    condition: (stats) => stats.totalWorkouts >= 1,
    points: 50,
  },
  {
    id: 'week_warrior',
    name: 'Week Warrior',
    description: '7-day workout streak',
    icon: '🔥',
    condition: (stats) => stats.workoutStreak >= 7,
    points: 100,
  },
  {
    id: 'nutrition_ninja',
    name: 'Nutrition Ninja',
    description: 'Hit nutrition goals 30 days straight',
    icon: '🥷',
    condition: (stats) => stats.goalStreak >= 30,
    points: 200,
  },
  {
    id: 'level_5',
    name: 'Rising Star',
    description: 'Reach level 5',
    icon: '⭐',
    condition: (stats) => stats.level >= 5,
    points: 100,
  },
  {
    id: 'level_10',
    name: 'Fitness Legend',
    description: 'Reach level 10',
    icon: '👑',
    condition: (stats) => stats.level >= 10,
    points: 200,
  },
  {
    id: 'meal_master',
    name: 'Meal Master',
    description: 'Log 100 meals',
    icon: '🎯',
    condition: (stats) => stats.totalMeals >= 100,
    points: 150,
  },
  {
    id: 'workout_warrior',
    name: 'Workout Warrior',
    description: 'Complete 50 workouts',
    icon: '🏆',
    condition: (stats) => stats.totalWorkouts >= 50,
    points: 150,
  },
  {
    id: 'early_bird',
    name: 'Early Bird',
    description: 'Log a workout before 7 AM',
    icon: '🌅',
    condition: (stats) => stats.hasEarlyWorkout,
    points: 75,
  },
  {
    id: 'night_owl',
    name: 'Night Owl',
    description: 'Log a workout after 9 PM',
    icon: '🌙',
    condition: (stats) => stats.hasLateWorkout,
    points: 75,
  },
  {
    id: 'perfect_week',
    name: 'Perfect Week',
    description: 'Hit all daily goals for 7 days',
    icon: '💯',
    condition: (stats) => stats.perfectWeek,
    points: 250,
  },
  {
    id: 'protein_power',
    name: 'Protein Power',
    description: 'Meet protein goals 14 days in a row',
    icon: '🥩',
    condition: (stats) => stats.proteinStreak >= 14,
    points: 100,
  },
];

// Calculate level from points
export const calculateLevel = (points) => {
  let currentLevel = 1;
  for (const levelData of LEVELS) {
    if (points >= levelData.pointsRequired) {
      currentLevel = levelData.level;
    } else {
      break;
    }
  }
  return currentLevel;
};

// Get level info
export const getLevelInfo = (points) => {
  const currentLevel = calculateLevel(points);
  const currentLevelData = LEVELS.find(l => l.level === currentLevel);
  const nextLevelData = LEVELS.find(l => l.level === currentLevel + 1);

  if (!nextLevelData) {
    // Max level reached
    return {
      level: currentLevel,
      title: currentLevelData.title,
      progress: 100,
      pointsToNext: 0,
      isMaxLevel: true,
    };
  }

  const pointsIntoLevel = points - currentLevelData.pointsRequired;
  const pointsNeededForNext = nextLevelData.pointsRequired - currentLevelData.pointsRequired;
  const progress = (pointsIntoLevel / pointsNeededForNext) * 100;

  return {
    level: currentLevel,
    title: currentLevelData.title,
    progress: Math.min(progress, 100),
    pointsToNext: nextLevelData.pointsRequired - points,
    isMaxLevel: false,
  };
};

// Calculate streak
export const calculateStreak = (lastDate, currentDate = new Date()) => {
  if (!lastDate) return 0;

  const last = new Date(lastDate);
  const current = new Date(currentDate);

  // Reset time to compare dates only
  last.setHours(0, 0, 0, 0);
  current.setHours(0, 0, 0, 0);

  const diffTime = current.getTime() - last.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
};

// Check if streak should continue
export const shouldContinueStreak = (lastDate) => {
  const daysSince = calculateStreak(lastDate);
  return daysSince <= 1; // Same day or next day
};

// Check and unlock achievements
export const checkAchievements = (stats, unlockedIds = []) => {
  const newAchievements = [];

  for (const achievement of ACHIEVEMENTS) {
    // Skip if already unlocked
    if (unlockedIds.includes(achievement.id)) {
      continue;
    }

    // Check condition
    if (achievement.condition(stats)) {
      newAchievements.push(achievement);
    }
  }

  return newAchievements;
};

// Calculate points for an action
export const calculatePoints = (action, multiplier = 1) => {
  const basePoints = POINTS[action] || 0;
  return Math.floor(basePoints * multiplier);
};

// Get streak emoji
export const getStreakEmoji = (streak) => {
  if (streak >= 30) return '🔥🔥🔥';
  if (streak >= 7) return '🔥🔥';
  if (streak >= 1) return '🔥';
  return '❄️';
};

export default {
  POINTS,
  LEVELS,
  ACHIEVEMENTS,
  calculateLevel,
  getLevelInfo,
  calculateStreak,
  shouldContinueStreak,
  checkAchievements,
  calculatePoints,
  getStreakEmoji,
};
