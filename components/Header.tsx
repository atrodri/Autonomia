import React from 'react';
import { LogoutIcon } from './icons/Icons';

interface HeaderProps {
    username: string;
    onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ username, onLogout }) => (
  <header className="py-4 px-4 md:px-6">
    <div className="container mx-auto flex items-center justify-between">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold text-white tracking-tighter">
          autonomia<span className="text-[#FF6B00]">+</span>
        </h1>
      </div>
      <button onClick={onLogout} title="Sair" className="flex items-center text-sm text-gray-400 hover:text-white transition-colors">
        <span className="hidden sm:inline mr-2">Sair</span>
        <LogoutIcon className="w-6 h-6" />
      </button>
    </div>
  </header>
);