import React from 'react';
import SearchForm from './SearchForm';

/**
 * Home page container with background imagery and search form
 */
const HomePage = ({ onSearch, initialData }) => {
  return (
    <div className="relative h-screen overflow-hidden">
      {/* Background images with better scaling - using multiple background layers */}
      <div className="absolute inset-0">
        {/* Mobile background (default) */}
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat block sm:hidden"
             style={{ backgroundImage: "url('/mobile-ad.jpg')" }}></div>
             
        {/* Tablet background */}
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat hidden sm:block md:hidden"
             style={{ backgroundImage: "url('/tablet-ad.jpg')" }}></div>
             
        {/* Desktop background - with object-fit approach */}
        <div className="absolute inset-0 hidden md:block overflow-hidden">
          <img 
            src="/desktop-ad.jpg" 
            alt="Background" 
            className="w-full h-full object-top object-cover" 
          />
        </div>
      </div>
  
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