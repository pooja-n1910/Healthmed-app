const express = require('express');
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const router = express.Router();

// Get products (with optional category/search)
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};
    if (category) query.category = category;
    if (search) query.name = { $regex: search, $options: 'i' };

    const products = await Product.find(query);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Server error.' });
  }
});

// Add to wishlist
router.post('/:id/wishlist', auth, async (req, res) => {
  try {
    const user = req.user;
    if (!user.wishlist.includes(req.params.id)) {
      user.wishlist.push(req.params.id);
      await user.save();
    }
    res.json({ message: 'Added to wishlist!' });
  } catch (error) {
    res.status(500).json({ error: 'Server error.' });
  }
});

// Add to cart
router.post('/:id/cart', auth, async (req, res) => {
  try {
    const { quantity = 1 } = req.body;
    const user = req.user;
    const productId = req.params.id;
    const itemIndex = user.cart.findIndex(item => item.product.toString() === productId);

    if (itemIndex > -1) {
      user.cart[itemIndex].quantity += parseInt(quantity);
    } else {
      user.cart.push({ product: productId, quantity: parseInt(quantity) });
    }
    await user.save();
    res.json({ message: 'Added to cart!' });
  } catch (error) {
    res.status(500).json({ error: 'Server error.' });
  }
});

// Get user's cart (for dashboard)
router.get('/cart', auth, async (req, res) => {
  try {
    const user = req.user;
    res.json(user.cart);
  } catch (error) {
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;