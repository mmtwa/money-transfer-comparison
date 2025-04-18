import React, { useEffect } from 'react';

const Analytics = ({ measurementId }) => {
  useEffect(() => {
    // Load Google Analytics script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);

    // Initialize Google Analytics
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    gtag('js', new Date());
    gtag('config', measurementId);

    // Expose gtag for event tracking
    window.gtag = gtag;

    // Clean up
    return () => {
      document.head.removeChild(script);
    };
  }, [measurementId]);

  return null;
};

export default Analytics;