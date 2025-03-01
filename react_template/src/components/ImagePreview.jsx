import React from 'react';
import PropTypes from 'prop-types';
import { useLanguage } from '../utils/LanguageContext';

const ImagePreview = ({ 
  title, 
  imageUrl, 
  isLoading, 
  loadingProgress = 0, 
  emptyMessage = 'No image available'
}) => {
  const { t } = useLanguage();
  // Determine the background style for the preview area
  const previewStyle = imageUrl ? {
    backgroundImage: `url(${imageUrl})`,
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  } : {};

  // For transparent backgrounds, we need a checkerboard pattern
  const checkerboardPattern = !isLoading && imageUrl ? 'bg-checkerboard' : '';

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm">
      <div className="bg-gray-100 p-3 border-b">
        <h3 className="font-medium text-gray-800">{title}</h3>
      </div>
      
      <div 
        className={`h-64 sm:h-80 relative flex items-center justify-center ${checkerboardPattern}`}
        style={previewStyle}
      >
        {/* Display placeholder message when no image */}
        {!imageUrl && !isLoading && (
          <div className="text-gray-500">{t('clickToProcess')}</div>
        )}
        
        {/* Image overlay for special styles like checkerboard */}
        {imageUrl && !isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <img 
              src={imageUrl} 
              alt={title}
              className="max-h-full max-w-full object-contain"
              style={{ visibility: 'hidden' }} // Hide actual image, just use for dimensions
            />
          </div>
        )}
        
        {/* Loading indicator */}
        {isLoading && (
          <div className="text-center">
            <div className="w-full max-w-xs bg-gray-200 rounded-full h-2.5 mb-2">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${loadingProgress * 100}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600">
              Processing... {Math.round(loadingProgress * 100)}%
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

ImagePreview.propTypes = {
  title: PropTypes.string.isRequired,
  imageUrl: PropTypes.string,
  isLoading: PropTypes.bool,
  loadingProgress: PropTypes.number,
  emptyMessage: PropTypes.string,
};

export default ImagePreview;