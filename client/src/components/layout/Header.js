import React from 'react';

/**
 * Header component with logo
 */
const Header = ({ onLogoClick }) => {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-[9999] py-4">
      <div className="container mx-auto px-4 flex justify-center">
        <img 
          src="/mmtlogo c.png" 
          alt="mymoneytransfers Logo" 
          className="h-12 md:h-12 lg:h-16 cursor-pointer hover:opacity-80 transition" 
          onClick={onLogoClick}
        />
      </div>
    </header>
  );
};

export default Header; 