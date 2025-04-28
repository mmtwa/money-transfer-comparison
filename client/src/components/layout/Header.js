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
  
  return (
    <header 
      className={`${headerBgClass} ${headerBorderClass} sticky top-0 z-[9999] py-4 will-change-transform`}
      style={headerStyle}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={onLogoClick}>
          <img 
            src="/mmtlogo.png" 
            alt="Money Transfer Comparison" 
            className="h-10 w-auto" 
          />
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-3">
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
            Historical Rates
          </button>
        </div>
        
        {/* Mobile Hamburger Button */}
        <button 
          className="md:hidden focus:outline-none"
          onClick={handleMenuClose}
          aria-label="Toggle menu"
        >
          <svg 
            className={`w-6 h-6 ${isTransparent && !menuOpen && !isClosing ? 'text-white' : 'text-gray-800'}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>
      
      {/* Mobile Menu - Only visible on mobile */}
      {(menuOpen || isClosing) && (
        <div 
          ref={menuRef}
          className={`md:hidden absolute top-[72px] left-0 right-0 z-[9999] bg-white shadow-sm ${isClosing ? 'opacity-0' : 'opacity-100'}`}
          style={{ 
            borderTop: "none",
            transition: 'opacity 300ms ease'
          }}
        >
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col space-y-3">
              <button 
                onClick={() => {
                  onAboutClick();
                  handleMenuClose();
                }}
                className="bg-[#4F46E5] hover:bg-[#1B1464] text-white py-2 px-4 rounded-full font-medium transition duration-200 w-full text-center"
              >
                About
              </button>
              <button 
                onClick={() => {
                  onGuidesClick();
                  handleMenuClose();
                }}
                className="bg-[#4F46E5] hover:bg-[#1B1464] text-white py-2 px-4 rounded-full font-medium transition duration-200 w-full text-center"
              >
                Guides
              </button>
              <button 
                onClick={() => {
                  onFaqClick();
                  handleMenuClose();
                }}
                className="bg-[#4F46E5] hover:bg-[#1B1464] text-white py-2 px-4 rounded-full font-medium transition duration-200 w-full text-center"
              >
                FAQ
              </button>
              <button 
                onClick={() => {
                  onHistoricalRatesClick();
                  handleMenuClose();
                }}
                className="bg-[#4F46E5] hover:bg-[#1B1464] text-white py-2 px-4 rounded-full font-medium transition duration-200 w-full text-center"
              >
                Historical Rates
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;