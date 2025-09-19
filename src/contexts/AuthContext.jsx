import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, signInWithGoogle, signOutUser, initializeSocialLogin, handleAuthRedirect } from '../utils/firebase';
import { onAuthStateChanged } from 'firebase/auth';

// Create the AuthContext
const AuthContext = createContext();

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// AuthProvider component to wrap the app
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [socialLoginInitialized, setSocialLoginInitialized] = useState(false);

  // Initialize SocialLogin plugin when component mounts
  useEffect(() => {
    const initializeSocial = async () => {
      try {
        await initializeSocialLogin();
        setSocialLoginInitialized(true);
        console.log('SocialLogin initialized successfully');
      } catch (error) {
        console.error('Failed to initialize SocialLogin:', error);
        setSocialLoginInitialized(false);
      }
    };

    initializeSocial();
  }, []);

  // Listen for auth state changes and handle redirects
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    // Handle redirect result on app load
    const checkRedirectResult = async () => {
      try {
        await handleAuthRedirect();
      } catch (error) {
        console.error('Failed to handle auth redirect:', error);
      }
    };

    checkRedirectResult();

    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);

  // Sign in with Google
  const signIn = async () => {
    if (!socialLoginInitialized) {
      throw new Error('SocialLogin not initialized yet. Please try again in a moment.');
    }

    try {
      const result = await signInWithGoogle();
      setCurrentUser(result.user);
      return result;
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      await signOutUser();
      setCurrentUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  // Context value
  const value = {
    currentUser,
    signIn,
    signOut,
    loading,
    socialLoginInitialized
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};