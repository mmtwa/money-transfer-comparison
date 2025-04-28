import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import HomePage from './HomePage';
import ResultsView from './ResultsView';
import AboutUs from '../pages/AboutUs';
import Guides from '../pages/Guides';
import FAQ from '../pages/FAQ';
import HistoricalRates from '../pages/HistoricalRates';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import GettingStarted from '../pages/guides/GettingStarted';
import ExchangeRates from '../pages/guides/ExchangeRates';
import TransferFees from '../pages/guides/TransferFees';
import FamilyRemittances from '../pages/guides/FamilyRemittances';
import BusinessTransfers from '../pages/guides/BusinessTransfers';
import SecurityTips from '../pages/guides/SecurityTips';

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
  
  // Get the current location from React Router
  const location = useLocation();
  const navigate = useNavigate();
  
  // Listen for location changes from React Router and update currentPage
  useEffect(() => {
    const path = location.pathname;
    console.log('Location changed:', path);
    
    if (path === '/') {
      setCurrentPage('home');
    } else if (path === '/results') {
      setCurrentPage('results');
    } else if (path === '/about') {
      setCurrentPage('about');
    } else if (path === '/guides') {
      setCurrentPage('guides');
    } else if (path === '/guides/getting-started') {
      setCurrentPage('guide-getting-started');
    } else if (path === '/guides/exchange-rates') {
      setCurrentPage('guide-exchange-rates');
    } else if (path === '/guides/transfer-fees') {
      setCurrentPage('guide-transfer-fees');
    } else if (path === '/guides/family-remittances') {
      setCurrentPage('guide-family-remittances');
    } else if (path === '/guides/business-transfers') {
      setCurrentPage('guide-business-transfers');
    } else if (path === '/guides/security-tips') {
      setCurrentPage('guide-security-tips');
    } else if (path === '/faq') {
      setCurrentPage('faq');
    } else if (path === '/historical-rates') {
      setCurrentPage('historical-rates');
    }
  }, [location]);
  
  // Handle popstate event (browser back/forward buttons)
  useEffect(() => {
    const handlePopState = (event) => {
      // If coming back from results page to homepage
      if (window.location.pathname === '/') {
        setCurrentPage('home');
      } else if (window.location.pathname === '/about') {
        setCurrentPage('about');
      } else if (window.location.pathname === '/guides') {
        setCurrentPage('guides');
      } else if (window.location.pathname === '/guides/getting-started') {
        setCurrentPage('guide-getting-started');
      } else if (window.location.pathname === '/guides/exchange-rates') {
        setCurrentPage('guide-exchange-rates');
      } else if (window.location.pathname === '/guides/transfer-fees') {
        setCurrentPage('guide-transfer-fees');
      } else if (window.location.pathname === '/guides/family-remittances') {
        setCurrentPage('guide-family-remittances');
      } else if (window.location.pathname === '/guides/business-transfers') {
        setCurrentPage('guide-business-transfers');
      } else if (window.location.pathname === '/guides/security-tips') {
        setCurrentPage('guide-security-tips');
      } else if (window.location.pathname === '/faq') {
        setCurrentPage('faq');
      } else if (window.location.pathname === '/historical-rates') {
        setCurrentPage('historical-rates');
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
    
    // Update URL using React Router
    navigate('/results', { 
      state: { fromHomepage: true, searchData: data } 
    });
  };
  
  const handleBackToHome = () => {
    setCurrentPage('home');
    
    // Update URL using React Router
    navigate('/', { 
      state: { fromResults: true, searchData } 
    });
  };

  const navigateToAboutUs = () => {
    setCurrentPage('about');
    
    // Update URL using React Router
    navigate('/about', { 
      state: { page: 'about' } 
    });
  };
  
  const navigateToGuides = () => {
    setCurrentPage('guides');
    
    // Update URL using React Router
    navigate('/guides', { 
      state: { page: 'guides' } 
    });
  };
  
  const navigateToFaq = () => {
    setCurrentPage('faq');
    
    // Update URL using React Router
    navigate('/faq', { 
      state: { page: 'faq' } 
    });
  };
  
  const navigateToHistoricalRates = () => {
    setCurrentPage('historical-rates');
    
    // Update URL using React Router
    navigate('/historical-rates', { 
      state: { page: 'historical-rates' } 
    });
  };
  
  const renderPageContent = () => {
    switch (currentPage) {
      case 'home':
        return (
          <HomePage 
            onSearch={handleSearch} 
            initialData={searchData} 
            onAboutClick={navigateToAboutUs}
            onGuidesClick={navigateToGuides}
            onFaqClick={navigateToFaq}
            onHistoricalRatesClick={navigateToHistoricalRates}
          />
        );
      case 'results':
        return (
          <div className="flex flex-col min-h-screen">
            <Header 
              onLogoClick={handleBackToHome} 
              onAboutClick={navigateToAboutUs}
              onGuidesClick={navigateToGuides}
              onFaqClick={navigateToFaq}
              onHistoricalRatesClick={navigateToHistoricalRates}
              onMenuToggle={() => {}}
            />
            <ResultsView 
              searchData={searchData} 
              onBackToSearch={handleBackToHome} 
            />
            <Footer 
              onAboutClick={navigateToAboutUs} 
              onGuidesClick={navigateToGuides} 
              onFaqClick={navigateToFaq}
              onHistoricalRatesClick={navigateToHistoricalRates}
            />
          </div>
        );
      case 'about':
        return (
          <div className="flex flex-col min-h-screen">
            <Header 
              onLogoClick={handleBackToHome} 
              onAboutClick={navigateToAboutUs}
              onGuidesClick={navigateToGuides}
              onFaqClick={navigateToFaq}
              onHistoricalRatesClick={navigateToHistoricalRates}
              onMenuToggle={() => {}}
            />
            <AboutUs />
            <Footer 
              onAboutClick={navigateToAboutUs} 
              onGuidesClick={navigateToGuides} 
              onFaqClick={navigateToFaq}
              onHistoricalRatesClick={navigateToHistoricalRates}
            />
          </div>
        );
      case 'guides':
        return (
          <div className="flex flex-col min-h-screen">
            <Header 
              onLogoClick={handleBackToHome} 
              onAboutClick={navigateToAboutUs}
              onGuidesClick={navigateToGuides}
              onFaqClick={navigateToFaq}
              onHistoricalRatesClick={navigateToHistoricalRates}
              onMenuToggle={() => {}}
            />
            <Guides />
            <Footer 
              onAboutClick={navigateToAboutUs} 
              onGuidesClick={navigateToGuides} 
              onFaqClick={navigateToFaq}
              onHistoricalRatesClick={navigateToHistoricalRates}
            />
          </div>
        );
      case 'guide-getting-started':
        return (
          <div className="flex flex-col min-h-screen">
            <Header 
              onLogoClick={handleBackToHome} 
              onAboutClick={navigateToAboutUs}
              onGuidesClick={navigateToGuides}
              onFaqClick={navigateToFaq}
              onHistoricalRatesClick={navigateToHistoricalRates}
              onMenuToggle={() => {}}
            />
            <GettingStarted />
            <Footer 
              onAboutClick={navigateToAboutUs} 
              onGuidesClick={navigateToGuides} 
              onFaqClick={navigateToFaq}
              onHistoricalRatesClick={navigateToHistoricalRates}
            />
          </div>
        );
      case 'guide-exchange-rates':
        return (
          <div className="flex flex-col min-h-screen">
            <Header 
              onLogoClick={handleBackToHome} 
              onAboutClick={navigateToAboutUs}
              onGuidesClick={navigateToGuides}
              onFaqClick={navigateToFaq}
              onHistoricalRatesClick={navigateToHistoricalRates}
              onMenuToggle={() => {}}
            />
            <ExchangeRates />
            <Footer 
              onAboutClick={navigateToAboutUs} 
              onGuidesClick={navigateToGuides} 
              onFaqClick={navigateToFaq}
              onHistoricalRatesClick={navigateToHistoricalRates}
            />
          </div>
        );
      case 'guide-transfer-fees':
        return (
          <div className="flex flex-col min-h-screen">
            <Header 
              onLogoClick={handleBackToHome} 
              onAboutClick={navigateToAboutUs}
              onGuidesClick={navigateToGuides}
              onFaqClick={navigateToFaq}
              onHistoricalRatesClick={navigateToHistoricalRates}
              onMenuToggle={() => {}}
            />
            <TransferFees />
            <Footer 
              onAboutClick={navigateToAboutUs} 
              onGuidesClick={navigateToGuides} 
              onFaqClick={navigateToFaq}
              onHistoricalRatesClick={navigateToHistoricalRates}
            />
          </div>
        );
      case 'guide-family-remittances':
        return (
          <div className="flex flex-col min-h-screen">
            <Header 
              onLogoClick={handleBackToHome} 
              onAboutClick={navigateToAboutUs}
              onGuidesClick={navigateToGuides}
              onFaqClick={navigateToFaq}
              onHistoricalRatesClick={navigateToHistoricalRates}
              onMenuToggle={() => {}}
            />
            <FamilyRemittances />
            <Footer 
              onAboutClick={navigateToAboutUs} 
              onGuidesClick={navigateToGuides} 
              onFaqClick={navigateToFaq}
              onHistoricalRatesClick={navigateToHistoricalRates}
            />
          </div>
        );
      case 'guide-business-transfers':
        return (
          <div className="flex flex-col min-h-screen">
            <Header 
              onLogoClick={handleBackToHome} 
              onAboutClick={navigateToAboutUs}
              onGuidesClick={navigateToGuides}
              onFaqClick={navigateToFaq}
              onHistoricalRatesClick={navigateToHistoricalRates}
              onMenuToggle={() => {}}
            />
            <BusinessTransfers />
            <Footer 
              onAboutClick={navigateToAboutUs} 
              onGuidesClick={navigateToGuides} 
              onFaqClick={navigateToFaq}
              onHistoricalRatesClick={navigateToHistoricalRates}
            />
          </div>
        );
      case 'guide-security-tips':
        return (
          <div className="flex flex-col min-h-screen">
            <Header 
              onLogoClick={handleBackToHome} 
              onAboutClick={navigateToAboutUs}
              onGuidesClick={navigateToGuides}
              onFaqClick={navigateToFaq}
              onHistoricalRatesClick={navigateToHistoricalRates}
              onMenuToggle={() => {}}
            />
            <SecurityTips />
            <Footer 
              onAboutClick={navigateToAboutUs} 
              onGuidesClick={navigateToGuides} 
              onFaqClick={navigateToFaq}
              onHistoricalRatesClick={navigateToHistoricalRates}
            />
          </div>
        );
      case 'faq':
        return (
          <div className="flex flex-col min-h-screen">
            <Header 
              onLogoClick={handleBackToHome} 
              onAboutClick={navigateToAboutUs}
              onGuidesClick={navigateToGuides}
              onFaqClick={navigateToFaq}
              onHistoricalRatesClick={navigateToHistoricalRates}
              onMenuToggle={() => {}}
            />
            <FAQ />
            <Footer 
              onAboutClick={navigateToAboutUs} 
              onGuidesClick={navigateToGuides} 
              onFaqClick={navigateToFaq}
              onHistoricalRatesClick={navigateToHistoricalRates}
            />
          </div>
        );
      case 'historical-rates':
        return (
          <div className="flex flex-col min-h-screen">
            <Header 
              onLogoClick={handleBackToHome} 
              onAboutClick={navigateToAboutUs}
              onGuidesClick={navigateToGuides}
              onFaqClick={navigateToFaq}
              onHistoricalRatesClick={navigateToHistoricalRates}
              onMenuToggle={() => {}}
            />
            <HistoricalRates />
            <Footer 
              onAboutClick={navigateToAboutUs} 
              onGuidesClick={navigateToGuides} 
              onFaqClick={navigateToFaq}
              onHistoricalRatesClick={navigateToHistoricalRates}
            />
          </div>
        );
      default:
        return (
          <HomePage 
            onSearch={handleSearch} 
            initialData={searchData} 
            onAboutClick={navigateToAboutUs}
            onGuidesClick={navigateToGuides}
            onFaqClick={navigateToFaq}
            onHistoricalRatesClick={navigateToHistoricalRates}
          />
        );
    }
  };
  
  return <div className="flex flex-col min-h-screen bg-white text-gray-900">{renderPageContent()}</div>;
};

export default MoneyCompare; 