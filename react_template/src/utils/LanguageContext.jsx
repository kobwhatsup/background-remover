import React, { createContext, useState, useEffect, useContext } from 'react';
import enTranslations from './translations/en';
import zhTranslations from './translations/zh';

// Create a context for language
export const LanguageContext = createContext();

// Create a language provider component
export const LanguageProvider = ({ children }) => {
  // Try to get saved language from localStorage, default to English
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem('language');
    return savedLanguage || 'en';
  });

  // Get translations based on current language
  const [translations, setTranslations] = useState(() => {
    return currentLanguage === 'zh' ? zhTranslations : enTranslations;
  });

  // Update translations when language changes
  useEffect(() => {
    setTranslations(currentLanguage === 'zh' ? zhTranslations : enTranslations);
    // Save language preference to localStorage
    localStorage.setItem('language', currentLanguage);
  }, [currentLanguage]);

  // Change language function
  const changeLanguage = (language) => {
    setCurrentLanguage(language);
  };

  // Translate function to get text by key
  const t = (key) => {
    // Get the translation by key, fallback to key itself if not found
    return translations[key] || key;
  };

  // Context value
  const contextValue = {
    currentLanguage,
    changeLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export const useLanguage = () => useContext(LanguageContext);