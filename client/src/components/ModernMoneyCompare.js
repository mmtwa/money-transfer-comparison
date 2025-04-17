import React, { useState, useEffect } from 'react';
import { Search, ArrowUpDown, ExternalLink, ChevronDown } from 'lucide-react';

// Mock data for providers
const providers = [
  {
    id: 1,
    name: 'Wise (TransferWise)',
    logo: <img src="/wiselogo.png" alt="Wise logo" width="150" height="150" />,
    exchangeRateMargin: 0.005, // 0.5%
    transferFee: 3.99,
    transferTime: '1-2 days',
    rating: 4.8,
    features: ['Low fees', 'No hidden costs', 'Instant transfers available'],
  },
  {
    id: 2,
    name: 'XE Money Transfer',
    logo: '💱',
    exchangeRateMargin: 0.01, // 1%
    transferFee: 0,
    transferTime: '2-3 days',
    rating: 4.5,
    features: ['No transfer fees', 'Competitive rates', 'Easy tracking'],
  },
  {
    id: 3,
    name: 'OFX',
    logo: '🌐',
    exchangeRateMargin: 0.008, // 0.8%
    transferFee: 0,
    transferTime: '3-5 days',
    rating: 4.4,
    features: ['No transfer fees', 'Specialized in large transfers', '24/7 support'],
  },
  {
    id: 4,
    name: 'Western Union',
    logo: '📨',
    exchangeRateMargin: 0.025, // 2.5%
    transferFee: 5.99,
    transferTime: 'Same day',
    rating: 4.0,
    features: ['Cash pickup available', 'Global network', 'Same day transfers'],
  },
  {
    id: 5,
    name: 'Remitly',
    logo: '💸',
    exchangeRateMargin: 0.015, // 1.5%
    transferFee: 2.99,
    transferTime: '0-2 days',
    rating: 4.2,
    features: ['Mobile-friendly', 'Fast delivery', 'First transfer promotion'],
  },
];

