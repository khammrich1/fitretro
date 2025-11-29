import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { NeonButton, RetroInput } from '../../components/ui';
import firebaseAuth from '../../services/firebaseAuth';
import firestoreService from '../../services/firestoreService';
import { colors, fonts, spacing } from '../../styles/theme';
import { globalStyles } from '../../styles/globalStyles';

const SignupScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    setError('');

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    // Create auth account
    const authResult = await firebaseAuth.signUp(email, password, name);

    if (!authResult.success) {
      setLoading(false);
      setError(authResult.error);
      return;
    }

    // Create user profile in Firestore
    const profileResult = await firestoreService.createUserProfile(
      authResult.user.uid,
      {
        name,
        email,
        goals: {
          calories: 2000,
          protein: 150,
          carbs: 200,
          fats: 65,
        },
        preferences: {
          activityLevel: 'moderate',
        },
      }
    );

    // Initialize gamification data
    await firestoreService.updateGamificationData(authResult.user.uid, {
      points: 0,
      level: 1,
      streaks: {
        daily: 0,
        workout: 0,
        meal: 0,
      },
      lastLoginDate: new Date().toISOString(),
    });

    setLoading(false);

    if (!profileResult.success) {
      setError('Account created but profile setup failed');
    }
    // Navigation handled by auth state listener in App.js
  };

  return (
    <KeyboardAvoidingView
      style={globalStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          {/* Logo/Title */}
          <View style={styles.header}>
            <Text style={styles.title}>Join FitRetro</Text>
            <Text style={styles.subtitle}>Start Your Fitness Journey</Text>
          </View>

          {/* Signup Form */}
          <View style={styles.form}>
            <RetroInput
              label="Name"
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
              glowColor="purple"
            />

            <RetroInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              glowColor="cyan"
            />

            <RetroInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Create a password"
              secureTextEntry
              glowColor="pink"
            />

            <RetroInput
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm your password"
              secureTextEntry
              glowColor="pink"
            />

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <NeonButton
              title="Sign Up"
              onPress={handleSignup}
              loading={loading}
              variant="gradient"
            />
          </View>

          {/* Login Link */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: fonts.huge,
    fontWeight: fonts.extrabold,
    color: colors.neonPink,
    textShadowColor: colors.neonPink,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: fonts.lg,
    color: colors.neonCyan,
    textShadowColor: colors.neonCyan,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  form: {
    marginBottom: spacing.xl,
  },
  errorText: {
    color: colors.error,
    fontSize: fonts.sm,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.sm,
  },
  footerText: {
    color: colors.textSecondary,
    fontSize: fonts.md,
  },
  loginLink: {
    color: colors.neonPink,
    fontSize: fonts.md,
    fontWeight: fonts.bold,
  },
});

export default SignupScreen;
