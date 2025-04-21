import React from 'react';
import { ExternalLink } from 'lucide-react';
import { formatAmount, getCurrencySymbol } from '../../utils/currency';

/**
 * Component to display a provider's information in a card
 */
const ProviderCard = ({ 
  provider, 
  index, 
  fromCurrency, 
  toCurrency, 
  amount 
}) => {
  return (
    <div 
      className={`border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow ${index === 0 ? 'border-green-300 bg-green-50' : 'border-gray-200'}`}
    >
      <div className="flex flex-col md:flex-row">
        {/* Provider info */}
        <div className="p-4 md:p-6 flex flex-col items-center justify-center md:w-1/4 bg-white">
          <div className="mb-2">
            <img 
              src={provider.logo} 
              alt={`${provider.name} logo`} 
              className="w-24 h-24 object-contain"
            />
          </div>
          <div className="font-bold text-base md:text-lg text-center">{provider.name}</div>
          <div className="text-sm text-yellow-500 mt-1">
            {'★'.repeat(Math.floor(provider.rating))}
            {provider.rating % 1 >= 0.5 ? '½' : ''}
            {'☆'.repeat(5 - Math.ceil(provider.rating))}
            <span className="text-gray-600 ml-1">({provider.rating})</span>
          </div>
        </div>
        
        {/* Exchange details */}
        <div className="p-4 md:p-6 border-t md:border-t-0 md:border-l border-gray-200 md:w-2/4">
          <div className="flex flex-col md:flex-row justify-between mb-4">
            <div className="mb-2 md:mb-0">
              <div className="text-xs md:text-sm text-gray-500">You Send</div>
              <div className="font-bold text-sm md:text-base">{getCurrencySymbol(fromCurrency)}{formatAmount(amount)} {fromCurrency}</div>
            </div>
            <div className="mb-2 md:mb-0 md:text-center">
              <div className="text-xs md:text-sm text-gray-500">Exchange Rate</div>
              <div className="font-bold text-sm md:text-base">1 {fromCurrency} = {provider.rate.toFixed(4)} {toCurrency}</div>
            </div>
            <div className="md:text-right">
              <div className="text-xs md:text-sm text-gray-500">They Receive</div>
              <div className="font-bold text-sm md:text-base">{getCurrencySymbol(toCurrency)}{formatAmount(provider.amountReceived)} {toCurrency}</div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 text-xs md:text-sm">
            <div className="bg-gray-50 p-2 md:p-3 rounded">
              <span className="text-gray-500">Fee:</span> {getCurrencySymbol(fromCurrency)}{provider.transferFee.toFixed(2)}
            </div>
            <div className="bg-gray-50 p-2 md:p-3 rounded">
              <span className="text-gray-500">Rate Margin:</span> {(provider.exchangeRateMargin * 100).toFixed(2)}%
            </div>
            <div className="bg-gray-50 p-2 md:p-3 rounded">
              <span className="text-gray-500">Delivery:</span> {provider.transferTime}
            </div>
          </div>
          
          <div className="mt-4">
            <div className="text-xs md:text-sm text-gray-600 font-medium">Features:</div>
            <div className="flex flex-wrap mt-1">
              {provider.features.map((feature, idx) => (
                <span key={idx} className="text-xs bg-blue-100 text-blue-800 rounded-full px-2 py-1 mr-2 mb-2">{feature}</span>
              ))}
            </div>
          </div>
        </div>
        
        {/* CTA */}
        <div className="p-4 md:p-6 border-t md:border-t-0 md:border-l border-gray-200 flex flex-col items-center justify-center md:w-1/4 bg-white">
          <div className="mb-2 font-bold text-center text-xl md:text-2xl">
            {getCurrencySymbol(toCurrency)}{formatAmount(provider.amountReceived)}
          </div>
          <div className="text-xs mb-4 text-center text-gray-500">
            Total fees: {getCurrencySymbol(fromCurrency)}{formatAmount(provider.totalFees)}
          </div>
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 md:py-3 px-4 rounded-md flex items-center justify-center">
            Get Deal
            <ExternalLink size={16} className="ml-1" />
          </button>
          <div className="mt-3 text-xs text-blue-600 text-center hover:underline cursor-pointer">
            See full details
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderCard; 