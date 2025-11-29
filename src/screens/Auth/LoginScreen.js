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
import { colors, fonts, spacing } from '../../styles/theme';
import { globalStyles } from '../../styles/globalStyles';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError('');

    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }

    setLoading(true);
    const result = await firebaseAuth.signIn(email, password);
    setLoading(false);

    if (!result.success) {
      setError(result.error);
    }
    // Navigation handled by auth state listener in App.js
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your email to reset password');
      return;
    }

    setLoading(true);
    const result = await firebaseAuth.resetPassword(email);
    setLoading(false);

    if (result.success) {
      setError(''); // Clear any existing errors
      alert('Password reset email sent! Check your inbox.');
    } else {
      setError(result.error);
    }
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
            <Text style={styles.title}>FitRetro</Text>
            <Text style={styles.subtitle}>80s Fitness Reborn</Text>
          </View>

          {/* Login Form */}
          <View style={styles.form}>
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
              placeholder="Enter your password"
              secureTextEntry
              glowColor="pink"
            />

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <NeonButton
              title="Login"
              onPress={handleLogin}
              loading={loading}
              variant="gradient"
            />

            <TouchableOpacity onPress={handleForgotPassword}>
              <Text style={styles.forgotPassword}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          {/* Sign Up Link */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text style={styles.signupLink}>Sign Up</Text>
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
    marginBottom: spacing.xxl,
  },
  title: {
    fontSize: fonts.huge * 1.5,
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
  forgotPassword: {
    color: colors.neonCyan,
    fontSize: fonts.sm,
    textAlign: 'center',
    marginTop: spacing.sm,
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
  signupLink: {
    color: colors.neonPink,
    fontSize: fonts.md,
    fontWeight: fonts.bold,
  },
});

export default LoginScreen;
