/**
 * ImageProcessor.js - Service for handling image processing operations
 * Uses @imgly/background-removal for removing image backgrounds
 */

import { removeBackground as imglyRemoveBackground, preload } from '@imgly/background-removal';
import { resizeImageIfNeeded } from '../utils/imageUtils';

class ImageProcessor {
  constructor() {
    this.isModelLoaded = false;
    this.isModelLoading = false;
    this.modelLoadingPromise = null;
    this.lastProgress = 0;
    this.progressCallback = null;
  }

  /**
   * Initialize the background removal model
   * @returns {Promise} Promise that resolves when model is loaded
   */
  async initializeModel() {
    if (this.isModelLoaded) {
      return Promise.resolve();
    }

    if (this.isModelLoading) {
      return this.modelLoadingPromise;
    }

    this.isModelLoading = true;
    
    try {
      this.modelLoadingPromise = preload({
        debug: false,
        proxyToWorker: true,
      });
      
      await this.modelLoadingPromise;
      this.isModelLoaded = true;
      this.isModelLoading = false;
      return Promise.resolve();
    } catch (error) {
      this.isModelLoading = false;
      console.error("Failed to initialize background removal model:", error);
      return Promise.reject(error);
    }
  }

  /**
   * Remove the background from an image
   * @param {string|Blob} imageSource - Image URL or blob
   * @param {Object} options - Processing options
   * @param {function} onProgress - Progress callback
   * @returns {Promise<string>} - URL of the processed image
   */
  async removeBackground(imageSource, options = {}, onProgress = null) {
    try {
      this.progressCallback = onProgress;

      // Ensure model is loaded
      await this.initializeModel();

      // Process the image as data URL or Blob
      let sourceImage;
      if (typeof imageSource === 'string' && imageSource.startsWith('data:')) {
        sourceImage = imageSource;
      } else if (imageSource instanceof Blob) {
        sourceImage = imageSource;
      } else {
        // Fetch the image if it's a URL
        const response = await fetch(imageSource);
        sourceImage = await response.blob();
      }

      // Resize large images to prevent performance issues
      const processableImage = await resizeImageIfNeeded(sourceImage, 1920);
      
      // Configure processing options
      const processingOptions = {
        progress: this.handleProgress.bind(this),
        dealWithBigImages: 'resize', // Options: 'resize', 'skip', 'split'
        ...options
      };

      // Process the image
      const processedImageBlob = await imglyRemoveBackground(processableImage, processingOptions);
      
      // Convert to data URL for display
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(processedImageBlob);
      });
    } catch (error) {
      console.error("Background removal failed:", error);
      throw error;
    }
  }

  /**
   * Handle progress updates from the processing library
   * @param {number} progress - Progress value between 0 and 1
   */
  handleProgress(progress) {
    this.lastProgress = progress;
    if (this.progressCallback) {
      this.progressCallback(progress);
    }
  }

  /**
   * Get the current model loading state
   * @returns {boolean} - True if model is loading
   */
  isLoading() {
    return this.isModelLoading;
  }

  /**
   * Get the current processing progress
   * @returns {number} - Progress value between 0 and 1
   */
  getProgress() {
    return this.lastProgress;
  }
}

// Export as singleton
const imageProcessorInstance = new ImageProcessor();
export default imageProcessorInstance;