import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useQuota } from '../context/QuotaContext';
import { getUserImages } from '../services/StorageService';
import { downloadImage } from '../services/ImageService';

function Dashboard() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const { user } = useAuth();
  const { remainingQuota } = useQuota();

  useEffect(() => {
    // Load user's processed images
    async function loadImages() {
      try {
        setLoading(true);
        const userImages = await getUserImages(user?.id);
        setImages(userImages.filter(img => img.processedUrl));
      } catch (err) {
        console.error('Error loading images:', err);
        setError('Failed to load your images. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      loadImages();
    }
  }, [user]);

  const handleDownload = async (imageId) => {
    try {
      const downloadData = await downloadImage(imageId);
      
      // Create a download link
      const link = document.createElement('a');
      link.href = downloadData.downloadUrl;
      link.download = downloadData.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Download error:', err);
      setError('Failed to download image. Please try again.');
    }
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* User Dashboard Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Dashboard</h1>
          <div className="flex flex-wrap items-center justify-between">
            <div>
              <p className="text-gray-600">
                Welcome back, <span className="font-semibold">{user?.name || 'User'}</span>
              </p>
              <p className="text-blue-600 mt-1">
                You have {remainingQuota} free background removals remaining
              </p>
            </div>
            <a 
              href="/"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg mt-4 sm:mt-0"
            >
              Remove Another Background
            </a>
          </div>
        </div>

        {/* User's Processed Images */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Your Processed Images</h2>
          
          {loading ? (
            <div className="flex justify-center items-center h-48">
              <div className="spinner w-12 h-12 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border-l-4 border-red-500 p-4">
              <p className="text-red-700">{error}</p>
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
              <svg 
                className="mx-auto h-12 w-12 text-gray-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No processed images yet</h3>
              <p className="mt-1 text-sm text-gray-500">
                Go to the home page to remove backgrounds from your images.
              </p>
              <a
                href="/"
                className="mt-6 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
              >
                Process an Image
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {images.map((image) => (
                <div 
                  key={image.id} 
                  className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <div className="relative h-48 bg-gray-100">
                    <img 
                      src={image.processedUrl || image.thumbnailUrl} 
                      alt="Processed Image" 
                      className="h-full w-full object-cover cursor-pointer"
                      onClick={() => handleImageClick(image)}
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-gray-500 mb-2">
                      {new Date(image.createdAt).toLocaleDateString()}
                    </p>
                    <button
                      onClick={() => handleDownload(image.id)}
                      className="w-full bg-green-500 hover:bg-green-600 text-white text-sm font-bold py-2 px-3 rounded flex items-center justify-center"
                    >
                      <svg 
                        className="w-4 h-4 mr-2" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24" 
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                      </svg>
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Usage Statistics */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Your Usage Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="border rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Images Processed</h3>
              <p className="text-3xl font-bold text-blue-600">{images.length}</p>
            </div>
            <div className="border rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Remaining Free Usage</h3>
              <p className="text-3xl font-bold text-green-600">{remainingQuota}</p>
            </div>
            <div className="border rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Account Created</h3>
              <p className="text-lg text-gray-600">
                {user && user.createdAt 
                  ? new Date(user.createdAt).toLocaleDateString() 
                  : new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Image Preview Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center px-4 text-center">
            <div 
              className="fixed inset-0 bg-black opacity-50"
              onClick={closeImageModal}
            ></div>
            
            <div className="inline-block w-full max-w-4xl rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all transform">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Image Preview
                </h3>
                <button 
                  onClick={closeImageModal}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="flex flex-col md:flex-row gap-4 mt-4">
                {selectedImage.originalUrl && (
                  <div className="flex-1">
                    <p className="font-medium text-gray-700 mb-2">Original</p>
                    <div className="border rounded bg-gray-50 p-2">
                      <img 
                        src={selectedImage.originalUrl} 
                        alt="Original Image" 
                        className="max-h-[400px] mx-auto object-contain"
                      />
                    </div>
                  </div>
                )}
                
                <div className="flex-1">
                  <p className="font-medium text-gray-700 mb-2">Processed</p>
                  <div className="border rounded bg-gray-50 p-2">
                    <img 
                      src={selectedImage.processedUrl} 
                      alt="Processed Image" 
                      className="max-h-[400px] mx-auto object-contain"
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-center">
                <button
                  onClick={() => handleDownload(selectedImage.id)}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-full flex items-center"
                >
                  <svg 
                    className="w-5 h-5 mr-2" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;