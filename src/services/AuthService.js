// Storage keys
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

// Simulate users database (would be on the server in real implementation)
let usersDb = JSON.parse(localStorage.getItem('users_db') || '[]');

// Function to save the users database to localStorage
const saveUsersDb = () => {
  localStorage.setItem('users_db', JSON.stringify(usersDb));
};

// Generate a random token
const generateToken = () => {
  return Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2);
};

// Register a new user
export const register = async (email, password, name) => {
  try {
    // Check if email already exists
    if (usersDb.some(user => user.email === email)) {
      throw new Error('Email already in use');
    }
    
    // Create a new user
    const newUser = {
      id: `user_${Date.now()}`,
      email,
      name,
      // In a real app, we would hash the password
      passwordHash: password, 
      createdAt: new Date().toISOString(),
      remainingQuota: 3
    };
    
    // Add to "database"
    usersDb.push(newUser);
    saveUsersDb();
    
    // Generate token
    const token = generateToken();
    
    // Store authentication data
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email
    }));
    
    // Return user and token
    return {
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email
      },
      token
    };
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

// Login a user
export const login = async (email, password) => {
  try {
    // Find user
    const user = usersDb.find(u => u.email === email);
    
    // Check if user exists and password matches
    if (!user || user.passwordHash !== password) {
      throw new Error('Invalid email or password');
    }
    
    // Generate token
    const token = generateToken();
    
    // Store authentication data
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify({
      id: user.id,
      name: user.name,
      email: user.email
    }));
    
    // Return user and token
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      token
    };
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Logout user
export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!localStorage.getItem(TOKEN_KEY);
};

// Get current user
export const getCurrentUser = () => {
  const userStr = localStorage.getItem(USER_KEY);
  return userStr ? JSON.parse(userStr) : null;
};

// Get user's token
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

// Update user
export const updateUser = async (userId, updates) => {
  try {
    // Find user in "database"
    const userIndex = usersDb.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    // Update user
    usersDb[userIndex] = {
      ...usersDb[userIndex],
      ...updates
    };
    
    // Save to "database"
    saveUsersDb();
    
    // Update current user if it's the logged in user
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      localStorage.setItem(USER_KEY, JSON.stringify({
        ...currentUser,
        ...updates
      }));
    }
    
    return { success: true };
  } catch (error) {
    console.error('Update user error:', error);
    throw error;
  }
};