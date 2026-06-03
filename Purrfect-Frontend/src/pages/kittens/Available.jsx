import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const KITTENS = [
  {
    id: 'avail-1',
    name: 'Thor',
    breed: 'Maine Coon',
    age: '13 weeks',
    sex: 'Male',
    price: 1500,
    image: '/images/MaineCoon/MaineCoon-1.jpg',
    category: 'kitten',
  },
  {
    id: 'avail-2',
    name: 'Luna',
    breed: 'Persian',
    age: '12 weeks',
    sex: 'Female',
    price: 1800,
    image: '/images/Persian/Persian-1.jpg',
    category: 'kitten',
  },
  {
    id: 'avail-3',
    name: 'Sultan',
    breed: 'Bengal',
    age: '14 weeks',
    sex: 'Male',
    price: 2500,
    image: '/images/Bengal/Bengallll.jpg',
    category: 'kitten',
  },
  {
    id: 'avail-4',
    name: 'Ming',
    breed: 'Siamese',
    age: '11 weeks',
    sex: 'Male',
    price: 1500,
    image: '/images/SiameseCat.jpg',
    category: 'kitten',
  },
  {
    id: 'avail-5',
    name: 'Winston',
    breed: 'British Shorthair',
    age: '15 weeks',
    sex: 'Male',
    price: 2200,
    image: '/images/BritishShorthairCat.jpg',
    category: 'kitten',
  },
];

const BREEDS = ['All', 'Maine Coon', 'Persian', 'Bengal', 'Siamese', 'British Shorthair'];

const Available = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('All');
  const [wishlistIds, setWishlistIds] = useState([]);
  const [zoomSrc, setZoomSrc] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('wishlist')) || [];
    setWishlistIds(items.map(i => i.id));
  }, []);

  const filtered = filter === 'All' ? KITTENS : KITTENS.filter(k => k.breed === filter);

  const toggleWishlist = (kitten) => {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const idx = wishlist.findIndex(i => i.id === kitten.id);
    if (idx > -1) wishlist.splice(idx, 1);
    else wishlist.push(kitten);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    setWishlistIds(wishlist.map(i => i.id));
    window.dispatchEvent(new StorageEvent('storage', { key: 'wishlist', newValue: JSON.stringify(wishlist) }));
  };

  const addToCart = (kitten) => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existing = cart.find(i => i.id === kitten.id);
    if (existing) {
      existing.quantity += 1;
      setNotification(`"${kitten.name}" quantity updated!`);
    } else {
      cart.push({ ...kitten, quantity: 1 });
      setNotification(`"${kitten.name}" added to cart!`);
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new StorageEvent('storage', { key: 'cart', newValue: JSON.stringify(cart) }));
    setTimeout(() => setNotification(null), 2000);
  };

  return (
    <div className="font-sans bg-[#faf8f6] text-[#0f2a2f] min-h-screen">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#0f2a2f] to-[#2a6b6b] text-white py-16 md:py-20 text-center">
        <h1 className="font-['Playfair_Display'] text-4xl md:text-5xl font-bold mb-4">Available Kittens</h1>
        <p className="text-lg opacity-90 max-w-xl mx-auto">Find your perfect feline friend from our current selection.</p>
      </section>

      {/* Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 flex justify-center flex-wrap gap-2">
        {BREEDS.map(b => (
          <button
            key={b}
            onClick={() => setFilter(b)}
            className={`px-4 py-2 rounded-full border text-sm font-semibold transition ${
              filter === b ? 'bg-[#2a6b6b] text-white border-[#2a6b6b]' : 'text-[#2a6b6b] border-[#2a6b6b] hover:bg-[#d4f0f0]'
            }`}
          >
            {b}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map(kitten => (
            <div key={kitten.id} className="bg-white rounded-2xl overflow-hidden shadow-lg transition-all hover:-translate-y-1.5 hover:shadow-2xl flex flex-col">
              <div className="relative h-60 cursor-pointer" onClick={() => setZoomSrc(kitten.image)}>
                <img src={kitten.image} alt={kitten.name} className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=Kitten'; }} />
                <button className="absolute top-3 left-3 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow hover:scale-110 transition"
                  onClick={(e) => { e.stopPropagation(); toggleWishlist(kitten); }}>
                  <i className={wishlistIds.includes(kitten.id) ? 'fas fa-heart text-red-500' : 'far fa-heart text-gray-400'}></i>
                </button>
                <span className="absolute top-3 right-3 bg-yellow-500/90 text-black text-xs font-bold px-3 py-1 rounded-full">{kitten.sex}</span>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-['Playfair_Display'] text-xl font-bold">{kitten.name}</h3>
                <p className="text-sm text-gray-500">{kitten.breed} • {kitten.age}</p>
                <div className="mt-auto pt-4 flex items-center justify-between">
                  <span className="text-2xl font-bold text-[#2a6b6b]">${kitten.price.toLocaleString()}</span>
                  <button onClick={() => addToCart(kitten)} className="bg-[#2a6b6b] text-white px-5 py-2 rounded-full font-semibold hover:bg-[#1f4a4a] transition">
                    <i className="fas fa-cart-plus mr-1"></i> Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {zoomSrc && (
        <div className="fixed inset-0 bg-black/90 z-[10000] flex items-center justify-center p-8" onClick={() => setZoomSrc(null)}>
          <span className="absolute top-8 right-8 text-white text-4xl cursor-pointer" onClick={() => setZoomSrc(null)}>&times;</span>
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

export default Available;