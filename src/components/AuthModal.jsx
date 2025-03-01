import React, { useState } from 'react';
import { register, login } from '../services/AuthService';
import { useAuth } from '../context/AuthContext';

function AuthModal({ isOpen, onClose, mode }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentMode, setCurrentMode] = useState(mode || 'login'); // 'login' or 'register'
  const { setUser } = useAuth();

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const switchMode = () => {
    setError(null);
    setCurrentMode(currentMode === 'login' ? 'register' : 'login');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      let result;
      
      if (currentMode === 'register') {
        // Validate registration fields
        if (!formData.email || !formData.password || !formData.name) {
          throw new Error('All fields are required');
        }
        
        if (formData.password.length < 6) {
          throw new Error('Password must be at least 6 characters');
        }
        
        // Call register service
        result = await register(formData.email, formData.password, formData.name);
      } else {
        // Validate login fields
        if (!formData.email || !formData.password) {
          throw new Error('Email and password are required');
        }
        
        // Call login service
        result = await login(formData.email, formData.password);
      }
      
      // On success, update auth context and close modal
      setUser(result.user);
      onClose();
    } catch (err) {
      console.error('Authentication error:', err);
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4 text-center">
        <div 
          className="fixed inset-0 bg-black opacity-30"
          onClick={onClose}
        ></div>
        
        <div className="inline-block w-full max-w-md rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all transform">
          <div className="flex justify-between items-center border-b pb-3">
            <h3 className="text-lg font-medium text-gray-900">
              {currentMode === 'login' ? 'Login to Your Account' : 'Create an Account'}
            </h3>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="mt-4">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-3 mb-4">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {currentMode === 'register' && (
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    placeholder="John Doe"
                  />
                </div>
              )}
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                  placeholder="you@example.com"
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                  placeholder={currentMode === 'register' ? 'Create a password' : 'Enter your password'}
                />
              </div>
              
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    isLoading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                  }`}
                >
                  {isLoading 
                    ? 'Processing...' 
                    : currentMode === 'login' ? 'Sign In' : 'Create Account'}
                </button>
              </div>
            </form>
            
            <div className="mt-4 text-center">
              <button
                onClick={switchMode}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                {currentMode === 'login'
                  ? "Don't have an account? Sign up"
                  : 'Already have an account? Sign in'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthModal;