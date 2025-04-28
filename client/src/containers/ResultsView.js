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
  const [bestDealProvider, setBestDealProvider] = useState(null);
  const [error, setError] = useState(null);
  
  // Fetch data from API on component mount or when search parameters change
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        console.log('Fetching exchange rates for:', { fromCurrency, toCurrency, amount });
        
        // Fetch providers and exchange rates from Wise v3 comparisons API
        try {
          console.log('Fetching data from Wise v3 comparison API');
          
          // First try accessing through our backend proxy
          let comparisonData = null;
          
          try {
            const comparisonResponse = await apiService.getWiseComparison(
              fromCurrency, 
              toCurrency, 
              amount,
              // Get source country based on currency if needed
              fromCurrency === 'GBP' ? 'GB' : null,
              toCurrency === 'EUR' ? 'DE' : null
            );
            
            if (comparisonResponse.data && comparisonResponse.data.success) {
              comparisonData = comparisonResponse.data.data;
              console.log('Wise Comparison Data from backend:', comparisonData);
            }
          } catch (backendError) {
            console.error('Error fetching from backend, trying direct API:', backendError);
            // If backend proxy fails, try direct API call as fallback
            try {
              const directResponse = await apiService.getWiseV3Comparison(
                fromCurrency,
                toCurrency,
                amount
              );
              
              if (directResponse.data) {
                comparisonData = directResponse.data;
                console.log('Wise Comparison Data from direct API:', comparisonData);
              }
            } catch (directError) {
              console.error('Error fetching from direct API:', directError);
              throw new Error('Failed to fetch comparison data from both backend and direct API');
            }
          }
          
          if (comparisonData && comparisonData.providers) {
            const allProviders = comparisonData.providers;
            console.log(`Found ${allProviders.length} providers from comparison API`);
            
            // Process all providers from comparison API
            const providers = allProviders
              .filter(p => p.quotes && p.quotes.length > 0)
              .map(provider => {
                // Find the best quote for this provider
                const quote = provider.quotes.reduce((best, current) => 
                  (current.receivedAmount > best.receivedAmount) ? current : best, provider.quotes[0]);
                
                // Find or calculate markup
                const markup = quote.markup !== undefined ? quote.markup : 0;
                
                // Extract delivery time if available
                let transferTime = 'Unknown';
                let transferTimeHours = { min: 24, max: 72 };
                
                if (quote.estimatedDelivery) {
                  transferTime = quote.estimatedDelivery;
                  
                  // Try to estimate hours from the delivery time text
                  if (transferTime.includes('hour')) {
                    const hourMatch = transferTime.match(/(\d+).*?hour/);
                    if (hourMatch && hourMatch[1]) {
                      const hours = parseInt(hourMatch[1]);
                      transferTimeHours = { min: hours, max: hours };
                    }
                  } else if (transferTime.includes('day')) {
                    const dayMatch = transferTime.match(/(\d+).*?day/);
                    if (dayMatch && dayMatch[1]) {
                      const days = parseInt(dayMatch[1]);
                      transferTimeHours = { min: days * 24, max: days * 24 };
                    }
                  }
                }
                
                // Basic provider object from comparison API data
                return {
                  providerId: `provider-${provider.id}`,
                  providerCode: provider.alias,
                  providerName: provider.name,
                  providerLogo: provider.logos?.normal?.svgUrl || provider.logos?.normal?.pngUrl || provider.logo,
                  baseRate: quote.rate,
                  effectiveRate: quote.rate,
                  transferFee: quote.fee || 0,
                  marginPercentage: markup * 100,
                  marginCost: parseFloat(amount) * quote.rate * markup,
                  totalCost: (quote.fee || 0) + (parseFloat(amount) * quote.rate * markup),
                  amountReceived: quote.receivedAmount,
                  sourceCountry: quote.sourceCountry,
                  targetCountry: quote.targetCountry,
                  transferTimeHours,
                  transferTime,
                  rating: 4.0, // Default rating when not available
                  methods: ['bank_transfer'],
                  realTimeApi: true,
                  timestamp: new Date().toISOString()
                };
              });
            
            console.log('Processed providers:', providers.length);
            
            // Find Wise provider to get mid-market rate
            const wiseProvider = providers.find(p => 
              p.providerCode?.toLowerCase() === 'wise' || 
              p.providerName?.toLowerCase()?.includes('wise'));
            
            // If Wise provider found, use its rate as mid-market rate
            let midMarketRate = null;
            if (wiseProvider) {
              midMarketRate = wiseProvider.effectiveRate;
              console.log('Found mid-market rate from Wise:', midMarketRate);
              
              // Also ensure the Wise provider itself has zero margin
              wiseProvider.marginPercentage = 0;
              wiseProvider.marginCost = 0;
              wiseProvider.totalCost = wiseProvider.transferFee;
            }
            
            // For other providers, adjust their margin calculations
            // based on the mid-market rate if available
            if (midMarketRate) {
              providers.forEach(provider => {
                // Skip Wise itself
                if (provider !== wiseProvider) {
                  provider.baseRate = midMarketRate;
                  
                  // Calculate margin as the difference between mid-market and effective rate
                  if (provider.baseRate > 0) {
                    // Use markup from quote if available, otherwise calculate
                    if (provider.marginPercentage === 0) {
                      provider.marginPercentage = ((provider.baseRate - provider.effectiveRate) / provider.baseRate) * 100;
                      provider.marginCost = parseFloat(amount) * (provider.baseRate - provider.effectiveRate);
                      provider.totalCost = provider.transferFee + provider.marginCost;
                    }
                  }
                }
              });
            }
            
            // Set the provider results and sort them
            setProviderResults(providers);
            sortResults(providers, sortBy, sortDirection);
            
          } else {
            setError('No provider data available from Wise comparison API');
          }
        } catch (comparisonError) {
          console.error('Error fetching Wise comparison data:', comparisonError);
          setError('Error fetching provider data: ' + comparisonError.message);
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
  
  // Set best deal provider whenever the provider results change
  useEffect(() => {
    if (providerResults.length > 0) {
      // Find the provider with the highest amount received
      const bestProvider = [...providerResults].sort((a, b) => 
        b.amountReceived - a.amountReceived
      )[0];
      
      setBestDealProvider(bestProvider);
    }
  }, [providerResults]);
  
  const sortResults = (results, sortKey, direction) => {
    const sorted = [...results].sort((a, b) => {
      let comparison = 0;
      
      switch (sortKey) {
        case 'rate':
          // For exchange rate, higher is better (more destination currency per source currency)
          // Use effectiveRate which accounts for all fees in the actual rate calculation
          comparison = a.effectiveRate - b.effectiveRate;
          break;
        case 'fees':
          // For fees, lower is better (less fees means more money received)
          comparison = a.transferFee - b.transferFee;
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
        
        {/* Sticky Summary Panel */}
        <div className="mb-5 bg-white rounded-lg shadow-md border border-gray-100 p-3 py-4 sticky top-[calc(4rem+1px)] z-40 transition-all duration-200 backdrop-blur-sm bg-white/95">
          {/* Mobile view: 2-line layout */}
          <div className="sm:hidden">
            {/* First line: labels */}
            <div className="grid grid-cols-3 gap-2 mb-2">
              <div className="text-sm font-medium text-gray-700">Summary</div>
              <div className="text-xs text-gray-500 text-center">You send</div>
              <div className="text-xs text-gray-500 text-center">They receive</div>
            </div>
            
            {/* Second line: content */}
            <div className="grid grid-cols-3 gap-2 items-center">
              <div>
                <button 
                  onClick={onBackToSearch}
                  className="px-2 py-1 bg-white border border-indigo-500 text-indigo-600 rounded-md hover:bg-indigo-50 transition-colors text-xs"
                >
                  Edit
                </button>
              </div>
              
              <div className="flex items-center justify-center">
                <CurrencyFlag currency={fromCurrency} size="sm" />
                <span className="ml-1 font-semibold text-sm whitespace-nowrap">
                  {getCurrencySymbol(fromCurrency)} {formatAmount(amount)}
                </span>
              </div>
              
              <div className="flex items-center justify-center">
                <CurrencyFlag currency={toCurrency} size="sm" />
                <span className="ml-1 font-semibold text-sm whitespace-nowrap">
                  {bestDealProvider 
                    ? `${getCurrencySymbol(toCurrency)} ${formatAmount(bestDealProvider.amountReceived)}`
                    : `Loading...`
                  }
                </span>
              </div>
            </div>
          </div>
          
          {/* Tablet/Desktop view: original layout */}
          <div className="hidden sm:block">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Summary</h3>
            <div className="flex flex-row items-center justify-between lg:justify-center lg:relative">
              <div className="flex flex-row items-center mr-4">
                <div className="text-center">
                  <div className="text-xs text-gray-500 mb-1">You send</div>
                  <div className="flex items-center justify-center">
                    <CurrencyFlag currency={fromCurrency} size="sm" />
                    <span className="ml-2 font-semibold">
                      {getCurrencySymbol(fromCurrency)} {formatAmount(amount)} {fromCurrency}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center mx-4 my-0">
                  <ArrowRight size={16} className="text-gray-400" />
                </div>
                
                <div className="text-center">
                  <div className="text-xs text-gray-500 mb-1">They receive</div>
                  <div className="flex items-center justify-center">
                    <CurrencyFlag currency={toCurrency} size="sm" />
                    <span className="ml-2 font-semibold">
                      {bestDealProvider 
                        ? `${getCurrencySymbol(toCurrency)} ${formatAmount(bestDealProvider.amountReceived)} ${toCurrency}`
                        : `Loading...`
                      }
                    </span>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={onBackToSearch}
                className="px-3 py-1.5 bg-white border border-indigo-500 text-indigo-600 rounded-md hover:bg-indigo-50 transition-colors text-sm w-auto lg:absolute lg:right-0"
              >
                Edit
              </button>
            </div>
          </div>
        </div>
        
        {/* Best Deal Card - visual and clickable */}
        {bestDealProvider && (
          <div 
            onClick={() => scrollToProvider(bestDealProvider.providerId)}
            className="mb-5 rounded-lg shadow-sm border border-indigo-200 p-4 cursor-pointer hover:shadow-md transition-all metal-shimmer gradient-bg relative z-10"
          >
            <div className="flex flex-col md:flex-row items-center justify-between relative z-10">
              <div className="flex items-center mb-3 md:mb-0">
                <Award size={24} className="text-indigo-600 mr-2" />
                <h3 className="font-bold text-indigo-800 text-lg">Best Deal</h3>
              </div>
              
              <div className="flex flex-col md:flex-row items-center justify-center md:flex-1">
                <img 
                  src={bestDealProvider.providerLogo} 
                  alt={`${bestDealProvider.providerName} logo`} 
                  className="w-16 h-16 object-contain mb-3 md:mb-0 md:mr-4"
                  onError={(e) => {
                    // Try to fix the path if it starts with "/"
                    if ((bestDealProvider.providerLogo || '').startsWith('/')) {
                      const imgSrc = bestDealProvider.providerLogo;
                      e.target.src = imgSrc.substring(1);
                    } else {
                      // Fall back to a direct provider logo based on provider name
                      const providerName = (bestDealProvider.providerName || '').toLowerCase();
                      if (providerName.includes('wise')) {
                        e.target.src = '/images/providers/wise.png';
                        // If that fails, try without the leading slash
                        e.target.onerror = () => { e.target.src = 'images/providers/wise.png'; };
                      } else if (providerName.includes('xe')) {
                        e.target.src = '/images/providers/xe.png';
                        // If that fails, try without the leading slash
                        e.target.onerror = () => { e.target.src = 'images/providers/xe.png'; };
                      } else if (providerName.includes('western') || providerName.includes('union')) {
                        e.target.src = '/images/providers/westernunion.png';
                        // If that fails, try without the leading slash
                        e.target.onerror = () => { e.target.src = 'images/providers/westernunion.png'; };
                      } else {
                        // Default fallback
                        e.target.src = '/images/providers/default.png';
                        // If that fails, try without the leading slash
                        e.target.onerror = () => { e.target.src = 'images/providers/default.png'; };
                      }
                    }
                  }}
                />
                
                <div className="text-center">
                  <div className="text-xs uppercase font-medium text-indigo-600 mb-1">They receive</div>
                  <div className="text-2xl font-bold">
                    <span className="text-shimmer">
                      {getCurrencySymbol(toCurrency)} {formatAmount(bestDealProvider.amountReceived)}
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
                <span className="ml-2 text-gray-400">
                  ({sortDirection === 'desc' ? 'Highest first' : 'Lowest first'})
                </span>
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
                    onClick={() => {
                      if (sortBy === 'amount') {
                        toggleSortDirection();
                      } else {
                        setSortBy('amount');
                        setSortDirection('desc'); // Default to highest first
                      }
                    }}
                    className={`px-3 py-2 rounded text-sm flex justify-between items-center ${sortBy === 'amount' ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-gray-50'}`}
                  >
                    Amount Received
                    {sortBy === 'amount' && (
                      <span className="ml-1">
                        <ArrowUpDown size={14} />
                      </span>
                    )}
                  </button>
                  
                  <button 
                    onClick={() => {
                      if (sortBy === 'rate') {
                        toggleSortDirection();
                      } else {
                        setSortBy('rate');
                        setSortDirection('desc'); // Default to highest first
                      }
                    }}
                    className={`px-3 py-2 rounded text-sm flex justify-between items-center ${sortBy === 'rate' ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-gray-50'}`}
                  >
                    Exchange Rate
                    {sortBy === 'rate' && (
                      <span className="ml-1">
                        <ArrowUpDown size={14} />
                      </span>
                    )}
                  </button>
                  
                  <button 
                    onClick={() => {
                      if (sortBy === 'fees') {
                        toggleSortDirection();
                      } else {
                        setSortBy('fees');
                        setSortDirection('asc'); // Default to lowest first for fees
                      }
                    }}
                    className={`px-3 py-2 rounded text-sm flex justify-between items-center ${sortBy === 'fees' ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-gray-50'}`}
                  >
                    Fees
                    {sortBy === 'fees' && (
                      <span className="ml-1">
                        <ArrowUpDown size={14} />
                      </span>
                    )}
                  </button>
                  
                  <button 
                    onClick={() => {
                      if (sortBy === 'rating') {
                        toggleSortDirection();
                      } else {
                        setSortBy('rating');
                        setSortDirection('desc'); // Default to highest first
                      }
                    }}
                    className={`px-3 py-2 rounded text-sm flex justify-between items-center ${sortBy === 'rating' ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-gray-50'}`}
                  >
                    User Rating
                    {sortBy === 'rating' && (
                      <span className="ml-1">
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
              isBestDeal={provider.providerId === bestDealProvider?.providerId}
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