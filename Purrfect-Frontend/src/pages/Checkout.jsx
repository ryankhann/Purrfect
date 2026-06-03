import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const TAX_RATES = {
  'United States': 0,
  'United Kingdom': 0.20,
  'Canada': 0.13,
  'Australia': 0.10,
  'Mexico': 0.16,
  'Spain': 0.21,
  'Germany': 0.19,
  'France': 0.20,
};

const SHIPPING_COSTS = {
  'United States': { standard: 0, express: 15 },
  'Canada': { standard: 10, express: 20 },
  'United Kingdom': { standard: 20, express: 30 },
  'Australia': { standard: 25, express: 35 },
  'Mexico': { standard: 15, express: 25 },
  'Spain': { standard: 20, express: 30 },
  'Germany': { standard: 20, express: 30 },
  'France': { standard: 20, express: 30 },
};

const COUNTRIES = [
  { name: 'United States', flag: '🇺🇸', code: 'US' },
  { name: 'Canada', flag: '🇨🇦', code: 'CA' },
  { name: 'United Kingdom', flag: '🇬🇧', code: 'GB' },
  { name: 'Australia', flag: '🇦🇺', code: 'AU' },
  { name: 'Mexico', flag: '🇲🇽', code: 'MX' },
  { name: 'Spain', flag: '🇪🇸', code: 'ES' },
  { name: 'Germany', flag: '🇩🇪', code: 'DE' },
  { name: 'France', flag: '🇫🇷', code: 'FR' },
];

