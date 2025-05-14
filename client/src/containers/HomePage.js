import React, { useState, useEffect } from 'react';
import SearchForm from './SearchForm';
import AdBackground from '../components/AdBackground';
import Header from '../components/layout/Header';
import { selectAdPartner, trackImpression, getAdPartners } from '../services/adService';

/**
 * Home page container with dynamic ad backgrounds and search form
 */
const HomePage = ({ onSearch, initialData, onAboutClick, onGuidesClick, onFaqClick, onHistoricalRatesClick }) => {
  // Select the appropriate ad partner based on scheduling and priority
  const [currentAdPartner, setCurrentAdPartner] = useState('default');
  const [adMetadata, setAdMetadata] = useState({});
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Initialize the ad partner on component mount
  useEffect(() => {
    const initializeAdPartner = async () => {
      setIsLoading(true);
      try {
        // Get ad partner asynchronously
        const partnerId = await selectAdPartner();
        setCurrentAdPartner(partnerId);
        
        // Get all ad partners data
        const allPartners = getAdPartners();
        setAdMetadata(allPartners[partnerId] || allPartners.default);
        
        // Track impression for analytics
        trackImpression(partnerId);
      } catch (error) {
        console.error('Error initializing ad partner:', error);
        // Fallback to default if there's an error
        setCurrentAdPartner('default');
        const allPartners = getAdPartners();
        setAdMetadata(allPartners.default);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAdPartner();
  }, []);
  
  // Handle menu state change from Header component
  const handleMenuToggle = (isOpen) => {
    setMenuOpen(isOpen);
  };
  
  useEffect(() => {
    // Create stylesheet for custom fonts
    const customFontStyle = document.createElement('style');
    customFontStyle.textContent = `
      @font-face {
        font-family: 'Mylius Italic';
        src: url('/assets/fonts/Mylius Italic.otf') format('opentype');
        font-weight: normal;
        font-style: italic;
        font-display: swap;
      }
      
      @font-face {
        font-family: 'Mylius Bold';
        src: url('/assets/fonts/Mylius Bold.otf') format('opentype');
        font-weight: bold;
        font-style: normal;
        font-display: swap;
      }
      
      @font-face {
        font-family: 'Mylius Sans';
        src: url('/assets/fonts/Mylius Sans.otf') format('opentype');
        font-weight: normal;
        font-style: normal;
        font-display: swap;
      }
      
      @font-face {
        font-family: 'Mylius';
        src: url('/assets/fonts/Mylius.otf') format('opentype');
        font-weight: normal;
        font-style: normal;
        font-display: swap;
      }
      
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes fadeInRight {
        from {
          opacity: 0;
          transform: translateX(-30px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
      
      @keyframes fadeInScale {
        from {
          opacity: 0;
          transform: scale(0.9);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }
      
      .ba-text-experience {
        animation: fadeInRight 1.2s ease-out forwards;
      }
      
      .ba-logo {
        animation: fadeInScale 1.5s ease-out 0.3s forwards;
        opacity: 0;
        transform: scale(0.9);
        animation-fill-mode: forwards;
      }
      
      .ba-subtitle {
        animation: fadeInUp 1s ease-out 0.6s forwards;
        opacity: 0;
        transform: translateY(30px);
        animation-fill-mode: forwards;
      }
    `;
    document.head.appendChild(customFontStyle);
    
    // Embed remaining required fonts
    const poppinsLink = document.createElement('link');
    poppinsLink.rel = 'stylesheet';
    poppinsLink.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500&display=swap';
    document.head.appendChild(poppinsLink);
    
    // Clean up function to remove links on unmount
    return () => {
      document.head.removeChild(customFontStyle);
      document.head.removeChild(poppinsLink);
    };
  }, []);
  
  useEffect(() => {
    // Attempt to hide the address bar on mobile by scrolling down slightly
    // Use a small timeout to ensure the page has rendered
    const timer = setTimeout(() => {
      // Check if it's likely a mobile device based on touch capability
      // This isn't foolproof but avoids unnecessary scroll on desktops
      if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
        window.scrollTo(0, 1);
      }
    }, 100); // 100ms delay
  
    // Clean up the timer if the component unmounts before it fires
    return () => clearTimeout(timer);
  }, []); // Empty dependency array means this runs once on mount
  
  return (
    <div className="relative overflow-hidden" style={{ 
      height: '100vh', 
      maxHeight: '100vh',
      width: '100%',
      boxSizing: 'border-box',
      position: 'relative' 
    }}>
      {/* Loading state for ad background */}
      {isLoading ? (
        <div className="absolute inset-0 bg-gray-100"></div>
      ) : (
        /* Dynamic Ad Background */
        <AdBackground currentAdPartner={currentAdPartner} adMetadata={adMetadata} />
      )}
  
      {/* Header with transparent background */}
      <div className={`absolute top-0 left-0 right-0 ${menuOpen ? 'z-50' : 'z-10'}`}>
        <Header 
          onLogoClick={() => {}} 
          onAboutClick={(e) => {
            onAboutClick(e);
            setMenuOpen(false);
          }}
          onGuidesClick={(e) => {
            onGuidesClick(e);
            setMenuOpen(false);
          }}
          onFaqClick={(e) => {
            onFaqClick(e);
            setMenuOpen(false);
          }}
          onHistoricalRatesClick={(e) => {
            onHistoricalRatesClick(e);
            setMenuOpen(false);
          }}
          isTransparent={true}
          onMenuToggle={handleMenuToggle}
        />
      </div>

      {/* Main Content with centered search tool - Fixed position */}
      <div
        className="relative z-10 flex flex-col items-center md:items-start md:justify-center px-4 lg:pl-10 md:pb-20 lg:pb-0"
        style={{
          position: 'absolute',
          top: '80px',
          left: 0,
          right: 0,
          bottom: 0,
          height: 'calc(100vh - 80px)',
          transform: 'translateZ(0)', // Force GPU rendering
          willChange: 'transform',  // Hint to browser about upcoming animations
          boxSizing: 'border-box'
        }}
      >
        {/* Search Tool - centered on mobile and tablet, left-aligned on desktop */}
        <div className="w-full max-w-md mx-auto md:mx-0 mt-auto md:mt-0 mb-4">
          <div
            style={{
              transform: 'translateZ(0)',
              width: '100%',
              maxWidth: '28rem',
              position: 'relative',
              boxSizing: 'border-box',
              zIndex: 20 // Ensure form elements are above other positioned elements like the promo text
            }}
          >
            <SearchForm onSearch={onSearch} initialData={initialData} />
          </div>
        </div>
        
        {/* British Airways promotional text - responsive positioning */}
        {currentAdPartner === 'ba' && (
          <a
            href="https://www.britishairways.com/content/information/travel-classes/club-world"
            target="_blank"
            rel="noopener noreferrer"
            className="block relative text-center max-w-xs mx-auto mb-24 -mt-2 p-6 text-lg leading-relaxed md:absolute md:text-right md:max-w-3xl md:mx-0 md:mt-0 md:bottom-10 md:right-10"
            style={{
              padding: '0px',
              color: 'rgba(255, 255, 250, 0.95)',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.25)',
              zIndex: 5,
              textDecoration: 'none',
              cursor: 'pointer',
              transition: 'opacity 0.2s ease-in-out'
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
            <div style={{
              fontSize: 'clamp(42px, 6vw, 96px)',
              marginBottom: '-28px',
              lineHeight: 1.2,
              textAlign: 'inherit'
            }}>
              <span className="ba-text-experience" style={{ fontFamily: '"Mylius Italic", serif', fontStyle: 'italic', fontWeight: 400, display: 'inline-block' }}>
                Experience 
              </span>
              <br/>
              <img 
                className="ba-logo"
                src="/partners/ba/British-Airways-Logo-1997-500x281.png" 
                alt="BRITISH AIRWAYS Logo" 
                style={{ 
                  display: 'inline-block',
                  verticalAlign: 'middle',
                  width: 'min(90vw, 500px)',
                  height: 'auto',
                  maxHeight: 'min(280px, 35vw)',
                  filter: 'drop-shadow(0 2px 12px 2px #fff)',
                  marginTop: '-42px',
                  objectFit: 'contain'
                }} 
              />
            </div>
            <div className="ba-subtitle" style={{
              fontSize: 'clamp(24px, 3vw, 48px)',
              fontFamily: '"Mylius Sans", sans-serif',
              fontWeight: 400,
              letterSpacing: '0.02em'
            }}>
              See their new Club World experience
            </div>
          </a>
        )}
      </div>
    </div>
  );
};

export default HomePage; 