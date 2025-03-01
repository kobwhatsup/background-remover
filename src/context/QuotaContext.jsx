import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getUserQuota, decrementUserQuota } from '../services/QuotaService';

// Create quota context
const QuotaContext = createContext();

export function QuotaProvider({ children }) {
  const [remainingQuota, setRemainingQuota] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  
  // Update quota when user changes
  useEffect(() => {
    const loadQuota = async () => {
      try {
        setLoading(true);
        const quota = await getUserQuota(user?.id);
        setRemainingQuota(quota);
      } catch (error) {
        console.error('Error loading quota:', error);
        setRemainingQuota(0);
      } finally {
        setLoading(false);
      }
    };
    
    loadQuota();
  }, [user]);
  
  // Check quota
  const checkQuota = async (userId) => {
    try {
      const quota = await getUserQuota(userId);
      setRemainingQuota(quota);
      return quota;
    } catch (error) {
      console.error('Error checking quota:', error);
      return 0;
    }
  };
  
  // Decrement quota
  const decrementQuota = async (userId) => {
    try {
      const result = await decrementUserQuota(userId);
      
      if (result) {
        // Update local state
        setRemainingQuota(prevQuota => Math.max(0, prevQuota - 1));
      }
      
      return result;
    } catch (error) {
      console.error('Error decrementing quota:', error);
      return false;
    }
  };
  
  // Context value
  const value = {
    remainingQuota,
    checkQuota,
    decrementQuota,
    loading
  };
  
  return (
    <QuotaContext.Provider value={value}>
      {children}
    </QuotaContext.Provider>
  );
}

// Custom hook to use the quota context
export function useQuota() {
  const context = useContext(QuotaContext);
  
  if (!context) {
    throw new Error('useQuota must be used within a QuotaProvider');
  }
  
  return context;
}

export default QuotaContext;