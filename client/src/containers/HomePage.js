import React, { useState, useEffect } from 'react';
import SearchForm from './SearchForm';
import AdBackground from '../components/AdBackground';
import Header from '../components/layout/Header';
import { selectAdPartner, trackImpression } from '../services/adService';
import adPartners from '../config/adPartners';

/**
 * Home page container with dynamic ad backgrounds and search form
 */
const HomePage = ({ onSearch, initialData, onAboutClick, onGuidesClick, onFaqClick, onHistoricalRatesClick }) => {
  // Select the appropriate ad partner based on scheduling and priority
  const [currentAdPartner, setCurrentAdPartner] = useState('default');
  const [adMetadata, setAdMetadata] = useState(adPartners.default);
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Initialize the ad partner on component mount
  useEffect(() => {
    const partnerId = selectAdPartner();
    setCurrentAdPartner(partnerId);
    setAdMetadata(adPartners[partnerId] || adPartners.default);
    
    // Track impression for analytics
    trackImpression(partnerId);
  }, []);
  
  // Handle menu state change from Header component
  const handleMenuToggle = (isOpen) => {
    setMenuOpen(isOpen);
  };
  
  useEffect(() => {
    // Embed required fonts
    const libreCaslonLink = document.createElement('link');
    libreCaslonLink.rel = 'stylesheet';
    libreCaslonLink.href = 'https://fonts.googleapis.com/css2?family=Libre+Caslon+Display&display=swap';
    document.head.appendChild(libreCaslonLink);
    
    const poppinsLink = document.createElement('link');
    poppinsLink.rel = 'stylesheet';
    poppinsLink.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500&display=swap';
    document.head.appendChild(poppinsLink);
    
    // Clean up function to remove links on unmount
    return () => {
      document.head.removeChild(libreCaslonLink);
      document.head.removeChild(poppinsLink);
    };
  }, []);
  
  return (
    <div className="relative overflow-hidden" style={{ 
      height: '100vh', 
      maxHeight: '100vh',
      width: '100%',
      boxSizing: 'border-box',
      position: 'relative' 
    }}>
      {/* Dynamic Ad Background */}
      <AdBackground currentAdPartner={currentAdPartner} adMetadata={adMetadata} />
  
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
        <div className="w-full max-w-md mx-auto md:mx-0 mt-auto md:mt-0 mb-6">
          <div
            style={{
              transform: 'translateZ(0)',
              width: '100%',
              maxWidth: '28rem',
              position: 'relative',
              boxSizing: 'border-box'
            }}
          >
            <SearchForm onSearch={onSearch} initialData={initialData} />
          </div>
        </div>
        
        {/* British Airways promotional text - responsive positioning */}
        <a
          href="https://www.britishairways.com/content/information/travel-classes/club-world"
          target="_blank"
          rel="noopener noreferrer"
          className="block relative text-center max-w-xs mx-auto mt-8 md:absolute md:text-right md:max-w-3xl md:mx-0 md:mt-0 md:bottom-10 md:right-10"
          style={{
            padding: '20px',
            color: 'rgba(255, 255, 250, 0.95)',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.25)',
            zIndex: 20,
            textDecoration: 'none',
            cursor: 'pointer',
            transition: 'opacity 0.2s ease-in-out'
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
        >
          <div style={{
            fontSize: 'clamp(42px, 4vw, 64px)',
            marginBottom: '12px',
            fontFamily: '"Libre Caslon Display", serif',
            fontStyle: 'italic',
            fontWeight: 400,
            lineHeight: 1.2
          }}>
            Experience British Airways
          </div>
          <div style={{
            fontSize: 'clamp(24px, 2.5vw, 32px)',
            fontFamily: '"Poppins", sans-serif',
            fontWeight: 400,
            letterSpacing: '0.02em'
          }}>
            See their new Club World experience
          </div>
        </a>
      </div>
    </div>
  );
};

export default HomePage; 