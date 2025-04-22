import express from 'express';
import Razorpay from 'razorpay';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

router.post('/create-order', async (req, res) => {
  const { amount, currency } = req.body;

  const options = {
    amount: amount * 100,  // convert to paise
    currency,
    receipt: 'receipt_order_' + Math.random()
  };

  try {
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating order');
  }
});

router.get("/getKey", async (req, res) => {
  res.status(200).json({
    key: process.env.RAZORPAY_KEY_ID
  })
})

export default router;
