import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [toast, setToast] = useState(null);

  // Load wishlist from localStorage and listen for changes
  useEffect(() => {
    const load = () => {
      const data = JSON.parse(localStorage.getItem('wishlist')) || [];
      setWishlist(data);
    };
    load();
    window.addEventListener('storage', load);
    return () => window.removeEventListener('storage', load);
  }, []);

  // Helper to update wishlist and localStorage
  const updateWishlist = (newWishlist) => {
    setWishlist(newWishlist);
    localStorage.setItem('wishlist', JSON.stringify(newWishlist));
    // Dispatch storage event so navbar updates instantly
    window.dispatchEvent(new StorageEvent('storage', { key: 'wishlist', newValue: JSON.stringify(newWishlist) }));
  };

  const moveToCart = (index) => {
    const item = wishlist[index];
    // Add to cart
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existing = cart.find(c => c.id === item.id || c.name === item.name);
    if (existing) {
      existing.quantity = (existing.quantity || 1) + 1;
    } else {
      cart.push({ ...item, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    // Remove from wishlist
    const newWishlist = [...wishlist];
    newWishlist.splice(index, 1);
    updateWishlist(newWishlist);
    setToast({ message: `"${item.name}" added to cart!`, type: 'success' });
    // Update cart count in navbar (via storage)
    window.dispatchEvent(new StorageEvent('storage', { key: 'cart', newValue: JSON.stringify(cart) }));
  };

  const removeFromWishlist = (index) => {
    const newWishlist = [...wishlist];
    const removed = newWishlist.splice(index, 1);
    updateWishlist(newWishlist);
    setToast({ message: `"${removed[0].name}" removed from wishlist.`, type: 'info' });
  };

  const formatPrice = (price) => {
    const num = parseFloat(price);
    return isNaN(num) ? '0.00' : num.toFixed(2);
  };

  // Clear toast after 3 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#faf8f6] to-[#f3efe9] font-sans text-[#0f2a2f] relative">

      <div className="max-w-4xl mx-auto pt-24 pb-16 px-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-10 flex-wrap">
          <h1 className="text-3xl md:text-4xl font-medium tracking-tight text-[#0f2a2f] flex items-center gap-3">
            <i className="fas fa-heart text-[#d4847a]"></i> My Wishlist
            <span className="bg-[#d4847a] text-white text-sm font-semibold px-4 py-1.5 rounded-full ml-2">
              {wishlist.length}
            </span>
          </h1>
        </div>

        {/* Empty state */}
        {wishlist.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-[0_12px_28px_-10px_rgba(0,40,40,0.12)] p-12 text-center">
            <i className="fas fa-heart-broken text-6xl text-[#e9e7e4] mb-4 block"></i>
            <h2 className="text-2xl font-medium mb-2">Your wishlist is empty</h2>
            <p className="text-[#5f6e73] mb-6">Save your favorite kittens, food, and accessories here.</p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-[#2a6b6b] font-semibold border-2 border-[#2a6b6b] px-6 py-2.5 rounded-full hover:bg-[#d4f0f0] transition-all"
            >
              <i className="fas fa-paw"></i> Explore Purrfect Shop
            </Link>
          </div>
        ) : (
          /* Items grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {wishlist.map((item, index) => (
              <div
                key={item.id || item.name + index}
                className="bg-white rounded-2xl p-5 shadow-[0_12px_28px_-10px_rgba(0,40,40,0.12)] border border-[#e9e7e4] hover:-translate-y-1.5 hover:shadow-[0_20px_35px_-12px_rgba(0,60,60,0.2)] hover:border-[#d4f0f0] transition-all flex flex-col"
              >
                {/* Product Image */}
                <div className="relative w-full h-48 rounded-xl overflow-hidden bg-[#f0f0f0] mb-4">
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
                    <div className="flex items-center justify-center h-full text-4xl text-[#2a6b6b]">
                      <i className="fas fa-cat"></i>
                    </div>
                  )}
                </div>

                {/* Details */}
                <h3 className="text-lg font-semibold text-[#0f2a2f] truncate">{item.name}</h3>
                <span className="text-xs text-[#5f6e73] uppercase tracking-wider mt-1">
                  {item.category || 'item'}
                </span>
                <div className="text-xl font-bold text-[#2a6b6b] mt-3 mb-5">
                  ${formatPrice(item.price)}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-auto">
                  <button
                    onClick={() => moveToCart(index)}
                    className="flex-1 py-2.5 px-4 bg-[#2a6b6b] text-white font-semibold text-sm rounded-xl border-2 border-[#2a6b6b] hover:bg-[#1b5353] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                  >
                    <i className="fas fa-cart-plus"></i> Add to Cart
                  </button>
                  <button
                    onClick={() => removeFromWishlist(index)}
                    className="flex-1 py-2.5 px-4 bg-white text-[#d4847a] font-semibold text-sm rounded-xl border-2 border-[#d4847a] hover:bg-[#fff5f5] hover:border-[#b3534a] hover:text-[#b3534a] transition-all flex items-center justify-center gap-2"
                  >
                    <i className="fas fa-trash-alt"></i> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Toast notification */}
      {toast && (
        <div
          className={`fixed top-5 right-5 bg-white rounded-xl px-5 py-3 shadow-lg z-50 flex items-center gap-3 border-l-4 transition-transform duration-300 ${
            toast.type === 'success' ? 'border-l-[#2a6b6b]' : 'border-l-[#c0392b]'
          }`}
        >
          <i className={`fas ${toast.type === 'success' ? 'fa-check-circle text-[#2a6b6b]' : 'fa-exclamation-circle text-[#c0392b]'} text-xl`}></i>
          <span className="font-medium text-sm">{toast.message}</span>
        </div>
      )}
    </div>
  );
};

export default Wishlist;