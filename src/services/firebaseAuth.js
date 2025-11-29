import auth from '@react-native-firebase/auth';

class FirebaseAuthService {
  // Sign up with email and password
  async signUp(email, password, displayName) {
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(
        email,
        password
      );

      // Update display name
      if (displayName) {
        await userCredential.user.updateProfile({
          displayName: displayName,
        });
      }

      return {
        success: true,
        user: userCredential.user,
      };
    } catch (error) {
      return {
        success: false,
        error: this.getErrorMessage(error.code),
      };
    }
  }

  // Sign in with email and password
  async signIn(email, password) {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(
        email,
        password
      );

      return {
        success: true,
        user: userCredential.user,
      };
    } catch (error) {
      return {
        success: false,
        error: this.getErrorMessage(error.code),
      };
    }
  }

  // Sign out
  async signOut() {
    try {
      await auth().signOut();
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Send password reset email
  async resetPassword(email) {
    try {
      await auth().sendPasswordResetEmail(email);
      return {
        success: true,
        message: 'Password reset email sent',
      };
    } catch (error) {
      return {
        success: false,
        error: this.getErrorMessage(error.code),
      };
    }
  }

  // Get current user
  getCurrentUser() {
    return auth().currentUser;
  }

  // Listen to auth state changes
  onAuthStateChanged(callback) {
    return auth().onAuthStateChanged(callback);
  }

  // Helper to get user-friendly error messages
  getErrorMessage(errorCode) {
    switch (errorCode) {
      case 'auth/email-already-in-use':
        return 'This email is already registered';
      case 'auth/invalid-email':
        return 'Invalid email address';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters';
      case 'auth/user-not-found':
        return 'No account found with this email';
      case 'auth/wrong-password':
        return 'Incorrect password';
      case 'auth/too-many-requests':
        return 'Too many attempts. Please try again later';
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection';
      default:
        return 'An error occurred. Please try again';
    }
  }
}

export default new FirebaseAuthService();
