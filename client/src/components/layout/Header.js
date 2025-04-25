import React from 'react';

/**
 * Header component with logo
 */
const Header = ({ onLogoClick }) => {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-[9999] py-4">
      <div className="container mx-auto px-4 flex justify-center">
        <div className="flex items-center space-x-2">
          <img 
            src="/mmtlogo.png" 
            alt="Money Transfer Comparison" 
            className="h-10 w-auto" 
          />
        </div>
      </div>
    </header>
  );
};

export default Header; 