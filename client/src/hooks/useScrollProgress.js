import { useState, useEffect } from 'react';

/**
 * Custom hook to track scroll progress
 * @returns {number} Progress percentage (0-100)
 */
const useScrollProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrollTop = window.scrollY;
      const progress = (scrollTop / documentHeight) * 100;
      
      // Debug values
      console.log('Scroll values:', {
        windowHeight,
        documentHeight,
        scrollTop,
        calculatedProgress: progress
      });
      
      setProgress(Math.min(progress, 100));
    };

    // Initial calculation
    handleScroll();

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return progress;
};

export default useScrollProgress; 