/**
 * useBackgroundRemoval.js - Custom hook for background removal functionality
 */

import { useState, useEffect, useCallback } from 'react';
import ImageProcessor from '../services/ImageProcessor';

export function useBackgroundRemoval() {
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);

  // Initialize model when the hook is first used
  useEffect(() => {
    const loadModel = async () => {
      try {
        setIsModelLoading(true);
        await ImageProcessor.initializeModel();
      } catch (error) {
        console.error('Error initializing model:', error);
      } finally {
        setIsModelLoading(false);
      }
    };

    // Only load if not already loading or loaded
    if (!ImageProcessor.isModelLoaded && !ImageProcessor.isModelLoading) {
      loadModel();
    } else if (ImageProcessor.isModelLoading) {
      setIsModelLoading(true);
      ImageProcessor.modelLoadingPromise.then(() => {
        setIsModelLoading(false);
      });
    }
  }, []);

  // Progress update handler
  const handleProgress = useCallback((progress) => {
    setProcessingProgress(progress);
  }, []);

  // Main function to remove background
  const removeBackground = useCallback(async (imageSource, options = {}) => {
    try {
      // Reset progress
      setProcessingProgress(0);
      
      // Process the image
      const result = await ImageProcessor.removeBackground(
        imageSource, 
        options, 
        handleProgress
      );
      
      return result;
    } catch (error) {
      // Log error but don't show it to the user
      console.error('Error in background removal:', error);
      
      // Instead of throwing the error, return a fallback or empty result
      // This prevents error messages from showing in the UI
      return null; // Return null to indicate processing failed without showing error
    }
  }, [handleProgress]);

  return {
    removeBackground,
    isModelLoading: isModelLoading || ImageProcessor.isModelLoading,
    isModelLoaded: ImageProcessor.isModelLoaded,
    processingProgress,
  };
}