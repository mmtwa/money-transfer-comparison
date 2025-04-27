import React, { useState, useEffect } from 'react';
import { ArrowUpDown, ChevronLeft, SlidersHorizontal, ArrowRight, Award } from 'lucide-react';
import ProviderCard from '../components/ui/ProviderCard';
import CurrencyFlag from '../components/ui/CurrencyFlag';
import { formatAmount, getCurrencySymbol } from '../utils/currency';
import apiService from '../services/apiService';

/**
 * Container for displaying money transfer comparison results
 */
const ResultsView = ({ searchData, onBackToSearch }) => {
  const { fromCurrency, toCurrency, amount } = searchData;
  const [sortBy, setSortBy] = useState('amount');
  const [sortDirection, setSortDirection] = useState('desc');
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [loading, setLoading] = useState(true);
  const [providerResults, setProviderResults] = useState([]);
  const [error, setError] = useState(null);
  
  // Fetch data from API on component mount or when search parameters change
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        console.log('Fetching exchange rates for:', { fromCurrency, toCurrency, amount });
        const response = await apiService.getExchangeRates(fromCurrency, toCurrency, amount);
        console.log('API Response:', response.data);
        
        if (response.data && response.data.success) {
          // Filter out any duplicate wise providers from regular results if we'll be adding them from comparison data
          const results = response.data.data.filter(provider => 
            !(provider.providerCode?.toLowerCase() === 'wise' || 
              provider.providerCode?.toLowerCase() === 'transferwise'));
          
          console.log('Provider results after filtering:', results);
          console.log('Results length:', results.length);
          
          // Set the provider results and then sort them
          setProviderResults(results);
          sortResults(results, sortBy, sortDirection);
          
          // Now also fetch Wise comparison data
          try {
            const comparisonResponse = await apiService.getWiseComparison(
              fromCurrency, 
              toCurrency, 
              amount,
              // Get source and target countries based on currency if needed
              fromCurrency === 'GBP' ? 'GB' : null,
              toCurrency === 'EUR' ? 'DE' : null
            );
            
            if (comparisonResponse.data && comparisonResponse.data.success) {
              console.log('Wise Comparison Data:', comparisonResponse.data.data);
              
              // Parse the comparison data and add to provider results
              if (comparisonResponse.data.data && comparisonResponse.data.data.providers) {
                const wiseProviders = comparisonResponse.data.data.providers;
                
                // Process ALL providers from comparison API
                const newProviders = wiseProviders
                  .filter(p => p.quotes && p.quotes.length > 0)
                  .map(provider => {
                    // Find the best quote for this provider
                    const quote = provider.quotes.reduce((best, current) => 
                      (current.receivedAmount > best.receivedAmount) ? current : best, provider.quotes[0]);
                    
                    // Format delivery time
                    let transferTime = 'Unknown';
                    let transferTimeHours = { min: 24, max: 72 };
                    
                    if (quote.deliveryEstimation) {
                      if (quote.deliveryEstimation.duration) {
                        const duration = quote.deliveryEstimation.duration;
                        
                        // Parse min and max durations, handling null values
                        let minHours = 24;
                        let maxHours = 72; 
                        
                        try {
                          if (duration.min) {
                            // Try to extract hours from PT24H format or similar
                            const minMatch = duration.min.match(/PT(\d+)H/);
                            if (minMatch && minMatch[1]) {
                              minHours = parseInt(minMatch[1]);
                            }
                          }
                          
                          if (duration.max) {
                            // Try to extract hours from PT24H format or similar
                            const maxMatch = duration.max.match(/PT(\d+)H/);
                            if (maxMatch && maxMatch[1]) {
                              maxHours = parseInt(maxMatch[1]);
                            }
                          }
                        } catch (err) {
                          console.warn('Error parsing delivery duration:', err);
                        }
                        
                        transferTime = minHours === maxHours 
                          ? `${minHours} hours` 
                          : `${minHours}-${maxHours} hours`;
                        
                        transferTimeHours = { min: minHours, max: maxHours };
                      } else if (quote.deliveryEstimation.deliveryDate) {
                        // Use delivery date if available instead of duration
                        const deliveryDate = quote.deliveryEstimation.deliveryDate;
                        if (deliveryDate.min || deliveryDate.max) {
                          // Format based on dates
                          const now = new Date();
                          const minDate = deliveryDate.min ? new Date(deliveryDate.min) : null;
                          const maxDate = deliveryDate.max ? new Date(deliveryDate.max) : null;
                          
                          if (maxDate && !minDate) {
                            const daysDiff = Math.ceil((maxDate - now) / (1000 * 60 * 60 * 24));
                            transferTime = daysDiff <= 1 ? "Within 24 hours" : `Within ${daysDiff} days`;
                            transferTimeHours = { min: 1, max: daysDiff * 24 };
                          } else if (minDate && maxDate) {
                            const minDaysDiff = Math.ceil((minDate - now) / (1000 * 60 * 60 * 24));
                            const maxDaysDiff = Math.ceil((maxDate - now) / (1000 * 60 * 60 * 24));
                            transferTime = `${minDaysDiff}-${maxDaysDiff} days`;
                            transferTimeHours = { min: minDaysDiff * 24, max: maxDaysDiff * 24 };
                          }
                        }
                      } else if (quote.deliveryEstimation.durationType) {
                        // Use duration type if specific times aren't available
                        if (quote.deliveryEstimation.durationType === 'SAME_DAY') {
                          transferTime = 'Same day';
                          transferTimeHours = { min: 1, max: 24 };
                        } else if (quote.deliveryEstimation.durationType === 'CALENDAR') {
                          transferTime = '1-3 business days';
                          transferTimeHours = { min: 24, max: 72 };
                        }
                      }
                    }
                    
                    // Return in the format expected by ProviderCard
                    return {
                      providerId: `wise-comparison-${provider.id}`,
                      providerCode: provider.alias,
                      providerName: provider.name,
                      providerLogo: provider.logo,
                      baseRate: quote.rate * 1.005, // Add 0.5% to estimate base rate
                      effectiveRate: quote.rate,
                      transferFee: quote.fee,
                      marginPercentage: quote.markup ? quote.markup * 100 : 0.5,
                      marginCost: (quote.markup ? quote.markup : 0.005) * parseFloat(amount),
                      totalCost: quote.fee + ((quote.markup ? quote.markup : 0.005) * parseFloat(amount)),
                      amountReceived: quote.receivedAmount,
                      transferTimeHours: transferTimeHours,
                      transferTime: transferTime,
                      rating: 4.0, // Default rating when not available
                      methods: ['bank_transfer'],
                      realTimeApi: true,
                      timestamp: new Date().toISOString(),
                      comparisonProvider: true // Mark as coming from comparison API
                    };
                  });
                
                console.log('Adding comparison providers:', newProviders);
                
                // Add the new providers to results and re-sort
                if (newProviders.length > 0) {
                  const allProviders = [...results, ...newProviders];
                  setProviderResults(allProviders);
                  sortResults(allProviders, sortBy, sortDirection);
                }
              }
            }
          } catch (comparisonError) {
            console.error('Error fetching Wise comparison data:', comparisonError);
            // Not setting error state for this as it's supplementary data
          }
        } else {
          setError('Failed to fetch exchange rates');
        }
      } catch (err) {
        console.error('Error fetching exchange rates:', err);
        setError('An error occurred while fetching exchange rates');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [fromCurrency, toCurrency, amount]);
  
  // Handle sorting
  useEffect(() => {
    if (providerResults.length > 0) {
      const sorted = [...providerResults];
      sortResults(sorted, sortBy, sortDirection);
    }
  }, [sortBy, sortDirection]);
  
  const sortResults = (results, sortKey, direction) => {
    const sorted = [...results].sort((a, b) => {
      let comparison = 0;
      
      switch (sortKey) {
        case 'rate':
          comparison = a.effectiveRate - b.effectiveRate;
          break;
        case 'fees':
          comparison = a.totalCost - b.totalCost;
          break;
        case 'amount':
          comparison = a.amountReceived - b.amountReceived;
          break;
        case 'rating':
          comparison = a.rating - b.rating;
          break;
        default:
          comparison = a.amountReceived - b.amountReceived;
      }
      
      return direction === 'asc' ? comparison : -comparison;
    });
    
    setProviderResults(sorted);
  };
  
  const toggleSortDirection = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };
  
  // Scroll to provider card when clicking best deal
  const scrollToProvider = (id) => {
    const element = document.getElementById(`provider-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };
  
  // Show loading state or error
  if (loading) {
    return (
      <div className="container mx-auto flex-1 px-4 py-5 max-w-6xl flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse rounded-full bg-indigo-200 h-24 w-24 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading exchange rates...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto flex-1 px-4 py-5 max-w-6xl">
        <div className="mb-4">
          <button 
            onClick={onBackToSearch}
            className="text-indigo-600 hover:text-indigo-800 flex items-center transition-colors font-medium"
          >
            <ChevronLeft size={18} className="mr-1" /> Back to search
          </button>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          <h3 className="font-bold mb-2">Error</h3>
          <p>{error}</p>
          <button 
            onClick={onBackToSearch}
            className="mt-3 px-4 py-2 bg-red-100 text-red-800 rounded-md hover:bg-red-200"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <>
      {/* Custom animations */}
      <style jsx="true" global="true">{`
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
                      : `Loading...`
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
            onClick={() => scrollToProvider(providerResults[0].providerId)}
            className="mb-5 rounded-lg shadow-sm border border-indigo-200 p-4 cursor-pointer hover:shadow-md transition-all metal-shimmer gradient-bg relative z-10"
          >
            <div className="flex flex-col md:flex-row items-center justify-between relative z-10">
              <div className="flex items-center mb-3 md:mb-0">
                <Award size={24} className="text-indigo-600 mr-2" />
                <h3 className="font-bold text-indigo-800 text-lg">Best Deal</h3>
              </div>
              
              <div className="flex flex-col md:flex-row items-center justify-center md:flex-1">
                <img 
                  src={providerResults[0].providerLogo} 
                  alt={`${providerResults[0].providerName} logo`} 
                  className="w-16 h-16 object-contain mb-3 md:mb-0 md:mr-4"
                  onError={(e) => {
                    // Try to fix the path if it starts with "/"
                    if ((providerResults[0].providerLogo || '').startsWith('/')) {
                      const imgSrc = providerResults[0].providerLogo;
                      e.target.src = imgSrc.substring(1);
                    } else {
                      // Fall back to a direct provider logo based on provider name
                      const providerName = (providerResults[0].providerName || '').toLowerCase();
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
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => setSortBy('amount')}
                    className={`px-3 py-2 rounded text-sm flex justify-between items-center ${sortBy === 'amount' ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-gray-50'}`}
                  >
                    Amount Received
                    {sortBy === 'amount' && (
                      <span onClick={toggleSortDirection} className="ml-1">
                        <ArrowUpDown size={14} />
                      </span>
                    )}
                  </button>
                  
                  <button 
                    onClick={() => setSortBy('rate')}
                    className={`px-3 py-2 rounded text-sm flex justify-between items-center ${sortBy === 'rate' ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-gray-50'}`}
                  >
                    Exchange Rate
                    {sortBy === 'rate' && (
                      <span onClick={toggleSortDirection} className="ml-1">
                        <ArrowUpDown size={14} />
                      </span>
                    )}
                  </button>
                  
                  <button 
                    onClick={() => setSortBy('fees')}
                    className={`px-3 py-2 rounded text-sm flex justify-between items-center ${sortBy === 'fees' ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-gray-50'}`}
                  >
                    Fees
                    {sortBy === 'fees' && (
                      <span onClick={toggleSortDirection} className="ml-1">
                        <ArrowUpDown size={14} />
                      </span>
                    )}
                  </button>
                  
                  <button 
                    onClick={() => setSortBy('rating')}
                    className={`px-3 py-2 rounded text-sm flex justify-between items-center ${sortBy === 'rating' ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-gray-50'}`}
                  >
                    User Rating
                    {sortBy === 'rating' && (
                      <span onClick={toggleSortDirection} className="ml-1">
                        <ArrowUpDown size={14} />
                      </span>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Provider Cards */}
        <div className="space-y-4">
          {providerResults.map((provider) => (
            <ProviderCard
              key={provider.providerId}
              id={provider.providerId}
              provider={provider}
              name={provider.providerName}
              logo={provider.providerLogo}
              fromCurrency={fromCurrency}
              toCurrency={toCurrency}
              amount={amount}
              rate={provider.effectiveRate}
              sendAmount={amount}
              receiveAmount={provider.amountReceived}
              fee={provider.transferFee}
              marginCost={provider.marginCost}
              totalCost={provider.totalCost}
              timeHours={provider.transferTimeHours}
              transferTime={provider.transferTime}
              rating={provider.rating}
              isBestDeal={provider === providerResults[0]}
              isRealTimeApi={provider.realTimeApi}
              code={provider.providerCode}
            />
          ))}
          
          {providerResults.length === 0 && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
              <h3 className="font-medium text-gray-700 mb-2">No results found</h3>
              <p className="text-gray-500">We couldn't find any providers for this currency pair. Please try a different currency pair.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default ResultsView; 