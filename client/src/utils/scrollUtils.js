/**
 * Utility functions for handling scroll-related tasks
 */

/**
 * Attempts to hide the browser address bar by scrolling down slightly
 * Works primarily on mobile browsers
 * @param {number} delay - Optional delay in ms before attempting to scroll
 */
export const hideAddressBar = (delay = 100) => {
  // Use setTimeout to ensure the function runs after the page has loaded
  setTimeout(() => {
    // Try to scroll down 1px to hide the address bar
    window.scrollTo(0, 1);
    
    // Some mobile browsers need a bit more scrolling
    if (window.innerHeight < window.outerHeight) {
      window.scrollTo(0, 100);
      // Scroll back up to maintain user's position
      setTimeout(() => window.scrollTo(0, 0), 50);
    }
  }, delay);
};

/**
 * Ensures the address bar stays hidden when the page is resized
 * Useful for handling orientation changes
 */
export const setupAddressBarHiding = () => {
  // Hide initially
  hideAddressBar();
  
  // Set up event listeners for resize and orientation change
  window.addEventListener('resize', hideAddressBar);
  window.addEventListener('orientationchange', hideAddressBar);
  
  // Return cleanup function for React useEffect
  return () => {
    window.removeEventListener('resize', hideAddressBar);
    window.removeEventListener('orientationchange', hideAddressBar);
  };
}; 