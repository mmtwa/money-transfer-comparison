import React, { useState, useEffect } from 'react';
import { ArrowRightCircle, Search, ArrowUpDown, ExternalLink } from 'lucide-react';
import CurrencyWidget from './CurrencyWidget';

// Mock data for providers
const providers = [
  {
    id: 1,
    name: 'Wise (TransferWise)',
    logo: '🔄',
    exchangeRateMargin: 0.005, // 0.5%
    transferFee: 3.99,
    transferTime: '1-2 days',
    rating: 4.8,
    features: ['Low fees', 'No hidden costs', 'Instant transfers available'],
  },
  {
    id: 2,
    name: 'XE Money Transfer',
    logo: '💱',
    exchangeRateMargin: 0.01, // 1%
    transferFee: 0,
    transferTime: '2-3 days',
    rating: 4.5,
    features: ['No transfer fees', 'Competitive rates', 'Easy tracking'],
  },
  {
    id: 3,
    name: 'OFX',
    logo: '🌐',
    exchangeRateMargin: 0.008, // 0.8%
    transferFee: 0,
    transferTime: '3-5 days',
    rating: 4.4,
    features: ['No transfer fees', 'Specialized in large transfers', '24/7 support'],
  },
  {
    id: 4,
    name: 'Western Union',
    logo: '📨',
    exchangeRateMargin: 0.025, // 2.5%
    transferFee: 5.99,
    transferTime: 'Same day',
    rating: 4.0,
    features: ['Cash pickup available', 'Global network', 'Same day transfers'],
  },
  {
    id: 5,
    name: 'Remitly',
    logo: '💸',
    exchangeRateMargin: 0.015, // 1.5%
    transferFee: 2.99,
    transferTime: '0-2 days',
    rating: 4.2,
    features: ['Mobile-friendly', 'Fast delivery', 'First transfer promotion'],
  },
];

// Mock exchange rates data
const exchangeRates = {
  USD: {
    EUR: 0.91,
    GBP: 0.78,
    JPY: 110.23,
    CAD: 1.35,
    AUD: 1.43,
    INR: 73.12,
  },
  EUR: {
    USD: 1.10,
    GBP: 0.86,
    JPY: 121.34,
    CAD: 1.48,
    AUD: 1.58,
    INR: 80.56,
  },
  GBP: {
    USD: 1.28,
    EUR: 1.16,
    JPY: 140.87,
    CAD: 1.72,
    AUD: 1.83,
    INR: 93.45,
  },
  JPY: {
    USD: 0.0091,
    EUR: 0.0082,
    GBP: 0.0071,
    CAD: 0.012,
    AUD: 0.013,
    INR: 0.67,
  },
  CAD: {
    USD: 0.74,
    EUR: 0.67,
    GBP: 0.58,
    JPY: 81.65,
    AUD: 1.06,
    INR: 54.25,
  },
  AUD: {
    USD: 0.70,
    EUR: 0.63,
    GBP: 0.55,
    JPY: 77.14,
    CAD: 0.94,
    INR: 51.23,
  },
  INR: {
    USD: 0.014,
    EUR: 0.012,
    GBP: 0.011,
    JPY: 1.51,
    CAD: 0.018,
    AUD: 0.02,
  },
};

const currencySymbols = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  CAD: 'CA$',
  AUD: 'A$',
  INR: '₹',
};

// Currency flags component
const CurrencyFlag = ({ currency }) => {
  switch (currency) {
    case 'USD':
      return (
        <div className="w-6 h-4 rounded-sm overflow-hidden flex-shrink-0 border border-gray-200">
          <div style={{ background: '#B22234', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ background: '#3C3B6E', width: '30%', height: '50%' }}>                      </div>
                  </div>
                </div>
              ))};
            </div>
          </div>
          
          {/* Footer */}
          <footer className="bg-gray-800 text-white py-8 mt-12">
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row justify-between">
                <div className="mb-6 md:mb-0">
                  <h3 className="text-lg font-bold mb-2">MoneyCompare</h3>
                  <p className="text-gray-400 max-w-xs">Find the best rates for international money transfers.</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                  <div>
                    <h4 className="font-bold mb-3 text-gray-300">Company</h4>
                    <ul className="space-y-2 text-gray-400">
                      <li><a href="#" className="hover:text-white">About</a></li>
                      <li><a href="#" className="hover:text-white">Careers</a></li>
                      <li><a href="#" className="hover:text-white">Press</a></li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold mb-3 text-gray-300">Resources</h4>
                    <ul className="space-y-2 text-gray-400">
                      <li><a href="#" className="hover:text-white">Blog</a></li>
                      <li><a href="#" className="hover:text-white">Guides</a></li>
                      <li><a href="#" className="hover:text-white">FAQ</a></li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold mb-3 text-gray-300">Legal</h4>
                    <ul className="space-y-2 text-gray-400">
                      <li><a href="#" className="hover:text-white">Privacy</a></li>
                      <li><a href="#" className="hover:text-white">Terms</a></li>
                      <li><a href="#" className="hover:text-white">Cookies</a></li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-700 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
                <p className="text-gray-400">© {new Date().getFullYear()} MoneyCompare. All rights reserved.</p>
                <div className="flex space-x-4 mt-4 md:mt-0">
                  <a href="#" className="text-gray-400 hover:text-white">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      )}
    </div>
  );
};

