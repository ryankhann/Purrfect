import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // adjust path

const Cart = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [notification, setNotification] = useState(null);

  // Load cart from localStorage
  useEffect(() => {
    const loadCart = () => {
      const data = JSON.parse(localStorage.getItem('cart')) || [];
      setCartItems(data);
    };
    loadCart();
    window.addEventListener('storage', loadCart);
    return () => window.removeEventListener('storage', loadCart);
  }, []);

  // Notification auto-dismiss
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 2500);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Update localStorage and notify navbar
  const updateCart = (newCart) => {
    setCartItems(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    const totalItems = newCart.reduce((sum, item) => sum + item.quantity, 0);
    window.dispatchEvent(new StorageEvent('storage', { key: 'cart', newValue: JSON.stringify(newCart) }));
    window.dispatchEvent(new StorageEvent('storage', { key: 'cartCount', newValue: totalItems.toString() }));
  };

  const handleQuantityChange = (id, delta) => {
    const newCart = cartItems
      .map((item) => {
        if (item.id === id) {
          const newQty = item.quantity + delta;
          return newQty < 1 ? null : { ...item, quantity: newQty };
        }
        return item;
      })
      .filter(Boolean);
    updateCart(newCart);
  };

  const handleRemove = (id) => {
    const newCart = cartItems.filter((item) => item.id !== id);
    updateCart(newCart);
    setNotification('Item removed from cart.');
  };

  const handleCouponApply = () => {
    if (coupon.trim().toUpperCase() === 'PURRFECT10') {
      setDiscount(10);
      setNotification('Coupon applied! 10% off your order.');
    } else if (coupon.trim() === '') {
      setDiscount(0);
      setNotification('Please enter a coupon code.');
    } else {
      setDiscount(0);
      setNotification('Invalid coupon code.');
    }
  };

  const handleProceedToCheckout = () => {
    if (!user) {
      setNotification('Please log in or create an account to checkout.');
      navigate('/account');
    } else {
      navigate('/checkout');
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = (subtotal * discount) / 100;
  const total = subtotal - discountAmount;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[#faf8f6] px-4">
        <div className="text-center max-w-md">
          <div className="text-8xl mb-6 text-[#d4f0f0]">
            <i className="fas fa-shopping-cart"></i>
          </div>
          <h2 className="font-serif text-3xl font-bold text-[#0f2a2f] mb-4">Your cart is empty</h2>
          <p className="text-gray-500 mb-8">Looks like you haven't added any kittens, food, or accessories yet.</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-[#2a6b6b] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#1f4a4a] transition-all"
          >
            <i className="fas fa-paw"></i> Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f6]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0f2a2f] to-[#2a6b6b] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-3xl md:text-4xl font-bold">Shopping Cart</h1>
          <p className="mt-2 opacity-80">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart</p>
          <Link to="/" className="inline-flex items-center gap-2 text-yellow-300 mt-4 hover:text-white transition">
            <i className="fas fa-arrow-left"></i> Continue Shopping
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-3 sm:p-4 shadow-sm border border-[#e9e7e4] flex items-start gap-4"
              >
                <div className="w-24 sm:w-28 flex-shrink-0 rounded-xl overflow-hidden bg-[#f0f0f0] aspect-[4/3]">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/300x225?text=Meow';
                      }}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-3xl text-[#2a6b6b]">
                      <i className="fas fa-cat"></i>
                    </div>
                  )}
                </div>
                <div className="flex-1 flex flex-col justify-between h-full min-w-0">
                  <div>
                    <h3 className="font-semibold text-base sm:text-lg text-[#0f2a2f] truncate">{item.name}</h3>
                    <p className="text-xs text-gray-500 capitalize">{item.category || 'Product'}</p>
                    {item.type && <p className="text-xs text-gray-400 mt-0.5">{item.type}</p>}
                  </div>
                  <div className="mt-3">
                    <div className="font-bold text-lg text-[#2a6b6b]">${(item.price * item.quantity).toFixed(2)}</div>
                    {item.quantity > 1 && <p className="text-xs text-gray-400">${item.price.toFixed(2)} each</p>}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => handleQuantityChange(item.id, -1)}
                        className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-[#d4f0f0] hover:border-[#2a6b6b] transition"
                      >
                        <i className="fas fa-minus text-xs"></i>
                      </button>
                      <span className="font-semibold text-sm w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.id, 1)}
                        className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-[#d4f0f0] hover:border-[#2a6b6b] transition"
                      >
                        <i className="fas fa-plus text-xs"></i>
                      </button>
                    </div>
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="mt-2 text-xs text-red-400 hover:text-red-600 flex items-center gap-1"
                    >
                      <i className="fas fa-trash-alt"></i> Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e9e7e4] sticky top-24">
              <h2 className="font-serif text-2xl font-bold mb-6 text-[#0f2a2f]">Order Summary</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({discount}%)</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="italic text-xs text-gray-400">Calculated at checkout</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span className="italic text-xs text-gray-400">Estimated at checkout</span>
                </div>
                <hr className="border-[#e9e7e4] my-3" />
                <div className="flex justify-between text-lg font-bold text-[#0f2a2f]">
                  <span>Estimated Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <p className="text-xs text-gray-400 italic mt-1">Shipping & taxes calculated at next step.</p>
              </div>
              <div className="mt-6">
                <label className="text-sm font-semibold text-[#0f2a2f] mb-2 block">Coupon Code</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    placeholder="PURRFECT10"
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2a6b6b]"
                  />
                  <button
                    onClick={handleCouponApply}
                    className="px-4 py-2 bg-[#2a6b6b] text-white rounded-xl font-semibold text-sm hover:bg-[#1f4a4a] transition"
                  >
                    Apply
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-2">Try <strong>PURRFECT10</strong> for 10% off.</p>
              </div>
              <button
                onClick={handleProceedToCheckout}
                className="w-full mt-6 bg-[#0f2a2f] text-white py-3 rounded-xl font-semibold hover:bg-[#1f4a4a] transition flex items-center justify-center gap-2"
              >
                <i className="fas fa-lock"></i> Proceed to Checkout
              </button>
              <div className="mt-4 text-center">
                <Link to="/" className="text-[#2a6b6b] text-sm font-medium hover:underline">
                  <i className="fas fa-arrow-left mr-1"></i> Continue Shopping
                </Link>
              </div>
              <div className="flex justify-center gap-3 mt-6 text-gray-400 text-xl">
                <i className="fab fa-cc-visa"></i>
                <i className="fab fa-cc-mastercard"></i>
                <i className="fab fa-cc-amex"></i>
                <i className="fab fa-cc-paypal"></i>
              </div>
              <p className="text-xs text-center text-gray-400 mt-2">Secure SSL Checkout • Satisfaction Guaranteed</p>
            </div>
          </div>
        </div>
      </div>

      {notification && (
        <div className="fixed bottom-6 right-6 bg-white border-l-4 border-[#2a6b6b] rounded-xl shadow-2xl p-4 flex items-center gap-3 z-50 animate-slide-in">
          <i className="fas fa-check-circle text-[#2a6b6b] text-xl"></i>
          <span className="font-medium text-sm">{notification}</span>
        </div>
      )}
    </div>
  );
};

export default Cart;