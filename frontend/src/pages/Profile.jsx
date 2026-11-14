import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  ShoppingBag, 
  MapPin, 
  Phone, 
  Mail, 
  Sparkles, 
  Save, 
  CheckCircle2, 
  ShieldCheck, 
  ChevronRight,
  Package,
  HelpCircle,
  Lock
} from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    landmark: '',
    pincode: ''
  });
  const [orderCount, setOrderCount] = useState(0);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    // 1. Load saved orders count
    try {
      const orders = JSON.parse(localStorage.getItem('vedha_orders') || '[]');
      setOrderCount(Array.isArray(orders) ? orders.length : 0);

      // 2. Load saved profile or fallback to most recent order customer details
      const savedProfile = JSON.parse(localStorage.getItem('vedha_user_profile') || 'null');
      if (savedProfile) {
        setProfile(savedProfile);
      } else if (orders.length > 0 && orders[0]?.customer) {
        setProfile({
          name: orders[0].customer.name || '',
          email: orders[0].customer.email || '',
          phone: orders[0].customer.phone || '',
          address: orders[0].customer.address || '',
          landmark: orders[0].customer.landmark || '',
          pincode: orders[0].customer.pincode || ''
        });
      }
    } catch (err) {
      console.error('Error loading profile data:', err);
    }
  }, []);

  const handleChange = (e) => {
    setProfile(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    try {
      localStorage.setItem('vedha_user_profile', JSON.stringify(profile));
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save profile:', err);
      alert('Could not save profile details.');
    }
  };

  return (
    <div className="py-8 sm:py-14 bg-[#fffdf7] min-h-screen animate-in fade-in duration-500 pb-28 md:pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Profile Header */}
        <div className="bg-gradient-to-br from-amber-900 via-amber-800 to-orange-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl mb-8 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] pointer-events-none"></div>
          
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 relative z-10 text-center sm:text-left">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/10 backdrop-blur-md border-2 border-amber-300/60 flex items-center justify-center text-amber-200 shadow-inner flex-shrink-0">
              <User className="w-10 h-10 sm:w-12 sm:h-12" />
            </div>

            <div className="flex-grow">
              <span className="inline-block text-[11px] uppercase tracking-widest font-semibold px-3 py-1 rounded-full bg-amber-400/20 text-amber-200 border border-amber-300/30 mb-2">
                Devotee Account
              </span>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-1">
                {profile.name ? profile.name : 'Welcome to Vedha Devotional Mart'}
              </h1>
              <p className="text-amber-100/80 text-xs sm:text-sm">
                {profile.phone ? `Phone: ${profile.phone}` : 'Manage your delivery details and order history.'}
              </p>
            </div>

            <div className="sm:self-center">
              <Link
                to="/orders"
                className="inline-flex items-center space-x-2 bg-white text-amber-950 font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-md hover:bg-amber-50 transition-all hover:scale-105"
              >
                <ShoppingBag className="w-4 h-4 text-amber-800" />
                <span>My Orders ({orderCount})</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Success Alert */}
        {savedSuccess && (
          <div className="mb-6 p-4 rounded-2xl bg-green-50 border border-green-200 text-green-900 flex items-center space-x-3 shadow-sm animate-in slide-in-from-top-2">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
            <span className="text-sm font-medium">Your delivery profile has been saved successfully! It will automatically fill during checkout.</span>
          </div>
        )}

        {/* Quick Activity Shortcuts */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-8">
          <Link
            to="/offers"
            className="bg-white p-4 rounded-2xl border border-amber-100/80 hover:border-amber-300 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-sm sm:text-base text-amber-950 mb-0.5">Products</h3>
              <p className="text-[11px] text-gray-500">Explore offers & packs</p>
            </div>
          </Link>

          <Link
            to="/custom-order"
            className="bg-white p-4 rounded-2xl border border-amber-100/80 hover:border-amber-300 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-800 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-sm sm:text-base text-amber-950 mb-0.5">Custom Order</h3>
              <p className="text-[11px] text-gray-500">Select items & qty</p>
            </div>
          </Link>

          <Link
            to="/orders"
            className="col-span-2 sm:col-span-1 bg-white p-4 rounded-2xl border border-amber-100/80 hover:border-amber-300 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-sm sm:text-base text-amber-950 mb-0.5">Order History</h3>
              <p className="text-[11px] text-gray-500">{orderCount} order(s) placed</p>
            </div>
          </Link>
        </div>

        {/* Delivery Details Form */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-amber-100 mb-8">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-gray-100">
            <div>
              <h2 className="text-lg sm:text-xl font-serif font-bold text-amber-950 flex items-center">
                <MapPin className="w-5 h-5 text-amber-700 mr-2" />
                Default Delivery Address
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Save your contact details once for fast 1-click checkout.
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                  placeholder="10-digit mobile number"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Full Delivery Address</label>
              <textarea
                rows="2"
                name="address"
                value={profile.address}
                onChange={handleChange}
                placeholder="Door No, Building, Street, Area"
                className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
              ></textarea>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Landmark (Optional)</label>
                <input
                  type="text"
                  name="landmark"
                  value={profile.landmark}
                  onChange={handleChange}
                  placeholder="Near temple, park, etc."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  value={profile.pincode}
                  onChange={handleChange}
                  placeholder="e.g. 600001"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                />
              </div>
            </div>

            <div className="pt-3 flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center space-x-2 bg-amber-800 hover:bg-amber-900 text-white text-sm font-semibold px-6 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Save Delivery Details</span>
              </button>
            </div>
          </form>
        </div>

        {/* Support & Admin Links */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-amber-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <HelpCircle className="w-4 h-4 text-amber-700" />
            <span>Need assistance? <Link to="/contact" className="text-amber-800 font-semibold hover:underline">Contact Customer Support</Link></span>
          </div>

          <Link
            to="/admin/login"
            className="inline-flex items-center space-x-1.5 text-xs text-gray-400 hover:text-amber-800 transition-colors"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Admin Portal</span>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Profile;
