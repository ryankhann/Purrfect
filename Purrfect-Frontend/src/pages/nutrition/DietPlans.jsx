import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PLANS = [
  {
    id: 'plan1',
    name: 'Kibble Monthly Pack',
    category: 'kibble',
    type: '2kg / month',
    price: 44.99,
    desc: 'Grain‑free kibble delivered monthly. Ideal for adult cats.',
    image: '/images/food/MonthlyKibble.png',   // replace with your own image
  },
  {
    id: 'plan2',
    name: 'Wet Food Variety Box',
    category: 'wet',
    type: '24 cans / month',
    price: 54.99,
    desc: 'Assorted pâtés, flakes & shreds – a different flavour every day.',
    image: '/images/food/WetBox.png',
  },
  {
    id: 'plan3',
    name: 'Kitten Growth Plan',
    category: 'kitten',
    type: 'Complete Starter Pack',
    price: 69.99,
    desc: 'Kibble, wet food & supplements tailored for growing kittens.',
    image: '/images/food/KittenPlan.png',
  },
];

const FILTERS = [
  { key: 'all', label: 'All Plans' },
  { key: 'kibble', label: 'Kibble' },
  { key: 'wet', label: 'Wet Food' },
  { key: 'kitten', label: 'Kitten' },
];

const DietPlans = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('all');
  const [wishlistIds, setWishlistIds] = useState([]);
  const [zoomSrc, setZoomSrc] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('wishlist')) || [];
    setWishlistIds(items.map(i => i.id));
    const handleStorage = () => {
      const data = JSON.parse(localStorage.getItem('wishlist')) || [];
      setWishlistIds(data.map(i => i.id));
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const filteredPlans = activeFilter === 'all' ? PLANS : PLANS.filter(p => p.category === activeFilter);

  const updateCart = (cart) => {
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new StorageEvent('storage', { key: 'cart', newValue: JSON.stringify(cart) }));
  };

  const toggleWishlist = (plan) => {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const idx = wishlist.findIndex(item => item.id === plan.id);
    if (idx > -1) wishlist.splice(idx, 1);
    else wishlist.push(plan);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    setWishlistIds(wishlist.map(i => i.id));
    window.dispatchEvent(new StorageEvent('storage', { key: 'wishlist', newValue: JSON.stringify(wishlist) }));
  };

  const addToCart = (plan) => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existing = cart.find(item => item.id === plan.id);
    if (existing) {
      existing.quantity += 1;
      setNotification(`"${plan.name}" quantity updated!`);
    } else {
      cart.push({ ...plan, quantity: 1 });
      setNotification(`"${plan.name}" added to cart!`);
    }
    updateCart(cart);
  };

  const openZoom = (src) => {
    setZoomSrc(src);
    document.body.style.overflow = 'hidden';
  };
  const closeZoom = () => {
    setZoomSrc(null);
    document.body.style.overflow = '';
  };

  return (
    <div className="font-sans bg-[#faf8f6] text-[#0f2a2f] min-h-screen">
      <section className="relative bg-gradient-to-br from-[#0f2a2f] to-[#2a6b6b] text-white py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="inline-block bg-white/20 backdrop-blur-md px-5 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-6 border border-white/20">
            <i className="fas fa-calendar-check"></i> Meal Plans
          </span>
          <h1 className="font-['Playfair_Display'] text-4xl md:text-6xl font-bold mb-4">Diet Plans</h1>
          <p className="text-lg opacity-90 max-w-xl mx-auto">Convenient monthly subscriptions tailored to your cat’s needs.</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="flex gap-2 overflow-x-auto pb-2 justify-center filter-scroll">
          {FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={`px-5 py-2 rounded-full border text-sm font-medium transition whitespace-nowrap ${
                activeFilter === f.key ? 'bg-[#2a6b6b] text-white border-[#2a6b6b]' : 'text-[#2a6b6b] border-[#2a6b6b] hover:bg-[#d4f0f0]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPlans.map(plan => (
            <div key={plan.id} className="food-card bg-white rounded-2xl overflow-hidden shadow-lg flex flex-col transition-transform duration-300 hover:-translate-y-1.5 hover:shadow-2xl">
              <div className="relative h-56 cursor-pointer" onClick={() => openZoom(plan.image)}>
                <img src={plan.image} alt={plan.name} className="w-full h-full object-cover" onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=Diet+Plan'; }} />
                <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">{plan.type}</div>
                <button className="absolute top-3 left-3 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow hover:scale-110 transition" onClick={(e) => { e.stopPropagation(); toggleWishlist(plan); }}>
                  <i className={wishlistIds.includes(plan.id) ? 'fas fa-heart text-red-500' : 'far fa-heart text-gray-500'}></i>
                </button>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <h3 className="text-lg font-bold font-['Playfair_Display'] text-[#0f2a2f] mb-1">{plan.name}</h3>
                <p className="text-sm text-gray-500 mb-3 flex-1">{plan.desc}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xl font-extrabold text-[#2a6b6b]">${plan.price.toFixed(2)}<span className="text-xs font-normal text-gray-500">/mo</span></span>
                  <button onClick={() => addToCart(plan)} className="bg-[#2a6b6b] text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-[#0f2a2f] transition flex items-center gap-1">
                    <i className="fas fa-cart-plus text-xs"></i> Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center text-sm text-gray-400 py-8 border-t border-gray-200 mt-10">
        <p>Plans can be paused or cancelled anytime. Free shipping on all subscriptions. 🐾</p>
      </div>

      {zoomSrc && (
        <div className="fixed inset-0 bg-black/90 z-[9999] flex items-center justify-center p-8" onClick={closeZoom}>
          <span className="absolute top-6 right-6 text-white text-4xl cursor-pointer hover:text-gray-300" onClick={closeZoom}>&times;</span>
          <img src={zoomSrc} alt="zoom" className="max-w-[90vw] max-h-[90vh] object-contain rounded-2xl" onClick={e => e.stopPropagation()} />
        </div>
      )}

      {notification && (
        <div className="fixed bottom-6 right-6 bg-white border-l-4 border-[#2a6b6b] rounded-xl shadow-2xl p-4 flex items-center gap-3 z-50 animate-slide-in">
          <i className="fas fa-check-circle text-[#2a6b6b] text-xl"></i>
          <span className="font-medium text-sm">{notification}</span>
        </div>
      )}
    </div>
  );
};

export default DietPlans;