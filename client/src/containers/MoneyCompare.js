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
import RegularTransfers from '../pages/guides/frequency/RegularTransfers';
import PeriodicTransfers from '../pages/guides/frequency/PeriodicTransfers';
import OneTimeTransfers from '../pages/guides/frequency/OneTimeTransfers';
import OccasionalTransfers from '../pages/guides/frequency/OccasionalTransfers';
import SendMoneyToIndiaGuide from '../pages/guides/send-money-to-india';
import SendMoneyToPhilippinesGuide from '../pages/guides/send-money-to-philippines';
import SendMoneyToMexicoGuide from '../pages/guides/send-money-to-mexico';
import SendMoneyToPakistanGuide from '../pages/guides/send-money-to-pakistan';
import SendMoneyToNigeriaGuide from '../pages/guides/send-money-to-nigeria';
import SendMoneyToPolandGuide from '../pages/guides/send-money-to-poland';
import SendMoneyToRomaniaGuide from '../pages/guides/send-money-to-romania';
import SendMoneyToChinaGuide from '../pages/guides/send-money-to-china';
import SendMoneyToVietnamGuide from '../pages/guides/send-money-to-vietnam';
import SendMoneyToBangladeshGuide from '../pages/guides/send-money-to-bangladesh';
import SendMoneyToCanadaGuide from '../pages/guides/send-money-to-canada';
import SendMoneyToMoroccoGuide from '../pages/guides/send-money-to-morocco';
import PrivacyPolicy from '../pages/PrivacyPolicy';
import TermsOfService from '../pages/TermsOfService';
import CookiePolicy from '../pages/CookiePolicy';
import LegalDisclosure from '../pages/LegalDisclosure';
import Careers from '../pages/Careers';
import Press from '../pages/Press';
import HighValueTransfers from '../pages/guides/HighValueTransfers';
import MidValueTransfers from '../pages/guides/MidValueTransfers';
import LowValueTransfers from '../pages/guides/LowValueTransfers';
import MicroTransfers from '../pages/guides/MicroTransfers';
import BuyingPropertyAbroad from '../pages/guides/BuyingPropertyAbroad';
import StudyingAbroad from '../pages/guides/StudyingAbroad';
import SendingToFamily from '../pages/guides/SendingToFamily';
import DigitalNomads from '../pages/guides/DigitalNomads';
import BusinessPurpose from '../pages/guides/BusinessPurpose';
import UkAsia from '../pages/guides/corridors/UkAsia';
import UsLatam from '../pages/guides/corridors/UsLatam';
import EuAfrica from '../pages/guides/corridors/EuAfrica';
import AusPacific from '../pages/guides/corridors/AusPacific';
import GulfAsia from '../pages/guides/corridors/GulfAsia';
import CostOptimizing from '../pages/guides/criteria/CostOptimizing';
import Convenience from '../pages/guides/criteria/Convenience';
import Security from '../pages/guides/criteria/Security';
import Service from '../pages/guides/criteria/Service';
import DigitalNative from '../pages/guides/method/DigitalNative';
import DigitalAdapter from '../pages/guides/method/DigitalAdapter';
import Traditional from '../pages/guides/method/Traditional';
import TransitionLoader from '../components/ui/TransitionLoader';

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
  // New state to control the transition animation
  const [showTransition, setShowTransition] = useState(false);
  const [isNavigatingToResults, setIsNavigatingToResults] = useState(false);
  
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
    } else if (path === '/guides/high-value') {
      setCurrentPage('guide-high-value');
    } else if (path === '/guides/send-money-to-india') {
      setCurrentPage('guide-send-money-to-india');
    } else if (path === '/guides/send-money-to-philippines') {
      setCurrentPage('guide-send-money-to-philippines');
    } else if (path === '/guides/send-money-to-mexico') {
      setCurrentPage('guide-send-money-to-mexico');
    } else if (path === '/guides/send-money-to-pakistan') {
      setCurrentPage('guide-send-money-to-pakistan');
    } else if (path === '/guides/send-money-to-nigeria') {
      setCurrentPage('guide-send-money-to-nigeria');
    } else if (path === '/guides/send-money-to-poland') {
      setCurrentPage('guide-send-money-to-poland');
    } else if (path === '/guides/send-money-to-romania') {
      setCurrentPage('guide-send-money-to-romania');
    } else if (path === '/guides/send-money-to-china') {
      setCurrentPage('guide-send-money-to-china');
    } else if (path === '/guides/send-money-to-morocco') {
      setCurrentPage('guide-send-money-to-morocco');
    } else if (path === '/guides/send-money-to-vietnam') {
      setCurrentPage('guide-send-money-to-vietnam');
    } else if (path === '/guides/send-money-to-bangladesh') {
      setCurrentPage('guide-send-money-to-bangladesh');
    } else if (path === '/guides/send-money-to-canada') {
      setCurrentPage('guide-send-money-to-canada');
    } else if (path === '/guides/mid-value') {
      setCurrentPage('guide-mid-value');
    } else if (path === '/guides/low-value') {
      setCurrentPage('guide-low-value');
    } else if (path === '/guides/micro') {
      setCurrentPage('guide-micro');
    } else if (path === '/guides/purpose/property') {
      setCurrentPage('guide-property');
    } else if (path === '/guides/purpose/study') {
      setCurrentPage('guide-study');
    } else if (path === '/guides/purpose/family') {
      setCurrentPage('guide-family');
    } else if (path === '/guides/purpose/nomad') {
      setCurrentPage('guide-nomad');
    } else if (path === '/guides/purpose/business') {
      setCurrentPage('guide-business');
    } else if (path === '/guides/frequency/regular') {
      setCurrentPage('guide-regular-transfers');
    } else if (path === '/guides/frequency/periodic') {
      setCurrentPage('guide-periodic-transfers');
    } else if (path === '/guides/frequency/one-time') {
      setCurrentPage('guide-one-time-transfers');
    } else if (path === '/guides/frequency/occasional') {
      setCurrentPage('guide-occasional-transfers');
    } else if (path === '/guides/corridors/uk-asia') {
      setCurrentPage('guide-uk-asia');
    } else if (path === '/guides/corridors/us-latam') {
      setCurrentPage('guide-us-latam');
    } else if (path === '/guides/corridors/eu-africa') {
      setCurrentPage('guide-eu-africa');
    } else if (path === '/guides/corridors/aus-pacific') {
      setCurrentPage('guide-aus-pacific');
    } else if (path === '/guides/corridors/gulf-asia') {
      setCurrentPage('guide-gulf-asia');
    } else if (path === '/guides/criteria/cost') {
      setCurrentPage('guide-cost-optimizing');
    } else if (path === '/guides/criteria/convenience') {
      setCurrentPage('guide-convenience');
    } else if (path === '/guides/criteria/security') {
      setCurrentPage('guide-security');
    } else if (path === '/guides/criteria/service') {
      setCurrentPage('guide-service');
    } else if (path === '/guides/method/digital-native') {
      setCurrentPage('guide-digital-native');
    } else if (path === '/guides/method/digital-adapter') {
      setCurrentPage('guide-digital-adapter');
    } else if (path === '/guides/method/traditional') {
      setCurrentPage('guide-traditional');
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
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === '/') {
        setCurrentPage('home');
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
      } else if (path === '/guides/send-money-to-india') {
        setCurrentPage('guide-send-money-to-india');
      } else if (path === '/guides/send-money-to-philippines') {
        setCurrentPage('guide-send-money-to-philippines');
      } else if (path === '/guides/send-money-to-mexico') {
        setCurrentPage('guide-send-money-to-mexico');
      } else if (path === '/guides/send-money-to-pakistan') {
        setCurrentPage('guide-send-money-to-pakistan');
      } else if (path === '/guides/send-money-to-nigeria') {
        setCurrentPage('guide-send-money-to-nigeria');
      } else if (path === '/guides/send-money-to-poland') {
        setCurrentPage('guide-send-money-to-poland');
      } else if (path === '/guides/send-money-to-romania') {
        setCurrentPage('guide-send-money-to-romania');
      } else if (path === '/guides/send-money-to-china') {
        setCurrentPage('guide-send-money-to-china');
      } else if (path === '/guides/send-money-to-morocco') {
        setCurrentPage('guide-send-money-to-morocco');
      } else if (path === '/guides/send-money-to-vietnam') {
        setCurrentPage('guide-send-money-to-vietnam');
      } else if (path === '/guides/send-money-to-bangladesh') {
        setCurrentPage('guide-send-money-to-bangladesh');
      } else if (path === '/guides/send-money-to-canada') {
        setCurrentPage('guide-send-money-to-canada');
      } else if (path === '/guides/mid-value') {
        setCurrentPage('guide-mid-value');
      } else if (path === '/guides/low-value') {
        setCurrentPage('guide-low-value');
      } else if (path === '/guides/micro') {
        setCurrentPage('guide-micro');
      } else if (path === '/guides/purpose/property') {
        setCurrentPage('guide-property');
      } else if (path === '/guides/purpose/study') {
        setCurrentPage('guide-study');
      } else if (path === '/guides/purpose/family') {
        setCurrentPage('guide-family');
      } else if (path === '/guides/purpose/nomad') {
        setCurrentPage('guide-nomad');
      } else if (path === '/guides/purpose/business') {
        setCurrentPage('guide-business');
      } else if (path === '/guides/frequency/regular') {
        setCurrentPage('guide-regular-transfers');
      } else if (path === '/guides/frequency/periodic') {
        setCurrentPage('guide-periodic-transfers');
      } else if (path === '/guides/frequency/one-time') {
        setCurrentPage('guide-one-time-transfers');
      } else if (path === '/guides/frequency/occasional') {
        setCurrentPage('guide-occasional-transfers');
      } else if (path === '/guides/corridors/uk-asia') {
        setCurrentPage('guide-uk-asia');
      } else if (path === '/guides/corridors/us-latam') {
        setCurrentPage('guide-us-latam');
      } else if (path === '/guides/corridors/eu-africa') {
        setCurrentPage('guide-eu-africa');
      } else if (path === '/guides/corridors/aus-pacific') {
        setCurrentPage('guide-aus-pacific');
      } else if (path === '/guides/corridors/gulf-asia') {
        setCurrentPage('guide-gulf-asia');
      } else if (path === '/guides/criteria/cost') {
        setCurrentPage('guide-cost-optimizing');
      } else if (path === '/guides/criteria/convenience') {
        setCurrentPage('guide-convenience');
      } else if (path === '/guides/criteria/security') {
        setCurrentPage('guide-security');
      } else if (path === '/guides/criteria/service') {
        setCurrentPage('guide-service');
      } else if (path === '/guides/method/digital-native') {
        setCurrentPage('guide-digital-native');
      } else if (path === '/guides/method/digital-adapter') {
        setCurrentPage('guide-digital-adapter');
      } else if (path === '/guides/method/traditional') {
        setCurrentPage('guide-traditional');
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
    };
    
    // Add event listener for the browser back button
    window.addEventListener('popstate', handlePopState);
    
    // Clean up
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [currentPage]);
  
  const handleSearch = (data) => {
    // First make sure any results content is hidden during transition
    const resultsContent = document.getElementById('results-content');
    if (resultsContent) {
      resultsContent.style.opacity = '0';
    }
    
    setSearchData(data);
    setShowTransition(true);
    setIsNavigatingToResults(true);
    
    // Navigation to results page will be handled after the transition animation completes
  };
  
  // This function is called when the transition animation completes
  const handleTransitionComplete = () => {
    if (isNavigatingToResults) {
      // Set the current page and update URL first
      setCurrentPage('results');
      
      // Update URL using React Router
      navigate('/results', { 
        state: { fromHomepage: true, searchData }
      });
      
      // Hide the transition animation
      setShowTransition(false);
      
      // After a short delay, make sure any elements with ID 'results-content' are visible
      setTimeout(() => {
        const resultsContent = document.getElementById('results-content');
        if (resultsContent) {
          resultsContent.style.opacity = '1';
        }
        setIsNavigatingToResults(false);
      }, 100);
    } else {
      // Just hide the transition in case it's ever shown
      setShowTransition(false);
    }
  };
  
  const handleBackToHome = () => {
    // Create a smooth transition directly without using the TransitionLoader
    // Add a white overlay that fades in and out quickly
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.inset = '0';
    overlay.style.backgroundColor = 'white';
    overlay.style.opacity = '0';
    overlay.style.zIndex = '40';
    overlay.style.transition = 'opacity 300ms ease-in-out';
    document.body.appendChild(overlay);

    // Fade in
    setTimeout(() => {
      overlay.style.opacity = '1';
    }, 10);

    // After fade in, navigate and update state
    setTimeout(() => {
      setCurrentPage('home');
      
      // Update URL using React Router
      navigate('/', { 
        state: { fromResults: true, searchData } 
      });
      
      // Start fade out
      setTimeout(() => {
        overlay.style.opacity = '0';
        
        // Remove overlay after fade out completes
        setTimeout(() => {
          document.body.removeChild(overlay);
        }, 300);
      }, 50);
    }, 300);
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
      case 'guide-high-value':
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
            <HighValueTransfers />
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
      case 'guide-send-money-to-india':
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
            <SendMoneyToIndiaGuide />
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
      case 'guide-send-money-to-philippines':
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
            <SendMoneyToPhilippinesGuide />
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
      case 'guide-send-money-to-mexico':
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
            <SendMoneyToMexicoGuide />
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
      case 'guide-send-money-to-pakistan':
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
            <SendMoneyToPakistanGuide />
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
      case 'guide-send-money-to-nigeria':
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
            <SendMoneyToNigeriaGuide />
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
      case 'guide-send-money-to-poland':
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
            <SendMoneyToPolandGuide />
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
      case 'guide-send-money-to-romania':
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
            <SendMoneyToRomaniaGuide />
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
      case 'guide-send-money-to-china':
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
            <SendMoneyToChinaGuide />
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
      case 'guide-send-money-to-morocco':
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
            <SendMoneyToMoroccoGuide />
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
      case 'guide-send-money-to-vietnam':
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
            <SendMoneyToVietnamGuide />
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
      case 'guide-send-money-to-bangladesh':
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
            <SendMoneyToBangladeshGuide />
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
      case 'guide-send-money-to-canada':
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
            <SendMoneyToCanadaGuide />
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
      case 'guide-mid-value':
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
            <MidValueTransfers />
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
      case 'guide-low-value':
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
            <LowValueTransfers />
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
      case 'guide-micro':
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
            <MicroTransfers />
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
      case 'guide-property':
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
            <BuyingPropertyAbroad />
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
      case 'guide-study':
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
            <StudyingAbroad />
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
      case 'guide-family':
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
            <SendingToFamily />
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
      case 'guide-nomad':
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
            <DigitalNomads />
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
      case 'guide-business':
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
            <BusinessPurpose />
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
      case 'guide-regular-transfers':
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
            <RegularTransfers />
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
      case 'guide-periodic-transfers':
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
            <PeriodicTransfers />
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
      case 'guide-one-time-transfers':
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
            <OneTimeTransfers />
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
      case 'guide-occasional-transfers':
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
            <OccasionalTransfers />
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
      case 'guide-uk-asia':
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
            <UkAsia />
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
      case 'guide-us-latam':
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
            <UsLatam />
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
      case 'guide-eu-africa':
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
            <EuAfrica />
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
      case 'guide-aus-pacific':
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
            <AusPacific />
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
      case 'guide-gulf-asia':
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
            <GulfAsia />
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
      case 'guide-cost-optimizing':
        return <CostOptimizing />;
      case 'guide-convenience':
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
            <Convenience />
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
      case 'guide-security':
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
            <Security />
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
      case 'guide-service':
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
            <Service />
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
      case 'guide-digital-native':
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
            <DigitalNative />
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
      case 'guide-digital-adapter':
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
            <DigitalAdapter />
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
      case 'guide-traditional':
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
            <Traditional />
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
    <>
      {renderPageContent()}
      
      {/* Transition Loader */}
      <TransitionLoader 
        isVisible={showTransition}
        fromCurrency={searchData.fromCurrency}
        toCurrency={searchData.toCurrency}
        amount={searchData.amount}
        onAnimationComplete={handleTransitionComplete}
        isReturningToSearch={!isNavigatingToResults}
      />
    </>
  );
};

export default MoneyCompare; 