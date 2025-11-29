import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { NeonButton, RetroInput, GlowCard } from '../../components/ui';
import AchievementBadge from '../../components/AchievementBadge';
import { useAuth } from '../../hooks/useAuth';
import firebaseAuth from '../../services/firebaseAuth';
import firestoreService from '../../services/firestoreService';
import claudeApi from '../../services/claudeApi';
import { getLevelInfo, ACHIEVEMENTS } from '../../utils/gamification';
import { colors, fonts, spacing } from '../../styles/theme';
import { globalStyles } from '../../styles/globalStyles';

const ProfileScreen = () => {
  const { user, userProfile, signOut } = useAuth();
  const [gamificationData, setGamificationData] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    const gamResult = await firestoreService.getGamificationData(user.uid);
    if (gamResult.success) {
      setGamificationData(gamResult.data);
    }

    const achResult = await firestoreService.getAchievements(user.uid);
    if (achResult.success) {
      setAchievements(achResult.data);
    }
  };

  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      claudeApi.initialize(apiKey.trim());
      Alert.alert('Success', 'Claude API key saved!');
      setShowApiKey(false);
    }
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: signOut,
        },
      ]
    );
  };

  const levelInfo = gamificationData
    ? getLevelInfo(gamificationData.points)
    : { level: 1, title: 'Beginner', progress: 0 };

  const unlockedAchievements = ACHIEVEMENTS.filter((ach) =>
    achievements.some((a) => a.id === ach.id)
  );

  return (
    <ScrollView style={globalStyles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{userProfile?.name || 'Trainer'}</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      {/* Level & Points */}
      <GlowCard glowColor="pink" intensity="high">
        <View style={styles.levelContainer}>
          <View>
            <Text style={styles.levelTitle}>Level {levelInfo.level}</Text>
            <Text style={styles.levelSubtitle}>{levelInfo.title}</Text>
          </View>
          <View style={styles.pointsBadge}>
            <Text style={styles.pointsValue}>{gamificationData?.points || 0}</Text>
            <Text style={styles.pointsLabel}>points</Text>
          </View>
        </View>

        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${levelInfo.progress}%` },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {levelInfo.pointsToNext} pts to next level
          </Text>
        </View>
      </GlowCard>

      {/* Achievements */}
      <GlowCard glowColor="cyan">
        <Text style={styles.cardTitle}>
          Achievements ({unlockedAchievements.length}/{ACHIEVEMENTS.length})
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.achievementsContainer}>
            {ACHIEVEMENTS.map((achievement) => {
              const unlocked = achievements.some((a) => a.id === achievement.id);
              return (
                <AchievementBadge
                  key={achievement.id}
                  achievement={achievement}
                  unlocked={unlocked}
                  size="medium"
                />
              );
            })}
          </View>
        </ScrollView>
      </GlowCard>

      {/* API Key Settings */}
      <GlowCard glowColor="purple">
        <Text style={styles.cardTitle}>Claude API Settings</Text>
        <Text style={styles.settingsDescription}>
          Add your Claude API key to enable AI-powered meal logging
        </Text>

        {!showApiKey ? (
          <NeonButton
            title="Configure API Key"
            onPress={() => setShowApiKey(true)}
            variant="purple"
          />
        ) : (
          <>
            <RetroInput
              label="API Key"
              value={apiKey}
              onChangeText={setApiKey}
              placeholder="sk-ant-..."
              secureTextEntry={true}
              glowColor="purple"
            />
            <NeonButton
              title="Save API Key"
              onPress={handleSaveApiKey}
              variant="gradient"
            />
            <TouchableOpacity onPress={() => setShowApiKey(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </>
        )}
      </GlowCard>

      {/* Account */}
      <GlowCard glowColor="pink">
        <Text style={styles.cardTitle}>Account</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Email:</Text>
          <Text style={styles.infoValue}>{user?.email}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Member Since:</Text>
          <Text style={styles.infoValue}>
            {new Date(user?.metadata?.creationTime).toLocaleDateString()}
          </Text>
        </View>
      </GlowCard>

      {/* Sign Out Button */}
      <NeonButton
        title="Sign Out"
        onPress={handleSignOut}
        variant="pink"
      />

      <View style={styles.footer}>
        <Text style={styles.footerText}>FitRetro v1.0</Text>
        <Text style={styles.footerText}>Made with 💙 in the 80s</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: spacing.md,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: fonts.xxxl,
    fontWeight: fonts.bold,
    color: colors.neonCyan,
    textShadowColor: colors.neonCyan,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
    marginBottom: spacing.xs,
  },
  email: {
    fontSize: fonts.md,
    color: colors.textSecondary,
  },
  levelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  levelTitle: {
    fontSize: fonts.xxl,
    fontWeight: fonts.bold,
    color: colors.neonPink,
  },
  levelSubtitle: {
    fontSize: fonts.md,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  pointsBadge: {
    alignItems: 'center',
  },
  pointsValue: {
    fontSize: fonts.xxxl,
    fontWeight: fonts.bold,
    color: colors.neonCyan,
  },
  pointsLabel: {
    fontSize: fonts.sm,
    color: colors.textSecondary,
  },
  progressBarContainer: {
    marginTop: spacing.sm,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: colors.dark,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.neonPink,
  },
  progressText: {
    fontSize: fonts.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  cardTitle: {
    fontSize: fonts.lg,
    fontWeight: fonts.bold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  achievementsContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  settingsDescription: {
    fontSize: fonts.sm,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    lineHeight: 20,
  },
  cancelText: {
    color: colors.textSecondary,
    fontSize: fonts.md,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  infoLabel: {
    fontSize: fonts.md,
    color: colors.textSecondary,
  },
  infoValue: {
    fontSize: fonts.md,
    color: colors.textPrimary,
    fontWeight: fonts.medium,
  },
  footer: {
    alignItems: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
  },
  footerText: {
    fontSize: fonts.sm,
    color: colors.textTertiary,
    marginTop: spacing.xs,
  },
});

export default ProfileScreen;
