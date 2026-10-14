import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Menu, ShoppingCart, X } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { cartCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex flex-col items-start group">
            <span className="text-2xl font-serif tracking-widest text-amber-900 leading-none group-hover:text-amber-700 transition-colors">VEDHA</span>
            <span className="text-xs tracking-[0.3em] font-medium text-gray-500 mt-1">KARPOORAM</span>
          </Link>
          
          <nav className="hidden md:flex space-x-7">
            <Link to="/" className="text-gray-600 hover:text-amber-700 font-medium transition-colors">Home</Link>
            <Link to="/offers" className="text-gray-600 hover:text-amber-700 font-medium transition-colors">The Offer</Link>
            <Link to="/terms" className="text-gray-600 hover:text-amber-700 font-medium transition-colors">Terms & Conditions</Link>
            <Link to="/about" className="text-gray-600 hover:text-amber-700 font-medium transition-colors">About Us</Link>
            <Link to="/contact" className="text-gray-600 hover:text-amber-700 font-medium transition-colors">Contact</Link>
          </nav>
          
          <div className="flex items-center space-x-6">
            <Link to="/cart" className="relative text-gray-600 hover:text-amber-700 transition-colors">
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-amber-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
            <Link to="/orders" className="hidden md:flex items-center text-gray-600 hover:text-amber-700 font-medium transition-colors">
              <ShoppingBag className="w-5 h-5 mr-1" />
              My Orders
            </Link>
            <button 
              className="md:hidden text-gray-600"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg absolute w-full left-0 z-50 animate-in slide-in-from-top-2">
          <div className="px-4 pt-2 pb-6 space-y-1">
            <Link to="/" onClick={() => setIsMenuOpen(false)} className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-amber-700 hover:bg-amber-50">Home</Link>
            <Link to="/offers" onClick={() => setIsMenuOpen(false)} className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-amber-700 hover:bg-amber-50">The Offer</Link>
            <Link to="/terms" onClick={() => setIsMenuOpen(false)} className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-amber-700 hover:bg-amber-50">Terms & Conditions</Link>
            <Link to="/about" onClick={() => setIsMenuOpen(false)} className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-amber-700 hover:bg-amber-50">About Us</Link>
            <Link to="/contact" onClick={() => setIsMenuOpen(false)} className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-amber-700 hover:bg-amber-50">Contact</Link>
            <Link to="/orders" onClick={() => setIsMenuOpen(false)} className="block px-3 py-3 rounded-md text-base font-medium text-amber-700 hover:bg-amber-50 flex items-center mt-2 border-t border-gray-100">
              <ShoppingBag className="w-5 h-5 mr-2" />
              My Orders
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