const Checkout = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const countryDropdownRef = useRef(null);


  if (!user) {
    return <Navigate to="/account" replace />;
  }

  const [cart, setCart] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);

  const [country, setCountry] = useState('United States');
  const [postcode, setPostcode] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [apt, setApt] = useState('');
  const [phone, setPhone] = useState('');

  const [shippingMethod, setShippingMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExp, setCardExp] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardErrors, setCardErrors] = useState({});

  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const [toast, setToast] = useState(null);

  // Close country dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(e.target)) {
        setShowCountryDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Load cart
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(storedCart);
    const total = storedCart.reduce((acc, item) => acc + item.price * (item.quantity || 1), 0);
    setSubtotal(total);
  }, []);

  const shippingCost = SHIPPING_COSTS[country]?.[shippingMethod] || 0;
  const taxRate = TAX_RATES[country] || 0;
  const taxAmount = (subtotal + shippingCost) * taxRate;
  const total = subtotal + shippingCost + taxAmount;

  const goToStep = (step) => {
    if (step === 2 && !validateAddress()) return;
    setCurrentStep(step);
  };
  const nextStep = () => goToStep(currentStep + 1);
  const prevStep = () => goToStep(Math.max(1, currentStep - 1));

  const validateAddress = () => {
    const errors = [];
    if (!postcode.trim()) errors.push('Postcode is required');
    if (!city.trim()) errors.push('City is required');
    if (!address.trim()) errors.push('Address is required');
    if (!phone.trim() || phone.length < 7) errors.push('Valid phone number required');
    if (errors.length) {
      setToast({ message: errors[0], type: 'error' });
      return false;
    }
    return true;
  };

  const validatePayment = () => {
    if (paymentMethod === 'card') {
      const errs = {};
      if (!cardNumber.replace(/\s/g, '').match(/^\d{16}$/)) errs.number = 'Invalid card number';
      if (!cardName.trim()) errs.name = 'Name required';
      if (!cardExp.match(/^(0[1-9]|1[0-2])\/\d{2}$/)) errs.exp = 'Invalid expiration (MM/YY)';
      if (!cardCvv.match(/^\d{3,4}$/)) errs.cvv = 'Invalid CVV';
      setCardErrors(errs);
      return Object.keys(errs).length === 0;
    }
    return true;
  };

  const handlePlaceOrder = () => {
    if (!validateAddress()) {
      setCurrentStep(1);
      return;
    }
    if (!validatePayment()) return;

    const orderData = {
      userName: user?.name || 'Valued Customer',
      userEmail: user?.email || '',
      items: cart,
      shippingAddress: { address, city, postcode, country },
      shippingMethod,
      country,
      total,
      orderNumber: 'PURR' + Date.now().toString().slice(-8),
    };

    sessionStorage.setItem('lastOrder', JSON.stringify(orderData));
    localStorage.removeItem('cart');
    window.dispatchEvent(new StorageEvent('storage', { key: 'cart', newValue: null }));

    setToast({ message: 'Order placed successfully! 🎉', type: 'success' });
    setTimeout(() => navigate('/final-checkout'), 800);
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // Guard against empty cart
  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-[#faf8f6] px-4">
        <i className="fas fa-shopping-cart text-6xl text-[#d4f0f0] mb-4"></i>
        <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
        <p className="text-gray-600 mb-6">Add some kittens or accessories to get started!</p>
        <Link to="/" className="inline-flex items-center gap-2 bg-[#2a6b6b] text-white px-6 py-3 rounded-full hover:bg-[#1f4a4a] transition">
          <i className="fas fa-paw"></i> Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f6] py-6 sm:py-10 px-3 sm:px-6 lg:px-8 font-sans text-[#0f2a2f]">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6 flex items-center justify-between">
        <Link to="/cart" className="flex items-center gap-2 text-[#2a6b6b] font-medium hover:text-[#1f4a4a] transition text-sm sm:text-base">
          <i className="fas fa-arrow-left"></i> Back to Cart
        </Link>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-['Playfair_Display'] font-bold">Checkout</h1>
        <div className="w-16 sm:w-20" />
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Left Column – Steps */}
        <div className="lg:col-span-2 space-y-5">
          {user && (
            <div className="bg-white rounded-2xl p-3 sm:p-4 shadow-sm border border-[#e9e7e4] flex items-center gap-3">
              <i className="fas fa-user-check text-2xl text-green-600"></i>
              <div>
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
            </div>
          )}

          {/* Step 1: Shipping Address */}
          <div className="bg-white rounded-2xl shadow-sm border border-[#e9e7e4] p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#0f2a2f] text-white flex items-center justify-center font-bold text-sm">1</span>
              <h2 className="text-lg sm:text-xl font-semibold font-['Playfair_Display']">Shipping Address</h2>
            </div>

            {currentStep >= 1 && (
              <div className="space-y-4">
                <div ref={countryDropdownRef}>
                  <label className="block text-sm font-medium mb-1">Country/Region *</label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                      className="w-full flex items-center justify-between gap-2 px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-[#2a6b6b] text-left text-sm sm:text-base"
                    >
                      <span>{COUNTRIES.find(c => c.name === country)?.flag} {country}</span>
                      <i className={`fas fa-chevron-down text-xs text-gray-400 transition-transform ${showCountryDropdown ? 'rotate-180' : ''}`}></i>
                    </button>

                    {showCountryDropdown && (
                      <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-52 overflow-auto">
                        <div className="p-2 sticky top-0 bg-white">
                          <input type="text" placeholder="Search country..." value={countrySearch}
                            onChange={(e) => setCountrySearch(e.target.value)}
                            className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#2a6b6b]" />
                        </div>
                        {COUNTRIES.filter(c => c.name.toLowerCase().includes(countrySearch.toLowerCase())).map(c => (
                          <button key={c.code} type="button"
                            onClick={() => { setCountry(c.name); setShowCountryDropdown(false); setCountrySearch(''); }}
                            className={`w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-[#d4f0f0] transition text-sm ${c.name === country ? 'bg-[#d4f0f0] font-semibold' : ''}`}>
                            <span>{c.flag}</span> <span>{c.name}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Postcode *</label>
                    <input type="text" value={postcode} onChange={(e) => setPostcode(e.target.value)} placeholder="Postcode" className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#2a6b6b] text-sm sm:text-base" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">City *</label>
                    <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#2a6b6b] text-sm sm:text-base" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Address *</label>
                  <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Street address" className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#2a6b6b] text-sm sm:text-base" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Apt / Floor (optional)</label>
                  <input type="text" value={apt} onChange={(e) => setApt(e.target.value)} placeholder="Apt, suite, etc." className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#2a6b6b] text-sm sm:text-base" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone *</label>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone number" className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#2a6b6b] text-sm sm:text-base" />
                </div>
                <button onClick={() => goToStep(2)} className="w-full bg-[#2a6b6b] text-white py-3 rounded-xl font-semibold hover:bg-[#1f4a4a] transition text-sm sm:text-base">
                  Continue to Shipping Method
                </button>
              </div>
            )}
          </div>

          {/* Step 2: Shipping Method */}
          <div className={`bg-white rounded-2xl shadow-sm border border-[#e9e7e4] p-4 sm:p-6 ${currentStep >= 2 ? '' : 'opacity-50 pointer-events-none'}`}>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#0f2a2f] text-white flex items-center justify-center font-bold text-sm">2</span>
              <h2 className="text-lg sm:text-xl font-semibold font-['Playfair_Display']">Shipping Method</h2>
            </div>
            {currentStep >= 2 && (
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 sm:p-4 border rounded-xl cursor-pointer hover:bg-gray-50 transition" onClick={() => setShippingMethod('standard')}>
                  <input type="radio" name="shipping" checked={shippingMethod === 'standard'} onChange={() => setShippingMethod('standard')} className="w-4 h-4 sm:w-5 sm:h-5 text-[#2a6b6b]" />
                  <div className="flex-1">
                    <p className="font-semibold text-sm sm:text-base">Standard Delivery</p>
                    <p className="text-xs sm:text-sm text-gray-500">5-10 business days</p>
                  </div>
                  <span className="font-bold text-[#2a6b6b] text-sm sm:text-base">{SHIPPING_COSTS[country]?.standard === 0 ? 'Free' : `$${SHIPPING_COSTS[country]?.standard}`}</span>
                </label>
                <label className="flex items-center gap-3 p-3 sm:p-4 border rounded-xl cursor-pointer hover:bg-gray-50 transition" onClick={() => setShippingMethod('express')}>
                  <input type="radio" name="shipping" checked={shippingMethod === 'express'} onChange={() => setShippingMethod('express')} className="w-4 h-4 sm:w-5 sm:h-5 text-[#2a6b6b]" />
                  <div className="flex-1">
                    <p className="font-semibold text-sm sm:text-base">Express Delivery</p>
                    <p className="text-xs sm:text-sm text-gray-500">2-3 business days</p>
                  </div>
                  <span className="font-bold text-[#2a6b6b] text-sm sm:text-base">${SHIPPING_COSTS[country]?.express}</span>
                </label>
                <div className="flex flex-col sm:flex-row justify-between gap-3 mt-4">
                  <button onClick={prevStep} className="w-full sm:w-auto px-5 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition text-sm">Back</button>
                  <button onClick={() => goToStep(3)} className="w-full sm:w-auto px-6 py-2 bg-[#2a6b6b] text-white rounded-xl hover:bg-[#1f4a4a] transition text-sm">Continue to Payment</button>
                </div>
              </div>
            )}
          </div>

          {/* Step 3: Payment */}
          <div className={`bg-white rounded-2xl shadow-sm border border-[#e9e7e4] p-4 sm:p-6 ${currentStep >= 3 ? '' : 'opacity-50 pointer-events-none'}`}>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#0f2a2f] text-white flex items-center justify-center font-bold text-sm">3</span>
              <h2 className="text-lg sm:text-xl font-semibold font-['Playfair_Display']">Payment</h2>
            </div>
            {currentStep >= 3 && (
              <>
                <div className="flex gap-3 mb-5">
                  <button onClick={() => setPaymentMethod('card')} className={`flex-1 p-3 border rounded-xl flex items-center justify-center gap-2 text-sm ${paymentMethod === 'card' ? 'border-[#2a6b6b] bg-[#d4f0f0]' : 'border-gray-200'}`}>
                    <i className="far fa-credit-card text-base"></i> Card
                  </button>
                  <button onClick={() => setPaymentMethod('paypal')} className={`flex-1 p-3 border rounded-xl flex items-center justify-center gap-2 text-sm ${paymentMethod === 'paypal' ? 'border-[#2a6b6b] bg-[#d4f0f0]' : 'border-gray-200'}`}>
                    <i className="fab fa-paypal text-base text-blue-800"></i> PayPal
                  </button>
                </div>

                {paymentMethod === 'card' ? (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium mb-1">Card Number</label>
                      <input type="text" value={cardNumber} onChange={(e) => setCardNumber(e.target.value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim())} placeholder="1234 5678 9012 3456" maxLength="19" className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-xl focus:outline-none text-sm ${cardErrors.number ? 'border-red-400' : 'border-gray-200 focus:border-[#2a6b6b]'}`} />
                      {cardErrors.number && <p className="text-red-500 text-xs mt-1">{cardErrors.number}</p>}
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium mb-1">Name on Card</label>
                      <input type="text" value={cardName} onChange={(e) => setCardName(e.target.value)} placeholder="John Doe" className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-xl focus:outline-none text-sm ${cardErrors.name ? 'border-red-400' : 'border-gray-200 focus:border-[#2a6b6b]'}`} />
                      {cardErrors.name && <p className="text-red-500 text-xs mt-1">{cardErrors.name}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs sm:text-sm font-medium mb-1">Expiry (MM/YY)</label>
                        <input type="text" value={cardExp} onChange={(e) => setCardExp(e.target.value)} placeholder="MM/YY" maxLength="5" className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-xl focus:outline-none text-sm ${cardErrors.exp ? 'border-red-400' : 'border-gray-200 focus:border-[#2a6b6b]'}`} />
                        {cardErrors.exp && <p className="text-red-500 text-xs mt-1">{cardErrors.exp}</p>}
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-medium mb-1">CVV</label>
                        <input type="password" value={cardCvv} onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0,4))} placeholder="123" maxLength="4" className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-xl focus:outline-none text-sm ${cardErrors.cvv ? 'border-red-400' : 'border-gray-200 focus:border-[#2a6b6b]'}`} />
                        {cardErrors.cvv && <p className="text-red-500 text-xs mt-1">{cardErrors.cvv}</p>}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-5">
                    <i className="fab fa-paypal text-4xl sm:text-5xl text-blue-800 mb-2"></i>
                    <p className="text-gray-600 text-sm">You will be redirected to PayPal to complete payment.</p>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row justify-between gap-3 mt-6 pt-4 border-t border-gray-200">
                  <button onClick={prevStep} className="w-full sm:w-auto px-5 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition text-sm">Back</button>
                  <button onClick={handlePlaceOrder} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#0f2a2f] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#1f4a4a] transition text-sm">
                    <i className="fas fa-lock"></i> Place Order · ${total.toFixed(2)}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Column – Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-[#e9e7e4] p-4 sm:p-6 sticky top-24">
            <h2 className="text-xl sm:text-2xl font-['Playfair_Display'] font-bold mb-4">Order Summary</h2>
            <div className="space-y-3 max-h-52 overflow-y-auto">
              {cart.map((item, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    <img src={item.image || 'https://via.placeholder.com/48'} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
            <hr className="my-4" />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Shipping</span><span>{shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Tax ({country})</span><span>${taxAmount.toFixed(2)}</span></div>
              <hr />
              <div className="flex justify-between text-base sm:text-lg font-bold"><span>Total</span><span>${total.toFixed(2)}</span></div>
            </div>
          </div>

          <div className="mt-4 bg-white rounded-2xl shadow-sm border border-[#e9e7e4] p-4 sm:p-5 space-y-3">
            <div className="flex gap-3">
              <i className="fas fa-shield-alt text-xl text-[#2a6b6b]"></i>
              <div><h3 className="font-semibold text-sm">100% Secure Payment</h3><p className="text-xs text-gray-500">SSL encryption</p></div>
            </div>
            <div className="flex gap-3">
              <i className="fas fa-truck text-xl text-[#2a6b6b]"></i>
              <div><h3 className="font-semibold text-sm">Fast Delivery</h3><p className="text-xs text-gray-500">Express options worldwide</p></div>
            </div>
            <div className="flex gap-3">
              <i className="fas fa-headset text-xl text-[#2a6b6b]"></i>
              <div><h3 className="font-semibold text-sm">24/7 Support</h3><p className="text-xs text-gray-500">We're here to help</p></div>
            </div>
          </div>
        </div>
      </div>

      {toast && (
        <div className={`fixed bottom-6 right-6 bg-white rounded-xl px-4 py-3 shadow-lg z-50 flex items-center gap-3 border-l-4 ${toast.type === 'success' ? 'border-l-green-500' : 'border-l-red-500'}`}>
          <i className={`fas ${toast.type === 'success' ? 'fa-check-circle text-green-500' : 'fa-exclamation-circle text-red-500'} text-lg`}></i>
          <span className="font-medium text-sm">{toast.message}</span>
        </div>
      )}
    </div>
  );
};

export default Checkout;