// Quota management service
const QUOTA_KEY = 'user_quota';
const DEFAULT_FREE_QUOTA = 3;
const ANONYMOUS_QUOTA_PREFIX = 'anon_quota_';

// Get device identifier for anonymous users
const getDeviceId = () => {
  // In a real implementation, we would use a robust fingerprinting library
  // For this demo, we'll use localStorage
  let deviceId = localStorage.getItem('device_id');
  if (!deviceId) {
    deviceId = `device_${Math.random().toString(36).substring(2)}`;
    localStorage.setItem('device_id', deviceId);
  }
  return deviceId;
};

// Check remaining quota for a registered user
export const checkUserQuota = async (userId) => {
  try {
    if (!userId) {
      // For anonymous users
      const deviceId = getDeviceId();
      return checkAnonymousQuota(deviceId);
    }
    
    // In a real app, this would be an API call
    // For this demo, we'll use localStorage to simulate user data
    const usersDb = JSON.parse(localStorage.getItem('users_db') || '[]');
    const user = usersDb.find(u => u.id === userId);
    
    if (user) {
      return user.remainingQuota;
    }
    
    return 0;
  } catch (error) {
    console.error('Error checking user quota:', error);
    throw error;
  }
};

// Check remaining quota for anonymous users
export const checkAnonymousQuota = async (deviceId) => {
  try {
    if (!deviceId) {
      deviceId = getDeviceId();
    }
    
    // Get quota from localStorage
    const quotaKey = `${ANONYMOUS_QUOTA_PREFIX}${deviceId}`;
    const quota = localStorage.getItem(quotaKey);
    
    if (quota === null) {
      // First time user, initialize quota
      localStorage.setItem(quotaKey, DEFAULT_FREE_QUOTA.toString());
      return DEFAULT_FREE_QUOTA;
    }
    
    return parseInt(quota, 10);
  } catch (error) {
    console.error('Error checking anonymous quota:', error);
    throw error;
  }
};

// Decrement quota for a user
export const decrementUserQuota = async (userId) => {
  try {
    if (!userId) {
      // For anonymous users
      const deviceId = getDeviceId();
      return decrementAnonymousQuota(deviceId);
    }
    
    // In a real app, this would be an API call
    // For this demo, we'll use localStorage
    const usersDb = JSON.parse(localStorage.getItem('users_db') || '[]');
    const userIndex = usersDb.findIndex(u => u.id === userId);
    
    if (userIndex !== -1) {
      if (usersDb[userIndex].remainingQuota <= 0) {
        return false;
      }
      
      usersDb[userIndex].remainingQuota -= 1;
      localStorage.setItem('users_db', JSON.stringify(usersDb));
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error decrementing user quota:', error);
    throw error;
  }
};

// Decrement quota for anonymous users
export const decrementAnonymousQuota = async (deviceId) => {
  try {
    if (!deviceId) {
      deviceId = getDeviceId();
    }
    
    const quotaKey = `${ANONYMOUS_QUOTA_PREFIX}${deviceId}`;
    const quota = parseInt(localStorage.getItem(quotaKey) || '0', 10);
    
    if (quota <= 0) {
      return false;
    }
    
    localStorage.setItem(quotaKey, (quota - 1).toString());
    return true;
  } catch (error) {
    console.error('Error decrementing anonymous quota:', error);
    throw error;
  }
};

// Reset quota for a user (e.g., after subscription)
export const resetUserQuota = async (userId) => {
  try {
    if (!userId) {
      return false;
    }
    
    const usersDb = JSON.parse(localStorage.getItem('users_db') || '[]');
    const userIndex = usersDb.findIndex(u => u.id === userId);
    
    if (userIndex !== -1) {
      usersDb[userIndex].remainingQuota = DEFAULT_FREE_QUOTA;
      localStorage.setItem('users_db', JSON.stringify(usersDb));
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error resetting user quota:', error);
    throw error;
  }
};

// Get user quota for display
export const getUserQuota = async (userId) => {
  if (userId) {
    return await checkUserQuota(userId);
  } else {
    const deviceId = getDeviceId();
    return await checkAnonymousQuota(deviceId);
  }
};