import React from 'react';

/**
 * ClickableHeadline component for guide pages
 * Allows users to expand/collapse content sections
 */
const ClickableHeadline = ({ id, children, isExpanded, onClick }) => {
  return (
    <button 
      onClick={() => onClick(id)}
      className="text-2xl font-bold text-gray-800 mb-4 text-left w-full flex items-center focus:outline-none hover:text-indigo-700 transition-colors"
    >
      {children}
      <span className="ml-2">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={`h-5 w-5 transition-transform ${isExpanded ? 'transform rotate-180' : ''}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </span>
    </button>
  );
};

export default ClickableHeadline; 