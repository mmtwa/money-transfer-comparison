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
  const [rateTimestamp, setRateTimestamp] = useState(null);
  const [activeRange, setActiveRange] = useState('1month');
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  
  // Add state for the second currency pair
  const [showSecondPair, setShowSecondPair] = useState(false);
  const [secondPairData, setSecondPairData] = useState([]);
  const [secondPairCurrentRate, setSecondPairCurrentRate] = useState(null);
  const [secondPairRateTimestamp, setSecondPairRateTimestamp] = useState(null);
  const [secondPairLoading, setSecondPairLoading] = useState(false);
  
  // Multi-currency ecommerce pricing tool state
  const [productPrice, setProductPrice] = useState(100);
  const [baseCurrency, setBaseCurrency] = useState('USD');
  const [targetCurrencies, setTargetCurrencies] = useState(['EUR', 'GBP', 'JPY', 'CAD', 'AUD']);
  const [convertedPrices, setConvertedPrices] = useState({});
  const [isCalculating, setIsCalculating] = useState(false);
  const [priceToolError, setPriceToolError] = useState(null);
  
  // Add state for volatility heat map
  const [volatilityData, setVolatilityData] = useState({});
  const [isLoadingHeatMap, setIsLoadingHeatMap] = useState(false);
  const [volatilityError, setVolatilityError] = useState(null);
  const [lastHeatMapUpdate, setLastHeatMapUpdate] = useState(null);
  const [selectedVolatilityPeriod, setSelectedVolatilityPeriod] = useState('1day');
  
  // Popular currency pairs for heat map
  const [baseCurrencies, setBaseCurrencies] = useState(['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD']);
  const [quoteCurrencies, setQuoteCurrencies] = useState(['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD']);
  
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

  // Second pair form state
  const [secondPairFormState, setSecondPairFormState] = useState({
    fromCurrency: 'USD',
    toCurrency: 'EUR',
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
    
    const updatedSecondPairFormState = {
      ...secondPairFormState,
      fromDate: newFromDate,
      toDate: newToDate,
      group
    };
    
    setFormState(updatedFormState);
    setSecondPairFormState(updatedSecondPairFormState);
    
    // Trigger data fetch with new range
    fetchHistoricalRates(updatedFormState);
    
    // If showing second pair, fetch its data too
    if (showSecondPair) {
      fetchSecondPairHistoricalRates(updatedSecondPairFormState);
    }
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

  // Format timestamp for display
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });
  };

  // Handle currency change
  const handleCurrencyChange = (type, currency) => {
    setFormState({
      ...formState,
      [type]: currency
    });
  };
  
  // Handle second pair currency change
  const handleSecondPairCurrencyChange = (type, currency) => {
    setSecondPairFormState({
      ...secondPairFormState,
      [type]: currency
    });
  };
  
  // Toggle dropdown
  const handleDropdownToggle = (dropdownId) => {
    setActiveDropdown(prev => prev === dropdownId ? null : dropdownId);
  };

  // Toggle second currency pair
  const toggleSecondPair = () => {
    const newShowSecondPair = !showSecondPair;
    setShowSecondPair(newShowSecondPair);
    
    if (newShowSecondPair && secondPairData.length === 0) {
      // If turning on and no data exists, trigger fetch
      fetchSecondPairHistoricalRates();
    } 
    // No need to explicitly call chart update here, the useEffect watching showSecondPair will handle it.
  };

  // Fetch historical rates data
  const fetchHistoricalRates = async (params = formState) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { fromCurrency, toCurrency, fromDate, toDate, group } = params;
      
      // Validate dates
      const now = new Date();
      const today = now.toISOString().split('T')[0];
      
      // Ensure toDate is not in the future
      let validToDate = toDate;
      if (new Date(toDate) > now) {
        console.warn(`Adjusting future toDate ${toDate} to current date`);
        validToDate = today;
      }
      
      // Ensure fromDate is not in the future and not after toDate
      let validFromDate = fromDate;
      if (new Date(fromDate) > now || new Date(fromDate) > new Date(validToDate)) {
        console.warn(`Adjusting invalid fromDate ${fromDate}`);
        const thirtyDaysAgo = new Date(now);
        thirtyDaysAgo.setDate(now.getDate() - 30);
        validFromDate = thirtyDaysAgo.toISOString().split('T')[0];
      }
      
      const formattedFromDate = formatDateForApi(validFromDate);
      const formattedToDate = formatDateForApi(validToDate);
      
      console.log(`Requesting historical rates from ${formattedFromDate} to ${formattedToDate}`);
      console.log(`API URL: ${apiService.getApiBaseUrl()}/rates/historical`);
      
      try {
        const response = await apiService.getHistoricalRates(
          fromCurrency,
          toCurrency,
          formattedFromDate,
          formattedToDate,
          group
        );
        
        if (response.data && response.data.success && response.data.data) {
          // Sort and set the primary historical data
          const sortedData = [...response.data.data].sort((a, b) => new Date(a.time) - new Date(b.time));
          setHistoricalData(sortedData);
          
          // Fetch current live rate separately
          fetchCurrentRate(fromCurrency, toCurrency);
        } else {
          setError('Failed to fetch historical rate data');
          setHistoricalData([]); // Clear data on error
        }
      } catch (apiError) {
        console.error('API Error:', apiError);
        if (apiError.message === 'Network Error') {
          setError('Unable to connect to the server. Please check if the server is running.');
        } else {
          setError(apiError.response?.data?.message || apiError.message || 'Failed to fetch historical rate data');
        }
        setHistoricalData([]); // Clear data on error
      }
    } catch (err) {
      console.error('Error in fetchHistoricalRates:', err);
      setError('An unexpected error occurred. Please try again later.');
      setHistoricalData([]); // Clear data on error
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch current exchange rate
  const fetchCurrentRate = async (fromCurrency, toCurrency) => {
    try {
      // Use the Wise Rates API to get current mid-market rates
      const response = await apiService.getCurrentRate(fromCurrency, toCurrency);
      
      if (response.data && response.data.success && response.data.data) {
        const rateData = response.data.data;
        setCurrentExchangeRate(rateData.rate);
        
        // Set rate timestamp from the API response
        setRateTimestamp(rateData.time);
      } else {
        // If the direct Wise Rates API fails, try using Wise comparison as fallback
        const comparisonResponse = await apiService.getWiseComparison(fromCurrency, toCurrency, 1000);
        
        if (comparisonResponse.data && comparisonResponse.data.success && 
            comparisonResponse.data.data && comparisonResponse.data.data.providers) {
          const providers = comparisonResponse.data.data.providers;
          
          // Find the Wise provider
          const wiseProvider = providers.find(p => 
            p.alias?.toLowerCase() === 'wise' || 
            p.name?.toLowerCase()?.includes('wise')
          );
          
          if (wiseProvider && wiseProvider.quotes && wiseProvider.quotes.length > 0) {
            // Get the rate from the Wise provider
            setCurrentExchangeRate(wiseProvider.quotes[0].rate);
            // Set a default timestamp since we don't have one from this API
            setRateTimestamp(new Date().toISOString());
          } else if (providers.length > 0 && providers[0].quotes && providers[0].quotes.length > 0) {
            // If no Wise provider found, use the first provider in the list
            setCurrentExchangeRate(providers[0].quotes[0].rate);
            // Set a default timestamp since we don't have one from this API
            setRateTimestamp(new Date().toISOString());
          }
        }
      }
    } catch (err) {
      console.error('Error fetching current rate:', err);
      // Try direct API as fallback
      try {
        const directResponse = await apiService.getWiseV4Comparison(fromCurrency, toCurrency, 1000);
        
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
            // Set a default timestamp since we don't have one from this API
            setRateTimestamp(new Date().toISOString());
          } else if (providers.length > 0 && providers[0].quotes && providers[0].quotes.length > 0) {
            // If no Wise provider found, use the first provider in the list
            setCurrentExchangeRate(providers[0].quotes[0].rate);
            // Set a default timestamp since we don't have one from this API
            setRateTimestamp(new Date().toISOString());
          }
        }
      } catch (directErr) {
        console.error('Error fetching current rate from direct API:', directErr);
        // Don't show error for this - we'll still have historical data
      }
    }
  };

  // Fetch second pair historical rates data
  const fetchSecondPairHistoricalRates = async (params = secondPairFormState) => {
    try {
      setSecondPairLoading(true);
      // We don't set the main error state here, maybe a separate error state for the second pair?
      // setError(null);
      
      const { fromCurrency, toCurrency, fromDate, toDate, group } = params;
      
      const now = new Date();
      const today = now.toISOString().split('T')[0];
      const validToDate = new Date(toDate) > now ? today : toDate;
      let validFromDate = fromDate;
      if (new Date(fromDate) > now || new Date(fromDate) > new Date(validToDate)) {
        const thirtyDaysAgo = new Date(now);
        thirtyDaysAgo.setDate(now.getDate() - 30);
        validFromDate = thirtyDaysAgo.toISOString().split('T')[0];
      }
      
      const formattedFromDate = formatDateForApi(validFromDate);
      const formattedToDate = formatDateForApi(validToDate);
      
      console.log(`Requesting second pair historical rates from ${formattedFromDate} to ${formattedToDate}`);
      
      const response = await apiService.getHistoricalRates(
        fromCurrency,
        toCurrency,
        formattedFromDate,
        formattedToDate,
        group
      );
      
      if (response.data && response.data.success && response.data.data) {
        // Sort and set the secondary historical data
        const sortedData = [...response.data.data].sort((a, b) => new Date(a.time) - new Date(b.time));
        setSecondPairData(sortedData);
        
        // Fetch current live rate for second pair
        fetchSecondPairCurrentRate(fromCurrency, toCurrency);
      } else {
        console.error('Failed to fetch second pair historical data');
        setSecondPairData([]); // Clear data on error
      }
    } catch (err) {
      console.error('Error fetching second pair historical rates:', err);
      setSecondPairData([]); // Clear data on error
    } finally {
      setSecondPairLoading(false);
    }
  };

  // Fetch second pair current rate
  const fetchSecondPairCurrentRate = async (fromCurrency, toCurrency) => {
    try {
      // Use the Wise Rates API to get current mid-market rates
      const response = await apiService.getCurrentRate(fromCurrency, toCurrency);
      
      if (response.data && response.data.success && response.data.data) {
        const rateData = response.data.data;
        setSecondPairCurrentRate(rateData.rate);
        
        // Set rate timestamp from the API response
        setSecondPairRateTimestamp(rateData.time);
      } else {
        // If the direct Wise Rates API fails, try using Wise comparison as fallback
        const comparisonResponse = await apiService.getWiseComparison(fromCurrency, toCurrency, 1000);
        
        if (comparisonResponse.data && comparisonResponse.data.success && 
            comparisonResponse.data.data && comparisonResponse.data.data.providers) {
          const providers = comparisonResponse.data.data.providers;
          
          // Find the Wise provider
          const wiseProvider = providers.find(p => 
            p.alias?.toLowerCase() === 'wise' || 
            p.name?.toLowerCase()?.includes('wise')
          );
          
          if (wiseProvider && wiseProvider.quotes && wiseProvider.quotes.length > 0) {
            // Get the rate from the Wise provider
            setSecondPairCurrentRate(wiseProvider.quotes[0].rate);
            // Set a default timestamp since we don't have one from this API
            setSecondPairRateTimestamp(new Date().toISOString());
          } else if (providers.length > 0 && providers[0].quotes && providers[0].quotes.length > 0) {
            // If no Wise provider found, use the first provider in the list
            setSecondPairCurrentRate(providers[0].quotes[0].rate);
            // Set a default timestamp since we don't have one from this API
            setSecondPairRateTimestamp(new Date().toISOString());
          }
        }
      }
    } catch (err) {
      console.error('Error fetching second pair current rate:', err);
      // Try direct API as fallback
      try {
        const directResponse = await apiService.getWiseV4Comparison(fromCurrency, toCurrency, 1000);
        
        if (directResponse.data && directResponse.data.providers) {
          const providers = directResponse.data.providers;
          
          // Find the Wise provider
          const wiseProvider = providers.find(p => 
            p.alias?.toLowerCase() === 'wise' || 
            p.name?.toLowerCase()?.includes('wise')
          );
          
          if (wiseProvider && wiseProvider.quotes && wiseProvider.quotes.length > 0) {
            // Get the rate from the Wise provider
            setSecondPairCurrentRate(wiseProvider.quotes[0].rate);
            // Set a default timestamp since we don't have one from this API
            setSecondPairRateTimestamp(new Date().toISOString());
          } else if (providers.length > 0 && providers[0].quotes && providers[0].quotes.length > 0) {
            // If no Wise provider found, use the first provider in the list
            setSecondPairCurrentRate(providers[0].quotes[0].rate);
            // Set a default timestamp since we don't have one from this API
            setSecondPairRateTimestamp(new Date().toISOString());
          }
        }
      } catch (directErr) {
        console.error('Error fetching second pair current rate from direct API:', directErr);
      }
    }
  };

  // Centralized function to build chart datasets
  const buildChartDatasets = () => {
    if (!historicalData || historicalData.length === 0) {
      setChartData(null); // No primary data, clear chart
      return;
    }

    // Use primary data for labels and the first dataset
    const labels = historicalData.map(item => {
      const date = new Date(item.time);
      // Format labels based on active range
      if (activeRange === '48hours') {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      } else {
        // Use 'DD Mon YY' format for longer ranges
        return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' });
      }
    });

    const primaryRates = historicalData.map(item => item.rate);

    const datasets = [
      {
        label: `${formState.fromCurrency}/${formState.toCurrency}`,
        data: primaryRates,
        borderColor: '#4F46E5',
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
        borderWidth: 2,
        tension: 0.3,
        fill: true,
        pointRadius: 2,
        pointHoverRadius: 5,
        yAxisID: 'y' 
      }
    ];

    // Add the second dataset if needed and data is available
    if (showSecondPair && secondPairData && secondPairData.length > 0) {
      // --- Start Alignment Logic --- 
      const alignedSecondRates = [];
      let lastValidRate = null;
      
      // Create a Map for quick lookup of secondary data by time
      const secondDataMap = new Map();
      secondPairData.forEach(item => {
        secondDataMap.set(new Date(item.time).getTime(), item.rate);
      });

      historicalData.forEach(primaryItem => {
        const primaryTime = new Date(primaryItem.time).getTime();
        
        // Try exact match using the Map
        if (secondDataMap.has(primaryTime)) {
          const rate = secondDataMap.get(primaryTime);
          alignedSecondRates.push(rate);
          lastValidRate = rate;
        } else {
          // If no exact match, use interpolation/nearest neighbor (from previous implementation)
          const beforeItems = secondPairData.filter(item => new Date(item.time) < new Date(primaryItem.time))
            .sort((a, b) => new Date(b.time) - new Date(a.time));
          const afterItems = secondPairData.filter(item => new Date(item.time) > new Date(primaryItem.time))
            .sort((a, b) => new Date(a.time) - new Date(b.time));
          
          const before = beforeItems.length > 0 ? beforeItems[0] : null;
          const after = afterItems.length > 0 ? afterItems[0] : null;
          
          if (before && after) {
            const beforeTime = new Date(before.time).getTime();
            const afterTime = new Date(after.time).getTime();
            // Avoid division by zero if timestamps are identical
            if (afterTime === beforeTime) {
              alignedSecondRates.push(before.rate);
              lastValidRate = before.rate;
            } else {
              const ratio = (primaryTime - beforeTime) / (afterTime - beforeTime);
              const interpolatedRate = before.rate + (after.rate - before.rate) * ratio;
              alignedSecondRates.push(interpolatedRate);
              lastValidRate = interpolatedRate;
            }
          } else if (before) {
            alignedSecondRates.push(before.rate);
            lastValidRate = before.rate;
          } else if (after) {
            alignedSecondRates.push(after.rate);
            lastValidRate = after.rate;
          } else if (lastValidRate !== null) {
            alignedSecondRates.push(lastValidRate);
          } else {
            alignedSecondRates.push(null); // No data point available
          }
        }
      });
      // --- End Alignment Logic --- 
      
      datasets.push({
        label: `${secondPairFormState.fromCurrency}/${secondPairFormState.toCurrency}`,
        data: alignedSecondRates,
        borderColor: '#EA580C',
        backgroundColor: 'rgba(234, 88, 12, 0.1)',
        borderWidth: 2,
        tension: 0.3,
        fill: false,
        pointRadius: 2,
        pointHoverRadius: 5,
        yAxisID: 'y1'
      });
    }

    // Update the chart data state
    setChartData({
      labels,
      datasets
    });
  };

  // Remove the chart processing logic from processSecondPairChartData
  const processSecondPairChartData = (apiData) => {
    if (!apiData || !apiData.length) {
      setSecondPairData([]); // Clear data if API returns nothing
      return;
    }
    // Only sort and set the state. The useEffect will handle the chart update.
    const sortedData = [...apiData].sort((a, b) => new Date(a.time) - new Date(b.time));
    setSecondPairData(sortedData);
  };

  // Handle product price change
  const handleProductPriceChange = (e) => {
    const value = parseFloat(e.target.value);
    setProductPrice(isNaN(value) ? 0 : value);
  };

  // Handle base currency change for ecommerce tool
  const handleBaseCurrencyChange = (currency) => {
    setBaseCurrency(currency);
  };

  // Handle adding a target currency
  const handleAddTargetCurrency = (currency) => {
    if (!targetCurrencies.includes(currency)) {
      setTargetCurrencies([...targetCurrencies, currency]);
    }
  };

  // Handle removing a target currency
  const handleRemoveTargetCurrency = (currency) => {
    setTargetCurrencies(targetCurrencies.filter(c => c !== currency));
  };

  // Calculate converted prices
  const calculatePrices = async () => {
    if (productPrice <= 0) {
      setPriceToolError("Please enter a valid product price");
      return;
    }

    setIsCalculating(true);
    setPriceToolError(null);
    
    try {
      const results = {};
      
      // Get rates for all target currencies
      await Promise.all(targetCurrencies.map(async (currency) => {
        try {
          // First try the direct rate API
          const response = await apiService.getCurrentRate(baseCurrency, currency);
          
          if (response.data && response.data.success && response.data.data) {
            const rateData = response.data.data;
            results[currency] = rateData.rate * productPrice;
          } else {
            // If direct rate API fails, try comparison API
            const comparisonResponse = await apiService.getWiseComparison(baseCurrency, currency, productPrice);
            
            if (comparisonResponse.data && comparisonResponse.data.success && 
                comparisonResponse.data.data && comparisonResponse.data.data.providers) {
              const providers = comparisonResponse.data.data.providers;
              
              // Find Wise provider or use first provider
              const wiseProvider = providers.find(p => 
                p.alias?.toLowerCase() === 'wise' || 
                p.name?.toLowerCase()?.includes('wise')
              );
              
              if (wiseProvider && wiseProvider.quotes && wiseProvider.quotes.length > 0) {
                results[currency] = wiseProvider.quotes[0].rate * productPrice;
              } else if (providers.length > 0 && providers[0].quotes && providers[0].quotes.length > 0) {
                results[currency] = providers[0].quotes[0].rate * productPrice;
              }
            }
          }
        } catch (err) {
          console.error(`Error fetching rate for ${currency}:`, err);
          
          // Try direct API as fallback
          try {
            const directResponse = await apiService.getWiseV4Comparison(baseCurrency, currency, productPrice);
            
            if (directResponse.data && directResponse.data.providers) {
              const providers = directResponse.data.providers;
              
              const wiseProvider = providers.find(p => 
                p.alias?.toLowerCase() === 'wise' || 
                p.name?.toLowerCase()?.includes('wise')
              );
              
              if (wiseProvider && wiseProvider.quotes && wiseProvider.quotes.length > 0) {
                results[currency] = wiseProvider.quotes[0].rate * productPrice;
              } else if (providers.length > 0 && providers[0].quotes && providers[0].quotes.length > 0) {
                results[currency] = providers[0].quotes[0].rate * productPrice;
              }
            }
          } catch (directErr) {
            console.error(`Error fetching direct rate for ${currency}:`, directErr);
            results[currency] = null;
          }
        }
      }));
      
      // Filter out any null results and update state
      const validResults = Object.fromEntries(
        Object.entries(results).filter(([_, value]) => value !== null)
      );
      
      if (Object.keys(validResults).length === 0) {
        setPriceToolError("Unable to fetch rates for any currencies. Please try again.");
      } else {
        setConvertedPrices(validResults);
      }
    } catch (error) {
      console.error("Error calculating prices:", error);
      setPriceToolError("Failed to calculate prices. Please try again.");
    } finally {
      setIsCalculating(false);
    }
  };

  // Format price with currency symbol
  const formatPrice = (price, currencyCode) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  // Get the color for the heat map cell based on percent change
  const getHeatMapColor = (percentChange) => {
    if (!percentChange && percentChange !== 0) return 'bg-gray-100';
    
    const value = parseFloat(percentChange);
    
    // Strong negative (red)
    if (value <= -1.5) return 'bg-red-600 text-white';
    // Medium negative (lighter red)
    if (value <= -0.75) return 'bg-red-400 text-white';
    // Slight negative (pale red)
    if (value < 0) return 'bg-red-200';
    // Neutral/no change (gray)
    if (value === 0) return 'bg-gray-200';
    // Slight positive (pale green)
    if (value < 0.75) return 'bg-green-200';
    // Medium positive (lighter green)
    if (value < 1.5) return 'bg-green-400 text-white';
    // Strong positive (green)
    return 'bg-green-600 text-white';
  };

  // Format volatility percentage
  const formatVolatility = (percentChange) => {
    if (!percentChange && percentChange !== 0) return '—';
    
    const value = parseFloat(percentChange);
    return value > 0 ? `+${value}%` : `${value}%`;
  };

  // Add this function after the VOLATILITY_CACHE_KEY constant
  const getNextRefreshTime = () => {
    const now = new Date();
    const nextRefresh = new Date(now);
    nextRefresh.setHours(3, 0, 0, 0); // Set to 3 AM
    
    // If it's already past 3 AM, set to next day
    if (now > nextRefresh) {
      nextRefresh.setDate(nextRefresh.getDate() + 1);
    }
    
    return nextRefresh;
  };

  // Modify the getVolatilityCache function
  const getVolatilityCache = (period) => {
    try {
      const cache = JSON.parse(localStorage.getItem(VOLATILITY_CACHE_KEY) || '{}');
      if (!cache[period]) return null;
      
      // Check if cache is from today and before 3 AM
      const cachedDate = new Date(cache[period].timestamp);
      const now = new Date();
      const nextRefresh = getNextRefreshTime();
      
      // If cache is from today but before 3 AM, or from yesterday after 3 AM, it's still valid
      if (cachedDate.toDateString() === now.toDateString() && now < nextRefresh) {
        console.log(`Using cached volatility data for ${period} from ${cachedDate.toLocaleTimeString()}`);
        return cache[period].data;
      }
      
      // If cache is from yesterday after 3 AM, it's still valid
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      if (cachedDate.toDateString() === yesterday.toDateString() && cachedDate.getHours() >= 3) {
        console.log(`Using cached volatility data for ${period} from ${cachedDate.toLocaleTimeString()}`);
        return cache[period].data;
      }
      
      console.log(`Cached volatility data for ${period} is outdated`);
      return null;
    } catch (error) {
      console.error('Error reading volatility cache:', error);
      return null;
    }
  };

  // Modify the useEffect for volatility data refresh
  useEffect(() => {
    fetchVolatilityData();
    
    // Calculate time until next refresh (3 AM)
    const scheduleNextRefresh = () => {
      const nextRefresh = getNextRefreshTime();
      const timeUntilRefresh = nextRefresh.getTime() - new Date().getTime();
      
      // Schedule the next refresh
      const timeoutId = setTimeout(() => {
        fetchVolatilityData();
        scheduleNextRefresh(); // Schedule the next refresh after this one
      }, timeUntilRefresh);
      
      return timeoutId;
    };
    
    // Initial schedule
    const timeoutId = scheduleNextRefresh();
    
    // Cleanup on unmount
    return () => clearTimeout(timeoutId);
  }, [selectedVolatilityPeriod, baseCurrencies, quoteCurrencies]);

  // useEffect to update chart when data changes
  useEffect(() => {
    buildChartDatasets();
  }, [historicalData, secondPairData, showSecondPair, formState.fromCurrency, formState.toCurrency, secondPairFormState.fromCurrency, secondPairFormState.toCurrency]); // Dependencies include currencies to update labels

  // Fetch primary data on initial load and when primary currency/group changes
  useEffect(() => {
    if (formState.fromCurrency && formState.toCurrency) {
      fetchHistoricalRates(); // Fetch primary data
    }
  }, [formState.fromCurrency, formState.toCurrency, formState.group]); // Removed fetchCurrentRate from here

  // Fetch secondary data when secondary currency/group changes OR when it's toggled on
  useEffect(() => {
    if (showSecondPair && secondPairFormState.fromCurrency && secondPairFormState.toCurrency) {
      fetchSecondPairHistoricalRates(); // Fetch secondary data
    }
  }, [showSecondPair, secondPairFormState.fromCurrency, secondPairFormState.toCurrency, secondPairFormState.group]); // Removed fetchSecondPairCurrentRate

  // Calculate prices when base currency or product price changes
  useEffect(() => {
    if (productPrice > 0) {
      calculatePrices();
    }
  }, [baseCurrency, productPrice]);

  // Refresh live rate every 2 minutes to keep timestamp no older than 2 minutes
  useEffect(() => {
    if (formState.fromCurrency && formState.toCurrency) {
      const intervalId = setInterval(() => {
        fetchCurrentRate(formState.fromCurrency, formState.toCurrency);
      }, 120000); // 120000ms = 2 minutes
      return () => clearInterval(intervalId);
    }
  }, [formState.fromCurrency, formState.toCurrency]);

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

  // Currency options for the dropdown
  const availableCurrencies = currenciesList.map(currency => currency.code);

  // Clear all volatility cache data
  const clearAllVolatilityCache = () => {
    try {
      localStorage.removeItem(VOLATILITY_CACHE_KEY);
      console.log("All volatility cache data cleared");
      return true;
    } catch (error) {
      console.error("Error clearing volatility cache:", error);
      return false;
    }
  };

  // New function to calculate volatility for all currency pairs
  const VOLATILITY_CACHE_KEY = 'volatility_heatmap_cache';
  
  const saveVolatilityCache = (period, data) => {
    try {
      const cache = JSON.parse(localStorage.getItem(VOLATILITY_CACHE_KEY) || '{}');
      cache[period] = {
        data: data,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem(VOLATILITY_CACHE_KEY, JSON.stringify(cache));
      console.log(`Volatility data cached for ${period}`);
    } catch (error) {
      console.error('Error saving volatility cache:', error);
    }
  };
  
  const fetchVolatilityData = async () => {
    try {
      setIsLoadingHeatMap(true);
      setVolatilityError(null);
      
      // Try to get data from cache first
      const cachedData = getVolatilityCache(selectedVolatilityPeriod);
      if (cachedData) {
        setVolatilityData(cachedData);
        setLastHeatMapUpdate(new Date(JSON.parse(localStorage.getItem(VOLATILITY_CACHE_KEY))[selectedVolatilityPeriod].timestamp));
        setIsLoadingHeatMap(false);
        return;
      }
      
      // If no cache, proceed with API fetch
      const volatilityResults = {};
      
      // Get current date (not future date!)
      const currentDate = new Date();
      let startDate = new Date();
      
      // Ensure we're using the current year, not a future year
      const currentYear = currentDate.getFullYear();
      
      // Set start date based on selected period - with EXTENDED ranges to ensure multiple data points
      switch(selectedVolatilityPeriod) {
        case '1day':
          // For 1 day period, use 3 days to ensure at least 2 data points
          startDate.setDate(startDate.getDate() - 3);
          break;
        case '1week':
          startDate.setDate(startDate.getDate() - 10); // 10 days instead of 7
          break;
        case '1month':
          startDate.setMonth(startDate.getMonth() - 1);
          // Add 5 extra days to ensure more data points
          startDate.setDate(startDate.getDate() - 5);
          break;
        default:
          startDate.setDate(startDate.getDate() - 3);
      }
      
      // Set years to current year
      startDate.setFullYear(currentYear);
      const endDate = new Date();
      endDate.setFullYear(currentYear);
      
      // Format dates for API with current year
      const fromDate = startDate.toISOString().split('T')[0];
      const toDate = endDate.toISOString().split('T')[0];
      
      console.log(`Volatility date range: from=${fromDate}, to=${toDate}`);
      
      // Create a queue of promises with more aggressive throttling
      const queue = [];
      let completedRequests = 0;
      const totalPairs = baseCurrencies.length * quoteCurrencies.length - baseCurrencies.length; // Subtract same-currency pairs
      
      // Create promises for each currency pair
      for (const baseCurrency of baseCurrencies) {
        volatilityResults[baseCurrency] = {};
        
        for (const quoteCurrency of quoteCurrencies) {
          // Skip same currency pairs
          if (baseCurrency === quoteCurrency) continue;
          
          // Add promise to queue with retry logic
          queue.push(
            (async () => {
              let retries = 3;
              let delay = 1000; // Start with 1 second delay
              
              while (retries > 0) {
                try {
                  // Get historical data for this pair
                  console.log(`Fetching ${baseCurrency}/${quoteCurrency} from ${fromDate} to ${toDate}`);
                  const response = await apiService.getHistoricalRates(
                    baseCurrency,
                    quoteCurrency,
                    fromDate,
                    toDate,
                    'day'
                  );
                  
                  if (response.data && response.data.success && response.data.data && response.data.data.length > 0) {
                    const rates = response.data.data;
                    console.log(`${baseCurrency}/${quoteCurrency} rates:`, rates);
                    
                    // Calculate volatility (percent change)
                    let percentChange = 0;
                    
                    if (rates.length >= 2) {
                      // Normal calculation when we have multiple data points
                      const oldestRate = rates[0].rate;
                      const latestRate = rates[rates.length - 1].rate;
                      percentChange = ((latestRate - oldestRate) / oldestRate) * 100;
                      console.log(`${baseCurrency}/${quoteCurrency} calculation: (${latestRate} - ${oldestRate}) / ${oldestRate} * 100 = ${percentChange}%`);
                    } else if (rates.length === 1) {
                      // For single data point, compare with static reference rates or use API for reference
                      console.log(`${baseCurrency}/${quoteCurrency} has only one data point, attempting to get reference rate`);
                      
                      try {
                        // Get a current rate to compare with
                        const currentRateResponse = await apiService.getCurrentRate(baseCurrency, quoteCurrency);
                        
                        if (currentRateResponse.data && currentRateResponse.data.success && currentRateResponse.data.data) {
                          const currentRate = currentRateResponse.data.data.rate;
                          const historicalRate = rates[0].rate;
                          
                          percentChange = ((currentRate - historicalRate) / historicalRate) * 100;
                          console.log(`${baseCurrency}/${quoteCurrency} single-point calc: (${currentRate} - ${historicalRate}) / ${historicalRate} * 100 = ${percentChange}%`);
                        } else {
                          console.log(`No current rate available for ${baseCurrency}/${quoteCurrency}, using 0%`);
                        }
                      } catch (rateError) {
                        console.error(`Error getting reference rate for ${baseCurrency}/${quoteCurrency}:`, rateError);
                        // Keep percentChange as 0
                      }
                    } else {
                      console.log(`${baseCurrency}/${quoteCurrency} has no data points`);
                    }
                    
                    // Store the result
                    volatilityResults[baseCurrency][quoteCurrency] = {
                      percentChange: percentChange.toFixed(2),
                      lastRate: rates[rates.length - 1].rate,
                      timestamp: rates[rates.length - 1].time,
                      dataPoints: rates.length
                    };
                    
                    completedRequests++;
                    console.log(`Fetched volatility for ${baseCurrency}/${quoteCurrency}. Progress: ${completedRequests}/${totalPairs}`);
                    
                    // Break out of retry loop
                    break;
                  } else {
                    console.warn(`No valid data returned for ${baseCurrency}/${quoteCurrency}`);
                    // Store error state for no data
                    volatilityResults[baseCurrency][quoteCurrency] = {
                      error: true,
                      message: "No data returned from API",
                      percentChange: "0.00" // Default to 0 instead of error
                    };
                    completedRequests++;
                    break;
                  }
                } catch (error) {
                  console.error(`Error fetching volatility for ${baseCurrency}/${quoteCurrency}:`, error);
                  
                  // Only retry on rate limit errors (429)
                  if (error.response && error.response.status === 429 && retries > 1) {
                    retries--;
                    console.log(`Rate limited. Retrying ${baseCurrency}/${quoteCurrency} after ${delay}ms. ${retries} retries left.`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                    delay *= 2; // Exponential backoff
                  } else {
                    // For other errors or last retry, store error state
                    volatilityResults[baseCurrency][quoteCurrency] = {
                      error: true,
                      message: error.message,
                      percentChange: "0.00" // Default to 0 instead of error
                    };
                    completedRequests++;
                    break;
                  }
                }
              }
            })()
          );
          
          // Process in smaller batches (1 at a time) with longer delays
          if (queue.length >= 1) {
            await Promise.all(queue);
            queue.length = 0; // Clear the queue
            await new Promise(resolve => setTimeout(resolve, 1500)); // Add a longer delay
          }
        }
      }
      
      // Process any remaining requests
      if (queue.length > 0) {
        await Promise.all(queue);
      }
      
      // Log final results for debugging
      console.log("Final volatility results:", JSON.stringify(volatilityResults, null, 2));
      
      // Update state and cache results
      setVolatilityData(volatilityResults);
      setLastHeatMapUpdate(new Date());
      
      // Save to cache
      saveVolatilityCache(selectedVolatilityPeriod, volatilityResults);
      
    } catch (err) {
      console.error('Error in fetchVolatilityData:', err);
      setVolatilityError('Failed to fetch volatility data. Please try again later.');
    } finally {
      setIsLoadingHeatMap(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-indigo-50/30 to-white text-gray-900 py-10 pt-[1px]">
      {/* Add shimmer styles */}
      <style jsx="true" global="true">{`
        .text-shimmer {
          background: linear-gradient(
            to right,
            #6366f1 20%,
            #818cf8 40%,
            #4f46e5 60%,
            #6366f1 80%
          );
          background-size: 200% auto;
          background-clip: text;
          text-fill-color: transparent;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: text-shine 1.5s linear infinite;
        }
        
        @keyframes text-shine {
          to {
            background-position: 200% center;
          }
        }
      `}</style>
      
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
          className="absolute bottom-6 left-0 right-0 flex justify-center"
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
              className="bg-white rounded-2xl p-6 mb-8 shadow-lg border border-indigo-50 relative"
              variants={itemVariants}
            >
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
                        <span className="mx-2 text-lg md:text-xl font-medium">1 {formState.fromCurrency} = </span>
                        <motion.span 
                          className="text-2xl md:text-4xl lg:text-5xl font-bold text-shimmer"
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
                        >
                          {formatExchangeRate(currentExchangeRate)}
                        </motion.span>
                        <span className="mx-2 text-lg md:text-xl font-medium">{formState.toCurrency}</span>
                        <CurrencyFlag currency={formState.toCurrency} size="md" />
                      </div>
                      <p className="text-sm text-gray-500">
                        Real-time mid-market exchange rate
                        {rateTimestamp && ` as of ${formatTimestamp(rateTimestamp)}`}
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
                        Exchange Rate Trend
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
                  
                  {/* Add Second Currency Pair Toggle */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between">
                      <motion.button
                        onClick={toggleSecondPair}
                        className={`flex items-center gap-2 text-sm ${showSecondPair ? 'text-indigo-600' : 'text-gray-600'} hover:text-indigo-700 transition-colors`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${showSecondPair ? 'text-indigo-600' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showSecondPair ? "M19 9l-7 7-7-7" : "M12 4v16m8-8H4"} />
                        </svg>
                        <span>{showSecondPair ? 'Hide Comparison Pair' : 'Add Comparison Pair'}</span>
                      </motion.button>
                      
                      {secondPairLoading && (
                        <div className="flex items-center text-sm text-gray-500">
                          <div className="animate-spin h-4 w-4 border-t-2 border-indigo-500 rounded-full mr-2"></div>
                          <span>Loading comparison data...</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Second Currency Pair Selector */}
                    {showSecondPair && (
                      <motion.div 
                        className="mt-4 p-4 bg-orange-50 rounded-xl border border-orange-100"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="flex flex-col md:flex-row gap-4 items-end">
                          <div className="flex-1">
                            <CurrencySelector
                              label="Compare From"
                              selectedCurrency={secondPairFormState.fromCurrency}
                              onCurrencyChange={(currency) => handleSecondPairCurrencyChange('fromCurrency', currency)}
                              isOpen={activeDropdown === 'secondFromCurrency'}
                              onToggle={() => handleDropdownToggle('secondFromCurrency')}
                              id="secondFromCurrency"
                            />
                          </div>
                          
                          <div className="hidden md:flex items-center justify-center pb-5">
                            <div className="bg-orange-100 p-2 rounded-full text-orange-600">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                              </svg>
                            </div>
                          </div>
                          
                          <div className="flex-1">
                            <CurrencySelector
                              label="Compare To"
                              selectedCurrency={secondPairFormState.toCurrency}
                              onCurrencyChange={(currency) => handleSecondPairCurrencyChange('toCurrency', currency)}
                              isOpen={activeDropdown === 'secondToCurrency'}
                              onToggle={() => handleDropdownToggle('secondToCurrency')}
                              id="secondToCurrency"
                            />
                          </div>
                        </div>
                        
                        {/* Display Second Pair Current Rate */}
                        {secondPairCurrentRate && (
                          <div className="mt-4 pt-3 border-t border-orange-200">
                            <div className="flex items-center justify-center">
                              <CurrencyFlag currency={secondPairFormState.fromCurrency} size="sm" />
                              <span className="mx-2 text-sm font-medium">1 {secondPairFormState.fromCurrency} = </span>
                              <span className="text-lg font-bold text-orange-600">
                                {formatExchangeRate(secondPairCurrentRate)}
                              </span>
                              <span className="mx-2 text-sm font-medium">{secondPairFormState.toCurrency}</span>
                              <CurrencyFlag currency={secondPairFormState.toCurrency} size="sm" />
                            </div>
                            {secondPairRateTimestamp && (
                              <p className="text-xs text-orange-500 text-center mt-1">
                                As of {formatTimestamp(secondPairRateTimestamp)}
                              </p>
                            )}
                          </div>
                        )}
                      </motion.div>
                    )}
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
                                type: 'linear',
                                display: true,
                                position: 'left',
                                beginAtZero: false,
                                title: {
                                  display: true,
                                  text: `${formState.fromCurrency}/${formState.toCurrency}`,
                                  color: '#4F46E5'
                                },
                                ticks: {
                                  callback: function(value) {
                                    return value.toFixed(4);
                                  },
                                  color: '#4F46E5'
                                },
                                grid: {
                                  drawOnChartArea: true
                                }
                              },
                              y1: {
                                type: 'linear',
                                display: showSecondPair && secondPairData.length > 0,
                                position: 'right',
                                beginAtZero: false,
                                title: {
                                  display: true,
                                  text: showSecondPair ? `${secondPairFormState.fromCurrency}/${secondPairFormState.toCurrency}` : '',
                                  color: '#EA580C'
                                },
                                ticks: {
                                  callback: function(value) {
                                    return value.toFixed(4);
                                  },
                                  color: '#EA580C'
                                },
                                grid: {
                                  drawOnChartArea: false // Only draw grid lines for the primary y-axis
                                }
                              },
                              x: {
                                grid: {
                                  display: false
                                },
                                ticks: {
                                  maxTicksLimit: 10,
                                  maxRotation: activeRange === '48hours' ? 0 : 45, // No rotation needed for time
                                  minRotation: 0,
                                  font: {
                                    size: 11
                                  },
                                  autoSkip: true,
                                  autoSkipPadding: 30
                                }
                              }
                            },
                            plugins: {
                              legend: {
                                display: true,
                                position: 'top',
                                align: 'center', // Center align legend items
                                labels: {
                                  usePointStyle: true,
                                  pointStyle: 'circle', // Use circles instead of boxes
                                  boxWidth: 8,      // Adjust size of the color indicator
                                  boxHeight: 8,     // Make it a square
                                  padding: 25,      // Increase padding between legend items
                                  font: {
                                    size: 13,       // Slightly larger font for legend text
                                  }
                                }
                              },
                              tooltip: {
                                callbacks: {
                                  label: function(context) {
                                    return `${context.dataset.label}: ${context.parsed.y.toFixed(5)}`;
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
                                displayColors: true,
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
                      {'Data provided by a leading exchange rate service using live data'}
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
                  <div className="relative">
                    <h3 className="text-sm uppercase tracking-wider text-gray-500 font-medium mb-2">Lowest Rate</h3>
                    <p className="text-2xl font-bold text-red-600">
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
                  <div className="relative">
                    <h3 className="text-sm uppercase tracking-wider text-gray-500 font-medium mb-2">Highest Rate</h3>
                    <p className="text-2xl font-bold text-green-600">
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
            
            {/* NEW SECTION: Volatility Heat Map */}
            <motion.div 
              className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100 mb-8 relative overflow-hidden"
              variants={itemVariants}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200/30 to-indigo-200/30 rounded-bl-full"></div>
              
              <div className="relative z-10">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                  <h2 className="text-xl font-bold text-gray-800 flex items-center">
                    <span className="mr-2 text-blue-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </span>
                    <span>
                      Currency Volatility Heat Map
                    </span>
                  </h2>
                  
                  <div className="flex items-center gap-4">
                    {/* Period Selector Buttons */}
                    <div className="flex flex-wrap gap-2">
                      {[
                        { id: '1day', label: '24h' },
                        { id: '1week', label: '1w' },
                        { id: '1month', label: '1m' }
                      ].map((period) => (
                        <motion.button 
                          key={period.id}
                          onClick={() => setSelectedVolatilityPeriod(period.id)}
                          className={`px-3 py-1 text-sm rounded-full transition-all duration-300 border ${selectedVolatilityPeriod === period.id ? 
                            'bg-blue-600 text-white border-blue-600' : 
                            'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}
                          whileHover={{ y: -2 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {period.label}
                        </motion.button>
                      ))}
                    </div>
                    
                    {/* Refresh and Clear Cache Buttons */}
                    <div className="flex gap-2">
                      {/* Manual Refresh Button */}
                      <motion.button
                        onClick={() => {
                          try {
                            // Remove cache for current period
                            const cache = JSON.parse(localStorage.getItem(VOLATILITY_CACHE_KEY) || '{}');
                            if (cache[selectedVolatilityPeriod]) {
                              delete cache[selectedVolatilityPeriod];
                              localStorage.setItem(VOLATILITY_CACHE_KEY, JSON.stringify(cache));
                            }
                            // Trigger a fresh fetch
                            fetchVolatilityData();
                          } catch (err) {
                            console.error('Error clearing cache:', err);
                            fetchVolatilityData();
                          }
                        }}
                        className="p-2 rounded-full text-blue-600 hover:bg-blue-50 transition-colors"
                        whileHover={{ rotate: 180 }}
                        transition={{ duration: 0.5 }}
                        disabled={isLoadingHeatMap}
                        title="Refresh current period data"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      </motion.button>
                      
                      {/* Clear All Cache Button */}
                      <motion.button
                        onClick={() => {
                          if (clearAllVolatilityCache()) {
                            // Trigger a fresh fetch after clearing all cache
                            fetchVolatilityData();
                          }
                        }}
                        className="p-2 rounded-full text-red-600 hover:bg-red-50 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.3 }}
                        disabled={isLoadingHeatMap}
                        title="Clear all cached volatility data"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </motion.button>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-6">
                  Daily percentage changes for major currency pairs. Green indicates strengthening of the base currency (left) against the quote currency (top). Red indicates weakening. <span className="font-medium">Data cached once per day.</span>
                </p>
                
                {/* Heat Map Grid */}
                {isLoadingHeatMap && Object.keys(volatilityData).length === 0 ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="flex flex-col items-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                      <p className="mt-4 text-gray-600">Loading volatility data...</p>
                    </div>
                  </div>
                ) : volatilityError ? (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-700">{volatilityError}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">
                            <div className="flex flex-col">
                              <div className="flex items-center">
                                <span>Base</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </div>
                              <div className="flex items-center mt-1">
                                <span>Quote</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </div>
                            </div>
                          </th>
                          {quoteCurrencies.map(quoteCurrency => (
                            <th 
                              key={quoteCurrency}
                              className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border"
                            >
                              <div className="flex flex-col items-center">
                                <CurrencyFlag currency={quoteCurrency} size="sm" />
                                <span className="mt-1">{quoteCurrency}</span>
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {baseCurrencies.map(baseCurrency => (
                          <tr key={baseCurrency}>
                            <td className="px-4 py-4 whitespace-nowrap border bg-gray-50">
                              <div className="flex items-center md:mr-0 mr-4">
                                <CurrencyFlag currency={baseCurrency} size="sm" />
                                <span className="ml-2 font-medium">{baseCurrency}</span>
                              </div>
                            </td>
                            {quoteCurrencies.map(quoteCurrency => (
                              <td 
                                key={`${baseCurrency}-${quoteCurrency}`}
                                className={`px-4 py-4 whitespace-nowrap text-center border ${
                                  baseCurrency === quoteCurrency 
                                    ? 'bg-gray-100' 
                                    : volatilityData[baseCurrency]?.[quoteCurrency]?.error
                                      ? 'bg-gray-100'
                                      : getHeatMapColor(volatilityData[baseCurrency]?.[quoteCurrency]?.percentChange)
                                }`}
                              >
                                {baseCurrency === quoteCurrency ? (
                                  '—'
                                ) : volatilityData[baseCurrency]?.[quoteCurrency]?.error ? (
                                  <span className="text-xs text-gray-500">N/A</span>
                                ) : isLoadingHeatMap && !volatilityData[baseCurrency]?.[quoteCurrency] ? (
                                  <div className="flex justify-center">
                                    <div className="animate-pulse h-4 w-12 bg-gray-200 rounded"></div>
                                  </div>
                                ) : (
                                  <div className="text-sm font-medium">
                                    {formatVolatility(volatilityData[baseCurrency]?.[quoteCurrency]?.percentChange)}
                                  </div>
                                )}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                
                {lastHeatMapUpdate && (
                  <div className="mt-4 text-xs text-gray-500 text-right">
                    Last updated: {lastHeatMapUpdate.toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit'
                    })}
                    {isLoadingHeatMap && (
                      <span className="ml-2 inline-flex items-center">
                        <div className="animate-spin h-3 w-3 border-t-2 border-b-2 border-blue-500 rounded-full mr-1"></div>
                        <span>Refreshing...</span>
                      </span>
                    )}
                  </div>
                )}
                
                <div className="mt-5 flex flex-wrap justify-center gap-3">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-red-600 rounded mr-1"></div>
                    <span className="text-xs">Strong ↓</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-red-400 rounded mr-1"></div>
                    <span className="text-xs">Medium ↓</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-red-200 rounded mr-1"></div>
                    <span className="text-xs">Slight ↓</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-gray-200 rounded mr-1"></div>
                    <span className="text-xs">No change</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-green-200 rounded mr-1"></div>
                    <span className="text-xs">Slight ↑</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-green-400 rounded mr-1"></div>
                    <span className="text-xs">Medium ↑</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-green-600 rounded mr-1"></div>
                    <span className="text-xs">Strong ↑</span>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* E-commerce Pricing Tool Section */}
            <motion.div 
              className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100 mb-8 relative overflow-hidden"
              variants={itemVariants}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-200/30 to-indigo-200/30 rounded-bl-full"></div>
              
              <div className="relative z-10">
                <div className="flex items-center mb-6">
                  <div className="mr-3 bg-purple-100 p-2 rounded-full text-purple-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Multi-Currency Pricing Tool</h2>
                </div>
                
                <p className="text-gray-600 mb-6">
                  Convert your product prices to multiple currencies in real-time to optimize your global e-commerce strategy.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Product Price Input */}
                  <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Product Price</label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={productPrice}
                        onChange={handleProductPriceChange}
                        className="w-full appearance-none border border-gray-500 rounded-xl p-4 md:p-5 text-gray-800 focus:outline-none cursor-pointer flex items-center justify-between hover:border-blue-500 hover:shadow-md transition-all duration-200 relative overflow-hidden"
                        style={{ minHeight: '64px', fontSize: '1rem', fontWeight: '500' }}
                        placeholder="Enter product price"
                      />
                    </div>
                  </div>
                  
                  {/* Base Currency Selector */}
                  <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Base Currency</label>
                    <div className="relative flex justify-center">
                      <div className="flex items-center">
                        <CurrencySelector
                          selectedCurrency={baseCurrency}
                          onCurrencyChange={handleBaseCurrencyChange}
                          isOpen={activeDropdown === 'baseCurrency'}
                          onToggle={() => handleDropdownToggle('baseCurrency')}
                          id="baseCurrency"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Target Currencies */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-800">Target Markets</h3>
                    <div className="relative">
                      <button
                        onClick={() => handleDropdownToggle('targetCurrencyAdd')}
                        className="flex items-center text-sm text-purple-600 hover:text-purple-700 gap-1"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <span>Add Market</span>
                      </button>
                      
                      {activeDropdown === 'targetCurrencyAdd' && (
                        <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 z-30 max-h-80 overflow-y-auto">
                          <div className="p-3">
                            <input
                              type="text"
                              className="w-full p-2 border border-gray-300 rounded mb-3 text-sm"
                              placeholder="Search currencies..."
                              onChange={(e) => {
                                // Filter currencies based on input
                              }}
                            />
                            <div className="max-h-60 overflow-y-auto">
                              {availableCurrencies.map(currency => (
                                <button
                                  key={currency}
                                  className={`flex items-center p-2.5 text-sm w-full hover:bg-purple-50 rounded transition-colors ${targetCurrencies.includes(currency) ? 'opacity-50' : ''}`}
                                  onClick={() => {
                                    handleAddTargetCurrency(currency);
                                    handleDropdownToggle(null);
                                  }}
                                  disabled={targetCurrencies.includes(currency)}
                                >
                                  <div className="flex items-center min-w-[60px]">
                                    <CurrencyFlag currency={currency} size="sm" />
                                    <span className="ml-2 font-medium">{currency}</span>
                                  </div>
                                  <span className="text-gray-600 ml-2">{currenciesList.find(c => c.code === currency)?.name || currency}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    {targetCurrencies.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">No target markets selected. Add markets to see price conversions.</p>
                    ) : (
                      <div className="space-y-4">
                        {targetCurrencies.map(currency => (
                          <div key={currency} className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                            <div className="flex items-center">
                              <CurrencyFlag currency={currency} size="md" />
                              <div className="ml-3 text-left">
                                <span className="text-sm font-medium text-gray-900">{currency}</span>
                                <p className="text-xs text-gray-500">{currenciesList.find(c => c.code === currency)?.name || currency}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center">
                              {isCalculating ? (
                                <div className="text-lg font-bold text-purple-600 animate-pulse">
                                  Calculating...
                                </div>
                              ) : (
                                <div className="text-lg font-bold text-purple-600">
                                  {convertedPrices[currency] ? formatPrice(convertedPrices[currency], currency) : '--'}
                                </div>
                              )}
                              
                              <button
                                onClick={() => handleRemoveTargetCurrency(currency)}
                                className="ml-3 text-gray-400 hover:text-red-500"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {priceToolError && (
                    <div className="mt-3 bg-red-50 border-l-4 border-red-500 p-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-red-700">{priceToolError}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-center mt-4">
                  <motion.button
                    onClick={calculatePrices}
                    disabled={isCalculating || productPrice <= 0 || targetCurrencies.length === 0}
                    className={`px-6 py-3 rounded-lg shadow-md flex items-center justify-center ${
                      isCalculating || productPrice <= 0 || targetCurrencies.length === 0
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-purple-600 hover:bg-purple-700 text-white'
                    } transition-colors`}
                    whileHover={{ scale: isCalculating ? 1 : 1.02 }}
                    whileTap={{ scale: isCalculating ? 1 : 0.98 }}
                  >
                    {isCalculating ? (
                      <>
                        <div className="animate-spin h-5 w-5 border-t-2 border-b-2 border-white rounded-full mr-2"></div>
                        <span>Calculating...</span>
                      </>
                    ) : (
                      <span>Calculate Prices</span>
                    )}
                  </motion.button>
                </div>
                
                <div className="mt-6 text-sm text-gray-500 text-center">
                  <p>
                    Price conversion uses real-time exchange rates. Final prices may vary based on payment processors and local taxes.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LiveHistoricalRates; 