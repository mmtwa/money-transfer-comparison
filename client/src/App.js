import React, { useEffect, useState, lazy, Suspense } from 'react';
import { BrowserRouter, useNavigate, Route, Routes } from 'react-router-dom';
import MoneyCompare from './containers/MoneyCompare';
import Analytics from './components/Analytics';
import FontLoader from './components/FontLoader';
import StructuredData from './components/StructuredData';
import CookieConsent from './components/CookieConsent';
import Login from './pages/Login';
import './App.css';
import Careers from './pages/Careers';
import { AuthProvider } from './hooks/useAuth';

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
    if (path === '/' || path.includes('/compare')) return 'comparison';
    return 'home';
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

  // Check if we're on an admin route
  const isAdminRoute = initialPath.startsWith('/admin');

  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <div className={`App ${isAppReady ? 'render-ready' : ''}`}>
            {!isAdminRoute && (
              <>
                <StructuredData page={getPageType()} />
                <Analytics measurementId={measurementId} />
                <FontLoader />
                <MoneyCompare initialPath={initialPath} />
                
                {/* Cookie Consent Banner */}
                <CookieConsentWithNavigation />
              </>
            )}
            
            {/* Admin Routes */}
            <Routes>
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
