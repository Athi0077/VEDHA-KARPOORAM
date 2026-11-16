import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, ShoppingCart, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import logo from '../assets/logo.png';

const Navbar = () => {
  const { cartCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/offers' },
    { name: 'Custom Order', path: '/custom-order' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center group" aria-label="Vedha Devotional Mart home">
            <img src={logo} alt="Vedha Devotional Mart" className="h-25 w-25 object-contain" />
            <div className="flex flex-col items-start ml-2">
              <span className="text-2xl font-serif tracking-widest text-amber-900 leading-none group-hover:text-amber-700 transition-colors">VEDHA</span>
              <span className="text-xs tracking-[0.12em] font-medium text-gray-500 mt-1">DEVOTIONAL MART</span>
            </div>
          </Link>
          
          {/* Desktop Navigation Links with Active Underline */}
          <nav className="hidden md:flex items-center space-x-7">
            {navLinks.map((link) => {
              const isActive = currentPath === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative py-2 text-base transition-colors duration-200 select-none ${
                    isActive
                      ? 'text-orange-700 font-bold'
                      : 'text-gray-600 hover:text-amber-700 font-medium'
                  }`}
                >
                  <span>{link.name}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[2.5px] bg-gradient-to-r from-orange-600 via-amber-600 to-amber-500 rounded-full shadow-xs transition-all duration-300" />
                  )}
                </Link>
              );
            })}
          </nav>
          
          <div className="flex items-center space-x-6">
            <Link 
              to="/cart" 
              className={`relative transition-colors py-2 ${
                currentPath === '/cart' ? 'text-orange-700' : 'text-gray-600 hover:text-amber-700'
              }`}
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute top-0 -right-2 bg-amber-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
              {currentPath === '/cart' && (
                <span className="absolute bottom-0 left-0 w-full h-[2.5px] bg-gradient-to-r from-orange-600 to-amber-600 rounded-full" />
              )}
            </Link>

            <Link 
              to="/orders" 
              className={`hidden md:flex items-center font-medium transition-colors relative py-2 ${
                currentPath === '/orders'
                  ? 'text-orange-700 font-bold'
                  : 'text-gray-600 hover:text-amber-700'
              }`}
            >
              <ShoppingBag className="w-5 h-5 mr-1" />
              <span>My Orders</span>
              {currentPath === '/orders' && (
                <span className="absolute bottom-0 left-0 w-full h-[2.5px] bg-gradient-to-r from-orange-600 to-amber-600 rounded-full" />
              )}
            </Link>

            <button 
              className="md:hidden text-gray-600 p-1"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle Navigation Menu"
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
            {navLinks.map((link) => {
              const isActive = currentPath === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-3 py-3 rounded-md text-base transition-colors ${
                    isActive
                      ? 'text-orange-700 font-bold bg-orange-50/70 border-l-4 border-orange-600 pl-4'
                      : 'text-gray-700 font-medium hover:text-amber-700 hover:bg-amber-50'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
            <Link 
              to="/orders" 
              onClick={() => setIsMenuOpen(false)} 
              className={`block px-3 py-3 rounded-md text-base flex items-center mt-2 border-t border-gray-100 ${
                currentPath === '/orders'
                  ? 'text-orange-700 font-bold bg-orange-50/70 border-l-4 border-orange-600 pl-4'
                  : 'text-amber-700 font-medium hover:bg-amber-50'
              }`}
            >
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
