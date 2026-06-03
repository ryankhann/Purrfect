import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const HealthGuarantee = () => {
  const [open, setOpen] = useState(0);

  const sections = [
    {
      title: 'Genetic Health Guarantee',
      content: 'All kittens are covered for 2 years against life-threatening congenital or hereditary defects. Should a defect be diagnosed by a licensed veterinarian, we will provide a replacement kitten or refund, at our discretion.',
    },
    {
      title: 'Vaccination & Deworming',
      content: 'Every kitten leaves our care up-to-date on age-appropriate vaccinations (FVRCP and Rabies). They are dewormed multiple times before going home and come with a health record booklet.',
    },
    {
      title: 'Veterinary Exam',
      content: 'Within 72 hours of pickup, we recommend a wellness exam by your veterinarian. If any serious health issue is found, we will reimburse up to the purchase price or provide a replacement.',
    },
    {
      title: 'Spay / Neuter Agreement',
      content: 'All kittens are sold as companion pets with a spay/neuter agreement. Proof of alteration must be submitted by 6 months of age. Breeding rights are available on a case-by-case basis.',
    },
    {
      title: 'Return Policy',
      content: 'If at any time you can no longer care for your cat, we will accept the cat back or assist in rehoming. We never want our cats to end up in shelters.',
    },
  ];

  return (
    <div className="font-sans bg-[#faf8f6] text-[#0f2a2f] min-h-screen">
      <section className="relative bg-gradient-to-br from-[#0f2a2f] to-[#2a6b6b] text-white py-16 md:py-20 text-center">
        <h1 className="font-['Playfair_Display'] text-4xl md:text-5xl font-bold mb-4">Health Guarantee</h1>
        <p className="text-lg opacity-90 max-w-xl mx-auto">We take health seriously — your kitten’s well‑being is our top priority.</p>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 my-12">
        <div className="space-y-4">
          {sections.map((s, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <button
                className="w-full px-6 py-5 text-left font-bold text-lg flex justify-between items-center"
                onClick={() => setOpen(open === i ? -1 : i)}
              >
                <span>{s.title}</span>
                <i className={`fas fa-chevron-down text-[#2a6b6b] transition-transform ${open === i ? 'rotate-180' : ''}`}></i>
              </button>
              <div className={`overflow-hidden transition-all duration-300 ${open === i ? 'max-h-96' : 'max-h-0'}`}>
                <div className="px-6 pb-5 text-gray-700 leading-relaxed">{s.content}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HealthGuarantee;