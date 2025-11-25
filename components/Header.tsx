
import React from 'react';

export const Header: React.FC = () => (
  <header className="py-4 px-4 md:px-6">
    <div className="container mx-auto flex items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#FF6B00] mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <circle cx="12" cy="12" r="3"></circle>
          <line x1="12" y1="22" x2="12" y2="15"></line>
          <line x1="5.64" y1="5.64" x2="9.17" y2="9.17"></line>
          <line x1="18.36" y1="5.64" x2="14.83" y2="9.17"></line>
      </svg>
      <h1 className="text-2xl font-bold text-white tracking-tight">
        Autonomia<span className="text-[#FF6B00]">+</span>
      </h1>
    </div>
  </header>
);