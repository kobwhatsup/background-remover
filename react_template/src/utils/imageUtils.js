/**
 * imageUtils.js - Utility functions for image processing
 */

/**
 * Resize an image if it exceeds maximum dimensions
 * @param {Blob|string} imageSource - Image blob or data URL
 * @param {number} maxDimension - Maximum width or height
 * @returns {Promise<Blob|string>} - Resized image
 */
export async function resizeImageIfNeeded(imageSource, maxDimension = 1920) {
  // If it's already a data URL, we'll convert to blob first for consistent handling
  let imageBlob = imageSource;
  if (typeof imageSource === 'string' && imageSource.startsWith('data:')) {
    imageBlob = await dataURLToBlob(imageSource);
  }

  return new Promise((resolve, reject) => {
    // Create an image element to get dimensions
    const img = new Image();
    const objectUrl = URL.createObjectURL(imageBlob);
    
    img.onload = () => {
      // Clean up the object URL
      URL.revokeObjectURL(objectUrl);
      
      const { width, height } = img;
      
      // If image is smaller than max dimensions, return original
      if (width <= maxDimension && height <= maxDimension) {
        // Return the original format (blob or data URL)
        if (typeof imageSource === 'string' && imageSource.startsWith('data:')) {
          resolve(imageSource);
        } else {
          resolve(imageBlob);
        }
        return;
      }
      
      // Calculate new dimensions
      let newWidth, newHeight;
      if (width > height) {
        newWidth = maxDimension;
        newHeight = Math.floor(height * (maxDimension / width));
      } else {
        newHeight = maxDimension;
        newWidth = Math.floor(width * (maxDimension / height));
      }
      
      // Create canvas for resizing
      const canvas = document.createElement('canvas');
      canvas.width = newWidth;
      canvas.height = newHeight;
      
      // Draw and resize image
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, newWidth, newHeight);
      
      // Convert back to original format (blob or data URL)
      if (typeof imageSource === 'string' && imageSource.startsWith('data:')) {
        const dataUrl = canvas.toDataURL('image/png');
        resolve(dataUrl);
      } else {
        canvas.toBlob((blob) => {
          resolve(blob);
        }, 'image/png');
      }
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Failed to load image for resizing'));
    };
    
    img.src = objectUrl;
  });
}

/**
 * Convert data URL to Blob
 * @param {string} dataURL - Data URL string
 * @returns {Promise<Blob>} - Blob representation
 */
export function dataURLToBlob(dataURL) {
  return fetch(dataURL).then(res => res.blob());
}

/**
 * Adds a checkerboard background pattern to the document
 * This helps visualize transparent areas in images
 */
export function addCheckerboardStyles() {
  // Add CSS for transparent background checkerboard pattern if not already present
  if (!document.getElementById('checkerboard-style')) {
    const style = document.createElement('style');
    style.id = 'checkerboard-style';
    style.textContent = `
      .bg-checkerboard {
        background-image:
          linear-gradient(45deg, #f0f0f0 25%, transparent 25%),
          linear-gradient(-45deg, #f0f0f0 25%, transparent 25%),
          linear-gradient(45deg, transparent 75%, #f0f0f0 75%),
          linear-gradient(-45deg, transparent 75%, #f0f0f0 75%);
        background-size: 20px 20px;
        background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
      }
    `;
    document.head.appendChild(style);
  }
}

// Add checkerboard styles when this module is imported
addCheckerboardStyles();

/**
 * Create a T-shirt mockup with the processed image
 * @param {string} imageDataUrl - Processed image data URL
 * @returns {Promise<string>} - Mockup image data URL
 */
export async function createTShirtMockup(imageDataUrl) {
  return new Promise((resolve, reject) => {
    // Load T-shirt template and design image
    const tshirtImg = new Image();
    const designImg = new Image();
    
    // Track loading of both images
    let tshirtLoaded = false;
    let designLoaded = false;
    
    // Function to create mockup once both images are loaded
    const createMockupIfReady = () => {
      if (!tshirtLoaded || !designLoaded) return;
      
      try {
        // Create canvas for the mockup
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Set canvas size to match T-shirt template
        canvas.width = tshirtImg.width;
        canvas.height = tshirtImg.height;
        
        // Draw T-shirt template
        ctx.drawImage(tshirtImg, 0, 0);
        
        // Calculate design placement (center on the T-shirt)
        // This assumes the T-shirt template has a clear printing area
        // Adjust these values based on your actual T-shirt template
        const printAreaWidth = tshirtImg.width * 0.4;  // 40% of T-shirt width
        const printAreaHeight = tshirtImg.height * 0.4;  // 40% of T-shirt height
        const printAreaX = (tshirtImg.width - printAreaWidth) / 2;
        const printAreaY = tshirtImg.height * 0.25;  // 25% from the top
        
        // Scale design to fit print area while maintaining aspect ratio
        const designRatio = designImg.width / designImg.height;
        let designWidth, designHeight;
        
        if (designRatio > printAreaWidth / printAreaHeight) {
          // Design is wider than print area
          designWidth = printAreaWidth;
          designHeight = designWidth / designRatio;
        } else {
          // Design is taller than print area
          designHeight = printAreaHeight;
          designWidth = designHeight * designRatio;
        }
        
        // Center design in print area
        const designX = printAreaX + (printAreaWidth - designWidth) / 2;
        const designY = printAreaY + (printAreaHeight - designHeight) / 2;
        
        // Draw the design
        ctx.drawImage(designImg, designX, designY, designWidth, designHeight);
        
        // Convert canvas to data URL
        const mockupDataUrl = canvas.toDataURL('image/png');
        resolve(mockupDataUrl);
      } catch (error) {
        reject(new Error('Failed to create T-shirt mockup: ' + error.message));
      }
    };
    
    // Load the T-shirt template
    tshirtImg.onload = () => {
      tshirtLoaded = true;
      createMockupIfReady();
    };
    tshirtImg.onerror = () => reject(new Error('Failed to load T-shirt template'));
    
    // Load the design image
    designImg.onload = () => {
      designLoaded = true;
      createMockupIfReady();
    };
    designImg.onerror = () => reject(new Error('Failed to load design image'));
    
    // Set image sources
    // In a real implementation, you would use an actual T-shirt template image
    tshirtImg.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTAwLDE1MCBMMjUwLDUwIEw0MDAsMTUwIEw0NTAsNTAwIEw1MCw1MDAiIGZpbGw9IndoaXRlIiBzdHJva2U9IiNjY2MiIHN0cm9rZS13aWR0aD0iNSIvPjwvc3ZnPg==';
    designImg.src = imageDataUrl;
  });
}