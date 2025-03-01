import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser, isAuthenticated, logout as authLogout } from '../services/AuthService';

// Create the authentication context
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Initialize auth state on component mount
  useEffect(() => {
    const initAuth = () => {
      try {
        if (isAuthenticated()) {
          setUser(getCurrentUser());
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };
    
    initAuth();
  }, []);
  
  // Logout function
  const logout = () => {
    try {
      authLogout();
      setUser(null);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };
  
  // Context value
  const value = {
    user,
    setUser,
    logout,
    isAuthenticated: !!user,
    loading
  };
  
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}

export default AuthContext;