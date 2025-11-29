# FitRetro - 80s Retrowave Fitness Tracker 🌴✨

FitRetro is an AI-powered personal trainer app that combines fitness tracking with an 80s retrowave aesthetic. Track your meals with AI assistance, log workouts, set nutrition goals, and level up with our gamification system!

## Features ✨

### 🍽️ AI-Powered Meal Logging
- Natural language meal input powered by Claude API
- Automatic nutrition calculation (calories, protein, carbs, fats)
- Meal history and daily tracking
- Smart meal suggestions

### 💪 Workout Tracking
- Log workouts with custom exercises
- Track duration and workout types (strength, cardio, flexibility)
- Workout history and statistics
- Exercise library (coming soon)

### 🎯 Nutrition Goals
- Set personalized daily macro targets
- Real-time progress tracking
- Visual progress rings
- Goal editing and customization

### 🎮 Gamification System
- **Points**: Earn points for logging meals, workouts, and hitting goals
- **Levels**: Progress through 10 levels from Beginner to Mythic
- **Streaks**: Daily, workout, and meal logging streaks
- **Achievements**: Unlock 12+ achievements as you progress

### 🎨 80s Retrowave Aesthetic
- Neon pink, cyan, and purple color scheme
- Glowing UI components
- Retro typography and styling
- Smooth animations

## Tech Stack 🛠️

- **React Native 0.76.1** - Mobile app framework
- **Firebase** - Authentication and Firestore database
- **Claude API** - AI-powered meal recognition
- **React Navigation** - Navigation system
- **React Native Vector Icons** - Icon library
- **React Native SVG** - Vector graphics
- **React Native Linear Gradient** - Gradient effects

## Prerequisites 📋

Before you begin, ensure you have:

- Node.js v18 or higher (v22.21.1 recommended)
- npm v10 or higher
- Java 17 (for Android development)
- Android Studio with Android SDK
- An Android device or emulator

## Installation 🚀

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd fitretro
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Firebase

FitRetro uses Firebase for authentication and data storage. You need to set up your own Firebase project:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use existing project ID: `firretro-837f2`
3. Enable Authentication with Email/Password provider
4. Create a Firestore database
5. Download `google-services.json` from your Firebase project settings
6. Replace the file at `android/app/google-services.json` with your downloaded file

**Important**: The current `google-services.json` is a template. You must replace it with your actual Firebase configuration file.

### 4. Configure Claude API (Optional)

For AI-powered meal logging, you'll need a Claude API key:

