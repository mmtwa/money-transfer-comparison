import React, { useEffect, useState, lazy, Suspense } from 'react';
import MoneyCompare from './containers/MoneyCompare';
import Analytics from './components/Analytics';
import FontLoader from './components/FontLoader';
import './App.css';

// Lazy load non-critical components
const PreloadFlags = lazy(() => import('./components/ui/PreloadFlags'));

function App() {
  const measurementId = 'G-90Q0L28ZF4';
  const [initialPath, setInitialPath] = useState(window.location.pathname);
  
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="App">
        <Analytics measurementId={measurementId} />
        <FontLoader />
        <MoneyCompare initialPath={initialPath} />
        
        {/* Lazy load non-critical components */}
        <Suspense fallback={null}>
          <PreloadFlags />
        </Suspense>
      </div>
    </div>
  );
}

export default App;
