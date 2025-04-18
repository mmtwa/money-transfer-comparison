import React, { useState, useRef, useEffect } from 'react';
import { ArrowRightCircle, Search, ChevronDown } from 'lucide-react';

const MoneyTransferComparison = () => {
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [amount, setAmount] = useState(1000);
  const [showResults, setShowResults] = useState(false);
  
  // Dropdown states
  const [fromDropdownOpen, setFromDropdownOpen] = useState(false);
  const [toDropdownOpen, setToDropdownOpen] = useState(false);
  
  // Refs for detecting clicks outside dropdowns
  const fromDropdownRef = useRef(null);
  const toDropdownRef = useRef(null);
  
  const handleSearch = () => {
    setShowResults(true);
  };
  
  // Currency options with simpler flag representations
  const currencies = [
    { 
      code: 'USD', 
      name: 'US Dollar', 
      symbol: '$',
      flagColors: ['#B22234', '#FFFFFF', '#3C3B6E']
    },
    { 
      code: 'EUR', 
      name: 'Euro', 
      symbol: '€',
      flagColors: ['#0052B4', '#FFDA44']
    },
    { 
      code: 'GBP', 
      name: 'British Pound', 
      symbol: '£',
      flagColors: ['#012169', '#FFFFFF', '#C8102E']
    },
    { 
      code: 'JPY', 
      name: 'Japanese Yen', 
      symbol: '¥',
      flagColors: ['#FFFFFF', '#BC002D']
    },
    { 
      code: 'CAD', 
      name: 'Canadian Dollar', 
      symbol: 'CA$',
      flagColors: ['#FFFFFF', '#FF0000']
    },
    { 
      code: 'AUD', 
      name: 'Australian Dollar', 
      symbol: 'A$',
      flagColors: ['#0052B4', '#FFFFFF', '#FF0000']
    },
    { 
      code: 'INR', 
      name: 'Indian Rupee', 
      symbol: '₹',
      flagColors: ['#FF9933', '#FFFFFF', '#138808', '#000080']
    }
  ];
  
  // Simplified flag component 
  const FlagIcon = ({ code, colors }) => {
    return (
      <div className="w-6 h-4 rounded-sm overflow-hidden flex-shrink-0 border border-gray-200">
        {code === 'USD' && (
          <div style={{ background: colors[0], height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ background: colors[2], width: '30%', height: '50%' }}></div>
          </div>
        )}
        {code === 'EUR' && (
          <div style={{ background: colors[0], height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ border: `1px solid ${colors[1]}`, borderRadius: '50%', width: '60%', height: '60%' }}></div>
          </div>
        )}
        {code === 'GBP' && (
          <div style={{ background: colors[0], height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ color: colors[1], fontWeight: 'bold', fontSize: '10px' }}>UK</div>
          </div>
        )}
        {code === 'JPY' && (
          <div style={{ background: colors[0], height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ background: colors[1], borderRadius: '50%', width: '40%', height: '60%' }}></div>
          </div>
        )}
        {code === 'CAD' && (
          <div style={{ background: colors[0], height: '100%', display: 'flex' }}>
            <div style={{ background: colors[1], width: '25%', height: '100%' }}></div>
            <div style={{ width: '50%' }}></div>
            <div style={{ background: colors[1], width: '25%', height: '100%' }}></div>
          </div>
        )}
        {code === 'AUD' && (
          <div style={{ background: colors[0], height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ color: colors[1], fontWeight: 'bold', fontSize: '8px' }}>AU</div>
          </div>
        )}
        {code === 'INR' && (
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ background: colors[0], height: '33%' }}></div>
            <div style={{ background: colors[1], height: '34%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <div style={{ background: colors[3], borderRadius: '50%', width: '20%', height: '60%' }}></div>
            </div>
            <div style={{ background: colors[2], height: '33%' }}></div>
          </div>
        )}
      </div>
    );
  };
  
  // Get currency details by code
  const getCurrencyByCode = (code) => {
    return currencies.find(currency => currency.code === code);
  };
  
  // Handle outside clicks to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (fromDropdownRef.current && !fromDropdownRef.current.contains(event.target)) {
        setFromDropdownOpen(false);
      }
      if (toDropdownRef.current && !toDropdownRef.current.contains(event.target)) {
        setToDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Custom dropdown for "From" currency
  const FromCurrencyDropdown = () => {
    const selectedCurrency = getCurrencyByCode(fromCurrency);
    
    return (
      <div className="relative w-2/5" ref={fromDropdownRef}>
        <div 
          className="h-full appearance-none border-0 bg-gray-100 rounded-l p-3 text-gray-800 focus:outline-none cursor-pointer flex items-center justify-between"
          onClick={() => setFromDropdownOpen(!fromDropdownOpen)}
        >
          <div className="flex items-center">
            <FlagIcon code={selectedCurrency.code} colors={selectedCurrency.flagColors} />
            <span className="ml-2 font-medium">{selectedCurrency.code}</span>
          </div>
          <ChevronDown size={16} className="text-gray-600 ml-1" />
        </div>
        
        {fromDropdownOpen && (
          <div className="absolute top-full left-0 w-64 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
            {currencies.map(currency => (
              <div 
                key={currency.code}
                className={`p-3 flex items-center hover:bg-gray-50 cursor-pointer ${currency.code === fromCurrency ? 'bg-blue-50' : ''}`}
                onClick={() => {
                  setFromCurrency(currency.code);
                  setFromDropdownOpen(false);
                }}
              >
                <FlagIcon code={currency.code} colors={currency.flagColors} />
                <div className="ml-2">
                  <div className="font-medium">{currency.code}</div>
                  <div className="text-xs text-gray-500">{currency.name}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };
  
  // Custom dropdown for "To" currency
  const ToCurrencyDropdown = () => {
    const selectedCurrency = getCurrencyByCode(toCurrency);
    
    return (
      <div className="relative" ref={toDropdownRef}>
        <div 
          className="w-full appearance-none border-0 bg-gray-100 rounded p-3 text-gray-800 focus:outline-none cursor-pointer flex items-center justify-between"
          onClick={() => setToDropdownOpen(!toDropdownOpen)}
        >
          <div className="flex items-center">
            <FlagIcon code={selectedCurrency.code} colors={selectedCurrency.flagColors} />
            <span className="ml-2 font-medium">{selectedCurrency.code}</span>
          </div>
          <ChevronDown size={16} className="text-gray-600 ml-1" />
        </div>
        
        {toDropdownOpen && (
          <div className="absolute top-full left-0 w-64 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
            {currencies.map(currency => (
              <div 
                key={currency.code}
                className={`p-3 flex items-center hover:bg-gray-50 cursor-pointer ${currency.code === toCurrency ? 'bg-blue-50' : ''}`}
                onClick={() => {
                  setToCurrency(currency.code);
                  setToDropdownOpen(false);
                }}
              >
                <FlagIcon code={currency.code} colors={currency.flagColors} />
                <div className="ml-2">
                  <div className="font-medium">{currency.code}</div>
                  <div className="text-xs text-gray-500">{currency.name}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-r from-blue-500 via-blue-400 to-indigo-500">
      {/* Navigation Bar */}
      <div className="absolute top-0 left-0 w-full z-10">
        <header className="px-8 py-6">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-white">MoneyCompare</h1>
            </div>
            <div className="flex space-x-6">
              <button className="text-white hover:text-white/80 font-medium">Features</button>
              <button className="text-white hover:text-white/80 font-medium">Pricing</button>
              <button className="text-white hover:text-white/80 font-medium">Use cases</button>
              <button className="text-white hover:text-white/80 font-medium">Resources</button>
            </div>
            <div className="flex space-x-4">
              <button className="px-4 py-2 text-white hover:text-white/80 font-medium">Log in</button>
              <button className="px-4 py-2 bg-white text-blue-600 rounded-full font-medium hover:bg-white/90 shadow-md">Sign up</button>
            </div>
          </div>
        </header>
      </div>
      
      {/* Main Content */}
      <div className="flex items-center justify-center min-h-screen">
        {/* Currency Widget */}
        <div className="absolute left-24 z-10">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden w-96 border border-gray-100">
            <div className="p-6">
              <h2 className="text-lg font-bold mb-6 text-center text-gray-800">Compare Money Transfers</h2>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-1">You Send</label>
                <div className="flex">
                  <FromCurrencyDropdown />
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Math.max(0, Number(e.target.value)))}
                    className="w-3/5 border-0 bg-gray-100 rounded-r p-3 focus:outline-none text-gray-800 font-medium text-right"
                    min="0"
                  />
                </div>
              </div>
              
              <div className="flex justify-center my-4">
                <ArrowRightCircle size={24} className="text-blue-500" />
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-600 mb-1">They Receive</label>
                <ToCurrencyDropdown />
              </div>
              
              <button 
                onClick={handleSearch}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-md font-medium flex items-center justify-center transition duration-200"
              >
                <Search size={18} className="mr-2" />
                Compare Providers
              </button>
              
              <div className="mt-4 text-xs text-center text-gray-500">
                Compare rates from 5+ providers instantly
              </div>
            </div>
            
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Get unlimited transfers</span>
                <span className="text-sm text-blue-600 font-medium cursor-pointer hover:text-blue-700 transition-colors">Upgrade to Pro</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Hero Text - Right Side */}
        <div className="absolute right-20 max-w-xl text-white z-10">
          <h1 className="text-6xl font-bold mb-6">Need to send money overseas?</h1>
          <p className="text-xl mb-8">Find the best rates and lowest fees for international money transfers. Save up to 90% compared to banks.</p>
        </div>
      </div>
    </div>
  );
};

export default MoneyTransferComparison;
