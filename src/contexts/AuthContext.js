'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../services/authApi';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        console.log('AuthContext: Checking authentication status...');
        const { data, error } = await auth.getCurrentUser();
        if (!error && data?.user) {
          console.log('AuthContext: User found:', data.user.email);
          setUser(data.user);
        } else {
          console.log('AuthContext: No user found:', error);
        }
      } catch (error) {
        // Silently handle auth check errors (user not logged in)
        console.log('AuthContext: No active session found', error.message);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
    
    // Also listen for storage events (when tokens are set from OAuth)
    const handleStorageChange = (e) => {
      if (e.key === 'oauth-tokens-updated') {
        console.log('AuthContext: OAuth tokens updated, refreshing user...');
        setTimeout(() => {
          checkAuth();
        }, 500);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const signUp = async (email, password) => {
    const result = await auth.signUp(email, password);
    return result;
  };

  const signIn = async (email, password) => {
    const result = await auth.signIn(email, password);
    if (!result.error && result.data?.user) {
      setUser(result.data.user);
    }
    return result;
  };

  const signInWithGoogle = async () => {
    return await auth.signInWithGoogle();
  };

  const signOut = async () => {
    const result = await auth.signOut();
    if (!result.error) {
      setUser(null);
    }
    return result;
  };

  const resetPassword = async (email) => {
    return await auth.resetPassword(email);
  };

  const refreshUser = async (retries = 3) => {
    try {
      console.log('Refreshing user context...');
      const { data, error } = await auth.getCurrentUser();
      if (!error && data?.user) {
        console.log('User context updated:', data.user.email);
        setUser(data.user);
        return true;
      } else if (error && retries > 0) {
        console.log(`Retrying user refresh... (${retries} attempts left)`);
        // Wait a bit and retry
        await new Promise(resolve => setTimeout(resolve, 1000));
        return await refreshUser(retries - 1);
      } else {
        console.log('No user found or max retries reached');
        setUser(null);
        return false;
      }
    } catch (error) {
      console.log('Error refreshing user:', error);
      if (retries > 0) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return await refreshUser(retries - 1);
      }
      return false;
    }
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    resetPassword,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};