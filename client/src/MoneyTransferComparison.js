import React, { useState } from 'react';
import { ArrowRightCircle, Search, ArrowUpDown, ExternalLink } from 'lucide-react';

// Mock data for providers
const providers = [
  {
    id: 1,
    name: 'TransferWise',
    logo: '🔄',
    exchangeRateMargin: 0.005, // 0.5%
    transferFee: 3.99,
    transferTime: '1-2 days',
    rating: 4.8,
  },
  {
    id: 2,
    name: 'XE Money Transfer',
    logo: '💱',
    exchangeRateMargin: 0.01, // 1%
    transferFee: 0,
    transferTime: '2-3 days',
    rating: 4.5,
  },
  {
    id: 3,
    name: 'OFX',
    logo: '🌐',
    exchangeRateMargin: 0.008, // 0.8%
    transferFee: 0,
    transferTime: '3-5 days',
    rating: 4.4,
  },
  {
    id: 4,
    name: 'Western Union',
    logo: '📨',
    exchangeRateMargin: 0.025, // 2.5%
    transferFee: 5.99,
    transferTime: 'Same day',
    rating: 4.0,
  },
  {
    id: 5,
    name: 'Remitly',
    logo: '💸',
    exchangeRateMargin: 0.015, // 1.5%
    transferFee: 2.99,
    transferTime: '0-2 days',
    rating: 4.2,
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

const MoneyTransferComparison = () => {
  const [showResults, setShowResults] = useState(false);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [amount, setAmount] = useState(1000);
  const [sortBy, setSortBy] = useState('rate');
  const [sortDirection, setSortDirection] = useState('asc');
  
  const toggleSortDirection = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };
  
  const handleSearch = () => {
    setShowResults(true);
  };
  
  const handleBackToHome = () => {
    setShowResults(false);
  };
  
  const getProviderResults = () => {
    // Get base exchange rate
    const baseRate = exchangeRates[fromCurrency][toCurrency];
    
    return providers.map(provider => {
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
    }).sort((a, b) => {
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
          comparison = a.rate - b.rate;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      {!showResults ? (
        // Landing Page
        <div className="flex flex-col min-h-screen">
          {/* Header */}
          <header className="bg-blue-600 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
              <h1 className="text-2xl font-bold">MoneyCompare</h1>
              <div className="flex space-x-4">
                <button className="px-3 py-1 rounded hover:bg-blue-700">About</button>
                <button className="px-3 py-1 rounded hover:bg-blue-700">Providers</button>
                <button className="px-3 py-1 rounded hover:bg-blue-700">Contact</button>
              </div>
            </div>
          </header>
          
          {/* Main Content with Search Tool */}
          <div className="flex-1 flex">
            {/* Left side - Search tool */}
            <div className="w-1/3 p-8 bg-gray-50">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-6 text-center">Compare Money Transfers</h2>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">You Send</label>
                  <div className="flex">
                    <select 
                      value={fromCurrency}
                      onChange={(e) => setFromCurrency(e.target.value)}
                      className="rounded-l border border-gray-300 p-2 w-1/3"
                    >
                      {Object.keys(exchangeRates).map(currency => (
                        <option key={currency} value={currency}>{currency}</option>
                      ))}
                    </select>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(Math.max(0, Number(e.target.value)))}
                      className="rounded-r border border-gray-300 p-2 w-2/3"
                      min="0"
                    />
                  </div>
                </div>
                
                <div className="flex justify-center my-4">
                  <ArrowRightCircle size={24} className="text-blue-500" />
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">They Receive</label>
                  <select 
                    value={toCurrency}
                    onChange={(e) => setToCurrency(e.target.value)}
                    className="rounded border border-gray-300 p-2 w-full"
                  >
                    {Object.keys(exchangeRates).map(currency => (
                      <option key={currency} value={currency}>{currency}</option>
                    ))}
                  </select>
                </div>
                
                <button 
                  onClick={handleSearch}
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg flex items-center justify-center"
                >
                  <Search size={18} className="mr-2" />
                  Search for the Best Rate
                </button>
                
                <div className="mt-4 text-xs text-center text-gray-500">
                  Compare rates from 5+ providers instantly
                </div>
              </div>
            </div>
            
            {/* Right side - Advertisement (like WeTransfer) */}
            <div className="w-2/3 bg-cover bg-center relative" style={{backgroundImage: "url('/api/placeholder/800/600')"}}>
              <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-white p-12">
                <h2 className="text-4xl font-bold mb-6">Exclusive Offer</h2>
                <p className="text-xl mb-8 text-center max-w-lg">Get your first international transfer fee-free when you sign up with TransferWise today</p>
                <button className="bg-white text-blue-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-lg">
                  Claim Special Offer
                </button>
                <p className="mt-4 text-sm">Limited time only. Terms apply.</p>
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <footer className="bg-gray-800 text-white p-4 text-center">
            <p>&copy; 2025 MoneyCompare. All rights reserved.</p>
          </footer>
        </div>
      ) : (
        // Results Page
        <div className="flex flex-col min-h-screen">
          {/* Header */}
          <header className="bg-blue-600 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
              <h1 className="text-2xl font-bold cursor-pointer" onClick={handleBackToHome}>MoneyCompare</h1>
              <div className="flex space-x-4">
                <button className="px-3 py-1 rounded hover:bg-blue-700">About</button>
                <button className="px-3 py-1 rounded hover:bg-blue-700">Providers</button>
                <button className="px-3 py-1 rounded hover:bg-blue-700">Contact</button>
              </div>
            </div>
          </header>
          
          {/* Results Section */}
          <div className="container mx-auto flex-1 p-6">
            <div className="mb-6">
              <button 
                onClick={handleBackToHome}
                className="text-blue-600 hover:underline flex items-center"
              >
                ← Back to search
              </button>
            </div>
            
            <div className="mb-6 bg-blue-50 p-4 rounded-lg">
              <h2 className="text-xl font-bold mb-4">Your Search</h2>
              <div className="flex items-center">
                <div className="flex-1">
                  <span className="font-bold">{currencySymbols[fromCurrency]}{amount.toLocaleString()} {fromCurrency}</span>
                </div>
                <ArrowRightCircle size={24} className="text-blue-500 mx-4" />
                <div className="flex-1">
                  <span className="font-bold">{toCurrency}</span>
                </div>
                <button 
                  onClick={handleBackToHome}
                  className="ml-4 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Edit
                </button>
              </div>
            </div>
            
            {/* Sorting options */}
            <div className="mb-4">
              <div className="flex items-center space-x-6 bg-gray-100 p-3 rounded-lg">
                <span className="font-bold">Sort by:</span>
                <button 
                  className={`flex items-center ${sortBy === 'rate' ? 'text-blue-600 font-bold' : ''}`}
                  onClick={() => { setSortBy('rate'); toggleSortDirection(); }}
                >
                  Exchange Rate
                  {sortBy === 'rate' && (
                    <ArrowUpDown size={16} className="ml-1" />
                  )}
                </button>
                <button 
                  className={`flex items-center ${sortBy === 'fees' ? 'text-blue-600 font-bold' : ''}`}
                  onClick={() => { setSortBy('fees'); toggleSortDirection(); }}
                >
                  Fees
                  {sortBy === 'fees' && (
                    <ArrowUpDown size={16} className="ml-1" />
                  )}
                </button>
                <button 
                  className={`flex items-center ${sortBy === 'amount' ? 'text-blue-600 font-bold' : ''}`}
                  onClick={() => { setSortBy('amount'); toggleSortDirection(); }}
                >
                  Amount Received
                  {sortBy === 'amount' && (
                    <ArrowUpDown size={16} className="ml-1" />
                  )}
                </button>
                <button 
                  className={`flex items-center ${sortBy === 'rating' ? 'text-blue-600 font-bold' : ''}`}
                  onClick={() => { setSortBy('rating'); toggleSortDirection(); }}
                >
                  User Rating
                  {sortBy === 'rating' && (
                    <ArrowUpDown size={16} className="ml-1" />
                  )}
                </button>
              </div>
            </div>
            
            {/* Results list */}
            <div className="space-y-4">
              {getProviderResults().map(provider => (
                <div key={provider.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex">
                    {/* Provider info */}
                    <div className="w-1/4 p-6 flex flex-col items-center justify-center bg-gray-50">
                      <div className="text-4xl mb-2">{provider.logo}</div>
                      <div className="font-bold text-lg">{provider.name}</div>
                      <div className="text-sm text-yellow-500 mt-1">
                        {'★'.repeat(Math.floor(provider.rating))}
                        {provider.rating % 1 >= 0.5 ? '½' : ''}
                        {'☆'.repeat(5 - Math.ceil(provider.rating))}
                        <span className="text-gray-600 ml-1">({provider.rating})</span>
                      </div>
                    </div>
                    
                    {/* Exchange details */}
                    <div className="w-2/4 p-6 border-l border-r">
                      <div className="flex justify-between mb-4">
                        <div>
                          <div className="text-sm text-gray-500">You Send</div>
                          <div className="font-bold">{currencySymbols[fromCurrency]}{amount.toLocaleString()} {fromCurrency}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-gray-500">Exchange Rate</div>
                          <div className="font-bold">1 {fromCurrency} = {provider.rate.toFixed(4)} {toCurrency}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-500">They Receive</div>
                          <div className="font-bold">{currencySymbols[toCurrency]}{provider.amountReceived.toFixed(2)} {toCurrency}</div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <div>
                          <span className="text-gray-500">Fee:</span> {currencySymbols[fromCurrency]}{provider.transferFee.toFixed(2)}
                        </div>
                        <div>
                          <span className="text-gray-500">Rate Margin:</span> {(provider.exchangeRateMargin * 100).toFixed(2)}%
                        </div>
                        <div>
                          <span className="text-gray-500">Delivery:</span> {provider.transferTime}
                        </div>
                      </div>
                    </div>
                    
                    {/* CTA */}
                    <div className="w-1/4 p-6 flex flex-col items-center justify-center">
                      <div className="mb-2 font-bold text-center">
                        {currencySymbols[toCurrency]}{provider.amountReceived.toFixed(2)}
                      </div>
                      <div className="text-xs mb-4 text-center text-gray-500">
                        Total fees: {currencySymbols[fromCurrency]}{provider.totalFees.toFixed(2)}
                      </div>
                      <button className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded flex items-center justify-center">
                        Get Deal
                        <ExternalLink size={16} className="ml-1" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Footer */}
          <footer className="bg-gray-800 text-white p-4 text-center mt-8">
            <p>&copy; 2025 MoneyCompare. All rights reserved.</p>
          </footer>
        </div>
      )}
    </div>
  );
};

export default MoneyTransferComparison;