import React, { useState } from 'react';
import BackgroundRemover from './components/BackgroundRemover';
import LanguageSelector from './components/LanguageSelector';
import { LanguageProvider, useLanguage } from './utils/LanguageContext';

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

const AppContent = () => {
  const { t } = useLanguage();
  // Example image URL (in a real integration, this would come from OpenAI API)
  const [designImage, setDesignImage] = useState('');
  const [isUploadMode, setIsUploadMode] = useState(true);

  // Handle file upload for demo purposes
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setDesignImage(reader.result);
        setIsUploadMode(false);
      };
      reader.readAsDataURL(file);
    }
  };

  // Reset to upload mode
  const handleReset = () => {
    setDesignImage('');
    setIsUploadMode(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <LanguageSelector />
      <div className="max-w-4xl mx-auto relative">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">{t('appTitle')}</h1>
          <p className="text-gray-600 mt-2">
            {t('appDescription')}
          </p>
        </header>

        <main className="bg-white rounded-lg shadow-lg p-6">
          {isUploadMode ? (
            <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
              <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
              </svg>
              <p className="text-gray-600 mb-4">{t('uploadTitle')}</p>
              <label className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded cursor-pointer">
                {t('selectImage')}
                <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
              </label>
            </div>
          ) : (
            <div>
              <BackgroundRemover 
                imageUrl={designImage} 
                onReset={handleReset}
                onProcessingComplete={(processedImageUrl) => {
                  console.log("Processing complete:", processedImageUrl);
                  // In a real integration, you would save this URL or pass it to the T-shirt printing flow
                }}
              />
            </div>
          )}
        </main>

        <footer className="text-center mt-8 text-sm text-gray-500">
          <p>{t('integrationNote')}</p>
          <p className="mt-1">{t('poweredBy')}</p>
        </footer>
      </div>
    </div>
  );
}

export default App;