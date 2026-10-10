import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Star, ShieldCheck } from 'lucide-react';

const Home = () => {
  return (
    <div className="animate-in fade-in duration-500">
      {/* Hero Section */}
      <section className="relative bg-amber-50 py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
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
          <div className="md:w-1/2 relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-200 to-amber-50 rounded-full blur-3xl opacity-50 transform scale-90"></div>
            {/* Mockup image placeholder for camphor */}
            <div className="relative bg-white p-8 rounded-2xl shadow-2xl border border-amber-100 transform rotate-2 hover:rotate-0 transition-transform duration-500">
              <div className="aspect-square bg-amber-50 rounded-xl flex items-center justify-center border border-amber-100 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1605371924599-2d0365da1ae0?q=80&w=800&auto=format&fit=crop" alt="Traditional Camphor Setup" className="w-full h-full object-cover opacity-90" />
              </div>
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
