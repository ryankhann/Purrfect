import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Story = () => {
  useEffect(() => { AOS.init({ duration: 800, once: true }); }, []);

  return (
    <div className="font-sans bg-[#faf8f6] text-[#0f2a2f]">
      {/* Hero */}
      <section className="relative h-[60vh] bg-fixed bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')` }}>
        <div className="absolute inset-0 bg-[#0f2a2f]/70" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4">
          <h1 className="font-['Playfair_Display'] text-5xl md:text-7xl font-bold mb-4" data-aos="fade-down">Our Story</h1>
          <p className="text-lg max-w-2xl opacity-90" data-aos="fade-up">From a single rescued kitten to a world-class cattery – a journey of love, dedication, and purrs.</p>
        </div>
      </section>

      {/* Timeline Section */}
      <div className="max-w-5xl mx-auto px-4 py-20">
        <div className="space-y-16">
          {[
            { year: '2010', title: 'The Beginning', text: 'It all started when our founder rescued a tiny Maine Coon kitten, “Max”, from a shelter. That moment sparked a lifelong passion for preserving and improving pedigree cats.' },
            { year: '2013', title: 'First Litter', text: 'After years of study and mentorship under TICA breeders, our first pedigree Maine Coon litter was born – five healthy, champion‑sired kittens.' },
            { year: '2016', title: 'Expanding the Family', text: 'We added Persian and Siamese lines, and built a state‑of‑the‑art cattery with natural light, climbing walls, and 24/7 care.' },
            { year: '2020', title: 'Purrfect Name', text: 'Officially registered as “Purrfect Cattery”, we became a recognised TICA breeder and launched our online adoption portal.' },
            { year: '2025', title: '500+ Happy Families', text: 'Over 500 kittens placed in loving homes worldwide, with a 100% health guarantee and countless five‑star reviews.' },
          ].map((item, i) => (
            <div key={i} className={`flex flex-col md:flex-row gap-8 items-center ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}`} data-aos="fade-up" data-aos-delay={i * 100}>
              <div className="w-full md:w-1/3 text-center md:text-right">
                <span className="text-6xl font-bold font-['Playfair_Display'] text-[#2a6b6b]">{item.year}</span>
              </div>
              <div className="w-full md:w-2/3 bg-white p-6 rounded-2xl shadow-lg border border-[#d4f0f0]">
                <h3 className="text-2xl font-bold font-['Playfair_Display'] text-[#0f2a2f] mb-2">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-[#0f2a2f] to-[#2a6b6b] py-16 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">Be Part of Our Story</h2>
        <Link to="/kittens/available" className="inline-block bg-white text-[#0f2a2f] px-8 py-3 rounded-full font-semibold hover:bg-[#d4f0f0] transition">
          Find Your Kitten
        </Link>
      </div>
    </div>
  );
};

export default Story;