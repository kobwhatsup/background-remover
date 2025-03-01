import React, { useState, useEffect } from 'react';
import { recordAdView, verifyAdCompletion } from '../services/AdService';

function AdModal({ isOpen, onClose, onAdComplete, onAdError, imageId }) {
  const [adLoaded, setAdLoaded] = useState(false);
  const [watching, setWatching] = useState(false);
  const [progress, setProgress] = useState(0);
  const [adViewId, setAdViewId] = useState(null);
  const [error, setError] = useState(null);
  
  const TOTAL_AD_TIME = 30; // 30 seconds
  
  useEffect(() => {
    if (isOpen) {
      loadAd();
    }
    
    return () => {
      // Cleanup timer if component unmounts
      if (watching) {
        setWatching(false);
      }
    };
  }, [isOpen]);
  
  useEffect(() => {
    let timer;
    
    if (watching) {
      const startTime = Date.now();
      
      timer = setInterval(() => {
        const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
        const newProgress = Math.min(100, (elapsedSeconds / TOTAL_AD_TIME) * 100);
        
        setProgress(newProgress);
        
        if (elapsedSeconds >= TOTAL_AD_TIME) {
          completeAd();
        }
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [watching]);
  
  const loadAd = async () => {
    try {
      // In a real app, we would load an actual ad here
      setAdLoaded(false);
      
      // Record that an ad view has started
      const result = await recordAdView(imageId);
      setAdViewId(result.adViewId);
      
      // Simulate ad loading delay
      setTimeout(() => {
        setAdLoaded(true);
      }, 1500);
    } catch (err) {
      console.error("Error loading ad:", err);
      setError("Failed to load advertisement. Please try again.");
    }
  };
  
  const startWatching = () => {
    setWatching(true);
  };
  
  const completeAd = async () => {
    if (!adViewId) return;
    
    setWatching(false);
    
    try {
      // Verify ad completion
      const result = await verifyAdCompletion(adViewId);
      
      if (result.verified) {
        onAdComplete();
      } else {
        setError("Ad verification failed. Please try again.");
      }
    } catch (err) {
      console.error("Error verifying ad completion:", err);
      setError("Failed to verify ad completion. Please try again.");
      onAdError();
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4 text-center">
        <div 
          className="fixed inset-0 bg-black opacity-30"
          onClick={onClose}
        ></div>
        
        <div className="inline-block w-full max-w-md rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all transform">
          <div className="flex justify-between items-center border-b pb-3">
            <h3 className="text-lg font-medium text-gray-900">
              Watch Advertisement
            </h3>
            {!watching && (
              <button 
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          
          <div className="mt-4">
            {error ? (
              <div className="bg-red-50 border-l-4 border-red-500 p-4">
                <p className="text-red-700">{error}</p>
                <button
                  onClick={loadAd}
                  className="mt-3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Try Again
                </button>
              </div>
            ) : !adLoaded ? (
              <div className="flex flex-col items-center justify-center h-64">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-600">Loading advertisement...</p>
              </div>
            ) : !watching ? (
              <div className="flex flex-col items-center">
                <div className="bg-gray-200 h-48 w-full flex items-center justify-center mb-4">
                  <div className="text-gray-500">Ad Preview</div>
                </div>
                
                <p className="text-gray-600 text-sm mb-4">
                  Watch this 30-second advertisement to get your processed image for free.
                </p>
                
                <button
                  onClick={startWatching}
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-6 rounded"
                >
                  Start Watching
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="bg-gray-200 h-48 w-full flex items-center justify-center mb-4">
                  <div className="text-gray-500">Advertisement Playing</div>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                
                <p className="text-gray-600 text-sm">
                  Please watch the entire ad. {Math.ceil(TOTAL_AD_TIME - (progress / 100 * TOTAL_AD_TIME))} seconds remaining...
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdModal;