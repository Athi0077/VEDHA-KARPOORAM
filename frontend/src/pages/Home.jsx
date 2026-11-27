import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  Sparkles, 
  Star, 
  ShieldCheck, 
  ShoppingBag, 
  ShoppingCart, 
  Check, 
  Flame, 
  Eye, 
  X, 
  CheckCircle2, 
  Award, 
  Truck,
  Sun,
  Package
} from 'lucide-react';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import {
  getProductVariants,
  getSelectedVariant,
  getEffectivePricing,
  buildCartProduct
} from '../utils/productWeights';

// API Base URL
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://vedha-karpooram.onrender.com';

// Verified default product catalog for instant rendering and resilient offline/cold-start fallback
const INITIAL_PRODUCTS = [
  {
    _id: "6af286afb728bfc06561b782",
    name: "Vedha Karpuram",
    category: "Camphor",
    description: "12 pic 300g (25g per pic) - 100% pure camphor, soot-free flame, elevates spiritual rituals.",
    price: 400,
    originalPrice: 450,
    image: "https://res.cloudinary.com/xspbkqr1/image/upload/v1794279042/karupram_products/ft3cd9y0k54h3axpiokr.jpg",
    badge: "Bestseller",
    rating: 4.9,
    reviews: 1420
  },
  {
    _id: "6af7cc188dd6407ae8e4f26a",
    name: "All in One Pack (7 items)",
    category: "Combo Packs",
    description: "50g Per Item - Complete sacred set with Kungumam, Manjal, Thiruneeru, Sandhanam, Sambrani, Camphor & accessories.",
    price: 250,
    originalPrice: 300,
    image: "https://res.cloudinary.com/xspbkqr1/image/upload/v1794624518/karupram_products/mlrpuurmrxusfkkbfbp7.png",
    badge: "Best Value",
    rating: 5.0,
    reviews: 980
  },
  {
    _id: "6af7cc638dd6407ae8e4f26b",
    name: "Vedha Special Kungumam",
    category: "Kungumam",
    description: "1kg Pack - Pure divine temple-red kumkum processed with traditional turmeric and natural herbs.",
    price: 80,
    originalPrice: 100,
    image: "https://res.cloudinary.com/xspbkqr1/image/upload/v1794624565/karupram_products/tvllzq0y8l8qbywpkggq.png",
    badge: "Temple Grade",
    rating: 4.8,
    reviews: 860
  },
  {
    _id: "6af7cc9a8dd6407ae8e4f26c",
    name: "Vedha Special Manjal",
    category: "Manjal",
    description: "1KG Pack - Auspicious, bright golden turmeric powder for daily pooja, abhishekams, and festive rituals.",
    price: 140,
    originalPrice: 160,
    image: "https://res.cloudinary.com/xspbkqr1/image/upload/v1794624650/karupram_products/tbftsyi6dzxot9sgyvbp.png",
    badge: "100% Pure",
    rating: 4.9,
    reviews: 640
  },
  {
    _id: "6af7ccc78dd6407ae8e4f26d",
    name: "Vedha Special Thiruneeru",
    category: "Thiruneeru",
    description: "1KG Pack - Traditional sacred white vibhuti prepared through sacred cow dung bhasma with soothing aroma.",
    price: 80,
    originalPrice: 100,
    image: "https://res.cloudinary.com/xspbkqr1/image/upload/v1794624682/karupram_products/darax0j7ndgks7i1k3hv.png",
    badge: "Sacred Ash",
    rating: 4.9,
    reviews: 730
  },
  {
    _id: "6af7cce78dd6407ae8e4f26e",
    name: "Vedha Special Sambrani",
    category: "Sambrani",
    description: "1KG Pack - Premium traditional benzoin cup sambrani releasing pure divine fragrance for aura purification.",
    price: 500,
    originalPrice: 550,
    image: "https://res.cloudinary.com/xspbkqr1/image/upload/v1794624730/karupram_products/j5gz1d0twpiviou9nv8o.png",
    badge: "Divine Fragrance",
    rating: 4.8,
    reviews: 520
  },
  {
    _id: "6af7cd098dd6407ae8e4f26f",
    name: "Vedha Special Santhanam",
    category: "Sandhanam",
    description: "1KG Pack - Pure aromatic sandalwood paste/powder providing cooling divinity and soothing serenity.",
    price: 70,
    originalPrice: 100,
    image: "https://res.cloudinary.com/xspbkqr1/image/upload/v1794624766/karupram_products/qypiz5vcrhgygjhbl1r7.png",
    badge: "Pure Sandal",
    rating: 4.7,
    reviews: 410
  }
];

