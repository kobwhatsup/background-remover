// Mock payment service for demonstration
const TRANSACTION_KEY = 'transactions';

// Price definitions
const PRICES = {
  USD: 1.99,
  CNY: 14
};

// Create a payment intent
export const createPayment = async (imageId, currency = 'USD') => {
  try {
    // In a real app, this would call a backend API that creates
    // a payment intent with Stripe or other payment processor
    
    // For this demo, we'll create a simulated payment intent
    const paymentIntent = {
      id: `pi_${Date.now()}`,
      amount: PRICES[currency] || PRICES.USD,
      currency,
      imageId,
      status: 'created',
      createdAt: new Date().toISOString()
    };
    
    // Store the payment intent for later verification
    const transactions = JSON.parse(localStorage.getItem(TRANSACTION_KEY) || '[]');
    transactions.push(paymentIntent);
    localStorage.setItem(TRANSACTION_KEY, JSON.stringify(transactions));
    
    return paymentIntent;
  } catch (error) {
    console.error('Error creating payment:', error);
    throw new Error('Payment initialization failed');
  }
};

// Process a payment (simulated)
export const processPayment = async (paymentIntentId, cardDetails) => {
  try {
    // In a real app, this would send the payment intent ID and
    // possibly a payment method ID to the backend
    
    // For this demo, we'll simulate payment processing
    const transactions = JSON.parse(localStorage.getItem(TRANSACTION_KEY) || '[]');
    const transactionIndex = transactions.findIndex(t => t.id === paymentIntentId);
    
    if (transactionIndex === -1) {
      throw new Error('Payment not found');
    }
    
    // Validate card details (simulated)
    if (!cardDetails.cardNumber || !cardDetails.expiryDate || !cardDetails.cvc || !cardDetails.name) {
      throw new Error('Invalid card information');
    }
    
    // Update the transaction
    transactions[transactionIndex] = {
      ...transactions[transactionIndex],
      status: 'succeeded',
      completedAt: new Date().toISOString()
    };
    
    localStorage.setItem(TRANSACTION_KEY, JSON.stringify(transactions));
    
    return {
      success: true,
      transactionId: paymentIntentId
    };
  } catch (error) {
    console.error('Error processing payment:', error);
    throw error;
  }
};

// Get payment status
export const getPaymentStatus = async (paymentId) => {
  try {
    const transactions = JSON.parse(localStorage.getItem(TRANSACTION_KEY) || '[]');
    const transaction = transactions.find(t => t.id === paymentId);
    
    if (!transaction) {
      throw new Error('Payment not found');
    }
    
    return {
      id: transaction.id,
      status: transaction.status,
      amount: transaction.amount,
      currency: transaction.currency
    };
  } catch (error) {
    console.error('Error getting payment status:', error);
    throw error;
  }
};

// Calculate price based on country/currency
export const calculatePrice = (currency = 'USD') => {
  return {
    amount: PRICES[currency] || PRICES.USD,
    currency,
    formatted: currency === 'USD' ? `$${PRICES.USD}` : `¥${PRICES.CNY}`
  };
};