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
  id
}) => {
  // Generate rating visualization elements
  const renderRating = (rating) => {
    const filledCircles = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;
    const emptyCircles = 5 - Math.ceil(rating);
    
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
          <ThumbsUp size={10} className="mr-1" /> {provider.rating}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Shimmer animation style - only rendered if not already present from ResultsView */}
      <style jsx global>{`
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
          <div className="flex flex-col items-center">
            <div className="mb-1">
              <img 
                src={provider.logo} 
                alt={`${provider.name} logo`} 
                className="w-24 h-24 object-contain"
              />
            </div>
            {renderRating(provider.rating)}
          </div>
          
          <div className="text-right">
            <div className="text-xs uppercase font-medium text-indigo-600">They receive</div>
            <div className="text-2xl font-bold">
              <span className="text-shimmer">
                {getCurrencySymbol(toCurrency)} {formatAmount(provider.amountReceived)}
              </span>
            </div>
            <div className="text-xs text-gray-500 mt-1 bg-indigo-50 py-0.5 px-2 rounded-full inline-block">
              Fees: {getCurrencySymbol(fromCurrency)} {formatAmount(provider.totalFees)}
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
                <div className="font-bold text-left">{`1 ${fromCurrency} = ${provider.rate.toFixed(4)} ${toCurrency}`}</div>
              </div>
            </div>
            
            {/* Delivery Time */}
            <div className="flex items-start">
              <div className="w-1 h-full min-h-[40px] bg-indigo-400 mr-3 self-stretch rounded-full"></div>
              <div className="text-left">
                <div className="text-xs text-gray-500 font-medium mb-1">Delivery Time</div>
                <div>{provider.transferTime}</div>
              </div>
            </div>
            
            {/* Fees */}
            <div className="flex items-start">
              <div className="w-1 h-full min-h-[40px] bg-indigo-400 mr-3 self-stretch rounded-full"></div>
              <div className="text-left">
                <div className="text-xs text-gray-500 font-medium mb-1">Fee</div>
                <div>{getCurrencySymbol(fromCurrency)} {provider.transferFee.toFixed(2)}</div>
              </div>
            </div>
            
            {/* Rate Margin */}
            <div className="flex items-start">
              <div className="w-1 h-full min-h-[40px] bg-indigo-400 mr-3 self-stretch rounded-full"></div>
              <div className="text-left">
                <div className="text-xs text-gray-500 font-medium mb-1">Rate Margin</div>
                <div>{(provider.exchangeRateMargin * 100).toFixed(2)}%</div>
              </div>
            </div>
          </div>
          
          {/* Features */}
          <div className="mt-5 flex flex-wrap items-center">
            <div className="text-xs text-gray-500 font-medium mr-2">Features:</div>
            <div className="flex flex-wrap">
              {provider.features.map((feature, idx) => (
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
          
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md flex items-center justify-center font-medium transition-colors">
            Get Deal
            <ExternalLink size={14} className="ml-1.5" />
          </button>
        </div>
      </div>
    </>
  );
};

export default ProviderCard; 