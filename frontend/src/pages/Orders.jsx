import { PackageX } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Orders = () => {
  const navigate = useNavigate();
  return (
    <div className="py-20 animate-in fade-in duration-500 bg-gray-50 min-h-[60vh] flex items-center">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full">
        <div className="bg-white p-12 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center">
          <div className="w-24 h-24 bg-amber-50 rounded-full flex items-center justify-center mb-6">
            <PackageX className="w-10 h-10 text-amber-600" />
          </div>
          <h2 className="text-3xl font-serif text-gray-900 mb-4">No Orders Yet</h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto cursor-pointer hover:text-amber-700 transition-colors" onClick={() => navigate('/offers')}>
            You haven't placed any orders with us yet. Explore our collection of pure camphor products and add a spark to your rituals.
          </p>
          <Link to="/offers" className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white bg-amber-800 hover:bg-amber-900 rounded-lg shadow transition-colors duration-300">
            Start Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Orders;
