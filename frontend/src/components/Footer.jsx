import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

const Footer = () => {
  return (
    <footer className="bg-[#ff6201] text-white py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <Link to="/" className="flex items-center mb-4" aria-label="Vedha Devotional Mart home">
            <img src={logo} alt="" className="h-20 w-20 object-contain rounded-lg bg-white/10 p-1" />
            <div className="flex flex-col items-start ml-3">
              <span className="text-2xl font-serif tracking-widest text-white leading-none">VEDHA</span>
              <span className="text-xs tracking-[0.12em] font-medium text-orange-100 mt-1">DEVOTIONAL MART</span>
            </div>
          </Link>
          <p className="text-white/90 mt-4 leading-relaxed font-serif italic">
            For everyday rituals.<br/>For moments that matter.
          </p>
        </div>
        
        <div className="flex flex-col space-y-3">
          <h3 className="text-lg font-medium text-white mb-2 border-b border-white/25 pb-2 inline-block">Quick Links</h3>
          <Link to="/offers" className="text-white/85 hover:text-white transition-colors">Offer details</Link>
          <Link to="/terms" className="text-white/85 hover:text-white transition-colors">Terms & Conditions</Link>
          <Link to="/about" className="text-white/85 hover:text-white transition-colors">About us</Link>
          <Link to="/contact" className="text-white/85 hover:text-white transition-colors">Get in touch</Link>
        </div>
        
        <div>
          <h3 className="text-lg font-medium text-white mb-2 border-b border-white/25 pb-2 inline-block">Newsletter</h3>
          <p className="text-white/90 mb-4 text-sm">Subscribe to receive updates, access to exclusive deals, and more.</p>
          <div className="flex mb-6">
            <input type="email" placeholder="Enter your email" className="px-4 py-2 w-full text-gray-900 bg-white rounded-l focus:outline-none focus:ring-2 focus:ring-orange-300" />
            <button className="bg-gray-950 hover:bg-black text-white px-5 py-2 rounded-r transition-colors font-medium shadow-sm">Subscribe</button>
          </div>
          <Link to="/admin/login" className="text-xs text-white/60 hover:text-white transition-colors">Admin Access</Link>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-white/20 text-center text-sm text-white/80">
        <small>© 2026 Vedha Devotional Mart · A brighter beginning</small>
      </div>
    </footer>
  );
};

export default Footer;
