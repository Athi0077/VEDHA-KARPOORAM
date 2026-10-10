import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-amber-950 text-amber-50 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <Link to="/" className="flex flex-col items-start mb-4">
            <span className="text-2xl font-serif tracking-widest text-white leading-none">VEDHA</span>
            <span className="text-xs tracking-[0.3em] font-medium text-amber-200 mt-1">KARPOORAM</span>
          </Link>
          <p className="text-amber-200/80 mt-4 leading-relaxed font-serif italic">
            For everyday rituals.<br/>For moments that matter.
          </p>
        </div>
        
        <div className="flex flex-col space-y-3">
          <h3 className="text-lg font-medium text-amber-100 mb-2 border-b border-amber-800 pb-2 inline-block">Quick Links</h3>
          <Link to="/offers" className="text-amber-200/80 hover:text-white transition-colors">Offer details</Link>
          <Link to="/about" className="text-amber-200/80 hover:text-white transition-colors">About us</Link>
          <Link to="/contact" className="text-amber-200/80 hover:text-white transition-colors">Get in touch</Link>
        </div>
        
        <div>
          <h3 className="text-lg font-medium text-amber-100 mb-2 border-b border-amber-800 pb-2 inline-block">Newsletter</h3>
          <p className="text-amber-200/80 mb-4 text-sm">Subscribe to receive updates, access to exclusive deals, and more.</p>
          <div className="flex mb-6">
            <input type="email" placeholder="Enter your email" className="px-4 py-2 w-full text-gray-900 bg-amber-50 rounded-l focus:outline-none focus:ring-2 focus:ring-amber-500" />
            <button className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-r transition-colors">Subscribe</button>
          </div>
          <Link to="/admin/login" className="text-xs text-amber-200/40 hover:text-amber-200 transition-colors">Admin Access</Link>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-amber-900/50 text-center text-sm text-amber-200/60">
        <small>© 2026 Vedha Karpooram · A brighter beginning</small>
      </div>
    </footer>
  );
};

export default Footer;
