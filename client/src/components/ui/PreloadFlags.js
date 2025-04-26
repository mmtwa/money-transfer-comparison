import React, { useEffect } from 'react';
import { currenciesList } from '../../utils/currency';

/**
 * Component that preloads common currency flag images
 * and progressively loads the rest after initial render
 */
const PreloadFlags = () => {
  useEffect(() => {
    // Create a hidden container for preloaded images
    const preloadContainer = document.createElement('div');
    preloadContainer.style.display = 'none';
    document.body.appendChild(preloadContainer);
    
    // Get list of common currencies to preload first
    const commonCurrencies = ['usd', 'eur', 'gbp', 'aud', 'cad'];
    const preloadedFlags = new Set();
    
    // Function to preload a single flag
    const preloadFlag = (code) => {
      if (preloadedFlags.has(code)) return;
      preloadedFlags.add(code);
      
      const img = new Image();
      img.src = `/flags/${code}.svg`;
      
      // Add to container
      preloadContainer.appendChild(img);
    };
    
    // 1. First preload the most common currencies immediately
    commonCurrencies.forEach(code => {
      preloadFlag(code);
    });
    
    // 2. Then load the remaining flags progressively after initial render
    let index = 0;
    const remainingCurrencies = currenciesList
      .map(currency => currency.code.toLowerCase())
      .filter(code => !commonCurrencies.includes(code));
    
    // Use requestIdleCallback if available, otherwise setTimeout
    const scheduleNextFlag = () => {
      if (index >= remainingCurrencies.length) return;
      
      const code = remainingCurrencies[index++];
      preloadFlag(code);
      
      // Schedule next flag with lower priority
      if (window.requestIdleCallback) {
        window.requestIdleCallback(() => scheduleNextFlag());
      } else {
        setTimeout(() => scheduleNextFlag(), 50);
      }
    };
    
    // Schedule first batch of remaining flags after a delay
    // to allow initial render to complete
    setTimeout(() => {
      scheduleNextFlag();
    }, 2000);
    
    // Cleanup
    return () => {
      if (preloadContainer.parentNode) {
        document.body.removeChild(preloadContainer);
      }
    };
  }, []);
  
  return null; // This component doesn't render anything
};

export default PreloadFlags; 