import { useState, useEffect } from 'react';
import firestoreService from '../services/firestoreService';
import { getStartOfDay, getEndOfDay } from '../utils/dateHelpers';
import { calculateDailyTotals } from '../utils/nutritionCalculator';

export const useMeals = (userId, date = new Date()) => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dailyTotals, setDailyTotals] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
  });

  useEffect(() => {
    if (!userId) return;

    const fetchMeals = async () => {
      setLoading(true);
      const startDate = getStartOfDay(date);
      const endDate = getEndOfDay(date);

      const result = await firestoreService.getMealsByDate(
        userId,
        startDate,
        endDate
      );

      if (result.success) {
        setMeals(result.data);
        setDailyTotals(calculateDailyTotals(result.data));
      }
      setLoading(false);
    };

    fetchMeals();
  }, [userId, date]);

  const addMeal = async (mealData) => {
    const result = await firestoreService.addMeal(userId, mealData);
    if (result.success) {
      // Refresh meals
      const startDate = getStartOfDay(date);
      const endDate = getEndOfDay(date);
      const mealsResult = await firestoreService.getMealsByDate(
        userId,
        startDate,
        endDate
      );
      if (mealsResult.success) {
        setMeals(mealsResult.data);
        setDailyTotals(calculateDailyTotals(mealsResult.data));
      }
    }
    return result;
  };

  return {
    meals,
    dailyTotals,
    loading,
    addMeal,
  };
};

export default useMeals;
