import React, { useState, useEffect } from 'react';

const PRODUCTS = [
  {
    id: 'food1',
    name: 'Arctic Salmon & Brown Rice',
    category: 'dry',
    type: 'Grain‑Free Kibble',
    price: 34.99,
    desc: 'Rich in omega‑3 for a glossy coat.',
    image: '/images/food/RiceNSalmon.jpg',
  },
  {
    id: 'food2',
    name: 'Free‑Range Chicken Pâté',
    category: 'wet',
    type: 'Adult Wet Food',
    price: 2.99,
    desc: 'Smooth texture, high moisture.',
    image: '/images/food/Chicken.png',
  },
  {
    id: 'food3',
    name: 'Tuna & Shrimp Flakes',
    category: 'treats',
    type: 'Freeze‑Dried Treats',
    price: 12.50,
    desc: 'Single‑ingredient, high protein.',
    image: '/images/food/TunaNShrimp.png',
  },
  {
    id: 'food4',
    name: 'Duck & Green Pea Recipe',
    category: 'dry',
    type: 'Limited Ingredient Diet',
    price: 39.99,
    desc: 'Ideal for sensitive stomachs.',
    image: '/images/food/Duck.png',
  },
  {
    id: 'food5',
    name: 'Wild Alaskan Salmon Oil',
    category: 'supplement',
    type: 'Skin & Coat Supplement',
    price: 18.99,
    desc: 'Liquid pump for easy mixing.',
    image: '/images/food/Oil.png',
  },
  {
    id: 'food6',
    name: 'Chicken & Liver Mousse',
    category: 'wet',
    type: 'Kitten Food',
    price: 2.49,
    desc: 'Extra smooth for weaning kittens.',
    image: '/images/food/Liver.png',
  },
  {
    id: 'food7',
    name: 'Catnip & Silvervine Mix',
    category: 'treats',
    type: 'Dental Chew Sticks',
    price: 8.99,
    desc: 'Supports dental health.',
    image: '/images/food/Catnip.png',
  },
  {
    id: 'food8',
    name: 'Grass‑Fed Beef & Pumpkin',
    category: 'dry',
    type: 'High‑Protein Kibble',
    price: 44.99,
    desc: 'For active adult cats.',
    image: '/images/food/beef.png',
  },
  {
    id: 'food9',
    name: 'Probiotic Digestive Blend',
    category: 'supplement',
    type: 'Powder Supplement',
    price: 22.99,
    desc: 'Supports gut health.',
    image: '/images/food/probiotics.png',
  },
];

const FILTERS = [
  { key: 'all', label: 'All Foods' },
  { key: 'dry', label: 'Dry Food' },
  { key: 'wet', label: 'Wet Food' },
  { key: 'treats', label: 'Treats' },
  { key: 'supplement', label: 'Supplements' },
];

