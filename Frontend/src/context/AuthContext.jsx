import React, { createContext, useState, useContext, useEffect } from 'react';
import { apiService } from '../services/api';

// Create Context
export const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Check if user is logged in on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Check authentication status
  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        // Verify token is still valid by making an API call
        const response = await apiService.getProfile();
        setUser(response.user);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      // Token is invalid, remove it
      apiService.removeToken();
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = async (email, password) => {
    try {
      setError('');
      setLoading(true);
      
      const response = await apiService.login({ email, password });
      
      if (response.success !== false) {
        setUser(response.user);
        setError('');
        return { success: true, user: response.user };
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      const errorMessage = error.message || 'Login failed. Please try again.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (name, email, password) => {
    try {
      setError('');
      setLoading(true);
      
      const response = await apiService.register({ name, email, password });
      
      if (response.message === 'User registered successfully') {
        setUser(response.user);
        setError('');
        return { success: true, user: response.user };
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error) {
      const errorMessage = error.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    apiService.removeToken();
    setUser(null);
    setError('');
    // Optional: Redirect to home page
    window.location.href = '/';
  };

  // Update user data
  const updateUser = (userData) => {
    setUser(prev => ({ ...prev, ...userData }));
  };

  // Update user preferences
  const updatePreferences = async (preferences) => {
    try {
      const response = await apiService.updatePreferences(preferences);
      if (response.success) {
        setUser(prev => ({
          ...prev,
          preferences: response.preferences || preferences
        }));
        return { success: true };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Clear error
  const clearError = () => {
    setError('');
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!user;
  };

  // Get user token
  const getToken = () => {
    return localStorage.getItem('authToken');
  };

  // Value provided to consumers
  const value = {
    // State
    user,
    loading,
    error,
    
    // Actions
    login,
    register,
    logout,
    updateUser,
    updatePreferences,
    setError,
    clearError,
    checkAuthStatus,
    
    // Getters
    isAuthenticated,
    getToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;