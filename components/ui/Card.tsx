
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className }) => {
  return (
    <div className={`bg-[#141414] rounded-lg shadow-lg p-6 md:p-8 max-w-2xl mx-auto ${className}`}>
      {children}
    </div>
  );
};