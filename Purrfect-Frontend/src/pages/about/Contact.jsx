import React, { useState, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  useEffect(() => { AOS.init({ duration: 800, once: true }); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    // In production, POST to API
    setSent(true);
  };

  return (
    <div className="font-sans bg-[#faf8f6] text-[#0f2a2f]">
      <section className="relative bg-gradient-to-br from-[#0f2a2f] to-[#2a6b6b] text-white py-20 text-center">
        <h1 className="font-['Playfair_Display'] text-5xl md:text-6xl font-bold mb-4">Contact Us</h1>
        <p className="text-lg opacity-90 max-w-xl mx-auto">We’d love to hear from you – whether it’s a question about a kitten or just to say meow!</p>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8" data-aos="fade-right">
          {sent ? (
            <div className="text-center py-12">
              <i className="fas fa-check-circle text-6xl text-[#2a6b6b] mb-4"></i>
              <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
              <p className="text-gray-600">We’ll get back to you within 24 hours. 🐾</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold mb-1">Name *</label>
                <input type="text" name="name" required value={form.name} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#2a6b6b]" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Email *</label>
                <input type="email" name="email" required value={form.email} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#2a6b6b]" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Message *</label>
                <textarea name="message" required rows="5" value={form.message} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#2a6b6b]" />
              </div>
              <button type="submit" className="w-full bg-[#2a6b6b] text-white py-3 rounded-xl font-semibold hover:bg-[#1f4a4a] transition">
                Send Message <i className="fas fa-paper-plane ml-1"></i>
              </button>
            </form>
          )}
        </div>

        {/* Info + Map */}
        <div data-aos="fade-left" className="space-y-8">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-xl font-bold mb-4">Get in Touch</h3>
            <div className="space-y-3">
              <p className="flex items-center gap-3 text-gray-600">
                <i className="fas fa-map-marker-alt text-[#2a6b6b] w-6"></i> 123 Purr Lane, Catville, CA 90210
              </p>
              <p className="flex items-center gap-3 text-gray-600">
                <i className="fas fa-phone text-[#2a6b6b] w-6"></i> (555) 123‑4567
              </p>
              <p className="flex items-center gap-3 text-gray-600">
                <i className="fas fa-envelope text-[#2a6b6b] w-6"></i> hello@purrfect.com
              </p>
              <div className="flex gap-4 mt-4">
                <a href="#" className="text-[#2a6b6b] text-xl hover:text-[#1f4a4a]"><i className="fab fa-facebook"></i></a>
                <a href="#" className="text-[#2a6b6b] text-xl hover:text-[#1f4a4a]"><i className="fab fa-instagram"></i></a>
                <a href="#" className="text-[#2a6b6b] text-xl hover:text-[#1f4a4a]"><i className="fab fa-youtube"></i></a>
              </div>
            </div>
          </div>

          <div className="bg-gray-200 rounded-2xl h-64 flex items-center justify-center">
            {/* Placeholder map – replace with a real embed */}
            <iframe
            title="map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12616.631972932423!2d-121.9877444!3d38.3565773!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808517cf9f7df407%3A0xe4aac8df639b631c!2sVacaville%2C%20CA%2C%20USA!5e0!3m2!1sen!2sus!4v1686000000000!5m2!1sen!2sus"
            className="w-full h-full rounded-2xl"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;