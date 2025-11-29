import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Auth Screens
import LoginScreen from '../screens/Auth/LoginScreen';
import SignupScreen from '../screens/Auth/SignupScreen';

// Main Screens
import DashboardScreen from '../screens/Home/DashboardScreen';
import MealLoggingScreen from '../screens/Meals/MealLoggingScreen';
import MealHistoryScreen from '../screens/Meals/MealHistoryScreen';
import WorkoutScreen from '../screens/Workouts/WorkoutScreen';
import ExerciseLibraryScreen from '../screens/Workouts/ExerciseLibraryScreen';
import GoalsScreen from '../screens/Goals/GoalsScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';

import { colors } from '../styles/theme';
import { useAuth } from '../hooks/useAuth';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Auth Stack
const AuthStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      contentStyle: { backgroundColor: colors.darkest },
    }}
  >
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Signup" component={SignupScreen} />
  </Stack.Navigator>
);

// Main Tab Navigator
const MainTabs = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarStyle: {
        backgroundColor: colors.darker,
        borderTopWidth: 1,
        borderTopColor: colors.neonCyan,
        height: 60,
        paddingBottom: 8,
      },
      tabBarActiveTintColor: colors.neonPink,
      tabBarInactiveTintColor: colors.textSecondary,
      tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: '600',
      },
    }}
  >
    <Tab.Screen
      name="Dashboard"
      component={DashboardScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Icon name="view-dashboard" size={size} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="Meals"
      component={MealLoggingScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Icon name="food-apple" size={size} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="Workouts"
      component={WorkoutScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Icon name="dumbbell" size={size} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="Goals"
      component={GoalsScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Icon name="target" size={size} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Icon name="account" size={size} color={color} />
        ),
      }}
    />
  </Tab.Navigator>
);

// Root Navigator
const AppNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) {
    // You can add a loading screen here
    return null;
  }

  return (
    <NavigationContainer>
      {user ? <MainTabs /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default AppNavigator;
