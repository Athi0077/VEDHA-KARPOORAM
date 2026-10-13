import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ShieldCheck, CheckCircle2, Loader2, Lock, ArrowLeft } from 'lucide-react';
import axios from 'axios';

const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_live_TV7hXMB718NUCg';
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://vedha-karpooram.onrender.com';

const Payment = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const customer = location.state?.customer;

  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentId, setPaymentId] = useState('');

  useEffect(() => {
    // If user lands directly on /payment without customer details, redirect to checkout
    if (!customer) {
      navigate('/checkout');
    }
  }, [customer, navigate]);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleRazorpayPayment = async () => {
    if (!customer) {
      alert('Missing customer details! Please fill delivery details first.');
      navigate('/checkout');
      return;
    }

    if (!cartTotal || cartTotal <= 0) {
      alert('Cart is empty. Please add items to proceed.');
      navigate('/offers');
      return;
    }

    setIsProcessing(true);

    // 1. Ensure Razorpay Checkout script is loaded
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded || !window.Razorpay) {
      alert('Razorpay payment gateway failed to load. Please check your internet connection.');
      setIsProcessing(false);
      return;
    }

    // 2. Attempt to create order on backend
    let rzpOrderId = null;
    let effectiveKey = RAZORPAY_KEY;
    try {
      const orderRes = await axios.post(`${API_BASE}/api/payment/create-order`, {
        amount: cartTotal
      });
      if (orderRes.data && orderRes.data.orderId) {
        rzpOrderId = orderRes.data.orderId;
        if (orderRes.data.keyId) {
          effectiveKey = orderRes.data.keyId;
        }
      }
    } catch (orderErr) {
      console.warn('Backend order creation skipped or failed, proceeding with direct live payment:', orderErr);
    }

    // 3. Configure Razorpay options
    const options = {
      key: effectiveKey,
      amount: Math.round(cartTotal * 100), // amount in paise (1 INR = 100 paise)
      currency: 'INR',
      name: 'VEDHA KARPOORAM',
      description: 'Pure Camphor Products Order',
      image: '/favicon.svg',
      ...(rzpOrderId ? { order_id: rzpOrderId } : {}),
      prefill: {
        name: customer?.name || '',
        email: customer?.email || '',
        contact: customer?.phone || ''
      },
      notes: {
        delivery_address: `${customer?.address || ''}, ${customer?.landmark || ''}, ${customer?.pincode || ''}`,
        phone: customer?.phone || ''
      },
      theme: {
        color: '#78350f' // Amber brand theme
      },
      modal: {
        ondismiss: () => {
          setIsProcessing(false);
        }
      },
      handler: async (response) => {
        try {
          setIsProcessing(true);
          const currentPaymentId = response.razorpay_payment_id;
          setPaymentId(currentPaymentId);

          const orderData = {
            customer,
            items: cart,
            totalAmount: cartTotal,
            status: 'Paid',
            paymentId: currentPaymentId,
            razorpayOrderId: response.razorpay_order_id || rzpOrderId || ''
          };

          // Verify with backend
          let orderSaved = false;
          try {
            const verifyRes = await axios.post(`${API_BASE}/api/payment/verify`, {
              razorpay_order_id: response.razorpay_order_id || rzpOrderId || '',
              razorpay_payment_id: currentPaymentId,
              razorpay_signature: response.razorpay_signature || '',
              orderData
            });
            if (verifyRes.data?.success) {
              orderSaved = true;
            }
          } catch (verifyErr) {
            console.warn('Verification endpoint failed, falling back to direct order save:', verifyErr);
          }

          // Fallback order save
          if (!orderSaved) {
            await axios.post(`${API_BASE}/api/orders`, orderData);
          }

          setIsProcessing(false);
          setPaymentSuccess(true);
          clearCart();

          setTimeout(() => {
            navigate('/orders');
          }, 3000);
        } catch (err) {
          console.error('Failed to save order after payment:', err);
          alert(`Payment was successful (Payment ID: ${response.razorpay_payment_id}), but saving order had an issue. Please contact support.`);
          setIsProcessing(false);
        }
      }
    };

    try {
      const rzpInstance = new window.Razorpay(options);
      rzpInstance.on('payment.failed', (response) => {
        console.error('Payment failed:', response.error);
        alert(`Payment Failed: ${response.error.description || 'Transaction was declined.'}`);
        setIsProcessing(false);
      });
      rzpInstance.open();
    } catch (err) {
      console.error('Error opening Razorpay modal:', err);
      alert('Unable to open Razorpay payment modal. Please try again.');
      setIsProcessing(false);
    }
  };

  if (paymentSuccess) {
    return (
      <div className="py-20 bg-gray-50 min-h-[70vh] flex items-center justify-center animate-in fade-in zoom-in duration-500">
        <div className="text-center p-10 bg-white rounded-3xl shadow-xl border border-green-100 max-w-md w-full mx-4">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-serif text-gray-900 mb-2">Payment Successful!</h2>
          <p className="text-gray-600 mb-4">Thank you for your order. Your payment has been received.</p>
          {paymentId && (
            <div className="bg-gray-50 rounded-xl p-3 mb-6 border border-gray-200">
              <span className="text-xs text-gray-500 block mb-1">Razorpay Payment ID</span>
              <span className="text-sm font-mono font-medium text-gray-800 break-all">{paymentId}</span>
            </div>
          )}
          <p className="text-sm text-gray-400">Redirecting to your orders page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-gray-50 min-h-screen flex items-center justify-center animate-in fade-in">
      <div className="max-w-md w-full px-4">
        <button
          onClick={() => navigate('/checkout')}
          className="inline-flex items-center text-sm text-gray-500 hover:text-amber-800 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Delivery Details
        </button>

        <div className="bg-white p-8 rounded-3xl shadow-md border border-gray-100 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-600 via-amber-800 to-amber-950"></div>

          <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="w-10 h-10 text-amber-800" />
          </div>

          <h1 className="text-2xl font-serif text-gray-900 mb-1">Confirm & Pay</h1>
          <p className="text-gray-500 text-sm mb-6">Secured live payment powered by Razorpay</p>

          {customer && (
            <div className="bg-amber-50/50 rounded-2xl p-4 mb-6 border border-amber-100 text-left text-sm">
              <p className="font-semibold text-amber-950 mb-1">Delivery to:</p>
              <p className="text-gray-700 font-medium">{customer.name}</p>
              <p className="text-gray-600 text-xs mt-1">{customer.phone} • {customer.email}</p>
              <p className="text-gray-500 text-xs mt-1 truncate">{customer.address}, {customer.pincode}</p>
            </div>
          )}

          <div className="bg-gray-50 rounded-2xl p-5 mb-6 border border-gray-100">
            <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Total Amount</p>
            <p className="text-4xl font-bold text-amber-950">₹{cartTotal}</p>
          </div>

          <button
            onClick={handleRazorpayPayment}
            disabled={isProcessing}
            className="w-full bg-amber-800 hover:bg-amber-900 text-white py-4 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Processing Payment...</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Pay ₹{cartTotal} with Razorpay</span>
              </>
            )}
          </button>

          <div className="mt-6 pt-5 border-t border-gray-100 flex items-center justify-center space-x-2 text-xs text-gray-400">
            <Lock className="w-3.5 h-3.5 text-gray-400" />
            <span>UPI, Cards, Netbanking & Wallets supported</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
