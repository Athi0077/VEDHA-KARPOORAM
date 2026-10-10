import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Plus, Edit2, Trash2, Package, ListOrdered, LogOut, Banknote } from 'lucide-react';

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
      const res = await axios.get('http://localhost:5005/api/products');
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.get('http://localhost:5005/api/orders');
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPrices = async () => {
    try {
      const res = await axios.get('http://localhost:5005/api/prices');
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
      const res = await axios.post('http://localhost:5005/api/upload', data, {
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
        await axios.put(`http://localhost:5005/api/products/${editingId}`, formData);
      } else {
        await axios.post('http://localhost:5005/api/products', formData);
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
        await axios.delete(`http://localhost:5005/api/products/${id}`);
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
        await axios.put(`http://localhost:5005/api/prices/${editingPriceId}`, priceData);
      } else {
        await axios.post('http://localhost:5005/api/prices', priceData);
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
      const res = await axios.post('http://localhost:5005/api/upload', data, {
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
        await axios.delete(`http://localhost:5005/api/prices/${id}`);
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
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-xl font-serif text-gray-900">Recent Orders</h2>
              </div>
              <div className="divide-y divide-gray-100">
                {orders.map(order => (
                  <div key={order._id} className="p-6">
                    <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                      <div>
                        <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full mb-2">{order.status}</span>
                        <h3 className="font-medium text-gray-900">{order.customer?.name}</h3>
                        <p className="text-sm text-gray-500">{order.customer?.email} • {order.customer?.phone}</p>
                        <p className="text-sm text-gray-500 mt-1 max-w-md">{order.customer?.address}, {order.customer?.pincode}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-400 mb-1">{new Date(order.createdAt).toLocaleDateString()}</p>
                        <p className="font-bold text-amber-900 text-xl">₹{order.totalAmount}</p>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4 mt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Order Items:</h4>
                      <ul className="space-y-1">
                        {order.items?.map((item, idx) => (
                          <li key={idx} className="text-sm text-gray-600 flex justify-between">
                            <span>{item.quantity}x {item.name}</span>
                            <span>₹{item.price * item.quantity}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
                {orders.length === 0 && <div className="p-6 text-center text-gray-500">No orders yet.</div>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
