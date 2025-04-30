import React, { useState, useEffect } from 'react';
// Import Chart.js components directly using the dist files
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line } from 'react-chartjs-2';
import apiService from '../services/apiService';
import { currenciesList } from '../utils/currency';
import CurrencySelector from '../components/ui/CurrencySelector';
import CurrencyFlag from '../components/ui/CurrencyFlag';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

// Register Chart.js components manually
Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

/**
 * Live & Historical Rates page component
 */
const LiveHistoricalRates = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [currentExchangeRate, setCurrentExchangeRate] = useState(null);
  const [activeRange, setActiveRange] = useState('1month');
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // Form state
  const [formState, setFormState] = useState({
    fromCurrency: 'GBP',
    toCurrency: 'USD',
    fromDate: getDefaultFromDate('1month'),
    toDate: getDefaultToDate(),
    group: 'day'
  });

  // Default dates based on range
  function getDefaultFromDate(range = '1month') {
    const date = new Date();
    // Make a clean copy to avoid modifying the original date
    const fromDate = new Date(date);
    
    switch(range) {
      case '48hours':
        fromDate.setHours(fromDate.getHours() - 48);
        break;
      case '1week':
        fromDate.setDate(fromDate.getDate() - 7);
        break;
      case '1month':
        fromDate.setMonth(fromDate.getMonth() - 1);
        break;
      case '6months':
        fromDate.setMonth(fromDate.getMonth() - 6);
        break;
      case '12months':
        fromDate.setFullYear(fromDate.getFullYear() - 1);
        break;
      case '5years':
        fromDate.setFullYear(fromDate.getFullYear() - 5);
        break;
      default:
        fromDate.setMonth(fromDate.getMonth() - 1);
    }
    
    // Ensure the date is not in the future
    const now = new Date();
    if (fromDate > now) {
      console.warn("Calculated fromDate is in the future - using 30 days ago instead");
      const thirtyDaysAgo = new Date(now);
      thirtyDaysAgo.setDate(now.getDate() - 30);
      return thirtyDaysAgo.toISOString().split('T')[0];
    }
    
    return fromDate.toISOString().split('T')[0];
  }

  function getDefaultToDate() {
    const date = new Date();
    return date.toISOString().split('T')[0];
  }

  // Update date range based on selected range
  const handleRangeChange = (range) => {
    setActiveRange(range);
    
    // Set appropriate group (hour for short periods, day for longer)
    const group = ['48hours', '1week'].includes(range) ? 'hour' : 'day';
    
    // Calculate the new from date based on range
    const newFromDate = getDefaultFromDate(range);
    const newToDate = getDefaultToDate();
    
    const updatedFormState = {
      ...formState,
      fromDate: newFromDate,
      toDate: newToDate,
      group
    };
    
    setFormState(updatedFormState);
    
    // Trigger data fetch with new range
    fetchHistoricalRates(updatedFormState);
  };

  // Format date for API request
  const formatDateForApi = (dateString) => {
    return `${dateString}T${dateString === formState.toDate ? '23:59:59' : '00:00:00'}`;
  };

  // Format exchange rate with 5 decimal places
  const formatExchangeRate = (rate) => {
    return rate ? rate.toFixed(5) : '-';
  };
  
  // Format date for display
  const formatDateForDisplay = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Handle currency change
  const handleCurrencyChange = (type, currency) => {
    setFormState({
      ...formState,
      [type]: currency
    });
  };
  
  // Toggle dropdown
  const handleDropdownToggle = (dropdownId) => {
    setActiveDropdown(prev => prev === dropdownId ? null : dropdownId);
  };

  // Fetch historical rates data
  const fetchHistoricalRates = async (params = formState) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { fromCurrency, toCurrency, fromDate, toDate, group } = params;
      
      // Validate dates to ensure we're not requesting future data
      const now = new Date();
      const today = now.toISOString().split('T')[0];
      
      // If toDate is in the future, use today instead
      const validToDate = new Date(toDate) > now ? today : toDate;
      
      // Ensure fromDate is not in the future and not after toDate
      let validFromDate = fromDate;
      if (new Date(fromDate) > now) {
        // If fromDate is in the future, set it to 30 days before today
        const thirtyDaysAgo = new Date(now);
        thirtyDaysAgo.setDate(now.getDate() - 30);
        validFromDate = thirtyDaysAgo.toISOString().split('T')[0];
      }
      
      // Format dates for API
      const formattedFromDate = formatDateForApi(validFromDate);
      const formattedToDate = formatDateForApi(validToDate);
      
      console.log(`Requesting historical rates from ${formattedFromDate} to ${formattedToDate}`);
      
      const response = await apiService.getHistoricalRates(
        fromCurrency,
        toCurrency,
        formattedFromDate,
        formattedToDate,
        group
      );
      
      if (response.data && response.data.success) {
        processChartData(response.data.data);
        
        // Fetch current live rate separately
        fetchCurrentRate(fromCurrency, toCurrency);
      } else {
        setError('Failed to fetch historical rate data');
      }
    } catch (err) {
      console.error('Error fetching historical rates:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch historical rate data');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch current exchange rate
  const fetchCurrentRate = async (fromCurrency, toCurrency) => {
    try {
      // Use the Wise comparison API to get current rates
      const response = await apiService.getWiseComparison(fromCurrency, toCurrency, 1000);
      
      if (response.data && response.data.success && response.data.data && response.data.data.providers) {
        const providers = response.data.data.providers;
        
        // Find the Wise provider
        const wiseProvider = providers.find(p => 
          p.alias?.toLowerCase() === 'wise' || 
          p.name?.toLowerCase()?.includes('wise')
        );
        
        if (wiseProvider && wiseProvider.quotes && wiseProvider.quotes.length > 0) {
          // Get the rate from the Wise provider
          setCurrentExchangeRate(wiseProvider.quotes[0].rate);
        } else if (providers.length > 0 && providers[0].quotes && providers[0].quotes.length > 0) {
          // If no Wise provider found, use the first provider in the list
          setCurrentExchangeRate(providers[0].quotes[0].rate);
        }
      }
    } catch (err) {
      console.error('Error fetching current rate:', err);
      // Try direct API as fallback
      try {
        const directResponse = await apiService.getWiseV3Comparison(fromCurrency, toCurrency, 1000);
        
        if (directResponse.data && directResponse.data.providers) {
          const providers = directResponse.data.providers;
          
          // Find the Wise provider
          const wiseProvider = providers.find(p => 
            p.alias?.toLowerCase() === 'wise' || 
            p.name?.toLowerCase()?.includes('wise')
          );
          
          if (wiseProvider && wiseProvider.quotes && wiseProvider.quotes.length > 0) {
            // Get the rate from the Wise provider
            setCurrentExchangeRate(wiseProvider.quotes[0].rate);
          } else if (providers.length > 0 && providers[0].quotes && providers[0].quotes.length > 0) {
            // If no Wise provider found, use the first provider in the list
            setCurrentExchangeRate(providers[0].quotes[0].rate);
          }
        }
      } catch (directErr) {
        console.error('Error fetching current rate from direct API:', directErr);
        // Don't show error for this - we'll still have historical data
      }
    }
  };

  // Process data for chart
  const processChartData = (apiData) => {
    if (!apiData || !apiData.length) {
      setError('No historical rate data available for the selected period');
      return;
    }

    // Sort data by date
    const sortedData = [...apiData].sort((a, b) => new Date(a.time) - new Date(b.time));

    // Extract dates and rates
    const labels = sortedData.map(item => {
      const date = new Date(item.time);
      return activeRange === '48hours' ? 
        date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 
        date.toLocaleDateString();
    });

    const rates = sortedData.map(item => item.rate);

    const chartData = {
      labels,
      datasets: [
        {
          label: `${formState.fromCurrency}/${formState.toCurrency} Exchange Rate`,
          data: rates,
          borderColor: '#4F46E5',
          backgroundColor: 'rgba(79, 70, 229, 0.1)',
          borderWidth: 2,
          tension: 0.3,
          fill: true,
          pointRadius: 2,
          pointHoverRadius: 5
        }
      ]
    };

    setChartData(chartData);
    setHistoricalData(sortedData);
  };
  
  // Fetch data on initial load and when currency changes
  useEffect(() => {
    if (formState.fromCurrency && formState.toCurrency) {
      fetchCurrentRate(formState.fromCurrency, formState.toCurrency);
      fetchHistoricalRates();
    }
  }, [formState.fromCurrency, formState.toCurrency, formState.group]);

  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-indigo-50/30 to-white text-gray-900 py-10 pt-[1px]">
      {/* Hero Section */}
      <section className="py-16 md:py-20 border-b border-gray-100 bg-gradient-to-b from-indigo-900 to-indigo-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            {/* Animated background grid */}
            <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/80 to-purple-900/60"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1 
              className="text-4xl md:text-6xl font-bold mb-4 text-center text-white leading-tight tracking-tight"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <span className="relative inline-block">
                Live
                <span className="absolute -bottom-1 left-0 w-full h-1 bg-indigo-400"></span>
              </span>{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300">
                & Historical Exchange Rates
              </span>
            </motion.h1>
            <motion.p 
              className="text-lg md:text-xl text-indigo-100 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Track currency trends over time for smarter international transfers
            </motion.p>
          </motion.div>
        </div>
        
        {/* Animated scroll indicator */}
        <motion.div 
          className="absolute bottom-6 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </section>

      {/* Main Content */}
      <section className="py-10 md:py-16">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-4xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Currency Converter Box */}
            <motion.div 
              className="bg-white rounded-2xl p-6 mb-8 shadow-lg border border-indigo-50 relative overflow-hidden"
              variants={itemVariants}
            >
              <div className="absolute -right-10 -top-10 w-48 h-48 bg-indigo-500/5 rounded-full"></div>
              <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-purple-500/5 rounded-full"></div>
              
              <div className="relative">
                <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-8">
                  {/* From Currency */}
                  <div className="flex-1">
                    <CurrencySelector
                      label="Amount"
                      selectedCurrency={formState.fromCurrency}
                      onCurrencyChange={(currency) => handleCurrencyChange('fromCurrency', currency)}
                      isOpen={activeDropdown === 'fromCurrency'}
                      onToggle={handleDropdownToggle}
                      id="fromCurrency"
                    />
                  </div>
                  
                  {/* Swap Icon */}
                  <motion.div 
                    className="hidden md:flex items-center justify-center pb-5"
                    whileHover={{ rotateY: 180 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => {
                      // Swap the currencies
                      const newFormState = {
                        ...formState,
                        fromCurrency: formState.toCurrency,
                        toCurrency: formState.fromCurrency
                      };
                      setFormState(newFormState);
                    }}
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    <div className="bg-indigo-100 p-2 rounded-full cursor-pointer hover:bg-indigo-200 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="1" y1="9" x2="23" y2="9"></line>
                        <polyline points="19 5 23 9 19 13"></polyline>
                        <polyline points="5 19 1 15 5 11"></polyline>
                        <line x1="23" y1="15" x2="1" y2="15"></line>
                      </svg>
                    </div>
                  </motion.div>
                  
                  {/* To Currency */}
                  <div className="flex-1">
                    <CurrencySelector
                      label="Conversion to"
                      selectedCurrency={formState.toCurrency}
                      onCurrencyChange={(currency) => handleCurrencyChange('toCurrency', currency)}
                      isOpen={activeDropdown === 'toCurrency'}
                      onToggle={handleDropdownToggle}
                      id="toCurrency"
                    />
                  </div>
                </div>
                
                {/* Current Exchange Rate Display */}
                {currentExchangeRate && (
                  <motion.div 
                    className="mt-6 pt-6 border-t border-gray-100"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                  >
                    <div className="flex flex-col items-center justify-center">
                      <div className="flex items-center mb-2">
                        <CurrencyFlag currency={formState.fromCurrency} size="md" />
                        <span className="mx-2 text-lg font-medium">1 {formState.fromCurrency} = </span>
                        <motion.span 
                          className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600"
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
                        >
                          {formatExchangeRate(currentExchangeRate)}
                        </motion.span>
                        <span className="mx-2 text-lg font-medium">{formState.toCurrency}</span>
                        <CurrencyFlag currency={formState.toCurrency} size="md" />
                      </div>
                      <p className="text-sm text-gray-500">
                        Real-time mid-market exchange rate
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Historical Chart */}
            <motion.div 
              className="bg-white rounded-2xl p-6 shadow-lg border border-indigo-50 mb-8 relative overflow-hidden"
              variants={itemVariants}
            >
              <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-indigo-500/5 rounded-full"></div>
              <div className="absolute right-10 top-10 w-32 h-32 bg-purple-500/5 rounded-full"></div>
              
              <div className="relative z-10">
                <div className="flex flex-col">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center">
                      <span className="mr-2 text-indigo-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                        </svg>
                      </span>
                      <span>
                        {formState.fromCurrency}/{formState.toCurrency} Exchange Rate Trend
                      </span>
                    </h2>
                    
                    {/* Time Period Buttons */}
                    <div className="flex flex-wrap gap-2">
                      {[
                        { id: '48hours', label: '48h' },
                        { id: '1week', label: '1w' },
                        { id: '1month', label: '1m' },
                        { id: '6months', label: '6m' },
                        { id: '12months', label: '1y' },
                        { id: '5years', label: '5y' }
                      ].map((range) => (
                        <motion.button 
                          key={range.id}
                          onClick={() => handleRangeChange(range.id)}
                          className={`px-3 py-1 text-sm rounded-full transition-all duration-300 border ${activeRange === range.id ? 
                            'bg-indigo-600 text-white border-indigo-600' : 
                            'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}
                          whileHover={{ y: -2 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {range.label}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Chart Container */}
                  <div className={`rounded-xl overflow-hidden ${isLoading || error ? 'bg-gray-50' : 'bg-white'} transition-all duration-500 ease-in-out`}>
                    {isLoading ? (
                      <div className="h-80 flex items-center justify-center">
                        <div className="flex flex-col items-center">
                          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                          <p className="mt-4 text-gray-600">Loading historical data...</p>
                        </div>
                      </div>
                    ) : error ? (
                      <div className="h-80 flex items-center justify-center">
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 w-full max-w-lg">
                          <div className="flex">
                            <div className="flex-shrink-0">
                              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <div className="ml-3">
                              <p className="text-sm text-red-700">{error}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : chartData ? (
                      <motion.div 
                        className="h-80"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Line
                          data={chartData}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                              y: {
                                beginAtZero: false,
                                title: {
                                  display: true,
                                  text: `${formState.toCurrency} per 1 ${formState.fromCurrency}`
                                },
                                ticks: {
                                  callback: function(value) {
                                    return value.toFixed(4);
                                  }
                                }
                              },
                              x: {
                                grid: {
                                  display: false
                                }
                              }
                            },
                            plugins: {
                              legend: {
                                display: false
                              },
                              tooltip: {
                                callbacks: {
                                  label: function(context) {
                                    return `Rate: ${context.parsed.y.toFixed(5)}`;
                                  }
                                },
                                backgroundColor: 'rgba(79, 70, 229, 0.8)',
                                titleColor: 'white',
                                bodyColor: 'white',
                                borderColor: 'rgba(79, 70, 229, 0.2)',
                                borderWidth: 1,
                                titleFont: {
                                  weight: 'bold'
                                },
                                padding: 10,
                                bodyFont: {
                                  size: 14
                                },
                                displayColors: false,
                                caretSize: 6,
                              }
                            },
                            interaction: {
                              mode: 'index',
                              intersect: false,
                            },
                            elements: {
                              point: {
                                radius: activeRange === '48hours' || activeRange === '1week' ? 1 : 0,
                                hoverRadius: 5
                              }
                            },
                            animation: {
                              duration: 1500,
                              easing: 'easeOutQuart'
                            }
                          }}
                        />
                      </motion.div>
                    ) : (
                      <div className="h-80 flex items-center justify-center">
                        <p className="text-gray-500">Select currencies and date range to view historical rates</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-4 text-sm text-gray-500 flex items-center justify-center">
                    <span className="inline-flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Data provided by Wise's historical exchange rates API
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Historical Data Stats */}
            {historicalData.length > 0 && (
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {/* Min Rate Card */}
                <motion.div
                  className="bg-white rounded-2xl p-6 shadow-md border border-indigo-50 overflow-hidden relative"
                  variants={itemVariants}
                  whileHover={{ y: -4, boxShadow: "0 12px 24px -8px rgba(79, 70, 229, 0.15)" }}
                >
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-green-100 rounded-full opacity-20"></div>
                  <div className="relative">
                    <h3 className="text-sm uppercase tracking-wider text-gray-500 font-medium mb-2">Lowest Rate</h3>
                    <p className="text-2xl font-bold text-green-600">
                      {formatExchangeRate(Math.min(...historicalData.map(item => item.rate)))}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">During selected period</p>
                  </div>
                </motion.div>
              
                {/* Max Rate Card */}
                <motion.div 
                  className="bg-white rounded-2xl p-6 shadow-md border border-indigo-50 overflow-hidden relative"
                  variants={itemVariants}
                  whileHover={{ y: -4, boxShadow: "0 12px 24px -8px rgba(79, 70, 229, 0.15)" }}
                >
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-red-100 rounded-full opacity-20"></div>
                  <div className="relative">
                    <h3 className="text-sm uppercase tracking-wider text-gray-500 font-medium mb-2">Highest Rate</h3>
                    <p className="text-2xl font-bold text-red-600">
                      {formatExchangeRate(Math.max(...historicalData.map(item => item.rate)))}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">During selected period</p>
                  </div>
                </motion.div>
              
                {/* Average Rate Card */}
                <motion.div 
                  className="bg-white rounded-2xl p-6 shadow-md border border-indigo-50 overflow-hidden relative"
                  variants={itemVariants}
                  whileHover={{ y: -4, boxShadow: "0 12px 24px -8px rgba(79, 70, 229, 0.15)" }}
                >
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-100 rounded-full opacity-20"></div>
                  <div className="relative">
                    <h3 className="text-sm uppercase tracking-wider text-gray-500 font-medium mb-2">Average Rate</h3>
                    <p className="text-2xl font-bold text-indigo-600">
                      {formatExchangeRate(historicalData.reduce((sum, item) => sum + item.rate, 0) / historicalData.length)}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">During selected period</p>
                  </div>
                </motion.div>
              </motion.div>
            )}
            
            {/* Info Boxes */}
            <motion.div 
              className="grid md:grid-cols-2 gap-6 mt-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.div 
                className="bg-gradient-to-br from-indigo-50 to-white rounded-2xl p-8 shadow-md border border-indigo-100 relative overflow-hidden"
                variants={itemVariants}
                whileHover={{ y: -4, boxShadow: "0 15px 30px -10px rgba(79, 70, 229, 0.15)" }}
              >
                <div className="absolute -right-10 -bottom-20 w-40 h-40 bg-indigo-200 rounded-full opacity-20 blur-xl"></div>
                <div className="absolute left-4 top-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-400 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div className="relative">
                  <h3 className="text-xl font-bold text-indigo-700 mb-3 mt-8">Understanding Exchange Rate Trends</h3>
                  <p className="text-gray-700">
                    Historical exchange rate data helps you understand currency movements over time. Look for patterns like volatility or stability to make better timing decisions for your transfers.
                  </p>
                </div>
              </motion.div>
              
              <motion.div 
                className="bg-gradient-to-br from-purple-50 to-white rounded-2xl p-8 shadow-md border border-purple-100 relative overflow-hidden"
                variants={itemVariants}
                whileHover={{ y: -4, boxShadow: "0 15px 30px -10px rgba(124, 58, 237, 0.15)" }}
              >
                <div className="absolute -left-10 -bottom-20 w-40 h-40 bg-purple-200 rounded-full opacity-20 blur-xl"></div>
                <div className="absolute left-4 top-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-400 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="relative">
                  <h3 className="text-xl font-bold text-purple-700 mb-3 mt-8">When To Make Your Transfer</h3>
                  <p className="text-gray-700">
                    By monitoring historical rates, you can identify favorable times to make currency exchanges. Even small rate improvements can lead to significant savings on larger transfers.
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LiveHistoricalRates; 