// API utilities for making requests

// Base API URL (would point to your backend in production)
const API_BASE_URL = 'https://api.example.com';

// Helper function for making API requests
export const api = async (endpoint, options = {}) => {
  // Set up default options
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // Get auth token if available
  const token = localStorage.getItem('auth_token');
  if (token) {
    defaultOptions.headers.Authorization = `Bearer ${token}`;
  }

  // Merge options
  const fetchOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    // In a real app, this would make actual API requests
    // For this demo, we'll simulate API responses
    console.log(`API Request to: ${endpoint}`, fetchOptions);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Simulate API responses
    if (endpoint === '/auth/login') {
      return { success: true };
    }
    
    if (endpoint === '/auth/register') {
      return { success: true };
    }
    
    if (endpoint === '/images/upload') {
      return { success: true, imageId: `img_${Date.now()}` };
    }
    
    if (endpoint === '/images/process') {
      return { success: true };
    }
    
    // Default response
    return { success: true, message: 'API request simulated' };
  } catch (error) {
    console.error(`API Error: ${endpoint}`, error);
    throw error;
  }
};

// API methods for different endpoints
export const authApi = {
  login: (credentials) => api('/auth/login', { 
    method: 'POST',
    body: JSON.stringify(credentials)
  }),
  
  register: (userData) => api('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData)
  }),
  
  getProfile: () => api('/auth/profile'),
};

export const imagesApi = {
  upload: (formData) => api('/images/upload', {
    method: 'POST',
    body: formData,
    headers: {}, // Let the browser set the correct Content-Type with boundary
  }),
  
  process: (imageId) => api(`/images/process/${imageId}`, {
    method: 'POST'
  }),
  
  getStatus: (imageId) => api(`/images/status/${imageId}`),
  
  getImage: (imageId) => api(`/images/${imageId}`),
};

export const quotaApi = {
  getQuota: () => api('/quota'),
  
  resetQuota: () => api('/quota/reset', {
    method: 'POST'
  })
};

export const paymentsApi = {
  createIntent: (data) => api('/payments/create-intent', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  
  getStatus: (paymentId) => api(`/payments/${paymentId}`)
};