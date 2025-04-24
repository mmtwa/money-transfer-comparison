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
      onClick={onClick}
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
          className="absolute top-0 left-0 h-full w-[200%]" 
          style={{
            background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.3), transparent)',
            transform: 'translateX(-100%) rotate(12deg)',
            opacity: 0,
            transition: 'transform 1s ease, opacity 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '1';
            e.currentTarget.style.transform = 'translateX(100%) rotate(12deg)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '0';
            setTimeout(() => {
              if (e.currentTarget) {
                e.currentTarget.style.transform = 'translateX(-100%) rotate(12deg)';
              }
            }, 300);
          }}
        />
      </span>
    </button>
  );
};

export default Button; 