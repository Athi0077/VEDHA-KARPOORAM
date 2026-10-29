import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Sparkles,
  ShieldCheck,
  Award,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Lock,
  Loader2,
  CheckCircle2,
  ShoppingBag,
  FileText,
  Calendar,
  Gift,
  HelpCircle,
  Truck
} from 'lucide-react';

const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_live_TV7hXMB718NUCg';
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://vedha-karpooram.onrender.com';

const TermsAndConditions = () => {
  const navigate = useNavigate();

  // State for prizes from backend
  const [prices, setPrices] = useState([]);
  const [loadingPrices, setLoadingPrices] = useState(true);

  // Bottom 25% sliding carousel state
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isNearBottom, setIsNearBottom] = useState(false);

  // Participation Container state
  const [showParticipateContainer, setShowParticipateContainer] = useState(false);
  const [customer, setCustomer] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    landmark: '',
    pincode: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);

  // Contest product details from backend
  const [contestProduct, setContestProduct] = useState({
    name: 'Vedha Festival Special Pooja Camphor Combo Pack',
    description: '100% Pure, soot-free aromatic Bhimseni & round camphor tablets with 1 Official Contest Entry Ticket.',
    price: 150,
    originalPrice: 250,
    image: 'https://images.unsplash.com/photo-1601006596160-59a61350a8a6?q=80&w=600&auto=format&fit=crop'
  });

  // Refs for scroll observation
  const bottomSectionRef = useRef(null);
  const participateSectionRef = useRef(null);

  // Fetch prices and participate product from backend
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/prices`);
        const priceList = Array.isArray(res.data) ? res.data : [];
        setPrices(priceList);
      } catch (err) {
        console.error('Failed to load prices for terms page:', err);
        setPrices([]);
      } finally {
        setLoadingPrices(false);
      }
    };

    const fetchParticipateProduct = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/participate-product`);
        if (res.data && res.data.name) {
          setContestProduct({
            name: res.data.name,
            description: res.data.description || '',
            price: Number(res.data.price) || 150,
            originalPrice: res.data.originalPrice ? Number(res.data.originalPrice) : undefined,
            image: res.data.image || 'https://images.unsplash.com/photo-1601006596160-59a61350a8a6?q=80&w=600&auto=format&fit=crop'
          });
        }
      } catch (err) {
        console.error('Failed to fetch participate product:', err);
      }
    };

    fetchPrices();
    fetchParticipateProduct();
  }, []);

  // Auto-slide the 25% bottom prize bar every 2.5 seconds
  useEffect(() => {
    if (prices.length <= 1) return;
    const interval = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % prices.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [prices.length]);

  // Observer to check if user has scrolled past the Terms & Conditions
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsNearBottom(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (bottomSectionRef.current) {
      observer.observe(bottomSectionRef.current);
    }

    return () => {
      if (bottomSectionRef.current) {
        observer.unobserve(bottomSectionRef.current);
      }
    };
  }, []);

  // Razorpay Script loader helper
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

  // Helper to save order to localStorage
  const saveOrderToLocalStorage = (savedOrder) => {
    try {
      const existing = JSON.parse(localStorage.getItem('vedha_orders') || '[]');
      const filtered = existing.filter((item) => item._id !== savedOrder._id);
      const updated = [savedOrder, ...filtered];
      localStorage.setItem('vedha_orders', JSON.stringify(updated));
    } catch (err) {
      console.error('Failed to save order to localStorage:', err);
    }
  };

  // Handle Razorpay payment for Contest Participation
  const handleParticipateOrder = async (e) => {
    e.preventDefault();

    if (!customer.name.trim() || !customer.phone.trim() || !customer.address.trim() || !customer.pincode.trim()) {
      alert('Please fill in all required delivery details (Name, Phone, Address, Pincode).');
      return;
    }

    setIsProcessing(true);

    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded || !window.Razorpay) {
      alert('Razorpay payment gateway failed to load. Please check your internet connection.');
      setIsProcessing(false);
      return;
    }

    // Attempt to create backend order
    let rzpOrderId = null;
    let effectiveKey = RAZORPAY_KEY;
    try {
      const orderRes = await axios.post(`${API_BASE}/api/payment/create-order`, {
        amount: contestProduct.price
      });
      if (orderRes.data && orderRes.data.orderId) {
        rzpOrderId = orderRes.data.orderId;
        if (orderRes.data.keyId) {
          effectiveKey = orderRes.data.keyId;
        }
      }
    } catch (orderErr) {
      console.warn('Backend order creation skipped, proceeding directly:', orderErr);
    }

    const options = {
      key: effectiveKey,
      amount: Math.round(contestProduct.price * 100),
      currency: 'INR',
      name: 'VEDHA DEVOTIONAL MART',
      description: 'Contest Entry - ' + contestProduct.name,
      image: '/favicon.svg',
      ...(rzpOrderId ? { order_id: rzpOrderId } : {}),
      prefill: {
        name: customer.name,
        email: customer.email || 'customer@vedhakarpooram.com',
        contact: customer.phone
      },
      notes: {
        delivery_address: `${customer.address}, ${customer.landmark ? customer.landmark + ', ' : ''}${customer.pincode}`,
        phone: customer.phone,
        type: 'Contest Participation'
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
          const paymentId = response.razorpay_payment_id;

          const orderPayload = {
            customer,
            items: [
              {
                name: contestProduct.name,
                price: contestProduct.price,
                quantity: 1,
                image: contestProduct.image
              }
            ],
            totalAmount: contestProduct.price,
            status: 'Paid',
            paymentMethod: 'Online (Razorpay)',
            paymentId,
            razorpayOrderId: response.razorpay_order_id || rzpOrderId || '',
            notes: 'Contest Entry Participation'
          };

          let savedDbOrder = null;
          try {
            const verifyRes = await axios.post(`${API_BASE}/api/payment/verify`, {
              razorpay_order_id: response.razorpay_order_id || rzpOrderId || '',
              razorpay_payment_id: paymentId,
              razorpay_signature: response.razorpay_signature || '',
              orderData: orderPayload
            });
            if (verifyRes.data?.success) {
              savedDbOrder = verifyRes.data.order;
            }
          } catch (verifyErr) {
            console.warn('Verify endpoint skipped, using direct orders fallback:', verifyErr);
          }

          if (!savedDbOrder) {
            const directRes = await axios.post(`${API_BASE}/api/orders`, orderPayload);
            savedDbOrder = directRes.data;
          }

          // Save into user's localStorage
          const localOrderData = {
            _id: savedDbOrder?._id || `CONTEST-${Date.now()}`,
            customer,
            items: orderPayload.items,
            totalAmount: contestProduct.price,
            paymentMethod: 'Online (Razorpay)',
            paymentId,
            status: 'Paid',
            createdAt: new Date().toISOString()
          };
          saveOrderToLocalStorage(localOrderData);

          setOrderSuccess(localOrderData);
          setIsProcessing(false);
        } catch (err) {
          console.error('Failed to complete participation order:', err);
          alert(`Payment received (${response.razorpay_payment_id}), but order saving had an issue. Please contact support.`);
          setIsProcessing(false);
        }
      }
    };

    try {
      const rzpInstance = new window.Razorpay(options);
      rzpInstance.on('payment.failed', (response) => {
        console.error('Payment failed:', response.error);
        alert(`Payment Failed: ${response.error.description || 'Transaction declined.'}`);
        setIsProcessing(false);
      });
      rzpInstance.open();
    } catch (err) {
      console.error('Error opening Razorpay modal:', err);
      alert('Unable to launch Razorpay. Please try again.');
      setIsProcessing(false);
    }
  };

  const handleOpenParticipate = () => {
    setShowParticipateContainer(true);
    setTimeout(() => {
      participateSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const formatPrice = (amount) => {
    if (!amount) return '₹0';
    const trimmed = String(amount).trim();
    if (/^\d+(\.\d+)?$/.test(trimmed)) {
      return '₹' + Number(trimmed).toLocaleString('en-IN');
    }
    if (!trimmed.startsWith('₹') && !trimmed.toLowerCase().startsWith('rs')) {
      return '₹' + trimmed;
    }
    return trimmed;
  };

  return (
    <div className="relative min-h-screen bg-[#faf8f5] text-gray-900 pb-32">
      {/* ----------------- Top Hero Header ----------------- */}
      <section className="bg-gradient-to-b from-amber-100/70 via-amber-50 to-[#faf8f5] py-14 sm:py-18 border-b border-amber-200/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 bg-amber-800 text-amber-100 px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium mb-4 shadow-sm">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Vedha Devotional Mart Celebration Lucky Draw</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif text-amber-950 font-bold tracking-tight mb-4">
            Terms & Conditions
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Please read the official contest rules, lucky draw guidelines, and prize allocation policies carefully before participating.
          </p>
        </div>
      </section>

      {/* ----------------- 75% Main Terms & Conditions Section ----------------- */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-gray-100 space-y-10">
          {/* Section 1 */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3 text-amber-900">
              <span className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center font-bold text-sm">
                01
              </span>
              <h2 className="text-xl sm:text-2xl font-serif font-bold">Introduction & Eligibility</h2>
            </div>
            <div className="text-gray-600 text-sm sm:text-base leading-relaxed pl-11 space-y-2">
              <p>
                The Vedha Devotional Mart Celebration Lucky Draw is conducted by Vedha Devotional Mart for valued customers across India. Participation in this promotion constitutes full and unconditional agreement to these terms.
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                <li>Participants must be residents of India aged 18 years or above.</li>
                <li>Each valid purchase of the specified contest pack grants one guaranteed entry into the lucky draw.</li>
                <li>Employees, immediate family members, and affiliates are not eligible for grand prizes.</li>
              </ul>
            </div>
          </div>

          {/* Section 2 */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3 text-amber-900">
              <span className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center font-bold text-sm">
                02
              </span>
              <h2 className="text-xl sm:text-2xl font-serif font-bold">Contest Period & Schedule</h2>
            </div>
            <div className="text-gray-600 text-sm sm:text-base leading-relaxed pl-11 space-y-2">
              <p>
                The contest commences as announced and entries will close on the specified festival date. All orders completed with successful payment before the deadline will be automatically registered into the draw.
              </p>
              <p>
                Late, incomplete, or declined payment transactions will not be entered into the lucky draw system.
              </p>
            </div>
          </div>

          {/* Section 3 */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3 text-amber-900">
              <span className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center font-bold text-sm">
                03
              </span>
              <h2 className="text-xl sm:text-2xl font-serif font-bold">Prizes & Winner Selection</h2>
            </div>
            <div className="text-gray-600 text-sm sm:text-base leading-relaxed pl-11 space-y-2">
              <p>
                Winners for the 1st Prize, 2nd Prize, 3rd Prize, and other announced prize tiers will be selected through an unbiased computerized random draw system.
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                <li>Prizes are non-transferable and cannot be exchanged for alternate cash amounts unless explicitly permitted by Vedha Devotional Mart.</li>
                <li>Winners will be notified via their registered mobile number and email within 7 working days of the draw.</li>
                <li>Valid government-issued photo ID verification (Aadhaar/PAN) is required to claim the grand prizes.</li>
              </ul>
            </div>
          </div>

          {/* Section 4 */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3 text-amber-900">
              <span className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center font-bold text-sm">
                04
              </span>
              <h2 className="text-xl sm:text-2xl font-serif font-bold">Product Delivery & Order Verification</h2>
            </div>
            <div className="text-gray-600 text-sm sm:text-base leading-relaxed pl-11 space-y-2">
              <p>
                Every contest participation pack purchased will be securely packed and dispatched to the customer's delivery address via verified courier partners within 3 to 7 business days.
              </p>
              <p>
                Tracking information will be updated in the customer portal and sent via SMS once dispatched.
              </p>
            </div>
          </div>

          {/* Section 5 */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3 text-amber-900">
              <span className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center font-bold text-sm">
                05
              </span>
              <h2 className="text-xl sm:text-2xl font-serif font-bold">Cancellation, Returns & Disclaimers</h2>
            </div>
            <div className="text-gray-600 text-sm sm:text-base leading-relaxed pl-11 space-y-2">
              <p>
                Due to the lucky draw ticket inclusion with contest combo packs, order cancellations are not permitted once the payment has been completed and the entry ticket is generated.
              </p>
              <p>
                In the rare event of damaged transit goods, a replacement product will be provided upon proof of delivery damage. Vedha Devotional Mart reserves the right to modify or conclude the contest terms in accordance with applicable laws.
              </p>
            </div>
          </div>

          {/* Note to User */}
          <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200/80 text-xs text-amber-900 flex items-start space-x-3">
            <HelpCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Custom Terms Content Notice:</p>
              <p className="text-gray-600 mt-0.5">
                These standard terms are configured for your convenience. You can provide your exact terms and conditions text anytime and it will be updated here.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Sentinel element to detect end of terms */}
      <div ref={bottomSectionRef} className="h-4"></div>

      {/* ----------------- End of Terms: Normal Full Prizes Section ----------------- */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-amber-100 text-amber-900 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
            <Gift className="w-4 h-4 text-amber-700" />
            <span>Official Prize Showcase</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif text-amber-950 font-bold mb-3">
            Contest Prizes & Rewards
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto text-sm sm:text-base">
            Here are all the exciting prizes you can win! Participate today with our special contest pooja pack.
          </p>
        </div>

        {/* Normal Grid Display of Prizes */}
        {loadingPrices ? (
          <div className="flex flex-col items-center justify-center py-16 text-amber-800 space-y-3">
            <Loader2 className="w-8 h-8 animate-spin" />
            <span className="text-sm">Loading prizes...</span>
          </div>
        ) : prices.length === 0 ? (
          <div className="text-center bg-white p-8 rounded-3xl border border-dashed border-amber-200 max-w-md mx-auto">
            <Award className="w-12 h-12 text-amber-700 mx-auto mb-3" />
            <h3 className="text-lg font-serif font-bold text-amber-950">Prizes will be announced shortly</h3>
            <p className="text-xs text-gray-500 mt-1">Check back soon for the full prize list.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-16">
            {prices.map((item, idx) => (
              <div
                key={item._id || idx}
                className="bg-white rounded-3xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-amber-200 flex flex-col group"
              >
                <div className="aspect-[4/3] rounded-2xl bg-amber-50/50 overflow-hidden relative mb-4 border border-gray-100 flex items-center justify-center">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <Award className="w-16 h-16 text-amber-600/40" />
                  )}
                  <span className="absolute top-3 right-3 bg-white/95 backdrop-blur-md text-amber-900 border border-amber-200 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                    {formatPrice(item.amount)}
                  </span>
                </div>
                <h3 className="text-xl font-serif font-bold text-amber-950 mb-1 group-hover:text-amber-800 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-500 flex-grow mb-4 line-clamp-2">
                  {item.description || 'Grand celebration prize.'}
                </p>
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">Prize Value</span>
                  <span className="text-xl font-bold font-serif text-gray-900">{formatPrice(item.amount)}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ----------------- The "Participate" Button ----------------- */}
        <div className="text-center pt-4">
          <button
            onClick={handleOpenParticipate}
            className="inline-flex items-center space-x-3 px-10 py-5 bg-gradient-to-r from-amber-700 via-amber-800 to-amber-950 hover:from-amber-800 hover:to-black text-white font-serif text-lg sm:text-xl font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-amber-900/30 transform hover:-translate-y-1 transition-all cursor-pointer"
          >
            <Sparkles className="w-6 h-6 text-amber-300 animate-pulse" />
            <span>Participate in Contest</span>
            <ArrowRight className="w-5 h-5 ml-1" />
          </button>
          <p className="text-xs text-gray-400 mt-3">
            Click to view participation package & enter the live lucky draw
          </p>
        </div>

        {/* ----------------- Participation Container (Product + Order Details) ----------------- */}
        {showParticipateContainer && (
          <div
            ref={participateSectionRef}
            className="mt-16 bg-white rounded-3xl p-6 sm:p-10 shadow-2xl border-2 border-amber-300/80 animate-in fade-in slide-in-from-bottom-6 duration-500 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-2.5 bg-gradient-to-r from-amber-500 via-amber-700 to-amber-950"></div>

            <div className="text-center max-w-2xl mx-auto mb-8">
              <span className="inline-block bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider px-3.5 py-1 rounded-full mb-2">
                Official Contest Entry
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif text-amber-950 font-bold mb-2">
                Get Your Contest Pack & Enter the Draw
              </h3>
              <p className="text-xs sm:text-sm text-gray-600">
                Purchase this exclusive celebration pooja pack to receive your physical product and a guaranteed Lucky Draw entry!
              </p>
            </div>

            {orderSuccess ? (
              /* Success Screen */
              <div className="text-center py-10 max-w-md mx-auto">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
                  <CheckCircle2 className="w-12 h-12 text-green-600" />
                </div>
                <h4 className="text-2xl font-serif font-bold text-gray-900 mb-2">Participation Confirmed!</h4>
                <p className="text-sm text-gray-600 mb-6">
                  Your order has been placed and your Lucky Draw entry ticket has been successfully registered!
                </p>
                <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 text-left text-xs space-y-2 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Order / Ticket ID:</span>
                    <span className="font-mono font-bold text-gray-800">{orderSuccess._id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Payment ID:</span>
                    <span className="font-mono font-medium text-gray-800">{orderSuccess.paymentId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Amount Paid:</span>
                    <span className="font-bold text-amber-900">₹{orderSuccess.totalAmount}</span>
                  </div>
                </div>
                <div className="flex gap-3 justify-center">
                  <Link
                    to="/orders"
                    className="px-6 py-3 bg-amber-800 hover:bg-amber-900 text-white rounded-xl text-sm font-medium shadow"
                  >
                    View in My Orders
                  </Link>
                  <button
                    onClick={() => setOrderSuccess(null)}
                    className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-medium"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              /* Product Showcase + Checkout Form */
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Product Card Column */}
                <div className="lg:col-span-5 bg-amber-50/50 rounded-2xl p-6 border border-amber-100 flex flex-col">
                  <div className="aspect-square rounded-2xl overflow-hidden bg-white shadow-sm mb-4 border border-amber-200/60 relative flex items-center justify-center">
                    {contestProduct.image ? (
                      <img
                        src={contestProduct.image}
                        alt={contestProduct.name}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1601006596160-59a61350a8a6?q=80&w=600&auto=format&fit=crop';
                        }}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-amber-800 p-6 text-center">
                        <Gift className="w-12 h-12 mb-2 text-amber-600" />
                        <span className="text-xs font-medium">Contest Participation Pack</span>
                      </div>
                    )}
                    {contestProduct.originalPrice && contestProduct.originalPrice > contestProduct.price && (
                      <span className="absolute top-3 right-3 bg-amber-800 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow">
                        {Math.round(((contestProduct.originalPrice - contestProduct.price) / contestProduct.originalPrice) * 100)}% OFF
                      </span>
                    )}
                  </div>

                  <h4 className="text-xl font-serif font-bold text-amber-950 mb-1">
                    {contestProduct.name}
                  </h4>
                  <p className="text-xs text-gray-600 mb-4 leading-relaxed">
                    {contestProduct.description}
                  </p>

                  <div className="bg-white p-4 rounded-xl border border-amber-200/80 mb-4">
                    <div className="flex items-baseline space-x-2">
                      <span className="text-3xl font-serif font-bold text-amber-950">₹{contestProduct.price}</span>
                      {contestProduct.originalPrice && (
                        <span className="text-sm text-gray-400 line-through">₹{contestProduct.originalPrice}</span>
                      )}
                      <span className="text-xs text-green-700 font-semibold bg-green-50 px-2 py-0.5 rounded">
                        Special Contest Price
                      </span>
                    </div>
                  </div>

                  <ul className="space-y-2 text-xs text-gray-600 mb-2">
                    <li className="flex items-center">
                      <ShieldCheck className="w-4 h-4 mr-2 text-amber-700 shrink-0" />
                      <span>100% Pure & Traditional Camphor</span>
                    </li>
                    <li className="flex items-center">
                      <Gift className="w-4 h-4 mr-2 text-amber-700 shrink-0" />
                      <span>Includes 1 Lucky Draw Ticket Entry</span>
                    </li>
                    <li className="flex items-center">
                      <Truck className="w-4 h-4 mr-2 text-amber-700 shrink-0" />
                      <span>Doorstep Delivery Across India</span>
                    </li>
                  </ul>
                </div>

                {/* Delivery Form & Order Now Column */}
                <div className="lg:col-span-7 bg-white">
                  <h4 className="text-lg font-serif font-bold text-gray-900 mb-4 flex items-center">
                    <span>Delivery Details</span>
                    <span className="text-xs font-normal text-gray-400 ml-2">(Enter address to receive product)</span>
                  </h4>

                  <form onSubmit={handleParticipateOrder} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name *</label>
                        <input
                          required
                          type="text"
                          value={customer.name}
                          onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                          placeholder="Your Name"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Phone Number *</label>
                        <input
                          required
                          type="tel"
                          value={customer.phone}
                          onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                          placeholder="10-digit mobile number"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address (Optional)</label>
                      <input
                        type="email"
                        value={customer.email}
                        onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                        placeholder="yourname@gmail.com"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Full Delivery Address *</label>
                      <textarea
                        required
                        rows="2"
                        value={customer.address}
                        onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                        placeholder="House / Flat No, Street, Village or City"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                      ></textarea>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Landmark (Optional)</label>
                        <input
                          type="text"
                          value={customer.landmark}
                          onChange={(e) => setCustomer({ ...customer, landmark: e.target.value })}
                          placeholder="Near Temple / School"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Pincode *</label>
                        <input
                          required
                          type="text"
                          value={customer.pincode}
                          onChange={(e) => setCustomer({ ...customer, pincode: e.target.value })}
                          placeholder="e.g. 636001"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="w-full mt-4 bg-gradient-to-r from-amber-800 to-amber-950 hover:from-amber-900 hover:to-black text-white py-4 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Connecting to Razorpay...</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4 text-amber-300" />
                          <span>Order Now & Pay ₹{contestProduct.price} with Razorpay</span>
                        </>
                      )}
                    </button>

                    <p className="text-center text-[11px] text-gray-400">
                      100% Secure Payment via Razorpay · Instant Entry Generation
                    </p>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* ----------------- 25% Sliding Price Drawer (Visible while reading Terms) ----------------- */}
      {!isNearBottom && prices.length > 0 && (
        <aside
          aria-label="Contest prizes preview"
          className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-r from-[#993300] via-[#ff6201] to-[#993300] text-white border-t-2 border-amber-300/60 shadow-2xl backdrop-blur-md transition-all duration-500"
          style={{ height: '22vh', minHeight: '130px', maxHeight: '180px' }}
        >
          <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 flex flex-col justify-between py-2.5">
            {/* Drawer Top Strip */}
            <div className="flex items-center justify-between text-xs pb-1 border-b border-white/10">
              <div className="flex items-center space-x-2">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
                <span className="font-semibold text-amber-300 tracking-wide uppercase text-[11px]">
                  Contest Prizes Showcase ({prices.length} Prizes)
                </span>
              </div>
              <span className="text-[11px] text-amber-200/70 hidden sm:inline">
                Scroll down to read full terms & participate
              </span>
            </div>

            {/* Sliding Carousel Content */}
            <div className="relative overflow-hidden flex-1 my-1 flex items-center">
              <div
                className="flex transition-transform duration-700 ease-in-out w-full"
                style={{ transform: `translateX(-${carouselIndex * 100}%)` }}
              >
                {prices.map((item, idx) => (
                  <div
                    key={item._id || idx}
                    className="w-full shrink-0 flex items-center justify-between px-2 sm:px-6 gap-4"
                  >
                    <div className="flex items-center space-x-3.5 min-w-0">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover bg-black/40 border border-amber-400/30 shrink-0"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-xl bg-amber-900/50 flex items-center justify-center text-amber-300 shrink-0 border border-amber-500/30 font-bold">
                          🏆
                        </div>
                      )}
                      <div className="min-w-0">
                        <span className="inline-block text-[10px] bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded font-bold uppercase tracking-wider mb-0.5">
                          {item.title}
                        </span>
                        <p className="text-xs text-gray-300 truncate max-w-[200px] sm:max-w-md">
                          {item.description || 'Grand Lucky Draw Prize'}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="block text-[10px] text-amber-300/80 uppercase font-semibold">Value</span>
                      <span className="text-xl sm:text-2xl font-serif font-bold text-amber-300">
                        {formatPrice(item.amount)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Prev / Next controls */}
              {prices.length > 1 && (
                <>
                  <button
                    onClick={() => setCarouselIndex((prev) => (prev === 0 ? prices.length - 1 : prev - 1))}
                    aria-label="Previous Prize"
                    className="absolute left-0 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-sm transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setCarouselIndex((prev) => (prev + 1) % prices.length)}
                    aria-label="Next Prize"
                    className="absolute right-0 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-sm transition-all"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>

            {/* Pagination Dots */}
            {prices.length > 1 && (
              <div className="flex justify-center items-center space-x-1.5 pt-0.5">
                {prices.map((_, dotIdx) => (
                  <button
                    key={dotIdx}
                    onClick={() => setCarouselIndex(dotIdx)}
                    className={`h-1.5 rounded-full transition-all ${
                      dotIdx === carouselIndex ? 'w-5 bg-amber-400' : 'w-1.5 bg-white/40'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </aside>
      )}
    </div>
  );
};

export default TermsAndConditions;
