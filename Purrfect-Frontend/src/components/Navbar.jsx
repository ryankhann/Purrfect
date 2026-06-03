import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 

const Navbar = () => {
  const { user, logout } = useAuth();

  // Mobile menu state
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openMobileDropdown, setOpenMobileDropdown] = useState(null);

  // Cart & wishlist counters
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  // Logout modal state
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const mobileMenuRef = useRef(null);
  const hamburgerRef = useRef(null);

  // Update counts from localStorage
  const updateCounts = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const totalCart = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    setCartCount(totalCart);
    setWishlistCount(wishlist.length);
  };

  useEffect(() => {
    updateCounts();
    const handleStorage = (e) => {
      if (e.key === 'cart' || e.key === 'wishlist') updateCounts();
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Mobile menu outside click & resize
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        hamburgerRef.current &&
        !hamburgerRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    };
    const handleResize = () => {
      if (window.innerWidth > 880) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    window.addEventListener('resize', handleResize);
    return () => {
      document.removeEventListener('click', handleClickOutside);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Mobile dropdown toggle
  const handleMobileDropdown = (dropdownId) => {
    setOpenMobileDropdown((prev) => (prev === dropdownId ? null : dropdownId));
  };

  // Wishlist alert (temporary)
  const openWishlist = () => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    alert(`💝 You have ${wishlist.length} items in your wishlist`);
  };

  // Common classes
  const navLinkDesktop =
    'flex items-center gap-1 px-5 py-2 rounded-full text-lg font-medium text-[#0f2a2f] hover:bg-[#e9e7e4] hover:border-[#d4f0f0] border border-transparent transition-all duration-300 hover:-translate-y-0.5';
  const dropdownLinkClass =
    'block py-2 px-8 border-l-4 border-transparent hover:bg-[#d4f0f0] hover:border-l-[#2a6b6b] hover:pl-10 transition-all duration-300 text-[#0f2a2f] no-underline';

  return (
    <>
      {/* TOP ADVERTISEMENT */}
      <section className="h-[10vh] flex items-center justify-center bg-gradient-to-r from-[#0b2a2f] to-[#1a4045] text-[#e1f2f0] uppercase tracking-[0.8px] text-sm sm:text-base border-b border-white/10">
        <span className="border-b border-dashed border-[#d4f0f0] pb-1 animate-glow">
          FREE HEALTH CERTIFICATE WITH EVERY KITTEN • WORLDWIDE DELIVERY
        </span>
      </section>

      {/* MAIN NAVBAR */}
      <section className="sticky top-0 z-[1000] bg-white shadow-[0_12px_28px_-10px_rgba(0,40,40,0.12)] hover:shadow-[0_20px_35px_-12px_rgba(0,60,60,0.2)] transition-shadow duration-300">
        <nav className="flex items-center justify-between max-w-screen-xl mx-auto px-4 sm:px-8 py-3">
          {/* BRAND */}
          <div className="flex items-center gap-3">
            <i className="fas fa-cat text-3xl sm:text-4xl text-[#2a6b6b] hover:scale-110 hover:-rotate-6 transition-transform duration-300 cursor-pointer"></i>
            <Link
              to="/"
              className="text-2xl sm:text-3xl font-medium tracking-tight text-[#0f2a2f] border-l-2 border-[#d4f0f0] pl-4 no-underline"
            >
              Purrfect
            </Link>
          </div>

          {/* DESKTOP NAV */}
          <ul className="hidden lg:flex gap-2">
            {/* Breeds */}
            <li className="relative group">
              <a href="#" className={navLinkDesktop}>
                Breeds <i className="fas fa-chevron-down text-xs transition-transform duration-200 group-hover:rotate-180"></i>
              </a>
              <ul className="absolute top-full left-0 min-w-[240px] bg-white rounded-2xl py-3 shadow-2xl border border-[#d4f0f0] opacity-0 invisible translate-y-4 group-hover:opacity-100 group-hover:visible group-hover:translate-y-2 transition-all duration-300">
                <li><Link to="/breeds/persian" className={dropdownLinkClass}>Persian</Link></li>
                <li><Link to="/breeds/maine-coon" className={dropdownLinkClass}>Maine Coon</Link></li>
                <li><Link to="/breeds/bengal" className={dropdownLinkClass}>Bengal</Link></li>
                <li><Link to="/breeds/siamese" className={dropdownLinkClass}>Siamese</Link></li>
                <li><Link to="/breeds/ragdoll" className={dropdownLinkClass}>Ragdoll</Link></li>
                <li><Link to="/breeds/british-shorthair" className={dropdownLinkClass}>British Shorthair</Link></li>
              </ul>
            </li>
            {/* Kittens */}
            <li className="relative group">
              <a href="#" className={navLinkDesktop}>
                Kittens <i className="fas fa-chevron-down text-xs transition-transform duration-200 group-hover:rotate-180"></i>
              </a>
              <ul className="absolute top-full left-0 min-w-[240px] bg-white rounded-2xl py-3 shadow-2xl border border-[#d4f0f0] opacity-0 invisible translate-y-4 group-hover:opacity-100 group-hover:visible group-hover:translate-y-2 transition-all duration-300">
                <li><Link to="/kittens/available" className={dropdownLinkClass}>Available Now</Link></li>
                <li><Link to="/kittens/upcoming-litters" className={dropdownLinkClass}>Upcoming Litters</Link></li>
                <li><Link to="/kittens/reservation" className={dropdownLinkClass}>Reservation</Link></li>
                <li><Link to="/kittens/health-guarantee" className={dropdownLinkClass}>Health Guarantee</Link></li>
              </ul>
            </li>
            {/* Nutrition */}
            <li className="relative group">
              <a href="#" className={navLinkDesktop}>
                Nutrition <i className="fas fa-chevron-down text-xs transition-transform duration-200 group-hover:rotate-180"></i>
              </a>
              <ul className="absolute top-full left-0 min-w-[240px] bg-white rounded-2xl py-3 shadow-2xl border border-[#d4f0f0] opacity-0 invisible translate-y-4 group-hover:opacity-100 group-hover:visible group-hover:translate-y-2 transition-all duration-300">
                <li><Link to="/nutrition/food" className={dropdownLinkClass}>Premium Food</Link></li>
                <li><Link to="/nutrition/supplements" className={dropdownLinkClass}>Supplements</Link></li>
                <li><Link to="/nutrition/treats" className={dropdownLinkClass}>Treats</Link></li>
                <li><Link to="/nutrition/diet-plans" className={dropdownLinkClass}>Diet Plans</Link></li>
              </ul>
            </li>
            {/* Accessories */}
            <li className="relative group">
              <a href="#" className={navLinkDesktop}>
                Accessories <i className="fas fa-chevron-down text-xs transition-transform duration-200 group-hover:rotate-180"></i>
              </a>
              <ul className="absolute top-full left-0 min-w-[240px] bg-white rounded-2xl py-3 shadow-2xl border border-[#d4f0f0] opacity-0 invisible translate-y-4 group-hover:opacity-100 group-hover:visible group-hover:translate-y-2 transition-all duration-300">
                <li><Link to="/accessories/beds" className={dropdownLinkClass}>Beds & Furniture</Link></li>
                <li><Link to="/accessories/collars" className={dropdownLinkClass}>Collars & Leashes</Link></li>
                <li><Link to="/accessories/grooming" className={dropdownLinkClass}>Grooming</Link></li>
                <li><Link to="/accessories/toys" className={dropdownLinkClass}>Toys</Link></li>
              </ul>
            </li>
            {/* About */}
            <li className="relative group">
              <a href="#" className={navLinkDesktop}>
                About <i className="fas fa-chevron-down text-xs transition-transform duration-200 group-hover:rotate-180"></i>
              </a>
              <ul className="absolute top-full left-0 min-w-[240px] bg-white rounded-2xl py-3 shadow-2xl border border-[#d4f0f0] opacity-0 invisible translate-y-4 group-hover:opacity-100 group-hover:visible group-hover:translate-y-2 transition-all duration-300">
                <li><Link to="/about/story" className={dropdownLinkClass}>Our Story</Link></li>
                <li><Link to="/about/cattery" className={dropdownLinkClass}>Cattery</Link></li>
                <li><Link to="/about/testimonials" className={dropdownLinkClass}>Testimonials</Link></li>
                <li><Link to="/about/contact" className={dropdownLinkClass}>Contact</Link></li>
              </ul>
            </li>
          </ul>

          {/* RIGHT SIDE: ICONS + HAMBURGER */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-5">
              {/* Wishlist */}
              <Link
                to="/wishlist"
                className="relative text-2xl sm:text-3xl text-[#0f2a2f] hover:text-[#2a6b6b] hover:scale-115 hover:-translate-y-0.5 transition-all duration-300"
              >
                <i className="far fa-heart"></i>
                <span className="absolute -top-2 -right-3 bg-[#2a6b6b] text-white text-xs font-semibold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                  {wishlistCount}
                </span>
              </Link>
              {/* Cart */}
              <Link
                to="/cart"
                className="relative text-2xl sm:text-3xl text-[#0f2a2f] hover:text-[#2a6b6b] hover:scale-115 hover:-translate-y-0.5 transition-all duration-300"
              >
                <i className="fas fa-shopping-cart"></i>
                <span className="absolute -top-2 -right-3 bg-[#2a6b6b] text-white text-xs font-semibold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                  {cartCount}
                </span>
              </Link>

              {/* Account Icon: logged in vs. logged out */}
              {user ? (
                <button
                  onClick={() => setShowLogoutModal(true)}
                  className="relative text-2xl sm:text-3xl text-green-600 hover:text-green-700 hover:scale-115 hover:-translate-y-0.5 transition-all duration-300"
                  title={user.name}
                >
                  <i className="fas fa-user-check"></i>
                  <span className="absolute -top-1 -right-1 text-xs text-green-700">✓</span>
                </button>
              ) : (
                <Link
                  to="/account"
                  className="text-2xl sm:text-3xl text-[#0f2a2f] hover:text-[#2a6b6b] hover:scale-115 hover:-translate-y-0.5 transition-all duration-300"
                >
                  <i className="far fa-user"></i>
                </Link>
              )}
            </div>

            {/* Hamburger button (visible only on mobile) */}
            <button
              ref={hamburgerRef}
              onClick={(e) => {
                e.stopPropagation();
                setIsMenuOpen(!isMenuOpen);
              }}
              className="lg:hidden border-2 border-[#2a6b6b] text-2xl px-4 py-1 rounded-full text-[#2a6b6b] hover:bg-[#d4f0f0] hover:text-[#0f2a2f] hover:border-[#0f2a2f] hover:rotate-90 transition-all duration-300 ml-2"
            >
              <i className="fas fa-bars"></i>
            </button>
          </div>

          {/* MOBILE MENU */}
          <div
            ref={mobileMenuRef}
            className={`${isMenuOpen ? '' : 'hidden'} lg:hidden absolute top-full left-0 w-full bg-white p-6 shadow-inner border-t-2 border-[#d4f0f0] max-h-[80vh] overflow-y-auto z-50`}
          >
            <ul className="flex flex-col w-full">
              {/* Breeds */}
              <li className="border-b border-[#e9e7e4]">
                <a
                  href="#"
                  onClick={(e) => { e.preventDefault(); handleMobileDropdown('breeds-mobile'); }}
                  className="flex items-center justify-between py-3 px-2 text-xl font-medium text-[#0f2a2f] hover:bg-[#e9e7e4] hover:pl-3 transition-all no-underline"
                >
                  Breeds <i className={`fas fa-chevron-down transition-transform duration-300 ${openMobileDropdown === 'breeds-mobile' ? 'rotate-180' : ''}`}></i>
                </a>
                <ul className={`ml-4 my-2 bg-[#d4f0f0] rounded-2xl py-1 ${openMobileDropdown === 'breeds-mobile' ? '' : 'hidden'}`}>
                  <li><Link to="/breeds/persian" className="block py-2 px-6 text-[#0f2a2f] hover:bg-white hover:pl-8 transition-all no-underline">Persian</Link></li>
                  <li><Link to="/breeds/maine-coon" className="block py-2 px-6 text-[#0f2a2f] hover:bg-white hover:pl-8 transition-all no-underline">Maine Coon</Link></li>
                  <li><Link to="/breeds/bengal" className="block py-2 px-6 text-[#0f2a2f] hover:bg-white hover:pl-8 transition-all no-underline">Bengal</Link></li>
                  <li><Link to="/breeds/siamese" className="block py-2 px-6 text-[#0f2a2f] hover:bg-white hover:pl-8 transition-all no-underline">Siamese</Link></li>
                  <li><Link to="/breeds/ragdoll" className="block py-2 px-6 text-[#0f2a2f] hover:bg-white hover:pl-8 transition-all no-underline">Ragdoll</Link></li>
                  <li><Link to="/breeds/british-shorthair" className="block py-2 px-6 text-[#0f2a2f] hover:bg-white hover:pl-8 transition-all no-underline">British Shorthair</Link></li>
                </ul>
              </li>
              {/* Kittens */}
              <li className="border-b border-[#e9e7e4]">
                <a
                  href="#"
                  onClick={(e) => { e.preventDefault(); handleMobileDropdown('kittens-mobile'); }}
                  className="flex items-center justify-between py-3 px-2 text-xl font-medium text-[#0f2a2f] hover:bg-[#e9e7e4] hover:pl-3 transition-all no-underline"
                >
                  Kittens <i className={`fas fa-chevron-down transition-transform duration-300 ${openMobileDropdown === 'kittens-mobile' ? 'rotate-180' : ''}`}></i>
                </a>
                <ul className={`ml-4 my-2 bg-[#d4f0f0] rounded-2xl py-1 ${openMobileDropdown === 'kittens-mobile' ? '' : 'hidden'}`}>
                  <li><Link to="/kittens/available" className="block py-2 px-6 text-[#0f2a2f] hover:bg-white hover:pl-8 transition-all no-underline">Available Now</Link></li>
                  <li><Link to="/kittens/upcoming-litters" className="block py-2 px-6 text-[#0f2a2f] hover:bg-white hover:pl-8 transition-all no-underline">Upcoming Litters</Link></li>
                  <li><Link to="/kittens/reservation" className="block py-2 px-6 text-[#0f2a2f] hover:bg-white hover:pl-8 transition-all no-underline">Reservation</Link></li>
                  <li><Link to="/kittens/health-guarantee" className="block py-2 px-6 text-[#0f2a2f] hover:bg-white hover:pl-8 transition-all no-underline">Health Guarantee</Link></li>
                </ul>
              </li>
              {/* Nutrition */}
              <li className="border-b border-[#e9e7e4]">
                <a
                  href="#"
                  onClick={(e) => { e.preventDefault(); handleMobileDropdown('nutrition-mobile'); }}
                  className="flex items-center justify-between py-3 px-2 text-xl font-medium text-[#0f2a2f] hover:bg-[#e9e7e4] hover:pl-3 transition-all no-underline"
                >
                  Nutrition <i className={`fas fa-chevron-down transition-transform duration-300 ${openMobileDropdown === 'nutrition-mobile' ? 'rotate-180' : ''}`}></i>
                </a>
                <ul className={`ml-4 my-2 bg-[#d4f0f0] rounded-2xl py-1 ${openMobileDropdown === 'nutrition-mobile' ? '' : 'hidden'}`}>
                  <li><Link to="/nutrition/food" className="block py-2 px-6 text-[#0f2a2f] hover:bg-white hover:pl-8 transition-all no-underline">Premium Food</Link></li>
                  <li><Link to="/nutrition/supplements" className="block py-2 px-6 text-[#0f2a2f] hover:bg-white hover:pl-8 transition-all no-underline">Supplements</Link></li>
                  <li><Link to="/nutrition/treats" className="block py-2 px-6 text-[#0f2a2f] hover:bg-white hover:pl-8 transition-all no-underline">Treats</Link></li>
                  <li><Link to="/nutrition/diet-plans" className="block py-2 px-6 text-[#0f2a2f] hover:bg-white hover:pl-8 transition-all no-underline">Diet Plans</Link></li>
                </ul>
              </li>
              {/* Accessories */}
              <li className="border-b border-[#e9e7e4]">
                <a
                  href="#"
                  onClick={(e) => { e.preventDefault(); handleMobileDropdown('accessories-mobile'); }}
                  className="flex items-center justify-between py-3 px-2 text-xl font-medium text-[#0f2a2f] hover:bg-[#e9e7e4] hover:pl-3 transition-all no-underline"
                >
                  Accessories <i className={`fas fa-chevron-down transition-transform duration-300 ${openMobileDropdown === 'accessories-mobile' ? 'rotate-180' : ''}`}></i>
                </a>
                <ul className={`ml-4 my-2 bg-[#d4f0f0] rounded-2xl py-1 ${openMobileDropdown === 'accessories-mobile' ? '' : 'hidden'}`}>
                  <li><Link to="/accessories/beds" className="block py-2 px-6 text-[#0f2a2f] hover:bg-white hover:pl-8 transition-all no-underline">Beds & Furniture</Link></li>
                  <li><Link to="/accessories/collars" className="block py-2 px-6 text-[#0f2a2f] hover:bg-white hover:pl-8 transition-all no-underline">Collars & Leashes</Link></li>
                  <li><Link to="/accessories/grooming" className="block py-2 px-6 text-[#0f2a2f] hover:bg-white hover:pl-8 transition-all no-underline">Grooming</Link></li>
                  <li><Link to="/accessories/toys" className="block py-2 px-6 text-[#0f2a2f] hover:bg-white hover:pl-8 transition-all no-underline">Toys</Link></li>
                </ul>
              </li>
              {/* About */}
              <li className="border-b border-[#e9e7e4]">
                <a
                  href="#"
                  onClick={(e) => { e.preventDefault(); handleMobileDropdown('about-mobile'); }}
                  className="flex items-center justify-between py-3 px-2 text-xl font-medium text-[#0f2a2f] hover:bg-[#e9e7e4] hover:pl-3 transition-all no-underline"
                >
                  About <i className={`fas fa-chevron-down transition-transform duration-300 ${openMobileDropdown === 'about-mobile' ? 'rotate-180' : ''}`}></i>
                </a>
                <ul className={`ml-4 my-2 bg-[#d4f0f0] rounded-2xl py-1 ${openMobileDropdown === 'about-mobile' ? '' : 'hidden'}`}>
                  <li><Link to="/about/story" className="block py-2 px-6 text-[#0f2a2f] hover:bg-white hover:pl-8 transition-all no-underline">Our Story</Link></li>
                  <li><Link to="/about/cattery" className="block py-2 px-6 text-[#0f2a2f] hover:bg-white hover:pl-8 transition-all no-underline">Cattery</Link></li>
                  <li><Link to="/about/testimonials" className="block py-2 px-6 text-[#0f2a2f] hover:bg-white hover:pl-8 transition-all no-underline">Testimonials</Link></li>
                  <li><Link to="/about/contact" className="block py-2 px-6 text-[#0f2a2f] hover:bg-white hover:pl-8 transition-all no-underline">Contact</Link></li>
                </ul>
              </li>
            </ul>
          </div>
        </nav>
      </section>

      {/* LOGOUT MODAL */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[10001] flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 shadow-2xl text-center max-w-sm">
            <i className="fas fa-sign-out-alt text-4xl text-[#2a6b6b] mb-4"></i>
            <h3 className="text-lg font-bold mb-2">Log out?</h3>
            <p className="text-gray-500 mb-6">Are you sure you want to log out?</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition"
              >
                No
              </button>
              <button
                onClick={() => {
                  logout();
                  setShowLogoutModal(false);
                }}
                className="flex-1 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition"
              >
                Yes, Log out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;