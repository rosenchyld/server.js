const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.post('/create-checkout', async (req, res) => {
  try {
    const { total, description } = req.body;
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'The Memory Lab — Custom Order',
            description: description || 'Custom AI scene'
          },
          unit_amount: total * 100,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: 'https://thememorylab.art?success=true',
      cancel_url: 'https://thememorylab.art?cancelled=true',
    });
    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(process.env.PORT || 3000);
