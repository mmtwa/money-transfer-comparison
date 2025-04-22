import React, { useState, useEffect } from 'react';
import SearchForm from './SearchForm';
import AdBackground from '../components/AdBackground';
import { selectAdPartner, trackImpression } from '../services/adService';
import adPartners from '../config/adPartners';

/**
 * Home page container with dynamic ad backgrounds and search form
 */
const HomePage = ({ onSearch, initialData }) => {
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
    <div className="relative h-screen overflow-hidden">
      {/* Dynamic Ad Background */}
      <AdBackground currentAdPartner={currentAdPartner} adMetadata={adMetadata} />
  
      {/* Centered Logo */}
      <div className="relative z-10 w-full flex justify-center md:justify-center lg:justify-start lg:pl-10 pt-6 md:pt-8 lg:pt-10">
        <img src="/mmtlogo.png" alt="mymoneytransfers Logo" className="hidden md:block h-8 md:h-10 lg:h-12" />
      </div>

      {/* Main Content with centered search tool */}
      <div className="relative z-10 flex flex-col items-center lg:items-start justify-center h-[calc(100vh-80px)] px-4 py-6 md:py-8 lg:pl-10 lg:py-12">
        {/* Search Tool - centered on mobile and tablet */}
        <div className="w-full max-w-md mx-auto lg:mx-0">
          <SearchForm onSearch={onSearch} initialData={initialData} />
        </div>
      </div>
    </div>
  );
};

export default HomePage; 