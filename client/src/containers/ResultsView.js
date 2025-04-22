import React, { useState } from 'react';
import { ArrowUpDown } from 'lucide-react';
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
  
  return (
    <div className="container mx-auto flex-1 px-4 py-6 md:py-8">
      <div className="mb-6">
        <button 
          onClick={onBackToSearch}
          className="text-blue-600 hover:underline flex items-center"
        >
          ← Back to search
        </button>
      </div>
      
      <div className="mb-6 md:mb-8 bg-blue-50 p-4 md:p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Your Results</h2>
        <div className="flex flex-col md:flex-row md:items-center">
          <div className="mb-4 md:mb-0 md:mr-8">
            <div className="text-sm text-gray-500 mb-1">You send</div>
            <div className="flex items-center">
              <CurrencyFlag currency={fromCurrency} />
              <span className="ml-2 text-xl md:text-2xl font-bold">
                {getCurrencySymbol(fromCurrency)} {formatAmount(amount)} {fromCurrency}
              </span>
            </div>
          </div>
          <div className="mb-4 md:mb-0 md:mx-8">
            <div className="text-sm text-gray-500 mb-1">They receive</div>
            <div className="flex items-center">
              <CurrencyFlag currency={toCurrency} />
              <span className="ml-2 text-xl md:text-2xl font-bold">
                {providerResults.length > 0 
                  ? `${getCurrencySymbol(toCurrency)} ${formatAmount(providerResults[0].amountReceived)} ${toCurrency}`
                  : `~ ${getCurrencySymbol(toCurrency)} ${formatAmount(amount * exchangeRates[fromCurrency][toCurrency])} ${toCurrency}`
                }
              </span>
            </div>
          </div>
          <div className="md:ml-auto">
            <button 
              onClick={onBackToSearch}
              className="px-4 py-2 bg-white border border-blue-500 text-blue-600 rounded-md hover:bg-blue-50"
            >
              Edit
            </button>
          </div>
        </div>
      </div>
      
      {/* Sorting options */}
      <div className="mb-6">
        <div className="flex items-center overflow-x-auto bg-white p-3 md:p-4 rounded-lg shadow-sm border border-gray-100">
          <span className="font-medium text-gray-600 mr-4 md:mr-6 whitespace-nowrap">Sort by:</span>
          <button 
            className={`flex items-center whitespace-nowrap mr-4 md:mr-6 ${sortBy === 'rate' ? 'text-blue-600 font-bold' : 'text-gray-600'}`}
            onClick={() => { setSortBy('rate'); toggleSortDirection(); }}
          >
            Exchange Rate
            {sortBy === 'rate' && (
              <ArrowUpDown size={16} className="ml-1" />
            )}
          </button>
          <button 
            className={`flex items-center whitespace-nowrap mr-4 md:mr-6 ${sortBy === 'amount' ? 'text-blue-600 font-bold' : 'text-gray-600'}`}
            onClick={() => { setSortBy('amount'); toggleSortDirection(); }}
          >
            Amount Received
            {sortBy === 'amount' && (
              <ArrowUpDown size={16} className="ml-1" />
            )}
          </button>
          <button 
            className={`flex items-center whitespace-nowrap mr-4 md:mr-6 ${sortBy === 'fees' ? 'text-blue-600 font-bold' : 'text-gray-600'}`}
            onClick={() => { setSortBy('fees'); toggleSortDirection(); }}
          >
            Fees
            {sortBy === 'fees' && (
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
            <div className="ml-auto font-bold text-green-800">{getCurrencySymbol(toCurrency)} {formatAmount(providerResults[0].amountReceived)}</div>
          </div>
        </div>
      )}
      
      {/* Results list */}
      <div className="space-y-6">
        {providerResults.map((provider, index) => (
          <ProviderCard 
            key={provider.id}
            provider={provider}
            index={index}
            fromCurrency={fromCurrency}
            toCurrency={toCurrency}
            amount={amount}
          />
        ))}
      </div>
    </div>
  );
};

export default ResultsView; 