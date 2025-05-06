import React, { useState, useEffect, useRef } from 'react';

/**
 * Header component with logo and responsive navigation
 * @param {Object} props - Component props
 * @param {Function} props.onLogoClick - Function to execute when logo is clicked
 * @param {Function} props.onAboutClick - Function to execute when About is clicked
 * @param {Function} props.onGuidesClick - Function to execute when Guides is clicked
 * @param {Function} props.onFaqClick - Function to execute when FAQ is clicked
 * @param {Function} props.onHistoricalRatesClick - Function to execute when Historical Rates is clicked
 * @param {boolean} props.isTransparent - Whether the header should have a transparent background
 * @param {Function} props.onMenuToggle - Optional callback for menu state changes
 */
const Header = ({ 
  onLogoClick, 
  onAboutClick, 
  onGuidesClick, 
  onFaqClick, 
  onHistoricalRatesClick,
  isTransparent = false,
  onMenuToggle
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const menuRef = useRef(null);
  
  // Notify parent component of menu state changes
  useEffect(() => {
    if (onMenuToggle) {
      onMenuToggle(menuOpen);
    }
  }, [menuOpen, onMenuToggle]);
  
  // Handle menu transitions for closing
  const handleMenuClose = () => {
    if (menuOpen) {
      setIsClosing(true);
      // Delay the actual closing to match the transition duration
      setTimeout(() => {
        setMenuOpen(false);
        setIsClosing(false);
      }, 300); // Match the transition-duration-300 class (300ms)
    } else {
      setMenuOpen(true);
    }
  };
  
  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuOpen && menuRef.current && !menuRef.current.contains(event.target) && 
          !event.target.closest('button[aria-label="Toggle menu"]')) {
        handleMenuClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);
  
  // Dynamic styles for header based on transparency and menu state
  const headerBgClass = isTransparent 
    ? (menuOpen || isClosing)
      ? "bg-white" // Full white background when menu is open or closing on transparent header
      : "bg-transparent" 
    : "bg-white";
    
  const headerBorderClass = isTransparent
    ? (menuOpen || isClosing)
      ? "border-b border-gray-200"
      : ""
    : "border-b border-gray-200 shadow-sm";
  
  // Create an inline style for the header to ensure background transition has the same timing as menu
  const headerStyle = {
    transition: 'background-color 300ms ease, border-color 300ms ease',
  };
  
  // Tagline text styling based on transparency (homepage vs other pages)
  const taglineTextColor = isTransparent ? "text-white" : "text-indigo-700";
  const taglineLineColor = isTransparent ? "bg-white" : "bg-indigo-300";
  
  return (
    <header 
      className={`${headerBgClass} ${headerBorderClass} sticky top-0 z-[9999] py-4 will-change-transform`}
      style={headerStyle}
    >
      <div className="container mx-auto px-4 relative">
        {/* Mobile Hamburger Button - Positioned Right */}
        <div className="md:hidden absolute right-4 top-1/2 transform -translate-y-1/2 z-10">
          <button 
            className={`flex items-center justify-center w-10 h-10 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4F46E5] transition-all duration-200 ${menuOpen ? 'bg-[#4F46E5] text-white shadow-lg scale-110' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}
            onClick={handleMenuClose}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <div className="relative w-6 h-6 flex items-center justify-center">
              {/* Top bar */}
              <span 
                className={`absolute h-0.5 bg-current rounded-full transition-all duration-300 ease-in-out ${
                  menuOpen 
                    ? 'w-5 translate-y-0 rotate-45' 
                    : 'w-5 -translate-y-1.5'
                }`}
              ></span>
              
              {/* Middle bar */}
              <span 
                className={`absolute h-0.5 bg-current rounded-full transition-all duration-200 ease-in-out ${
                  menuOpen 
                    ? 'w-0 opacity-0' 
                    : 'w-5 opacity-100'
                }`}
              ></span>
              
              {/* Bottom bar */}
              <span 
                className={`absolute h-0.5 bg-current rounded-full transition-all duration-300 ease-in-out ${
                  menuOpen 
                    ? 'w-5 translate-y-0 -rotate-45' 
                    : 'w-5 translate-y-1.5'
                }`}
              ></span>
            </div>
          </button>
        </div>

        {/* Logo - Centered on mobile/small tablet, Left on desktop */}
        <div className="flex justify-center md:justify-start">
          <div 
            className="flex items-center space-x-2 cursor-pointer" 
            onClick={onLogoClick}
          >
            <img 
              src="/mmtlogo.png" 
              alt="Money Transfer Comparison" 
              className="h-10 w-auto" 
            />
          </div>
        </div>
        
        {/* Tagline - Only visible on desktop and not on homepage */}
        {(!isTransparent) && (
          <div className="hidden lg:flex absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="relative inline-flex items-center w-full">
              <span className="flex flex-col text-center">
                <span className="text-indigo-700 font-medium text-sm leading-tight">Truly Independent</span>
                <span className="text-indigo-700 font-medium text-sm leading-tight">Transparently Better</span>
              </span>
            </div>
          </div>
        )}
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-3 absolute right-4 top-1/2 transform -translate-y-1/2">
          <button 
            onClick={onAboutClick}
            className="bg-[#4F46E5] hover:bg-[#1B1464] text-white py-2 px-4 rounded-full font-medium transition duration-200"
          >
            About
          </button>
          <button 
            onClick={onGuidesClick}
            className="bg-[#4F46E5] hover:bg-[#1B1464] text-white py-2 px-4 rounded-full font-medium transition duration-200"
          >
            Guides
          </button>
          <button 
            onClick={onFaqClick}
            className="bg-[#4F46E5] hover:bg-[#1B1464] text-white py-2 px-4 rounded-full font-medium transition duration-200"
          >
            FAQ
          </button>
          <button 
            onClick={onHistoricalRatesClick}
            className="bg-[#4F46E5] hover:bg-[#1B1464] text-white py-2 px-4 rounded-full font-medium transition duration-200"
          >
            Rates
          </button>
        </div>
      </div>
      
      {/* Mobile Menu - Only visible on mobile */}
      {(menuOpen || isClosing) && (
        <div 
          ref={menuRef}
          className={`md:hidden absolute top-[72px] left-0 right-0 z-[9999] bg-white shadow-lg overflow-hidden ${isClosing ? 'max-h-0' : 'max-h-[400px]'}`}
          style={{ 
            borderTop: "none",
            transition: 'max-height 300ms cubic-bezier(0.4, 0, 0.2, 1), opacity 300ms ease',
            opacity: isClosing ? 0 : 1,
            transform: `translateY(${isClosing ? '-10px' : '0'})`,
            transitionProperty: 'max-height, opacity, transform',
          }}
        >
          <div className="container mx-auto px-4 py-4 pb-8">
            <div className="flex flex-col space-y-3">
              {['About', 'Guides', 'FAQ', 'Rates'].map((item, index) => {
                const handleClick = () => {
                  const clickHandlers = {
                    'About': onAboutClick,
                    'Guides': onGuidesClick,
                    'FAQ': onFaqClick,
                    'Rates': onHistoricalRatesClick
                  };
                  clickHandlers[item]();
                  handleMenuClose();
                };
                
                return (
                  <button 
                    key={item}
                    onClick={handleClick}
                    className="bg-[#4F46E5] hover:bg-[#1B1464] active:scale-95 text-white py-3 px-6 rounded-xl font-medium transition-all duration-300 w-full text-center"
                    style={{
                      opacity: isClosing ? 0 : 1,
                      transform: isClosing ? 'translateX(-20px)' : 'translateX(0)',
                      transition: `opacity 300ms ease, transform 300ms ease`,
                      transitionDelay: `${isClosing ? 0 : index * 50}ms`
                    }}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;