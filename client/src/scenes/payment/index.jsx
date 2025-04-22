import React from 'react';
import axios from 'axios';

const PaymentPage = () => {
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      alert('Failed to load Razorpay SDK.');
      return;
    }

    try {
      const { data: order } = await axios.post('http://localhost:5000/api/payment/create-order', {
        amount: 500,
        currency: 'INR',
      });

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'NexaBiz',
        description: 'Premium Subscription',
        order_id: order.id,
        handler: function (response) {
          alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
        },
        prefill: {
          name: 'John Doe',
          email: 'john@example.com',
        },
        theme: {
          color: '#facc15', // yellow
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Payment error:', error);
      alert('Something went wrong. Try again later.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-900 text-white flex items-center justify-center">
      <div className="bg-gray-800 p-10 rounded-3xl shadow-2xl w-full max-w-2xl text-center">
        <h1 className="text-5xl font-extrabold text-yellow-400 mb-6">NexaBiz Premium</h1>
        <p className="text-xl text-gray-300 mb-6">Empower your business with AI-driven features:</p>

        <ul className="text-lg text-left text-white list-disc list-inside space-y-3 mb-10 max-w-md mx-auto">
          <li>⚡ AI-powered analytics dashboard</li>
          <li>📊 Real-time sales & inventory tracking</li>
          <li>🤖 Smart AI chatbot for support</li>
          <li>💳 Integrated secure payment system</li>
          <li>📈 Predictive insights using machine learning</li>
          <li>📱 Fully responsive across all devices</li>
        </ul>

        <button
          onClick={handlePayment}
          className="bg-yellow-400 hover:bg-yellow-300 text-black text-2xl font-bold px-10 py-5 rounded-full transition duration-300 shadow-lg"
        >
          Pay ₹500 & Unlock Premium
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;
