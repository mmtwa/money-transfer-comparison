import React from 'react';
import MoneyCompare from './containers/MoneyCompare';
import Analytics from './components/Analytics';
import './App.css';

function App() {
  const measurementId = 'G-90Q0L28ZF4';
  return (
    <div className="App">
      <Analytics measurementId={measurementId} />
      <MoneyCompare />
    </div>
  );
}

export default App;
