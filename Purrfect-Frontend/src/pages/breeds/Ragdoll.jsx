import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Ragdoll = () => {
  const navigate = useNavigate();

  // ---------- State ----------
  const [wishlistIds, setWishlistIds] = useState([]);
  const [zoomSrc, setZoomSrc] = useState(null);
  const [notification, setNotification] = useState(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [cursorHover, setCursorHover] = useState(false);
  const [scrollPercent, setScrollPercent] = useState(0);

  const sliderRef = useRef(null);
  const notificationTimer = useRef(null);

  // ---------- Effects ----------
  // AOS init (use only if needed, but we'll rely mostly on our custom animations)
  useEffect(() => {
    AOS.init({ duration: 800, once: true, offset: 60 });
  }, []);

  // Load wishlist from localStorage
  useEffect(() => {
    const loadWishlist = () => {
      const items = JSON.parse(localStorage.getItem('wishlist')) || [];
      setWishlistIds(items.map(i => i.id));
    };
    loadWishlist();
    window.addEventListener('storage', loadWishlist);
    return () => window.removeEventListener('storage', loadWishlist);
  }, []);

  // Custom cursor
  useEffect(() => {
    const move = (e) => setCursorPos({ x: e.clientX - 10, y: e.clientY - 10 });
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  // Add hover listeners for cursor effect
  useEffect(() => {
    const addHover = () => setCursorHover(true);
    const removeHover = () => setCursorHover(false);
    const els = document.querySelectorAll('a, button, .cat-card, .accordion-header, .gallery-item, .video-card');
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

  // Scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      setScrollPercent((winScroll / height) * 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Notification auto-dismiss
  useEffect(() => {
    if (notification) {
      if (notificationTimer.current) clearTimeout(notificationTimer.current);
      notificationTimer.current = setTimeout(() => setNotification(null), 1500);
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
      setNotification(`"${kitten.name}" quantity updated!`);
    } else {
      cart.push({ ...kitten, quantity: 1 });
      setNotification(`"${kitten.name}" added to cart!`);
    }
    updateCart(cart);
  };

  const openZoom = (src) => setZoomSrc(src);
  const closeZoom = () => setZoomSrc(null);

  // Slider controls for mobile
  const slideLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };
  const slideRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  // Kittens data
  const kittens = [
    {
      id: 'ragdoll-luna',
      name: 'Luna',
      age: '14 weeks',
      description: 'A sweet, playful girl who loves cuddles and feather toys.',
      price: 1200,
      img: '/images/Ragdoll/Luna.jpg',
      sex: 'Female',
      soldOut: false,
      point: 'Seal Point',
    },
    {
      id: 'ragdoll-milo',
      name: 'Milo',
      age: '12 weeks',
      description: 'Curious and adventurous, Milo is the first to explore new toys.',
      price: 1400,
      img: '/images/Ragdoll/Oliver.jpg',
      sex: 'Male',
      soldOut: false,
      point: 'Blue Point',
    },
    {
      id: 'ragdoll-bella',
      name: 'Bella',
      age: '16 weeks',
      description: 'A gentle soul who loves lounging in sunny spots.',
      price: 1100,
      img: '/images/Ragdoll/Bella.jpeg',
      sex: 'Female',
      soldOut: true,
      point: 'Chocolate Point',
    },
    {
      id: 'ragdoll-max',
      name: 'Max',
      age: '13 weeks',
      description: 'Confident and friendly, Max is always ready to greet you at the door.',
      price: 1300,
      img: '/images/Ragdoll/Leo.png',
      sex: 'Male',
      soldOut: false,
      point: 'Lilac Point',
    },
  ];

  // Gallery images for breed info section
  const galleryImages = [
    '/images/Ragdoll/Ragdoll1.jpg',
    '/images/Ragdoll/Ragdoll2.jpg',
    '/images/Ragdoll/Ragdoll3.jpg',
    '/images/Ragdoll/Ragdoll4.jpg',
  ];

  // Video data
  const videos = [
    {
      src: '/videos/PlayfulCat.mp4',
      poster: '/images/Ragdoll/Ragdoll1.jpg',
      title: 'Playful Ragdoll Kittens',
    },
    {
      src: '/videos/Ragdoll_video2.mp4',
      poster: '/images/Ragdoll/Ragdoll2.jpg',
      title: 'Gentle Giant Cuddles',
    },
    {
      src: '/videos/Ragdoll_video3.mp4',
      poster: '/images/Ragdoll/Ragdoll3.jpg',
      title: 'Fluffy & Affectionate',
    },
  ];

  return (
    <div className="font-sans bg-[#faf8f6] text-[#0f2a2f] overflow-x-hidden relative">
      {/* ---- Custom Cursor ---- */}
      <div
        className={`hidden md:block fixed pointer-events-none z-[9999] w-4 h-4 border-2 border-[#2a6b6b] rounded-full mix-blend-difference transition-transform duration-150 ${
          cursorHover ? 'scale-150 bg-[#2a6b6b]' : ''
        }`}
        style={{ transform: `translate(${cursorPos.x}px, ${cursorPos.y}px)` }}
      />

      {/* ---- Scroll Progress ---- */}
      <div
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-[#2a6b6b] via-[#d4f0f0] to-[#2a6b6b] z-[9998] shadow-[0_0_20px_rgba(42,107,107,0.5)]"
        style={{ width: `${scrollPercent}%` }}
      />

      {/* ========== HERO SECTION ========== */}
      <section className="h-[90vh] relative overflow-hidden flex items-center justify-center">
        <video
          className="absolute top-0 left-0 w-full h-full object-cover z-0 brightness-[0.7] saturate-[1.2]"
          autoPlay
          muted
          loop
          playsInline
          poster="/images/Ragdoll/Ragdoll1.jpg"
          src="/videos/Ragdoll.mp4"
        >
          {/* Fallback if video doesn't load – poster will handle */}
        </video>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(15,42,47,0.7)_100%)] z-[1]" />
        <div className="relative z-10 text-center text-white animate-float">
          <h1 className="text-[clamp(2.5rem,12vw,6rem)] font-extrabold tracking-tight mb-3 animate-glow-pulse">Ragdoll</h1>
          <p className="text-xl font-light tracking-widest uppercase bg-gradient-to-r from-transparent via-white/20 to-transparent py-3 px-6 inline-block rounded-[40px] backdrop-blur border border-white/20">
            The Gentle Giants
          </p>
        </div>
        <div className="absolute bottom-[30px] left-1/2 -translate-x-1/2 z-10 animate-bounce-custom">
          <i className="fas fa-chevron-down text-white text-3xl"></i>
        </div>
      </section>

      {/* ========== BREED INFORMATION SECTION ========== */}
      <section className="max-w-[1200px] mx-auto my-16 px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div
          className="bg-white rounded-[32px] p-9 shadow-[0_30px_60px_-20px_rgba(0,40,40,0.2)] -translate-x-10 opacity-0 animate-slide-left"
          data-aos="fade-right"
        >
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-[#2a6b6b] bg-[#d4f0f0] py-1.5 px-6 rounded-[40px] mb-4 animate-tag-pulse">
            THE BREED
          </span>
          <h2 className="text-4xl font-bold text-[#0f2a2f] mb-6">Fluffy, Blue‑Eyed & Affectionate</h2>
          <p className="text-base leading-relaxed text-[#5f6e73] mb-6">
            Ragdolls are large, muscular cats with semi‑long, silky fur and striking blue eyes. Known for their docile and placid temperament, they earned their name because of their tendency to go limp when picked up, just like a ragdoll. These gentle giants are incredibly affectionate, making them perfect family companions.
          </p>

          <div className="grid grid-cols-2 gap-6 mt-8">
            <div className="text-center">
              <div className="text-4xl font-extrabold text-[#2a6b6b] mb-1 relative inline-block after:content-['+'] after:absolute after:top-0 after:-right-4 after:text-2xl after:text-[#d4f0f0]">
                15
              </div>
              <div className="text-xs uppercase tracking-wider text-[#5f6e73]">Years Lifespan</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-extrabold text-[#2a6b6b] mb-1 relative inline-block after:content-['+'] after:absolute after:top-0 after:-right-4 after:text-2xl after:text-[#d4f0f0]">
                20
              </div>
              <div className="text-xs uppercase tracking-wider text-[#5f6e73]">lbs Average</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-extrabold text-[#2a6b6b] mb-1 relative inline-block after:content-['+'] after:absolute after:top-0 after:-right-4 after:text-2xl after:text-[#d4f0f0]">
                4
              </div>
              <div className="text-xs uppercase tracking-wider text-[#5f6e73]">Patterns</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-extrabold text-[#2a6b6b] mb-1 relative inline-block after:content-['+'] after:absolute after:top-0 after:-right-4 after:text-2xl after:text-[#d4f0f0]">
                6
              </div>
              <div className="text-xs uppercase tracking-wider text-[#5f6e73]">Colors</div>
            </div>
          </div>
        </div>

        <div
          className="grid grid-cols-2 gap-4 translate-x-10 opacity-0 animate-slide-right"
          data-aos="fade-left"
        >
          {galleryImages.map((src, i) => (
            <div
              key={i}
              className="gallery-item relative rounded-[24px] overflow-hidden aspect-square cursor-pointer"
              onClick={() => openZoom(src)}
            >
              <img
                src={src}
                alt={`Ragdoll ${i + 1}`}
                className="w-full h-full object-cover transition-transform duration-800 hover:scale-110"
                onError={(e) => { e.target.src = 'https://placekitten.com/400/400'; }}
              />
              <div className="gallery-overlay absolute inset-0 bg-gradient-to-t from-[#0f2a2fcc] to-transparent flex items-end p-6 opacity-0 transition-opacity duration-300 hover:opacity-100">
                <i className="fas fa-search-plus text-white text-3xl translate-y-4 transition-transform duration-300"></i>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========== SALE SECTION: AVAILABLE RAGDOLLS ========== */}
      <section id="sale-section" className="max-w-[1200px] mx-auto my-16 px-8">
        <div className="text-center mb-10">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-[#2a6b6b] bg-[#d4f0f0] py-1.5 px-6 rounded-[40px] mb-4">
            MEET THE FAMILY
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-[#0f2a2f] mb-3">Ragdolls Ready for Love</h2>
          <p className="text-[#5f6e73] max-w-xl mx-auto">
            Each of our Ragdolls is raised with care, health‑certified, and waiting to become your purr‑fect companion.
          </p>
        </div>

        {/* Slider Wrapper */}
        <div className="relative" id="sliderWrapper">
          {/* Arrow Buttons (visible on mobile) */}
          <button
            onClick={slideLeft}
            className="hidden sm:hidden absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 shadow-lg rounded-full w-10 h-10 flex items-center justify-center text-[#2a6b6b] hover:bg-[#d4f0f0] transition"
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          <button
            onClick={slideRight}
            className="hidden sm:hidden absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 shadow-lg rounded-full w-10 h-10 flex items-center justify-center text-[#2a6b6b] hover:bg-[#d4f0f0] transition"
          >
            <i className="fas fa-chevron-right"></i>
          </button>

          {/* Cards Container */}
          <div
            ref={sliderRef}
            className="flex overflow-x-auto snap-x snap-mandatory gap-5 pb-4 hide-scrollbar md:grid md:grid-cols-2 md:overflow-visible md:snap-none"
          >
            {kittens.map((kitten, idx) => (
              <div
                key={kitten.id}
                className="cat-card min-w-[340px] md:min-w-0 snap-center bg-white rounded-[20px] shadow-[0_15px_30px_-10px_rgba(0,40,40,0.12)] overflow-hidden transition hover:-translate-y-2 hover:shadow-[0_25px_40px_-12px_rgba(0,40,40,0.2)] relative group flex flex-col md:flex-row opacity-0 translate-y-10 transition-all duration-500 visible:opacity-100 visible:translate-y-0"
                style={{ transitionDelay: `${idx * 100}ms` }}
                // Instead of IntersectionObserver, we'll add the `visible` class using AOS or an effect
                data-aos="fade-up"
                data-aos-delay={idx * 100}
              >
                {/* Image container */}
                <div
                  className="relative w-full md:w-2/5 aspect-[4/3] md:aspect-auto cursor-pointer overflow-hidden"
                  onClick={() => openZoom(kitten.img)}
                >
                  <img
                    src={kitten.img}
                    alt={kitten.name}
                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => { e.target.src = 'https://placekitten.com/600/400'; }}
                  />
                  {kitten.soldOut && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                      Sold Out
                    </div>
                  )}
                  {/* Wishlist Heart (top right) */}
                  <button
                    className="wishlist-heart absolute top-3 right-3 w-9 h-9 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-lg shadow-md transition hover:scale-110"
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
                          : 'far fa-heart'
                      }
                    ></i>
                  </button>
                </div>

                {/* Details */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-[#0f2a2f] leading-tight mb-1">{kitten.name}</h3>
                    <p className="text-xs text-[#5f6e73] mb-1">{kitten.point} • {kitten.sex}</p>
                    <p className="text-sm text-[#2a6b6b] font-medium mb-2">
                      <i className="far fa-calendar-alt mr-1"></i> Age: {kitten.age}
                    </p>
                    <p className="text-sm text-[#5f6e73] leading-relaxed line-clamp-2">{kitten.description}</p>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-2xl font-bold text-[#2a6b6b]">${kitten.price.toLocaleString()}</span>
                    {kitten.soldOut ? (
                      <button className="bg-gray-300 text-gray-500 px-5 py-2.5 rounded-full text-sm font-semibold cursor-not-allowed flex items-center gap-1" disabled>
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
                        className="bg-[#2a6b6b] text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-[#1b5353] transition flex items-center gap-1"
                      >
                        <i className="fas fa-cart-plus"></i> Add to Cart
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== VIDEO GALLERY ========== */}
      <section id="video-section" className="max-w-[1200px] mx-auto my-16 px-8">
        <div className="text-center mb-10">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-[#2a6b6b] bg-[#d4f0f0] py-1.5 px-6 rounded-[40px] mb-4">
            WATCH THEM PLAY
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-[#0f2a2f] mb-3">Ragdolls in Action</h2>
          <p className="text-[#5f6e73] max-w-xl mx-auto">See their gentle nature and playful spirit come alive.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {videos.map((video, i) => (
            <div key={i} className="video-card relative group rounded-2xl overflow-hidden shadow-lg">
              <video
                className="w-full aspect-video object-cover"
                controls
                muted
                loop
                playsInline
                poster={video.poster}
              >
                <source src={video.src} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <div className="video-overlay absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="video-title text-white font-semibold">{video.title}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========== ZOOM MODAL ========== */}
      {zoomSrc && (
        <div
          className="fixed inset-0 bg-black/90 z-[10000] flex items-center justify-center p-8"
          onClick={closeZoom}
        >
          <span className="absolute top-6 right-6 text-white text-4xl cursor-pointer hover:text-gray-300 z-10" onClick={closeZoom}>
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
        <div className="fixed bottom-6 right-6 bg-white border-l-4 border-[#2a6b6b] rounded-xl shadow-2xl p-4 flex items-center gap-3 z-50 animate-slide-in">
          <i className="fas fa-check-circle text-[#2a6b6b] text-xl"></i>
          <span className="font-medium text-sm">{notification}</span>
        </div>
      )}
    </div>
  );
};

export default Ragdoll;