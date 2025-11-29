import firestore from '@react-native-firebase/firestore';
import { getCurrentTimestamp } from '../utils/dateHelpers';

class FirestoreService {
  // User Profile Operations
  async createUserProfile(userId, profileData) {
    try {
      await firestore()
        .collection('users')
        .doc(userId)
        .set({
          ...profileData,
          createdAt: getCurrentTimestamp(),
          updatedAt: getCurrentTimestamp(),
        });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getUserProfile(userId) {
    try {
      const doc = await firestore()
        .collection('users')
        .doc(userId)
        .get();

      if (doc.exists) {
        return { success: true, data: doc.data() };
      }
      return { success: false, error: 'Profile not found' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async updateUserProfile(userId, updates) {
    try {
      await firestore()
        .collection('users')
        .doc(userId)
        .update({
          ...updates,
          updatedAt: getCurrentTimestamp(),
        });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Meal Operations
  async addMeal(userId, mealData) {
    try {
      const mealRef = await firestore()
        .collection('users')
        .doc(userId)
        .collection('meals')
        .add({
          ...mealData,
          timestamp: getCurrentTimestamp(),
        });

      return { success: true, id: mealRef.id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getMeals(userId, limit = 20) {
    try {
      const snapshot = await firestore()
        .collection('users')
        .doc(userId)
        .collection('meals')
        .orderBy('timestamp', 'desc')
        .limit(limit)
        .get();

      const meals = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      return { success: true, data: meals };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getMealsByDate(userId, startDate, endDate) {
    try {
      const snapshot = await firestore()
        .collection('users')
        .doc(userId)
        .collection('meals')
        .where('timestamp', '>=', startDate)
        .where('timestamp', '<=', endDate)
        .orderBy('timestamp', 'desc')
        .get();

      const meals = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      return { success: true, data: meals };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Workout Operations
  async addWorkout(userId, workoutData) {
    try {
      const workoutRef = await firestore()
        .collection('users')
        .doc(userId)
        .collection('workouts')
        .add({
          ...workoutData,
          timestamp: getCurrentTimestamp(),
        });

      return { success: true, id: workoutRef.id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getWorkouts(userId, limit = 20) {
    try {
      const snapshot = await firestore()
        .collection('users')
        .doc(userId)
        .collection('workouts')
        .orderBy('timestamp', 'desc')
        .limit(limit)
        .get();

      const workouts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      return { success: true, data: workouts };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Gamification Operations
  async getGamificationData(userId) {
    try {
      const doc = await firestore()
        .collection('users')
        .doc(userId)
        .collection('gamification')
        .doc('stats')
        .get();

      if (doc.exists) {
        return { success: true, data: doc.data() };
      }

      // Initialize if doesn't exist
      const initialData = {
        points: 0,
        level: 1,
        streaks: {
          daily: 0,
          workout: 0,
          meal: 0,
        },
        lastLoginDate: getCurrentTimestamp(),
      };

      await this.updateGamificationData(userId, initialData);
      return { success: true, data: initialData };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async updateGamificationData(userId, data) {
    try {
      await firestore()
        .collection('users')
        .doc(userId)
        .collection('gamification')
        .doc('stats')
        .set(data, { merge: true });

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Achievement Operations
  async getAchievements(userId) {
    try {
      const snapshot = await firestore()
        .collection('users')
        .doc(userId)
        .collection('achievements')
        .get();

      const achievements = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      return { success: true, data: achievements };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async unlockAchievement(userId, achievementId, achievementData) {
    try {
      await firestore()
        .collection('users')
        .doc(userId)
        .collection('achievements')
        .doc(achievementId)
        .set({
          ...achievementData,
          unlocked: true,
          unlockedAt: getCurrentTimestamp(),
        });

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Real-time listeners
  subscribeToUserProfile(userId, callback) {
    return firestore()
      .collection('users')
      .doc(userId)
      .onSnapshot(
        doc => {
          if (doc.exists) {
            callback({ success: true, data: doc.data() });
          }
        },
        error => {
          callback({ success: false, error: error.message });
        }
      );
  }

  subscribeToGamification(userId, callback) {
    return firestore()
      .collection('users')
      .doc(userId)
      .collection('gamification')
      .doc('stats')
      .onSnapshot(
        doc => {
          if (doc.exists) {
            callback({ success: true, data: doc.data() });
          }
        },
        error => {
          callback({ success: false, error: error.message });
        }
      );
  }
}

export default new FirestoreService();
