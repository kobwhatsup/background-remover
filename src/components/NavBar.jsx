import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';

function NavBar() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('login'); // 'login' or 'register'
  const { user, logout } = useAuth();
  
  const openLoginModal = () => {
    setModalMode('login');
    setIsAuthModalOpen(true);
  };
  
  const openRegisterModal = () => {
    setModalMode('register');
    setIsAuthModalOpen(true);
  };
  
  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };
  
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-2xl font-bold text-blue-600">
              Background Removal Service
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-gray-700">
                  Welcome, {user.name || 'User'}
                </span>
                <Link to="/dashboard" className="text-blue-600 hover:text-blue-800">
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={openLoginModal}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Login
                </button>
                <button
                  onClick={openRegisterModal}
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
                  Register
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      
      {isAuthModalOpen && (
        <AuthModal 
          isOpen={isAuthModalOpen} 
          onClose={closeAuthModal} 
          mode={modalMode}
        />
      )}
    </nav>
  );
}

export default NavBar;