import React from 'react';
import { useLanguage } from '../utils/LanguageContext';

const LanguageSelector = () => {
  const { currentLanguage, changeLanguage } = useLanguage();
  
  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="flex space-x-2 bg-white rounded-full shadow-lg px-3 py-1.5 border border-gray-200">
        <button
          onClick={() => changeLanguage('en')}
          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
            currentLanguage === 'en'
              ? 'bg-blue-500 text-white'
              : 'hover:bg-gray-100 text-gray-700'
          }`}
          aria-label="Switch to English"
        >
          EN
        </button>
        <button
          onClick={() => changeLanguage('zh')}
          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
            currentLanguage === 'zh'
              ? 'bg-blue-500 text-white'
              : 'hover:bg-gray-100 text-gray-700'
          }`}
          aria-label="切换到中文"
        >
          中文
        </button>
      </div>
    </div>
  );
};

export default LanguageSelector;