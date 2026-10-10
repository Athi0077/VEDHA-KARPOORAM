import { useState, useEffect } from 'react';
import axios from 'axios';
import { Banknote, ShieldCheck, Sparkles } from 'lucide-react';

const PriceList = () => {
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await axios.get('https://vedha-karpooram.onrender.com/api/prices');
        setPrices(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPrices();
  }, []);

  return (
    <div className="py-16 animate-in fade-in duration-500 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium mb-6">
            <Banknote className="w-4 h-4" />
            <span>Pricing Details</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-amber-950 mb-4">Our Price List</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our competitive pricing tiers for different quantities and special requirements. High quality camphor at transparent prices.
          </p>
        </div>

        {loading ? (
          <div className="text-center text-gray-500">Loading prices...</div>
        ) : prices.length === 0 ? (
          <div className="text-center bg-white p-10 rounded-2xl shadow-sm border border-gray-100 text-gray-500">
            No prices have been listed yet. Please check back later!
          </div>
        ) : (
          <div className="space-y-6">
            {prices.map((price, index) => (
              <div 
                key={price._id} 
                className="bg-white p-6 md:p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-2 h-full bg-amber-500"></div>
                
                <div className="flex flex-col md:flex-row gap-6 w-full items-start md:items-center">
                  {price.image && (
                    <div className="flex-shrink-0">
                      <img src={price.image} alt={price.title} className="w-full md:w-32 h-40 md:h-32 object-cover rounded-xl border border-gray-100 shadow-sm" />
                    </div>
                  )}
                  <div className="flex-grow">
                    <h3 className="text-2xl font-serif text-amber-900 mb-2">{price.title}</h3>
                    {price.description && (
                      <p className="text-gray-600">{price.description}</p>
                    )}
                    <div className="flex items-center space-x-4 mt-4 text-sm text-gray-500">
                    </div>
                  </div>
                </div>

                <div className="flex-shrink-0 bg-amber-50 px-6 py-4 rounded-xl text-center min-w-[150px] border border-amber-100 self-start md:self-center">
                  <span className="block text-sm text-amber-700 font-medium mb-1">Price Amount</span>
                  <span className="text-2xl font-bold text-gray-900">{price.amount}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PriceList;
