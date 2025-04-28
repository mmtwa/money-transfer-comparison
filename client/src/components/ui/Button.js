import React, { useState, useRef } from 'react';

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
  const [hasShimmered, setHasShimmered] = useState(false);
  const shimmerRef = useRef(null);

  const handleClick = (e) => {
    if (!hasShimmered && shimmerRef.current) {
      shimmerRef.current.style.opacity = '1';
      shimmerRef.current.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (shimmerRef.current) {
          shimmerRef.current.style.opacity = '0';
          shimmerRef.current.style.transform = 'translateX(-100%)';
        }
      }, 1000);
      setHasShimmered(true);
    }
    onClick?.(e);
  };

  const baseClasses = 'relative overflow-hidden group text-lg md:text-xl py-4 md:py-5 px-4 md:px-5 rounded-full font-medium flex items-center justify-center transition duration-200';
  
  const primaryClasses = 'bg-[#4F46E5] hover:bg-[#1B1464] text-white';
  const secondaryClasses = 'bg-white border border-blue-500 text-blue-600 hover:bg-blue-50';
  
  const classes = `
    ${baseClasses} 
    ${primary ? primaryClasses : secondaryClasses}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `;

  // Use a ref to measure the rendered width of the content
  const contentRef = React.useRef(null);
  // Track the maximum width seen to avoid layout shifts
  const [contentWidth, setContentWidth] = React.useState(0);

  React.useEffect(() => {
    if (contentRef.current) {
      const currentWidth = contentRef.current.offsetWidth;
      // Only increase the width, never decrease it
      if (currentWidth > contentWidth) {
        setContentWidth(currentWidth);
      }
    }
  }, [children, contentWidth]);
  
  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled}
      className={classes}
      style={{ 
        fontFamily: 'Poppins, sans-serif',
        height: '64px',
        boxSizing: 'border-box',
        transform: 'translateZ(0)',
        willChange: 'transform'
      }}
    >
      <span 
        ref={contentRef}
        className="relative z-10 flex items-center" 
        style={{ 
          display: 'flex', 
          alignItems: 'center',
          minWidth: contentWidth > 0 ? `${contentWidth}px` : 'auto',
          transform: 'translateZ(0)',
          willChange: 'transform'
        }}
      >
        {children}
      </span>

      {/* shimmer overlay with transform instead of opacity */}
      <span className="absolute inset-0 overflow-hidden">
        <span 
          ref={shimmerRef}
          className="absolute top-0 left-0 h-full w-[200%]" 
          style={{
            background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.3), transparent)',
            transform: 'translateX(-100%)',
            opacity: 0,
            transition: 'transform 1s ease, opacity 0.3s ease',
          }}
        />
      </span>
    </button>
  );
};

export default Button; 