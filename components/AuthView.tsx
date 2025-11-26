import React from 'react';
import { Button } from './ui/Button';

interface AuthScreenProps {
  onLoginClick: () => void;
  onRegisterClick: () => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLoginClick, onRegisterClick }) => {
  return (
    <div className="w-full max-w-sm text-center">
      <div className="mb-10 flex items-end justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#FF6B00] mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <circle cx="12" cy="12" r="3"></circle>
          <line x1="12" y1="22" x2="12" y2="15"></line>
          <line x1="5.64" y1="5.64" x2="9.17" y2="9.17"></line>
          <line x1="18.36" y1="5.64" x2="14.83" y2="9.17"></line>
        </svg>
        <h1 className="text-5xl font-bold text-white tracking-tight">
          Autonomia<span className="text-[#FF6B00]">+</span>
        </h1>
      </div>
      <div className="space-y-4">
        <Button onClick={onLoginClick} className="w-full py-3">
          Login
        </Button>
        <Button onClick={onRegisterClick} variant="secondary" className="w-full py-3">
          Registrar
        </Button>
      </div>
    </div>
  );
};

export default AuthScreen;
