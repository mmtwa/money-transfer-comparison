import React, { useState, useEffect } from 'react';
import HomePage from './HomePage';
import ResultsView from './ResultsView';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

/**
 * Main container component for the money transfer comparison app
 */
const MoneyCompare = ({ initialPath }) => {
  const [showResults, setShowResults] = useState(initialPath === '/results');
  const [searchData, setSearchData] = useState({
    fromCurrency: 'GBP',
    toCurrency: 'EUR',
    amount: 1000
  });
  
  // Set initial showResults state based on URL path
  useEffect(() => {
    setShowResults(initialPath === '/results');
  }, [initialPath]);
  
  // Handle popstate event (browser back/forward buttons)
  useEffect(() => {
    const handlePopState = (event) => {
      // If coming back from results page to homepage
      if (showResults && window.location.pathname === '/') {
        setShowResults(false);
      }
    };
    
    // Add event listener for the browser back button
    window.addEventListener('popstate', handlePopState);
    
    // Clean up
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [showResults]);
  
  const handleSearch = (data) => {
    setSearchData(data);
    setShowResults(true);
    
    // Update browser history and URL when showing results
    window.history.pushState(
      { fromHomepage: true, searchData: data }, 
      'Results', 
      '/results'
    );
  };
  
  const handleBackToHome = () => {
    setShowResults(false);
    
    // Update URL without triggering popstate when clicking "back to search"
    window.history.pushState(
      { fromResults: true, searchData }, 
      'Home', 
      '/'
    );
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900">
      {!showResults ? (
        // Landing Page
        <HomePage onSearch={handleSearch} initialData={searchData} />
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