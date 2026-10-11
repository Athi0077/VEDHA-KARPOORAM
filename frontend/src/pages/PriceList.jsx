import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Banknote, Sparkles, ArrowRight, Tag, ShieldCheck, CheckCircle2 } from 'lucide-react';

const PriceList = () => {
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await axios.get('https://vedha-karpooram.onrender.com/api/prices');
        setPrices(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('Failed to load prices:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPrices();
  }, []);

  const formatPrice = (amount) => {
    if (!amount) return '₹0';
    const trimmed = String(amount).trim();
    // If it's a numeric string, format with Indian numbering system
    if (/^\d+(\.\d+)?$/.test(trimmed)) {
      return '₹' + Number(trimmed).toLocaleString('en-IN');
    }
    // If it doesn't have a currency symbol, add ₹
    if (!trimmed.startsWith('₹') && !trimmed.toLowerCase().startsWith('rs')) {
      return '₹' + trimmed;
    }
    return trimmed;
  };

  return (
    <div className="py-12 sm:py-16 md:py-20 animate-in fade-in duration-500 bg-[#faf8f5] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center space-x-2 bg-amber-100/80 text-amber-900 border border-amber-200/60 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium mb-5 shadow-xs">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Transparent Pricing</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-amber-950 mb-4 tracking-tight">
            Our Price List
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Discover our competitive pricing tiers for different quantities and special requirements. High quality camphor and pooja products at honest, transparent rates.
          </p>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-amber-800 space-y-4">
            <div className="w-10 h-10 border-3 border-amber-700 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm font-medium">Loading pricing details...</p>
          </div>
        ) : prices.length === 0 ? (
          <div className="max-w-md mx-auto text-center bg-white p-8 sm:p-12 rounded-3xl shadow-sm border border-dashed border-amber-200 flex flex-col items-center">
            <div className="w-16 h-16 bg-amber-50 text-amber-800 rounded-2xl flex items-center justify-center mb-5 shadow-xs">
              <Banknote className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-serif text-amber-950 font-semibold mb-2">No price is announced</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Prices have not been announced yet. Please check back later or explore our special celebration offers!
            </p>
            <Link
              to="/offers"
              className="inline-flex items-center space-x-2 bg-amber-800 hover:bg-amber-900 text-white font-medium text-sm px-6 py-3 rounded-xl shadow transition-all hover:-translate-y-0.5"
            >
              <span>Explore Offers</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {prices.map((price) => (
              <div 
                key={price._id} 
                className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-amber-200/80 overflow-hidden flex flex-col group hover:-translate-y-1 relative"
              >
                {/* Image Section */}
                <div className="relative aspect-[4/3] sm:aspect-square w-full bg-gradient-to-b from-gray-50/60 to-amber-50/20 flex items-center justify-center p-6 border-b border-gray-100 overflow-hidden">
                  {price.image ? (
                    <img 
                      src={price.image} 
                      alt={price.title} 
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-sm" 
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-amber-100/60 text-amber-800 flex items-center justify-center">
                      <Tag className="w-8 h-8" />
                    </div>
                  )}

                  {/* Floating Price Pill on Image */}
                  <div className="absolute top-3.5 right-3.5">
                    <span className="bg-white/95 backdrop-blur-md text-amber-950 border border-amber-200/70 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                      {formatPrice(price.amount)}
                    </span>
                  </div>
                </div>

                {/* Body Details */}
                <div className="p-5 sm:p-6 flex flex-col flex-grow">
                  <h3 className="text-xl sm:text-2xl font-serif text-amber-950 font-semibold mb-2 group-hover:text-amber-800 transition-colors line-clamp-1">
                    {price.title}
                  </h3>

                  {price.description ? (
                    <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-grow line-clamp-2">
                      {price.description}
                    </p>
                  ) : (
                    <p className="text-gray-400 text-xs italic mb-6 flex-grow">
                      Premium quality guaranteed.
                    </p>
                  )}

                  {/* Price & Action Row */}
                  <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
                    <div>
                      <span className="block text-[11px] font-semibold text-amber-700 uppercase tracking-wider">
                        Price
                      </span>
                      <span className="text-2xl sm:text-3xl font-bold text-gray-900 font-serif leading-none">
                        {formatPrice(price.amount)}
                      </span>
                    </div>

                    <Link
                      to="/contact"
                      className="inline-flex items-center space-x-1.5 bg-amber-800 hover:bg-amber-900 text-white text-xs sm:text-sm font-medium px-4 py-2.5 rounded-xl shadow-sm transition-all hover:shadow-md hover:scale-105"
                    >
                      <span>Inquire</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom Assurance Banner */}
        <div className="mt-16 sm:mt-20 bg-amber-50/70 border border-amber-100/80 rounded-3xl p-6 sm:p-8 text-center max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-around gap-6 text-amber-950">
            <div className="flex items-center space-x-3">
              <ShieldCheck className="w-6 h-6 text-amber-700 shrink-0" />
              <span className="text-sm font-medium text-left">100% Pure & Traditional Ingredients</span>
            </div>
            <div className="hidden sm:block w-px h-8 bg-amber-200"></div>
            <div className="flex items-center space-x-3">
              <CheckCircle2 className="w-6 h-6 text-amber-700 shrink-0" />
              <span className="text-sm font-medium text-left">Transparent Bulk & Wholesale Pricing</span>
            </div>
            <div className="hidden sm:block w-px h-8 bg-amber-200"></div>
            <div className="flex items-center space-x-3">
              <Sparkles className="w-6 h-6 text-amber-700 shrink-0" />
              <span className="text-sm font-medium text-left">Doorstep Delivery Across India</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceList;
