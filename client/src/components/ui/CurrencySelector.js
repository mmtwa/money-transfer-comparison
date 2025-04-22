import React, { useState, useCallback, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import CurrencyFlag from './CurrencyFlag';
import { currenciesList } from '../../utils/currency';
import useOutsideClick from '../../hooks/useOutsideClick';

// Add ripple effect styles
const rippleStyles = `
  .ripple-effect {
    position: absolute;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.1);
    transform: scale(0);
    animation: ripple 0.6s linear;
    pointer-events: none;
  }
  
  @keyframes ripple {
    to {
      transform: scale(2.5);
      opacity: 0;
    }
  }
  
  .dropdown-search {
    position: sticky;
    top: 0;
    z-index: 2;
    background: white;
  }
`;

/**
 * Component for currency selection with dropdown
 */
const CurrencySelector = ({ 
  label, 
  selectedCurrency, 
  onCurrencyChange,
  className,
  isOpen,
  onToggle,
  id
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useOutsideClick(handleClickOutside);
  const itemRefs = useRef({});
  const styleRef = useRef(null);
  const buttonRef = useRef(null);
  
  // Add ripple styles to document
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = rippleStyles;
    document.head.appendChild(styleElement);
    styleRef.current = styleElement;
    
    return () => {
      if (styleRef.current) {
        document.head.removeChild(styleRef.current);
      }
    };
  }, []);
  
  // Handle click outside to close dropdown
  function handleClickOutside() {
    if (isOpen) {
      onToggle(null); // Close the dropdown
    }
  }
  
  // Create ripple effect
  const createRipple = (e, element) => {
    if (!element) return;
    
    const circle = document.createElement('span');
    const diameter = Math.max(element.clientWidth, element.clientHeight);
    const radius = diameter / 2;
    
    // Get position relative to the button
    const rect = element.getBoundingClientRect();
    const x = e.clientX - rect.left - radius;
    const y = e.clientY - rect.top - radius;
    
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${x}px`;
    circle.style.top = `${y}px`;
    circle.classList.add('ripple-effect');
    
    // Remove existing ripples
    const ripple = element.querySelector('.ripple-effect');
    if (ripple) {
      ripple.remove();
    }
    
    element.appendChild(circle);
    
    // Remove the ripple element after the animation completes
    setTimeout(() => {
      if (circle) {
        circle.remove();
      }
    }, 600);
  };
  
  // Handle toggle dropdown
  const handleToggleDropdown = (e) => {
    createRipple(e, buttonRef.current);
    onToggle(id);
  };
  
  // Filter currencies based on search
  const filteredCurrencies = currenciesList.filter(currency => 
    currency.code.toLowerCase().includes(searchQuery.toLowerCase()) || 
    currency.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleCurrencySelect = (e, currency) => {
    createRipple(e, itemRefs.current[currency]);
    
    // Slight delay to allow ripple effect to show before closing dropdown
    setTimeout(() => {
      onCurrencyChange(currency);
      onToggle(null); // Close dropdown after selection
      setSearchQuery('');
    }, 150);
  };
  
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-black-600 mb-2 text-left">{label}</label>
      )}
      <div className="relative" ref={dropdownRef}>
        <button 
          ref={buttonRef}
          onClick={handleToggleDropdown}
          className="w-full appearance-none border border-gray-500 rounded-xl p-4 md:p-5 text-gray-800 focus:outline-none mb-1 cursor-pointer flex items-center justify-between hover:border-blue-500 hover:shadow-md transition-all duration-200 relative overflow-hidden"
        >
          <div className="flex items-center">
            <CurrencyFlag currency={selectedCurrency} />
            <span className="ml-2 text-base md:text-xl font-medium">{selectedCurrency}</span>
          </div>
          <ChevronDown 
            size={16} 
            className={`text-gray-600 ml-8 ${isOpen ? 'animate-rotateDown' : 'animate-rotateUp'}`} 
          />
        </button>
        
        <div 
          className={`fixed max-h-[calc(40vh-50px)] z-20 w-64 bg-white border border-gray-200 mt-1 rounded-md shadow-lg overflow-y-auto transition-all duration-200 ease-in-out ${
            isOpen 
              ? 'opacity-100 scale-100 translate-y-0 animate-fadeInDown' 
              : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
          }`}
        >
          <div className="dropdown-search p-2 border-b border-gray-200">
            <input
              type="text"
              placeholder="Search currency..."
              className="w-full p-2 border rounded text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              // Prevent clicks on the input from closing the dropdown
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div>
            {filteredCurrencies.map((currency, index) => (
              <div 
                key={currency.code} 
                ref={el => itemRefs.current[currency.code] = el}
                className="p-2 hover:bg-blue-50 cursor-pointer flex items-center transition-colors duration-150 relative overflow-hidden"
                onClick={(e) => handleCurrencySelect(e, currency.code)}
                style={{ 
                  animationDelay: `${index * 30}ms`,
                  animation: isOpen ? `fadeInDown 0.2s ease-out forwards ${index * 30}ms` : 'none'
                }}
              >
                <CurrencyFlag currency={currency.code} />
                <div className="flex flex-col text-left ml-2">
                  <div className="font-medium">{currency.code}</div>
                  <div className="text-xs text-gray-500">{currency.name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrencySelector; 