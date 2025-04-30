import React, { useState, useEffect } from 'react';

/**
 * Cookie Consent Banner Component
 * Shows a banner asking users to accept cookies and provides links to policy
 */
const CookieConsent = ({ onPrivacyClick, onCookiesClick }) => {
  const [showBanner, setShowBanner] = useState(false);
  
  useEffect(() => {
    // Check if user has already consented
    const hasConsented = localStorage.getItem('cookie_consent');
    if (!hasConsented) {
      setShowBanner(true);
    }
  }, []);
  
  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'accepted');
    setShowBanner(false);
  };
  
  const handleDecline = () => {
    localStorage.setItem('cookie_consent', 'declined');
    setShowBanner(false);
    
    // You would typically disable non-essential cookies here
    // For example, you might set a flag to disable analytics
  };
  
  if (!showBanner) return null;
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white z-50 shadow-xl">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-4 md:mb-0 md:mr-8 text-center md:text-left">
            <p className="text-sm">
              We use cookies to enhance your experience on our website. By continuing to browse, you agree to our 
              <span className="text-indigo-300 cursor-pointer ml-1 hover:underline" onClick={onCookiesClick}>
                cookie policy
              </span>. 
              Learn more in our 
              <span className="text-indigo-300 cursor-pointer ml-1 hover:underline" onClick={onPrivacyClick}>
                privacy policy
              </span>.
            </p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={handleDecline}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm font-medium transition-colors"
            >
              Decline
            </button>
            <button
              onClick={handleAccept}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded text-sm font-medium transition-colors"
            >
              Accept All Cookies
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent; 