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
        const { data, error } = await auth.getCurrentUser();
        if (!error && data?.user) {
          setUser(data.user);
        }
      } catch (error) {
        // Silently handle auth check errors (user not logged in)
        console.log('No active session found');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
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

  const refreshUser = async () => {
    try {
      const { data, error } = await auth.getCurrentUser();
      if (!error && data?.user) {
        setUser(data.user);
      }
    } catch (error) {
      console.log('Error refreshing user:', error);
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