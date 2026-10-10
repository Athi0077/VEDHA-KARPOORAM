const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5005;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/karupram')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Models
const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  image: { type: String, required: true }
});
const Product = mongoose.model('Product', ProductSchema);

const OrderSchema = new mongoose.Schema({
  customer: {
    name: String,
    email: String,
    phone: String,
    address: String,
    landmark: String,
    pincode: String
  },
  items: Array,
  totalAmount: Number,
  status: { type: String, default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});
const Order = mongoose.model('Order', OrderSchema);

const PriceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  amount: { type: String, required: true },
  description: { type: String },
  image: { type: String }
});
const PriceList = mongoose.model('PriceList', PriceSchema);

// Admin Login Route
app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body;
  if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
    res.json({ success: true, token: 'fake-jwt-token-123' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// Cloudinary & Multer Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'karupram_products',
    allowedFormats: ['jpg', 'png', 'jpeg', 'webp']
  }
});
const upload = multer({ storage: storage });

// Image Upload Route
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image uploaded' });
  }
  res.json({ imageUrl: req.file.path });
});

// Products Routes
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Orders Routes
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Price List Routes
app.get('/api/prices', async (req, res) => {
  try {
    const prices = await PriceList.find();
    res.json(prices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/prices', async (req, res) => {
  try {
    const newPrice = new PriceList(req.body);
    await newPrice.save();
    res.status(201).json(newPrice);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/prices/:id', async (req, res) => {
  try {
    const updatedPrice = await PriceList.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedPrice);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/prices/:id', async (req, res) => {
  try {
    await PriceList.findByIdAndDelete(req.params.id);
    res.json({ message: 'Price deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Seed Initial Products if empty
const seedProducts = async () => {
  const count = await Product.countDocuments();
  if (count === 0) {
    await Product.insertMany([
      {
        name: "Vedha Premium Camphor Tablets",
        description: "100g pack of pure, round camphor tablets. Ideal for daily pooja.",
        price: 120,
        originalPrice: 150,
        image: "https://images.unsplash.com/photo-1620062839958-86d5e06263cb?q=80&w=400&auto=format&fit=crop"
      },
      {
        name: "Vedha Jumbo Camphor",
        description: "250g pack of large camphor blocks for special occasions and homams.",
        price: 280,
        originalPrice: 350,
        image: "https://images.unsplash.com/photo-1601006596160-59a61350a8a6?q=80&w=400&auto=format&fit=crop"
      },
      {
        name: "Vedha Bhimseni Camphor",
        description: "50g premium irregular crystals of Bhimseni Kapoor for aromatic diffusion.",
        price: 180,
        originalPrice: 220,
        image: "https://images.unsplash.com/photo-1596433809252-260c27459d1a?q=80&w=400&auto=format&fit=crop"
      }
    ]);
    console.log("Seeded initial products");
  }
};
mongoose.connection.once('open', seedProducts);

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
