import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Home = () => {
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [cursorHover, setCursorHover] = useState(false);
  const [scrollPercent, setScrollPercent] = useState(0);
  const [notification, setNotification] = useState({ show: false, message: '' });
  const videoRefs = useRef([]);
  const notificationTimer = useRef(null);

  // --- AOS init ---
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      offset: 80,
    });
  }, []);

  // --- Custom cursor ---
  useEffect(() => {
    const move = (e) => setCursorPos({ x: e.clientX - 10, y: e.clientY - 10 });
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  useEffect(() => {
    const addHover = () => setCursorHover(true);
    const removeHover = () => setCursorHover(false);
    const elements = document.querySelectorAll('a, button, .breed-card, .video-card, .ad-card');
    elements.forEach(el => {
      el.addEventListener('mouseenter', addHover);
      el.addEventListener('mouseleave', removeHover);
    });
    return () => {
      elements.forEach(el => {
        el.removeEventListener('mouseenter', addHover);
        el.removeEventListener('mouseleave', removeHover);
      });
    };
  }, [cursorHover]); // re-attach if DOM changes

  // --- Scroll progress ---
  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      setScrollPercent((winScroll / height) * 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- Notification ---
  const showNotification = (msg) => {
    setNotification({ show: true, message: msg });
    if (notificationTimer.current) clearTimeout(notificationTimer.current);
    notificationTimer.current = setTimeout(() => {
      setNotification({ show: false, message: '' });
    }, 3000);
  };

  // --- Video play/pause ---
  const toggleVideo = (index) => {
    const video = videoRefs.current[index];
    if (!video) return;
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  };

  const handleVideoMouseEnter = (index) => {
    const video = videoRefs.current[index];
    if (video && video.paused) video.play();
  };

  const handleVideoMouseLeave = (index) => {
    const video = videoRefs.current[index];
    if (video && !video.paused) {
      video.pause();
    }
  };

  // --- Newsletter submit ---
  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    if (email) {
      showNotification('Thank you for subscribing! 🎉');
      e.target.reset();
    }
  };

  // --- Smooth scroll for anchor links (Hero CTA) ---
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Welcome notification on mount
  useEffect(() => {
    const timer = setTimeout(() => showNotification('Welcome to Purrfect! 🐱'), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* ===== CUSTOM CURSOR ===== */}
      <div
        className={`hidden md:block fixed pointer-events-none z-[9999] w-5 h-5 border-2 border-[#2a6b6b] rounded-full mix-blend-difference transition-transform duration-200 ${
          cursorHover ? 'scale-150 bg-[#2a6b6b]' : ''
        }`}
        style={{ transform: `translate(${cursorPos.x}px, ${cursorPos.y}px)` }}
      />

      {/* ===== SCROLL PROGRESS BAR ===== */}
      <div
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-[#2a6b6b] via-[#d4f0f0] via-[#ffd700] to-[#2a6b6b] z-[9998] shadow-[0_0_15px_rgba(42,107,107,0.5)]"
        style={{ width: `${scrollPercent}%` }}
      />

      {/* ===== HERO SECTION ===== */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <video
          className="absolute top-0 left-0 w-full h-full object-cover z-0 brightness-50 saturate-125 animate-slowZoom"
          autoPlay
          muted
          loop
          playsInline
          src="/videos/cat.mp4"
        />
        <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(15,42,47,0.8)_100%)]" />

        <div className="relative z-20 text-center text-white max-w-4xl px-8" data-aos="fade-up" data-aos-duration="1500">
          <h1 className="font-['Playfair_Display'] text-4xl sm:text-5xl md:text-6xl font-bold mb-4 animate-titleGlow leading-tight">
            Discover Your Perfect Feline Companion
          </h1>
          <p className="text-lg font-light tracking-[0.2em] uppercase mb-6 opacity-90">
            Premium Breeder Since 2010
          </p>
          <div className="flex gap-4 justify-center mt-8 max-sm:flex-col">
            <button
              onClick={() => scrollToSection('featured')}
              className="relative overflow-hidden px-8 py-3 rounded-full font-semibold bg-[#2a6b6b] text-white shadow-[0_8px_20px_rgba(42,107,107,0.4)] hover:bg-[#1b5353] hover:-translate-y-1 hover:shadow-[0_15px_30px_rgba(42,107,107,0.6)] transition-all duration-300 before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:w-0 before:h-0 before:rounded-full before:bg-white/30 before:-translate-x-1/2 before:-translate-y-1/2 before:transition-all before:duration-500 hover:before:w-[250px] hover:before:h-[250px]"
            >
              <i className="fas fa-paw"></i> Explore Breeds
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="relative overflow-hidden px-8 py-3 rounded-full font-semibold bg-white/10 backdrop-blur-md text-white border border-white/30 hover:bg-white/20 hover:-translate-y-1 hover:border-white transition-all duration-300 before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:w-0 before:h-0 before:rounded-full before:bg-white/30 before:-translate-x-1/2 before:-translate-y-1/2 before:transition-all before:duration-500 hover:before:w-[250px] hover:before:h-[250px]"
            >
              <i className="fas fa-calendar"></i> Schedule Visit
            </button>
          </div>
        </div>

        {/* Floating stats */}
        <div className="absolute bottom-20 right-10 z-20 hidden md:flex gap-6" data-aos="fade-left" data-aos-delay="500">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 text-white border border-white/20 animate-floatStat">
            <div className="text-3xl font-extrabold">500+</div>
            <div className="text-sm opacity-80">Happy Kittens</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 text-white border border-white/20 animate-floatStat" style={{ animationDelay: '0.5s' }}>
            <div className="text-3xl font-extrabold">15</div>
            <div className="text-sm opacity-80">Premium Breeds</div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounceArrow">
          <i className="fas fa-chevron-down text-white text-2xl drop-shadow-lg"></i>
        </div>
      </section>

      {/* ===== FEATURED BREEDS SECTION ===== */}
      <section id="featured" className="max-w-6xl mx-auto my-20 px-6">
        <div className="text-center mb-12" data-aos="fade-up">
          <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-[#2a6b6b] bg-[#d4f0f0] px-6 py-1.5 rounded-full mb-4 animate-tagPulse">
            PURRfect companions
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#0f2a2f] relative inline-block">
            Featured Breeds
            <span className="block absolute -bottom-2 left-1/2 -translate-x-1/2 w-[70px] h-0.5 bg-gradient-to-r from-transparent via-[#2a6b6b] via-[#d4f0f0] to-transparent rounded-sm" />
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { name: 'Ragdoll', desc: 'Gentle giants with striking blue eyes and silky fur', img: '/images/Ragdoll.jpg', link: '/breeds/ragdoll' },
            { name: 'Maine Coon', desc: "America's native longhair, known for their size and friendly nature", img: '/images/MaineCoon.png', link: '/breeds/maine-coon' },
            { name: 'Bengal', desc: 'Exotic spotted coat with an energetic, playful personality', img: '/images/Bengal.png', link: '/breeds/bengal' },
            { name: 'Persian', desc: 'Luxurious long coat and sweet, gentle temperament', img: '/images/persian.jpg', link: '/breeds/persian' },
            { name: 'Siamese', desc: 'Elegant, vocal, and deeply affectionate companions', img: '/images/Siamese.png', link: '/breeds/siamese' },
            { name: 'British Shorthair', desc: 'Plush coat, round face, and calm dignified demeanor', img: '/images/BritishShortHair.png', link: '/breeds/british-shorthair' },
          ].map((breed, i) => (
            <div
              key={breed.name}
              className="breed-card relative h-[400px] rounded-3xl overflow-hidden cursor-pointer group shadow-[0_15px_30px_-8px_rgba(0,40,40,0.2)] hover:-translate-y-4 hover:scale-[1.02] hover:shadow-[0_30px_45px_-10px_rgba(42,107,107,0.4)] transition-all duration-500"
              data-aos="fade-up"
              data-aos-delay={100 * (i + 1)}
            >
              <img src={breed.img} alt={breed.name} className="w-full h-full object-cover transition-transform duration-800 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(15,42,47,0.9)] via-transparent to-black/20 flex flex-col justify-end p-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <h3 className="text-3xl font-bold mb-1 translate-y-5 group-hover:translate-y-0 transition-transform duration-500">{breed.name}</h3>
                <p className="text-sm opacity-80 mb-4 leading-relaxed translate-y-5 group-hover:translate-y-0 transition-transform duration-500 delay-100">{breed.desc}</p>
                <Link
                  to={breed.link}
                  className="inline-flex items-center gap-2 text-white font-semibold px-6 py-2 bg-white/20 backdrop-blur-md rounded-full w-fit translate-y-5 group-hover:translate-y-0 transition-all duration-500 delay-200 border border-white/30 hover:bg-[#2a6b6b] hover:border-[#2a6b6b]"
                >
                  Meet the Breed <i className="fas fa-arrow-right"></i>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== VIDEO SHOWCASE SECTION ===== */}
      <section className="max-w-6xl mx-auto my-20 px-6">
        <div className="text-center mb-12" data-aos="fade-up">
          <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-[#2a6b6b] bg-[#d4f0f0] px-6 py-1.5 rounded-full mb-4 animate-tagPulse">IN ACTION</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#0f2a2f] relative inline-block">
            Cats in Their Element
            <span className="block absolute -bottom-2 left-1/2 -translate-x-1/2 w-[70px] h-0.5 bg-gradient-to-r from-transparent via-[#2a6b6b] via-[#d4f0f0] to-transparent rounded-sm" />
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { src: '/videos/PlayfulCat.mp4', title: 'Playful Moments' },
            { src: '/videos/CuddleCat.mp4', title: 'Cuddle Time' },
            { src: '/videos/AdventureCat.mp4', title: 'Outdoor Adventure' },
          ].map((vid, idx) => (
            <div
              key={idx}
              className="video-card relative rounded-2xl overflow-hidden aspect-video cursor-pointer group shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)]"
              data-aos="zoom-in"
              data-aos-delay={100 * (idx + 1)}
              onMouseEnter={() => handleVideoMouseEnter(idx)}
              onMouseLeave={() => handleVideoMouseLeave(idx)}
            >
              <video
                ref={(el) => (videoRefs.current[idx] = el)}
                src={vid.src}
                className="w-full h-full object-cover transition-transform duration-800 group-hover:scale-110"
                loop
                muted
                playsInline
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(15,42,47,0.8)] to-transparent flex flex-col justify-end p-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <h3 className="text-lg font-semibold translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{vid.title}</h3>
              </div>
              <button
                onClick={() => toggleVideo(idx)}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border-2 border-white transition-all duration-300 group-hover:scale-110 group-hover:bg-[#2a6b6b]"
              >
                <i className="fas fa-play text-white text-xl ml-1" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ===== ADVERTISEMENT SECTION ===== */}
      <section className="max-w-6xl mx-auto my-20 px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Ad 1 */}
          <div className="ad-card relative h-[300px] rounded-3xl overflow-hidden bg-gradient-to-br from-[#0f2a2f] to-[#1b5353] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.4)] group" data-aos="fade-right" data-aos-delay="100">
            <img src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="New Kittens" className="w-full h-full object-cover opacity-40 transition-all duration-800 group-hover:scale-110 group-hover:opacity-30" />
            <div className="absolute inset-0 p-8 flex flex-col justify-center text-white">
              <span className="inline-block bg-[#ffd700]/20 backdrop-blur-md px-5 py-1.5 rounded-full text-xs font-semibold mb-4 w-fit border border-[#ffd700]/30">🐱 NEW ARRIVALS</span>
              <h3 className="font-['Playfair_Display'] text-3xl font-bold mb-3">Spring Kittens Are Here!</h3>
              <p className="text-sm opacity-90 mb-6 leading-relaxed">Meet our adorable new litters - Ragdoll, Maine Coon, and Bengal kittens ready for their forever homes.</p>
              <Link to="/kittens/available" className="inline-flex items-center gap-2 px-8 py-3 bg-white text-[#0f2a2f] font-semibold rounded-full w-fit transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(255,255,255,0.2)]">
                View Available Kittens <i className="fas fa-arrow-right"></i>
              </Link>
            </div>
          </div>

          {/* Ad 2 */}
          <div className="ad-card relative h-[300px] rounded-3xl overflow-hidden bg-gradient-to-br from-[#0f2a2f] to-[#1b5353] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.4)] group" data-aos="fade-left" data-aos-delay="200">
            <img src="/images/RagdollKitten.jpg" alt="Starter Kit" className="w-full h-full object-cover opacity-40 transition-all duration-800 group-hover:scale-110 group-hover:opacity-30" />
            <div className="absolute inset-0 p-8 flex flex-col justify-center text-white">
              <span className="inline-block bg-[#ffd700]/20 backdrop-blur-md px-5 py-1.5 rounded-full text-xs font-semibold mb-4 w-fit border border-[#ffd700]/30">✨ LIMITED OFFER</span>
              <h3 className="font-['Playfair_Display'] text-3xl font-bold mb-3">Starter Kit Included</h3>
              <p className="text-sm opacity-90 mb-4">Free premium starter kit with every kitten adoption - worth $500!</p>
              <ul className="list-none text-sm opacity-90 mb-6 space-y-1">
                <li><i className="fas fa-check-circle text-[#ffd700] mr-2"></i>Luxury cat bed</li>
                <li><i className="fas fa-check-circle text-[#ffd700] mr-2"></i>Premium food (3 months)</li>
                <li><i className="fas fa-check-circle text-[#ffd700] mr-2"></i>Grooming kit</li>
              </ul>
              <a href="#" className="inline-flex items-center gap-2 px-8 py-3 bg-white text-[#0f2a2f] font-semibold rounded-full w-fit transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(255,255,255,0.2)]">
                Learn More <i className="fas fa-arrow-right"></i>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS SECTION ===== */}
      <section className="max-w-6xl mx-auto my-20 px-6">
        <div className="text-center mb-12" data-aos="fade-up">
          <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-[#2a6b6b] bg-[#d4f0f0] px-6 py-1.5 rounded-full mb-4 animate-tagPulse">LOVE STORIES</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#0f2a2f] relative inline-block">
            What Our Families Say
            <span className="block absolute -bottom-2 left-1/2 -translate-x-1/2 w-[70px] h-0.5 bg-gradient-to-r from-transparent via-[#2a6b6b] via-[#d4f0f0] to-transparent rounded-sm" />
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              text: '"We adopted our Ragdoll kitten Luna from Purrfect, and she\'s brought so much joy to our family. The breeder was incredibly knowledgeable and supportive throughout the process."',
              avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
              author: 'Sarah Johnson',
              role: 'Ragdoll Parent',
            },
            {
              text: '"The health guarantee and support we received after adopting our Maine Coon, Oliver, was outstanding. He\'s healthy, happy, and the best cat we could have asked for."',
              avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
              author: 'Michael Chen',
              role: 'Maine Coon Parent',
            },
            {
              text: '"The Bengal kitten we got is absolutely stunning and has such a wonderful personality. The breeder clearly puts love and care into raising these kittens."',
              avatar: 'https://images.unsplash.com/photo-1494790108777-466d85361b51?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
              author: 'Emma Davis',
              role: 'Bengal Parent',
            },
          ].map((testimonial, i) => (
            <div
              key={i}
              className="relative bg-white rounded-2xl p-8 shadow-[0_15px_30px_-8px_rgba(0,40,40,0.1)] hover:-translate-y-2 hover:shadow-[0_20px_40px_-8px_rgba(42,107,107,0.2)] transition-all duration-300 overflow-hidden"
              data-aos="fade-up"
              data-aos-delay={100 * (i + 1)}
            >
              <div className="absolute -top-4 right-4 text-[8rem] font-['Playfair_Display'] text-[#d4f0f0] opacity-30 leading-none select-none">“</div>
              <div className="text-[#ffd700] mb-5 text-lg">
                {[...Array(5)].map((_, j) => <i key={j} className="fas fa-star"></i>)}
              </div>
              <p className="text-sm text-[#5f6e73] leading-relaxed mb-6 relative z-10">{testimonial.text}</p>
              <div className="flex items-center gap-3">
                <img src={testimonial.avatar} alt={testimonial.author} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <h4 className="font-semibold">{testimonial.author}</h4>
                  <p className="text-xs text-[#5f6e73]">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== NEWSLETTER SECTION ===== */}
      <section id="contact" className="max-w-5xl mx-auto my-20 px-6">
        <div className="relative bg-gradient-to-br from-[#0f2a2f] to-[#1b5353] rounded-3xl p-12 overflow-hidden" data-aos="zoom-in">
          <div className="absolute top-0 right-0 w-full h-full opacity-30 bg-radial animate-rotateGradient" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)' }} />
          <div className="relative z-10 text-center text-white max-w-xl mx-auto">
            <h2 className="font-['Playfair_Display'] text-3xl sm:text-4xl mb-4">Join Our Purrfect Family</h2>
            <p className="mb-8 opacity-90 text-sm sm:text-base">Subscribe to receive updates about new litters, special offers, and cat care tips</p>
            <form onSubmit={handleNewsletterSubmit} className="flex max-sm:flex-col gap-2 bg-white/10 backdrop-blur-md p-1 rounded-full border border-white/20">
              <input
                type="email"
                name="email"
                placeholder="Enter your email address"
                required
                className="flex-1 px-6 py-3 bg-transparent text-white placeholder-white/60 outline-none text-sm sm:text-base"
              />
              <button
                type="submit"
                className="px-8 py-3 bg-white text-[#0f2a2f] font-semibold rounded-full hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(0,0,0,0.2)] transition-all duration-300 text-sm sm:text-base"
              >
                Subscribe <i className="fas fa-paw ml-1"></i>
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ===== NOTIFICATION ===== */}
      <div
        className={`fixed top-8 right-8 bg-white border-l-4 border-[#2a6b6b] rounded-lg px-5 py-3 shadow-[0_8px_20px_rgba(0,0,0,0.1)] flex items-center gap-3 z-[9999] transition-transform duration-300 ${
          notification.show ? 'translate-x-0' : 'translate-x-[400px]'
        }`}
      >
        <i className="fas fa-check-circle text-[#2a6b6b] text-xl"></i>
        <span className="text-sm">{notification.message}</span>
      </div>
    </>
  );
};

export default Home;