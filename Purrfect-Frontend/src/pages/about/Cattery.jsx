import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const images = [
  'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1574158622682-e40e69881006?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1533743983669-94fa5c4338ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1560114928-40f1f1eb26a0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  '/images/persian/Persian-3.png',
];

const features = [
  { icon: 'fa-home', title: 'Indoor Paradise', desc: '2,000 sq. ft. of climate‑controlled space with climbing trees and napping nooks.' },
  { icon: 'fa-heartbeat', title: '24/7 Care', desc: 'On‑site veterinary nurse and daily health monitoring.' },
  { icon: 'fa-sun', title: 'Natural Light', desc: 'Floor‑to‑ceiling windows, secure outdoor catios.' },
  { icon: 'fa-shield-alt', title: 'Biosecurity', desc: 'Strict hygiene protocols and vaccinated only access.' },
];

const Cattery = () => {
  useEffect(() => { AOS.init({ duration: 800, once: true }); }, []);

  return (
    <div className="font-sans bg-[#faf8f6] text-[#0f2a2f]">
      <section className="relative bg-gradient-to-br from-[#0f2a2f] to-[#2a6b6b] text-white py-20 text-center">
        <h1 className="font-['Playfair_Display'] text-5xl md:text-6xl font-bold mb-4">Our Cattery</h1>
        <p className="text-lg opacity-90 max-w-xl mx-auto">A five‑star retreat designed around feline happiness and health.</p>
      </section>

      {/* Gallery */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4" data-aos="fade-up">
          {images.map((src, i) => (
            <div key={i} className="relative rounded-2xl overflow-hidden aspect-square group cursor-pointer">
              <img src={src} alt={`Cattery ${i+1}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-[#0f2a2f]/0 group-hover:bg-[#0f2a2f]/20 transition-colors" />
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="max-w-5xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((f, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-lg p-6 flex gap-4 items-start" data-aos="fade-up" data-aos-delay={i*100}>
              <div className="w-12 h-12 bg-[#d4f0f0] rounded-xl flex items-center justify-center text-[#2a6b6b] text-2xl">
                <i className={`fas ${f.icon}`}></i>
              </div>
              <div>
                <h3 className="font-bold text-xl mb-1">{f.title}</h3>
                <p className="text-gray-600">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="bg-[#0f2a2f] text-white py-16">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { num: '15+', label: 'Years Experience' },
            { num: '6', label: 'Premium Breeds' },
            { num: '500+', label: 'Happy Kittens' },
            { num: '100%', label: 'Health Guarantee' },
          ].map((s, i) => (
            <div key={i} data-aos="zoom-in" data-aos-delay={i*100}>
              <div className="text-4xl font-bold font-['Playfair_Display'] text-[#d4f0f0]">{s.num}</div>
              <div className="text-sm opacity-80 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Cattery;