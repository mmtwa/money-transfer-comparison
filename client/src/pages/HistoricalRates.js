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
 * Historical Rates page component
 */
const HistoricalRates = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [currentExchangeRate, setCurrentExchangeRate] = useState(null);
  const [activeRange, setActiveRange] = useState('1month');
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  
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
  };
  
  // Fetch data on initial load and when currency changes
  useEffect(() => {
    if (formState.fromCurrency && formState.toCurrency) {
      fetchCurrentRate(formState.fromCurrency, formState.toCurrency);
      fetchHistoricalRates();
    }
  }, [formState.fromCurrency, formState.toCurrency, formState.group]);

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900 py-10 pt-[1px]">
      {/* Hero Section */}
      <section className="py-16 md:py-20 border-b border-gray-100 bg-gradient-to-b from-indigo-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center text-indigo-900">Historical Exchange Rates</h1>
            <p className="text-lg text-gray-600 text-center">
              Track currency exchange rate trends over time to make informed decisions
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Currency Converter Box */}
            <div className="bg-white rounded-xl p-6 mb-8 shadow-md border border-gray-100">
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
                <div className="hidden md:flex items-center justify-center pb-5">
                  <div className="bg-indigo-100 p-2 rounded-full cursor-pointer hover:bg-indigo-200 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="1" y1="9" x2="23" y2="9"></line>
                      <polyline points="19 5 23 9 19 13"></polyline>
                      <polyline points="5 19 1 15 5 11"></polyline>
                      <line x1="23" y1="15" x2="1" y2="15"></line>
                    </svg>
                  </div>
                </div>
                
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
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="flex flex-col items-center justify-center">
                    <div className="flex items-center mb-2">
                      <CurrencyFlag currency={formState.fromCurrency} size="md" />
                      <span className="mx-2 text-lg font-medium">1 {formState.fromCurrency} = </span>
                      <span className="text-2xl font-bold text-indigo-600">
                        {formatExchangeRate(currentExchangeRate)}
                      </span>
                      <span className="ml-2 text-lg font-medium">{formState.toCurrency}</span>
                      <CurrencyFlag currency={formState.toCurrency} size="md" className="ml-2" />
                    </div>
                    <p className="text-sm text-gray-500">
                      Real-time mid-market exchange rate
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Historical Chart */}
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 mb-8">
              <div className="flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-800">
                    {formState.fromCurrency}/{formState.toCurrency} Exchange Rate Trend
                  </h2>
                  
                  {/* Time Period Buttons */}
                  <div className="flex flex-wrap gap-2">
                    <button 
                      onClick={() => handleRangeChange('48hours')}
                      className={`px-3 py-1 text-sm rounded-full ${activeRange === '48hours' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                      48h
                    </button>
                    <button 
                      onClick={() => handleRangeChange('1week')}
                      className={`px-3 py-1 text-sm rounded-full ${activeRange === '1week' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                      1w
                    </button>
                    <button 
                      onClick={() => handleRangeChange('1month')}
                      className={`px-3 py-1 text-sm rounded-full ${activeRange === '1month' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                      1m
                    </button>
                    <button 
                      onClick={() => handleRangeChange('6months')}
                      className={`px-3 py-1 text-sm rounded-full ${activeRange === '6months' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                      6m
                    </button>
                    <button 
                      onClick={() => handleRangeChange('12months')}
                      className={`px-3 py-1 text-sm rounded-full ${activeRange === '12months' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                      1y
                    </button>
                    <button 
                      onClick={() => handleRangeChange('5years')}
                      className={`px-3 py-1 text-sm rounded-full ${activeRange === '5years' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                      5y
                    </button>
                  </div>
                </div>
                
                {/* Chart Container */}
                {isLoading ? (
                  <div className="h-80 flex items-center justify-center">
                    <div className="flex flex-col items-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                      <p className="mt-4 text-gray-600">Loading historical data...</p>
                    </div>
                  </div>
                ) : error ? (
                  <div className="h-80 flex items-center justify-center">
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 w-full">
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
                  <div className="h-80">
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
                            }
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
                        }
                      }}
                    />
                  </div>
                ) : (
                  <div className="h-80 flex items-center justify-center">
                    <p className="text-gray-500">Select currencies and date range to view historical rates</p>
                  </div>
                )}
                
                <div className="mt-4 text-sm text-gray-500">
                  <p>Data provided by Wise's historical exchange rates API</p>
                  <p className="mt-1">Note: Maximum 30 days of detailed data is available</p>
                </div>
              </div>
            </div>
            
            {/* Info Boxes */}
            <div className="grid md:grid-cols-2 gap-6 mt-8">
              <div className="bg-gradient-to-br from-indigo-50 to-white rounded-xl p-6 shadow-sm border border-indigo-100">
                <h3 className="text-xl font-bold text-indigo-700 mb-3">Understanding Exchange Rate Trends</h3>
                <p className="text-gray-700">
                  Historical exchange rate data helps you understand currency movements over time. Look for patterns like volatility or stability to make better timing decisions for your transfers.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-indigo-50 to-white rounded-xl p-6 shadow-sm border border-indigo-100">
                <h3 className="text-xl font-bold text-indigo-700 mb-3">When To Make Your Transfer</h3>
                <p className="text-gray-700">
                  By monitoring historical rates, you can identify favorable times to make currency exchanges. Even small rate improvements can lead to significant savings on larger transfers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HistoricalRates; 