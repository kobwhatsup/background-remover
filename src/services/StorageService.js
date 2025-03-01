// Storage service for images
const IMAGES_KEY = 'stored_images';

// Upload an image (simulated)
export const uploadImage = async (imageFile, userId = null) => {
  try {
    // In a real app, this would upload to cloud storage like S3
    // For this demo, we'll create an object URL and store metadata
    
    const imageUrl = URL.createObjectURL(imageFile);
    const thumbnailUrl = imageUrl; // In real app, would generate a thumbnail
    
    const imageId = `img_${Date.now()}`;
    const imageData = {
      id: imageId,
      userId,
      originalUrl: imageUrl,
      thumbnailUrl,
      createdAt: new Date().toISOString(),
      filename: imageFile.name,
      fileType: imageFile.type,
      fileSize: imageFile.size
    };
    
    // Store in "database"
    const images = JSON.parse(localStorage.getItem(IMAGES_KEY) || '[]');
    images.push(imageData);
    localStorage.setItem(IMAGES_KEY, JSON.stringify(images));
    
    return imageId;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

// Get image URL
export const getImageUrl = async (imageId) => {
  try {
    const images = JSON.parse(localStorage.getItem(IMAGES_KEY) || '[]');
    const image = images.find(img => img.id === imageId);
    
    if (!image) {
      throw new Error('Image not found');
    }
    
    return image.originalUrl;
  } catch (error) {
    console.error('Error getting image URL:', error);
    throw error;
  }
};

// Delete an image
export const deleteImage = async (imageId) => {
  try {
    const images = JSON.parse(localStorage.getItem(IMAGES_KEY) || '[]');
    const imageIndex = images.findIndex(img => img.id === imageId);
    
    if (imageIndex === -1) {
      throw new Error('Image not found');
    }
    
    // In a real app, we would also delete from cloud storage
    
    // Remove from "database"
    images.splice(imageIndex, 1);
    localStorage.setItem(IMAGES_KEY, JSON.stringify(images));
    
    return true;
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
};

// Get images for a user
export const getUserImages = async (userId = null) => {
  try {
    const images = JSON.parse(localStorage.getItem(IMAGES_KEY) || '[]');
    
    if (!userId) {
      // For anonymous users, use device ID
      const deviceId = localStorage.getItem('device_id');
      return images.filter(img => img.userId === deviceId);
    }
    
    // For registered users
    return images.filter(img => img.userId === userId);
  } catch (error) {
    console.error('Error getting user images:', error);
    throw error;
  }
};

// Generate a presigned URL for download (simulated)
export const generatePresignedUrl = async (imageId) => {
  try {
    // In a real app, this would generate a presigned URL for cloud storage
    // For this demo, we'll just return the stored URL
    
    const images = JSON.parse(localStorage.getItem(IMAGES_KEY) || '[]');
    const image = images.find(img => img.id === imageId);
    
    if (!image) {
      throw new Error('Image not found');
    }
    
    if (!image.processedUrl) {
      throw new Error('Image has not been processed yet');
    }
    
    return image.processedUrl;
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    throw error;
  }
};