import React, { useState, useCallback } from 'react';
import { ChevronDown } from 'lucide-react';
import CurrencyFlag from './CurrencyFlag';
import { currenciesList } from '../../utils/currency';
import useOutsideClick from '../../hooks/useOutsideClick';

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
  
  // Handle click outside to close dropdown
  const handleClickOutside = useCallback(() => {
    if (isOpen) {
      onToggle(null); // Close the dropdown
    }
  }, [isOpen, onToggle]);
  
  const dropdownRef = useOutsideClick(handleClickOutside);
  
  // Handle toggle dropdown
  const handleToggleDropdown = () => {
    onToggle(id);
  };
  
  // Filter currencies based on search
  const filteredCurrencies = currenciesList.filter(currency => 
    currency.code.toLowerCase().includes(searchQuery.toLowerCase()) || 
    currency.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleCurrencySelect = (currency) => {
    onCurrencyChange(currency);
    onToggle(null); // Close dropdown after selection
    setSearchQuery('');
  };
  
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-black-600 mb-2 text-left">{label}</label>
      )}
      <div className="relative" ref={dropdownRef}>
        <button 
          onClick={handleToggleDropdown}
          className="w-full appearance-none border border-gray-500 rounded-xl p-4 md:p-5 text-gray-800 focus:outline-none mb-1 cursor-pointer flex items-center justify-between"
        >
          <div className="flex items-center">
            <CurrencyFlag currency={selectedCurrency} />
            <span className="ml-2 text-base md:text-xl font-medium">{selectedCurrency}</span>
          </div>
          <ChevronDown size={16} className="text-gray-600 ml-1" />
        </button>
        
        {isOpen && (
          <div className="fixed max-h-[calc(40vh-50px)] z-20 w-64 bg-white border border-gray-200 mt-1 rounded-md shadow-lg max-h-60 overflow-y-auto">
            <div className="p-2 sticky top-0 bg-white border-b border-gray-200">
              <input
                type="text"
                placeholder="Search currency..."
                className="w-full p-2 border rounded text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                // Prevent clicks on the input from closing the dropdown
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            {filteredCurrencies.map(currency => (
              <div 
                key={currency.code} 
                className="p-2 hover:bg-gray-100 cursor-pointer flex items-center"
                onClick={() => handleCurrencySelect(currency.code)}
              >
                <img 
                  src={`/flags/${currency.code.toLowerCase()}.svg`}
                  alt={`${currency.code} flag`}
                  className="w-5 h-5 rounded-full object-cover mr-4 bg-gray-200"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'><text x='50%' y='50%' font-size='8' text-anchor='middle' dominant-baseline='middle'>${currency.code.substring(0, 2)}</text></svg>`;
                  }}
                />
                <div className="flex flex-col text-left">
                  <div className="font-medium">{currency.code}</div>
                  <div className="text-xs text-gray-500">{currency.name}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CurrencySelector; 