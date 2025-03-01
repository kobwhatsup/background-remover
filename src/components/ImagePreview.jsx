import React, { useState } from 'react';

function ImagePreview({ originalImage, processedImage, onDownload, processing }) {
  const [activeTab, setActiveTab] = useState('original');

  const downloadImage = () => {
    if (processedImage && typeof onDownload === 'function') {
      onDownload();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Tab navigation */}
      <div className="flex border-b">
        <button
          className={`flex-1 py-2 px-4 text-center ${
            activeTab === 'original'
              ? 'bg-white border-b-2 border-blue-500 text-blue-600'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          onClick={() => setActiveTab('original')}
        >
          Original
        </button>
        <button
          className={`flex-1 py-2 px-4 text-center ${
            activeTab === 'processed'
              ? 'bg-white border-b-2 border-blue-500 text-blue-600'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          onClick={() => setActiveTab('processed')}
          disabled={!processedImage && !processing}
        >
          {processing ? 'Processing...' : 'Result'}
        </button>
      </div>

      {/* Image preview area */}
      <div className="p-4">
        {activeTab === 'original' && originalImage && (
          <div className="flex justify-center">
            <img 
              src={originalImage} 
              alt="Original" 
              className="max-w-full max-h-[500px] object-contain"
            />
          </div>
        )}

        {activeTab === 'processed' && (
          <div className="flex justify-center">
            {processing ? (
              <div className="flex flex-col items-center justify-center h-[500px]">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-600">Removing background...</p>
              </div>
            ) : processedImage ? (
              <img 
                src={processedImage} 
                alt="Processed" 
                className="max-w-full max-h-[500px] object-contain"
              />
            ) : (
              <div className="flex items-center justify-center h-[500px]">
                <p className="text-gray-500">Process an image to see result</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Download button */}
      {processedImage && activeTab === 'processed' && (
        <div className="p-4 bg-gray-50 border-t flex justify-center">
          <button
            onClick={downloadImage}
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
      )}
    </div>
  );
}

export default ImagePreview;