import { useState, useEffect } from 'react';
import firebaseAuth from '../services/firebaseAuth';
import firestoreService from '../services/firestoreService';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = firebaseAuth.onAuthStateChanged(async (authUser) => {
      if (authUser) {
        setUser(authUser);

        // Fetch user profile
        const profileResult = await firestoreService.getUserProfile(authUser.uid);
        if (profileResult.success) {
          setUserProfile(profileResult.data);
        }
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signOut = async () => {
    await firebaseAuth.signOut();
  };

  return {
    user,
    userProfile,
    loading,
    signOut,
    isAuthenticated: !!user,
  };
};

export default useAuth;