1. Sign up at [Anthropic Console](https://console.anthropic.com/)
2. Generate an API key
3. In the app, go to Profile → Claude API Settings
4. Enter your API key

**Note**: Without a Claude API key, meal logging will not work. This feature can be disabled if needed.

### 5. Install Gradle Wrapper (if needed)

```bash
cd android
chmod +x gradlew
cd ..
```

## Running the App 🏃

### Start Metro Bundler

```bash
npm start
```

### Run on Android

In a new terminal:

```bash
npm run android
```

Or manually:

```bash
cd android
./gradlew app:installDebug
cd ..
npx react-native run-android
```

## Project Structure 📁

```
FitRetro/
├── android/                 # Android native code
├── src/
│   ├── components/
│   │   ├── ui/             # Reusable UI components
│   │   │   ├── NeonButton.js
│   │   │   ├── GlowCard.js
│   │   │   ├── RetroInput.js
│   │   │   └── ProgressRing.js
│   │   ├── MealCard.js
│   │   ├── WorkoutCard.js
│   │   ├── AchievementBadge.js
│   │   └── StreakCounter.js
│   ├── screens/
│   │   ├── Auth/           # Login & Signup
│   │   ├── Home/           # Dashboard
│   │   ├── Meals/          # Meal logging & history
│   │   ├── Workouts/       # Workout tracking
│   │   ├── Goals/          # Nutrition goals
│   │   └── Profile/        # User profile
│   ├── services/
│   │   ├── claudeApi.js    # Claude API integration
│   │   ├── firebaseAuth.js # Firebase authentication
│   │   └── firestoreService.js # Firestore operations
│   ├── navigation/
│   │   └── AppNavigator.js # React Navigation setup
│   ├── utils/
│   │   ├── gamification.js # Points, levels, achievements
│   │   ├── nutritionCalculator.js
│   │   └── dateHelpers.js
│   ├── styles/
│   │   ├── theme.js        # Colors, fonts, spacing
│   │   └── globalStyles.js
│   └── hooks/
│       ├── useAuth.js
│       ├── useMeals.js
│       └── useWorkouts.js
├── App.tsx                 # Entry point
├── package.json
└── README.md
```

## Firestore Data Structure 📊

```
users/
  └── {userId}/
      ├── profile
      │   ├── name
      │   ├── email
      │   ├── goals { calories, protein, carbs, fats }
      │   └── preferences
      ├── meals/ (subcollection)
      │   └── {mealId}
      │       ├── name
      │       ├── calories
      │       ├── protein
      │       ├── carbs
      │       ├── fats
      │       └── timestamp
      ├── workouts/ (subcollection)
      │   └── {workoutId}
      │       ├── name
      │       ├── type
      │       ├── duration
      │       ├── exercises[]
      │       └── timestamp
      ├── gamification/
      │   └── stats
      │       ├── points
      │       ├── level
      │       ├── streaks { daily, workout, meal }
      │       └── lastLoginDate
      └── achievements/ (subcollection)
          └── {achievementId}
              ├── unlocked
              └── unlockedAt
```

## Usage Guide 📖

### Getting Started

1. **Sign Up**: Create an account with email and password
2. **Configure Claude API**: Add your Claude API key in Profile settings
3. **Set Goals**: Navigate to Goals tab and set your nutrition targets
4. **Log Meals**: Use the Meals tab to log your meals using natural language
5. **Track Workouts**: Log workouts in the Workouts tab
6. **Earn Points**: Complete activities to earn points and level up!

### Logging a Meal

1. Go to Meals tab
2. Type what you ate (e.g., "chicken breast with rice and broccoli")
3. Click "Analyze Meal"
4. Review and edit the nutrition data
5. Click "Save Meal" to log it

### Tracking Workouts

1. Go to Workouts tab
2. Click "Log New Workout"
3. Enter workout details (name, type, duration)
4. Click "Save Workout"

### Earning Points

- Log a meal: **10 points**
- Complete a workout: **25 points**
- Hit daily nutrition goals: **50 points**
- Unlock achievements: **50-250 points**

## Troubleshooting 🔧

### Build Errors

**Issue**: Gradle build fails
```bash
cd android
./gradlew clean
cd ..
npm run android
```

**Issue**: Metro bundler cache issues
```bash
npm start -- --reset-cache
```

**Issue**: Firebase not connecting
- Verify `google-services.json` is in `android/app/`
- Check Firebase project settings
- Ensure Authentication and Firestore are enabled

### Runtime Errors

**Issue**: "Claude API not initialized"
- Go to Profile → Claude API Settings
- Enter your Claude API key

**Issue**: Login/Signup not working
- Check Firebase configuration
- Verify Authentication is enabled in Firebase Console

## Development 👨‍💻

### Building for Release

1. Generate a signed APK:
```bash
cd android
./gradlew assembleRelease
```

2. The APK will be at:
```
android/app/build/outputs/apk/release/app-release.apk
```

### Running Tests

```bash
npm test
```

### Linting

```bash
npm run lint
```

## Future Enhancements 🚀

- [ ] iOS support
- [ ] Photo meal logging
- [ ] Barcode scanning
- [ ] Social features (friends, sharing)
- [ ] Custom workout plans
- [ ] Recipe suggestions
- [ ] Wearable device integration
- [ ] Dark/Light theme toggle
- [ ] Export data functionality

## Contributing 🤝

Contributions are welcome! Please feel free to submit a Pull Request.

## License 📄

This project is licensed under the MIT License.

## Support 💬

For issues and questions:
- Open an issue on GitHub
- Contact the development team

## Acknowledgments 🙏

- Claude AI by Anthropic for meal recognition
- Firebase for backend services
- React Native community for amazing tools
- 80s aesthetic inspiration from retrowave culture

---

**Made with 💙 in the 80s**

*FitRetro - Where fitness meets retrowave!* 🌴✨
