import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { NeonButton, RetroInput, GlowCard } from '../../components/ui';
import WorkoutCard from '../../components/WorkoutCard';
import { useAuth } from '../../hooks/useAuth';
import { useWorkouts } from '../../hooks/useWorkouts';
import firestoreService from '../../services/firestoreService';
import { calculatePoints, POINTS } from '../../utils/gamification';
import { colors, fonts, spacing } from '../../styles/theme';
import { globalStyles } from '../../styles/globalStyles';

const WorkoutScreen = ({ navigation }) => {
  const { user } = useAuth();
  const { workouts, addWorkout } = useWorkouts(user?.uid);
  const [showModal, setShowModal] = useState(false);
  const [workoutName, setWorkoutName] = useState('');
  const [workoutType, setWorkoutType] = useState('strength');
  const [duration, setDuration] = useState('');
  const [loading, setLoading] = useState(false);

  const workoutTypes = [
    { value: 'strength', label: 'Strength', color: colors.neonPink },
    { value: 'cardio', label: 'Cardio', color: colors.neonCyan },
    { value: 'flexibility', label: 'Flexibility', color: colors.neonPurple },
    { value: 'other', label: 'Other', color: colors.neonGreen },
  ];

  const handleSaveWorkout = async () => {
    if (!workoutName || !duration) {
      return;
    }

    setLoading(true);

    const result = await addWorkout({
      name: workoutName,
      type: workoutType,
      duration: parseInt(duration),
      exercises: [],
      timestamp: new Date().toISOString(),
    });

    if (result.success) {
      // Award points
      const points = calculatePoints('WORKOUT_COMPLETE');
      const gamificationResult = await firestoreService.getGamificationData(
        user.uid
      );

      if (gamificationResult.success) {
        const currentPoints = gamificationResult.data.points || 0;
        await firestoreService.updateGamificationData(user.uid, {
          points: currentPoints + points,
          streaks: {
            ...gamificationResult.data.streaks,
            workout: (gamificationResult.data.streaks?.workout || 0) + 1,
          },
        });
      }

      // Reset form
      setWorkoutName('');
      setDuration('');
      setWorkoutType('strength');
      setShowModal(false);
    }

    setLoading(false);
  };

  return (
    <ScrollView style={globalStyles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Workouts</Text>
        <Text style={styles.subtitle}>Track your fitness journey 💪</Text>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsRow}>
        <GlowCard glowColor="pink" style={styles.statCard}>
          <Text style={styles.statValue}>{workouts.length}</Text>
          <Text style={styles.statLabel}>Total Workouts</Text>
        </GlowCard>

        <GlowCard glowColor="cyan" style={styles.statCard}>
          <Text style={styles.statValue}>
            {workouts.reduce((sum, w) => sum + (w.duration || 0), 0)}
          </Text>
          <Text style={styles.statLabel}>Total Minutes</Text>
        </GlowCard>
      </View>

      {/* Add Workout Button */}
      <NeonButton
        title="Log New Workout"
        onPress={() => setShowModal(true)}
        variant="gradient"
      />

      {/* Workouts List */}
      <Text style={styles.sectionTitle}>Recent Workouts</Text>
      {workouts.length === 0 ? (
        <GlowCard glowColor="purple">
          <Text style={styles.emptyText}>
            No workouts logged yet. Start your fitness journey today!
          </Text>
        </GlowCard>
      ) : (
        workouts.map((workout) => (
          <WorkoutCard key={workout.id} workout={workout} onPress={() => {}} />
        ))
      )}

      {/* Add Workout Modal */}
      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Log Workout</Text>

            <RetroInput
              label="Workout Name"
              value={workoutName}
              onChangeText={setWorkoutName}
              placeholder="e.g., Morning Run, Leg Day"
            />

            <Text style={styles.inputLabel}>Workout Type</Text>
            <View style={styles.typeSelector}>
              {workoutTypes.map((type) => (
                <TouchableOpacity
                  key={type.value}
                  style={[
                    styles.typeButton,
                    workoutType === type.value && {
                      backgroundColor: type.color,
                      borderColor: type.color,
                    },
                  ]}
                  onPress={() => setWorkoutType(type.value)}
                >
                  <Text
                    style={[
                      styles.typeButtonText,
                      workoutType === type.value && styles.typeButtonTextActive,
                    ]}
                  >
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <RetroInput
              label="Duration (minutes)"
              value={duration}
              onChangeText={setDuration}
              placeholder="30"
              keyboardType="numeric"
            />

            <NeonButton
              title={`Save Workout (+${POINTS.WORKOUT_COMPLETE} pts)`}
              onPress={handleSaveWorkout}
              loading={loading}
              variant="pink"
            />

            <TouchableOpacity onPress={() => setShowModal(false)}>
              <Text style={styles.cancelButton}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
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
  sectionTitle: {
    fontSize: fonts.xl,
    fontWeight: fonts.bold,
    color: colors.neonCyan,
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: fonts.md,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  modalContent: {
    backgroundColor: colors.darker,
    borderRadius: 16,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.neonCyan,
  },
  modalTitle: {
    fontSize: fonts.xxl,
    fontWeight: fonts.bold,
    color: colors.neonCyan,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  inputLabel: {
    fontSize: fonts.md,
    fontWeight: fonts.medium,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  typeSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  typeButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.textTertiary,
    backgroundColor: colors.dark,
  },
  typeButtonText: {
    color: colors.textSecondary,
    fontSize: fonts.sm,
    fontWeight: fonts.medium,
  },
  typeButtonTextActive: {
    color: colors.textPrimary,
    fontWeight: fonts.bold,
  },
  cancelButton: {
    color: colors.textSecondary,
    fontSize: fonts.md,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
});

export default WorkoutScreen;
