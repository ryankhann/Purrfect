import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Bengal = () => {
  const navigate = useNavigate();

  // ---------- State ----------
  const [wishlistIds, setWishlistIds] = useState([]);      
  const [activeFAQ, setActiveFAQ] = useState(0);           
  const [zoomSrc, setZoomSrc] = useState(null);
  const [notification, setNotification] = useState(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [cursorHover, setCursorHover] = useState(false);
  const [scrollPercent, setScrollPercent] = useState(0);

  const sliderRef = useRef(null);
  const notificationTimer = useRef(null);

  // ---------- Effects ----------
  useEffect(() => {
    AOS.init({ duration: 800, once: true, offset: 60 });
  }, []);

  useEffect(() => {
    const loadWishlist = () => {
      const items = JSON.parse(localStorage.getItem('wishlist')) || [];
      setWishlistIds(items.map(i => i.id));
    };
    loadWishlist();
    window.addEventListener('storage', loadWishlist);
    return () => window.removeEventListener('storage', loadWishlist);
  }, []);

  useEffect(() => {
    const move = (e) => setCursorPos({ x: e.clientX - 10, y: e.clientY - 10 });
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  useEffect(() => {
    const addHover = () => setCursorHover(true);
    const removeHover = () => setCursorHover(false);
    const els = document.querySelectorAll('a, button, .cat-card, .accordion-header, .gallery-item');
    els.forEach(el => {
      el.addEventListener('mouseenter', addHover);
      el.addEventListener('mouseleave', removeHover);
    });
    return () => {
      els.forEach(el => {
        el.removeEventListener('mouseenter', addHover);
        el.removeEventListener('mouseleave', removeHover);
      });
    };
  }, [cursorHover]);

  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      setScrollPercent((winScroll / height) * 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (notification) {
      if (notificationTimer.current) clearTimeout(notificationTimer.current);
      notificationTimer.current = setTimeout(() => {
        setNotification(null);
      }, 2500);
    }
  }, [notification]);

  // ---------- Helpers ----------
  const updateCart = (cart) => {
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new StorageEvent('storage', { key: 'cart', newValue: JSON.stringify(cart) }));
  };

  const updateWishlistStorage = (wishlist) => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    window.dispatchEvent(new StorageEvent('storage', { key: 'wishlist', newValue: JSON.stringify(wishlist) }));
  };

  const showNotification = (msg) => {
    setNotification({ message: msg, show: true });
  };

  const toggleWishlist = (kitten) => {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const idx = wishlist.findIndex(i => i.id === kitten.id);
    if (idx > -1) {
      wishlist.splice(idx, 1);
    } else {
      wishlist.push(kitten);
    }
    updateWishlistStorage(wishlist);
    setWishlistIds(wishlist.map(i => i.id));
  };

  const addToCart = (kitten) => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existing = cart.find(i => i.id === kitten.id);
    if (existing) {
      existing.quantity += 1;
      showNotification(`${kitten.name} quantity updated!`);
    } else {
      cart.push({ ...kitten, quantity: 1 });
      showNotification(`${kitten.name} added to cart!`);
    }
    updateCart(cart);
    setTimeout(() => navigate('/cart'), 900);
  };

  const openZoom = (src) => setZoomSrc(src);
  const closeZoom = () => setZoomSrc(null);

  const slideLeft = () => {
    if (sliderRef.current) {
      const cardWidth = sliderRef.current.children[0].offsetWidth + 19;
      sliderRef.current.scrollBy({ left: -cardWidth, behavior: 'smooth' });
    }
  };
  const slideRight = () => {
    if (sliderRef.current) {
      const cardWidth = sliderRef.current.children[0].offsetWidth + 19;
      sliderRef.current.scrollBy({ left: cardWidth, behavior: 'smooth' });
    }
  };

  // Kittens data (3 Bengals)
  const kittens = [
    {
      id: 'bengal-sultan',
      name: 'Sultan',
      age: '14 weeks',
      description: 'Brown spotted • Energetic explorer',
      price: 2500,
      img: '/images/Bengal/Bengallll.jpg',
      sex: 'Male',
      soldOut: false,
    },
    {
      id: 'bengal-nyla',
      name: 'Nyla',
      age: '12 weeks',
      description: 'Silver marble • Affectionate acrobat',
      price: 2800,
      img: '/images/Bengal/Bengal.png',
      sex: 'Female',
      soldOut: false,
    },
    {
      id: 'bengal-rio',
      name: 'Rio',
      age: '13 weeks',
      description: 'Charcoal snow • Rare & stunning',
      price: 3200,
      img: '/images/Bengal/Bengal-3.png',
      sex: 'Male',
      soldOut: true,
    },
  ];

  // FAQ data
  const faqs = [
    {
      question: '🐆 How much exercise do Bengals need?',
      answer:
        'They are highly energetic and need daily interactive play, climbing trees, and puzzle toys.',
    },
    {
      question: '🏡 Are they good with other pets?',
      answer:
        'Yes, with proper introduction. Bengals are social and enjoy the company of other cats or cat-friendly dogs.',
    },
    {
      question: '💉 Health guarantee?',
      answer:
        'All Bengals come with a 2-year genetic health guarantee, vaccinations, and microchip.',
    },
  ];

  // Gallery images for breed info
  const galleryImages = [
    '/images/Bengal/Bengal-1.jpg',
    '/images/Bengal/Bengal-2.png',
    '/images/Bengal/Bengal-3.png',
    '/images/Bengal/Bengal-4.png',
  ];

  return (
    <div className="font-sans bg-[#faf8f6] text-[#0f2a2f] overflow-x-hidden relative">
      {/* ---- Custom Cursor ---- */}
      <div
        className={`hidden md:block fixed pointer-events-none z-[9999] w-5 h-5 border-2 border-[#2a6b6b] rounded-full mix-blend-difference transition-transform duration-200 ${
          cursorHover ? 'scale-150 bg-[#2a6b6b]' : ''
        }`}
        style={{ transform: `translate(${cursorPos.x}px, ${cursorPos.y}px)` }}
      />

      {/* ---- Scroll Progress ---- */}
      <div
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-[#2a6b6b] via-[#d4f0f0] via-[#ffd700] to-[#2a6b6b] z-[9998] shadow-[0_0_15px_rgba(42,107,107,0.5)]"
        style={{ width: `${scrollPercent}%` }}
      />

      {/* ========== HERO SECTION ========== */}
      <section className="relative h-[85vh] overflow-hidden flex items-center justify-center">
        <video
          className="absolute top-0 left-0 w-full h-full object-cover z-0 brightness-[0.55] saturate-[1.1] animate-slow-zoom"
          autoPlay
          muted
          loop
          playsInline
          src="/videos/Bengal.mp4"
          poster="/images/Bengal/Bengal-banner.jpg"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(15,42,47,0.5)_0%,rgba(10,30,35,0.85)_100%)] z-[1]" />
        <div
          className="relative z-10 text-center text-white max-w-3xl px-8"
          data-aos="fade-up"
          data-aos-duration="1300"
        >
          <span className="inline-block bg-white/20 backdrop-blur-md px-6 py-2 rounded-full text-xs font-semibold uppercase tracking-[1px] mb-6 border border-white/30">
            <i className="fas fa-paw"></i> BENGAL • WILD BEAUTY
          </span>
          <h1 className="font-['Playfair_Display'] text-[clamp(2.3rem,5.5vw,4rem)] font-bold mb-4 drop-shadow-lg">
            Exotic Bengals
          </h1>
          <p className="text-base font-normal opacity-90 max-w-xl mx-auto mb-8 leading-relaxed">
            A miniature leopard with a heart of gold – adventurous, loyal, and breathtakingly beautiful.
          </p>
          <a
            href="#kittens-for-sale"
            className="inline-flex items-center gap-3 bg-[#2a6b6b] px-8 py-3 rounded-full text-white hover:bg-[#1f4a4a] transition-all"
          >
            <i className="fas fa-heart"></i> Find Your Kitten
          </a>
          <div className="mt-8">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-yellow-300 font-medium hover:gap-3 hover:text-white transition-all"
            >
              <i className="fas fa-arrow-left"></i> Back to Home
            </Link>
          </div>
        </div>
      </section>

      {/* ========== BREED INFO SECTION ========== */}
      <div className="max-w-7xl mx-auto my-16 px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div data-aos="fade-right">
            <h2 className="text-3xl font-bold text-[#1f4a4a] mb-4 relative inline-block after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-[60px] after:h-[2px] after:bg-[#2a6b6b]">
              Bengal <span className="font-normal">Personality</span>
            </h2>
            <p className="my-6 leading-relaxed text-[#3c5c5c]">
              Bengals are highly active, intelligent cats with a striking wild appearance. They form deep attachments, love water, and can learn tricks easily. Their stunning leopard-like coat comes in a variety of patterns and colors.
            </p>
            <div className="flex flex-wrap gap-4 mt-4">
              <span className="bg-[#eef5f2] px-4 py-1.5 rounded-full text-sm font-semibold text-[#2a6b6b]">
                <i className="fas fa-running"></i> Energetic
              </span>
              <span className="bg-[#eef5f2] px-4 py-1.5 rounded-full text-sm font-semibold text-[#2a6b6b]">
                <i className="fas fa-brain"></i> Highly Intelligent
              </span>
              <span className="bg-[#eef5f2] px-4 py-1.5 rounded-full text-sm font-semibold text-[#2a6b6b]">
                <i className="fas fa-water"></i> Water Lovers
              </span>
            </div>
            <p className="mt-5">✔️ Weight: 8-15 lbs | Lifespan: 12-16 years</p>
          </div>

          {/* 2x2 gallery */}
          <div className="grid grid-cols-2 gap-4" data-aos="fade-left">
            {galleryImages.map((src, i) => (
              <div
                key={i}
                className="gallery-item relative rounded-[24px] overflow-hidden aspect-square cursor-pointer"
                onClick={() => openZoom(src)}
              >
                <img
                  src={src}
                  alt={`Bengal ${i + 1}`}
                  className="w-full h-full object-cover transition-transform duration-800 hover:scale-110"
                  onError={(e) => { e.target.src = 'https://placekitten.com/400/400'; }}
                />
                <div className="gallery-overlay absolute inset-0 bg-gradient-to-t from-[#0f2a2fcc] to-transparent flex items-end p-6 opacity-0 transition-opacity duration-300 hover:opacity-100">
                  <i className="fas fa-search-plus text-white text-3xl translate-y-4 transition-transform duration-300 group-hover:translate-y-0"></i>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ========== AVAILABLE KITTENS SECTION ========== */}
      <div className="max-w-7xl mx-auto my-20 px-6" id="kittens-for-sale">
        <div className="text-center mb-12" data-aos="fade-up">
          <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-[#2a6b6b] bg-[#d4f0f0] px-6 py-1.5 rounded-full mb-4">
            AVAILABLE KITTENS
          </span>
          <h2 className="text-[clamp(1.8rem,4vw,2.5rem)] font-bold">Choose Your Bengal</h2>
        </div>

        {/* Mobile Slider Arrows */}
        <div className="flex md:hidden justify-between absolute left-0 right-0 top-1/2 -translate-y-1/2 z-10 px-2 pointer-events-none">
          <button
            onClick={slideLeft}
            className="pointer-events-auto bg-white w-11 h-11 rounded-full shadow-lg flex items-center justify-center text-[#2a6b6b] hover:bg-[#2a6b6b] hover:text-white transition text-lg"
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          <button
            onClick={slideRight}
            className="pointer-events-auto bg-white w-11 h-11 rounded-full shadow-lg flex items-center justify-center text-[#2a6b6b] hover:bg-[#2a6b6b] hover:text-white transition text-lg"
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>

        {/* Cards container */}
        <div
          ref={sliderRef}
          className="flex overflow-x-auto snap-x snap-mandatory gap-5 p-1 scrollbar-hide md:flex-wrap md:overflow-visible md:snap-none md:justify-center md:gap-8"
        >
          {kittens.map((kitten, idx) => (
            <div
              key={kitten.id}
              className="cat-card bg-white rounded-3xl w-full flex flex-col md:flex-row overflow-hidden shadow-lg transition-all snap-center flex-[0_0_85vw] max-w-[85vw] md:flex-[0_0_auto] md:max-w-lg hover:-translate-y-2 hover:shadow-2xl"
              data-aos={idx % 2 === 0 ? 'fade-right' : 'fade-left'}
              data-aos-delay={(idx % 2) * 100}
            >
              <div
                className="w-full min-h-[240px] md:w-[45%] md:min-h-0 relative cursor-pointer overflow-hidden"
                onClick={() => openZoom(kitten.img)}
              >
                <img
                  src={kitten.img}
                  alt={kitten.name}
                  className="w-full h-full object-cover object-[center_top] transition-transform duration-700 hover:scale-110"
                  onError={(e) => {
                    e.target.src = 'https://placekitten.com/600/400';
                    e.target.alt = 'Bengal kitten';
                  }}
                />
                {/* Wishlist heart */}
                <div
                  className="absolute top-3 left-3 bg-white w-9 h-9 rounded-full flex items-center justify-center shadow cursor-pointer z-20 hover:scale-110 transition"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist({
                      id: kitten.id,
                      name: kitten.name,
                      price: kitten.price,
                      category: 'kitten',
                      image: kitten.img,
                    });
                  }}
                >
                  <i
                    className={
                      wishlistIds.includes(kitten.id)
                        ? 'fas fa-heart text-red-500'
                        : 'far fa-heart text-gray-400'
                    }
                  ></i>
                </div>
                {/* Sex / Sold out badge */}
                {kitten.soldOut ? (
                  <span className="absolute top-3 right-3 bg-red-500 text-white px-2 py-0.5 rounded-full text-xs font-extrabold z-10">
                    SOLD OUT
                  </span>
                ) : (
                  <span className="absolute top-3 right-3 bg-yellow-500/95 text-[#0f2a2f] px-2 py-0.5 rounded-full text-xs font-extrabold z-10">
                    {kitten.sex}
                  </span>
                )}
              </div>

              <div className="p-6 flex flex-col justify-center">
                <h3 className="font-['Playfair_Display'] text-3xl font-bold text-[#1f4a4a] mb-1">{kitten.name}</h3>
                <p className="text-sm text-[#5b6e6e]">
                  <i className="fas fa-birthday-cake"></i> Age: {kitten.age}
                </p>
                <p className="text-sm text-[#5b6e6e]">{kitten.description}</p>
                <div className="text-2xl font-extrabold text-[#2a6b6b] my-3">${kitten.price.toLocaleString()}</div>
                {kitten.soldOut ? (
                  <button
                    className="inline-flex items-center gap-2 bg-gray-300 text-gray-500 border border-gray-300 px-5 py-3 rounded-full font-bold cursor-not-allowed text-sm w-fit"
                    disabled
                  >
                    <i className="fas fa-cart-plus"></i> Sold Out
                  </button>
                ) : (
                  <button
                    onClick={() =>
                      addToCart({
                        id: kitten.id,
                        name: kitten.name,
                        price: kitten.price,
                        category: 'kitten',
                        image: kitten.img,
                      })
                    }
                    className="inline-flex items-center gap-2 bg-[#f0f6f4] border border-[#cfe3df] px-5 py-3 rounded-full font-bold text-[#2a6b6b] hover:bg-[#2a6b6b] hover:text-white hover:border-[#2a6b6b] transition text-sm w-fit"
                  >
                    <i className="fas fa-cart-plus"></i> Add to Cart
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========== FAQ SECTION ========== */}
      <div className="max-w-5xl mx-auto my-20 px-6">
        <div className="text-center mb-12" data-aos="fade-up">
          <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-[#2a6b6b] bg-[#d4f0f0] px-6 py-1.5 rounded-full mb-4">
            QUESTIONS?
          </span>
          <h2 className="text-[clamp(1.8rem,4vw,2.5rem)] font-bold">Bengal Insights</h2>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#e2ece9]"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div
                className="accordion-header px-6 py-5 font-bold text-lg flex justify-between items-center cursor-pointer"
                onClick={() => setActiveFAQ(activeFAQ === index ? -1 : index)}
              >
                <span>{faq.question}</span>
                <i
                  className={`fas fa-chevron-down text-[#2a6b6b] transition-transform ${
                    activeFAQ === index ? 'rotate-180' : ''
                  }`}
                ></i>
              </div>
              <div
                className={`overflow-hidden transition-all duration-300 px-6 text-[#4a6b6b] leading-relaxed ${
                  activeFAQ === index ? 'max-h-48 pb-5' : 'max-h-0'
                }`}
              >
                {faq.answer}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========== FOOTER LINE ========== */}
      <div className="text-center py-8 text-[#8aa9a4]">
        <hr className="max-w-5xl mx-auto border-[#e2e8e6]" />
        <p className="mt-8">
          <i className="fas fa-cat"></i> Purrfect Bengal Breeder – TICA registered cattery
        </p>
      </div>

      {/* ========== ZOOM MODAL ========== */}
      {zoomSrc && (
        <div
          className="fixed inset-0 bg-black/90 z-[10000] flex items-center justify-center p-8"
          onClick={closeZoom}
        >
          <span className="absolute top-8 right-8 text-white text-4xl cursor-pointer hover:text-gray-300 z-10" onClick={closeZoom}>
            &times;
          </span>
          <img
            src={zoomSrc}
            alt="Zoomed cat"
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* ========== NOTIFICATION TOAST ========== */}
      {notification && (
        <div className="fixed bottom-8 right-8 bg-white border-l-4 border-[#2a6b6b] rounded-2xl p-4 shadow-2xl flex items-center gap-4 z-[10000] animate-slide-in">
          <i className="fas fa-check-circle text-[#2a6b6b] text-xl"></i>
          <span className="font-medium">{notification.message}</span>
        </div>
      )}
    </div>
  );
};

export default Bengal;