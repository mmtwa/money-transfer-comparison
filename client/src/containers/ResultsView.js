import React, { useState } from 'react';
import { ArrowUpDown, ChevronLeft, SlidersHorizontal, ArrowRight, Award } from 'lucide-react';
import ProviderCard from '../components/ui/ProviderCard';
import CurrencyFlag from '../components/ui/CurrencyFlag';
import { formatAmount, getCurrencySymbol } from '../utils/currency';
import { calculateProviderResults } from '../utils/providers';
import { exchangeRates } from '../utils/currency';

/**
 * Container for displaying money transfer comparison results
 */
const ResultsView = ({ searchData, onBackToSearch }) => {
  const { fromCurrency, toCurrency, amount } = searchData;
  const [sortBy, setSortBy] = useState('amount');
  const [sortDirection, setSortDirection] = useState('desc');
  const [showSortOptions, setShowSortOptions] = useState(false);
  
  const toggleSortDirection = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };
  
  // Calculate provider results based on sort criteria
  const providerResults = calculateProviderResults(
    fromCurrency, 
    toCurrency, 
    amount, 
    exchangeRates, 
    sortBy, 
    sortDirection
  );
  
  // Scroll to provider card when clicking best deal
  const scrollToProvider = (id) => {
    const element = document.getElementById(`provider-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };
  
  return (
    <>
      {/* Custom animations */}
      <style jsx global>{`
        @keyframes shimmer {
          0% {
            background-position: -100% 0;
          }
          100% {
            background-position: 100% 0;
          }
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite linear;
          background-size: 200% 100%;
        }
        
        @keyframes shimmer-bg {
          0% {
            background-position: 0% 50%;
          }
          100% {
            background-position: 100% 50%;
          }
        }
        .animate-shimmer-bg {
          background-size: 200% 200%;
          animation: shimmer-bg 1.5s ease infinite alternate;
          background-image: linear-gradient(
            60deg,
            rgba(159, 168, 218, 0.2) 0%,
            rgba(223, 229, 254, 0.4) 25%, 
            rgba(199, 210, 254, 0.2) 50%,
            rgba(165, 180, 252, 0.4) 75%,
            rgba(224, 231, 255, 0.2) 100%
          );
        }
        
        .metal-shimmer {
          position: relative;
          overflow: hidden;
        }
        
        .metal-shimmer::after {
          content: "";
          position: absolute;
          top: -100%;
          left: -100%;
          width: 50%;
          height: 300%;
          background: rgba(255, 255, 255, 0.2);
          transform: rotate(30deg);
          animation: card-shimmer 7s linear infinite;
        }
        
        @keyframes card-shimmer {
          0%, 10% {
            left: -100%;
          }
          35%, 100% {
            left: 200%;
          }
        }
        
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
        
        .gradient-bg {
          background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 50%, #c7d2fe 100%);
        }
      `}</style>
      
      <div className="container mx-auto flex-1 px-4 py-5 max-w-6xl" style={{ zIndex: 100, position: 'relative' }}>
        <div className="mb-4">
          <button 
            onClick={onBackToSearch}
            className="text-indigo-600 hover:text-indigo-800 flex items-center transition-colors font-medium"
          >
            <ChevronLeft size={18} className="mr-1" /> Back to search
          </button>
        </div>
        
        {/* Compact Summary Panel */}
        <div className="mb-5 bg-white rounded-lg shadow-sm border border-gray-100 p-4 relative z-10">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Summary</h3>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col sm:flex-row sm:items-center sm:mr-4">
              <div className="mb-3 sm:mb-0 text-left">
                <div className="text-xs text-gray-500 mb-1">You send</div>
                <div className="flex items-center">
                  <CurrencyFlag currency={fromCurrency} size="sm" />
                  <span className="ml-2 font-semibold">
                    {getCurrencySymbol(fromCurrency)} {formatAmount(amount)} {fromCurrency}
                  </span>
                </div>
              </div>
              
              <div className="hidden sm:flex sm:items-center sm:mx-4 sm:my-0">
                <ArrowRight size={16} className="text-gray-400" />
              </div>
              
              <div className="text-left">
                <div className="text-xs text-gray-500 mb-1">They receive</div>
                <div className="flex items-center">
                  <CurrencyFlag currency={toCurrency} size="sm" />
                  <span className="ml-2 font-semibold">
                    {providerResults.length > 0 
                      ? `${getCurrencySymbol(toCurrency)} ${formatAmount(providerResults[0].amountReceived)} ${toCurrency}`
                      : `~ ${getCurrencySymbol(toCurrency)} ${formatAmount(amount * exchangeRates[fromCurrency][toCurrency])} ${toCurrency}`
                    }
                  </span>
                </div>
              </div>
            </div>
            
            <button 
              onClick={onBackToSearch}
              className="px-3 py-1.5 bg-white border border-indigo-500 text-indigo-600 rounded-md hover:bg-indigo-50 transition-colors text-sm w-full sm:w-auto mt-3 sm:mt-0"
            >
              Edit
            </button>
          </div>
        </div>
        
        {/* Best Deal Card - visual and clickable */}
        {providerResults.length > 0 && (
          <div 
            onClick={() => scrollToProvider(providerResults[0].id)}
            className="mb-5 rounded-lg shadow-sm border border-indigo-200 p-4 cursor-pointer hover:shadow-md transition-all metal-shimmer gradient-bg relative z-10"
          >
            <div className="flex flex-col md:flex-row items-center justify-between relative z-10">
              <div className="flex items-center mb-3 md:mb-0">
                <Award size={24} className="text-indigo-600 mr-2" />
                <h3 className="font-bold text-indigo-800 text-lg">Best Deal</h3>
              </div>
              
              <div className="flex flex-col md:flex-row items-center justify-center md:flex-1">
                <img 
                  src={providerResults[0].logo} 
                  alt={`${providerResults[0].name} logo`} 
                  className="w-16 h-16 object-contain mb-3 md:mb-0 md:mr-4"
                />
                
                <div className="text-center">
                  <div className="text-xs uppercase font-medium text-indigo-600 mb-1">They receive</div>
                  <div className="text-2xl font-bold">
                    <span className="text-shimmer">
                      {getCurrencySymbol(toCurrency)} {formatAmount(providerResults[0].amountReceived)}
                    </span>
                  </div>
                </div>
              </div>
              
              <button className="text-xs bg-white px-3 py-1.5 rounded-md shadow-sm border border-indigo-100 text-indigo-700 font-medium flex items-center mt-3 md:mt-0">
                View Provider
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              </button>
            </div>
          </div>
        )}
        
        {/* Sorting options - Mobile friendly dropdown */}
        <div className="mb-5 relative z-10">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="p-3 flex justify-between items-center cursor-pointer" onClick={() => setShowSortOptions(!showSortOptions)}>
              <div className="font-medium flex items-center">
                <SlidersHorizontal size={16} className="mr-2 text-indigo-500" />
                Sort by: <span className="ml-2 text-indigo-600">{sortBy === 'rate' ? 'Exchange Rate' : sortBy === 'amount' ? 'Amount Received' : sortBy === 'fees' ? 'Fees' : 'User Rating'}</span>
              </div>
              <button className="text-gray-500">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className={`transition-transform duration-200 ${showSortOptions ? 'rotate-180' : ''}`}
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
            </div>
            
            {showSortOptions && (
              <div className="p-3 pt-0 border-t border-gray-100">
                <div className="flex flex-wrap gap-2">
                  <button 
                    className={`px-3 py-1.5 rounded-md flex items-center whitespace-nowrap 
                      ${sortBy === 'amount' 
                        ? 'bg-indigo-100 text-indigo-700 font-medium' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    onClick={() => { setSortBy('amount'); toggleSortDirection(); }}
                  >
                    Amount Received
                    {sortBy === 'amount' && (
                      <ArrowUpDown size={14} className="ml-1.5" />
                    )}
                  </button>
                  <button 
                    className={`px-3 py-1.5 rounded-md flex items-center whitespace-nowrap 
                      ${sortBy === 'rate' 
                        ? 'bg-indigo-100 text-indigo-700 font-medium' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    onClick={() => { setSortBy('rate'); toggleSortDirection(); }}
                  >
                    Exchange Rate
                    {sortBy === 'rate' && (
                      <ArrowUpDown size={14} className="ml-1.5" />
                    )}
                  </button>
                  <button 
                    className={`px-3 py-1.5 rounded-md flex items-center whitespace-nowrap 
                      ${sortBy === 'fees' 
                        ? 'bg-indigo-100 text-indigo-700 font-medium' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    onClick={() => { setSortBy('fees'); toggleSortDirection(); }}
                  >
                    Fees
                    {sortBy === 'fees' && (
                      <ArrowUpDown size={14} className="ml-1.5" />
                    )}
                  </button>
                  <button 
                    className={`px-3 py-1.5 rounded-md flex items-center whitespace-nowrap 
                      ${sortBy === 'rating' 
                        ? 'bg-indigo-100 text-indigo-700 font-medium' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    onClick={() => { setSortBy('rating'); toggleSortDirection(); }}
                  >
                    User Rating
                    {sortBy === 'rating' && (
                      <ArrowUpDown size={14} className="ml-1.5" />
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Results list */}
        <div className="space-y-5 relative z-10">
          {providerResults.map((provider, index) => (
            <ProviderCard 
              key={provider.id}
              provider={provider}
              index={index}
              fromCurrency={fromCurrency}
              toCurrency={toCurrency}
              amount={amount}
              id={`provider-${provider.id}`}
            />
          ))}
        </div>
        
        {/* Missing results info */}
        {providerResults.length === 0 && (
          <div className="mt-6 text-center p-6 bg-white rounded-lg border border-gray-200 shadow-sm relative z-10">
            <div className="text-gray-600 font-medium">No results found for your search criteria.</div>
            <button 
              onClick={onBackToSearch}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              Modify Search
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default ResultsView; 