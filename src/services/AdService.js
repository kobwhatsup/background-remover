// Mock advertisement service
const AD_VIEWS_KEY = 'ad_views';
const AD_COMPLETION_TIME = 30 * 1000; // 30 seconds in milliseconds

// Record the start of an ad view
export const recordAdView = async (imageId) => {
  try {
    // In a real app, this would call a backend API
    // For this demo, we'll use localStorage
    
    const adViewId = `adv_${Date.now()}`;
    const adView = {
      id: adViewId,
      imageId,
      startTime: Date.now(),
      completed: false,
      adType: 'video' // could be different types in a real app
    };
    
    // Store the ad view
    const adViews = JSON.parse(localStorage.getItem(AD_VIEWS_KEY) || '[]');
    adViews.push(adView);
    localStorage.setItem(AD_VIEWS_KEY, JSON.stringify(adViews));
    
    return { adViewId };
  } catch (error) {
    console.error('Error recording ad view:', error);
    throw error;
  }
};

// Verify that an ad was completed
export const verifyAdCompletion = async (adViewId) => {
  try {
    // In a real app, this would verify with backend
    // For this demo, we'll use localStorage and check if enough time has passed
    
    const adViews = JSON.parse(localStorage.getItem(AD_VIEWS_KEY) || '[]');
    const adViewIndex = adViews.findIndex(ad => ad.id === adViewId);
    
    if (adViewIndex === -1) {
      throw new Error('Ad view not found');
    }
    
    const adView = adViews[adViewIndex];
    const currentTime = Date.now();
    const watchTime = currentTime - adView.startTime;
    
    if (watchTime >= AD_COMPLETION_TIME) {
      // Ad was watched for enough time
      adViews[adViewIndex] = {
        ...adView,
        completed: true,
        endTime: currentTime
      };
      
      localStorage.setItem(AD_VIEWS_KEY, JSON.stringify(adViews));
      
      return { verified: true };
    } else {
      return { 
        verified: false,
        reason: 'Ad was not watched for the required duration',
        watchTime,
        requiredTime: AD_COMPLETION_TIME
      };
    }
  } catch (error) {
    console.error('Error verifying ad completion:', error);
    throw error;
  }
};

// Get the status of an ad view
export const getAdStatus = async (adViewId) => {
  try {
    const adViews = JSON.parse(localStorage.getItem(AD_VIEWS_KEY) || '[]');
    const adView = adViews.find(ad => ad.id === adViewId);
    
    if (!adView) {
      throw new Error('Ad view not found');
    }
    
    return {
      id: adView.id,
      completed: adView.completed,
      startTime: adView.startTime,
      endTime: adView.endTime || null
    };
  } catch (error) {
    console.error('Error getting ad status:', error);
    throw error;
  }
};