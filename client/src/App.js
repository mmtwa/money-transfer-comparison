import React, { useEffect, useState, lazy, Suspense } from 'react';
import { BrowserRouter, useNavigate, Route } from 'react-router-dom';
import MoneyCompare from './containers/MoneyCompare';
import Analytics from './components/Analytics';
import FontLoader from './components/FontLoader';
import StructuredData from './components/StructuredData';
import CookieConsent from './components/CookieConsent';
import './App.css';
import Careers from './pages/Careers';

// Lazy load non-critical components
const PreloadFlags = lazy(() => import('./components/ui/PreloadFlags'));

function App() {
  const measurementId = 'G-90Q0L28ZF4';
  const [initialPath, setInitialPath] = useState(window.location.pathname);
  const [isAppReady, setIsAppReady] = useState(false);
  
  // Initialize the app with the correct path based on URL
  useEffect(() => {
    // If we need to handle any initial URL state, do it here
    const handleInitialPath = () => {
      setInitialPath(window.location.pathname);
    };
    
    // Set initial path on load
    handleInitialPath();
    
    // Set up path listener for any external navigation
    window.addEventListener('popstate', handleInitialPath);
    
    return () => {
      window.removeEventListener('popstate', handleInitialPath);
    };
  }, []);

  // Apply render-ready class after app is loaded
  useEffect(() => {
    // Short delay to ensure DOM is ready
    const timer = setTimeout(() => {
      document.body.classList.add('render-ready', 'icons-loaded');
      setIsAppReady(true);
    }, 200);
    
    return () => clearTimeout(timer);
  }, []);

  // Determine which page we're on for structured data
  const getPageType = () => {
    const path = initialPath.toLowerCase();
    if (path.includes('/about')) return 'about';
    if (path === '/' || path.includes('/compare')) return 'comparison';
    return 'home';
  };

  // Wrap CookieConsent in a component that has access to navigation
  const CookieConsentWithNavigation = () => {
    const navigate = useNavigate();
    
    const handlePrivacyClick = () => {
      navigate('/privacy-policy');
    };
    
    const handleCookiesClick = () => {
      navigate('/cookie-policy');
    };
    
    return (
      <CookieConsent 
        onPrivacyClick={handlePrivacyClick} 
        onCookiesClick={handleCookiesClick} 
      />
    );
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <div className={`App ${isAppReady ? 'render-ready' : ''}`}>
          <StructuredData page={getPageType()} />
          <Analytics measurementId={measurementId} />
          <FontLoader />
          <MoneyCompare initialPath={initialPath} />
          
          {/* Cookie Consent Banner */}
          <CookieConsentWithNavigation />
          
          {/* Lazy load non-critical components */}
          <Suspense fallback={null}>
            <PreloadFlags />
          </Suspense>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
