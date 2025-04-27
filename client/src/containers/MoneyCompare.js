import React, { useState, useEffect } from 'react';
import HomePage from './HomePage';
import ResultsView from './ResultsView';
import AboutUs from '../pages/AboutUs';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

/**
 * Main container component for the money transfer comparison app
 */
const MoneyCompare = ({ initialPath }) => {
  const [currentPage, setCurrentPage] = useState('home');
  const [searchData, setSearchData] = useState({
    fromCurrency: 'GBP',
    toCurrency: 'EUR',
    amount: 1000
  });
  
  // Set initial page state based on URL path
  useEffect(() => {
    if (initialPath === '/results') {
      setCurrentPage('results');
    } else if (initialPath === '/about') {
      setCurrentPage('about');
    } else {
      setCurrentPage('home');
    }
  }, [initialPath]);
  
  // Handle popstate event (browser back/forward buttons)
  useEffect(() => {
    const handlePopState = (event) => {
      // If coming back from results page to homepage
      if (window.location.pathname === '/') {
        setCurrentPage('home');
      } else if (window.location.pathname === '/about') {
        setCurrentPage('about');
      }
    };
    
    // Add event listener for the browser back button
    window.addEventListener('popstate', handlePopState);
    
    // Clean up
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [currentPage]);
  
  const handleSearch = (data) => {
    setSearchData(data);
    setCurrentPage('results');
    
    // Update browser history and URL when showing results
    window.history.pushState(
      { fromHomepage: true, searchData: data }, 
      'Results', 
      '/results'
    );
  };
  
  const handleBackToHome = () => {
    setCurrentPage('home');
    
    // Update URL without triggering popstate when clicking "back to search"
    window.history.pushState(
      { fromResults: true, searchData }, 
      'Home', 
      '/'
    );
  };

  const navigateToAboutUs = () => {
    setCurrentPage('about');
    
    // Update URL for about page
    window.history.pushState(
      { page: 'about' }, 
      'About Us', 
      '/about'
    );
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900">
      {currentPage === 'home' ? (
        // Landing Page
        <HomePage 
          onSearch={handleSearch} 
          initialData={searchData} 
          onAboutClick={navigateToAboutUs}
        />
      ) : currentPage === 'results' ? (
        // Results Page
        <div className="flex flex-col min-h-screen">
          <Header 
            onLogoClick={handleBackToHome} 
            onAboutClick={navigateToAboutUs}
          />
          <ResultsView 
            searchData={searchData} 
            onBackToSearch={handleBackToHome} 
          />
          <Footer onAboutClick={navigateToAboutUs} />
        </div>
      ) : (
        // About Us Page
        <AboutUs />
      )}
    </div>
  );
};

export default MoneyCompare; 