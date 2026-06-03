import React, { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const testimonials = [
  { name: 'Sarah Johnson', role: 'Ragdoll Parent', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80', text: 'We adopted Luna and she’s the sweetest cat! The entire process was smooth and professional.', stars: 5 },
  { name: 'Michael Chen', role: 'Maine Coon Parent', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80', text: 'Our Maine Coon Oliver is healthy, huge, and has a perfect temperament. Highly recommend Purrfect.', stars: 5 },
  { name: 'Emma Davis', role: 'Bengal Parent', avatar: 'https://images.unsplash.com/photo-1494790108777-466d85361b51?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80', text: 'Stunning Bengal kitten with an incredible personality. The cattery is top‑notch.', stars: 5 },
  { name: 'David Lee', role: 'Persian Parent', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80', text: 'Our Persian kitten is a joy. Purrfect even gave us a grooming guide and starter kit.', stars: 5 },
  { name: 'Olivia Brown', role: 'Siamese Parent', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80', text: 'So talkative and loving! The health guarantee gave us peace of mind.', stars: 5 },
  { name: 'James Wilson', role: 'British Shorthair Parent', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80', text: 'A true gentleman cat. Winston is the perfect addition to our home. Thank you Purrfect!', stars: 5 },
];

const Testimonials = () => {
  useEffect(() => { AOS.init({ duration: 800, once: true }); }, []);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setCurrent(prev => (prev + 1) % testimonials.length), 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="font-sans bg-[#faf8f6] text-[#0f2a2f]">
      <section className="relative bg-gradient-to-br from-[#0f2a2f] to-[#2a6b6b] text-white py-20 text-center">
        <h1 className="font-['Playfair_Display'] text-5xl md:text-6xl font-bold mb-4">Love Stories</h1>
        <p className="text-lg opacity-90 max-w-xl mx-auto">Hear from families who’ve welcomed a Purrfect kitten into their home.</p>
      </section>

      {/* Featured large testimonial (carousel) */}
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 text-center relative overflow-hidden" data-aos="fade-up">
          <div className="absolute top-0 right-0 text-[12rem] font-['Playfair_Display'] text-[#d4f0f0] opacity-30 leading-none">“</div>
          <div className="relative z-10">
            <div className="flex justify-center mb-4 text-[#ffd700] text-xl">
              {[...Array(testimonials[current].stars)].map((_, i) => <i key={i} className="fas fa-star"></i>)}
            </div>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-6">"{testimonials[current].text}"</p>
            <img src={testimonials[current].avatar} alt={testimonials[current].name} className="w-14 h-14 rounded-full mx-auto mb-2 object-cover" />
            <h4 className="font-bold text-lg">{testimonials[current].name}</h4>
            <p className="text-sm text-gray-500">{testimonials[current].role}</p>
          </div>
        </div>
        {/* Dots */}
        <div className="flex justify-center gap-2 mt-6">
          {testimonials.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)} className={`w-3 h-3 rounded-full transition ${i === current ? 'bg-[#2a6b6b]' : 'bg-gray-300'}`} />
          ))}
        </div>
      </div>

      {/* All testimonials grid */}
      <div className="max-w-7xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-md p-6 flex flex-col justify-between" data-aos="fade-up" data-aos-delay={i*50}>
              <div>
                <div className="text-[#ffd700] mb-3">
                  {[...Array(t.stars)].map((_, j) => <i key={j} className="fas fa-star text-sm"></i>)}
                </div>
                <p className="text-gray-600 text-sm mb-4">"{t.text}"</p>
              </div>
              <div className="flex items-center gap-3">
                <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <h4 className="font-semibold text-sm">{t.name}</h4>
                  <p className="text-xs text-gray-500">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;