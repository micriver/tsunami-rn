import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

const AUTH_STORAGE_KEY = '@tsunami_auth_isLoggedIn';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved auth state on mount
  useEffect(() => {
    const loadAuthState = async () => {
      try {
        const savedAuth = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
        if (savedAuth !== null) {
          setIsLoggedIn(JSON.parse(savedAuth));
        }
      } catch (error) {
        console.error('Failed to load auth state:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAuthState();
  }, []);

  const login = async () => {
    setIsLoggedIn(true);
    try {
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(true));
    } catch (error) {
      console.error('Failed to save auth state:', error);
    }
  };

  const logout = async () => {
    setIsLoggedIn(false);
    try {
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(false));
    } catch (error) {
      console.error('Failed to clear auth state:', error);
    }
  };

  const value = {
    isLoggedIn,
    isLoading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