export default ModernMoneyCompare;
                    </div>
                    
                    {/* CTA */}
                    <div className="p-6 border-t md:border-t-0 md:border-l border-gray-200 flex flex-col items-center justify-center md:w-1/4 bg-white">
                      <div className="mb-2 font-bold text-center text-2xl">
                        {currencySymbols[toCurrency]}{formatAmount(provider.amountReceived)}
                      </div>
                      <div className="text-xs mb-4 text-center text-gray-500">
                        Total fees: {currencySymbols[fromCurrency]}{formatAmount(provider.totalFees)}
                      </div>
                      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md flex items-center justify-center">
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
    case 'EUR':
      return (
        <div className="w-6 h-4 rounded-sm overflow-hidden flex-shrink-0 border border-gray-200">
          <div style={{ background: '#0052B4', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ border: '1px solid #FFDA44', borderRadius: '50%', width: '60%', height: '60%' }}></div>
          </div>
        </div>
      );
    case 'GBP':
      return (
        <div className="w-6 h-4 rounded-sm overflow-hidden flex-shrink-0 border border-gray-200">
          <div style={{ background: '#012169', height: '100%', position: 'relative' }}>
            <div style={{ position: 'absolute', width: '100%', height: '100%', background: 'linear-gradient(45deg, transparent 40%, #FFF 40%, #FFF 60%, transparent 60%)' }}></div>
            <div style={{ position: 'absolute', width: '100%', height: '100%', background: 'linear-gradient(-45deg, transparent 40%, #FFF 40%, #FFF 60%, transparent 60%)' }}></div>
          </div>
        </div>
      );
    case 'JPY':
      return (
        <div className="w-6 h-4 rounded-sm overflow-hidden flex-shrink-0 border border-gray-200">
          <div style={{ background: '#FFFFFF', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ background: '#BC002D', width: '40%', height: '40%', borderRadius: '50%' }}></div>
          </div>
        </div>
      );
    case 'CAD':
      return (
        <div className="w-6 h-4 rounded-sm overflow-hidden flex-shrink-0 border border-gray-200">
          <div style={{ background: '#FFFFFF', height: '100%', display: 'flex', justifyContent: 'center', position: 'relative' }}>
            <div style={{ background: '#FF0000', width: '20%', height: '100%', position: 'absolute', left: 0 }}></div>
            <div style={{ background: '#FF0000', width: '20%', height: '100%', position: 'absolute', right: 0 }}></div>
            <div style={{ color: '#FF0000', fontSize: '10px' }}>🍁</div>
          </div>
        </div>
      );
    default:
      return (
        <div className="w-6 h-4 rounded-sm overflow-hidden flex-shrink-0 border border-gray-200 bg-gray-100"></div>
      );
  }
};