// Curated Category Definitions mapping directly to devotional mart product categories
const CATEGORIES = [
  {
    id: "kungumam",
    name: "Kungumam",
    subtitle: "Sacred Crimson Kumkum",
    tamil: "குங்குமம்",
    image: "https://res.cloudinary.com/xspbkqr1/image/upload/v1794624565/karupram_products/tvllzq0y8l8qbywpkggq.png",
    filterKey: "Kungumam",
    accent: "from-rose-500/15 to-red-500/5",
    border: "hover:border-rose-300",
    pill: "bg-rose-50 text-rose-800"
  },
  {
    id: "manjal",
    name: "Manjal (Turmeric)",
    subtitle: "Auspicious Pure Haldi",
    tamil: "மஞ்சள்",
    image: "https://res.cloudinary.com/xspbkqr1/image/upload/v1794624650/karupram_products/tbftsyi6dzxot9sgyvbp.png",
    filterKey: "Manjal",
    accent: "from-amber-500/15 to-yellow-500/5",
    border: "hover:border-amber-300",
    pill: "bg-amber-50 text-amber-800"
  },
  {
    id: "thiruneeru",
    name: "Thiruneeru (Vibhuti)",
    subtitle: "Sacred Holy Ash",
    tamil: "திருநீறு",
    image: "https://res.cloudinary.com/xspbkqr1/image/upload/v1794624682/karupram_products/darax0j7ndgks7i1k3hv.png",
    filterKey: "Thiruneeru",
    accent: "from-slate-500/15 to-gray-500/5",
    border: "hover:border-slate-300",
    pill: "bg-slate-50 text-slate-800"
  },
  {
    id: "sandhanam",
    name: "Sandhanam (Sandalwood)",
    subtitle: "Cooling Pure Chandan",
    tamil: "சந்தனம்",
    image: "https://res.cloudinary.com/xspbkqr1/image/upload/v1794624766/karupram_products/qypiz5vcrhgygjhbl1r7.png",
    filterKey: "Sandhanam",
    accent: "from-orange-500/15 to-amber-500/5",
    border: "hover:border-orange-300",
    pill: "bg-orange-50 text-orange-800"
  },
  {
    id: "sambrani",
    name: "Sambrani",
    subtitle: "Aromatic Pure Dhoop",
    tamil: "சாம்பிராணி",
    image: "https://res.cloudinary.com/xspbkqr1/image/upload/v1794624730/karupram_products/j5gz1d0twpiviou9nv8o.png",
    filterKey: "Sambrani",
    accent: "from-amber-600/15 to-stone-500/5",
    border: "hover:border-amber-400",
    pill: "bg-amber-100/70 text-amber-900"
  },
  {
    id: "camphor",
    name: "Camphor (Karpuram)",
    subtitle: "Soot-Free Aarti Light",
    tamil: "கற்பூரம்",
    image: "https://res.cloudinary.com/xspbkqr1/image/upload/v1794279042/karupram_products/ft3cd9y0k54h3axpiokr.jpg",
    filterKey: "Camphor",
    accent: "from-orange-500/20 to-amber-500/10",
    border: "hover:border-orange-400",
    pill: "bg-orange-100 text-orange-900"
  },
  {
    id: "combo-packs",
    name: "Pooja Combo Packs",
    subtitle: "7 Sacred Items in One",
    tamil: "பூஜை காம்போ",
    image: "https://res.cloudinary.com/xspbkqr1/image/upload/v1794624518/karupram_products/mlrpuurmrxusfkkbfbp7.png",
    filterKey: "Combo Packs",
    accent: "from-yellow-500/20 to-orange-500/10",
    border: "hover:border-yellow-400",
    pill: "bg-yellow-100 text-yellow-900"
  },
  {
    id: "all-in-one",
    name: "All-in-One Pooja Products",
    subtitle: "Complete Ritual Kits",
    tamil: "அனைத்தும் ஒன்று",
    image: "https://res.cloudinary.com/xspbkqr1/image/upload/v1794624518/karupram_products/mlrpuurmrxusfkkbfbp7.png",
    filterKey: "All-in-One",
    accent: "from-amber-600/20 to-yellow-600/10",
    border: "hover:border-amber-500",
    pill: "bg-amber-100 text-amber-950"
  }
];

// Five Brand Promise Pillars specifically related to Vedha devotional products
const BRAND_PILLARS = [
  {
    id: "vedic",
    title: "Vedic Authenticity",
    subtitle: "Ancient Ritual Wisdom",
    tamil: "வேத நெறிமுறை",
    tag: "Sacred Tradition",
    icon: Flame,
    iconBg: "bg-orange-100 text-orange-700",
    borderActive: "border-orange-500",
    description: "Formulated according to time-tested traditional recipes respecting temple sanctum rites and ancestral wisdom.",
    highlight: "100% Agamic Principles",
    linkText: "Explore Pure Camphor",
    linkPath: "#products-section"
  },
  {
    id: "purity",
    title: "Zero Adulteration",
    subtitle: "Uncompromised Sanctity",
    tamil: "கலப்படமற்ற தூய்மை",
    tag: "100% Pure",
    icon: ShieldCheck,
    iconBg: "bg-emerald-100 text-emerald-800",
    borderActive: "border-emerald-500",
    description: "Free from synthetic fillers, harmful chemicals, or soot-generating impurities. 100% sacred, clean ingredients.",
    highlight: "Zero Black Soot & Clean Flame",
    linkText: "View Purity Standard",
    linkPath: "/about"
  },
  {
    id: "powders",
    title: "Sacred Powders",
    subtitle: "Temple Abhishekams",
    tamil: "புனித அபிஷேகப் பொருட்கள்",
    tag: "Temple Grade",
    icon: Sparkles,
    iconBg: "bg-rose-100 text-rose-700",
    borderActive: "border-rose-500",
    description: "Temple-grade Kungumam, vibrant Manjal, holy cow-bhasma Thiruneeru & cooling Sandhanam for divine worship.",
    highlight: "Natural Herbs & Cow Bhasma",
    linkText: "Shop Sacred Powders",
    linkPath: "/offers"
  },
  {
    id: "camphor-dhoop",
    title: "Pure Camphor & Dhoop",
    subtitle: "Spiritual Cleansing",
    tamil: "தூய கற்பூரம் & சாம்பிராணி",
    tag: "Divine Flame",
    icon: Sun,
    iconBg: "bg-amber-100 text-amber-800",
    borderActive: "border-amber-500",
    description: "Clean soot-free Karpuram flame for mangala aarti and aromatic Benzoin Sambrani for spiritual aura purification.",
    highlight: "Aromatic Fragrance",
    linkText: "Shop Camphor & Sambrani",
    linkPath: "/offers"
  },
  {
    id: "kits",
    title: "All-in-One Ritual Kits",
    subtitle: "Complete Daily Pooja",
    tamil: "பூஜை காம்போ கிட்",
    tag: "Complete Ritual",
    icon: Package,
    iconBg: "bg-yellow-100 text-yellow-800",
    borderActive: "border-yellow-500",
    description: "Curated 7-in-1 pooja combos and custom sets packed with devotion and delivered safely to your home.",
    highlight: "7 Sacred Items in One Box",
    linkText: "Explore Pooja Combos",
    linkPath: "/custom-order"
  }
];

