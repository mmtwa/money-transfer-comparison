import React, { useEffect, useState, lazy, Suspense } from 'react';
import { BrowserRouter, useNavigate, Route, Routes } from 'react-router-dom';
import MoneyCompare from './containers/MoneyCompare';
import Analytics from './components/Analytics';
import FontLoader from './components/FontLoader';
import SEO from './components/SEO';
import CookieConsent from './components/CookieConsent';
import Login from './pages/Login';
import './App.css';
import { AuthProvider } from './hooks/useAuth';
import { getSchemaByPageType } from './utils/structuredData';

// Lazy load admin components
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const ProviderList = lazy(() => import('./pages/admin/providers/ProviderList'));
const AddProvider = lazy(() => import('./pages/admin/providers/AddProvider'));
const EditProvider = lazy(() => import('./pages/admin/providers/EditProvider'));

// Lazy load ad partners components
const AdPartnerList = lazy(() => import('./pages/admin/adPartners/AdPartnerList'));
const AddAdPartner = lazy(() => import('./pages/admin/adPartners/AddAdPartner'));
const EditAdPartner = lazy(() => import('./pages/admin/adPartners/EditAdPartner'));

// Lazy load content components
const ContentList = lazy(() => import('./pages/admin/content/ContentList'));
const ContentForm = lazy(() => import('./pages/admin/content/ContentForm'));
const ContentDetail = lazy(() => import('./pages/admin/content/ContentDetail'));

// Lazy load non-critical components
const PreloadFlags = lazy(() => import('./components/ui/PreloadFlags'));

