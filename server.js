require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

// Seed sample products (runs once)
const Product = require('./models/Product');
async function seedProducts() {
  const count = await Product.countDocuments();
  if (count === 0) {
    await Product.insertMany([
      {
        name: 'Pain Reliever Capsules',
        category: 'general',
        price: 12.99,
        image: 'https://via.placeholder.com/200x150?text=Pain+Reliever',
        description: 'Effective for headaches and muscle pain.'
      },
      {
        name: 'Prenatal Vitamins',
        category: 'pregnancy',
        price: 19.99,
        image: 'https://via.placeholder.com/200x150?text=Prenatal+Vitamins',
        description: 'Essential nutrients for expecting mothers.'
      },
      {
        name: 'Insulin Pen',
        category: 'diabetes',
        price: 29.99,
        image: 'https://via.placeholder.com/200x150?text=Insulin+Pen',
        description: 'For blood sugar management.'
      },
      {
        name: 'Multivitamin Liquid',
        category: 'supplements',
        price: 24.99,
        image: 'https://via.placeholder.com/200x150?text=Multivitamin',
        description: 'Daily health boost with vitamins and minerals.'
      },
      // Add more products here if needed
    ]);
    console.log('✅ Sample products seeded');
  }
}
seedProducts();

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Frontend Routes
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'public', 'login.html')));
app.get('/dashboard', (req, res) => res.sendFile(path.join(__dirname, 'public', 'dashboard.html')));
app.get('/payment', (req, res) => res.sendFile(path.join(__dirname, 'public', 'payment.html')));

app.listen(process.env.PORT || 5000, () => console.log(`🚀 Server running on port ${process.env.PORT || 5000}`));
