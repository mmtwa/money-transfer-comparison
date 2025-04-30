import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
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
import CanonicalUrl from '../pages/CanonicalUrl';
import PrivacyPolicy from '../pages/PrivacyPolicy';
import TermsOfService from '../pages/TermsOfService';
import CookiePolicy from '../pages/CookiePolicy';
import LegalDisclosure from '../pages/LegalDisclosure';
import Careers from '../pages/Careers';
import Press from '../pages/Press';

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
    // Scroll to top on route change
    window.scrollTo(0, 0);

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
    } else if (path === '/privacy-policy') {
      setCurrentPage('privacy-policy');
    } else if (path === '/terms-of-service') {
      setCurrentPage('terms-of-service');
    } else if (path === '/cookie-policy') {
      setCurrentPage('cookie-policy');
    } else if (path === '/legal-disclosure') {
      setCurrentPage('legal-disclosure');
    } else if (path === '/careers') {
      setCurrentPage('careers');
    } else if (path === '/press') {
      setCurrentPage('press');
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
      } else if (window.location.pathname === '/privacy-policy') {
        setCurrentPage('privacy-policy');
      } else if (window.location.pathname === '/terms-of-service') {
        setCurrentPage('terms-of-service');
      } else if (window.location.pathname === '/cookie-policy') {
        setCurrentPage('cookie-policy');
      } else if (window.location.pathname === '/legal-disclosure') {
        setCurrentPage('legal-disclosure');
      } else if (window.location.pathname === '/careers') {
        setCurrentPage('careers');
      } else if (window.location.pathname === '/press') {
        setCurrentPage('press');
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
  
  const navigateToPrivacyPolicy = () => {
    setCurrentPage('privacy-policy');
    
    navigate('/privacy-policy', { 
      state: { page: 'privacy-policy' } 
    });
  };
  
  const navigateToTermsOfService = () => {
    setCurrentPage('terms-of-service');
    
    navigate('/terms-of-service', { 
      state: { page: 'terms-of-service' } 
    });
  };
  
  const navigateToCookiePolicy = () => {
    setCurrentPage('cookie-policy');
    
    navigate('/cookie-policy', { 
      state: { page: 'cookie-policy' } 
    });
  };
  
  const navigateToLegalDisclosure = () => {
    setCurrentPage('legal-disclosure');
    
    navigate('/legal-disclosure', { 
      state: { page: 'legal-disclosure' } 
    });
  };
  
  const navigateToCareers = () => {
    setCurrentPage('careers');
    
    navigate('/careers', { 
      state: { page: 'careers' } 
    });
  };
  
  const navigateToPress = () => {
    setCurrentPage('press');
    
    navigate('/press', { 
      state: { page: 'press' } 
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
              onPrivacyClick={navigateToPrivacyPolicy}
              onTermsClick={navigateToTermsOfService}
              onCookiesClick={navigateToCookiePolicy}
              onLegalDisclosureClick={navigateToLegalDisclosure}
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
              onPrivacyClick={navigateToPrivacyPolicy}
              onTermsClick={navigateToTermsOfService}
              onCookiesClick={navigateToCookiePolicy}
              onLegalDisclosureClick={navigateToLegalDisclosure}
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
              onPrivacyClick={navigateToPrivacyPolicy}
              onTermsClick={navigateToTermsOfService}
              onCookiesClick={navigateToCookiePolicy}
              onLegalDisclosureClick={navigateToLegalDisclosure}
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
              onPrivacyClick={navigateToPrivacyPolicy}
              onTermsClick={navigateToTermsOfService}
              onCookiesClick={navigateToCookiePolicy}
              onLegalDisclosureClick={navigateToLegalDisclosure}
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
              onPrivacyClick={navigateToPrivacyPolicy}
              onTermsClick={navigateToTermsOfService}
              onCookiesClick={navigateToCookiePolicy}
              onLegalDisclosureClick={navigateToLegalDisclosure}
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
              onPrivacyClick={navigateToPrivacyPolicy}
              onTermsClick={navigateToTermsOfService}
              onCookiesClick={navigateToCookiePolicy}
              onLegalDisclosureClick={navigateToLegalDisclosure}
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
              onPrivacyClick={navigateToPrivacyPolicy}
              onTermsClick={navigateToTermsOfService}
              onCookiesClick={navigateToCookiePolicy}
              onLegalDisclosureClick={navigateToLegalDisclosure}
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
              onPrivacyClick={navigateToPrivacyPolicy}
              onTermsClick={navigateToTermsOfService}
              onCookiesClick={navigateToCookiePolicy}
              onLegalDisclosureClick={navigateToLegalDisclosure}
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
              onPrivacyClick={navigateToPrivacyPolicy}
              onTermsClick={navigateToTermsOfService}
              onCookiesClick={navigateToCookiePolicy}
              onLegalDisclosureClick={navigateToLegalDisclosure}
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
              onPrivacyClick={navigateToPrivacyPolicy}
              onTermsClick={navigateToTermsOfService}
              onCookiesClick={navigateToCookiePolicy}
              onLegalDisclosureClick={navigateToLegalDisclosure}
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
              onPrivacyClick={navigateToPrivacyPolicy}
              onTermsClick={navigateToTermsOfService}
              onCookiesClick={navigateToCookiePolicy}
              onLegalDisclosureClick={navigateToLegalDisclosure}
            />
          </div>
        );
      case 'privacy-policy':
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
            <PrivacyPolicy />
            <Footer 
              onAboutClick={navigateToAboutUs} 
              onGuidesClick={navigateToGuides} 
              onFaqClick={navigateToFaq}
              onHistoricalRatesClick={navigateToHistoricalRates}
              onPrivacyClick={navigateToPrivacyPolicy}
              onTermsClick={navigateToTermsOfService}
              onCookiesClick={navigateToCookiePolicy}
              onLegalDisclosureClick={navigateToLegalDisclosure}
            />
          </div>
        );
      case 'terms-of-service':
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
            <TermsOfService />
            <Footer 
              onAboutClick={navigateToAboutUs} 
              onGuidesClick={navigateToGuides} 
              onFaqClick={navigateToFaq}
              onHistoricalRatesClick={navigateToHistoricalRates}
              onPrivacyClick={navigateToPrivacyPolicy}
              onTermsClick={navigateToTermsOfService}
              onCookiesClick={navigateToCookiePolicy}
              onLegalDisclosureClick={navigateToLegalDisclosure}
            />
          </div>
        );
      case 'cookie-policy':
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
            <CookiePolicy />
            <Footer 
              onAboutClick={navigateToAboutUs} 
              onGuidesClick={navigateToGuides} 
              onFaqClick={navigateToFaq}
              onHistoricalRatesClick={navigateToHistoricalRates}
              onPrivacyClick={navigateToPrivacyPolicy}
              onTermsClick={navigateToTermsOfService}
              onCookiesClick={navigateToCookiePolicy}
              onLegalDisclosureClick={navigateToLegalDisclosure}
            />
          </div>
        );
      case 'legal-disclosure':
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
            <LegalDisclosure />
            <Footer 
              onAboutClick={navigateToAboutUs} 
              onGuidesClick={navigateToGuides} 
              onFaqClick={navigateToFaq}
              onHistoricalRatesClick={navigateToHistoricalRates}
              onPrivacyClick={navigateToPrivacyPolicy}
              onTermsClick={navigateToTermsOfService}
              onCookiesClick={navigateToCookiePolicy}
              onLegalDisclosureClick={navigateToLegalDisclosure}
              onCareersClick={navigateToCareers}
            />
          </div>
        );
      case 'careers':
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
            <Careers />
            <Footer 
              onAboutClick={navigateToAboutUs} 
              onGuidesClick={navigateToGuides} 
              onFaqClick={navigateToFaq}
              onHistoricalRatesClick={navigateToHistoricalRates}
              onPrivacyClick={navigateToPrivacyPolicy}
              onTermsClick={navigateToTermsOfService}
              onCookiesClick={navigateToCookiePolicy}
              onLegalDisclosureClick={navigateToLegalDisclosure}
              onCareersClick={navigateToCareers}
            />
          </div>
        );
      case 'press':
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
            <Press />
            <Footer 
              onAboutClick={navigateToAboutUs} 
              onGuidesClick={navigateToGuides} 
              onFaqClick={navigateToFaq}
              onHistoricalRatesClick={navigateToHistoricalRates}
              onPrivacyClick={navigateToPrivacyPolicy}
              onTermsClick={navigateToTermsOfService}
              onCookiesClick={navigateToCookiePolicy}
              onLegalDisclosureClick={navigateToLegalDisclosure}
              onCareersClick={navigateToCareers}
              onPressClick={navigateToPress}
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
  
  return (
    <div className="MoneyCompare">
      <CanonicalUrl />
      <Routes>
        <Route path="/" element={renderPageContent()} />
        <Route path="/results" element={renderPageContent()} />
        <Route path="/about" element={renderPageContent()} />
        <Route path="/guides" element={renderPageContent()} />
        <Route path="/guides/getting-started" element={renderPageContent()} />
        <Route path="/guides/exchange-rates" element={renderPageContent()} />
        <Route path="/guides/transfer-fees" element={renderPageContent()} />
        <Route path="/guides/family-remittances" element={renderPageContent()} />
        <Route path="/guides/business-transfers" element={renderPageContent()} />
        <Route path="/guides/security-tips" element={renderPageContent()} />
        <Route path="/faq" element={renderPageContent()} />
        <Route path="/historical-rates" element={renderPageContent()} />
        <Route path="/privacy-policy" element={renderPageContent()} />
        <Route path="/terms-of-service" element={renderPageContent()} />
        <Route path="/cookie-policy" element={renderPageContent()} />
        <Route path="/careers" element={renderPageContent()} />
        <Route path="/press" element={renderPageContent()} />
        {/* Legal Disclosure route temporarily hidden
        <Route path="/legal-disclosure" element={renderPageContent()} />
        */}
        <Route path="*" element={renderPageContent()} />
      </Routes>
    </div>
  );
};

export default MoneyCompare; 