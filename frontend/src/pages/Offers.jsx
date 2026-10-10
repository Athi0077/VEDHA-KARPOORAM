import { ShoppingCart, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useState, useEffect } from 'react';
import axios from 'axios';

const Offers = () => {
  const { addToCart } = useCart();
  const [addedItems, setAddedItems] = useState({});
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('https://vedha-karpooram.onrender.com/api/products');
        setProducts(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    // Map _id to id for the cart
    const productForCart = { ...product, id: product._id };
    addToCart(productForCart);
    setAddedItems({ ...addedItems, [product._id]: true });
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [product._id]: false }));
    }, 2000);
  };

  return (
    <div className="py-16 animate-in fade-in duration-500 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif text-amber-950 mb-4">Celebration Offers</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Discover our exclusive collection of pure camphor products at special festive prices.</p>
        </div>

        {loading ? (
          <div className="text-center text-gray-500">Loading products...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div key={product._id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-100 group">
                <div className="relative h-64 overflow-hidden bg-gray-100">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  {product.originalPrice && product.originalPrice > product.price && (
                    <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                      Save ₹{product.originalPrice - product.price}
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-medium text-gray-900 mb-2">{product.name}</h3>
                  <p className="text-gray-500 text-sm mb-4 h-10 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between mt-6">
                    <div>
                      <span className="text-2xl font-bold text-amber-900">₹{product.price}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-400 line-through ml-2">₹{product.originalPrice}</span>
                      )}
                    </div>
                    <button 
                      onClick={() => handleAddToCart(product)}
                      className={`p-3 rounded-full transition-colors duration-300 ${
                        addedItems[product._id] 
                          ? "bg-green-500 text-white" 
                          : "bg-amber-100 text-amber-800 hover:bg-amber-800 hover:text-white"
                      }`}
                    >
                      {addedItems[product._id] ? <Check className="w-5 h-5" /> : <ShoppingCart className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Offers;
