
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, id, ...props }, ref) => {
    return (
      <div>
        <label htmlFor={id} className="block text-sm font-medium text-[#CFCFCF] mb-1">
          {label}
        </label>
        <input
          id={id}
          ref={ref}
          className="block w-full px-3 py-2 bg-[#0A0A0A] border border-[#444] rounded-md text-white placeholder-[#555] focus:outline-none focus:ring-[#FF6B00] focus:border-[#FF6B00] sm:text-sm"
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = 'Input';