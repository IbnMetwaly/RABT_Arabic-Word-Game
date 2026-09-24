import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  style,
  ...props 
}) => {
  const baseStyles = "px-6 py-3.5 rounded-2xl font-black transition-all active:scale-[0.98] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer select-none";
  
  const variants = {
    primary: "bg-sky-600 hover:bg-sky-500 active:bg-sky-700 text-white border-b-4 border-sky-800 shadow-sky-900/25",
    secondary: "bg-orange-500 hover:bg-orange-400 active:bg-orange-600 text-white border-b-4 border-orange-700 shadow-orange-900/25",
    success: "bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white border-b-4 border-emerald-800 shadow-emerald-900/20",
    danger: "bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white border-b-4 border-rose-800 shadow-rose-900/20"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      style={{ color: '#ffffff', ...style }}
      {...props}
    >
      {children}
    </button>
  );
};
