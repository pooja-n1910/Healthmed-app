const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const auth = require('../middleware/auth');
const User = require('../models/User');
const router = express.Router();

// Checkout - Create payment intent
router.post('/checkout', auth, async (req, res) => {
  try {
    const user = req.user;
    const total = user.cart.reduce((sum, item) => sum + (item.quantity * item.product.price), 0);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100), // Cents
      currency: 'usd',
      metadata: { userId: user._id.toString() }
    });

    // Clear cart on success (in prod, use webhook for confirmation)
    user.cart = [];
    await user.save();

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: 'Payment failed.' });
  }
});

module.exports = router;