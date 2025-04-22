import React, { useState, useEffect } from 'react';

/**
 * Component to display a currency flag with fallback
 */
const CurrencyFlag = ({ currency }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const flagUrl = `/flags/${currency.toLowerCase()}.svg`;
  
  // Reset states when currency changes
  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);
  }, [currency]);
  
  const handleLoad = () => {
    setIsLoaded(true);
  };
  
  const handleError = (e) => {
    setHasError(true);
    e.target.onerror = null;
    // Display the first two letters of the currency code as fallback
    e.target.src = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'><text x='50%' y='50%' font-size='10' text-anchor='middle' dominant-baseline='middle'>${currency.substring(0, 2)}</text></svg>`;
  };
  
  return (
    <div className="flex-shrink-0 flex items-center justify-center">
      <img 
        src={flagUrl} 
        alt={`${currency} flag`} 
        className="w-6 h-6 rounded-full object-cover bg-gray-200 transition-opacity duration-200"
        onLoad={handleLoad}
        onError={handleError}
        style={{ opacity: 1 }}
      />
    </div>
  );
};

export default CurrencyFlag; 