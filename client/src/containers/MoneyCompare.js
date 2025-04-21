import React, { useState } from 'react';
import HomePage from './HomePage';
import ResultsView from './ResultsView';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

/**
 * Main container component for the money transfer comparison app
 */
const MoneyCompare = () => {
  const [showResults, setShowResults] = useState(false);
  const [searchData, setSearchData] = useState({
    fromCurrency: 'GBP',
    toCurrency: 'EUR',
    amount: 1000
  });
  
  const handleSearch = (data) => {
    setSearchData(data);
    setShowResults(true);
  };
  
  const handleBackToHome = () => {
    setShowResults(false);
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900">
      {!showResults ? (
        // Landing Page
        <HomePage onSearch={handleSearch} />
      ) : (
        // Results Page
        <div className="flex flex-col min-h-screen">
          <Header onLogoClick={handleBackToHome} />
          <ResultsView 
            searchData={searchData} 
            onBackToSearch={handleBackToHome} 
          />
          <Footer />
        </div>
      )}
    </div>
  );
};

export default MoneyCompare; 