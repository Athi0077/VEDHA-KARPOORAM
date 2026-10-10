import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CreditCard, CheckCircle, Loader2 } from 'lucide-react';
import axios from 'axios';

const Payment = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const customer = location.state?.customer;

  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleDummyPayment = () => {
    if (!customer) {
      alert("Missing customer details! Please go back to checkout.");
      navigate('/checkout');
      return;
    }

    setIsProcessing(true);
    
    // Simulate payment processing delay
    setTimeout(async () => {
      try {
        // Send order to backend
        const orderData = {
          customer,
          items: cart,
          totalAmount: cartTotal,
          status: 'Paid'
        };
        await axios.post('http://localhost:5005/api/orders', orderData);
        
        setIsProcessing(false);
        setPaymentSuccess(true);
        
        // Clear cart and redirect after showing success message
        setTimeout(() => {
          clearCart();
          navigate('/orders');
        }, 2000);
      } catch (err) {
        console.error('Failed to create order', err);
        alert('Failed to place order. Please try again.');
        setIsProcessing(false);
      }
    }, 1500);
  };

  if (paymentSuccess) {
    return (
      <div className="py-20 bg-gray-50 min-h-[60vh] flex items-center justify-center animate-in fade-in zoom-in duration-500">
        <div className="text-center p-12 bg-white rounded-3xl shadow-lg border border-green-100 max-w-md w-full transform transition-all">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
          <h2 className="text-3xl font-serif text-gray-900 mb-2">Payment Successful!</h2>
          <p className="text-gray-500">Your order has been placed successfully.</p>
          <p className="text-sm text-gray-400 mt-4">Redirecting to your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-gray-50 min-h-screen flex items-center justify-center animate-in fade-in">
      <div className="max-w-md w-full px-4">
        <div className="bg-white p-8 rounded-3xl shadow-md border border-gray-100 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-amber-500"></div>
          
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CreditCard className="w-10 h-10 text-blue-600" />
          </div>
          
          <h1 className="text-2xl font-serif text-gray-900 mb-2">Complete Payment</h1>
          <p className="text-gray-500 mb-8">Secure payment powered by Razorpay</p>
          
          <div className="bg-gray-50 rounded-xl p-6 mb-8 border border-gray-100">
            <p className="text-sm text-gray-500 mb-1">Total Amount to Pay</p>
            <p className="text-4xl font-bold text-gray-900">₹{cartTotal}</p>
          </div>
          
          <button 
            onClick={handleDummyPayment}
            disabled={isProcessing}
            className="w-full bg-[#02042b] hover:bg-blue-900 text-white py-4 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <span>Pay with Razorpay (Dummy)</span>
            )}
          </button>
          
          <p className="text-xs text-gray-400 mt-6">
            This is a dummy payment integration. Actual Razorpay keys will be added later. No real money will be deducted.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Payment;
