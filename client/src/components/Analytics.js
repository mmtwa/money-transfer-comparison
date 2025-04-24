import React, { useEffect } from 'react';

const Analytics = ({ measurementId }) => {
  useEffect(() => {
    // Use requestIdleCallback to load analytics during browser idle time
    const loadAnalytics = () => {
      // Load Google Analytics script with defer attribute
      const script = document.createElement('script');
      script.async = true;
      script.defer = true; // Add defer attribute
      script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
      
      // Add analytics script to body instead of head
      document.body.appendChild(script);

      // Initialize Google Analytics
      window.dataLayer = window.dataLayer || [];
      function gtag() {
        window.dataLayer.push(arguments);
      }
      gtag('js', new Date());
      gtag('config', measurementId, {
        'send_page_view': false // Defer page view until after LCP
      });

      // Delay page view tracking until after LCP
      setTimeout(() => {
        gtag('event', 'page_view');
      }, 3000); // Wait 3 seconds after load to track page view
      
      // Expose gtag for event tracking
      window.gtag = gtag;
    };

    // Use requestIdleCallback or setTimeout as fallback
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(loadAnalytics);
    } else {
      setTimeout(loadAnalytics, 2000); // 2 second delay if requestIdleCallback not available
    }

    // Clean up
    return () => {
      const scripts = document.querySelectorAll(`script[src*="googletagmanager.com/gtag/js"]`);
      scripts.forEach(script => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      });
    };
  }, [measurementId]);

  return null;
};

export default Analytics;