import { ShoppingCart, Check, Sparkles, Flame } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useState, useEffect } from 'react';
import axios from 'axios';

const Offers = () => {
  const { addToCart } = useCart();
  const [addedItems, setAddedItems] = useState({});
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('https://vedha-karpooram.onrender.com/api/products');
        setProducts(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    // Map _id to id for the cart
    const productForCart = { ...product, id: product._id };
    addToCart(productForCart);
    setAddedItems({ ...addedItems, [product._id]: true });
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [product._id]: false }));
    }, 2000);
  };

  return (
    <div className="py-10 sm:py-16 md:py-20 animate-in fade-in duration-500 bg-[#fffdf7] min-h-screen">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-14 max-w-2xl mx-auto">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-orange-100 to-amber-100 text-orange-900 border border-orange-200/80 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold mb-3 sm:mb-4 shadow-xs">
            <Flame className="w-4 h-4 text-orange-600 fill-orange-500" />
            <span>Grand Festive Celebration Deals</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-amber-950 mb-3 tracking-tight">
            Celebration Offers
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed px-4">
            Discover our exclusive collection of pure, fragrant camphor products at festive celebration prices.
          </p>
        </div>

        {/* Products Grid: 2 per row on mobile */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-amber-800 space-y-3">
            <div className="w-10 h-10 border-3 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm font-medium">Loading celebration offers...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center bg-white p-10 rounded-3xl shadow-sm border border-amber-100 max-w-md mx-auto text-gray-500">
            No celebration offers listed right now. Please check back later!
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 md:gap-6">
            {products.map((product, index) => {
              // Alternate background between vibrant festive Orange and Yellow
              const isOrange = index % 2 === 0;
              const discount = product.originalPrice && product.originalPrice > product.price
                ? product.originalPrice - product.price
                : 0;

              return (
                <div 
                  key={product._id} 
                  className={`rounded-2xl sm:rounded-3xl p-3 sm:p-4.5 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 relative overflow-hidden ${
                    isOrange 
                      ? "bg-gradient-to-b from-[#ff6f00] via-[#f97316] to-[#ea580c] text-white shadow-orange-500/25 border border-orange-400/40" 
                      : "bg-gradient-to-b from-[#ffb300] via-[#f59e0b] to-[#d97706] text-white shadow-amber-500/25 border border-amber-300/50"
                  }`}
                >
                  {/* Subtle Festive Sparkle Texture */}
                  <div className="absolute inset-0 opacity-15 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] pointer-events-none"></div>

                  {/* Top Deal Pill & Discount Badge */}
                  <div className="flex items-center justify-between mb-2 sm:mb-2.5 z-10 gap-1">
                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/25 backdrop-blur-xs text-white flex items-center gap-1 shadow-2xs">
                      <Sparkles className="w-3 h-3 text-amber-200" />
                      <span className="truncate">Top Deal</span>
                    </span>
                    {discount > 0 && (
                      <span className="text-[10px] sm:text-xs font-extrabold text-white bg-red-600 px-1.5 sm:px-2 py-0.5 rounded-md shadow-xs whitespace-nowrap">
                        Save ₹{discount}
                      </span>
                    )}
                  </div>

                  {/* Inner White Product Image Box (Matching 2nd Image) */}
                  <div className="relative aspect-square w-full rounded-xl sm:rounded-2xl bg-white p-2 sm:p-3 flex items-center justify-center overflow-hidden shadow-inner border border-white/60 z-10 group-hover:scale-[1.02] transition-transform duration-300">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-contain drop-shadow-sm" 
                    />

                    {/* Gold Ribbon Banner across bottom of image */}
                    <div className="absolute bottom-1 inset-x-1.5 text-center">
                      <div className="bg-gradient-to-r from-amber-200 via-amber-100 to-amber-200 text-amber-950 text-[9px] sm:text-[11px] font-extrabold py-0.5 px-1.5 rounded shadow-xs border border-amber-300/80 truncate">
                        {discount > 0 ? "Lowest ever prices" : "Celebration Offer"}
                      </div>
                    </div>
                  </div>

                  {/* Product Details & Pricing */}
                  <div className="mt-2.5 sm:mt-3 z-10 flex flex-col flex-grow justify-between">
                    <div>
                      <h3 className="font-bold text-xs sm:text-base text-white truncate leading-tight tracking-tight drop-shadow-xs">
                        {product.name}
                      </h3>

                      {/* Pricing Row */}
                      <div className="flex items-baseline gap-1.5 mt-1 sm:mt-1.5">
                        <span className="text-base sm:text-2xl font-bold font-serif text-white leading-none drop-shadow-xs">
                          ₹{product.price}
                        </span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="text-[11px] sm:text-xs text-white/80 line-through">
                            ₹{product.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Add to Cart Button */}
                    <button 
                      onClick={() => handleAddToCart(product)}
                      className={`w-full mt-2.5 sm:mt-3 py-1.5 sm:py-2.5 px-2 sm:px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95 ${
                        addedItems[product._id] 
                          ? "bg-green-600 text-white" 
                          : "bg-white text-gray-900 hover:bg-amber-50"
                      }`}
                    >
                      {addedItems[product._id] ? (
                        <>
                          <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                          <span>Added!</span>
                        </>
                      ) : (
                        <>
                          <ShoppingCart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isOrange ? "text-orange-600" : "text-amber-600"}`} />
                          <span className="truncate">Add to Cart</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Offers;
