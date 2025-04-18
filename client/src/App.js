import React from 'react';
import ModernMoneyCompare from './components/ModernMoneyCompare';
import Analytics from './components/Analytics';
import './App.css';

function App() {
  const measurementId = 'G-90Q0L28ZF4';
  return (
    <div className="App">
            <Analytics measurementId={measurementId} />
      <ModernMoneyCompare />
    </div>
  );
}

export default App;
