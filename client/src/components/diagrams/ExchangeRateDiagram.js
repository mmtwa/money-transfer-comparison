import React from 'react';

const ExchangeRateDiagram = () => {
  // Site's color scheme based on the Tailwind indigo palette
  const colors = {
    primary: '#4F46E5', // indigo-600
    secondary: '#6366F1', // indigo-500
    light: '#E0E7FF', // indigo-50
    dark: '#3730A3', // indigo-800
    background: '#FFFFFF',
    text: '#1F2937', // gray-800
  };

  return (
    <div className="w-full max-w-3xl mx-auto my-8">
      <svg viewBox="0 0 800 400" className="w-full h-auto shadow-md rounded-lg">
        {/* Background */}
        <rect width="800" height="400" fill={colors.background} rx="10" ry="10" />
        
        {/* Title */}
        <text x="400" y="40" textAnchor="middle" fill={colors.dark} fontSize="22" fontWeight="bold">
          How Exchange Rates Work
        </text>
        
        {/* Currency Boxes */}
        <rect x="100" y="100" width="200" height="200" fill={colors.light} rx="10" ry="10" stroke={colors.primary} strokeWidth="2" />
        <rect x="500" y="100" width="200" height="200" fill={colors.light} rx="10" ry="10" stroke={colors.primary} strokeWidth="2" />
        
        {/* Currency Symbols */}
        <text x="200" y="170" textAnchor="middle" fill={colors.primary} fontSize="60" fontWeight="bold">£</text>
        <text x="600" y="170" textAnchor="middle" fill={colors.primary} fontSize="60" fontWeight="bold">€</text>
        
        {/* Currency Names */}
        <text x="200" y="230" textAnchor="middle" fill={colors.text} fontSize="18" fontWeight="bold">British Pound</text>
        <text x="600" y="230" textAnchor="middle" fill={colors.text} fontSize="18" fontWeight="bold">Euro</text>
        
        {/* Exchange Rate Arrow */}
        <path d="M 310 150 L 490 150" stroke={colors.secondary} strokeWidth="4" />
        <polygon points="480,140 500,150 480,160" fill={colors.secondary} />
        
        <path d="M 490 250 L 310 250" stroke={colors.secondary} strokeWidth="4" />
        <polygon points="320,240 300,250 320,260" fill={colors.secondary} />
        
        {/* Exchange Rate Text */}
        <rect x="350" y="120" width="100" height="40" fill={colors.secondary} rx="20" ry="20" />
        <text x="400" y="145" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">1 : 1.18</text>
        
        <rect x="350" y="220" width="100" height="40" fill={colors.secondary} rx="20" ry="20" />
        <text x="400" y="245" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">0.85 : 1</text>
        
        {/* Explanation Texts */}
        <text x="400" y="320" textAnchor="middle" fill={colors.text} fontSize="16">
          £1 = €1.18 (GBP/EUR exchange rate)
        </text>
        <text x="400" y="350" textAnchor="middle" fill={colors.text} fontSize="16">
          €1 = £0.85 (EUR/GBP exchange rate)
        </text>
        
        {/* Factors Affecting Rates */}
        <text x="400" y="380" textAnchor="middle" fill={colors.dark} fontSize="14" fontStyle="italic">
          Rates change based on economic factors, policy changes, and market conditions
        </text>
      </svg>
    </div>
  );
};

export default ExchangeRateDiagram; 