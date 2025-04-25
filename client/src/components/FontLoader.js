import React, { useEffect } from 'react';

const FontLoader = () => {
  useEffect(() => {
    // Ensure Google Fonts are loaded at runtime
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap';
    
    // Add to head
    document.head.appendChild(link);
    
    // Cleanup
    return () => {
      document.head.removeChild(link);
    };
  }, []);
  
  return null; // This component doesn't render anything
};

export default FontLoader; 