const Home = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [addedItems, setAddedItems] = useState({});
  const [selectedWeights, setSelectedWeights] = useState({});
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [detailProduct, setDetailProduct] = useState(null);
  const [isClosingModal, setIsClosingModal] = useState(false);

  // Brand 5-Card Marquee Selected Indicator State
  const [brandCardIndex, setBrandCardIndex] = useState(0);

  // Fetch live products from backend to ensure freshness
  useEffect(() => {
    let isMounted = true;
    const fetchLiveProducts = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/products`);
        if (isMounted && Array.isArray(res.data) && res.data.length > 0) {
          // Merge with predefined categories & badges for rich presentation
          const enriched = res.data.map(p => {
            const lower = (p.name || '').toLowerCase();
            let category = "Pooja Essentials";
            let badge = "Pure & Natural";

            if (lower.includes('karpuram') || lower.includes('camphor')) {
              category = "Camphor";
              badge = "Bestseller";
            } else if (lower.includes('all in one') || lower.includes('combo') || lower.includes('pack')) {
              category = "Combo Packs";
              badge = "Best Value";
            } else if (lower.includes('kungumam') || lower.includes('kumkum')) {
              category = "Kungumam";
              badge = "Temple Grade";
            } else if (lower.includes('manjal') || lower.includes('turmeric')) {
              category = "Manjal";
              badge = "100% Pure";
            } else if (lower.includes('thiruneeru') || lower.includes('vibhuti')) {
              category = "Thiruneeru";
              badge = "Sacred Ash";
            } else if (lower.includes('sambrani') || lower.includes('dhoop')) {
              category = "Sambrani";
              badge = "Divine Fragrance";
            } else if (lower.includes('santhanam') || lower.includes('sandhanam') || lower.includes('sandal')) {
              category = "Sandhanam";
              badge = "Pure Sandal";
            }

            return {
              ...p,
              category,
              badge: p.badge || badge,
              rating: p.rating || 4.9,
              reviews: p.reviews || 820
            };
          });
          setProducts(enriched);
        }
      } catch (err) {
        console.warn('Backend unavailable, using initial verified products:', err);
      }
    };

    fetchLiveProducts();
    return () => { isMounted = false; };
  }, []);

  // Auto-cycle hero featured item every 4.5 seconds
  useEffect(() => {
    if (products.length <= 1) return;
    const interval = setInterval(() => {
      setActiveHeroIndex(prev => (prev + 1) % products.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [products.length]);

  const activeHeroProduct = products[activeHeroIndex] || products[0];

  // Add to cart handler with visual feedback
  const handleAddToCart = (product, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const baseId = product._id || product.id;
    const selectedVariant = getSelectedVariant(product, selectedWeights);
    const cartProduct = buildCartProduct(product, selectedVariant);
    addToCart(cartProduct);
    setAddedItems(prev => ({ ...prev, [baseId]: true }));
    setTimeout(() => {
      setAddedItems(prev => ({ ...prev, [baseId]: false }));
    }, 2000);
  };

  const handleBuyNow = (product) => {
    const selectedVariant = getSelectedVariant(product, selectedWeights);
    const cartProduct = buildCartProduct(product, selectedVariant);
    addToCart(cartProduct);
    navigate('/checkout');
  };

  // Close Quick View Modal smoothly
  const closeModal = () => {
    setIsClosingModal(true);
    setTimeout(() => {
      setDetailProduct(null);
      setIsClosingModal(false);
    }, 200);
  };

  // Filter products by tab
  const filteredProducts = useMemo(() => {
    if (selectedFilter === 'All') return products;
    if (selectedFilter === 'Powders') {
      return products.filter(p => ['Kungumam', 'Manjal', 'Thiruneeru', 'Sandhanam'].includes(p.category));
    }
    return products.filter(p => p.category === selectedFilter);
  }, [products, selectedFilter]);

  // Combo pack reference for promotional banner
  const comboProduct = products.find(p => 
    p.name?.toLowerCase().includes('all in one') || 
    p.category === 'Combo Packs'
  ) || products[1] || products[0];

  return (
    <div className="bg-[#FFFDF7] min-h-screen text-amber-950 font-sans selection:bg-amber-200 selection:text-amber-900">
      
      {/* ============================================================== */}
      {/* 1. TOP AUSPICIOUS NOTICE BAR                                  */}
      {/* ============================================================== */}
      <div className="bg-gradient-to-r from-[#882400] via-[#c2410c] to-[#9a3412] text-amber-50 text-xs sm:text-sm py-2 px-4 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center justify-center space-x-2 mx-auto sm:mx-0">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-300 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
            </span>
            <span className="font-medium tracking-wide">
              Traditional Temple-Grade Purity • 100% Authentic Devotional Essentials
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-4 text-xs font-semibold text-amber-200/90">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-300" /> Sanctified & Natural
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Truck className="w-3.5 h-3.5 text-amber-300" /> Fast Delivery Across India
            </span>
            <span>•</span>
            <Link to="/custom-order" className="text-amber-100 hover:text-white underline decoration-amber-300">
              Custom Pooja Packs Available
            </Link>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. HERO SECTION                                                */}
      {/* ============================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FFF7ED] via-[#FFFDF7] to-[#FAF5EC] pt-10 pb-16 sm:pb-24 border-b border-amber-100/80">
        {/* Subtle Decorative Spiritual Background Motifs */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.035] bg-[radial-gradient(#b45309_1px,transparent_1px)] [background-size:20px_20px]"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-amber-300/30 via-orange-300/15 to-transparent rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-gradient-to-tr from-amber-400/20 via-orange-200/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            
            {/* Left Column: Devotional Copy & CTAs (7 Cols) */}
            <div className="lg:col-span-7 text-center lg:text-left">
              {/* Auspicious Badge */}
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-100 via-orange-100 to-amber-200 text-amber-900 border border-amber-300/70 px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold mb-6 shadow-xs animate-in fade-in duration-700">
                <Flame className="w-4 h-4 text-orange-600 fill-orange-500" />
                <span className="tracking-wide">Sacred Devotional Mart • Tamil Nadu Tradition</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              </div>

              {/* Main Heading (Required by Prompt) */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.1rem] font-serif font-bold text-amber-950 tracking-tight leading-[1.12] mb-6">
                Bringing Divine Purity <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-orange-600 via-amber-700 to-amber-900 bg-clip-text text-transparent">
                  to Every Prayer
                </span>
              </h1>

              {/* Subheading (Required by Prompt) */}
              <p className="text-base sm:text-lg md:text-xl text-gray-700 font-sans leading-relaxed mb-8 max-w-2xl mx-auto lg:mx-0">
                Discover premium-quality devotional and pooja essentials crafted with purity, tradition, and trust.
              </p>

              {/* Product Pills Showcase (Showcasing all requested items) */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mb-8">
                {['Kungumam', 'Manjal', 'Thiruneeru', 'Sandhanam', 'Sambrani', 'Camphor', 'Pooja Combo Packs'].map((item) => (
                  <span 
                    key={item}
                    className="inline-flex items-center text-xs font-medium text-amber-900 bg-amber-50/80 border border-amber-200/90 px-2.5 py-1 rounded-lg shadow-2xs hover:bg-amber-100 transition-colors"
                  >
                    <CheckCircle2 className="w-3 h-3 text-orange-600 mr-1.5" />
                    {item}
                  </span>
                ))}
              </div>

              {/* Action Buttons (Required by Prompt: Explore Products & Shop Now) */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4">
                <a
                  href="#products-section"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-xl text-base font-bold text-white bg-gradient-to-r from-orange-600 via-amber-600 to-amber-700 hover:from-orange-700 hover:to-amber-800 shadow-lg shadow-orange-600/25 hover:shadow-orange-600/35 transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  <Sparkles className="w-5 h-5 mr-2 text-amber-200" />
                  Explore Products
                  <ArrowRight className="w-5 h-5 ml-2" />
                </a>

                <Link
                  to="/offers"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-xl text-base font-bold text-amber-950 bg-white hover:bg-amber-50 border-2 border-amber-300 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  <ShoppingBag className="w-5 h-5 mr-2 text-orange-600" />
                  Shop Now
                </Link>

                <Link
                  to="/custom-order"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-4 rounded-xl text-sm font-semibold text-amber-800 hover:text-amber-950 hover:bg-amber-100/50 transition-colors"
                >
                  Build Custom Kit →
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-3 gap-4 pt-8 mt-8 border-t border-amber-200/60 max-w-lg mx-auto lg:mx-0">
                <div className="text-center lg:text-left">
                  <div className="text-xl sm:text-2xl font-serif font-bold text-amber-900">100%</div>
                  <div className="text-xs text-gray-600 font-medium">Sacred Purity</div>
                </div>
                <div className="text-center lg:text-left border-x border-amber-200/80 px-2">
                  <div className="text-xl sm:text-2xl font-serif font-bold text-amber-900">Soot-Free</div>
                  <div className="text-xs text-gray-600 font-medium">Aarti Flame</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-xl sm:text-2xl font-serif font-bold text-amber-900">7+ Sacred</div>
                  <div className="text-xs text-gray-600 font-medium">Daily Essentials</div>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Featured Product Hero Card (5 Cols) */}
            <div className="lg:col-span-5 relative">
              {/* Sacred Golden Ring Glow Backdrop */}
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-400/40 via-orange-400/25 to-yellow-300/30 rounded-3xl blur-2xl transform scale-95"></div>

              <div className="relative bg-white/95 backdrop-blur-md rounded-3xl p-5 sm:p-7 shadow-2xl border-2 border-amber-200/90 transition-all duration-500 hover:border-amber-300">
                {/* Top Badge on Card */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="inline-flex items-center gap-1.5 bg-amber-100/80 text-amber-900 border border-amber-300/60 px-3 py-1 rounded-full text-xs font-bold shadow-2xs">
                    <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                    <span>Featured Essential</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span className="font-bold">{activeHeroProduct.rating}</span>
                    <span className="text-gray-500">({activeHeroProduct.reviews})</span>
                  </div>
                </div>

                {/* Main Product Showcase Image */}
                <div className="relative aspect-square sm:h-80 w-full bg-gradient-to-b from-[#FFFBF4] to-[#FFF3E0] rounded-2xl border border-amber-100 flex items-center justify-center p-6 overflow-hidden group">
                  <img
                    src={activeHeroProduct.image}
                    alt={activeHeroProduct.name}
                    className="w-full h-full object-contain filter drop-shadow-md transform group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Category Pill Over Image */}
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-amber-950 border border-amber-200 px-2.5 py-0.5 rounded-md text-[11px] font-bold shadow-2xs">
                    {activeHeroProduct.category || "Devotional"}
                  </div>

                  {activeHeroProduct.originalPrice && (
                    <div className="absolute top-3 right-3 bg-red-600 text-white font-extrabold text-[10px] px-2 py-0.5 rounded-md shadow-sm">
                      SAVE ₹{activeHeroProduct.originalPrice - activeHeroProduct.price}
                    </div>
                  )}

                  {/* Quick View Trigger on Image */}
                  <button
                    onClick={() => setDetailProduct(activeHeroProduct)}
                    className="absolute bottom-3 right-3 bg-white/90 hover:bg-white text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Eye className="w-3.5 h-3.5 text-orange-600" />
                    Quick View
                  </button>
                </div>

                {/* Product Meta */}
                <div className="mt-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-serif font-bold text-amber-950 leading-tight">
                        {activeHeroProduct.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-1">
                        {activeHeroProduct.description}
                      </p>
                    </div>
                  </div>

                  {/* Price & Action Row */}
                  <div className="flex items-center justify-between gap-3 mt-4 pt-3 border-t border-amber-100">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl sm:text-3xl font-extrabold text-amber-950 font-serif">
                        ₹{activeHeroProduct.price}
                      </span>
                      {activeHeroProduct.originalPrice && (
                        <span className="text-sm text-gray-400 line-through">
                          ₹{activeHeroProduct.originalPrice}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={(e) => handleAddToCart(activeHeroProduct, e)}
                      className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all active:scale-95 ${
                        addedItems[activeHeroProduct._id]
                          ? 'bg-green-600 text-white'
                          : 'bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white'
                      }`}
                    >
                      {addedItems[activeHeroProduct._id] ? (
                        <>
                          <Check className="w-4 h-4 stroke-[3]" />
                          <span>Added!</span>
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-4 h-4" />
                          <span>Add to Cart</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Hero Thumbnail Selector for All 7 Products */}
                <div className="mt-5 pt-3 border-t border-amber-100/80">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                      Browse Sacred Products
                    </span>
                    <span className="text-[11px] text-amber-700 font-medium">
                      {activeHeroIndex + 1} of {products.length}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                    {products.map((p, idx) => (
                      <button
                        key={p._id || idx}
                        onClick={() => setActiveHeroIndex(idx)}
                        className={`relative flex-shrink-0 w-12 h-12 rounded-xl p-1 bg-amber-50/80 border-2 transition-all ${
                          idx === activeHeroIndex
                            ? 'border-orange-600 ring-2 ring-orange-300 scale-105 shadow-xs'
                            : 'border-amber-200/70 hover:border-amber-300 opacity-70 hover:opacity-100'
                        }`}
                        title={p.name}
                      >
                        <img src={p.image} alt={p.name} className="w-full h-full object-contain" />
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 3. SHOP BY CATEGORY                                            */}
      {/* ============================================================== */}
      <section id="categories-section" className="py-16 sm:py-20 bg-white border-b border-amber-100/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-1.5 bg-amber-100/70 text-amber-900 border border-amber-200 px-3 py-1 rounded-full text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-orange-600" />
              <span>Divine Collection</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-amber-950 mb-4">
              Shop by Category
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-orange-500 to-amber-500 mx-auto rounded-full mb-4"></div>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              Explore authentic temple-grade pooja essentials, pure fragrances, and sacred offerings meticulously prepared for daily worship.
            </p>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {CATEGORIES.map((cat) => (
              <div
                key={cat.id}
                onClick={() => {
                  setSelectedFilter(cat.filterKey);
                  const el = document.getElementById('products-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`group cursor-pointer bg-gradient-to-b ${cat.accent} bg-white rounded-2xl p-4 sm:p-5 border border-amber-200/80 ${cat.border} shadow-xs hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between`}
              >
                <div>
                  {/* Category Image Box */}
                  <div className="w-full aspect-square rounded-xl bg-white p-3 sm:p-4 mb-4 border border-amber-100 flex items-center justify-center relative overflow-hidden group-hover:bg-amber-50/50 transition-colors">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-contain filter drop-shadow-sm group-hover:scale-110 transition-transform duration-500"
                    />
                    <span className="absolute top-2 right-2 text-[10px] font-serif font-semibold text-amber-800 bg-amber-100/90 px-2 py-0.5 rounded-full">
                      {cat.tamil}
                    </span>
                  </div>

                  {/* Titles */}
                  <h3 className="font-serif font-bold text-base sm:text-lg text-amber-950 group-hover:text-orange-700 transition-colors leading-snug">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 font-medium line-clamp-1">
                    {cat.subtitle}
                  </p>
                </div>

                {/* Footer Action */}
                <div className="mt-4 pt-3 border-t border-amber-100/70 flex items-center justify-between text-xs font-bold text-orange-600 group-hover:text-orange-700">
                  <span>View Products</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>

          {/* View All Categories Link */}
          <div className="text-center mt-10">
            <Link
              to="/offers"
              className="inline-flex items-center gap-2 text-sm font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-300/80 px-6 py-3 rounded-xl transition-all hover:shadow-md"
            >
              <span>Explore All Products & Festive Deals</span>
              <ArrowRight className="w-4 h-4 text-orange-600" />
            </Link>
          </div>

        </div>
      </section>

      {/* ============================================================== */}
      {/* 4. BEST SELLING PRODUCTS                                       */}
      {/* ============================================================== */}
      <section id="products-section" className="py-16 sm:py-24 bg-[#FFFDF7] scroll-mt-10 border-b border-amber-100/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-orange-100 text-orange-900 border border-orange-200 px-3 py-1 rounded-full text-xs font-semibold mb-3">
                <Flame className="w-3.5 h-3.5 text-orange-600 fill-orange-500" />
                <span>Customer Favorites</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-amber-950">
                Best Selling Products
              </h2>
              <p className="text-gray-600 text-sm sm:text-base mt-2 max-w-xl">
                Real, unadulterated devotional products crafted to elevate your prayers and celebrations.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {['All', 'Camphor', 'Powders', 'Sambrani', 'Combo Packs'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedFilter(tab)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                    selectedFilter === tab
                      ? 'bg-amber-800 text-white shadow-md'
                      : 'bg-white text-gray-700 hover:bg-amber-50 border border-amber-200'
                  }`}
                >
                  {tab === 'Powders' ? 'Sacred Powders' : tab}
                </button>
              ))}
            </div>
          </div>

          {/* Product Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const variants = getProductVariants(product);
              const selectedVariant = getSelectedVariant(product, selectedWeights);
              const { price, originalPrice, hasDiscount, discount, discountPercent } = getEffectivePricing(product, selectedVariant);

              return (
                <div
                  key={product._id}
                  className="bg-white rounded-2xl border border-amber-200/90 hover:border-amber-300 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group overflow-hidden"
                >
                  {/* Top Part */}
                  <div>
                    {/* Image Area */}
                    <div 
                      onClick={() => setDetailProduct(product)}
                      className="relative aspect-square w-full bg-gradient-to-b from-[#FFFBF4] to-white p-6 flex items-center justify-center cursor-pointer border-b border-amber-100 overflow-hidden"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-contain drop-shadow-sm group-hover:scale-105 transition-transform duration-500"
                      />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                        <span className="bg-amber-900/90 backdrop-blur-xs text-amber-100 text-[10px] font-bold px-2.5 py-0.5 rounded-md shadow-2xs">
                          {product.badge || "Pure"}
                        </span>
                        {hasDiscount && (
                          <span className="bg-red-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-2xs">
                            {discountPercent}% OFF
                          </span>
                        )}
                      </div>

                      {/* Quick View Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDetailProduct(product);
                        }}
                        className="absolute bottom-3 right-3 bg-white/95 text-gray-800 text-xs font-semibold px-2.5 py-1 rounded-lg border border-gray-200 shadow-sm flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Eye className="w-3.5 h-3.5 text-orange-600" />
                        Details
                      </button>
                    </div>

                    {/* Content Area */}
                    <div className="p-4 sm:p-5">
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
                        <span className="font-semibold text-amber-800 flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                          Vedha Assured
                        </span>
                        <div className="flex items-center gap-1 text-amber-700">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                          <span className="font-bold">{product.rating || 4.9}</span>
                        </div>
                      </div>

                      <h3 
                        onClick={() => setDetailProduct(product)}
                        className="font-serif font-bold text-base sm:text-lg text-amber-950 group-hover:text-orange-700 transition-colors line-clamp-1 cursor-pointer"
                        title={product.name}
                      >
                        {product.name}
                      </h3>

                      <p className="text-xs text-gray-600 mt-1 line-clamp-2 min-h-[32px]">
                        {product.description}
                      </p>

                      {/* Weight Selector Pills */}
                      {variants.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5" onClick={(e) => e.stopPropagation()}>
                          {variants.map((variant) => {
                            const isSelected = selectedVariant?.weight === variant.weight;
                            return (
                              <button
                                key={variant.weight}
                                type="button"
                                onClick={() => setSelectedWeights(prev => ({ ...prev, [product._id]: variant.weight }))}
                                className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                                  isSelected
                                    ? 'bg-amber-900 text-white border-amber-900 shadow-xs'
                                    : 'bg-amber-50/70 text-amber-900 border-amber-200 hover:bg-amber-100'
                                }`}
                              >
                                {variant.weight}
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {/* Price Section */}
                      <div className="mt-4 flex items-baseline gap-2">
                        <span className="text-xl sm:text-2xl font-serif font-extrabold text-amber-950">
                          ₹{price}
                        </span>
                        {hasDiscount && (
                          <>
                            <span className="text-xs text-gray-400 line-through">
                              ₹{originalPrice}
                            </span>
                            <span className="text-xs font-bold text-green-700">
                              (Save ₹{discount})
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="p-4 sm:p-5 pt-0 flex gap-2">
                    <button
                      type="button"
                      onClick={(e) => handleAddToCart(product, e)}
                      className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-95 ${
                        addedItems[product._id]
                          ? 'bg-green-600 text-white'
                          : 'bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300'
                      }`}
                    >
                      {addedItems[product._id] ? (
                        <>
                          <Check className="w-4 h-4 stroke-[3]" />
                          <span>Added to Cart!</span>
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-4 h-4 text-orange-700" />
                          <span>Add to Cart</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleBuyNow(product)}
                      className="px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white shadow-xs transition-all active:scale-95 whitespace-nowrap"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom link to view full catalog */}
          <div className="mt-12 text-center">
            <Link
              to="/offers"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm text-white bg-amber-800 hover:bg-amber-900 shadow-md hover:shadow-lg transition-all"
            >
              <span>View All Products in Offers</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>

      {/* ============================================================== */}
      {/* 5. POOJA ESSENTIALS BANNER (Promotional Section for Combos)    */}
      {/* ============================================================== */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-[#FFF2DE] via-[#FFEAD0] to-[#FFF6E9] border-y border-amber-200/90 relative overflow-hidden">
        {/* Background Decorative Gold Ring */}
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-amber-400/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-10 lg:p-12 border-2 border-amber-300 shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Column: Promo Details (7 Cols) */}
              <div className="lg:col-span-7">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-600 text-white px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase shadow-sm mb-4">
                  <Sparkles className="w-4 h-4 text-amber-200" />
                  <span>Special Combo Pack Offer</span>
                </div>

                <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-amber-950 leading-tight mb-4">
                  All-in-One Pooja Essentials Kit
                </h2>

                <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-6">
                  Perform daily pooja and festive rituals with complete divine peace of mind. Our sanctified 
                  All-in-One Combo includes all seven vital devotional offerings gathered in ideal quantities.
                </p>

                {/* List of 7 Sacred items included in combo */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
                  {[
                    { title: "Pure Camphor", detail: "Soot-free flame" },
                    { title: "Vedha Kungumam", detail: "Temple red" },
                    { title: "Special Manjal", detail: "Bright turmeric" },
                    { title: "Thiruneeru", detail: "Holy vibhuti" },
                    { title: "Pure Sandhanam", detail: "Cooling chandan" },
                    { title: "Benzoin Sambrani", detail: "Aromatic dhoop" },
                  ].map((item, idx) => (
                    <div key={idx} className="bg-amber-50/80 rounded-xl p-2.5 border border-amber-200/70">
                      <div className="text-xs font-bold text-amber-950 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-orange-600" />
                        {item.title}
                      </div>
                      <div className="text-[11px] text-gray-500 pl-4">{item.detail}</div>
                    </div>
                  ))}
                </div>

                {/* Pricing & CTA */}
                <div className="flex flex-wrap items-center gap-4">
                  <div className="bg-amber-100/90 px-4 py-2 rounded-xl border border-amber-300">
                    <span className="text-xs text-gray-600 block">Combo Price</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl sm:text-3xl font-extrabold text-amber-950 font-serif">
                        ₹{comboProduct.price || 250}
                      </span>
                      <span className="text-sm text-gray-500 line-through">
                        ₹{comboProduct.originalPrice || 300}
                      </span>
                      <span className="text-xs font-bold text-green-700 bg-green-100 px-1.5 py-0.5 rounded">
                        Save ₹{comboProduct.originalPrice ? comboProduct.originalPrice - comboProduct.price : 50}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => handleAddToCart(comboProduct, e)}
                    className={`px-6 py-3.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg transition-all active:scale-95 ${
                      addedItems[comboProduct._id]
                        ? 'bg-green-600 text-white'
                        : 'bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white'
                    }`}
                  >
                    {addedItems[comboProduct._id] ? (
                      <>
                        <Check className="w-4 h-4 stroke-[3]" />
                        <span>Combo Added to Cart!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4" />
                        <span>Add Combo Kit to Cart</span>
                      </>
                    )}
                  </button>

                  <Link
                    to="/custom-order"
                    className="px-5 py-3.5 rounded-xl font-bold text-sm text-amber-950 bg-white hover:bg-amber-50 border border-amber-300 transition-colors shadow-xs"
                  >
                    Customize Custom Kit →
                  </Link>
                </div>
              </div>

              {/* Right Column: Combo Box Visual Presentation (5 Cols) */}
              <div className="lg:col-span-5">
                <div className="relative aspect-square w-full max-w-md mx-auto bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border-2 border-amber-200/90 shadow-inner flex items-center justify-center">
                  <img
                    src={comboProduct.image}
                    alt={comboProduct.name}
                    className="w-full h-full object-contain filter drop-shadow-xl"
                  />
                  <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md rounded-xl p-3 border border-amber-200/80 shadow-md text-center">
                    <span className="text-xs font-bold text-amber-950">
                      7 Sacred Offerings • Handy 50g Travel & Home Packs
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 6. OUR BRAND SECTION                                           */}
      {/* ============================================================== */}
      <section className="py-20 sm:py-24 bg-white relative border-b border-amber-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <div className="inline-flex items-center gap-2 bg-amber-100/80 text-amber-900 border border-amber-200 px-4 py-1 rounded-full text-xs font-bold mb-4">
            <Flame className="w-3.5 h-3.5 text-orange-600" />
            <span>Sacred Heritage & Purity</span>
          </div>

          {/* Heading (Required by Prompt) */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-amber-950 mb-6 leading-snug">
            Tradition, Purity & Devotion – <br className="hidden sm:inline" />
            <span className="text-orange-600">The Vedha Promise</span>
          </h2>

          {/* Content (Required by Prompt) */}
          <p className="text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed font-sans max-w-3xl mx-auto mb-12">
            At Vedha Devotional Mart, we believe every prayer deserves purity. We bring together essential devotional products that make your daily worship and special occasions more meaningful.
          </p>

          {/* ============================================================== */}
          {/* CONTINUOUS MARQUEE GLIDE (Endless Smooth Auto-Scroll)          */}
          {/* ============================================================== */}
          <div className="relative w-full overflow-hidden py-4 select-none group">
            {/* Soft Edge Fade Gradients for Premium Look */}
            <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-white to-transparent z-20"></div>
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-white to-transparent z-20"></div>

            {/* Seamless Infinite Marquee Track (Repeated for seamless loop) */}
            <div className="animate-marquee-glide flex items-center gap-5 sm:gap-6">
              {[...BRAND_PILLARS, ...BRAND_PILLARS].map((pillar, idx) => {
                const Icon = pillar.icon;
                const isSelected = brandCardIndex === (idx % BRAND_PILLARS.length);

                return (
                  <div
                    key={`${pillar.id}-${idx}`}
                    onClick={() => setBrandCardIndex(idx % BRAND_PILLARS.length)}
                    className={`w-[290px] sm:w-[320px] h-[310px] rounded-3xl p-6 text-left flex flex-col justify-between transition-all duration-300 cursor-pointer flex-shrink-0 ${
                      isSelected
                        ? 'bg-white border-2 border-orange-500 shadow-2xl ring-4 ring-orange-200/60 scale-[1.02]'
                        : 'bg-gradient-to-b from-amber-50/50 to-white border border-amber-200/80 shadow-md hover:border-orange-300 hover:shadow-xl hover:scale-[1.02]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-13 h-13 rounded-2xl ${pillar.iconBg} flex items-center justify-center shadow-xs`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                          isSelected ? 'bg-orange-50 text-orange-700 border-orange-200' : 'bg-gray-50 text-gray-600 border-gray-200'
                        }`}>
                          {pillar.tag}
                        </span>
                      </div>

                      <div className="text-[11px] font-semibold text-amber-700 mb-1">{pillar.tamil}</div>
                      <h3 className="font-serif font-bold text-lg text-amber-950 mb-2 leading-snug">
                        {pillar.title}
                      </h3>
                      <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">
                        {pillar.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-amber-100 flex items-center justify-between text-xs font-semibold text-orange-600">
                      <span>{pillar.highlight}</span>
                      <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ============================================================== */}
          {/* BOTTOM PILL SELECTOR (Inspired by User's Reference Screenshot) */}
          {/* ============================================================== */}
          <div className="mt-8 flex justify-center">
            <div className="bg-white/95 backdrop-blur-md border border-amber-200/90 rounded-full p-1.5 shadow-md flex items-center gap-1 sm:gap-1.5 overflow-x-auto max-w-full">
              {BRAND_PILLARS.map((pillar, idx) => {
                const Icon = pillar.icon;
                const isActive = brandCardIndex === idx;
                return (
                  <button
                    key={pillar.id}
                    onClick={() => setBrandCardIndex(idx)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-300 text-xs font-bold whitespace-nowrap cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-sm scale-105'
                        : 'text-amber-900/70 hover:text-amber-950 hover:bg-amber-100/60'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className={isActive ? 'inline' : 'hidden sm:inline'}>{pillar.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-12">
            <Link
              to="/about"
              className="inline-flex items-center gap-2 text-sm font-bold text-orange-700 hover:text-orange-800 underline decoration-orange-300 hover:decoration-orange-600"
            >
              <span>Learn more about our heritage & mission</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>

      {/* ============================================================== */}
      {/* 7. WHY CHOOSE VEDHA DEVOTIONAL MART?                           */}
      {/* ============================================================== */}
      <section className="py-20 sm:py-24 bg-[#FFFDF7] border-b border-amber-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-amber-950 mb-4">
              Why Choose Vedha Devotional Mart?
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-amber-500 mx-auto rounded-full mb-4"></div>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              We uphold sacred traditions by delivering untouched devotional purity straight from trusted artisanal sources.
            </p>
          </div>

          {/* Four Required Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Card 1: Premium Quality Products */}
            <div className="bg-white p-6 sm:p-7 rounded-2xl border border-amber-200/80 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-center group">
              <div className="w-16 h-16 mx-auto bg-gradient-to-tr from-amber-100 to-orange-100 rounded-2xl flex items-center justify-center text-orange-600 mb-6 group-hover:scale-110 transition-transform shadow-xs">
                <Award className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-serif font-bold text-amber-950 mb-3">
                Premium Quality Products
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Handcrafted and selected strictly from natural, unadulterated ingredients ensuring the highest standards of spiritual sanctity.
              </p>
            </div>

            {/* Card 2: Purity You Can Trust */}
            <div className="bg-white p-6 sm:p-7 rounded-2xl border border-amber-200/80 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-center group">
              <div className="w-16 h-16 mx-auto bg-gradient-to-tr from-amber-100 to-orange-100 rounded-2xl flex items-center justify-center text-orange-600 mb-6 group-hover:scale-110 transition-transform shadow-xs">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-serif font-bold text-amber-950 mb-3">
                Purity You Can Trust
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                100% sacred, clean, soot-free, and chemical-free formulations respecting ancient temple sanctum requirements.
              </p>
            </div>

            {/* Card 3: Traditional Devotional Essentials */}
            <div className="bg-white p-6 sm:p-7 rounded-2xl border border-amber-200/80 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-center group">
              <div className="w-16 h-16 mx-auto bg-gradient-to-tr from-amber-100 to-orange-100 rounded-2xl flex items-center justify-center text-orange-600 mb-6 group-hover:scale-110 transition-transform shadow-xs">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-serif font-bold text-amber-950 mb-3">
                Traditional Devotional Essentials
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Everything you require for daily worship, festive homams, and temple poojas gathered under one trusted roof.
              </p>
            </div>

            {/* Card 4: Customer Satisfaction */}
            <div className="bg-white p-6 sm:p-7 rounded-2xl border border-amber-200/80 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-center group">
              <div className="w-16 h-16 mx-auto bg-gradient-to-tr from-amber-100 to-orange-100 rounded-2xl flex items-center justify-center text-orange-600 mb-6 group-hover:scale-110 transition-transform shadow-xs">
                <Star className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-serif font-bold text-amber-950 mb-3">
                Customer Satisfaction
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Dedicated to serving thousands of happy devotees with safe packaging, prompt doorstep delivery, and genuine care.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ============================================================== */}
      {/* 8. CUSTOM ORDER / TEMPLE BULK CALL TO ACTION                   */}
      {/* ============================================================== */}
      <section className="py-14 bg-gradient-to-r from-orange-600 via-amber-700 to-amber-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-200 block mb-1">
                Special Occasions & Temple Pooja
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold leading-tight">
                Need Custom Packs or Bulk Devotional Products?
              </h3>
              <p className="text-amber-100 text-sm mt-2 max-w-xl">
                Build your personalized pooja bundle with custom quantities of camphor, kumkum, turmeric, vibhuti, and sambrani.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/custom-order"
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl font-bold text-sm bg-white text-amber-950 hover:bg-amber-50 shadow-lg transition-all"
              >
                <ShoppingBag className="w-4 h-4 mr-2 text-orange-600" />
                Customize Your Order
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl font-bold text-sm bg-amber-800/60 hover:bg-amber-800 text-white border border-amber-300/40 transition-all"
              >
                Contact Devotional Support
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 9. QUICK VIEW PRODUCT DETAIL MODAL                             */}
      {/* ============================================================== */}
      {detailProduct && (
        <div 
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity ${
            isClosingModal ? 'animate-fade-out-backdrop' : 'animate-fade-in-backdrop'
          }`}
          onClick={closeModal}
        >
          <div 
            className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-amber-200 relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              {/* Product Image */}
              <div className="aspect-square bg-amber-50/60 rounded-2xl p-6 flex items-center justify-center border border-amber-100">
                <img
                  src={detailProduct.image}
                  alt={detailProduct.name}
                  className="w-full h-full object-contain filter drop-shadow-md"
                />
              </div>

              {/* Product Info */}
              <div>
                <div className="inline-flex items-center gap-1 text-xs font-semibold text-orange-800 bg-orange-50 px-2.5 py-0.5 rounded-md mb-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-orange-600" />
                  <span>{detailProduct.badge || "Vedha Assured"}</span>
                </div>

                <h3 className="text-2xl font-serif font-bold text-amber-950 mb-2">
                  {detailProduct.name}
                </h3>

                <p className="text-xs text-gray-500 mb-4">
                  {detailProduct.category || "Pooja Essentials"}
                </p>

                <p className="text-sm text-gray-700 leading-relaxed mb-4">
                  {detailProduct.description}
                </p>

                {/* Weight Selector in Modal */}
                {(() => {
                  const modalVariants = getProductVariants(detailProduct);
                  const modalSelected = getSelectedVariant(detailProduct, selectedWeights);
                  const modalPricing = getEffectivePricing(detailProduct, modalSelected);
                  return (
                    <>
                      {modalVariants.length > 0 && (
                        <div className="mb-4">
                          <span className="block text-xs font-semibold text-gray-600 mb-1.5">Select Weight:</span>
                          <div className="flex flex-wrap gap-2">
                            {modalVariants.map((variant) => {
                              const isSelected = modalSelected?.weight === variant.weight;
                              return (
                                <button
                                  key={variant.weight}
                                  type="button"
                                  onClick={() => setSelectedWeights(prev => ({ ...prev, [detailProduct._id]: variant.weight }))}
                                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                                    isSelected
                                      ? 'bg-amber-900 text-white border-amber-900 shadow-xs'
                                      : 'bg-amber-50/80 text-amber-900 border-amber-200 hover:bg-amber-100'
                                  }`}
                                >
                                  {variant.weight}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Pricing */}
                      <div className="flex items-baseline gap-2 mb-6">
                        <span className="text-3xl font-serif font-bold text-amber-950">
                          ₹{modalPricing.price}
                        </span>
                        {modalPricing.hasDiscount && (
                          <span className="text-sm text-gray-400 line-through">
                            ₹{modalPricing.originalPrice}
                          </span>
                        )}
                        {modalPricing.hasDiscount && (
                          <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded">
                            Save ₹{modalPricing.discount}
                          </span>
                        )}
                      </div>
                    </>
                  );
                })()}

                {/* Action Buttons */}
                <div className="flex flex-col gap-2">
                  <button
                    onClick={(e) => {
                      handleAddToCart(detailProduct, e);
                    }}
                    className={`w-full py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all ${
                      addedItems[detailProduct._id]
                        ? 'bg-green-600 text-white'
                        : 'bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white'
                    }`}
                  >
                    {addedItems[detailProduct._id] ? (
                      <>
                        <Check className="w-4 h-4 stroke-[3]" />
                        <span>Added to Cart!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4" />
                        <span>Add to Cart</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      handleBuyNow(detailProduct);
                    }}
                    className="w-full py-2.5 px-4 rounded-xl font-bold text-xs text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-300 transition-colors"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Home;