const ModernMoneyCompare = () => {
  const [showResults, setShowResults] = useState(false);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [amount, setAmount] = useState(1000);
  const [sortBy, setSortBy] = useState('amount');
  const [sortDirection, setSortDirection] = useState('desc');
  const [providerResults, setProviderResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Calculate provider results whenever relevant parameters change
  useEffect(() => {
    if (showResults) {
      calculateProviderResults();
    }
  }, [fromCurrency, toCurrency, amount, sortBy, sortDirection, showResults]);
  
  const toggleSortDirection = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };
  
  const handleSearch = () => {
    setIsLoading(true);
    // Simulate API call with a short delay
    setTimeout(() => {
      setShowResults(true);
      setIsLoading(false);
    }, 1000);
  };
  
  const handleBackToHome = () => {
    setShowResults(false);
  };
  
  const calculateProviderResults = () => {
    // Get base exchange rate
    const baseRate = exchangeRates[fromCurrency][toCurrency];
    
    // Calculate for each provider
    const results = providers.map(provider => {
      // Calculate provider's rate with margin
      const providerRate = baseRate * (1 - provider.exchangeRateMargin);
      const amountReceived = amount * providerRate;
      const totalFees = provider.transferFee + (amount * provider.exchangeRateMargin);
      
      return {
        ...provider,
        rate: providerRate,
        amountReceived,
        totalFees,
      };
    });
    
    // Sort results
    const sortedResults = results.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'rate':
          comparison = a.rate - b.rate;
          break;
        case 'fees':
          comparison = a.totalFees - b.totalFees;
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
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
    
    setProviderResults(sortedResults);
    return sortedResults;
  };

  // Event handlers for currency widget updates
  const handleCurrencyWidgetChanges = (newAmount, newFromCurrency, newToCurrency) => {
    setAmount(newAmount);
    setFromCurrency(newFromCurrency);
    setToCurrency(newToCurrency);
  };

  const formatAmount = (value) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900">
      {!showResults ? (
        // Landing Page - Modern Design with Currency Widget Integration
        <div className="relative min-h-screen overflow-hidden bg-gradient-to-r from-blue-500 via-blue-400 to-indigo-500">
          {/* Header */}
          <div className="absolute top-0 left-0 w-full z-10">
            <header className="px-8 py-6">
              <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center">
                  <h1 className="text-2xl font-bold text-white">MoneyCompare</h1>
                </div>
                <div className="hidden md:flex space-x-6">
                  <button className="text-white hover:text-white/80 font-medium">Features</button>
                  <button className="text-white hover:text-white/80 font-medium">Pricing</button>
                  <button className="text-white hover:text-white/80 font-medium">Use cases</button>
                  <button className="text-white hover:text-white/80 font-medium">Resources</button>
                </div>
                <div className="flex space-x-4">
                  <button className="px-4 py-2 text-white hover:text-white/80 font-medium">Log in</button>
                  <button className="px-4 py-2 bg-white text-blue-600 rounded-full font-medium hover:bg-white/90 shadow-md">Sign up</button>
                </div>
              </div>
            </header>
          </div>

          {/* Main Content */}
          <div className="flex items-center justify-center min-h-screen">
            {/* Left Side - Currency Widget (Replacing Search Tool) */}
            <div className="absolute left-24 z-10 max-w-md">
              {/* Pass state and handlers to the CurrencyWidget */}
              <CurrencyWidget 
                initialAmount={amount}
                initialFromCurrency={fromCurrency}
                initialToCurrency={toCurrency}
                onSearch={handleSearch}
                onCurrencyChange={handleCurrencyWidgetChanges}
                isLoading={isLoading}
              />
            </div>
            
            {/* Right Side - Hero Content */}
            <div className="absolute right-20 max-w-xl text-white z-10">
              <h1 className="text-6xl font-bold mb-6">Need to send money overseas?</h1>
              <p className="text-xl mb-8">Find the best rates and lowest fees for international money transfers. Save up to 90% compared to banks.</p>
              <div className="flex items-center text-white/90">
                <div className="border-r border-white/20 pr-4 mr-4">
                  <div className="font-bold text-2xl">5+</div>
                  <div className="text-sm">Transfer providers</div>
                </div>
                <div className="border-r border-white/20 pr-4 mr-4">
                  <div className="font-bold text-2xl">160+</div>
                  <div className="text-sm">Countries supported</div>
                </div>
                <div>
                  <div className="font-bold text-2xl">$0</div>
                  <div className="text-sm">Sign-up fee</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Results Page
        <div className="flex flex-col min-h-screen">
          {/* Header */}
          <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
              <h1 className="text-2xl font-bold text-blue-600 cursor-pointer" onClick={handleBackToHome}>MoneyCompare</h1>
              <div className="hidden md:flex space-x-6">
                <button className="text-gray-600 hover:text-gray-900 font-medium">Features</button>
                <button className="text-gray-600 hover:text-gray-900 font-medium">Providers</button>
                <button className="text-gray-600 hover:text-gray-900 font-medium">Resources</button>
              </div>
              <div className="flex space-x-4">
                <button className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium">Log in</button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700">Sign up</button>
              </div>
            </div>
          </header>
          
          {/* Results Section */}
          <div className="container mx-auto flex-1 px-4 py-8">
            <div className="mb-6">
              <button 
                onClick={handleBackToHome}
                className="text-blue-600 hover:underline flex items-center"
              >
                ← Back to search
              </button>
            </div>
            
            <div className="mb-8 bg-blue-50 p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-bold mb-4 text-gray-800">Your Results</h2>
              <div className="flex flex-col md:flex-row md:items-center">
                <div className="mb-4 md:mb-0 md:mr-8">
                  <div className="text-sm text-gray-500 mb-1">You send</div>
                  <div className="flex items-center">
                    <CurrencyFlag currency={fromCurrency} />
                    <span className="ml-2 text-2xl font-bold">{currencySymbols[fromCurrency]}{formatAmount(amount)} {fromCurrency}</span>
                  </div>
                </div>
                <div className="hidden md:block text-gray-400">
                  <ArrowRightCircle size={24} />
                </div>
                <div className="mb-4 md:mb-0 md:mx-8">
                  <div className="text-sm text-gray-500 mb-1">They receive</div>
                  <div className="flex items-center">
                    <CurrencyFlag currency={toCurrency} />
                    <span className="ml-2 text-2xl font-bold">
                      {providerResults.length > 0 
                        ? `${currencySymbols[toCurrency]}${formatAmount(providerResults[0].amountReceived)} ${toCurrency}`
                        : `~ ${currencySymbols[toCurrency]}${formatAmount(amount * exchangeRates[fromCurrency][toCurrency])} ${toCurrency}`
                      }
                    </span>
                  </div>
                </div>
                <div className="ml-auto">
                  <button 
                    onClick={handleBackToHome}
                    className="px-4 py-2 bg-white border border-blue-500 text-blue-600 rounded-md hover:bg-blue-50"
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
            
            {/* Sorting options */}
            <div className="mb-6">
              <div className="flex items-center overflow-x-auto bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <span className="font-medium text-gray-600 mr-6 whitespace-nowrap">Sort by:</span>
                <button 
                  className={`flex items-center whitespace-nowrap mr-6 ${sortBy === 'amount' ? 'text-blue-600 font-bold' : 'text-gray-600'}`}
                  onClick={() => { setSortBy('amount'); toggleSortDirection(); }}
                >
                  Amount Received
                  {sortBy === 'amount' && (
                    <ArrowUpDown size={16} className="ml-1" />
                  )}
                </button>
                <button 
                  className={`flex items-center whitespace-nowrap mr-6 ${sortBy === 'fees' ? 'text-blue-600 font-bold' : 'text-gray-600'}`}
                  onClick={() => { setSortBy('fees'); toggleSortDirection(); }}
                >
                  Fees
                  {sortBy === 'fees' && (
                    <ArrowUpDown size={16} className="ml-1" />
                  )}
                </button>
                <button 
                  className={`flex items-center whitespace-nowrap mr-6 ${sortBy === 'rate' ? 'text-blue-600 font-bold' : 'text-gray-600'}`}
                  onClick={() => { setSortBy('rate'); toggleSortDirection(); }}
                >
                  Exchange Rate
                  {sortBy === 'rate' && (
                    <ArrowUpDown size={16} className="ml-1" />
                  )}
                </button>
                <button 
                  className={`flex items-center whitespace-nowrap ${sortBy === 'rating' ? 'text-blue-600 font-bold' : 'text-gray-600'}`}
                  onClick={() => { setSortBy('rating'); toggleSortDirection(); }}
                >
                  User Rating
                  {sortBy === 'rating' && (
                    <ArrowUpDown size={16} className="ml-1" />
                  )}
                </button>
              </div>
            </div>
            
            {/* Best Deal Banner */}
            {providerResults.length > 0 && (
              <div className="mb-4 bg-green-50 border-l-4 border-green-500 p-4 rounded-md">
                <div className="flex items-center">
                  <div className="font-bold text-green-800">Best deal: {providerResults[0].name}</div>
                  <div className="ml-auto font-bold text-green-800">{currencySymbols[toCurrency]}{formatAmount(providerResults[0].amountReceived)}</div>
                </div>
              </div>
            )}
            
            {/* Results list */}
            <div className="space-y-6">
              {providerResults.map((provider, index) => (
                <div 
                  key={provider.id} 
                  className={`border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow ${index === 0 ? 'border-green-300 bg-green-50' : 'border-gray-200'}`}
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Provider info */}
                    <div className="p-6 flex flex-col items-center justify-center md:w-1/4 bg-white">
                      <div className="text-4xl mb-2">{provider.logo}</div>
                      <div className="font-bold text-lg text-center">{provider.name}</div>
                      <div className="text-sm text-yellow-500 mt-1">
                        {'★'.repeat(Math.floor(provider.rating))}
                        {provider.rating % 1 >= 0.5 ? '½' : ''}
                        {'☆'.repeat(5 - Math.ceil(provider.rating))}
                        <span className="text-gray-600 ml-1">({provider.rating})</span>