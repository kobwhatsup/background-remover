import React from 'react';
import PropTypes from 'prop-types';
import { useLanguage } from '../utils/LanguageContext';

const ControlPanel = ({
  settings,
  onSettingsChange,
  onProcessImage,
  onReset,
  onUseOriginal,
  onUseProcessed,
  onDownloadImage,
  isProcessing,
  isModelLoading,
  processingStatus
}) => {
  const { t } = useLanguage();
  
  // Handle slider changes
  const handleSliderChange = (e) => {
    const { name, value } = e.target;
    onSettingsChange({ [name]: parseInt(value, 10) });
  };

  // Determine button states
  const isButtonDisabled = isProcessing || isModelLoading;
  const hasProcessedImage = processingStatus === 'success';
  console.log('ControlPanel render - processingStatus:', processingStatus, 'hasProcessedImage:', hasProcessedImage);
  
  return (
    <div className="bg-gray-50 border rounded-lg mt-4 p-4">
      <div className="mb-3 p-2 bg-yellow-100 border border-yellow-300 rounded">
        {t('status')}: <strong>{t(processingStatus)}</strong> | {t('downloadButtonStatus')} {hasProcessedImage ? t('enabled') : t('disabled')}
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t('precision')}: {settings.precision}%
        </label>
        <input
          type="range"
          name="precision"
          min="0"
          max="100"
          value={settings.precision}
          onChange={handleSliderChange}
          disabled={isButtonDisabled}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <p className="text-xs text-gray-500 mt-1">
          {t('precisionDescription')}
        </p>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t('edgeSmoothing')}: {settings.edgeSmoothing}%
        </label>
        <input
          type="range"
          name="edgeSmoothing"
          min="0"
          max="100"
          value={settings.edgeSmoothing}
          onChange={handleSliderChange}
          disabled={isButtonDisabled}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <p className="text-xs text-gray-500 mt-1">
          {t('edgeSmoothingDescription')}
        </p>
      </div>

      {/* Regular controls */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-4 mt-6">
        <div className="flex flex-wrap space-x-2" style={{ border: '2px solid green', padding: '4px', position: 'relative', zIndex: 5 }}>
          <button
            onClick={onProcessImage}
            disabled={isButtonDisabled}
            className={`py-2 px-4 rounded-md font-medium ${
              isButtonDisabled
                ? 'bg-blue-300 text-white cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isModelLoading ? t('loadingModel') : isProcessing ? t('processing') : t('removeBackground')}
          </button>

          <button
            onClick={onReset}
            disabled={isButtonDisabled || !hasProcessedImage}
            className={`py-2 px-4 rounded-md font-medium ${
              isButtonDisabled || !hasProcessedImage
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}
          >
            {t('reset')}
          </button>
          
        </div>
        


        <div className="flex space-x-2" style={{ border: '2px solid orange', padding: '4px' }}>
          <button
            onClick={onUseOriginal}
            className="py-2 px-4 rounded-md font-medium bg-gray-200 hover:bg-gray-300 text-gray-700"
          >
            {t('useOriginalImage')}
          </button>

          <button
            onClick={onUseProcessed}
            disabled={!hasProcessedImage}
            className={`py-2 px-4 rounded-md font-medium ${
              !hasProcessedImage
                ? 'bg-green-300 text-white cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {t('useProcessedImage')}
          </button>
        </div>
      </div>

      {isModelLoading && (
        <div className="mt-4 p-3 bg-blue-50 text-blue-800 text-sm rounded-md">
          <p>{t('loadingModelMessage')}</p>
        </div>
      )}

      {/* Standalone Download Button Section */}
      <div className="fixed bottom-4 left-0 right-0 z-50">
        {hasProcessedImage && (
          <div className="container mx-auto max-w-screen-lg">
            <div className="mt-8 p-4 bg-purple-100 border-2 border-purple-500 rounded-lg text-center shadow-lg">
              <h3 className="text-xl font-bold mb-2">{t('imageReady')}</h3>
              <button
                className="py-4 px-8 rounded-lg font-bold text-xl bg-purple-600 hover:bg-purple-700 text-white pulse-animation"
                style={{
                  boxShadow: '0 4px 12px rgba(124, 58, 237, 0.5)',
                  transform: 'scale(1.05)'
                }}
                onClick={(e) => {
                  console.log('Download button clicked!');
                  console.log('Has processed image:', hasProcessedImage);
                  e.preventDefault();
                  onDownloadImage();
                }}
              >
                ⬇️ {t('downloadImage')} ⬇️
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

ControlPanel.propTypes = {
  settings: PropTypes.shape({
    precision: PropTypes.number.isRequired,
    edgeSmoothing: PropTypes.number.isRequired,
  }).isRequired,
  onSettingsChange: PropTypes.func.isRequired,
  onProcessImage: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
  onUseOriginal: PropTypes.func.isRequired,
  onUseProcessed: PropTypes.func.isRequired,
  onDownloadImage: PropTypes.func.isRequired,
  isProcessing: PropTypes.bool.isRequired,
  isModelLoading: PropTypes.bool.isRequired,
  processingStatus: PropTypes.string.isRequired,
};

export default ControlPanel;