const PremiumFood = () => {
  // ---------- State ----------
  const [activeFilter, setActiveFilter] = useState('all');
  const [wishlistIds, setWishlistIds] = useState([]);
  const [zoomSrc, setZoomSrc] = useState(null);
  const [notification, setNotification] = useState(null);

  // Load wishlist from localStorage
  useEffect(() => {
    const load = () => {
      const items = JSON.parse(localStorage.getItem('wishlist')) || [];
      setWishlistIds(items.map(i => i.id));
    };
    load();
    window.addEventListener('storage', load);
    return () => window.removeEventListener('storage', load);
  }, []);

  // Notification auto-dismiss
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // ---------- Helpers ----------
  const filteredProducts = activeFilter === 'all'
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category === activeFilter);

  const updateLocalStorage = (key, arr) => {
    localStorage.setItem(key, JSON.stringify(arr));
    window.dispatchEvent(new StorageEvent('storage', { key, newValue: JSON.stringify(arr) }));
    // Also dispatch count events for navbar
    if (key === 'wishlist') {
      window.dispatchEvent(new StorageEvent('storage', { key: 'wishlistCount', newValue: arr.length.toString() }));
    } else if (key === 'cart') {
      const total = arr.reduce((sum, item) => sum + (item.quantity || 1), 0);
      window.dispatchEvent(new StorageEvent('storage', { key: 'cartCount', newValue: total.toString() }));
    }
  };

  // Toggle wishlist
  const toggleWishlist = (product) => {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const idx = wishlist.findIndex(item => item.id === product.id);
    if (idx > -1) {
      wishlist.splice(idx, 1);
    } else {
      wishlist.push(product);
    }
    updateLocalStorage('wishlist', wishlist);
    setWishlistIds(wishlist.map(i => i.id));
  };

  // Add to cart
  const addToCart = (product) => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      existing.quantity += 1;
      setNotification(`"${product.name}" quantity increased!`);
    } else {
      cart.push({ ...product, quantity: 1 });
      setNotification(`"${product.name}" added to cart!`);
    }
    updateLocalStorage('cart', cart);
  };

  // Zoom modal
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
      {/* ========== HERO BANNER ========== */}
      <section className="relative bg-gradient-to-br from-[#0f2a2f] to-[#2a6b6b] text-white py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="inline-block bg-white/20 backdrop-blur-md px-5 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-6 border border-white/20">
            <i className="fas fa-fish"></i> Premium Nutrition
          </span>
          <h1 className="font-['Playfair_Display'] text-4xl md:text-6xl font-bold mb-4">Gourmet Cat Food</h1>
          <p className="text-lg opacity-90 max-w-xl mx-auto mb-0">
            Hand‑selected recipes for every feline palate – from grain‑free kibble to succulent wet meals.
          </p>
        </div>
        {/* Floating decorations */}
        <div className="absolute top-10 left-10 text-6xl opacity-20 animate-bounce"><i className="fas fa-fish"></i></div>
        <div className="absolute bottom-10 right-10 text-6xl opacity-20 animate-pulse"><i className="fas fa-paw"></i></div>
      </section>

      {/* ========== FILTER TABS ========== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="flex gap-2 overflow-x-auto pb-2 justify-start md:justify-center filter-scroll">
          {FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={`px-5 py-2 rounded-full border text-sm font-medium transition whitespace-nowrap ${
                activeFilter === f.key
                  ? 'bg-[#2a6b6b] text-white border-[#2a6b6b]'
                  : 'text-[#2a6b6b] border-[#2a6b6b] hover:bg-[#d4f0f0]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* ========== PRODUCTS GRID ========== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map(product => (
            <div
              key={product.id}
              className="food-card bg-white rounded-2xl overflow-hidden shadow-lg flex flex-col transition-transform duration-300 hover:-translate-y-1.5 hover:shadow-2xl"
            >
              <div className="relative h-56 cursor-pointer" onClick={() => openZoom(product.image)}>
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">
                  {product.type}
                </div>
                <button
                  className="absolute top-3 left-3 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow hover:scale-110 transition"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist({
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      category: product.category,
                      image: product.image,
                    });
                  }}
                >
                  <i
                    className={
                      wishlistIds.includes(product.id)
                        ? 'fas fa-heart text-red-500'
                        : 'far fa-heart text-gray-500'
                    }
                  ></i>
                </button>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <h3 className="text-lg font-bold font-['Playfair_Display'] text-[#0f2a2f] mb-1">{product.name}</h3>
                <p className="text-sm text-gray-500 mb-3 flex-1">{product.desc}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xl font-extrabold text-[#2a6b6b]">${product.price.toFixed(2)}</span>
                  <button
                    onClick={() =>
                      addToCart({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        category: product.category,
                        image: product.image,
                      })
                    }
                    className="bg-[#2a6b6b] text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-[#0f2a2f] transition flex items-center gap-1"
                  >
                    <i className="fas fa-cart-plus text-xs"></i> Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========== FOOTER ========== */}
      <div className="text-center text-sm text-gray-400 py-8 border-t border-gray-200 mt-10">
        <p>All our foods are made with human‑grade ingredients and no artificial additives. 🐾</p>
      </div>

      {/* ========== ZOOM MODAL ========== */}
      {zoomSrc && (
        <div
          className="fixed inset-0 bg-black/90 z-[9999] flex items-center justify-center p-8"
          onClick={closeZoom}
        >
          <span
            className="absolute top-6 right-6 text-white text-4xl cursor-pointer hover:text-gray-300 z-10"
            onClick={closeZoom}
          >
            &times;
          </span>
          <img
            src={zoomSrc}
            alt="Product zoom"
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* ========== NOTIFICATION ========== */}
      {notification && (
        <div className="fixed bottom-6 right-6 bg-white border-l-4 border-[#2a6b6b] rounded-xl shadow-2xl p-4 flex items-center gap-3 z-50 animate-slide-in">
          <i className="fas fa-check-circle text-[#2a6b6b] text-xl"></i>
          <span className="font-medium text-sm">{notification}</span>
        </div>
      )}
    </div>
  );
};

export default PremiumFood;