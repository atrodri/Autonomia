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
        <h1 className="text-5xl font-bold text-white tracking-tighter">
          autonomia<span className="text-[#FF6B00]">+</span>
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