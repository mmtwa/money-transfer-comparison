import React, { useEffect } from 'react';

const FontLoader = () => {
  useEffect(() => {
    // This component is now redundant since we're loading fonts directly in HTML
    // with proper font-display:swap attribute
    // Keeping this component empty to avoid breaking references
    console.log('FontLoader component is deprecated - fonts are loaded in HTML');
  }, []);
  
  return null; // This component doesn't render anything
};

export default FontLoader; 