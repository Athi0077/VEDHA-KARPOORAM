import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ShieldCheck, CheckCircle2, Loader2, Lock, ArrowLeft, Truck, CreditCard, Banknote } from 'lucide-react';
import axios from 'axios';

const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_live_TV7hXMB718NUCg';
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://vedha-karpooram.onrender.com';

const Payment = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const customer = location.state?.customer;

  const [paymentMethod, setPaymentMethod] = useState('online'); // 'online' | 'cod'
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [orderSummary, setOrderSummary] = useState(null);

  useEffect(() => {
    // If customer details are missing, return to checkout
    if (!customer) {
      navigate('/checkout');
    }
  }, [customer, navigate]);

  // Helper to save order to localStorage
  const saveOrderToLocalStorage = (savedOrder) => {
    try {
      const existing = JSON.parse(localStorage.getItem('vedha_orders') || '[]');
      const filtered = existing.filter((item) => item._id !== savedOrder._id);
      const updated = [savedOrder, ...filtered];
      localStorage.setItem('vedha_orders', JSON.stringify(updated));
    } catch (err) {
      console.error('Failed to save order into localStorage:', err);
    }
  };

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

  // Handle Online Payment via Razorpay
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

    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded || !window.Razorpay) {
      alert('Razorpay payment gateway failed to load. Please check your internet connection.');
      setIsProcessing(false);
      return;
    }

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

    const options = {
      key: effectiveKey,
      amount: Math.round(cartTotal * 100),
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
        color: '#ff6201'
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

          const orderPayload = {
            customer,
            items: cart,
            totalAmount: cartTotal,
            status: 'Paid',
            paymentMethod: 'Online (Razorpay)',
            paymentId: currentPaymentId,
            razorpayOrderId: response.razorpay_order_id || rzpOrderId || ''
          };

          let savedDbOrder = null;
          try {
            const verifyRes = await axios.post(`${API_BASE}/api/payment/verify`, {
              razorpay_order_id: response.razorpay_order_id || rzpOrderId || '',
              razorpay_payment_id: currentPaymentId,
              razorpay_signature: response.razorpay_signature || '',
              orderData: orderPayload
            });
            if (verifyRes.data?.success) {
              savedDbOrder = verifyRes.data.order;
            }
          } catch (verifyErr) {
            console.warn('Verification endpoint skipped, using direct order endpoint:', verifyErr);
          }

          if (!savedDbOrder) {
            const directRes = await axios.post(`${API_BASE}/api/orders`, orderPayload);
            savedDbOrder = directRes.data;
          }

          // Save into localStorage
          const localOrderData = {
            _id: savedDbOrder?._id || `RZP-${Date.now()}`,
            customer,
            items: cart,
            totalAmount: cartTotal,
            paymentMethod: 'Online (Razorpay)',
            paymentId: currentPaymentId,
            status: 'Paid',
            createdAt: new Date().toISOString()
          };
          saveOrderToLocalStorage(localOrderData);

          setOrderSummary(localOrderData);
          setIsProcessing(false);
          setPaymentSuccess(true);
          clearCart();

          setTimeout(() => {
            navigate('/orders');
          }, 2500);
        } catch (err) {
          console.error('Failed to complete order after payment:', err);
          alert(`Payment received (ID: ${response.razorpay_payment_id}), but order saving encountered an issue.`);
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

  // Handle Cash on Delivery (COD)
  const handleCODPayment = async () => {
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

    try {
      const orderPayload = {
        customer,
        items: cart,
        totalAmount: cartTotal,
        paymentMethod: 'Cash on Delivery',
        status: 'Cash on Delivery',
        paymentId: 'COD'
      };

      let savedDbOrder = null;
      try {
        const res = await axios.post(`${API_BASE}/api/orders`, orderPayload);
        savedDbOrder = res.data;
      } catch (postErr) {
        console.warn('Backend order POST error, storing in local fallback:', postErr);
      }

      // Save into localStorage
      const localOrderData = {
        _id: savedDbOrder?._id || `COD-${Date.now()}`,
        customer,
        items: cart,
        totalAmount: cartTotal,
        paymentMethod: 'Cash on Delivery',
        paymentId: 'COD',
        status: 'Cash on Delivery',
        createdAt: new Date().toISOString()
      };
      saveOrderToLocalStorage(localOrderData);

      setOrderSummary(localOrderData);
      setIsProcessing(false);
      setPaymentSuccess(true);
      clearCart();

      setTimeout(() => {
        navigate('/orders');
      }, 2500);
    } catch (err) {
      console.error('Failed to place COD order:', err);
      alert('Failed to place Cash on Delivery order. Please try again.');
      setIsProcessing(false);
    }
  };

  if (paymentSuccess) {
    const isCOD = orderSummary?.paymentMethod === 'Cash on Delivery';
    return (
      <div className="py-20 bg-gray-50 min-h-[70vh] flex items-center justify-center animate-in fade-in zoom-in duration-500">
        <div className="text-center p-10 bg-white rounded-3xl shadow-xl border border-green-100 max-w-md w-full mx-4">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-serif text-gray-900 mb-2">Order Confirmed!</h2>
          <p className="text-gray-600 mb-4">
            {isCOD
              ? 'Your Cash on Delivery order has been placed. Please pay with cash upon arrival.'
              : 'Thank you! Your payment was successful and your order has been placed.'}
          </p>

          <div className="bg-gray-50 rounded-2xl p-4 mb-6 border border-gray-100 text-left text-sm space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>Order ID:</span>
              <span className="font-mono text-gray-900 font-medium truncate max-w-[180px]">{orderSummary?._id}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Payment Mode:</span>
              <span className="font-semibold text-amber-900">{orderSummary?.paymentMethod}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Total Amount:</span>
              <span className="font-bold text-gray-900">₹{orderSummary?.totalAmount}</span>
            </div>
            {orderSummary?.paymentId && orderSummary.paymentId !== 'COD' && (
              <div className="flex justify-between text-gray-600">
                <span>Payment ID:</span>
                <span className="font-mono text-xs text-gray-700">{orderSummary.paymentId}</span>
              </div>
            )}
          </div>

          <p className="text-sm text-gray-400">Saved to your device & redirecting to My Orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-gray-50 min-h-screen flex items-center justify-center animate-in fade-in">
      <div className="max-w-lg w-full px-4">
        <button
          onClick={() => navigate('/checkout')}
          className="inline-flex items-center text-sm text-gray-500 hover:text-amber-800 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Delivery Details
        </button>

        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-md border border-gray-100 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-600 via-amber-800 to-amber-950"></div>

          <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-9 h-9 text-amber-800" />
          </div>

          <h1 className="text-2xl font-serif text-gray-900 mb-1">Confirm & Pay</h1>
          <p className="text-gray-500 text-sm mb-6">Choose your preferred payment method</p>

          {/* Delivery Details Summary */}
          {customer && (
            <div className="bg-amber-50/50 rounded-2xl p-4 mb-6 border border-amber-100 text-left text-sm">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-amber-950">Delivery Address:</span>
                <span className="text-xs text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded font-medium">Verified</span>
              </div>
              <p className="text-gray-800 font-medium">{customer.name}</p>
              <p className="text-gray-600 text-xs mt-0.5">{customer.phone} • {customer.email}</p>
              <p className="text-gray-500 text-xs mt-1 truncate">{customer.address}, {customer.landmark ? customer.landmark + ', ' : ''}{customer.pincode}</p>
            </div>
          )}

          {/* Total Amount Box */}
          <div className="bg-gray-50 rounded-2xl p-4 mb-6 border border-gray-100 flex items-center justify-between">
            <div className="text-left">
              <p className="text-xs uppercase tracking-wider text-gray-500 font-medium">Total Amount</p>
              <p className="text-xs text-gray-400">Including all taxes</p>
            </div>
            <p className="text-3xl font-bold text-amber-950">₹{cartTotal}</p>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-3 mb-6 text-left">
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
              Select Payment Method
            </label>

            {/* Option 1: Razorpay Online */}
            <div
              onClick={() => setPaymentMethod('online')}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                paymentMethod === 'online'
                  ? 'border-amber-800 bg-amber-50/40 shadow-sm'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="flex items-center space-x-3.5">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  paymentMethod === 'online' ? 'bg-amber-800 text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <p className="font-semibold text-gray-900 text-sm">Pay with Razorpay</p>
                    <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Online</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">UPI (GPay, PhonePe, Paytm), Cards, Netbanking</p>
                </div>
              </div>
              <input
                type="radio"
                name="paymentMethod"
                value="online"
                checked={paymentMethod === 'online'}
                onChange={() => setPaymentMethod('online')}
                className="w-4 h-4 text-amber-800 accent-amber-800"
              />
            </div>

            {/* Option 2: Cash on Delivery (COD) */}
            {/* <div
              onClick={() => setPaymentMethod('cod')}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                paymentMethod === 'cod'
                  ? 'border-amber-800 bg-amber-50/40 shadow-sm'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="flex items-center space-x-3.5">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  paymentMethod === 'cod' ? 'bg-amber-800 text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                  <Banknote className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <p className="font-semibold text-gray-900 text-sm">Cash on Delivery (COD)</p>
                    <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">COD</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">Pay in cash when your order arrives</p>
                </div>
              </div>
              <input
                type="radio"
                name="paymentMethod"
                value="cod"
                checked={paymentMethod === 'cod'}
                onChange={() => setPaymentMethod('cod')}
                className="w-4 h-4 text-amber-800 accent-amber-800"
              />
            </div> */}
          </div>

          {/* Action Buttons based on selection */}
          {paymentMethod === 'online' ? (
            <button
              onClick={handleRazorpayPayment}
              disabled={isProcessing}
              className="w-full bg-amber-800 hover:bg-amber-900 text-white py-4 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Opening Razorpay Gateway...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Pay ₹{cartTotal} with Razorpay</span>
                </>
              )}
            </button>
          ) : (
            <button
              onClick={handleCODPayment}
              disabled={isProcessing}
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-4 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Placing COD Order...</span>
                </>
              ) : (
                <>
                  <Truck className="w-4 h-4" />
                  <span>Place Order with Cash on Delivery (₹{cartTotal})</span>
                </>
              )}
            </button>
          )}

          {/* Security badge footer */}
          <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-center space-x-2 text-xs text-gray-400">
            <Lock className="w-3.5 h-3.5 text-gray-400" />
            <span>100% Secure • Order details automatically saved to device</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
