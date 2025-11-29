import { useState, useEffect } from 'react';
import firestoreService from '../services/firestoreService';

export const useWorkouts = (userId, limit = 20) => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchWorkouts = async () => {
      setLoading(true);
      const result = await firestoreService.getWorkouts(userId, limit);
      if (result.success) {
        setWorkouts(result.data);
      }
      setLoading(false);
    };

    fetchWorkouts();
  }, [userId, limit]);

  const addWorkout = async (workoutData) => {
    const result = await firestoreService.addWorkout(userId, workoutData);
    if (result.success) {
      // Refresh workouts
      const workoutsResult = await firestoreService.getWorkouts(userId, limit);
      if (workoutsResult.success) {
        setWorkouts(workoutsResult.data);
      }
    }
    return result;
  };

  return {
    workouts,
    loading,
    addWorkout,
  };
};

export default useWorkouts;
