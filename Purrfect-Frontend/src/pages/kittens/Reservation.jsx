import React, { useState } from 'react';

const Reservation = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    breed: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, send to server
    console.log('Reservation:', formData);
    setSubmitted(true);
  };

  return (
    <div className="font-sans bg-[#faf8f6] text-[#0f2a2f] min-h-screen">
      <section className="relative bg-gradient-to-br from-[#0f2a2f] to-[#2a6b6b] text-white py-16 md:py-20 text-center">
        <h1 className="font-['Playfair_Display'] text-4xl md:text-5xl font-bold mb-4">Reserve a Kitten</h1>
        <p className="text-lg opacity-90 max-w-xl mx-auto">Secure your future furry family member with a fully refundable deposit.</p>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 my-12">
        {submitted ? (
          <div className="bg-white rounded-2xl shadow-lg p-10 text-center">
            <i className="fas fa-check-circle text-6xl text-[#2a6b6b] mb-4"></i>
            <h2 className="font-serif text-2xl font-bold mb-2">Reservation Request Submitted!</h2>
            <p className="text-gray-600">We will contact you within 24 hours to confirm availability and next steps.</p>
            <button onClick={() => setSubmitted(false)} className="mt-6 bg-[#2a6b6b] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#1f4a4a] transition">
              Submit Another
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-1">Full Name *</label>
              <input type="text" name="name" required value={formData.name} onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#2a6b6b]" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Email *</label>
                <input type="email" name="email" required value={formData.email} onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#2a6b6b]" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Phone</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#2a6b6b]" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Preferred Breed *</label>
              <select name="breed" required value={formData.breed} onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#2a6b6b] bg-white">
                <option value="">Select a breed</option>
                <option value="Maine Coon">Maine Coon</option>
                <option value="Persian">Persian</option>
                <option value="Bengal">Bengal</option>
                <option value="Siamese">Siamese</option>
                <option value="British Shorthair">British Shorthair</option>
                <option value="Any">Any / Not sure</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Additional Message</label>
              <textarea name="message" rows="4" value={formData.message} onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#2a6b6b]" />
            </div>
            <button type="submit" className="w-full bg-[#0f2a2f] text-white py-3 rounded-xl font-semibold hover:bg-[#1f4a4a] transition">
              Submit Reservation Request
            </button>
            <p className="text-xs text-gray-400 text-center">
              By submitting, you agree to our Reservation Terms. A deposit of $300 is required to secure a kitten.
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default Reservation;