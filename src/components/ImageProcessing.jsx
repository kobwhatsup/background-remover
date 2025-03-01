import React, { useState } from 'react';
import { processImage } from '../services/ImageService';
import { useQuota } from '../context/QuotaContext';
import { useAuth } from '../context/AuthContext';
import PaymentModal from './PaymentModal';
import AdModal from './AdModal';

function ImageProcessing({ imageId, onProcessingComplete, onProcessingStart }) {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showAdModal, setShowAdModal] = useState(false);
  const { checkQuota, decrementQuota, remainingQuota } = useQuota();
  const { user } = useAuth();

  const handleProcessImage = async () => {
    setError(null);
    
    // Check if user has remaining quota
    const quota = await checkQuota(user?.id);
    
    if (quota > 0) {
      // User has quota, process the image
      processWithQuota();
    } else {
      // No quota, show payment options
      showMonetizationOptions();
    }
  };

  const processWithQuota = async () => {
    try {
      setProcessing(true);
      if (onProcessingStart) onProcessingStart();
      
      // Decrement quota first
      await decrementQuota(user?.id);
      
      // Process the image
      const result = await processImage(imageId);
      
      if (onProcessingComplete) {
        onProcessingComplete(result);
      }
    } catch (error) {
      console.error('Error processing image:', error);
      setError('Failed to process image. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const showMonetizationOptions = () => {
    // Show payment or ad options
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = async () => {
    setShowPaymentModal(false);
    await processAfterMonetization();
  };

  const handlePaymentCancel = () => {
    setShowPaymentModal(false);
  };

  const handleViewAd = () => {
    setShowPaymentModal(false);
    setShowAdModal(true);
  };

  const handleAdComplete = async () => {
    setShowAdModal(false);
    await processAfterMonetization();
  };

  const handleAdError = () => {
    setShowAdModal(false);
    setError('There was a problem with the advertisement. Please try again or choose another option.');
  };

  const processAfterMonetization = async () => {
    try {
      setProcessing(true);
      if (onProcessingStart) onProcessingStart();
      
      // Process the image without decrementing quota (already paid or watched ad)
      const result = await processImage(imageId);
      
      if (onProcessingComplete) {
        onProcessingComplete(result);
      }
    } catch (error) {
      console.error('Error processing image:', error);
      setError('Failed to process image. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto text-center">
      {remainingQuota > 0 && (
        <p className="text-sm text-gray-600 mb-2">
          You have {remainingQuota} free background removals left
        </p>
      )}
      
      <button
        onClick={handleProcessImage}
        disabled={processing || !imageId}
        className={`w-full py-3 px-6 rounded-lg text-white font-bold ${
          processing
            ? 'bg-gray-400 cursor-not-allowed'
            : imageId
            ? 'bg-blue-600 hover:bg-blue-700'
            : 'bg-gray-400 cursor-not-allowed'
        }`}
      >
        {processing ? 'Processing...' : 'Remove Background'}
      </button>
      
      {remainingQuota === 0 && !processing && (
        <p className="text-xs text-gray-500 mt-2">
          You've used all free removals. Payment or ad viewing required.
        </p>
      )}
      
      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
      
      {showPaymentModal && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={handlePaymentCancel}
          onPaymentSuccess={handlePaymentSuccess}
          onViewAd={handleViewAd}
          imageId={imageId}
        />
      )}
      
      {showAdModal && (
        <AdModal
          isOpen={showAdModal}
          onClose={() => setShowAdModal(false)}
          onAdComplete={handleAdComplete}
          onAdError={handleAdError}
          imageId={imageId}
        />
      )}
    </div>
  );
}

export default ImageProcessing;