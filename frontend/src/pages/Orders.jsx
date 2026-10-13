import { useState, useEffect } from 'react';
import { PackageX, ShoppingBag, Truck, CreditCard, Calendar, Clock, MapPin, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('vedha_orders') || '[]');
      setOrders(Array.isArray(saved) ? saved : []);
    } catch (err) {
      console.error('Failed to parse orders from localStorage', err);
      setOrders([]);
    }
  }, []);

  if (orders.length === 0) {
    return (
      <div className="py-20 animate-in fade-in duration-500 bg-gray-50 min-h-[60vh] flex items-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full">
          <div className="bg-white p-12 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center">
            <div className="w-24 h-24 bg-amber-50 rounded-full flex items-center justify-center mb-6">
              <PackageX className="w-10 h-10 text-amber-600" />
            </div>
            <h2 className="text-3xl font-serif text-gray-900 mb-4">No Orders Yet</h2>
            <p
              className="text-gray-500 mb-8 max-w-md mx-auto cursor-pointer hover:text-amber-700 transition-colors"
              onClick={() => navigate('/offers')}
            >
              You haven't placed any orders with us yet. Explore our collection of pure camphor products and add a spark to your rituals.
            </p>
            <Link
              to="/offers"
              className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white bg-amber-800 hover:bg-amber-900 rounded-xl shadow transition-colors duration-300"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-gray-50 min-h-screen animate-in fade-in">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-8 mb-6 border-b border-gray-200">
          <div>
            <h1 className="text-3xl font-serif text-amber-950">My Orders</h1>
            <p className="text-gray-500 text-sm mt-1">
              You have placed <span className="font-semibold text-amber-900">{orders.length}</span> order{orders.length > 1 ? 's' : ''}
            </p>
          </div>
          <Link
            to="/offers"
            className="mt-4 sm:mt-0 inline-flex items-center text-sm font-medium text-amber-800 hover:text-amber-950 transition-colors"
          >
            <ShoppingBag className="w-4 h-4 mr-1.5" />
            Continue Shopping
          </Link>
        </div>

        <div className="space-y-6">
          {orders.map((order, index) => {
            const isCOD = order.paymentMethod === 'Cash on Delivery';
            const orderDate = order.createdAt ? new Date(order.createdAt) : new Date();

            return (
              <div
                key={order._id || index}
                className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Header bar of order */}
                <div className="p-5 sm:p-6 bg-gradient-to-r from-gray-50 to-amber-50/20 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Order ID</span>
                      <span className="text-sm font-mono font-medium text-gray-800">{order._id}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-xs text-gray-500 mt-1">
                      <span className="flex items-center">
                        <Calendar className="w-3.5 h-3.5 mr-1 text-gray-400" />
                        {orderDate.toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-3.5 h-3.5 mr-1 text-gray-400" />
                        {orderDate.toLocaleTimeString('en-IN', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {/* Payment Mode Badge */}
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                        isCOD
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {isCOD ? <Truck className="w-3.5 h-3.5 mr-1" /> : <CreditCard className="w-3.5 h-3.5 mr-1" />}
                      {order.paymentMethod || (isCOD ? 'Cash on Delivery' : 'Online')}
                    </span>

                    {/* Status Badge */}
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                        order.status === 'Paid'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                      {order.status || 'Confirmed'}
                    </span>
                  </div>
                </div>

                {/* Items List */}
                <div className="p-5 sm:p-6 divide-y divide-gray-100">
                  {order.items && order.items.length > 0 ? (
                    order.items.map((item, itemIdx) => (
                      <div key={itemIdx} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                        <div className="flex items-center space-x-4">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-14 h-14 object-cover rounded-xl bg-gray-50 border border-gray-100"
                            />
                          ) : (
                            <div className="w-14 h-14 rounded-xl bg-amber-50 flex items-center justify-center text-amber-800 font-bold">
                              ₹
                            </div>
                          )}
                          <div>
                            <h4 className="font-medium text-gray-900 text-sm">{item.name}</h4>
                            <p className="text-xs text-gray-500 mt-0.5">
                              Qty: <span className="font-semibold text-gray-700">{item.quantity}</span> × ₹{item.price}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900 text-sm">₹{item.price * item.quantity}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">Order items details not available</p>
                  )}
                </div>

                {/* Footer details: Address & Total */}
                <div className="p-5 sm:p-6 bg-gray-50/70 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {order.customer && (
                    <div className="text-xs text-gray-600 max-w-md">
                      <p className="font-semibold text-gray-800 mb-0.5 flex items-center">
                        <MapPin className="w-3.5 h-3.5 mr-1 text-amber-800" />
                        Delivering to: {order.customer.name} ({order.customer.phone})
                      </p>
                      <p className="text-gray-500 truncate pl-4.5">
                        {order.customer.address}, {order.customer.landmark ? order.customer.landmark + ', ' : ''}
                        {order.customer.pincode}
                      </p>
                    </div>
                  )}

                  <div className="text-right flex items-center sm:flex-col sm:items-end justify-between border-t sm:border-t-0 pt-3 sm:pt-0">
                    <span className="text-xs text-gray-500 uppercase tracking-wider">Total Paid / Due</span>
                    <span className="text-2xl font-bold text-amber-950">₹{order.totalAmount}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Orders;
