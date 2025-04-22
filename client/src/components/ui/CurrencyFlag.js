import React, { useState, useEffect } from 'react';

/**
 * Component to display a currency flag with fallback
 */
const CurrencyFlag = ({ currency, size = 'md' }) => {
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
    e.target.src = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'><circle cx="12" cy="12" r="11" fill="%23f3f4f6" stroke="%23d1d5db" stroke-width="1"/><text x='50%' y='50%' font-size='10' font-weight='bold' text-anchor='middle' dominant-baseline='middle' fill='%236b7280'>${currency.substring(0, 2)}</text></svg>`;
  };
  
  // Determine size classes
  const sizeClasses = {
    sm: "w-5 h-5",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-10 h-10"
  };
  
  return (
    <div className="flex-shrink-0 flex items-center justify-center">
      <img 
        src={flagUrl} 
        alt={`${currency} flag`} 
        className={`${sizeClasses[size]} rounded-full object-cover bg-gray-100 border border-gray-200 shadow-sm transition-opacity duration-200`}
        onLoad={handleLoad}
        onError={handleError}
        style={{ opacity: isLoaded || hasError ? 1 : 0.7 }}
      />
    </div>
  );
};

export default CurrencyFlag; 