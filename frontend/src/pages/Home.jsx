import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Star, ShieldCheck, ChevronLeft, ChevronRight, Tag } from 'lucide-react';
import axios from 'axios';

const Home = () => {
  const [slides, setSlides] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await axios.get('https://vedha-karpooram.onrender.com/api/prices');
        const priceList = Array.isArray(res.data) ? res.data : [];
        const validPriceImages = priceList
          .filter(item => item.image && typeof item.image === 'string' && item.image.trim() !== '')
          .map(item => ({
            id: item._id,
            image: item.image,
            title: item.title,
            amount: item.amount,
            description: item.description
          }));

        setSlides(validPriceImages);
      } catch (err) {
        console.error('Error fetching price images:', err);
        setSlides([]);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  // Cycle image every 3 seconds if there are multiple images
  useEffect(() => {
    if (slides.length <= 1 || isHovered) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [slides.length, isHovered]);

  const handlePrev = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const currentSlide = slides.length > 0 ? slides[currentIndex % slides.length] : null;

  return (
    <div className="animate-in fade-in duration-500">
      {/* Hero Section */}
      <section className="relative bg-amber-50 py-16 md:py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2 mb-4 md:mb-0">
            <div className="inline-flex items-center space-x-2 bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              <span>Premium Quality Camphor</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-serif text-amber-950 leading-tight mb-6">
              Pure Light.<br/>
              <span className="italic text-amber-700">Pure Devotion.</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-lg leading-relaxed">
              Experience the divine purity of Vedha Karpooram. Crafted with traditional methods for an aromatic, soot-free flame that elevates your spiritual rituals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/offers" className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white bg-amber-800 hover:bg-amber-900 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                Explore Offers
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link to="/prices" className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-amber-900 bg-white border border-amber-200 hover:bg-amber-50 rounded-lg shadow hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                View Prices
              </Link>
            </div>
          </div>

          {/* Dynamic 3s Image Carousel or 'No price is announced' */}
          <div className="md:w-1/2 relative w-full max-w-lg md:max-w-none">
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-300/40 via-amber-200/30 to-amber-100/20 rounded-full blur-3xl opacity-70 transform scale-95"></div>

            <div 
              className="relative bg-white p-4 sm:p-6 rounded-3xl shadow-2xl border border-amber-100 transform rotate-1 hover:rotate-0 transition-transform duration-500 group"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {loading ? (
                <div className="relative aspect-square bg-amber-50/50 rounded-2xl border border-amber-100 flex items-center justify-center">
                  <div className="flex flex-col items-center space-y-3 text-amber-800">
                    <div className="w-8 h-8 border-3 border-amber-700 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm font-medium">Checking prices...</span>
                  </div>
                </div>
              ) : slides.length === 0 ? (
                /* No price is announced view */
                <div className="relative aspect-square bg-amber-50/50 rounded-2xl border border-dashed border-amber-200 flex flex-col items-center justify-center p-6 sm:p-8 text-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-amber-100 text-amber-800 rounded-2xl flex items-center justify-center mb-5 shadow-sm">
                    <Tag className="w-8 h-8 sm:w-10 sm:h-10" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-serif text-amber-950 font-semibold mb-2">
                    No price is announced
                  </h3>
                  <p className="text-gray-600 text-sm sm:text-base max-w-xs leading-relaxed mb-6">
                    Prices have not been announced yet. Please check back later or explore our special offers!
                  </p>
                  <Link
                    to="/offers"
                    className="inline-flex items-center space-x-2 bg-amber-800 hover:bg-amber-900 text-white font-medium text-sm px-6 py-3 rounded-xl shadow-md transition-all hover:-translate-y-0.5"
                  >
                    <span>Explore Offers</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              ) : (
                /* Image Carousel when prices are added */
                <div className="relative aspect-square bg-amber-50 rounded-2xl border border-amber-100 overflow-hidden shadow-inner">
                  {slides.map((slide, idx) => (
                    <div
                      key={slide.id || idx}
                      className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                        idx === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                      }`}
                    >
                      <img 
                        src={slide.image} 
                        alt={slide.title || 'Vedha Karpooram Price Tier'} 
                        className="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-700" 
                      />
                      {/* Atmospheric gradient overlay for readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/30 pointer-events-none"></div>
                    </div>
                  ))}

                  {/* Top Badge: Dynamic price title */}
                  {currentSlide && (
                    <div className="absolute top-4 left-4 z-20 pointer-events-none">
                      <span className="inline-flex items-center space-x-1.5 bg-black/45 backdrop-blur-md text-amber-200 border border-white/20 px-3 py-1 rounded-full text-xs font-medium shadow-md">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span className="truncate max-w-[200px]">{currentSlide.title || 'Pure Camphor'}</span>
                      </span>
                    </div>
                  )}

                  {/* Top Right: 3s auto-play indicator pill */}
                  {slides.length > 1 && (
                    <div className="absolute top-4 right-4 z-20 pointer-events-none">
                      <span className="inline-flex items-center space-x-1.5 bg-black/45 backdrop-blur-md text-white/90 border border-white/20 px-2.5 py-1 rounded-full text-[11px] font-medium shadow-md">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      </span>
                    </div>
                  )}

                  {/* Left/Right Navigation Arrows */}
                  {slides.length > 1 && (
                    <>
                      <button
                        onClick={handlePrev}
                        aria-label="Previous image"
                        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 shadow-lg border border-white/20"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={handleNext}
                        aria-label="Next image"
                        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 shadow-lg border border-white/20"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}

                  {/* Bottom Overlay: Price Amount and View Price CTA */}
                  {currentSlide && (
                    <div className="absolute bottom-10 left-4 right-4 z-20 flex items-center justify-between gap-3 text-white">
                      <div className="bg-black/55 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/15 shadow-lg">
                        <div className="flex items-center gap-2">
                          <Tag className="w-4 h-4 text-amber-400" />
                          <span className="text-xl sm:text-2xl font-bold text-amber-300 font-serif leading-none">
                            {currentSlide.amount || 'Best Price'}
                          </span>
                        </div>
                        <p className="text-xs text-gray-200 mt-1 line-clamp-1 max-w-[170px] sm:max-w-[220px]">
                          {currentSlide.title}
                        </p>
                      </div>

                      <Link
                        to="/prices"
                        className="bg-amber-600 hover:bg-amber-700 text-white font-medium px-4 py-2.5 rounded-xl text-xs sm:text-sm shadow-xl transition-all duration-200 hover:shadow-amber-500/30 flex items-center gap-1.5 border border-amber-400/30 whitespace-nowrap"
                      >
                        <span>View Prices</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  )}

                  {/* Pagination Dots */}
                  {slides.length > 1 && (
                    <div className="absolute bottom-3 left-0 right-0 z-20 flex justify-center items-center space-x-2">
                      {slides.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentIndex(idx)}
                          aria-label={`Jump to image ${idx + 1}`}
                          className={`transition-all duration-300 rounded-full ${
                            idx === currentIndex
                              ? 'w-6 h-2 bg-amber-400 shadow'
                              : 'w-2 h-2 bg-white/60 hover:bg-white'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif text-amber-950 mb-4">Why Choose Vedha Karpooram?</h2>
            <div className="w-24 h-1 bg-amber-300 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="text-center p-6 rounded-xl bg-amber-50/50 hover:bg-amber-50 transition-colors border border-transparent hover:border-amber-100">
              <div className="w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center shadow-sm mb-6 text-amber-600">
                <Star className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-3">100% Pure</h3>
              <p className="text-gray-600">Made from high-quality ingredients, ensuring a bright, clean, and continuous flame.</p>
            </div>
            <div className="text-center p-6 rounded-xl bg-amber-50/50 hover:bg-amber-50 transition-colors border border-transparent hover:border-amber-100">
              <div className="w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center shadow-sm mb-6 text-amber-600">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-3">Soot-Free</h3>
              <p className="text-gray-600">Burns completely without leaving any black residue, keeping your pooja room clean.</p>
            </div>
            <div className="text-center p-6 rounded-xl bg-amber-50/50 hover:bg-amber-50 transition-colors border border-transparent hover:border-amber-100">
              <div className="w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center shadow-sm mb-6 text-amber-600">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-3">Divine Fragrance</h3>
              <p className="text-gray-600">Releases a calming, traditional aroma that purifies the air and uplifts the spirit.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
