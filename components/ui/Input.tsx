
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, id, className, ...props }, ref) => {
    const isDate = props.type === 'date' || props.type === 'datetime-local';
    
    // Estilos base padrão
    const baseClasses = "block w-full px-3 py-2 bg-[#0A0A0A] border border-[#444] rounded-md text-white placeholder-[#555] focus:outline-none focus:ring-[#FF6B00] focus:border-[#FF6B00] sm:text-sm";
    
    // Estilos específicos para campos de data: centralizado e com altura mínima para toque
    const dateClasses = isDate ? "text-center min-h-[45px]" : "";

    // Se className for fornecido via props (ex: TripView), ele sobrescreve os estilos padrão.
    // Caso contrário, combina baseClasses com dateClasses.
    const finalClassName = className 
      ? className 
      : `${baseClasses} ${dateClasses}`.trim();

    return (
      <div>
        <label htmlFor={id} className="block text-sm font-medium text-[#CFCFCF] mb-1">
          {label}
        </label>
        <input
          id={id}
          ref={ref}
          className={finalClassName}
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = 'Input';
