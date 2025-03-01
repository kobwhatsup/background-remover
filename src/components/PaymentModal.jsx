import React, { useState } from 'react';
import { createPayment, processPayment } from '../services/PaymentService';

function PaymentModal({ isOpen, onClose, onPaymentSuccess, onViewAd, imageId }) {
  const [step, setStep] = useState('options'); // options, payment, processing
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [currency, setCurrency] = useState('USD');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvc: '',
    name: ''
  });
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleCurrencyChange = (e) => {
    setCurrency(e.target.value);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCardDetails({
      ...cardDetails,
      [name]: value
    });
  };

  const handlePaymentMethodSelect = (method) => {
    setPaymentMethod(method);
    setStep('payment');
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsProcessing(true);

    try {
      // Create payment intent
      const paymentIntent = await createPayment(imageId, currency);
      
      // Process payment (in real app this would use Stripe or similar)
      const paymentResult = await processPayment(paymentIntent.id, cardDetails);
      
      // Handle success
      setIsProcessing(false);
      onPaymentSuccess();
    } catch (error) {
      setError('Payment failed. Please try again.');
      setIsProcessing(false);
    }
  };

  const getPriceByCountry = () => {
    return currency === 'USD' ? '$1.99' : '¥14';
  };

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
              {step === 'options' ? 'Get Your Processed Image' : 
               step === 'payment' ? 'Complete Payment' : 'Processing Payment'}
            </h3>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {step === 'options' && (
            <div className="mt-4">
              <p className="text-sm text-gray-500 mb-4">
                You've used all your free credits. Choose an option to continue:
              </p>
              
              <div className="flex flex-col space-y-3">
                <button
                  onClick={() => handlePaymentMethodSelect('card')}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded"
                >
                  Pay {getPriceByCountry()} for this image
                </button>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or</span>
                  </div>
                </div>
                
                <button
                  onClick={onViewAd}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded"
                >
                  Watch a 30-second advertisement instead
                </button>
              </div>
            </div>
          )}
          
          {step === 'payment' && (
            <div className="mt-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Currency
                </label>
                <select
                  value={currency}
                  onChange={handleCurrencyChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="USD">USD ($1.99)</option>
                  <option value="CNY">CNY (¥14)</option>
                </select>
              </div>
              
              <form onSubmit={handlePaymentSubmit}>
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={cardDetails.cardNumber}
                    onChange={handleInputChange}
                    placeholder="1234 5678 9012 3456"
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      name="expiryDate"
                      value={cardDetails.expiryDate}
                      onChange={handleInputChange}
                      placeholder="MM/YY"
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CVC
                    </label>
                    <input
                      type="text"
                      name="cvc"
                      value={cardDetails.cvc}
                      onChange={handleInputChange}
                      placeholder="123"
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name on Card
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={cardDetails.name}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                
                {error && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-3 mb-3">
                    <p className="text-red-700">{error}</p>
                  </div>
                )}
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setStep('options')}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className={`bg-blue-600 ${isProcessing ? 'opacity-75' : 'hover:bg-blue-700'} text-white font-bold py-2 px-4 rounded`}
                  >
                    {isProcessing ? 'Processing...' : `Pay ${getPriceByCountry()}`}
                  </button>
                </div>
              </form>
            </div>
          )}
          
          {step === 'processing' && (
            <div className="mt-4 flex flex-col items-center">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600">Processing your payment...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PaymentModal;