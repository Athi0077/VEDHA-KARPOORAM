import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Plus, Edit2, Trash2, Package, ListOrdered, LogOut, Banknote, Copy, Check } from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [prices, setPrices] = useState([]);
  
  const [formData, setFormData] = useState({ name: '', description: '', price: '', originalPrice: '', image: '' });
  const [editingId, setEditingId] = useState(null);
  
  const [priceData, setPriceData] = useState({ title: '', amount: '', description: '', image: '' });
  const [editingPriceId, setEditingPriceId] = useState(null);
  
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
    } else {
      fetchProducts();
      fetchOrders();
      fetchPrices();
    }
  }, [navigate]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('https://vedha-karpooram.onrender.com/api/products');
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.get('https://vedha-karpooram.onrender.com/api/orders');
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const [copiedCouponId, setCopiedCouponId] = useState(null);

  const getCustomerId = (order) => {
    if (order.customerId) return order.customerId;
    if (!order._id) return '7492015';
    let hash = 0;
    for (let i = 0; i < order._id.length; i++) {
      hash = (hash << 5) - hash + order._id.charCodeAt(i);
      hash |= 0;
    }
    const num = (Math.abs(hash) % 9000000) + 1000000;
    return num.toString();
  };

  const getCouponCode = (order) => {
    if (order.couponCode) return order.couponCode;
    if (!order._id) return 'shrdufg453';
    const letters = 'abcdefghijklmnopqrstuvwxyz';
    let hash = 0;
    for (let i = 0; i < order._id.length; i++) {
      hash = (hash << 5) - hash + order._id.charCodeAt(i);
      hash |= 0;
    }
    let absHash = Math.abs(hash);
    let str = '';
    for (let i = 0; i < 7; i++) {
      const idx = (absHash + i * 7 + (order._id.charCodeAt(i % order._id.length) || 0)) % 26;
      str += letters[idx];
    }
    const digits = ((absHash % 900) + 100).toString();
    return str + digits;
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setOrders(prev =>
        prev.map(o => (o._id === orderId ? { ...o, status: newStatus } : o))
      );
      await axios.put(`https://vedha-karpooram.onrender.com/api/orders/${orderId}`, {
        status: newStatus
      });
    } catch (err) {
      console.error('Failed to update status on server:', err);
      alert('Could not update status on server. Please try again.');
      fetchOrders();
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    try {
      setOrders(prev => prev.filter(o => o._id !== orderId));
      await axios.delete(`https://vedha-karpooram.onrender.com/api/orders/${orderId}`);
    } catch (err) {
      console.error('Failed to delete order on server:', err);
      alert('Could not delete order on server.');
      fetchOrders();
    }
  };

  const copyCoupon = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedCouponId(id);
    setTimeout(() => setCopiedCouponId(null), 2000);
  };

  const fetchPrices = async () => {
    try {
      const res = await axios.get('https://vedha-karpooram.onrender.com/api/prices');
      setPrices(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append('image', file);

    setUploading(true);
    try {
      const res = await axios.post('https://vedha-karpooram.onrender.com/api/upload', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setFormData({ ...formData, image: res.data.imageUrl });
    } catch (err) {
      console.error(err);
      alert('Failed to upload image. Please check Cloudinary keys in .env');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmitProduct = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`https://vedha-karpooram.onrender.com/api/products/${editingId}`, formData);
      } else {
        await axios.post('https://vedha-karpooram.onrender.com/api/products', formData);
      }
      setFormData({ name: '', description: '', price: '', originalPrice: '', image: '' });
      setEditingId(null);
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (prod) => {
    setFormData(prod);
    setEditingId(prod._id);
  };

  const handleDelete = async (id) => {
    if(window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`https://vedha-karpooram.onrender.com/api/products/${id}`);
        fetchProducts();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleSubmitPrice = async (e) => {
    e.preventDefault();
    try {
      if (editingPriceId) {
        await axios.put(`https://vedha-karpooram.onrender.com/api/prices/${editingPriceId}`, priceData);
      } else {
        await axios.post('https://vedha-karpooram.onrender.com/api/prices', priceData);
      }
      setPriceData({ title: '', amount: '', description: '', image: '' });
      setEditingPriceId(null);
      fetchPrices();
    } catch (err) {
      console.error(err);
    }
  };

  const handlePriceImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append('image', file);

    setUploading(true);
    try {
      const res = await axios.post('https://vedha-karpooram.onrender.com/api/upload', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setPriceData({ ...priceData, image: res.data.imageUrl });
    } catch (err) {
      console.error(err);
      alert('Failed to upload image. Please check Cloudinary keys in .env');
    } finally {
      setUploading(false);
    }
  };

  const handleEditPrice = (item) => {
    setPriceData(item);
    setEditingPriceId(item._id);
  };

  const handleDeletePrice = async (id) => {
    if(window.confirm('Are you sure you want to delete this price tier?')) {
      try {
        await axios.delete(`https://vedha-karpooram.onrender.com/api/prices/${id}`);
        fetchPrices();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Admin Header */}
      <div className="bg-amber-950 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-serif tracking-wide">Admin Dashboard</h1>
          <button onClick={handleLogout} className="flex items-center space-x-2 bg-amber-900 hover:bg-amber-800 px-4 py-2 rounded-lg transition-colors">
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="md:col-span-1 space-y-2">
          <button 
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'products' ? 'bg-amber-100 text-amber-900' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100'}`}
          >
            <Package className="w-5 h-5" />
            <span>Products</span>
          </button>
          <button 
            onClick={() => setActiveTab('prices')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'prices' ? 'bg-amber-100 text-amber-900' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100'}`}
          >
            <Banknote className="w-5 h-5" />
            <span>Price List</span>
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'orders' ? 'bg-amber-100 text-amber-900' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100'}`}
          >
            <ListOrdered className="w-5 h-5" />
            <span>Orders</span>
          </button>
        </div>

        {/* Content */}
        <div className="md:col-span-3">
          {activeTab === 'products' && (
            <div className="space-y-8 animate-in fade-in">
              {/* Product Form */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-serif text-gray-900 mb-6">{editingId ? 'Edit Product' : 'Add New Product'}</h2>
                <form onSubmit={handleSubmitProduct} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                      <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-amber-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Product Image (URL or Upload)</label>
                      <input type="text" placeholder="Paste image URL" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="w-full mb-2 px-4 py-2 text-sm rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-amber-500" />
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-amber-100 file:text-amber-700 hover:file:bg-amber-200" />
                      {uploading && <p className="text-xs text-amber-600 mt-1">Uploading image...</p>}
                      {formData.image && !uploading && (
                        <div className="mt-2 h-16 w-16 relative">
                          <img src={formData.image} alt="Preview" className="h-full w-full object-cover rounded-lg border border-gray-200" />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Current Price (₹)</label>
                      <input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-amber-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Original Price (₹)</label>
                      <input type="number" value={formData.originalPrice} onChange={e => setFormData({...formData, originalPrice: e.target.value})} className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-amber-500" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea required rows="2" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-amber-500"></textarea>
                  </div>
                  <div className="flex justify-end space-x-3 pt-2">
                    {editingId && (
                      <button type="button" onClick={() => {setEditingId(null); setFormData({ name: '', description: '', price: '', originalPrice: '', image: '' })}} className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg">Cancel</button>
                    )}
                    <button type="submit" className="bg-amber-800 hover:bg-amber-900 text-white px-6 py-2 rounded-lg font-medium shadow flex items-center">
                      <Plus className="w-4 h-4 mr-2" />
                      {editingId ? 'Update Product' : 'Add Product'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Product List */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h2 className="text-xl font-serif text-gray-900">Manage Products</h2>
                </div>
                <div className="divide-y divide-gray-100">
                  {products.map(product => (
                    <div key={product._id} className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <img src={product.image} alt={product.name} className="w-16 h-16 rounded-lg object-cover bg-gray-100" />
                        <div>
                          <h3 className="font-medium text-gray-900">{product.name}</h3>
                          <p className="text-sm text-gray-500 font-medium">₹{product.price} <span className="line-through text-gray-300 ml-2">₹{product.originalPrice}</span></p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleEdit(product)} className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(product._id)} className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {products.length === 0 && <div className="p-6 text-center text-gray-500">No products found.</div>}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'prices' && (
            <div className="space-y-8 animate-in fade-in">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-serif text-gray-900 mb-6">{editingPriceId ? 'Edit Price' : 'Add New Price'}</h2>
                <form onSubmit={handleSubmitPrice} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title (e.g. 1st Price, Bulk Tier)</label>
                      <input required type="text" value={priceData.title} onChange={e => setPriceData({...priceData, title: e.target.value})} className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-amber-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Price Amount</label>
                      <input required type="text" value={priceData.amount} onChange={e => setPriceData({...priceData, amount: e.target.value})} className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-amber-500" placeholder="e.g. ₹100 or 10% off" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                    <textarea rows="2" value={priceData.description} onChange={e => setPriceData({...priceData, description: e.target.value})} className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-amber-500"></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price Image (URL or Upload)</label>
                    <input type="text" placeholder="Paste image URL" value={priceData.image || ''} onChange={e => setPriceData({...priceData, image: e.target.value})} className="w-full mb-2 px-4 py-2 text-sm rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-amber-500" />
                    <input type="file" accept="image/*" onChange={handlePriceImageUpload} className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-amber-100 file:text-amber-700 hover:file:bg-amber-200" />
                    {uploading && <p className="text-xs text-amber-600 mt-1">Uploading image...</p>}
                    {priceData.image && !uploading && (
                      <div className="mt-2 h-16 w-16 relative">
                        <img src={priceData.image} alt="Preview" className="h-full w-full object-cover rounded-lg border border-gray-200" />
                      </div>
                    )}
                  </div>
                  <div className="flex justify-end space-x-3 pt-2">
                    {editingPriceId && (
                      <button type="button" onClick={() => {setEditingPriceId(null); setPriceData({ title: '', amount: '', description: '', image: '' })}} className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg">Cancel</button>
                    )}
                    <button type="submit" className="bg-amber-800 hover:bg-amber-900 text-white px-6 py-2 rounded-lg font-medium shadow flex items-center">
                      <Plus className="w-4 h-4 mr-2" />
                      {editingPriceId ? 'Update Price' : 'Add Price'}
                    </button>
                  </div>
                </form>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h2 className="text-xl font-serif text-gray-900">Manage Prices</h2>
                </div>
                <div className="divide-y divide-gray-100">
                  {prices.map(item => (
                    <div key={item._id} className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        {item.image && (
                          <img src={item.image} alt={item.title} className="w-16 h-16 rounded-lg object-cover bg-gray-100" />
                        )}
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-gray-900">{item.title}</h3>
                            <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-0.5 rounded">{item.amount}</span>
                          </div>
                          {item.description && <p className="text-sm text-gray-500 mt-1">{item.description}</p>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleEditPrice(item)} className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDeletePrice(item._id)} className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {prices.length === 0 && <div className="p-6 text-center text-gray-500">No prices found.</div>}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in">
              <div className="px-6 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-serif text-gray-900">Recent Orders</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Manage customer orders and update delivery status</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-amber-50 text-amber-900 border border-amber-200 font-semibold px-3 py-1 rounded-full">
                    Total: {orders.length} Orders
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-amber-900/5 text-amber-950 border-b border-gray-200 text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
                      <th className="py-3.5 px-3 text-center">S.No</th>
                      <th className="py-3.5 px-3">Customer ID</th>
                      <th className="py-3.5 px-3">Name</th>
                      <th className="py-3.5 px-3">Email</th>
                      <th className="py-3.5 px-3">Number</th>
                      <th className="py-3.5 px-3 min-w-[200px]">Address</th>
                      <th className="py-3.5 px-3 min-w-[150px]">Order Item</th>
                      <th className="py-3.5 px-3 text-center">Quantity</th>
                      <th className="py-3.5 px-3 font-bold text-amber-950">Amount</th>
                      <th className="py-3.5 px-3 min-w-[130px]">Order Status</th>
                      <th className="py-3.5 px-3 min-w-[140px]">Coupon Code</th>
                      <th className="py-3.5 px-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {orders.map((order, index) => {
                      const customerId = getCustomerId(order);
                      const coupon = getCouponCode(order);
                      const totalQty = order.items?.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0) || 0;

                      return (
                        <tr key={order._id || index} className="hover:bg-amber-50/20 transition-colors">
                          <td className="py-3.5 px-3 text-center font-medium text-gray-500">
                            {index + 1}
                          </td>
                          <td className="py-3.5 px-3 whitespace-nowrap">
                            <span className="font-mono text-xs font-bold text-amber-900 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200 shadow-xs">
                              {customerId}
                            </span>
                          </td>
                          <td className="py-3.5 px-3 font-semibold text-gray-900 whitespace-nowrap">
                            {order.customer?.name || 'N/A'}
                          </td>
                          <td className="py-3.5 px-3 text-gray-600 whitespace-nowrap">
                            {order.customer?.email || 'N/A'}
                          </td>
                          <td className="py-3.5 px-3 font-mono text-gray-700 whitespace-nowrap">
                            {order.customer?.phone || 'N/A'}
                          </td>
                          <td className="py-3.5 px-3 text-xs text-gray-600 min-w-[200px] max-w-[260px]">
                            <p className="truncate font-medium text-gray-800" title={order.customer?.address}>
                              {order.customer?.address || 'N/A'}
                            </p>
                            <p className="text-gray-400 text-[11px] truncate">
                              {order.customer?.landmark ? order.customer.landmark + ', ' : ''}
                              {order.customer?.pincode ? `PIN: ${order.customer.pincode}` : ''}
                            </p>
                          </td>
                          <td className="py-3.5 px-3 text-xs text-gray-800 min-w-[150px]">
                            <div className="space-y-0.5">
                              {order.items && order.items.length > 0 ? (
                                order.items.map((item, i) => (
                                  <div key={i} className="truncate max-w-[180px]" title={item.name}>
                                    • {item.name}
                                  </div>
                                ))
                              ) : (
                                <span className="text-gray-400">No items</span>
                              )}
                            </div>
                          </td>
                          <td className="py-3.5 px-3 text-center whitespace-nowrap">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
                              {totalQty}
                            </span>
                          </td>
                          <td className="py-3.5 px-3 font-bold text-amber-950 whitespace-nowrap">
                            ₹{order.totalAmount}
                          </td>
                          <td className="py-3.5 px-3 whitespace-nowrap">
                            <select
                              value={['Pending', 'Packing', 'Shipping', 'Delivered'].includes(order.status) ? order.status : 'Pending'}
                              onChange={(e) => handleStatusChange(order._id, e.target.value)}
                              className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border outline-none cursor-pointer transition-colors shadow-xs ${
                                order.status === 'Delivered'
                                  ? 'bg-green-50 text-green-700 border-green-300'
                                  : order.status === 'Shipping'
                                  ? 'bg-blue-50 text-blue-700 border-blue-300'
                                  : order.status === 'Packing'
                                  ? 'bg-purple-50 text-purple-700 border-purple-300'
                                  : 'bg-amber-50 text-amber-700 border-amber-300'
                              }`}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Packing">Packing</option>
                              <option value="Shipping">Shipping</option>
                              <option value="Delivered">Delivered</option>
                            </select>
                          </td>
                          <td className="py-3.5 px-3 whitespace-nowrap">
                            <div className="flex items-center space-x-1.5">
                              <code className="px-2 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded text-xs font-mono font-bold tracking-wide">
                                {coupon}
                              </code>
                              <button
                                onClick={() => copyCoupon(coupon, order._id)}
                                title="Copy Coupon Code"
                                className="p-1 text-gray-400 hover:text-amber-800 hover:bg-amber-100/60 rounded transition-colors"
                              >
                                {copiedCouponId === order._id ? (
                                  <Check className="w-3.5 h-3.5 text-green-600" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                          </td>
                          <td className="py-3.5 px-3 text-center whitespace-nowrap">
                            <button
                              onClick={() => handleDeleteOrder(order._id)}
                              title="Delete Order"
                              className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                    {orders.length === 0 && (
                      <tr>
                        <td colSpan="12" className="py-8 text-center text-gray-500">
                          No orders yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
