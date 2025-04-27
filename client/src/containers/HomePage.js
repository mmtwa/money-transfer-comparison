import React, { useState, useEffect } from 'react';
import SearchForm from './SearchForm';
import AdBackground from '../components/AdBackground';
import { selectAdPartner, trackImpression } from '../services/adService';
import adPartners from '../config/adPartners';

/**
 * Home page container with dynamic ad backgrounds and search form
 */
const HomePage = ({ onSearch, initialData, onAboutClick }) => {
  // Select the appropriate ad partner based on scheduling and priority
  const [currentAdPartner, setCurrentAdPartner] = useState('default');
  const [adMetadata, setAdMetadata] = useState(adPartners.default);
  
  // Initialize the ad partner on component mount
  useEffect(() => {
    const partnerId = selectAdPartner();
    setCurrentAdPartner(partnerId);
    setAdMetadata(adPartners[partnerId] || adPartners.default);
    
    // Track impression for analytics
    trackImpression(partnerId);
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
  
      {/* Centered Logo - Fixed size container */}
      <div 
        className="relative z-10 w-full flex justify-center md:justify-center lg:justify-start lg:pl-10 pt-6 md:pt-8 lg:pt-10" 
        style={{ 
          minHeight: '80px', 
          height: '80px',
          boxSizing: 'content-box',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0
        }}
      >
        <img 
          src="/mmtlogo.png" 
          alt="mymoneytransfers Logo" 
          className="hidden md:block h-8 md:h-10 lg:h-16"
          style={{ objectFit: 'contain', width: 'auto', height: '100%' }}
          width="160"
          height="64"
          loading="eager"
        />
        
        {/* About Us button removed but we keep the onAboutClick prop for future use */}
      </div>

      {/* Main Content with centered search tool - Fixed position */}
      <div 
        className="relative z-10 flex flex-col items-center lg:items-start justify-center px-4 py-6 md:py-8 lg:pl-10 lg:py-12"
        style={{ 
          position: 'absolute',
          top: '80px',
          left: 0,
          right: 0,
          bottom: 0,
          height: 'calc(100vh - 80px)',
          minHeight: '600px',
          transform: 'translateZ(0)', // Force GPU rendering
          willChange: 'transform',  // Hint to browser about upcoming animations
          boxSizing: 'border-box'
        }}
      >
        {/* Search Tool - centered on mobile and tablet, left-aligned on desktop */}
        <div className="w-full max-w-md mx-auto lg:mx-0"> 
          <div 
            style={{ 
              transform: 'translateZ(0)',
              width: '100%',
              maxWidth: '28rem',
              minHeight: '500px',
              position: 'relative',
              boxSizing: 'border-box'
            }}
          >
            <SearchForm onSearch={onSearch} initialData={initialData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage; 