import React from 'react';

/**
 * Reusable button component with styles and animations
 */
const Button = ({ 
  children, 
  onClick, 
  disabled = false, 
  primary = true,
  className = '', 
  type = 'button',
  fullWidth = false,
}) => {
  const baseClasses = 'relative overflow-hidden group text-lg md:text-xl py-4 md:py-5 px-4 md:px-5 rounded-full font-medium flex items-center justify-center transition duration-200';
  
  const primaryClasses = 'bg-[#4F46E5] hover:bg-[#1B1464] text-white';
  const secondaryClasses = 'bg-white border border-blue-500 text-blue-600 hover:bg-blue-50';
  
  const classes = `
    ${baseClasses} 
    ${primary ? primaryClasses : secondaryClasses}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `;
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
      style={{ fontFamily: 'Poppins, sans-serif' }}
    >
      <span className="relative z-10 flex items-center">
        {children}
      </span>

      {/* shimmer overlay */}
      <span className="absolute inset-0 before:content-[''] before:absolute before:top-0 before:left-[-75%] before:h-full before:w-[200%] before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent before:rotate-12 before:opacity-0 group-hover:before:opacity-100 group-hover:before:animate-shimmer" />
    </button>
  );
};

export default Button; 