import { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  ShoppingBag, 
  ShoppingCart, 
  Plus, 
  Minus, 
  Check, 
  ArrowRight, 
  Search, 
  Flame, 
  Sparkles, 
  CheckCircle2,
  Package,
  RotateCcw,
  X,
  Info,
  ShieldCheck,
  Eye,
  Star,
  SlidersHorizontal,
  Tag,
  Heart
} from 'lucide-react';
import { useCart } from '../context/CartContext';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://vedha-karpooram.onrender.com';

const CustomOrder = () => {
  const navigate = useNavigate();
  const { addMultipleToCart, setCartItems } = useCart();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // selections: { [productId]: { selected: boolean, quantity: number } }
  const [selections, setSelections] = useState({});
  const [toastMessage, setToastMessage] = useState(null);
  const [detailProduct, setDetailProduct] = useState(null);
  const [isClosing, setIsClosing] = useState(false);

  const closeDetailModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setDetailProduct(null);
      setIsClosing(false);
    }, 240);
  };

  const getBulletPoints = (product) => {
    if (!product) return [];
    if (Array.isArray(product.bulletPoints) && product.bulletPoints.length > 0) {
      return product.bulletPoints;
    }
    try {
      const saved = JSON.parse(localStorage.getItem('vedha_custom_bullet_points') || '{}');
      if (product._id && Array.isArray(saved[product._id]) && saved[product._id].length > 0) {
        return saved[product._id];
      }
      if (product.name && Array.isArray(saved[product.name]) && saved[product.name].length > 0) {
        return saved[product.name];
      }
    } catch {
      // ignore
    }
    const lower = (product.name || '').toLowerCase();
    if (lower.includes('karpuram') || lower.includes('camphor')) {
      return [
        "100% Pure Devotional Camphor: Authentic Bhimseni camphor formulation",
        "Zero Ash Flame: Burns completely smokeless without black residue",
        "Spiritual Fragrance: Purifies indoor air and invites positive devotional energy"
      ];
    }
    if (lower.includes('all in one') || lower.includes('combo') || lower.includes('pack')) {
      return [
        "7 Sacred Pooja Items in One: Complete festival & daily worship kit",
        "Individually Packed: Handy 50g packs of Camphor, Kumkum, Turmeric, Vibhuti, Sandal & Sambrani",
        "Best Festive Value: Saves time and ensures untouched devotional sanctity"
      ];
    }
    if (lower.includes('kungumam') || lower.includes('kumkum')) {
      return [
        "100% Pure Temple Grade: Traditional sacred red kumkum formulation",
        "Auspicious Divine Blessing: Ideal for daily worship, sumangali pooja & festivals",
        "Natural & Safe: Sourced from pure turmeric and sacred botanicals"
      ];
    }
    if (lower.includes('manjal') || lower.includes('turmeric')) {
      return [
        "100% Pure Natural Turmeric: Handpicked high-curcumin golden haldi",
        "Auspicious Pooja Essential: Perfect for abhishekams, mangala snaanam & rituals",
        "Divine Fresh Aroma: Fresh sacred fragrance without artificial colors"
      ];
    }
    if (lower.includes('thiruneeru') || lower.includes('vibhuti')) {
      return [
        "Sacred Cow-Bhasma Vibhuti: Prepared through traditional Vedic methods",
        "Cooling Divine Ash: Brings peace of mind, positivity and spiritual focus",
        "Pure & Unadulterated: Completely chemical-free traditional temple ash"
      ];
    }
    if (lower.includes('sambrani') || lower.includes('dhoop')) {
      return [
        "Pure Benzoin Resin: Traditional aromatic cup sambrani formulation",
        "Aura Cleansing Smoke: Purifies home energy and dispels negativity",
        "Long-Lasting Fragrance: Soothing temple aroma for daily evening prayers"
      ];
    }
    if (lower.includes('santhanam') || lower.includes('sandhanam') || lower.includes('sandal')) {
      return [
        "Pure Sandalwood Formulation: Genuine cooling chandan paste & powder",
        "Sacred Deity Abhishekams: Ideal for applying on deities, forehead & yantras",
        "Soothing Divine Fragrance: Calms senses and elevates spiritual focus"
      ];
    }
    return [
      "100% Pure & Sacred: Authentic devotional formulation",
      "Traditional Temple Quality: Crafted for sacred daily pooja & rituals",
      "Divine Purity Guaranteed: Chemical-free and safe for worship"
    ];
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE}/api/products`);
        const productList = Array.isArray(res.data) ? res.data : [];
        setProducts(productList);
        
        // Initialize selections with quantity 1 (unselected by default)
        const initialSelections = {};
        productList.forEach((prod) => {
          initialSelections[prod._id] = {
            selected: false,
            quantity: 1
          };
        });
        setSelections(initialSelections);
      } catch (err) {
        console.error('Error fetching products for custom order:', err);
        // Fallback demo products if backend is unreachable
        const fallback = [
          {
            _id: 'cust-1',
            name: "Vedha Premium Camphor Tablets",
            description: "100g pack of pure, round camphor tablets. Ideal for daily pooja.",
            price: 120,
            originalPrice: 150,
            image: "https://images.unsplash.com/photo-1620062839958-86d5e06263cb?q=80&w=400&auto=format&fit=crop"
          },
          {
            _id: 'cust-2',
            name: "Vedha Jumbo Camphor",
            description: "250g pack of large camphor blocks for special occasions and homams.",
            price: 280,
            originalPrice: 350,
            image: "https://images.unsplash.com/photo-1601006596160-59a61350a8a6?q=80&w=400&auto=format&fit=crop"
          },
          {
            _id: 'cust-3',
            name: "Vedha Bhimseni Camphor",
            description: "50g premium irregular crystals of Bhimseni Kapoor for aromatic diffusion.",
            price: 180,
            originalPrice: 220,
            image: "https://images.unsplash.com/photo-1596433809252-260c27459d1a?q=80&w=400&auto=format&fit=crop"
          }
        ];
        setProducts(fallback);
        const initialSelections = {};
        fallback.forEach((prod) => {
          initialSelections[prod._id] = { selected: false, quantity: 1 };
        });
        setSelections(initialSelections);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter products by search query only
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;
    const q = searchQuery.toLowerCase();
    return products.filter(
      p => p.name?.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q)
    );
  }, [products, searchQuery]);

  // Toggle selection for a product
  const toggleSelect = (id) => {
    setSelections(prev => {
      const current = prev[id] || { selected: false, quantity: 1 };
      return {
        ...prev,
        [id]: {
          ...current,
          selected: !current.selected,
          quantity: current.quantity || 1
        }
      };
    });
  };

  // Increase quantity
  const increaseQuantity = (id) => {
    setSelections(prev => {
      const current = prev[id] || { selected: false, quantity: 0 };
      return {
        ...prev,
        [id]: {
          selected: true, // auto select if incremented
          quantity: (current.quantity || 0) + 1
        }
      };
    });
  };

  // Decrease quantity
  const decreaseQuantity = (id) => {
    setSelections(prev => {
      const current = prev[id] || { selected: false, quantity: 1 };
      const newQty = (current.quantity || 1) - 1;
      if (newQty <= 0) {
        return {
          ...prev,
          [id]: {
            selected: false,
            quantity: 1
          }
        };
      }
      return {
        ...prev,
        [id]: {
          ...current,
          quantity: newQty
        }
      };
    });
  };

  // Direct quantity input change
  const handleQuantityInput = (id, val) => {
    const parsed = parseInt(val, 10);
    if (isNaN(parsed) || parsed <= 0) {
      setSelections(prev => ({
        ...prev,
        [id]: {
          selected: false,
          quantity: 1
        }
      }));
    } else {
      setSelections(prev => ({
        ...prev,
        [id]: {
          selected: true,
          quantity: parsed
        }
      }));
    }
  };

  // Select all visible products
  const handleSelectAll = () => {
    setSelections(prev => {
      const updated = { ...prev };
      filteredProducts.forEach(prod => {
        updated[prod._id] = {
          selected: true,
          quantity: updated[prod._id]?.quantity > 0 ? updated[prod._id].quantity : 1
        };
      });
      return updated;
    });
  };

  // Deselect all
  const handleDeselectAll = () => {
    setSelections(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(id => {
        updated[id] = { ...updated[id], selected: false };
      });
      return updated;
    });
  };

  // Selected items array
  const selectedItems = useMemo(() => {
    return products
      .filter(p => selections[p._id]?.selected && selections[p._id]?.quantity > 0)
      .map(p => ({
        id: p._id,
        _id: p._id,
        name: p.name,
        price: Number(p.price) || 0,
        originalPrice: p.originalPrice ? Number(p.originalPrice) : undefined,
        description: p.description,
        image: p.image,
        quantity: selections[p._id].quantity
      }));
  }, [products, selections]);

  // Total summary calculations
  const totalAmount = useMemo(() => {
    return selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [selectedItems]);

  const totalQuantity = useMemo(() => {
    return selectedItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [selectedItems]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Proceed directly to Checkout
  const handleProceedToCheckout = () => {
    if (selectedItems.length === 0) {
      alert('Please select at least one product before proceeding to order.');
      return;
    }
    // Replace current cart with custom order items and proceed
    setCartItems(selectedItems);
    navigate('/checkout');
  };

  // Add selected items to existing cart
  const handleAddToCart = () => {
    if (selectedItems.length === 0) {
      alert('Please select at least one product to add to cart.');
      return;
    }
    addMultipleToCart(selectedItems, false);
    showToast(`Added ${selectedItems.length} custom product(s) to your cart!`);
  };

  return (
    <div className="py-8 sm:py-16 bg-[#fffdf7] min-h-screen animate-in fade-in duration-500 pb-52 md:pb-36">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 right-4 z-50 bg-amber-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center space-x-3 border border-amber-700 animate-in slide-in-from-top-4">
          <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-10">
          <div className="inline-flex items-center space-x-1.5 sm:space-x-2 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-900 border border-amber-200/90 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-[11px] sm:text-sm font-semibold mb-2.5 sm:mb-4 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-700" />
            <span>Customize & Order Directly</span>
          </div>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-serif text-amber-950 font-bold tracking-tight mb-2 sm:mb-3">
            Custom Product Order
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed max-w-2xl mx-auto px-2">
            Choose exactly the pure camphor products you need from our collection, adjust the quantities to your requirement, and place your order in a single click.
          </p>
        </div>

        {/* Controls Toolbar: Search & Quick Selection Actions (No Filter Pills) */}
        <div className="bg-white p-3.5 sm:p-5 rounded-2xl shadow-xs border border-gray-200/80 mb-5 sm:mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            {/* Search box */}
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search pure camphor products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2 sm:py-2.5 rounded-xl border border-gray-200 bg-gray-50/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs sm:text-sm transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400 hover:text-gray-700 p-1"
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Quick Bulk Selection Buttons */}
            <div className="flex items-center space-x-2 w-full md:w-auto justify-between md:justify-end">
              <button
                type="button"
                onClick={handleSelectAll}
                className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-semibold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl transition-all shadow-2xs"
              >
                Select All
              </button>
              <button
                type="button"
                onClick={handleDeselectAll}
                className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all"
              >
                Clear All
              </button>
              <div className="text-xs font-bold text-amber-900 bg-amber-100/80 px-3 py-1.5 sm:py-2 rounded-xl border border-amber-300/70 whitespace-nowrap">
                {selectedItems.length} Selected
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-amber-800 space-y-4">
            <div className="w-10 h-10 border-3 border-amber-700 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm font-medium">Loading available products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center bg-white p-12 rounded-3xl shadow-sm border border-amber-100 max-w-md mx-auto">
            <Package className="w-12 h-12 text-amber-700/60 mx-auto mb-3" />
            <h3 className="text-lg font-serif text-amber-950 font-semibold mb-1">No products found</h3>
            <p className="text-sm text-gray-500 mb-4">
              {searchQuery ? `No products match "${searchQuery}".` : 'No products available for custom order currently.'}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-sm text-amber-800 font-semibold hover:underline inline-flex items-center"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1" />
                Reset search
              </button>
            )}
          </div>
        ) : (
          /* Products List: Single Card on Mobile & Flipkart Desktop Row */
          <div className="space-y-3 sm:space-y-4">
            {filteredProducts.map((product) => {
              const isSelected = !!selections[product._id]?.selected;
              const quantity = selections[product._id]?.quantity || 1;
              const unitPrice = Number(product.price) || 0;
              const lineTotal = unitPrice * quantity;
              const hasDiscount = product.originalPrice && Number(product.originalPrice) > unitPrice;
              const discount = hasDiscount ? Number(product.originalPrice) - unitPrice : 0;
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
                    className={`md:hidden bg-white rounded-2xl border p-2.5 sm:p-3 flex gap-3 relative transition-all duration-200 shadow-2xs cursor-pointer ${
                      isSelected
                        ? 'border-amber-600 ring-2 ring-amber-500/25 bg-amber-50/15'
                        : 'border-gray-200/90 hover:border-gray-300'
                    }`}
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

                    {/* Right: Info & Select + Qty Controls */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                      <div>
                        {/* Vedha Assured Badge */}
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
                          <span className="text-[10px] text-gray-400 font-medium">(1.4k)</span>
                          <span className="text-[10px] text-green-700 font-medium">• Free Delivery</span>
                        </div>

                        {/* Pricing Row */}
                        <div className="flex items-baseline flex-wrap gap-1.5 mb-2">
                          <span className="text-base font-extrabold text-gray-900">₹{unitPrice}</span>
                          {hasDiscount && (
                            <>
                              <span className="text-xs text-gray-400 line-through">₹{product.originalPrice}</span>
                              <span className="text-xs font-bold text-green-700">{discountPercent}% off</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Mobile Action Controls: Select + Qty */}
                      <div
                        className="flex items-center justify-between gap-1.5 pt-1.5 border-t border-gray-100"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* Select Toggle */}
                        <button
                          type="button"
                          onClick={() => toggleSelect(product._id)}
                          className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            isSelected
                              ? 'bg-amber-800 text-white shadow-xs'
                              : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200'
                          }`}
                        >
                          <div className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${
                            isSelected ? 'bg-white border-white text-amber-800' : 'border-gray-400 bg-white'
                          }`}>
                            {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                          </div>
                          <span>{isSelected ? 'Selected' : 'Select'}</span>
                        </button>

                        {/* Quantity Stepper */}
                        <div className="flex items-center space-x-1 bg-gray-50 border border-gray-200 rounded-lg p-0.5">
                          <button
                            type="button"
                            onClick={() => decreaseQuantity(product._id)}
                            className="w-6 h-6 rounded bg-white text-gray-700 flex items-center justify-center hover:bg-gray-100 active:scale-95 shadow-2xs"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <input
                            type="number"
                            min="1"
                            value={quantity}
                            onChange={(e) => handleQuantityInput(product._id, e.target.value)}
                            className="w-7 text-center font-bold text-xs bg-transparent border-0 focus:outline-none p-0 text-gray-900"
                          />
                          <button
                            type="button"
                            onClick={() => increaseQuantity(product._id)}
                            className="w-6 h-6 rounded bg-white text-gray-700 flex items-center justify-center hover:bg-gray-100 active:scale-95 shadow-2xs"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Line Total */}
                        {isSelected && (
                          <div className="text-right flex-shrink-0">
                            <span className="text-[9px] text-gray-400 block leading-none">Total</span>
                            <span className="text-xs font-bold text-amber-950">₹{lineTotal}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* ============================================================== */}
                  {/* LAPTOP / DESKTOP VIEW: Full Flipkart Horizontal Row Layout    */}
                  {/* ============================================================== */}
                  <div
                    onClick={() => setDetailProduct(product)}
                    className={`hidden md:flex bg-white rounded-2xl border transition-all duration-200 p-5 items-stretch justify-between gap-6 hover:shadow-lg cursor-pointer ${
                      isSelected
                        ? 'border-amber-600 ring-2 ring-amber-500/20 bg-amber-50/15'
                        : 'border-gray-200/90 hover:border-gray-300'
                    }`}
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
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-amber-800 transition-colors mb-2 leading-snug">
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
                          {getBulletPoints(product).map((point, pIdx) => {
                            const colonIdx = point.indexOf(':');
                            return (
                              <li key={pIdx} className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0"></span>
                                {colonIdx > -1 ? (
                                  <span>
                                    <strong>{point.slice(0, colonIdx + 1)}</strong>
                                    {point.slice(colonIdx + 1)}
                                  </span>
                                ) : (
                                  <span>{point}</span>
                                )}
                              </li>
                            );
                          })}
                          {product.description && (
                            <li className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0 mt-1.5"></span>
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

                    {/* Right Column: Pricing & Custom Order Action (w-72) */}
                    <div
                      className="w-72 flex-shrink-0 flex flex-col justify-between pl-6 border-l border-gray-100 py-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div>
                        {/* Pricing Row */}
                        <div className="mb-2">
                          <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-extrabold text-gray-900">₹{unitPrice}</span>
                            {hasDiscount && (
                              <span className="text-sm text-gray-400 line-through">₹{product.originalPrice}</span>
                            )}
                            {hasDiscount && (
                              <span className="text-sm font-bold text-green-700">{discountPercent}% off</span>
                            )}
                          </div>
                          <span className="text-xs text-gray-500 block">Unit price (inclusive of all taxes)</span>
                        </div>

                        <div className="text-xs text-gray-700 space-y-1 mb-4">
                          <p className="text-green-700 font-semibold">Free delivery</p>
                          <p className="text-gray-500">Daily Saver Offer Applied</p>
                        </div>

                        {/* Line total if selected */}
                        {isSelected && (
                          <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-2.5 mb-3">
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-amber-900 font-medium">{quantity} unit(s) selected:</span>
                              <span className="text-base font-bold text-amber-950">₹{lineTotal}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2.5">
                        {/* Quantity Stepper */}
                        <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl p-1.5">
                          <span className="text-xs font-semibold text-gray-600 pl-2">Quantity:</span>
                          <div className="flex items-center space-x-1.5">
                            <button
                              type="button"
                              onClick={() => decreaseQuantity(product._id)}
                              className="w-7 h-7 rounded-lg bg-white border border-gray-300 flex items-center justify-center text-gray-700 hover:bg-gray-100 active:scale-95 shadow-2xs"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <input
                              type="number"
                              min="1"
                              value={quantity}
                              onChange={(e) => handleQuantityInput(product._id, e.target.value)}
                              className="w-10 text-center font-bold text-sm bg-transparent border-0 focus:outline-none p-0 text-gray-900"
                            />
                            <button
                              type="button"
                              onClick={() => increaseQuantity(product._id)}
                              className="w-7 h-7 rounded-lg bg-white border border-gray-300 flex items-center justify-center text-gray-700 hover:bg-gray-100 active:scale-95 shadow-2xs"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Select Button */}
                        <button
                          type="button"
                          onClick={() => toggleSelect(product._id)}
                          className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-all ${
                            isSelected
                              ? 'bg-amber-800 text-white shadow-amber-900/20 hover:bg-amber-900'
                              : 'bg-amber-100 text-amber-950 border border-amber-300 hover:bg-amber-200'
                          }`}
                        >
                          {isSelected ? (
                            <>
                              <Check className="w-4 h-4 stroke-[3]" />
                              <span>Selected for Order</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-4 h-4" />
                              <span>Select for Custom Order</span>
                            </>
                          )}
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

      {/* Sticky Bottom Order Bar */}
      <div className="fixed bottom-16 md:bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-amber-200/80 shadow-[0_-8px_25px_rgba(0,0,0,0.08)] py-3 px-3 sm:py-3.5 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Summary info */}
          <div className="flex items-center justify-between w-full sm:w-auto space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center shadow-xs">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">
                  {selectedItems.length} product(s) selected ({totalQuantity} units)
                </p>
                <div className="flex items-baseline space-x-2">
                  <span className="text-xs text-gray-500">Order Total:</span>
                  <span className="text-2xl font-serif font-bold text-amber-950">₹{totalAmount}</span>
                </div>
              </div>
            </div>

            {/* Mobile quick indicator */}
            <span className="sm:hidden text-xs font-semibold px-2.5 py-1 bg-amber-100 text-amber-900 rounded-full">
              Free Delivery
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center space-x-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={selectedItems.length === 0}
              className={`flex-1 sm:flex-initial inline-flex items-center justify-center px-5 py-3 rounded-xl text-sm font-semibold border transition-all ${
                selectedItems.length > 0
                  ? 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
                  : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
              }`}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              <span>Add to Cart</span>
            </button>

            <button
              type="button"
              onClick={handleProceedToCheckout}
              disabled={selectedItems.length === 0}
              className={`flex-1 sm:flex-initial inline-flex items-center justify-center px-7 py-3 rounded-xl text-sm font-semibold text-white shadow-lg transition-all transform active:scale-95 ${
                selectedItems.length > 0
                  ? 'bg-gradient-to-r from-amber-800 to-orange-700 hover:from-amber-900 hover:to-orange-800 shadow-amber-900/25 hover:-translate-y-0.5'
                  : 'bg-gray-300 cursor-not-allowed shadow-none'
              }`}
            >
              <span>Proceed to Order</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      </div>

      {/* Product Full Details Modal / Bottom Sheet */}
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

            {/* Modal Header */}
            <div className="flex-shrink-0 flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-amber-50/60">
              <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-amber-900">
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                <span>Product Specifications & Details</span>
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

            {/* Modal Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 overscroll-contain">
              {/* Product Image */}
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

              {/* Title & Price */}
              <div>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-amber-950 mb-1.5 leading-snug">
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
                  <span className="text-xs text-gray-500 font-medium">/ unit price</span>
                </div>
              </div>

              {/* Full Description */}
              <div className="bg-amber-50/40 p-4 rounded-2xl border border-amber-100/70">
                <h4 className="text-xs uppercase font-bold tracking-wider text-amber-900 mb-1.5 flex items-center">
                  <Info className="w-3.5 h-3.5 mr-1.5 text-amber-700" />
                  Product Description
                </h4>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                  {detailProduct.description || "100% Pure, soot-free aromatic devotional camphor. Ideal for daily pooja, arati, meditation, and special temple rituals."}
                </p>
              </div>

              {/* Quality Highlights */}
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

              {/* Quantity Controls in Modal */}
              <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-200/80 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-gray-700 block">Order Quantity</span>
                  <span className="text-[11px] text-gray-500">
                    Total: ₹{Number(detailProduct.price) * (selections[detailProduct._id]?.quantity || 1)}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => decreaseQuantity(detailProduct._id)}
                    className="w-9 h-9 rounded-xl bg-white border border-gray-300 flex items-center justify-center text-gray-700 hover:bg-amber-100 hover:text-amber-900 hover:border-amber-400 active:scale-95 transition-all shadow-xs"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>

                  <input
                    type="number"
                    min="1"
                    value={selections[detailProduct._id]?.quantity || 1}
                    onChange={(e) => handleQuantityInput(detailProduct._id, e.target.value)}
                    className="w-12 text-center font-bold text-base bg-transparent border-0 focus:outline-none focus:ring-0 text-amber-950"
                  />

                  <button
                    type="button"
                    onClick={() => increaseQuantity(detailProduct._id)}
                    className="w-9 h-9 rounded-xl bg-white border border-gray-300 flex items-center justify-center text-gray-700 hover:bg-amber-100 hover:text-amber-900 hover:border-amber-400 active:scale-95 transition-all shadow-xs"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Fixed Bottom Footer (Always Visible) */}
            <div className="flex-shrink-0 p-3.5 sm:p-4 pb-6 sm:pb-4 border-t border-gray-100 bg-white flex items-center space-x-3 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
              <button
                type="button"
                onClick={() => {
                  toggleSelect(detailProduct._id);
                }}
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all flex items-center justify-center space-x-2 ${
                  selections[detailProduct._id]?.selected
                    ? 'bg-amber-100 text-amber-950 border border-amber-300 hover:bg-amber-200'
                    : 'bg-gradient-to-r from-amber-800 to-orange-700 text-white shadow-md hover:from-amber-900 hover:to-orange-800'
                }`}
              >
                {selections[detailProduct._id]?.selected ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                    <span>Selected for Order (Click to Remove)</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Select & Add to Order</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={closeDetailModal}
                className="py-3 px-5 rounded-xl text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomOrder;
