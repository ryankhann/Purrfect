import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const LITTERS = [
  {
    id: 'litter-1',
    breed: 'Maine Coon',
    parents: 'Luna & Max',
    dueDate: 'August 15, 2026',
    readyDate: 'October 10, 2026',
    image: '/images/MaineCoon/MaineCoon-2.jpg',
    description: 'Expecting 4-5 kittens. Both parents are TICA registered with excellent health scores.',
    spots: 3,
  },
  {
    id: 'litter-2',
    breed: 'Persian',
    parents: 'Bella & Oliver',
    dueDate: 'July 28, 2026',
    readyDate: 'September 22, 2026',
    image: '/images/persian/PersianCat.jpg',
    description: 'A pure white dam with a golden sire – anticipated to produce stunning doll‑face Persians.',
    spots: 2,
  },
  {
    id: 'litter-3',
    breed: 'Bengal',
    parents: 'Nala & Rajah',
    dueDate: 'September 1, 2026',
    readyDate: 'October 26, 2026',
    image: '/images/Bengal/BengalCat.jpg',
    description: 'High‑contrast marble and rosetted kittens from champion bloodlines.',
    spots: 4,
  },
];

const UpcomingLitters = () => {
  return (
    <div className="font-sans bg-[#faf8f6] text-[#0f2a2f] min-h-screen">
      <section className="relative bg-gradient-to-br from-[#0f2a2f] to-[#2a6b6b] text-white py-16 md:py-20 text-center">
        <h1 className="font-['Playfair_Display'] text-4xl md:text-5xl font-bold mb-4">Upcoming Litters</h1>
        <p className="text-lg opacity-90 max-w-xl mx-auto">Reserve your future companion from our carefully planned matings.</p>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 my-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        {LITTERS.map(litter => (
          <div key={litter.id} className="bg-white rounded-2xl overflow-hidden shadow-lg flex flex-col md:flex-row">
            <div className="h-48 md:h-auto md:w-48 flex-shrink-0">
              <img src={litter.image} alt={litter.breed} className="w-full h-full object-cover"
                onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=Litter'; }} />
            </div>
            <div className="p-6 flex flex-col justify-between flex-1">
              <div>
                <h3 className="font-['Playfair_Display'] text-2xl font-bold mb-1">{litter.breed}</h3>
                <p className="text-sm text-gray-500">Parents: {litter.parents}</p>
                <p className="text-xs text-gray-400 mt-2">Due: {litter.dueDate} • Ready: {litter.readyDate}</p>
                <p className="text-sm text-gray-600 mt-3">{litter.description}</p>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm font-semibold text-[#2a6b6b]">
                  <i className="fas fa-paw mr-1"></i> {litter.spots} {litter.spots === 1 ? 'spot' : 'spots'} available
                </span>
                <Link to="/kittens/reservation" className="inline-block bg-[#2a6b6b] text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-[#1f4a4a] transition">
                  Reserve Now
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingLitters;