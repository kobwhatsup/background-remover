import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useQuota } from '../context/QuotaContext';
import ImageUploader from '../components/ImageUploader';
import ImagePreview from '../components/ImagePreview';
import ImageProcessing from '../components/ImageProcessing';
import AuthModal from '../components/AuthModal';

function Home() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user } = useAuth();
  const { remainingQuota } = useQuota();
  const navigate = useNavigate();

  // Handler for when an image is uploaded
  const handleImageUploaded = (imageData) => {
    setUploadedImage({
      id: imageData.id,
      url: imageData.originalUrl
    });
    setProcessedImage(null);
  };

  // Handler for when processing is complete
  const handleProcessingComplete = (result) => {
    setProcessedImage(result.processedUrl);
  };

  // Handler for when processing starts
  const handleProcessingStart = () => {
    setIsProcessing(true);
  };

  // Handler for image download
  const handleDownload = () => {
    if (processedImage) {
      const link = document.createElement('a');
      link.href = processedImage;
      link.download = `removed_bg_${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Remove Image Backgrounds Instantly
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Our AI-powered tool removes backgrounds from your images in seconds.
          Get 3 free removals, then choose to pay or watch an ad for more.
        </p>
      </section>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Step 1: Upload */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Step 1: Upload Your Image
            </h2>
            <ImageUploader onImageUploaded={handleImageUploaded} />
          </div>

          {/* Step 2: Process (only shown after upload) */}
          {uploadedImage && (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Step 2: Remove Background
              </h2>
              <ImageProcessing
                imageId={uploadedImage.id}
                onProcessingComplete={handleProcessingComplete}
                onProcessingStart={handleProcessingStart}
              />
            </div>
          )}

          {/* Step 3: Preview & Download */}
          {(uploadedImage || processedImage) && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                {processedImage ? "Step 3: Download Your Image" : "Image Preview"}
              </h2>
              <ImagePreview
                originalImage={uploadedImage?.url}
                processedImage={processedImage}
                onDownload={handleDownload}
                processing={isProcessing}
              />
            </div>
          )}
        </div>

        {/* Quota Information */}
        <div className="mt-6 text-center">
          {!user && (
            <div className="bg-blue-50 rounded-lg p-4 mb-4">
              <p className="text-blue-700">
                Sign up to track your free removals across devices!
              </p>
              <button 
                onClick={() => setShowAuthModal(true)}
                className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Create Account
              </button>
            </div>
          )}
          <p className="text-gray-600">
            {user ? `You have ${remainingQuota} free background removals remaining.` : 
            `Anonymous users get ${remainingQuota} free background removals.`}
          </p>
        </div>

        {/* Features Section */}
        <section className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Fast Processing</h3>
            <p className="text-gray-600">
              Our AI processes your image in seconds, removing backgrounds with precision.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Secure & Private</h3>
            <p className="text-gray-600">
              Your images are processed securely and never shared with third parties.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Flexible Options</h3>
            <p className="text-gray-600">
              Choose to pay per image or watch a short ad after using your free quota.
            </p>
          </div>
        </section>
      </div>

      {/* Authentication Modal */}
      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          mode="register"
        />
      )}
    </div>
  );
}

export default Home;