// Comprehensive list of world currencies
const currenciesList = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
  { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', flag: '🇨🇭' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳' },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$', flag: '🇭🇰' },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$', flag: '🇳🇿' },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', flag: '🇸🇪' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', flag: '🇸🇬' },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr', flag: '🇳🇴' },
  { code: 'MXN', name: 'Mexican Peso', symbol: '$', flag: '🇲🇽' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', flag: '🇧🇷' },
  { code: 'RUB', name: 'Russian Ruble', symbol: '₽', flag: '🇷🇺' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R', flag: '🇿🇦' },
  { code: 'TRY', name: 'Turkish Lira', symbol: '₺', flag: '🇹🇷' },
  { code: 'DKK', name: 'Danish Krone', symbol: 'kr', flag: '🇩🇰' },
  { code: 'PLN', name: 'Polish Złoty', symbol: 'zł', flag: '🇵🇱' },
  { code: 'THB', name: 'Thai Baht', symbol: '฿', flag: '🇹🇭' },
  { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp', flag: '🇮🇩' },
  { code: 'HUF', name: 'Hungarian Forint', symbol: 'Ft', flag: '🇭🇺' },
  { code: 'CZK', name: 'Czech Koruna', symbol: 'Kč', flag: '🇨🇿' },
  { code: 'ILS', name: 'Israeli New Shekel', symbol: '₪', flag: '🇮🇱' },
  { code: 'CLP', name: 'Chilean Peso', symbol: '$', flag: '🇨🇱' },
  { code: 'PHP', name: 'Philippine Peso', symbol: '₱', flag: '🇵🇭' },
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', flag: '🇦🇪' },
  { code: 'COP', name: 'Colombian Peso', symbol: '$', flag: '🇨🇴' },
  { code: 'SAR', name: 'Saudi Riyal', symbol: '﷼', flag: '🇸🇦' },
  { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM', flag: '🇲🇾' },
  { code: 'RON', name: 'Romanian Leu', symbol: 'lei', flag: '🇷🇴' },
  { code: 'BGN', name: 'Bulgarian Lev', symbol: 'лв', flag: '🇧🇬' },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩', flag: '🇰🇷' },
  { code: 'EGP', name: 'Egyptian Pound', symbol: 'E£', flag: '🇪🇬' },
  { code: 'ARS', name: 'Argentine Peso', symbol: '$', flag: '🇦🇷' },
  { code: 'QAR', name: 'Qatari Riyal', symbol: 'ر.ق', flag: '🇶🇦' },
  { code: 'KWD', name: 'Kuwaiti Dinar', symbol: 'د.ك', flag: '🇰🇼' },
  { code: 'NGN', name: 'Nigerian Naira', symbol: '₦', flag: '🇳🇬' },
];

// Generate exchange rates for all currency pairs
const generateExchangeRates = () => {
  const rates = {};
  
  // Initialize structure for each currency
  currenciesList.forEach(currency => {
    rates[currency.code] = {};
  });
  
  // Base rates against USD
  const baseRatesAgainstUSD = {
    USD: 1.00,
    EUR: 0.91,
    GBP: 0.78,
    JPY: 110.23,
    AUD: 1.43,
    CAD: 1.35,
    CHF: 0.92,
    CNY: 7.25,
    HKD: 7.82,
    NZD: 1.58,
    SEK: 10.48,
    SGD: 1.34,
    NOK: 10.65,
    MXN: 19.87,
    INR: 73.12,
    BRL: 5.45,
    RUB: 73.78,
    ZAR: 18.35,
    TRY: 8.56,
    DKK: 6.78,
    PLN: 4.18,
    THB: 32.65,
    IDR: 14250.00,
    HUF: 330.50,
    CZK: 23.15,
    ILS: 3.28,
    CLP: 820.45,
    PHP: 50.25,
    AED: 3.67,
    COP: 3850.00,
    SAR: 3.75,
    MYR: 4.19,
    RON: 4.48,
    BGN: 1.78,
    KRW: 1175.50,
    EGP: 15.70,
    ARS: 98.50,
    QAR: 3.64,
    KWD: 0.30,
    NGN: 410.50
  };
  
  // Generate rates for all currency pairs
  currenciesList.forEach(fromCurrency => {
    currenciesList.forEach(toCurrency => {
      if (fromCurrency.code !== toCurrency.code) {
        // Calculate cross-rate via USD
        const fromToUSD = 1 / baseRatesAgainstUSD[fromCurrency.code];
        const usdToTarget = baseRatesAgainstUSD[toCurrency.code];
        rates[fromCurrency.code][toCurrency.code] = fromToUSD * usdToTarget;
      } else {
        rates[fromCurrency.code][toCurrency.code] = 1;
      }
    });
  });
  
  return rates;
};

const exchangeRates = generateExchangeRates();

// Currency flag component
const CurrencyFlag = ({ currency }) => {
  const flagUrl = `/flags/${currency.toLowerCase()}.svg`;
  
  return (
    <div className="flex-shrink-0 flex items-center justify-center">
      <img 
        src={flagUrl} 
        alt={`${currency} flag`} 
        className="w-6 h-6 rounded-full object-cover bg-gray-200"
        onError={(e) => {
          e.target.onerror = null;
          // Display the first two letters of the currency code as fallback
          e.target.src = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'><text x='50%' y='50%' font-size='10' text-anchor='middle' dominant-baseline='middle'>${currency.substring(0, 2)}</text></svg>`;
        }}
      />
    </div>
  );
};

const ModernMoneyCompare = () => {
  const [showResults, setShowResults] = useState(false);
  const [fromCurrency, setFromCurrency] = useState('GBP');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [amount, setAmount] = useState(1000);
  const [sortBy, setSortBy] = useState('amount');
  const [sortDirection, setSortDirection] = useState('desc');
  const [providerResults, setProviderResults] = useState([]);
  const [showFromCurrencyDropdown, setShowFromCurrencyDropdown] = useState(false);
  const [showToCurrencyDropdown, setShowToCurrencyDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState({ from: '', to: '' });
  
  // Calculate provider results whenever relevant parameters change
  useEffect(() => {
    if (showResults) {
      calculateProviderResults();
    }
  }, [fromCurrency, toCurrency, amount, sortBy, sortDirection, showResults]);
  
  const toggleSortDirection = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };
  
  const handleSearch = () => {
    setIsLoading(true);
    // Simulate API call with a short delay
    setTimeout(() => {
      setShowResults(true);
      setIsLoading(false);
    }, 1000);
  };
  
  const handleBackToHome = () => {
    setShowResults(false);
  };
  
  const calculateProviderResults = () => {
    // Get base exchange rate
    const baseRate = exchangeRates[fromCurrency][toCurrency];
    
    // Calculate for each provider
    const results = providers.map(provider => {
      // Calculate provider's rate with margin
      const providerRate = baseRate * (1 - provider.exchangeRateMargin);
      const amountReceived = amount * providerRate;
      const totalFees = provider.transferFee + (amount * provider.exchangeRateMargin);
      
      return {
        ...provider,
        rate: providerRate,
        amountReceived,
        totalFees,
      };
    });
    
    // Sort results
    const sortedResults = results.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'rate':
          comparison = a.rate - b.rate;
          break;
        case 'fees':
          comparison = a.totalFees - b.totalFees;
          break;
        case 'amount':
          comparison = a.amountReceived - b.amountReceived;
          break;
        case 'rating':
          comparison = a.rating - b.rating;
          break;
        default:
          comparison = a.amountReceived - b.amountReceived;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
    
    setProviderResults(sortedResults);
    return sortedResults;
  };

  const handleFromCurrencyChange = (currency) => {
    setFromCurrency(currency);
    setShowFromCurrencyDropdown(false);
  };

  const handleToCurrencyChange = (currency) => {
    setToCurrency(currency);
    setShowToCurrencyDropdown(false);
  };

  const formatAmount = (value) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  // Filter currencies based on search
  const filteredFromCurrencies = currenciesList.filter(currency => 
    currency.code.toLowerCase().includes(searchQuery.from.toLowerCase()) || 
    currency.name.toLowerCase().includes(searchQuery.from.toLowerCase())
  );

  const filteredToCurrencies = currenciesList.filter(currency => 
    currency.code.toLowerCase().includes(searchQuery.to.toLowerCase()) || 
    currency.name.toLowerCase().includes(searchQuery.to.toLowerCase())
  );
  
  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900">
      {!showResults ? (
        // Landing Page - Modern Design
        <div className="relative min-h-screen overflow-hidden bg-cover bg-[center-80%] bg-no-repeat" style={{ backgroundImage: "url('/ad.jpg')" }}>
        {/* Header */}
          <div className="absolute top-0 left-0 w-full z-10">
            <header className="px-8 py-6">
              <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center">
                <img src="/mmtlogo.png" alt="mymoneytransfers Logo" className="h-10" />
                </div>
                <div className="hidden md:flex space-x-6">
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
          <div className="flex flex-col lg:flex-row items-center justify-left min-h-screen px-20 py-16 md:py-24">
            {/* Left Side - Search Tool */}
            <div className="w-full max-w-md mx-auto lg:mx-0 lg:mr-8 z-10 mb-12 lg:mb-0">
            <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100">
                <div className="p-8">
                  <h2 className="text-3xl uppercase font-bold mb-6 text-center tracking-snug leading-none text-[#1B1464]" style={{ fontFamily: 'Special Gothic Expanded One, sans-serif' }}
                  >  
                  FIND THE BEST<br />
                  RATES FOR YOUR<br />
                  MONEY TRANSFERS</h2>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-black-600 mb-2 text-left">You send</label>
                    <div className="flex">
                      <div className="relative w-2/5">
                        <button 
                          onClick={() => {
                            setShowFromCurrencyDropdown(!showFromCurrencyDropdown);
                            setShowToCurrencyDropdown(false);
                          }}
                          className="h-full appearance-none border border-gray-500 bg-white-100 rounded-xl p-5 text-gray-800 focus:outline-none cursor-pointer flex items-center justify-between w-full"
                        >
                          <div className="flex items-center">
                            <CurrencyFlag currency={fromCurrency} />
                            <span className="ml-2 text-xl font-medium">{fromCurrency}</span>
                          </div>
                          <ChevronDown size={16} className="text-gray-600 ml-1" />
                        </button>
                        
                        {showFromCurrencyDropdown && (
                          <div className="fixed max-h-[calc(50vh-40px)] z-20 w-64 bg-white border border-gray-200 mt-1 rounded-md shadow-lg max-h-60 overflow-y-auto">
                            <div className="p-2 sticky top-0 bg-white border-b border-gray-200">
                              <input
                                type="text"
                                placeholder="Search currency..."
                                className="w-full p-2 border rounded text-sm"
                                value={searchQuery.from}
                                onChange={(e) => setSearchQuery({...searchQuery, from: e.target.value})}
                              />
                            </div>
                            {filteredFromCurrencies.map(currency => (
                              <div 
                                key={currency.code} 
                                className="p-2 hover:bg-gray-100 cursor-pointer flex items-center"
                                onClick={() => handleFromCurrencyChange(currency.code)}
                                >
                                <img 
                                  src={`/flags/${currency.code.toLowerCase()}.svg`}
                                  alt={`${currency.code} flag`}
                                  className="w-5 h-5 rounded-full object-cover mr-4 bg-gray-200"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'><text x='50%' y='50%' font-size='8' text-anchor='middle' dominant-baseline='middle'>${currency.code.substring(0, 2)}</text></svg>`;
                                  }}
                                />
                                <div className="flex flex-col text-left">
                                  <div className="font-medium">{currency.code}</div>
                                  <div className="text-xs text-gray-500">{currency.name}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <input
                        type="text"
                        value={amount.toLocaleString()}
                        onChange={(e) => {
                          // Remove non-numeric characters and convert to number
                          const numericValue = Number(e.target.value.replace(/[^0-9.]/g, ''));
                          setAmount(Math.max(0, numericValue));
                        }}
                        className="w-3/5 border border-gray-500 bg-white-100 rounded-xl p-5 focus:outline-none text-gray-800 font-medium text-xl text-right ml-8"
                        inputMode="decimal"
                      />
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-black-600 mb-2 text-left">They receive</label>
                    <div className="relative">
                      <button 
                        onClick={() => {
                          setShowToCurrencyDropdown(!showToCurrencyDropdown);
                          setShowFromCurrencyDropdown(false);
                        }}
                        className="w-full appearance-none border border-gray-500 rounded-xl p-5 text-gray-800 focus:outline-none mb-1 cursor-pointer flex items-center justify-between"
                      >
                        <div className="flex items-center">
                          <CurrencyFlag currency={toCurrency} />
                          <span className="ml-2 text-xl font-medium">{toCurrency}</span>
                        </div>
                        <ChevronDown size={16} className="text-gray-600 ml-1" />
                      </button>
                      
                      {showToCurrencyDropdown && (
                        <div className="fixed z-20 w-64 bg-white border border-gray-200 mt-1 rounded-md shadow-lg max-h-[calc(40vh-50px)] overflow-y-auto">
                          <div className="p-2 sticky top-0 bg-white border-b border-gray-200">
                            <input
                              type="text"
                              placeholder="Search currency..."
                              className="w-full p-2 border rounded text-sm"
                              value={searchQuery.to}
                              onChange={(e) => setSearchQuery({...searchQuery, to: e.target.value})}
                            />
                          </div>
                          {filteredToCurrencies.map(currency => (
                            <div 
                              key={currency.code} 
                              className="p-2 hover:bg-gray-100 cursor-pointer flex items-center"
                              onClick={() => handleToCurrencyChange(currency.code)}
                            >
                            <img 
                              src={`/flags/${currency.code.toLowerCase()}.svg`}
                              alt={`${currency.code} flag`}
                              className="w-5 h-5 rounded-full object-cover mr-[16px] bg-gray-200"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'><text x='50%' y='50%' font-size='8' text-anchor='middle' dominant-baseline='middle'>${currency.code.substring(0, 2)}</text></svg>`;
                              }}
                            />
                              <div className="flex flex-col text-left">
                                <div className="font-medium">{currency.code}</div>
                                <div className="text-xs text-gray-500">{currency.name}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                                    <button 
                    onClick={handleSearch}
                    disabled={isLoading}
                    className="relative overflow-hidden group w-full bg-[#1B1464] hover:bg-[#252170] text-white text-xl mt-10 py-5 px-5 rounded-xl font-medium flex items-center justify-center transition duration-200" 
                  >
                    <span className="relative z-10 flex items-center">
                      {isLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Searching...
                        </>
                      ) : (
                        <>
                          <Search size={22} className="mr-3" />
                          Find Deals Now
                        </>
                      )}
                    </span>

                    {/* shimmer overlay */}
                    <span className="absolute inset-0 before:content-[''] before:absolute before:top-0 before:left-[-75%] before:h-full before:w-[200%] before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent before:rotate-12 before:opacity-0 group-hover:before:opacity-100 group-hover:before:animate-shimmer" />
                  </button>
                  
                  <div className="mt-8 text-sm text-center text-gray-800">
                    Compare rates from worldwide providers instantly
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Side - Hero Content */}
            <div className="hidden">w-full max-w-xl text-white z-10 mx-auto lg:mx-0 lg:ml-8 text-center lg:text-left">
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6">Need to send money overseas?</h1>
      <p className="text-lg md:text-xl mb-6 md:mb-8">Find the best rates and lowest fees for international money transfers. Save up to 90% compared to banks.</p>
      {/* Stats section - make it responsive */}
      <div className="flex flex-wrap justify-center lg:justify-start items-center text-white/90">
        <div className="border-r border-white/20 pr-4 mr-4 mb-4 lg:mb-0">
          <div className="font-bold text-2xl">5+</div>
          <div className="text-sm">Transfer providers</div>
        </div>
        <div className="border-r border-white/20 pr-4 mr-4 mb-4 lg:mb-0">
          <div className="font-bold text-2xl">160+</div>
          <div className="text-sm">Countries supported</div>
        </div>
        <div className="mb-4 lg:mb-0">
          <div className="font-bold text-2xl">$0</div>
          <div className="text-sm">Sign-up fee</div>
        </div>
      </div>
    </div>
  </div>
</div>
      ) : (
        // Results Page
        <div className="flex flex-col min-h-screen">
          {/* Header */}
          <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <img src="/mmtlogo.png" alt="mymoneytransfers Logo" className="h-10 cursor-pointer hover:opacity-80 transition"  onClick={handleBackToHome}/>
              <div className="hidden md:flex space-x-6">
                <button className="text-gray-600 hover:text-gray-900 font-medium">Features</button>
                <button className="text-gray-600 hover:text-gray-900 font-medium">Providers</button>
                <button className="text-gray-600 hover:text-gray-900 font-medium">Resources</button>
              </div>
              <div className="flex space-x-4">
                <button className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium">Log in</button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700">Sign up</button>
              </div>
            </div>
          </header>
          
          {/* Results Section */}
          <div className="container mx-auto flex-1 px-4 py-8">
            <div className="mb-6">
              <button 
                onClick={handleBackToHome}
                className="text-blue-600 hover:underline flex items-center"
              >
                ← Back to search
              </button>
            </div>
            
            <div className="mb-8 bg-blue-50 p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-bold mb-4 text-gray-800">Your Results</h2>
              <div className="flex flex-col md:flex-row md:items-center">
                <div className="mb-4 md:mb-0 md:mr-8">
                  <div className="text-sm text-gray-500 mb-1">You send</div>
                  <div className="flex items-center">
                    <CurrencyFlag currency={fromCurrency} />
                    <span className="ml-2 text-2xl font-bold">
                      {currenciesList.find(c => c.code === fromCurrency)?.symbol}{formatAmount(amount)} {fromCurrency}
                    </span>
                  </div>
                </div>
                <div className="mb-4 md:mb-0 md:mx-8">
                  <div className="text-sm text-gray-500 mb-1">They receive</div>
                  <div className="flex items-center">
                    <CurrencyFlag currency={toCurrency} />
                    <span className="ml-2 text-2xl font-bold">
                      {providerResults.length > 0 
                        ? `${currenciesList.find(c => c.code === toCurrency)?.symbol}${formatAmount(providerResults[0].amountReceived)} ${toCurrency}`
                        : `~ ${currenciesList.find(c => c.code === toCurrency)?.symbol}${formatAmount(amount * exchangeRates[fromCurrency][toCurrency])} ${toCurrency}`
                      }
                    </span>
                  </div>
                </div>
                <div className="ml-auto">
                  <button 
                    onClick={handleBackToHome}
                    className="px-4 py-2 bg-white border border-blue-500 text-blue-600 rounded-md hover:bg-blue-50"
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
            
            {/* Sorting options */}
            <div className="mb-6">
              <div className="flex items-center overflow-x-auto bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <span className="font-medium text-gray-600 mr-6 whitespace-nowrap">Sort by:</span>
                <button 
                  className={`flex items-center whitespace-nowrap mr-6 ${sortBy === 'rate' ? 'text-blue-600 font-bold' : 'text-gray-600'}`}
                  onClick={() => { setSortBy('rate'); toggleSortDirection(); }}
                >
                  Exchange Rate
                  {sortBy === 'rate' && (
                    <ArrowUpDown size={16} className="ml-1" />
                  )}
                </button>
                <button 
                  className={`flex items-center whitespace-nowrap ${sortBy === 'rating' ? 'text-blue-600 font-bold' : 'text-gray-600'}`}
                  onClick={() => { setSortBy('rating'); toggleSortDirection(); }}
                >
                  User Rating
                  {sortBy === 'rating' && (
                    <ArrowUpDown size={16} className="ml-1" />
                  )}
                </button>
              </div>
            </div>
            
            {/* Best Deal Banner */}
            {providerResults.length > 0 && (
              <div className="mb-4 bg-green-50 border-l-4 border-green-500 p-4 rounded-md">
                <div className="flex items-center">
                  <div className="font-bold text-green-800">Best deal: {providerResults[0].name}</div>
                  <div className="ml-auto font-bold text-green-800">{currenciesList.find(c => c.code === toCurrency)?.symbol}{formatAmount(providerResults[0].amountReceived)}</div>
                </div>
              </div>
            )}
            
            {/* Results list */}
            <div className="space-y-6">
              {providerResults.map((provider, index) => (
                <div 
                  key={provider.id} 
                  className={`border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow ${index === 0 ? 'border-green-300 bg-green-50' : 'border-gray-200'}`}
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Provider info */}
                    <div className="p-6 flex flex-col items-center justify-center md:w-1/4 bg-white">
                      <div className="text-4xl mb-2">{provider.logo}</div>
                      <div className="font-bold text-lg text-center">{provider.name}</div>
                      <div className="text-sm text-yellow-500 mt-1">
                        {'★'.repeat(Math.floor(provider.rating))}
                        {provider.rating % 1 >= 0.5 ? '½' : ''}
                        {'☆'.repeat(5 - Math.ceil(provider.rating))}
                        <span className="text-gray-600 ml-1">({provider.rating})</span>
                      </div>
                    </div>
                    
                    {/* Exchange details */}
                    <div className="p-6 border-t md:border-t-0 md:border-l border-gray-200 md:w-2/4">
                      <div className="flex flex-col md:flex-row justify-between mb-4">
                        <div className="mb-2 md:mb-0">
                          <div className="text-sm text-gray-500">You Send</div>
                          <div className="font-bold">{currenciesList.find(c => c.code === fromCurrency)?.symbol}{formatAmount(amount)} {fromCurrency}</div>
                        </div>
                        <div className="mb-2 md:mb-0 md:text-center">
                          <div className="text-sm text-gray-500">Exchange Rate</div>
                          <div className="font-bold">1 {fromCurrency} = {provider.rate.toFixed(4)} {toCurrency}</div>
                        </div>
                        <div className="md:text-right">
                          <div className="text-sm text-gray-500">They Receive</div>
                          <div className="font-bold">{currenciesList.find(c => c.code === toCurrency)?.symbol}{formatAmount(provider.amountReceived)} {toCurrency}</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="bg-gray-50 p-3 rounded">
                          <span className="text-gray-500">Fee:</span> {currenciesList.find(c => c.code === fromCurrency)?.symbol}{provider.transferFee.toFixed(2)}
                        </div>
                        <div className="bg-gray-50 p-3 rounded">
                          <span className="text-gray-500">Rate Margin:</span> {(provider.exchangeRateMargin * 100).toFixed(2)}%
                        </div>
                        <div className="bg-gray-50 p-3 rounded">
                          <span className="text-gray-500">Delivery:</span> {provider.transferTime}
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <div className="text-sm text-gray-600 font-medium">Features:</div>
                        <div className="flex flex-wrap mt-1">
                          {provider.features.map((feature, idx) => (
                            <span key={idx} className="text-xs bg-blue-100 text-blue-800 rounded-full px-2 py-1 mr-2 mb-2">{feature}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    {/* CTA */}
                    <div className="p-6 border-t md:border-t-0 md:border-l border-gray-200 flex flex-col items-center justify-center md:w-1/4 bg-white">
                      <div className="mb-2 font-bold text-center text-2xl">
                        {currenciesList.find(c => c.code === toCurrency)?.symbol}{formatAmount(provider.amountReceived)}
                      </div>
                      <div className="text-xs mb-4 text-center text-gray-500">
                        Total fees: {currenciesList.find(c => c.code === fromCurrency)?.symbol}{formatAmount(provider.totalFees)}
                      </div>
                      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md flex items-center justify-center">
                        Get Deal
                        <ExternalLink size={16} className="ml-1" />
                      </button>
                      <div className="mt-3 text-xs text-blue-600 text-center hover:underline cursor-pointer">
                        See full details
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Footer */}
          <footer className="bg-gray-800 text-white py-8 mt-12">
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row justify-between">
                <div className="mb-6 md:mb-0">
                  <h3 className="text-lg font-bold mb-2">MoneyCompare</h3>
                  <p className="text-gray-400 max-w-xs">Find the best rates for international money transfers.</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                  <div>
                    <h4 className="font-bold mb-3 text-gray-300">Company</h4>
                    <ul className="space-y-2 text-gray-400">
                      <li><a href="#" className="hover:text-white">About</a></li>
                      <li><a href="#" className="hover:text-white">Careers</a></li>
                      <li><a href="#" className="hover:text-white">Press</a></li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold mb-3 text-gray-300">Resources</h4>
                    <ul className="space-y-2 text-gray-400">
                      <li><a href="#" className="hover:text-white">Blog</a></li>
                      <li><a href="#" className="hover:text-white">Guides</a></li>
                      <li><a href="#" className="hover:text-white">FAQ</a></li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold mb-3 text-gray-300">Legal</h4>
                    <ul className="space-y-2 text-gray-400">
                      <li><a href="#" className="hover:text-white">Privacy</a></li>
                      <li><a href="#" className="hover:text-white">Terms</a></li>
                      <li><a href="#" className="hover:text-white">Cookies</a></li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-700 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
                <p className="text-gray-400">© {new Date().getFullYear()} MoneyCompare. All rights reserved.</p>
                <div className="flex space-x-4 mt-4 md:mt-0">
                  <a href="#" className="text-gray-400 hover:text-white">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      )}
    </div>
  );
};

export default ModernMoneyCompare;