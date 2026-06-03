import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const getDeliveryDate = (country, method) => {
  const today = new Date();
  const days = method === 'express' ? 3 : country === 'United States' ? 7 : 10;
  const delivery = new Date(today);
  delivery.setDate(today.getDate() + days);
  return delivery.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const FinalCheckout = () => {
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('lastOrder');
    if (stored) {
      setOrder(JSON.parse(stored));
    }
  }, []);

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#faf8f6] px-4">
        <i className="far fa-frown text-6xl text-[#d4f0f0] mb-4"></i>
        <h2 className="text-xl font-semibold mb-2">No order found</h2>
        <p className="text-gray-500 mb-6">It looks like you haven't placed an order yet.</p>
        <Link to="/" className="bg-[#2a6b6b] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#1f4a4a] transition">
          Back to Home
        </Link>
      </div>
    );
  }

  const {
    userName,
    userEmail,
    items,
    shippingAddress,
    shippingMethod,
    country,
    total,
    orderNumber,
  } = order;

  const deliveryDate = getDeliveryDate(country, shippingMethod);

  return (
    <div className="min-h-screen bg-[#faf8f6] flex items-center justify-center px-4 py-12 font-sans text-[#0f2a2f]">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl p-6 sm:p-10 text-center relative overflow-hidden">
        {/* Success icon */}
        <div className="text-6xl mb-4 text-[#2a6b6b]">
          <i className="fas fa-check-circle"></i>
        </div>

        <h1 className="text-3xl sm:text-4xl font-['Playfair_Display'] font-bold mb-2">
          Thank You, {userName}!
        </h1>
        <p className="text-gray-500 mb-2">
          Your order has been placed successfully.
        </p>
        <p className="text-sm text-gray-400 mb-8">
          Order #{orderNumber} · {new Date().toLocaleDateString()}
        </p>

        {/* Email confirmation note */}
        <div className="bg-[#d4f0f0] rounded-2xl p-4 mb-8 text-sm text-left">
          <div className="flex items-start gap-3">
            <i className="fas fa-envelope text-xl text-[#2a6b6b] mt-0.5"></i>
            <div>
              <p className="font-semibold text-[#0f2a2f] mb-1">
                We’ve sent a confirmation to {userEmail}
              </p>
              <p className="text-gray-600 leading-relaxed">
                Your parcel will be carefully packed and shipped. You’ll receive tracking
                details once it leaves our cattery.
              </p>
            </div>
          </div>
        </div>

        {/* Items summary */}
        <div className="text-left mb-6">
          <h3 className="font-bold text-lg mb-3">Items Ordered</h3>
          <div className="space-y-3">
            {items.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  <img
                    src={item.image || 'https://via.placeholder.com/48'}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.name}</p>
                  <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                </div>
                <p className="text-sm font-semibold">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping & Delivery */}
        <div className="bg-gray-50 rounded-2xl p-4 mb-6 text-left grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500 text-xs uppercase tracking-wider">Shipping To</p>
            <p className="font-medium">
              {shippingAddress.city}, {shippingAddress.postcode}
            </p>
            <p className="text-gray-600 text-xs">{shippingAddress.address}</p>
            <p className="text-gray-600 text-xs">{shippingAddress.country}</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs uppercase tracking-wider">Delivery Estimate</p>
            <p className="font-semibold text-[#2a6b6b]">{deliveryDate}</p>
            <p className="text-xs text-gray-500 capitalize">
              {shippingMethod === 'express' ? 'Express (2-3 days)' : 'Standard (5-10 days)'}
            </p>
          </div>
        </div>

        {/* Total */}
        <div className="flex justify-between items-center border-t border-gray-200 pt-4 mb-8">
          <span className="text-lg font-bold">Total Paid</span>
          <span className="text-2xl font-extrabold text-[#2a6b6b]">
            ${total.toFixed(2)}
          </span>
        </div>

        {/* Continue shopping */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-[#2a6b6b] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#1f4a4a] transition"
        >
          <i className="fas fa-paw"></i> Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default FinalCheckout;