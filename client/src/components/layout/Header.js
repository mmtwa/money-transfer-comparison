import React from 'react';

/**
 * Header component with logo
 */
const Header = ({ onLogoClick, onAboutClick }) => {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-[9999] py-4">
      <div className="container mx-auto px-4 flex justify-center items-center">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={onLogoClick}>
          <img 
            src="/mmtlogo.png" 
            alt="Money Transfer Comparison" 
            className="h-10 w-auto" 
          />
        </div>
        
        {/* About Us button removed but we keep the onAboutClick prop for future use */}
      </div>
    </header>
  );
};

export default Header; 