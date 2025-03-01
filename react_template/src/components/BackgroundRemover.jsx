import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ImagePreview from './ImagePreview';
import ControlPanel from './ControlPanel';
import { useBackgroundRemoval } from '../hooks/useBackgroundRemoval';
import { useLanguage } from '../utils/LanguageContext';

const BackgroundRemover = ({ imageUrl, onReset, onProcessingComplete }) => {
  const { t } = useLanguage();
  const [processingStatus, setProcessingStatus] = useState('idle'); // idle, processing, success, error
  const [autoProcessing, setAutoProcessing] = useState(true);
  const [originalImage, setOriginalImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [imageSettings, setImageSettings] = useState({
    precision: 85,
    edgeSmoothing: 70,
  });

  // Import and use the background removal hook
  const { 
    removeBackground, 
    isModelLoading, 
    processingProgress 
  } = useBackgroundRemoval();

  // Store the original image when it's provided
  useEffect(() => {
    if (imageUrl) {
      setOriginalImage(imageUrl);
      // Auto process if enabled
      if (autoProcessing) {
        handleProcessImage();
      }
    }
  }, [imageUrl]);

  // Handle background removal process
  const handleProcessImage = async () => {
    try {
      console.log('Starting image processing...');
      setProcessingStatus('processing');
      
      const result = await removeBackground(originalImage, {
        precision: imageSettings.precision / 100,
        edgeSmoothing: imageSettings.edgeSmoothing / 100,
      });
      
      // If result is null, silently revert to idle state without showing errors
      if (result === null) {
        console.log('Background removal returned null result, reverting to idle state');
        setProcessingStatus('idle');
        return;
      }
      
      console.log('Background removal successful, setting processed image...');
      setProcessedImage(result);
      
      // Force a small delay to ensure state updates are processed
      setTimeout(() => {
        setProcessingStatus('success');
        console.log('Processing status set to SUCCESS, download button should be enabled!');
        
        if (onProcessingComplete) {
          onProcessingComplete(result);
        }
      }, 100);
    } catch (error) {
      // Silently handle errors without showing error status
      console.error('Background removal error:', error);
      setProcessingStatus('idle');
    }
  };

  // Handle settings change
  const handleSettingsChange = (newSettings) => {
    setImageSettings(prevSettings => ({
      ...prevSettings,
      ...newSettings
    }));
  };

  // Reset processed image and return to original
  const handleResetImage = () => {
    setProcessedImage(null);
    setProcessingStatus('idle');
  };

  // Use final processed image or go back to original
  const handleUseOriginal = () => {
    onReset();
  };

  // Accept the processed image
  const handleUseProcessed = () => {
    // In a real application, this would save the processed image
    // and continue the T-shirt design workflow
    alert('Processed image selected for T-shirt design.');
  };

  // Download the processed image
  const handleDownloadImage = () => {
    console.log('Download handler called');
    if (!processedImage) {
      console.error('No processed image available for download');
      return;
    }
    
    console.log('Processed image available, creating download link');
    
    try {
      // Create a temporary anchor element
      const downloadLink = document.createElement('a');
      
      // Set the download attribute with a filename
      downloadLink.download = 'background-removed-image.png';
      
      // Set the href to the processed image data URL
      downloadLink.href = processedImage;
      
      // Append to the document, click it, and remove it
      document.body.appendChild(downloadLink);
      console.log('Download link created and appended to document');
      
      // Add a small delay before clicking to ensure proper append
      setTimeout(() => {
        console.log('Triggering download...');
        downloadLink.click();
        document.body.removeChild(downloadLink);
        console.log('Download initiated and link removed');
      }, 100);
    } catch (error) {
      console.error('Error during download:', error);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
        <div className="w-full md:w-1/2">
          <ImagePreview 
            title={t('originalDesign')} 
            imageUrl={originalImage} 
            isLoading={false} 
          />
        </div>
        <div className="w-full md:w-1/2">
          <ImagePreview 
            title={t('backgroundRemoved')} 
            imageUrl={processedImage} 
            isLoading={processingStatus === 'processing'} 
            loadingProgress={processingProgress}
            emptyMessage={t('clickToProcess')}
          />
        </div>
      </div>
      
      <ControlPanel 
        settings={imageSettings}
        onSettingsChange={handleSettingsChange}
        onProcessImage={handleProcessImage}
        onReset={handleResetImage}
        onUseOriginal={handleUseOriginal}
        onUseProcessed={handleUseProcessed}
        onDownloadImage={handleDownloadImage}
        isProcessing={processingStatus === 'processing' || isModelLoading}
        isModelLoading={isModelLoading}
        processingStatus={processingStatus}
      />
    </div>
  );
};

BackgroundRemover.propTypes = {
  imageUrl: PropTypes.string.isRequired,
  onReset: PropTypes.func.isRequired,
  onProcessingComplete: PropTypes.func,
};

export default BackgroundRemover;