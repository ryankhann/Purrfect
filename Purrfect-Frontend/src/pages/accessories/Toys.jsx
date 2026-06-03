import React, { useState, useEffect } from 'react';

const PRODUCTS = [
  {
    id: 'toy1',
    name: 'Feather Wand',
    category: 'interactive',
    type: 'Interactive Toy',
    price: 8.99,
    desc: 'Replaceable feather attachments – endless chasing fun.',
    image: '/images/accessories/toy1.jpg',
  },
  {
    id: 'toy2',
    name: 'Catnip Mice (3‑pack)',
    category: 'catnip',
    type: 'Catnip Toy',
    price: 5.49,
    desc: 'Hand‑stuffed organic catnip mice.',
    image: '/images/accessories/toy2.png',
  },
  {
    id: 'toy3',
    name: 'Laser Pointer',
    category: 'electronic',
    type: 'Electronic Toy',
    price: 12.99,
    desc: 'USB‑rechargeable with three light patterns.',
    image: '/images/accessories/toy3.png',
  },
  {
    id: 'toy4',
    name: 'Crinkle Tunnel',
    category: 'tunnel',
    type: 'Tunnel Toy',
    price: 19.99,
    desc: 'Foldable crinkle tunnel with peek‑a‑boo holes.',
    image: '/images/accessories/toy4.png',
  },
];

const FILTERS = [
  { key: 'all', label: 'All Toys' },
  { key: 'interactive', label: 'Interactive' },
  { key: 'catnip', label: 'Catnip' },
  { key: 'electronic', label: 'Electronic' },
  { key: 'tunnel', label: 'Tunnels' },
];

const Toys = () => {
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

  const filtered = activeFilter === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.category === activeFilter);

  const updateCart = (cart) => {
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new StorageEvent('storage', { key: 'cart', newValue: JSON.stringify(cart) }));
  };

  const toggleWishlist = (product) => {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const idx = wishlist.findIndex(i => i.id === product.id);
    if (idx > -1) wishlist.splice(idx, 1);
    else wishlist.push(product);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    setWishlistIds(wishlist.map(i => i.id));
    window.dispatchEvent(new StorageEvent('storage', { key: 'wishlist', newValue: JSON.stringify(wishlist) }));
  };

  const addToCart = (product) => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existing = cart.find(i => i.id === product.id);
    if (existing) {
      existing.quantity += 1;
      setNotification(`"${product.name}" quantity increased!`);
    } else {
      cart.push({ ...product, quantity: 1 });
      setNotification(`"${product.name}" added to cart!`);
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
      <section className="relative bg-gradient-to-br from-[#0f2a2f] to-[#2a6b6b] text-white py-20 text-center">
        <span className="inline-block bg-white/20 backdrop-blur-md px-5 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-6 border border-white/20">
          <i className="fas fa-fish"></i> Playtime Fun
        </span>
        <h1 className="font-['Playfair_Display'] text-4xl md:text-6xl font-bold mb-4">Toys</h1>
        <p className="text-lg opacity-90 max-w-xl mx-auto">Keep your feline happy, active, and engaged with our curated toy collection.</p>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="flex gap-2 overflow-x-auto pb-2 justify-center filter-scroll">
          {FILTERS.map(f => (
            <button key={f.key} onClick={() => setActiveFilter(f.key)}
              className={`px-5 py-2 rounded-full border text-sm font-medium transition whitespace-nowrap ${
                activeFilter === f.key ? 'bg-[#2a6b6b] text-white border-[#2a6b6b]' : 'text-[#2a6b6b] border-[#2a6b6b] hover:bg-[#d4f0f0]'
              }`}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map(product => (
            <div key={product.id} className="bg-white rounded-2xl overflow-hidden shadow-lg flex flex-col transition-transform duration-300 hover:-translate-y-1.5 hover:shadow-2xl">
              <div className="relative h-56 cursor-pointer" onClick={() => openZoom(product.image)}>
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=Toy'; }} />
                <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">{product.type}</div>
                <button className="absolute top-3 left-3 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow hover:scale-110 transition" onClick={(e) => { e.stopPropagation(); toggleWishlist(product); }}>
                  <i className={wishlistIds.includes(product.id) ? 'fas fa-heart text-red-500' : 'far fa-heart text-gray-500'}></i>
                </button>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <h3 className="text-lg font-bold font-['Playfair_Display'] text-[#0f2a2f] mb-1">{product.name}</h3>
                <p className="text-sm text-gray-500 mb-3 flex-1">{product.desc}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xl font-extrabold text-[#2a6b6b]">${product.price.toFixed(2)}</span>
                  <button onClick={() => addToCart(product)} className="bg-[#2a6b6b] text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-[#0f2a2f] transition flex items-center gap-1">
                    <i className="fas fa-cart-plus text-xs"></i> Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {zoomSrc && (
        <div className="fixed inset-0 bg-black/90 z-[9999] flex items-center justify-center p-8" onClick={closeZoom}>
          <span className="absolute top-6 right-6 text-white text-4xl cursor-pointer" onClick={closeZoom}>&times;</span>
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

export default Toys;