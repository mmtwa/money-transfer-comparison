import React, { useEffect } from 'react';
import { currenciesList } from '../../utils/currency';

/**
 * Component that preloads all currency flag images
 * This component doesn't render anything visible but loads all flag images
 * in the background when the application starts
 */
const PreloadFlags = () => {
  useEffect(() => {
    // Create a hidden container for preloaded images
    const preloadContainer = document.createElement('div');
    preloadContainer.style.display = 'none';
    document.body.appendChild(preloadContainer);
    
    // Preload all currency flag images
    currenciesList.forEach(currency => {
      const img = new Image();
      img.src = `/flags/${currency.code.toLowerCase()}.svg`;
      
      // Also preload the fallback
      const fallbackImg = new Image();
      fallbackImg.src = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'><text x='50%' y='50%' font-size='10' text-anchor='middle' dominant-baseline='middle'>${currency.code.substring(0, 2)}</text></svg>`;
      
      preloadContainer.appendChild(img);
      preloadContainer.appendChild(fallbackImg);
    });
    
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