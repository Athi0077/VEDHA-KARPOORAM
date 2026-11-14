import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  ShoppingCart, 
  Check, 
  Sparkles, 
  Flame, 
  X, 
  Info, 
  ShieldCheck,
  Star,
  Search,
  SlidersHorizontal,
  Tag,
  Eye,
  CheckCircle2,
  Package,
  RotateCcw,
  Zap,
  Truck
} from 'lucide-react';
import { useCart } from '../context/CartContext';

const Offers = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [addedItems, setAddedItems] = useState({});
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailProduct, setDetailProduct] = useState(null);
  const [isClosing, setIsClosing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const closeDetailModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setDetailProduct(null);
      setIsClosing(false);
    }, 240);
  };

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
    const productForCart = { ...product, id: product._id };
    addToCart(productForCart);
    setAddedItems((prev) => ({ ...prev, [product._id]: true }));
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [product._id]: false }));
    }, 2000);
  };

  const handleBuyNow = (product) => {
    const productForCart = { ...product, id: product._id };
    addToCart(productForCart);
    navigate('/checkout');
  };

  // Filter products by search query only
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;
    const q = searchQuery.toLowerCase();
    return products.filter(
      p => p.name?.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q)
    );
  }, [products, searchQuery]);

  return (
    <div className="py-10 sm:py-16 md:py-20 animate-in fade-in duration-500 bg-[#fffdf7] min-h-screen">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-6 sm:mb-10 max-w-2xl mx-auto">
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

        {/* Search Bar Only (No Filters) */}
        <div className="max-w-2xl mx-auto mb-6 sm:mb-8">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search festive offers & camphor products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-10 py-2.5 sm:py-3 rounded-2xl border border-gray-200 bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs sm:text-sm shadow-xs transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400 hover:text-gray-700 p-1"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Products List: Single Card on Mobile & Flipkart Desktop Row */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-amber-800 space-y-3">
            <div className="w-10 h-10 border-3 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm font-medium">Loading celebration offers...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center bg-white p-10 rounded-3xl shadow-sm border border-amber-100 max-w-md mx-auto text-gray-500">
            <Package className="w-12 h-12 text-amber-700/60 mx-auto mb-3" />
            <h3 className="text-lg font-serif text-amber-950 font-semibold mb-1">No offers found</h3>
            <p className="text-sm text-gray-500 mb-4">
              {searchQuery ? `No offers match "${searchQuery}".` : 'No products match the selected filter.'}
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveFilter('all');
              }}
              className="text-sm text-amber-800 font-semibold hover:underline inline-flex items-center"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1" />
              Reset filters & search
            </button>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {filteredProducts.map((product) => {
              const hasDiscount = product.originalPrice && Number(product.originalPrice) > Number(product.price);
              const discount = hasDiscount ? Number(product.originalPrice) - Number(product.price) : 0;
              const discountPercent = hasDiscount && product.originalPrice
                ? Math.round((discount / Number(product.originalPrice)) * 100)
                : 0;

              return (
                <div key={product._id}>
                  {/* ============================================================== */}
                  {/* MOBILE VIEW: Single Horizontal Card per Row (Flipkart/Amazon) */}
                  {/* ============================================================== */}
                  <div
                    onClick={() => setDetailProduct(product)}
                    className="md:hidden bg-white rounded-2xl border border-gray-200/90 hover:border-gray-300 shadow-2xs p-2.5 sm:p-3 flex gap-3 relative transition-all duration-200 cursor-pointer"
                  >
                    {/* Left: Product Image Box */}
                    <div className="w-28 sm:w-32 aspect-square flex-shrink-0 bg-gray-50/90 rounded-xl p-1.5 flex items-center justify-center relative border border-gray-100 overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-contain drop-shadow-2xs"
                      />
                      {hasDiscount && (
                        <span className="absolute top-1 left-1 bg-red-600 text-white font-extrabold text-[9px] px-1.5 py-0.5 rounded shadow-2xs">
                          {discountPercent}% OFF
                        </span>
                      )}
                      <span className="absolute bottom-1 right-1 bg-white/95 text-[9px] text-gray-600 font-medium px-1.5 py-0.5 rounded shadow-2xs flex items-center gap-0.5">
                        <Eye className="w-2.5 h-2.5" /> Details
                      </span>
                    </div>

                    {/* Right: Info & Flipkart Yellow Add to Cart Button */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                      <div>
                        {/* Vedha Assured Badge + Deal Badge */}
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-100 flex items-center gap-0.5">
                            <ShieldCheck className="w-2.5 h-2.5 text-blue-600" /> Vedha Assured
                          </span>
                          {discount > 0 && (
                            <span className="text-[10px] font-bold text-red-600">
                              Save ₹{discount}
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <h3 className="text-xs sm:text-sm font-semibold text-gray-900 leading-snug line-clamp-2 mb-1">
                          {product.name}
                        </h3>

                        {/* Rating Row (Flipkart green rating) */}
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <span className="bg-green-700 text-white text-[10px] font-bold px-1.5 py-0.2 rounded flex items-center gap-0.5">
                            <span>4.8</span>
                            <Star className="w-2.5 h-2.5 fill-white" />
                          </span>
                          <span className="text-[10px] text-gray-400 font-medium">(1.7k)</span>
                          <span className="text-[10px] text-green-700 font-medium">• Free Delivery</span>
                        </div>

                        {/* Pricing Row */}
                        <div className="flex items-baseline flex-wrap gap-1.5 mb-2">
                          <span className="text-base font-extrabold text-gray-900">₹{product.price}</span>
                          {hasDiscount && (
                            <>
                              <span className="text-xs text-gray-400 line-through">M.R.P: ₹{product.originalPrice}</span>
                              <span className="text-xs font-bold text-green-700">({discountPercent}% off)</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Mobile Yellow Add to Cart Button (Matching Amazon / Flipkart Screenshot) */}
                      <div className="pt-1 border-t border-gray-100" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => handleAddToCart(product)}
                          className={`w-full py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-95 ${
                            addedItems[product._id]
                              ? 'bg-green-600 text-white border border-green-600'
                              : 'bg-[#ffd814] hover:bg-[#f7ca00] text-gray-900 border border-[#fcd200]'
                          }`}
                        >
                          {addedItems[product._id] ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                              <span>Added to Cart!</span>
                            </>
                          ) : (
                            <>
                              <ShoppingCart className="w-3.5 h-3.5 text-gray-900" />
                              <span>Add to cart</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* ============================================================== */}
                  {/* LAPTOP / DESKTOP VIEW: Full Flipkart Horizontal Row Layout    */}
                  {/* ============================================================== */}
                  <div
                    onClick={() => setDetailProduct(product)}
                    className="hidden md:flex bg-white rounded-2xl border border-gray-200/90 hover:border-gray-300 hover:shadow-lg transition-all duration-200 p-5 items-stretch justify-between gap-6 cursor-pointer"
                  >
                    {/* Left Column: Image (~210px) */}
                    <div className="w-52 h-52 flex-shrink-0 bg-white rounded-xl p-3 border border-gray-100 flex items-center justify-center relative group">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-sm"
                      />
                      {hasDiscount && (
                        <span className="absolute top-2 left-2 bg-red-600 text-white font-extrabold text-xs px-2.5 py-1 rounded-md shadow-xs">
                          {discountPercent}% OFF
                        </span>
                      )}
                      <div className="absolute bottom-2 left-2 right-2 text-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 backdrop-blur-xs text-white text-xs py-1 rounded-lg">
                        Click for Details
                      </div>
                    </div>

                    {/* Middle Column: Specs & Features (Flipkart Signature Style) */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between py-1 pr-4">
                      <div>
                        {/* Title */}
                        <h3 className="text-xl font-bold text-gray-900 hover:text-amber-800 transition-colors mb-2 leading-snug">
                          {product.name}
                        </h3>

                        {/* Rating Badge (Flipkart green pill) */}
                        <div className="flex items-center gap-2 mb-3">
                          <span className="bg-green-700 text-white text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1">
                            <span>4.8</span>
                            <Star className="w-3 h-3 fill-white" />
                          </span>
                          <span className="text-gray-500 text-xs font-medium">
                            1,850 Ratings & 420 Reviews
                          </span>
                          <span className="text-gray-300">•</span>
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                            <span>Vedha Assured Purity</span>
                          </span>
                        </div>

                        {/* Specifications List (Flipkart Style) */}
                        <ul className="space-y-1.5 text-sm text-gray-600 mb-3">
                          <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0"></span>
                            <span><strong>100% Pure Devotional Camphor:</strong> Authentic Bhimseni camphor formulation</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0"></span>
                            <span><strong>Zero Ash Flame:</strong> Burns completely smokeless without black residue</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0"></span>
                            <span><strong>Spiritual Fragrance:</strong> Purifies indoor air and invites positive devotional energy</span>
                          </li>
                          {product.description && (
                            <li className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0 mt-1.5"></span>
                              <span className="line-clamp-2">{product.description}</span>
                            </li>
                          )}
                        </ul>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="text-green-700 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> In Stock • Ready to Dispatch
                        </span>
                        <span>•</span>
                        <span>Direct Temple & Pooja Quality</span>
                      </div>
                    </div>

                    {/* Right Column: Pricing & Flipkart Yellow Add to Cart + Buy Now Buttons (w-72) */}
                    <div
                      className="w-72 flex-shrink-0 flex flex-col justify-between pl-6 border-l border-gray-100 py-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div>
                        {/* Pricing Row */}
                        <div className="mb-2">
                          <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-extrabold text-gray-900">₹{product.price}</span>
                            {hasDiscount && (
                              <span className="text-sm text-gray-400 line-through">₹{product.originalPrice}</span>
                            )}
                            {hasDiscount && (
                              <span className="text-sm font-bold text-green-700">{discountPercent}% off</span>
                            )}
                          </div>
                          <span className="text-xs text-gray-500 block">Inclusive of all taxes</span>
                        </div>

                        <div className="text-xs text-gray-700 space-y-1 mb-4">
                          <p className="text-green-700 font-semibold">Free delivery</p>
                          <p className="text-gray-500">Daily Saver Offer Applied</p>
                        </div>
                      </div>

                      <div className="space-y-2.5">
                        {/* Yellow Add to Cart Button (Flipkart Style) */}
                        <button
                          type="button"
                          onClick={() => handleAddToCart(product)}
                          className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95 ${
                            addedItems[product._id]
                              ? 'bg-green-600 text-white border border-green-600'
                              : 'bg-[#ffd814] hover:bg-[#f7ca00] text-gray-900 border border-[#fcd200]'
                          }`}
                        >
                          {addedItems[product._id] ? (
                            <>
                              <Check className="w-4 h-4 text-white stroke-[3]" />
                              <span>Added to Cart!</span>
                            </>
                          ) : (
                            <>
                              <ShoppingCart className="w-4 h-4 text-gray-900" />
                              <span>Add to Cart</span>
                            </>
                          )}
                        </button>

                        {/* Orange Buy Now Button (Flipkart Style) */}
                        <button
                          type="button"
                          onClick={() => handleBuyNow(product)}
                          className="w-full py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 bg-[#fb641b] hover:bg-[#ea5610] text-white shadow-xs transition-all active:scale-95"
                        >
                          <Zap className="w-4 h-4 fill-white" />
                          <span>Buy Now</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Product Full Details Modal */}
      {detailProduct && (
        <div 
          className={`fixed inset-0 z-[100] bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 ${
            isClosing ? 'animate-fade-out-backdrop' : 'animate-fade-in-backdrop'
          }`}
          onClick={closeDetailModal}
        >
          <div 
            className={`bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl border border-amber-100 h-[88vh] sm:h-auto max-h-[92vh] flex flex-col overflow-hidden ${
              isClosing ? 'animate-slide-down-mobile' : 'animate-slide-up-mobile'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Native Mobile Pull Bar Indicator */}
            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mt-2.5 mb-1 sm:hidden flex-shrink-0" />

            {/* Header */}
            <div className="flex-shrink-0 flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-amber-50/70">
              <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-amber-900">
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                <span>Product Full Details</span>
              </div>
              <button
                type="button"
                onClick={closeDetailModal}
                className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors shadow-2xs"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 overscroll-contain">
              <div className="relative h-44 sm:h-52 w-full rounded-2xl bg-amber-50/50 overflow-hidden border border-amber-100 flex items-center justify-center shadow-inner flex-shrink-0">
                <img
                  src={detailProduct.image}
                  alt={detailProduct.name}
                  className="w-full h-full object-contain p-2"
                />
                {detailProduct.originalPrice && Number(detailProduct.originalPrice) > Number(detailProduct.price) && (
                  <span className="absolute top-3 right-3 text-xs font-extrabold text-white bg-red-600 px-2.5 py-1 rounded-full shadow-md">
                    Save ₹{Number(detailProduct.originalPrice) - Number(detailProduct.price)} OFF
                  </span>
                )}
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-amber-950 mb-1 leading-snug">
                  {detailProduct.name}
                </h2>
                <div className="flex items-baseline space-x-2.5">
                  <span className="text-2xl sm:text-3xl font-serif font-bold text-amber-900">
                    ₹{detailProduct.price}
                  </span>
                  {detailProduct.originalPrice && Number(detailProduct.originalPrice) > Number(detailProduct.price) && (
                    <span className="text-sm text-gray-400 line-through">
                      ₹{detailProduct.originalPrice}
                    </span>
                  )}
                  <span className="text-xs text-gray-500 font-medium">Special Offer</span>
                </div>
              </div>

              <div className="bg-amber-50/40 p-3.5 rounded-2xl border border-amber-100/70">
                <h4 className="text-xs uppercase font-bold tracking-wider text-amber-900 mb-1 flex items-center">
                  <Info className="w-3.5 h-3.5 mr-1.5 text-amber-700" />
                  Description
                </h4>
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                  {detailProduct.description || "100% Pure, soot-free aromatic devotional camphor. Ideal for daily pooja, arati, meditation, and special temple rituals."}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200/60 flex items-center space-x-2 text-gray-700">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>100% Pure & Sacred</span>
                </div>
                <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200/60 flex items-center space-x-2 text-gray-700">
                  <Flame className="w-4 h-4 text-orange-600 flex-shrink-0" />
                  <span>Soot-free White Flame</span>
                </div>
              </div>
            </div>

            {/* Fixed Bottom Footer (Always Visible) */}
            <div className="flex-shrink-0 p-3.5 sm:p-4 pb-6 sm:pb-4 border-t border-gray-100 bg-white flex items-center space-x-3 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
              <button
                type="button"
                onClick={() => {
                  handleAddToCart(detailProduct);
                }}
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all flex items-center justify-center space-x-2 ${
                  addedItems[detailProduct._id]
                    ? 'bg-green-600 text-white'
                    : 'bg-gradient-to-r from-amber-800 to-orange-700 text-white shadow-md hover:from-amber-900 hover:to-orange-800'
                }`}
              >
                {addedItems[detailProduct._id] ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4 text-white" />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={closeDetailModal}
                className="py-3 px-5 rounded-xl text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Offers;
