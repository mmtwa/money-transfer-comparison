import React from 'react';
import { ExternalLink, Check, ThumbsUp } from 'lucide-react';
import { formatAmount, getCurrencySymbol } from '../../utils/currency';

/**
 * Component to display a provider's information in a card
 */
const ProviderCard = ({ 
  provider, 
  index, 
  fromCurrency, 
  toCurrency, 
  amount,
  id,
  name,
  logo,
  rating,
  receiveAmount,
  totalFees,
  rate,
  transferTime,
  transferFee,
  exchangeRateMargin,
  features = []
}) => {
  // Generate rating visualization elements
  const renderRating = (ratingValue) => {
    const filledCircles = Math.floor(ratingValue);
    const hasHalf = ratingValue % 1 >= 0.5;
    const emptyCircles = 5 - Math.ceil(ratingValue);
    
    return (
      <div className="flex items-center">
        {[...Array(filledCircles)].map((_, i) => (
          <div key={`filled-${i}`} className="w-2 h-2 rounded-full bg-yellow-400 mr-1"></div>
        ))}
        {hasHalf && (
          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-yellow-400 to-gray-200 mr-1"></div>
        )}
        {[...Array(emptyCircles)].map((_, i) => (
          <div key={`empty-${i}`} className="w-2 h-2 rounded-full bg-gray-200 mr-1"></div>
        ))}
        <div className="ml-1 flex items-center text-xs text-gray-500">
          <ThumbsUp size={10} className="mr-1" /> {provider?.rating || rating || 0}
        </div>
      </div>
    );
  };

  // Format transfer time for display
  const formatTransferTime = () => {
    // First check if we have a formatted transferTime string
    if (provider?.transferTime || transferTime) {
      const timeValue = provider?.transferTime || transferTime;
      
      // Check if this is an ISO date string (delivered from the Wise API)
      if (timeValue && typeof timeValue === 'string' && timeValue.includes('T') && timeValue.includes('Z')) {
        try {
          // Try to parse the ISO date string
          const deliveryDate = new Date(timeValue);
          const now = new Date();
          
          // Calculate hours difference
          const diffHours = Math.round((deliveryDate - now) / (1000 * 60 * 60));
          
          // If it's the same day
          if (diffHours < 24 && deliveryDate.getDate() === now.getDate()) {
            if (diffHours <= 1) {
              return 'Within 1 hour';
            }
            return `Within ${diffHours} hours`;
          }
          
          // If it's tomorrow
          const tomorrow = new Date(now);
          tomorrow.setDate(tomorrow.getDate() + 1);
          if (deliveryDate.getDate() === tomorrow.getDate() && 
              deliveryDate.getMonth() === tomorrow.getMonth() && 
              deliveryDate.getFullYear() === tomorrow.getFullYear()) {
            return 'Tomorrow';
          }
          
          // If it's within a week
          const daysDiff = Math.round((deliveryDate - now) / (1000 * 60 * 60 * 24));
          if (daysDiff <= 7) {
            return `${daysDiff} days`;
          }
          
          // Format as date
          return deliveryDate.toLocaleDateString();
        } catch (e) {
          // If parsing fails, just return the string
          return timeValue;
        }
      }
      
      return timeValue;
    }
    
    // Fall back to hours format
    const timeHours = provider?.transferTimeHours || provider?.timeHours || { min: null, max: null };
    
    if (timeHours.min !== null && timeHours.max !== null) {
      if (timeHours.min === timeHours.max) {
        return `${timeHours.min} hours`;
      }
      return `${timeHours.min}-${timeHours.max} hours`;
    }
    
    return 'Unknown';
  };

  return (
    <>
      {/* Shimmer animation style - only rendered if not already present from ResultsView */}
      <style jsx="true" global="true">{`
        .text-shimmer {
          background: linear-gradient(
            to right,
            #6366f1 20%,
            #818cf8 40%,
            #4f46e5 60%,
            #6366f1 80%
          );
          background-size: 200% auto;
          background-clip: text;
          text-fill-color: transparent;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: text-shine 1.5s linear infinite;
        }
        
        @keyframes text-shine {
          to {
            background-position: 200% center;
          }
        }
      `}</style>
      
      <div 
        id={id}
        className={`rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow 
          ${index === 0 
            ? 'border-2 border-indigo-600 bg-white' 
            : 'border border-gray-200 bg-white'}`}
      >
        {/* Card Header - Provider info and amount */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex flex-col items-start">
            <div className="mb-1">
              <img 
                src={provider?.logo || logo || '/images/providers/default.png'} 
                alt={`${provider?.name || name || 'Provider'} logo`} 
                className="h-32 w-32 object-contain"
                onError={(e) => {
                  // Try to fix the path if it starts with "/"
                  if ((provider?.logo || logo || '').startsWith('/')) {
                    const imgSrc = provider?.logo || logo;
                    // Try without the leading slash
                    e.target.src = imgSrc.substring(1);
                  } else {
                    // Fall back to a default provider logo based on provider name
                    const providerName = (provider?.name || name || '').toLowerCase();
                    if (providerName.includes('wise')) {
                      e.target.src = 'images/providers/wise.png';
                    } else if (providerName.includes('xe')) {
                      e.target.src = 'images/providers/xe.png';
                    } else if (providerName.includes('western') || providerName.includes('union')) {
                      e.target.src = 'images/providers/westernunion.png';
                    } else {
                      // Default fallback
                      e.target.src = 'images/providers/default.png';
                    }
                  }
                }}
              />
            </div>
            {renderRating(provider?.rating || rating || 0)}
          </div>
          
          <div className="text-right">
            <div className="text-xs uppercase font-medium text-indigo-600">They receive</div>
            <div className="text-2xl font-bold">
              <span className="text-shimmer">
                {getCurrencySymbol(toCurrency)} {formatAmount(provider?.amountReceived || receiveAmount || 0)}
              </span>
            </div>
            <div className="text-xs text-gray-500 mt-1 bg-indigo-50 py-0.5 px-2 rounded-full inline-block">
              Fees: {getCurrencySymbol(fromCurrency)} {formatAmount(provider?.transferFee || transferFee || 0)}
            </div>
          </div>
        </div>
        
        {/* Card Body - Exchange details */}
        <div className="p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Exchange Rate */}
            <div className="flex items-start">
              <div className="w-1 h-full min-h-[40px] bg-indigo-400 mr-3 self-stretch rounded-full"></div>
              <div className="text-left">
                <div className="text-xs text-gray-500 font-medium mb-1">Exchange Rate</div>
                <div className="font-bold text-left">{`1 ${fromCurrency} = ${(provider?.rate || rate || 0).toFixed(4)} ${toCurrency}`}</div>
              </div>
            </div>
            
            {/* Delivery Time */}
            <div className="flex items-start">
              <div className="w-1 h-full min-h-[40px] bg-indigo-400 mr-3 self-stretch rounded-full"></div>
              <div className="text-left">
                <div className="text-xs text-gray-500 font-medium mb-1">Delivery Time</div>
                <div>{formatTransferTime()}</div>
              </div>
            </div>
            
            {/* Fees */}
            <div className="flex items-start">
              <div className="w-1 h-full min-h-[40px] bg-indigo-400 mr-3 self-stretch rounded-full"></div>
              <div className="text-left">
                <div className="text-xs text-gray-500 font-medium mb-1">Fee</div>
                <div>{getCurrencySymbol(fromCurrency)} {formatAmount(provider?.transferFee || transferFee || 0)}</div>
              </div>
            </div>
            
            {/* Rate Margin or Mid Market Rate for Wise */}
            <div className="flex items-start">
              <div className="w-1 h-full min-h-[40px] bg-indigo-400 mr-3 self-stretch rounded-full"></div>
              <div className="text-left">
                <div className="text-xs text-gray-500 font-medium mb-1">
                  {provider.providerCode === 'wise' ? 'Mid Market Rate' : 'Rate Margin'}
                </div>
                <div>
                  {provider.providerCode === 'wise'
                    ? `1 ${fromCurrency} = ${(provider.baseRate || 0).toFixed(4)} ${toCurrency}`
                    : `${((provider?.exchangeRateMargin || exchangeRateMargin || 0) * 100).toFixed(2)}%`}
                </div>
              </div>
            </div>
          </div>
          
          {/* Features */}
          <div className="mt-5 flex flex-wrap items-center">
            <div className="text-xs text-gray-500 font-medium mr-2">Features:</div>
            <div className="flex flex-wrap">
              {(provider?.features || features).map((feature, idx) => (
                <span key={idx} className="flex items-center text-xs text-indigo-700 mr-3 mb-1">
                  <Check size={12} className="mr-1 text-green-500" />
                  {feature}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        {/* Card Footer - CTA */}
        <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
          <button className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline flex items-center">
            See full details
          </button>
          
          <a 
            href={getProviderWebsite(provider?.providerCode || provider?.code || '')} 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md flex items-center justify-center font-medium transition-colors"
          >
            Get Deal
            <ExternalLink size={14} className="ml-1.5" />
          </a>
        </div>
      </div>
    </>
  );
};

// Function to generate provider website URL based on provider code
const getProviderWebsite = (providerCode) => {
  // Convert to lowercase for consistent matching
  const code = providerCode.toLowerCase();
  
  // Map of provider codes to their website URLs
  const websiteMap = {
    'wise': 'https://www.wise.com',
    'transferwise': 'https://www.wise.com',
    'xe': 'https://www.xe.com',
    'westernunion': 'https://www.westernunion.com',
    'moneygram': 'https://www.moneygram.com',
    'paypal': 'https://www.paypal.com',
    'ofx': 'https://www.ofx.com',
    'remitly': 'https://www.remitly.com',
    'currencyfair': 'https://www.currencyfair.com',
    'worldremit': 'https://www.worldremit.com',
    'ria': 'https://www.riamoneytransfer.com',
    'azimo': 'https://www.azimo.com',
    'transfergo': 'https://www.transfergo.com',
    'worldfirst': 'https://www.worldfirst.com',
    'instarem': 'https://www.instarem.com',
    'skrill': 'https://www.skrill.com',
    'revolut': 'https://www.revolut.com'
  };
  
  // Return website URL if it exists in the map, otherwise default to a search
  return websiteMap[code] || `https://www.google.com/search?q=${encodeURIComponent(providerCode)}+money+transfer`;
};

export default ProviderCard; 