function App() {
  const measurementId = 'G-90Q0L28ZF4';
  const [initialPath, setInitialPath] = useState(window.location.pathname);
  const [isAppReady, setIsAppReady] = useState(false);
  
  // Initialize the app with the correct path based on URL
  useEffect(() => {
    // If we need to handle any initial URL state, do it here
    const handleInitialPath = () => {
      setInitialPath(window.location.pathname);
    };
    
    // Set initial path on load
    handleInitialPath();
    
    // Set up path listener for any external navigation
    window.addEventListener('popstate', handleInitialPath);
    
    return () => {
      window.removeEventListener('popstate', handleInitialPath);
    };
  }, []);

  // Apply render-ready class after app is loaded
  useEffect(() => {
    // Short delay to ensure DOM is ready
    const timer = setTimeout(() => {
      document.body.classList.add('render-ready', 'icons-loaded');
      setIsAppReady(true);
    }, 200);
    
    return () => clearTimeout(timer);
  }, []);

  // Determine which page we're on for structured data
  const getPageType = () => {
    const path = initialPath.toLowerCase();
    if (path.includes('/about')) return 'about';
    if (path.includes('/guides')) return 'guide';
    if (path.includes('/faq')) return 'faq';
    if (path.includes('/historical-rates')) return 'historical-rates';
    if (path === '/' || path.includes('/compare') || path.includes('/results')) return 'comparison';
    return 'home';
  };

  // Get SEO data based on page type and path
  const getSeoData = () => {
    const pageType = getPageType();
    const path = initialPath.toLowerCase();
    
    let title = 'Compare Money Transfer Services – Low Fees, Unbiased Rankings';
    let description = 'Send money overseas with confidence. MyMoneyTransfers compares international money transfer providers in real-time – 100% independent, no commissions, just the best rates.';
    
    if (pageType === 'about') {
      title = 'About Us – Independent Money Transfer Comparisons';
      description = 'Learn about MyMoneyTransfers.com, your 100% independent resource for comparing international money transfer services with no commissions, no bias – just the best rates.';
    } else if (pageType === 'faq') {
      title = 'International Money Transfer FAQs – Answers & Expert Advice';
      description = 'Get answers to common questions about international money transfers, exchange rates, fees, and finding the cheapest way to send money abroad from our independent experts.';
    } else if (pageType === 'historical-rates') {
      title = 'Historical Exchange Rates & Currency Trends Tracker';
      description = 'Monitor real-time and historical exchange rates with our interactive currency charts. Track trends, analyze volatility, and make informed decisions for international money transfers.';
    } else if (path.includes('/guides')) {
      if (path === '/guides' || path === '/guides/') {
        title = 'Money Transfer Guides – Comprehensive, Unbiased Advice';
        description = 'Explore our comprehensive guides to help you understand international money transfers, compare providers, and make informed decisions with no sponsored recommendations.';
      } else {
        // For specific country guides
        if (path.includes('send-money-to-')) {
          const country = path.replace('/guides/send-money-to-', '').replace(/-/g, ' ');
          if (country) {
            const countryName = country
              .split(' ')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ');
              
            title = `Send Money to ${countryName} – Best Options, Rates & Guide (${new Date().getFullYear()})`;
            description = `Need to send money to ${countryName}? Discover the cheapest, fastest ways – from bank transfers to online apps. MyMoneyTransfers' independent guide ranks the top providers (no bias or fees).`;
          }
        } 
        // For other specific guides
        else {
          const guidePath = path.replace('/guides/', '').replace(/-/g, ' ');
          const guideTitle = guidePath
            .split('/')
            .pop()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
            
          if (guideTitle) {
            title = `${guideTitle} – Complete Money Transfer Guide (${new Date().getFullYear()})`;
            description = `Learn all about ${guideTitle.toLowerCase()} with our comprehensive guide. Compare rates, fees, and services from multiple money transfer providers with 100% independent rankings.`;
          }
        }
      }
    }
    
    return {
      title,
      description,
      canonicalUrl: initialPath,
      structuredData: getSchemaByPageType(pageType)
    };
  };

  // Wrap CookieConsent in a component that has access to navigation
  const CookieConsentWithNavigation = () => {
    const navigate = useNavigate();
    
    const handlePrivacyClick = () => {
      navigate('/privacy-policy');
    };
    
    const handleCookiesClick = () => {
      navigate('/cookie-policy');
    };
    
    return (
      <CookieConsent 
        onPrivacyClick={handlePrivacyClick} 
        onCookiesClick={handleCookiesClick} 
      />
    );
  };

  // Public routes wrapper component
  const PublicRoutes = () => {
    const seoData = getSeoData();
    
    return (
      <>
        <SEO 
          title={seoData.title}
          description={seoData.description}
          canonicalUrl={seoData.canonicalUrl}
          structuredData={seoData.structuredData}
        />
        <Analytics measurementId={measurementId} />
        <FontLoader />
        <MoneyCompare initialPath={initialPath} />
        <CookieConsentWithNavigation />
      </>
    );
  };

  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <div className={`App ${isAppReady ? 'render-ready' : ''}`}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<PublicRoutes />} />
              <Route path="/results" element={<PublicRoutes />} />
              <Route path="/about" element={<PublicRoutes />} />
              <Route path="/guides" element={<PublicRoutes />} />
              <Route path="/guides/*" element={<PublicRoutes />} />
              <Route path="/faq" element={<PublicRoutes />} />
              <Route path="/historical-rates" element={<PublicRoutes />} />
              <Route path="/privacy-policy" element={<PublicRoutes />} />
              <Route path="/terms-of-service" element={<PublicRoutes />} />
              <Route path="/cookie-policy" element={<PublicRoutes />} />
              <Route path="/legal-disclosure" element={<PublicRoutes />} />
              <Route path="/careers" element={<PublicRoutes />} />
              <Route path="/press" element={<PublicRoutes />} />
            
              {/* Admin Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/admin" element={
                <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
                  <AdminDashboard />
                </Suspense>
              } />
              <Route path="/admin/providers" element={
                <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
                  <ProviderList />
                </Suspense>
              } />
              <Route path="/admin/providers/new" element={
                <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
                  <AddProvider />
                </Suspense>
              } />
              <Route path="/admin/providers/:id/edit" element={
                <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
                  <EditProvider />
                </Suspense>
              } />
              
              {/* Ad Partners Routes */}
              <Route path="/admin/ad-partners" element={
                <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
                  <AdPartnerList />
                </Suspense>
              } />
              <Route path="/admin/ad-partners/new" element={
                <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
                  <AddAdPartner />
                </Suspense>
              } />
              <Route path="/admin/ad-partners/:id/edit" element={
                <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
                  <EditAdPartner />
                </Suspense>
              } />
              
              {/* Content Routes */}
              <Route path="/admin/content" element={
                <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
                  <ContentList />
                </Suspense>
              } />
              <Route path="/admin/content/new" element={
                <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
                  <ContentForm />
                </Suspense>
              } />
              <Route path="/admin/content/:id/edit" element={
                <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
                  <ContentForm />
                </Suspense>
              } />
              <Route path="/admin/content/:id/view" element={
                <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
                  <ContentDetail />
                </Suspense>
              } />
              
              {/* Catch-all route */}
              <Route path="*" element={<PublicRoutes />} />
            </Routes>
            
            {/* Lazy load non-critical components */}
            <Suspense fallback={null}>
              <PreloadFlags />
            </Suspense>
          </div>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
