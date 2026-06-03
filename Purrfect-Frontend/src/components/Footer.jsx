import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-[#0f2a2f] to-[#1a4045] text-[#e1f2f0]">
      <div className="max-w-7xl mx-auto px-6 py-10 text-center">
        {/* Decorative paw line */}
        <div className="flex justify-center gap-2 mb-6 text-[#2a6b6b] text-xl">
          <i className="fas fa-paw"></i>
          <i className="fas fa-paw"></i>
          <i className="fas fa-paw"></i>
        </div>

        <h3 className="font-['Playfair_Display'] text-2xl md:text-3xl font-medium tracking-tight mb-2">
          Purrfect
        </h3>
        <p className="text-sm opacity-80 max-w-md mx-auto leading-relaxed">
          Premium pedigree cats, hand‑raised with love since 2010.
        </p>

        <hr className="my-8 border-[#2a6b6b]/30" />

        <p className="text-xs opacity-60">
          &copy; {new Date().getFullYear()} Purrfect Cattery. All rights reserved. <br className="sm:hidden" />
          <span className="hidden sm:inline mx-1">·</span> TICA Registered · Health Guaranteed
        </p>
        <p className="opacity-90">
      Design &amp; Development by <span className="font-semibold">Ryan Khan</span>
    </p>
    <p className="opacity-70 mt-1">
      Fiverr: <a href="https://www.fiverr.com/ryan_developer6" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#2a6b6b] transition">@ryan_developer6</a>
    </p>

        {/* A tiny cat silhouette instead of links */}
        <div className="mt-4 text-2xl opacity-50">
          <i className="fas fa-cat"></i>
        </div>
      </div>
    </footer>
  );
};

export default Footer;