import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ArrowUpDown, ChevronLeft, SlidersHorizontal, ArrowRight, Award } from 'lucide-react';
import ProviderCard from '../components/ui/ProviderCard';
import CurrencyFlag from '../components/ui/CurrencyFlag';
import GuideRecommendation from '../components/ui/GuideRecommendation';
import { formatAmount, getCurrencySymbol } from '../utils/currency';
import { trustpilotRatingsMap } from '../utils/trustpilotRatingsMap';
import apiService from '../services/apiService';
import TrustpilotRating from '../components/ui/TrustpilotRating';

/**
 * Container for displaying money transfer comparison results
 */
const ResultsView = ({ searchData, onBackToSearch }) => {
  const { fromCurrency, toCurrency, amount } = searchData;
  const [sortBy, setSortBy] = useState('amount');
  const [sortDirection, setSortDirection] = useState('desc');
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [loading, setLoading] = useState(true);
  const [providerResults, setProviderResults] = useState([]);
  const [bestDealProvider, setBestDealProvider] = useState(null);
  const [error, setError] = useState(null);
  // State for fetched external ratings and loading status
  const [trustpilotRatings, setTrustpilotRatings] = useState({});
  const [ratingsLoading, setRatingsLoading] = useState(false);
  // State to store the final displayed ratings that are shown on provider cards
  const [finalDisplayedRatings, setFinalDisplayedRatings] = useState({});
  
  // XE currency classifications for different markup percentages
  const majorCurrencies = ['USD', 'EUR', 'GBP', 'AUD', 'CAD', 'NZD', 'CHF', 'JPY', 'SGD'];
  const tier2Currencies = ['INR', 'ZAR', 'MXN', 'PLN', 'SEK', 'NOK', 'DKK', 'HUF', 'CZK', 'ILS', 'TRY', 'THB', 'PHP', 'MYR', 'RON', 'BGN', 'KRW', 'HKD', 'CNY', 'CLP', 'COP', 'SAR', 'AED', 'QAR', 'KWD', 'NGN', 'BRL', 'RUB', 'ARS', 'EGP', 'IDR'];
  const exoticCurrencies = ['NGN', 'KWD', 'QAR', 'ARS', 'EGP', 'IDR', 'CLP', 'COP', 'RUB', 'BRL', 'TRY'];
  
  // Function to determine Panda Remit markup based on currency pair
  const getPandaRemitMarkup = (fromCurr, toCurr) => {
    // Major currency pairs generally have lower markups
    const majorCurrencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CHF'];
    
    if (majorCurrencies.includes(fromCurr) && majorCurrencies.includes(toCurr)) {
      return 0.005; // 0.5% for major currency pairs
    }
    
    return 0.01; // 1.0% for exotic pairs
  };
  
  // Function to determine Panda Remit fee based on currency
  const getPandaRemitFee = (amount, currency) => {
    // PandaRemit often has lower fees for larger transfers
    if (amount >= 5000) {
      return 0;
    }
    
    // Fee structure based on currency
    switch (currency) {
      case 'GBP':
        return 1;
      case 'USD':
        return 2;
      case 'EUR':
        return 1.5;
      default:
        return 2;
    }
  };
  
  // Function to determine Panda Remit delivery time based on currency pair
  const getPandaRemitDeliveryTime = (fromCurr, toCurr) => {
    // Major currency pairs generally transfer faster
    const majorCurrencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD'];
    
    if (majorCurrencies.includes(fromCurr) && majorCurrencies.includes(toCurr)) {
      return {
        text: '1-2 business days',
        hours: { min: 24, max: 48 }
      };
    }
    
    return {
      text: '2-3 business days',
      hours: { min: 48, max: 72 }
    };
  };
  
  // Function to determine XE markup based on currency pair
  const getXEMarkup = (fromCurr, toCurr) => {
    // Major currency pairs generally have lower markups
    const majorCurrencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CHF'];
    
    if (majorCurrencies.includes(fromCurr) && majorCurrencies.includes(toCurr)) {
      return 0.007; // 0.7% for major currency pairs
    }
    
    return 0.013; // 1.3% for exotic pairs
  };
  
  // Function to determine Profee markup based on currency pair
  const getProfeeMarkup = (fromCurr, toCurr) => {
    // Major currency pairs generally have lower markups
    const majorCurrencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CHF'];
    
    if (majorCurrencies.includes(fromCurr) && majorCurrencies.includes(toCurr)) {
      return 0.007; // 0.7% for major currency pairs
    }
    
    return 0.013; // 1.3% for exotic pairs
  };
  
  // Function to determine XE fee based on amount
  const getXEFee = (amount, currency) => {
    // XE often has no fee for larger transfers
    if (amount >= 5000) {
      return 0;
    }
    
    // Fee structure based on currency
    switch (currency) {
      case 'GBP':
        return 1.5;
      case 'USD':
        return 3;
      case 'EUR':
        return 2;
      default:
        return 3;
    }
  };
  
  // Function to determine Profee fee based on amount
  const getProfeeFee = (amount, currency) => {
    // Profee often has no fee for larger transfers
    if (amount >= 5000) {
      return 0;
    }
    
    // Fee structure based on currency
    switch (currency) {
      case 'GBP':
        return 1.5;
      case 'USD':
        return 3;
      case 'EUR':
        return 2;
      default:
        return 3;
    }
  };
  
  // Function to determine XE delivery time based on currency pair
  const getXEDeliveryTime = (fromCurr, toCurr) => {
    // Major currency pairs generally transfer faster
    const majorCurrencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD'];
    
    if (majorCurrencies.includes(fromCurr) && majorCurrencies.includes(toCurr)) {
      return {
        text: '1-2 business days',
        hours: { min: 24, max: 48 }
      };
    }
    
    return {
      text: '2-3 business days',
      hours: { min: 48, max: 72 }
    };
  };
  
  // Function to determine Profee delivery time based on currency pair
  const getProfeeDeliveryTime = (fromCurr, toCurr) => {
    // Major currency pairs generally transfer faster
    const majorCurrencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD'];
    
    if (majorCurrencies.includes(fromCurr) && majorCurrencies.includes(toCurr)) {
      return {
        text: '1-2 business days',
        hours: { min: 24, max: 48 }
      };
    }
    
    return {
      text: '2-3 business days',
      hours: { min: 48, max: 72 }
    };
  };
  
  // Function to determine Torfx markup based on currency pair
  const getTorfxMarkup = (fromCurr, toCurr) => {
    // Major currency pairs generally have lower markups
    const majorCurrencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CHF'];
    
    if (majorCurrencies.includes(fromCurr) && majorCurrencies.includes(toCurr)) {
      return 0.004; // 0.4% for major currency pairs
    }
    
    return 0.01; // 1.0% for exotic pairs
  };

  // Function to determine Torfx fee based on amount
  const getTorfxFee = (amount, currency) => {
    // TorFX often has no fee
    return 0;
  };

  // Function to determine Torfx delivery time based on currency pair
  const getTorfxDeliveryTime = (fromCurr, toCurr) => {
    // Major currency pairs generally transfer faster
    const majorCurrencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD'];
    
    if (majorCurrencies.includes(fromCurr) && majorCurrencies.includes(toCurr)) {
      return {
        text: '1-2 business days',
        hours: { min: 24, max: 48 }
      };
    }
    
    return {
      text: '2-3 business days',
      hours: { min: 48, max: 72 }
    };
  };
  
  // Function to determine Regencyfx markup based on currency pair
  const getRegencyfxMarkup = (fromCurr, toCurr) => {
    // Major currency pairs generally have lower markups
    const majorCurrencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CHF'];
    
    if (majorCurrencies.includes(fromCurr) && majorCurrencies.includes(toCurr)) {
      return 0.0035; // 0.35% for major currency pairs - competitive rate
    }
    
    return 0.009; // 0.9% for exotic pairs
  };

  // Function to determine Regencyfx fee based on amount
  const getRegencyfxFee = (amount, currency) => {
    // Regencyfx often has lower fees for larger transfers
    if (amount >= 3000) {
      return 0;
    }
    
    // Fee structure based on currency
    switch (currency) {
      case 'GBP':
        return 1;
      case 'USD':
        return 2;
      case 'EUR':
        return 1.5;
      default:
        return 2;
    }
  };

  // Function to determine Regencyfx delivery time based on currency pair
  const getRegencyfxDeliveryTime = (fromCurr, toCurr) => {
    // Major currency pairs generally transfer faster
    const majorCurrencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD'];
    
    if (majorCurrencies.includes(fromCurr) && majorCurrencies.includes(toCurr)) {
      return {
        text: '1-2 business days',
        hours: { min: 24, max: 48 }
      };
    }
    
    return {
      text: '2-3 business days',
      hours: { min: 48, max: 72 }
    };
  };
  
  /**
   * Parse ISO 8601 duration string to approximate hours
   * @param {string} isoDuration - ISO 8601 duration format 
   * @returns {number} - Approximate hours
   */
  const parseIsoDuration = (isoDuration) => {
    if (!isoDuration) return 0;
    
    // Parse days, hours, minutes from ISO 8601 duration string
    const daysMatch = isoDuration.match(/(\d+)D/);
    const hoursMatch = isoDuration.match(/(\d+)H/);
    const minutesMatch = isoDuration.match(/(\d+)M(?!S)/); // Match minutes but not seconds
    
    let totalHours = 0;
    
    if (daysMatch && daysMatch[1]) {
      totalHours += parseInt(daysMatch[1]) * 24;
    }
    
    if (hoursMatch && hoursMatch[1]) {
      totalHours += parseInt(hoursMatch[1]);
    }
    
    if (minutesMatch && minutesMatch[1]) {
      totalHours += parseInt(minutesMatch[1]) / 60;
    }
    
    return Math.round(totalHours * 10) / 10; // Round to 1 decimal place
  };
  
  /**
   * Format transfer time in a user-friendly format
   * @param {Object} hours - Object containing min and max hours
   * @returns {string} - Formatted transfer time string
   */
  const formatTransferTime = (hours) => {
    if (!hours) return '';
    
    // If min and max are the same
    if (hours.min === hours.max) {
      const hoursValue = hours.min;
      
      // If less than 24 hours, show in hours and minutes
      if (hoursValue < 24) {
        const wholeHours = Math.floor(hoursValue);
        const minutes = Math.round((hoursValue - wholeHours) * 60);
        
        if (minutes > 0) {
          return `${wholeHours} hour${wholeHours !== 1 ? 's' : ''} ${minutes} minute${minutes !== 1 ? 's' : ''}`;
        } else {
          return `${wholeHours} hour${wholeHours !== 1 ? 's' : ''}`;
        }
      } 
      // If more than 24 hours, show in days
      else {
        const days = Math.ceil(hoursValue / 24);
        return `${days} day${days !== 1 ? 's' : ''}`;
      }
    } 
    // If min and max are different
    else {
      // If both are under 24 hours
      if (hours.min < 24 && hours.max < 24) {
        const minHours = Math.floor(hours.min);
        const maxHours = Math.floor(hours.max);
        
        // Format as "X-Y hours"
        return `${minHours}-${maxHours} hour${maxHours !== 1 ? 's' : ''}`;
      }
      // If one is under 24 hours and one is over
      else if (hours.min < 24 && hours.max >= 24) {
        const minHours = Math.floor(hours.min);
        const maxDays = Math.ceil(hours.max / 24);
        
        return `${minHours} hour${minHours !== 1 ? 's' : ''} - ${maxDays} day${maxDays !== 1 ? 's' : ''}`;
      }
      // If both are over 24 hours
      else {
        const minDays = Math.ceil(hours.min / 24);
        const maxDays = Math.ceil(hours.max / 24);
        
        return `${minDays}-${maxDays} day${maxDays !== 1 ? 's' : ''}`;
      }
    }
  };
  
  // Fetch data from API on component mount or when search parameters change
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null); // Reset error state
      setProviderResults([]); // Clear previous results
      
      try {
        console.log('Fetching exchange rates from API for:', { fromCurrency, toCurrency, amount });
        
        // Create an array to hold all provider results
        let allProviderResults = [];
        
        // Track if we have an InstaReM result from our direct API
        let hasDirectInstaremResult = false;
        
        // Track if we have a Remitly result from our direct API
        let hasDirectRemitlyResult = false;
        
        // Fetch data from the regular backend API
        const regularResponse = await fetch(`/api/providers/compare?fromCurrency=${fromCurrency}&toCurrency=${toCurrency}&amount=${amount}`);
        
        if (!regularResponse.ok) {
          const errorData = await regularResponse.json();
          console.error('Error fetching regular providers:', errorData);
          // Don't throw here, continue to try the Wise API
        } else {
          const regularData = await regularResponse.json();
          
          if (regularData.success && regularData.data) {
            console.log('Received data from regular API:', regularData.data);
            // Add regular provider results
            allProviderResults = [...regularData.data];
          }
        }
        
        // Try to fetch InstaReM rates from the dedicated API
        try {
          console.log('Fetching InstaReM rates from dedicated API');
          const instaremResponse = await apiService.getInstaremComparison(fromCurrency, toCurrency, amount);
          
          if (instaremResponse.data && instaremResponse.data.success && instaremResponse.data.data) {
            console.log('Received data from InstaReM API:', instaremResponse.data.data);
            allProviderResults = [...allProviderResults, ...instaremResponse.data.data];
            
            // Mark that we have a direct InstaReM result
            hasDirectInstaremResult = true;
          }
        } catch (instaremError) {
          console.error('Error fetching from InstaReM API:', instaremError);
          // Continue with other providers
        }
        
        // Try to fetch Remitly rates from the dedicated API
        try {
          console.log('Fetching Remitly rates from dedicated API');
          const remitlyResponse = await apiService.getRemitlyComparison(fromCurrency, toCurrency, amount);
          
          if (remitlyResponse.data && remitlyResponse.data.success && remitlyResponse.data.data) {
            console.log('Received data from Remitly API:', remitlyResponse.data.data);
            allProviderResults = [...allProviderResults, ...remitlyResponse.data.data];
            
            // Mark that we have a direct Remitly result
            hasDirectRemitlyResult = true;
          }
        } catch (remitlyError) {
          console.error('Error fetching from Remitly API:', remitlyError);
          // Continue with other providers
        }
        
        // Fetch data from the Wise API endpoint
        try {
          const wiseResponse = await apiService.getWiseComparison(fromCurrency, toCurrency, amount);
          
          if (wiseResponse.data && wiseResponse.data.success) {
            const wiseData = wiseResponse.data;
            
            if (wiseData.success && wiseData.data) {
              console.log('Received data from Wise API:', wiseData.data);
              
              // Filter out InstaReM from Wise results if we already have direct InstaReM results
              const filteredWiseResults = wiseData.data.filter(provider => {
                // If we have a direct InstaReM result, filter out InstaReM from Wise API
                if (hasDirectInstaremResult && 
                   (provider.providerCode === 'instarem' || 
                    provider.providerName?.toLowerCase().includes('instarem') ||
                    (provider.provider && provider.provider.name && 
                     provider.provider.name.toLowerCase().includes('instarem')))) {
                  console.log('Filtering out InstaReM from Wise API results as we have direct results');
                  return false;
                }
                
                // If we have a direct Remitly result, filter out Remitly from Wise API
                if (hasDirectRemitlyResult && 
                   (provider.providerCode === 'remitly' || 
                    provider.providerName?.toLowerCase().includes('remitly') ||
                    (provider.provider && provider.provider.name && 
                     provider.provider.name.toLowerCase().includes('remitly')))) {
                  console.log('Filtering out Remitly from Wise API results as we have direct results');
                  return false;
                }
                
                // Keep other providers and InstaReM when we don't have direct results
                return !(provider.providerCode === 'ofx' || provider.providerName.toLowerCase().includes('ofx'));
              });
              
              allProviderResults = [...allProviderResults, ...filteredWiseResults];
            }
          } else {
            console.log('Wise API response was not successful, continuing with regular providers only');
            if (wiseResponse && wiseResponse.data && wiseResponse.data.message) {
              console.error('Wise API error message:', wiseResponse.data.message);
            }
          }
        } catch (wiseError) {
          console.error('Error fetching from Wise API:', wiseError);
          // Continue with regular providers only
        }
        
        // Try to fetch OFX rates specifically from ofxApiService
        try {
          console.log('Fetching OFX rates from dedicated API');
          const ofxResponse = await apiService.getRatesComparison(fromCurrency, toCurrency, amount);
          
          if (ofxResponse.data && ofxResponse.data.success && ofxResponse.data.data) {
            console.log('Received data from OFX API:', ofxResponse.data.data);
            allProviderResults = [...allProviderResults, ...ofxResponse.data.data];
          }
        } catch (ofxError) {
          console.error('Error fetching from OFX API:', ofxError);
          // Continue with other providers
        }
        
        // Add hardcoded providers
        try {
          // Fetch the mid-market rate for margin calculations
          console.log('Fetching mid-market rate for hardcoded providers');
          let midMarketRate;
          
          try {
            const midMarketResponse = await apiService.getCurrentRate(fromCurrency, toCurrency);
            if (midMarketResponse.data && midMarketResponse.data.success && midMarketResponse.data.data) {
              midMarketRate = midMarketResponse.data.data.rate;
            } else {
              // Fallback if API fails
              midMarketRate = getMockMidMarketRate(fromCurrency, toCurrency);
            }
          } catch (error) {
            midMarketRate = getMockMidMarketRate(fromCurrency, toCurrency);
          }
          
          console.log('Mid-market rate for hardcoded providers:', midMarketRate);
          
          // Add XE
          const xeMarkup = getXEMarkup(fromCurrency, toCurrency);
          const xeRate = midMarketRate * (1 - xeMarkup);
          const xeFee = getXEFee(amount, fromCurrency);
          const xeAmountReceived = (amount - xeFee) * xeRate;
          const xeTransferTime = getXEDeliveryTime(fromCurrency, toCurrency);
          
          const xeProvider = {
            providerId: 'provider-xe',
            providerName: 'XE Money Transfer',
            providerCode: 'xe',
            providerLogo: '/images/providers/xe.webp',
            rate: xeRate,
            effectiveRate: xeRate,
            transferFee: xeFee,
            marginPercentage: xeMarkup * 100,
            marginCost: amount * xeMarkup,
            totalCost: (amount * xeMarkup) + xeFee,
            amountReceived: xeAmountReceived,
            transferTime: xeTransferTime.text,
            transferTimeHours: xeTransferTime.hours,
            rating: 4.2,
            baseRate: midMarketRate,
            realTimeApi: false
          };
          
          // Add Regencyfx
          const regencyfxMarkup = getRegencyfxMarkup(fromCurrency, toCurrency);
          const regencyfxRate = midMarketRate * (1 - regencyfxMarkup);
          const regencyfxFee = getRegencyfxFee(amount, fromCurrency);
          const regencyfxAmountReceived = (amount - regencyfxFee) * regencyfxRate;
          const regencyfxTransferTime = getRegencyfxDeliveryTime(fromCurrency, toCurrency);
          
          const regencyfxProvider = {
            providerId: 'provider-regencyfx',
            providerName: 'RegencyFX',
            providerCode: 'regencyfx',
            providerLogo: '/images/providers/regencyfx.png',
            rate: regencyfxRate,
            effectiveRate: regencyfxRate,
            transferFee: regencyfxFee,
            marginPercentage: regencyfxMarkup * 100,
            marginCost: amount * regencyfxMarkup,
            totalCost: (amount * regencyfxMarkup) + regencyfxFee,
            amountReceived: regencyfxAmountReceived,
            transferTime: regencyfxTransferTime.text,
            transferTimeHours: regencyfxTransferTime.hours,
            rating: 4.9,
            baseRate: midMarketRate,
            realTimeApi: false
          };
          
          // Add TorFX
          const torfxMarkup = getTorfxMarkup(fromCurrency, toCurrency);
          const torfxRate = midMarketRate * (1 - torfxMarkup);
          const torfxFee = getTorfxFee(amount, fromCurrency);
          const torfxAmountReceived = (amount - torfxFee) * torfxRate;
          const torfxTransferTime = getTorfxDeliveryTime(fromCurrency, toCurrency);
          
          const torfxProvider = {
            providerId: 'provider-torfx',
            providerName: 'TorFX',
            providerCode: 'torfx',
            providerLogo: '/images/providers/torfx.png',
            rate: torfxRate,
            effectiveRate: torfxRate,
            transferFee: torfxFee,
            marginPercentage: torfxMarkup * 100,
            marginCost: amount * torfxMarkup,
            totalCost: (amount * torfxMarkup) + torfxFee,
            amountReceived: torfxAmountReceived,
            transferTime: torfxTransferTime.text,
            transferTimeHours: torfxTransferTime.hours,
            rating: 4.4,
            baseRate: midMarketRate,
            realTimeApi: false
          };
          
          // Add PandaRemit
          const pandaRemitMarkup = getPandaRemitMarkup(fromCurrency, toCurrency);
          const pandaRemitRate = midMarketRate * (1 - pandaRemitMarkup);
          const pandaRemitFee = getPandaRemitFee(amount, fromCurrency);
          const pandaRemitAmountReceived = (amount - pandaRemitFee) * pandaRemitRate;
          const pandaRemitTransferTime = getPandaRemitDeliveryTime(fromCurrency, toCurrency);
          
          const pandaRemitProvider = {
            providerId: 'provider-pandaremit',
            providerName: 'Panda Remit',
            providerCode: 'pandaremit',
            providerLogo: '/images/providers/pandaremit.png',
            rate: pandaRemitRate,
            effectiveRate: pandaRemitRate,
            transferFee: pandaRemitFee,
            marginPercentage: pandaRemitMarkup * 100,
            marginCost: amount * pandaRemitMarkup,
            totalCost: (amount * pandaRemitMarkup) + pandaRemitFee,
            amountReceived: pandaRemitAmountReceived,
            transferTime: pandaRemitTransferTime.text,
            transferTimeHours: pandaRemitTransferTime.hours,
            rating: 4.1,
            baseRate: midMarketRate,
            realTimeApi: false
          };
          
          // Add Profee
          const profeeMarkup = getProfeeMarkup(fromCurrency, toCurrency);
          const profeeRate = midMarketRate * (1 - profeeMarkup);
          const profeeFee = getProfeeFee(amount, fromCurrency);
          const profeeAmountReceived = (amount - profeeFee) * profeeRate;
          const profeeTransferTime = getProfeeDeliveryTime(fromCurrency, toCurrency);
          
          const profeeProvider = {
            providerId: 'provider-profee',
            providerName: 'Profee',
            providerCode: 'profee',
            providerLogo: '/images/providers/profee.svg',
            rate: profeeRate,
            effectiveRate: profeeRate,
            transferFee: profeeFee,
            marginPercentage: profeeMarkup * 100,
            marginCost: amount * profeeMarkup,
            totalCost: (amount * profeeMarkup) + profeeFee,
            amountReceived: profeeAmountReceived,
            transferTime: profeeTransferTime.text,
            transferTimeHours: profeeTransferTime.hours,
            rating: 4.4,
            baseRate: midMarketRate,
            realTimeApi: false
          };
          
          // Add hardcoded providers to the results
          allProviderResults = [...allProviderResults, xeProvider, regencyfxProvider, torfxProvider, pandaRemitProvider, profeeProvider];
          
        } catch (hardcodedError) {
          console.error('Error adding hardcoded providers:', hardcodedError);
          // Continue with available providers
        }
        
        if (allProviderResults.length === 0) {
          throw new Error('No provider results available');
        }
        
        // Fetch the mid-market rate from Wise Rates API for margin calculations
        try {
          console.log('Fetching mid-market rate from Wise Rates API');
          const midMarketResponse = await apiService.getCurrentRate(fromCurrency, toCurrency);
          
          if (midMarketResponse.data && midMarketResponse.data.success && midMarketResponse.data.data) {
            const midMarketRate = midMarketResponse.data.data.rate;
            console.log('Mid-market rate:', midMarketRate);
            
            // First, identify if there's a Wise provider in the results
            const wiseProvider = allProviderResults.find(provider => 
              (provider.providerCode && provider.providerCode.toLowerCase() === 'wise') || 
              (provider.provider && provider.provider.name && provider.provider.name.toLowerCase() === 'wise') ||
              (provider.providerName && provider.providerName.toLowerCase() === 'wise')
            );
            
            // Use Wise's rate as the mid-market rate if available, otherwise use the API rate
            const baselineRate = wiseProvider ? (wiseProvider.effectiveRate || wiseProvider.rate) : midMarketRate;
            console.log('Using baseline rate for margin calculations:', baselineRate);
            
            // Update all provider results with the accurate mid-market rate for margin calculations
            allProviderResults = allProviderResults.map(provider => {
              // Skip updating hardcoded providers that already have baseRate set
              if (provider.realTimeApi === false && provider.baseRate) {
                return provider;
              }
              
              // If this is the Wise provider, set margin to 0 since we're using it as the baseline
              if (
                (provider.providerCode && provider.providerCode.toLowerCase() === 'wise') || 
                (provider.provider && provider.provider.name && provider.provider.name.toLowerCase() === 'wise') ||
                (provider.providerName && provider.providerName.toLowerCase() === 'wise')
              ) {
                return {
                  ...provider,
                  baseRate: baselineRate,
                  marginPercentage: 0 // Wise uses mid-market rates with no margin
                };
              }
              
              // Calculate accurate margin against the baseline rate for other providers
              const effectiveRate = provider.effectiveRate || provider.rate;
              
              // Correctly calculate margin percentage: positive if above mid-market, negative if below
              // A higher rate means more target currency per source currency (better for the customer)
              const marginPercentage = ((effectiveRate - baselineRate) / baselineRate) * 100;
              
              return {
                ...provider,
                baseRate: baselineRate,
                marginPercentage: marginPercentage
              };
            });
          } else {
            console.error('Could not fetch mid-market rate, using existing baseRate values');
          }
        } catch (rateError) {
          console.error('Error fetching mid-market rate:', rateError);
          // Continue with existing baseRate values
        }
        
        // Final step: ensure no duplicate InstaReM providers
        const providerMap = new Map();
        const deduplicatedResults = [];
        
        // Process all results to handle duplicates, prioritizing our direct API results over Wise V4's
        allProviderResults.forEach(provider => {
          const isInstaRem = 
            provider.providerCode === 'instarem' || 
            provider.providerName?.toLowerCase().includes('instarem') ||
            (provider.provider && provider.provider.name && 
             provider.provider.name.toLowerCase().includes('instarem'));
          
          const isRemitly = 
            provider.providerCode === 'remitly' || 
            provider.providerName?.toLowerCase().includes('remitly') ||
            (provider.provider && provider.provider.name && 
             provider.provider.name.toLowerCase().includes('remitly'));
          
          // Generate a unique key for this provider
          const providerKey = provider.providerCode || provider.providerName?.toLowerCase() || 'unknown';
          
          // For InstaReM, only add if we don't already have it, or if the existing one isn't from our direct API
          if (isInstaRem) {
            const existingProvider = providerMap.get('instarem');
            
            // If we don't have an InstaReM provider yet, or this one is from our direct API (realTimeApi = true)
            if (!existingProvider || provider.realTimeApi) {
              // Add or replace the InstaReM provider
              providerMap.set('instarem', provider);
            }
            // If we already have an InstaReM provider from our direct API, skip this one
          } 
          // For Remitly, only add if we don't already have it, or if the existing one isn't from our direct API
          else if (isRemitly) {
            const existingProvider = providerMap.get('remitly');
            
            // If we don't have a Remitly provider yet, or this one is from our direct API (realTimeApi = true)
            if (!existingProvider || provider.realTimeApi) {
              // Add or replace the Remitly provider
              providerMap.set('remitly', provider);
            }
            // If we already have a Remitly provider from our direct API, skip this one
          } else {
            // For all other providers, just add them (no duplicates should exist)
            providerMap.set(providerKey, provider);
          }
        });
        
        // Convert the map back to an array
        providerMap.forEach(provider => deduplicatedResults.push(provider));
        
        // Set the combined provider results and sort them
        setProviderResults(deduplicatedResults);
        sortResults(deduplicatedResults, sortBy, sortDirection); // Sort initial results
        
        setLoading(false);
        
      } catch (error) {
        console.error('Error fetching exchange rates:', error);
        setLoading(false);
        setError(`Failed to fetch exchange rates: ${error.message}. Please try again later.`);
      }
    };

    fetchData();
  }, [fromCurrency, toCurrency, amount]); // Keep dependencies
  
  /**
   * Helper function to get base exchange rates (mid-market rates)
   */
  const getMockMidMarketRate = (fromCurr, toCurr) => {
    // Major currency pair rates as of a recent date
    const rates = {
      'EURUSD': 1.07,
      'EURGBP': 0.86,
      'EURJPY': 164.50,
      'USDEUR': 0.93,
      'USDGBP': 0.80,
      'USDJPY': 153.50,
      'GBPEUR': 1.16,
      'GBPUSD': 1.25,
      'GBPJPY': 191.50,
      'JPYEUR': 0.0061,
      'JPYUSD': 0.0065,
      'JPYGBP': 0.0052,
      'AUDNZD': 1.08,
      'AUDUSD': 0.66,
      'USDCAD': 1.38,
      'GBPCAD': 1.72,
      'GBPAUD': 1.90,
      'EURCAD': 1.46
    };
    
    const key = `${fromCurr}${toCurr}`;
    if (rates[key]) {
      return rates[key];
    }
    
    // Try reverse
    const reverseKey = `${toCurr}${fromCurr}`;
    if (rates[reverseKey]) {
      return 1 / rates[reverseKey];
    }
    
    // For pairs not explicitly defined, use some reasonable approximations
    if (fromCurr === 'USD' && toCurr === 'CHF') return 0.90;
    if (fromCurr === 'CHF' && toCurr === 'USD') return 1.11;
    if (fromCurr === 'EUR' && toCurr === 'CHF') return 0.97;
    if (fromCurr === 'CHF' && toCurr === 'EUR') return 1.03;
    if (fromCurr === 'GBP' && toCurr === 'CHF') return 1.12;
    if (fromCurr === 'CHF' && toCurr === 'GBP') return 0.89;
    
    // If all else fails, return a default rate (this would be replaced with real data in a production app)
    return 1.0;
  };
  
  // Handle sorting
  useEffect(() => {
    if (providerResults.length > 0) {
      const sorted = [...providerResults];
      sortResults(sorted, sortBy, sortDirection);
    }
  }, [sortBy, sortDirection]);
  
  // Set best deal provider whenever the provider results change
  useEffect(() => {
    if (providerResults.length > 0) {
      // Find the provider with the highest amount received
      const bestProvider = [...providerResults].sort((a, b) => 
        b.amountReceived - a.amountReceived
      )[0];
      
      setBestDealProvider(bestProvider);
    }
  }, [providerResults]);
  
  // Fetch external ratings when provider results are available
  useEffect(() => {
    if (providerResults.length > 0) {
      const generateRatings = () => {
        setRatingsLoading(true);
        const localRatingsMap = {};
        
        // Generate ratings for all providers
        providerResults.forEach(provider => {
          // Use provider code to get rating
          const providerId = provider.providerId;
          
          if (!providerId) return;
          
          try {
            // Get provider code or ID for rating lookup
            const providerCode = (
              provider.providerCode || 
              provider.code || 
              providerId.replace('provider-', '')
            )?.toLowerCase();
            
            console.log(`Looking up rating for provider: ${providerCode}`);
            
            // First check our local ratings map
            if (providerCode && trustpilotRatingsMap[providerCode]) {
              localRatingsMap[providerId] = {
                success: true,
                data: {
                  value: trustpilotRatingsMap[providerCode],
                  source: 'TrustpilotRatingsMap',
                  lastUpdated: new Date(),
                  isFallback: false
                }
              };
              console.log(`Found rating in trustpilotRatingsMap: ${trustpilotRatingsMap[providerCode]}`);
              return;
            }
            
            // Try with the full provider ID
            if (providerId && trustpilotRatingsMap[providerId]) {
              localRatingsMap[providerId] = {
                success: true,
                data: {
                  value: trustpilotRatingsMap[providerId],
                  source: 'TrustpilotRatingsMap (providerId)',
                  lastUpdated: new Date(),
                  isFallback: false
                }
              };
              console.log(`Found rating using providerId: ${trustpilotRatingsMap[providerId]}`);
              return;
            }
            
            // Try with provider name if available
            const providerName = provider.name?.toLowerCase();
            if (providerName && trustpilotRatingsMap[providerName]) {
              localRatingsMap[providerId] = {
                success: true,
                data: {
                  value: trustpilotRatingsMap[providerName],
                  source: 'TrustpilotRatingsMap (name)',
                  lastUpdated: new Date(),
                  isFallback: false
                }
              };
              console.log(`Found rating using name: ${trustpilotRatingsMap[providerName]}`);
              return;
            }
            
            // Try a few common variations
            const variations = [
              providerCode,
              providerCode?.replace(/\-/g, ''),
              providerCode?.replace(/\s/g, ''),
              providerId?.replace('provider-', '')
            ].filter(Boolean);
            
            for (const variation of variations) {
              if (trustpilotRatingsMap[variation]) {
                localRatingsMap[providerId] = {
                  success: true,
                  data: {
                    value: trustpilotRatingsMap[variation],
                    source: `TrustpilotRatingsMap (variation: ${variation})`,
                    lastUpdated: new Date(),
                    isFallback: false
                  }
                };
                console.log(`Found rating using variation ${variation}: ${trustpilotRatingsMap[variation]}`);
                return;
              }
            }
            
            // Default ratings as fallback
            const defaultRatings = {
              'xe': 4.2,
              'torfx': 4.4,
              'pandaremit': 4.1,
              'regencyfx': 4.9,
              'profee': 4.4
            };
            
            // If still not found, try default ratings
            if (providerCode && defaultRatings[providerCode]) {
              localRatingsMap[providerId] = {
                success: true,
                data: {
                  value: defaultRatings[providerCode],
                  source: 'Default ratings map',
                  lastUpdated: new Date(),
                  isFallback: false
                }
              };
              console.log(`Using default rating for ${providerCode}: ${defaultRatings[providerCode]}`);
            } else {
              // Use a reasonable fallback rating
              localRatingsMap[providerId] = {
                success: true,
                data: {
                  value: 4.0,
                  source: 'Generic default rating',
                  lastUpdated: new Date(),
                  isFallback: true
                }
              };
              console.log(`Using generic default rating (4.0) for ${providerId}`);
            }
          } catch (error) {
            console.error(`Error setting rating for ${providerId}:`, error);
            // Use a reasonable default on error
            localRatingsMap[providerId] = {
              success: true,
              data: {
                value: 4.0,
                source: 'Error fallback',
                lastUpdated: new Date(),
                isFallback: true
              }
            };
          }
        });
        
        console.log('Final ratings map:', localRatingsMap);
        setTrustpilotRatings(localRatingsMap);
        setRatingsLoading(false);
      };

      generateRatings();
    }
  }, [providerResults]);
  
  const sortResults = (results, sortKey, direction) => {
    const sorted = [...results].sort((a, b) => {
      let comparison = 0;
      
      switch (sortKey) {
        case 'rate':
          // For exchange rate, higher is better (more destination currency per source currency)
          // Use effectiveRate which accounts for all fees in the actual rate calculation
          comparison = a.effectiveRate - b.effectiveRate;
          break;
        case 'fees':
          // For fees, lower is better (less fees means more money received)
          comparison = a.transferFee - b.transferFee;
          break;
        case 'amount':
          comparison = a.amountReceived - b.amountReceived;
          break;
        case 'rating':
          // Use finalDisplayedRatings which are the actual ratings shown on the cards
          const getDisplayedRating = (provider) => {
            const providerId = provider.providerId;
            
            // First check if we have a final displayed rating for this provider
            if (finalDisplayedRatings[providerId] !== undefined) {
              return finalDisplayedRatings[providerId];
            }
            
            // Next check if trustpilotRating exists and has a value property
            if (trustpilotRatings[providerId] && 
                typeof trustpilotRatings[providerId].value === 'number') {
              return trustpilotRatings[providerId].value;
            }
            
            // If no Trustpilot rating, use the provider's rating
            return provider.rating || 0;
          };
          
          // Get displayed ratings for both providers
          const aDisplayedRating = getDisplayedRating(a);
          const bDisplayedRating = getDisplayedRating(b);
          
          comparison = aDisplayedRating - bDisplayedRating;
          break;
        default:
          comparison = a.amountReceived - b.amountReceived;
      }
      
      return direction === 'asc' ? comparison : -comparison;
    });
    
    setProviderResults(sorted);
  };
  
  const toggleSortDirection = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };
  
  // Scroll to provider card when clicking best deal
  const scrollToProvider = (id) => {
    // Remove 'provider-' prefix if it's already present
    const cleanId = id.startsWith('provider-') ? id : `provider-${id}`;
    const element = document.getElementById(cleanId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };
  
  // Show loading state or error
  if (loading) {
    return (
      <div className="container mx-auto flex-1 px-4 sm:px-6 md:px-8 py-5 max-w-6xl">
        <div className="mb-4">
          <button 
            onClick={onBackToSearch}
            className="text-indigo-600 hover:text-indigo-800 flex items-center transition-colors font-medium group"
          >
            <div className="relative overflow-hidden mr-1">
              <ChevronLeft size={18} className="relative z-10" />
              <div className="absolute inset-0 bg-indigo-100 rounded-full scale-0 transition-transform group-hover:scale-100 opacity-0 group-hover:opacity-100"></div>
            </div>
            <span className="relative">
              Back to search
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-300 group-hover:w-full transition-all duration-200"></span>
            </span>
          </button>
        </div>
        
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 sm:px-6 md:px-8">
          {/* Simple loading state instead of animation since we use TransitionLoader */}
          <div className="text-center p-8">
            <div className="inline-block animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full mb-4"></div>
            <p className="text-gray-600">Loading comparison results...</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto flex-1 px-4 py-5 max-w-6xl">
        <div className="mb-4">
          <button 
            onClick={onBackToSearch}
            className="text-indigo-600 hover:text-indigo-800 flex items-center transition-colors font-medium"
          >
            <ChevronLeft size={18} className="mr-1" /> Back to search
          </button>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          <h3 className="font-bold mb-2">Error</h3>
          <p>{error}</p>
          <button 
            onClick={onBackToSearch}
            className="mt-3 px-4 py-2 bg-red-100 text-red-800 rounded-md hover:bg-red-200"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }
  
  // Callback function for ProviderCard to report back its displayed rating
  const handleRatingDetermined = (providerId, numericRating) => {
    if (providerId && numericRating !== undefined && numericRating !== null) {
      setFinalDisplayedRatings(prev => {
        // Only update if the rating is different to avoid unnecessary re-renders
        if (prev[providerId] !== numericRating) {
          return { ...prev, [providerId]: numericRating };
        }
        return prev;
      });
    }
  };

  return (
    <>
      {/* Custom animations */}
      <style jsx="true" global="true">{`
        @keyframes shimmer {
          0% {
            background-position: -100% 0;
          }
          100% {
            background-position: 100% 0;
          }
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite linear;
          background-size: 200% 100%;
        }
        
        @keyframes shimmer-bg {
          0% {
            background-position: 0% 50%;
          }
          100% {
            background-position: 100% 50%;
          }
        }
        .animate-shimmer-bg {
          background-size: 200% 200%;
          animation: shimmer-bg 1.5s ease infinite alternate;
          background-image: linear-gradient(
            60deg,
            rgba(159, 168, 218, 0.2) 0%,
            rgba(223, 229, 254, 0.4) 25%, 
            rgba(199, 210, 254, 0.2) 50%,
            rgba(165, 180, 252, 0.4) 75%,
            rgba(224, 231, 255, 0.2) 100%
          );
        }
        
        .metal-shimmer {
          position: relative;
          overflow: hidden;
        }
        
        .metal-shimmer::after {
          content: "";
          position: absolute;
          top: -100%;
          left: -100%;
          width: 50%;
          height: 300%;
          background: rgba(255, 255, 255, 0.2);
          transform: rotate(30deg);
          animation: card-shimmer 7s linear infinite;
        }
        
        @keyframes card-shimmer {
          0%, 10% {
            left: -100%;
          }
          35%, 100% {
            left: 200%;
          }
        }
        
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
        
        .gradient-bg {
          background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 50%, #c7d2fe 100%);
        }
        
        @keyframes progress {
          0% { width: 0%; }
          50% { width: 100%; }
          100% { width: 0%; }
        }
        
        @keyframes gradient-x {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }

        /* Extra small text size for mobile views */
        .text-2xs {
          font-size: 0.65rem;
          line-height: 1rem;
        }

        /* Ensure results content is visible by default, but can be hidden when needed */
        #results-content {
          opacity: 1;
          transition: opacity 300ms ease-in-out;
        }
        
        /* 2025 Modern Background Styling */
        .modern-background {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
          background: linear-gradient(120deg, #f9fafb 0%, #f3f4f6 100%);
          overflow: hidden;
        }
        
        .modern-background::before {
          content: "";
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle at center, transparent 60%, rgba(99, 102, 241, 0.03) 70%, rgba(224, 231, 255, 0.07) 100%);
          opacity: 0.7;
          animation: bg-pulse 15s ease-in-out infinite alternate;
        }
        
        .modern-background::after {
          content: "";
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%236366f1' fill-opacity='0.03' fill-rule='evenodd'/%3E%3C/svg%3E");
          opacity: 0.4;
        }
        
        .soft-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.35;
          z-index: -1;
        }
        
        .blob-1 {
          top: 10%;
          left: 10%;
          width: 40vw;
          height: 40vw;
          background: radial-gradient(circle at center, rgba(167, 139, 250, 0.15), rgba(99, 102, 241, 0.08));
          animation: blob-float 25s ease-in-out infinite alternate;
        }
        
        .blob-2 {
          bottom: 5%;
          right: 15%;
          width: 35vw;
          height: 35vw;
          background: radial-gradient(circle at center, rgba(124, 58, 237, 0.08), rgba(79, 70, 229, 0.06));
          animation: blob-float-reverse 30s ease-in-out infinite alternate;
        }
        
        .blob-3 {
          top: 40%;
          right: 30%;
          width: 25vw;
          height: 25vw;
          background: radial-gradient(circle at center, rgba(236, 72, 153, 0.05), rgba(244, 114, 182, 0.03));
          animation: blob-float-alt 18s ease-in-out infinite alternate;
        }
        
        @keyframes blob-float {
          0% {
            transform: translate(0, 0) scale(1);
          }
          100% {
            transform: translate(5%, 5%) scale(1.05);
          }
        }
        
        @keyframes blob-float-reverse {
          0% {
            transform: translate(0, 0) scale(1);
          }
          100% {
            transform: translate(-5%, -3%) scale(1.03);
          }
        }
        
        @keyframes blob-float-alt {
          0% {
            transform: translate(0, 0) scale(1);
          }
          100% {
            transform: translate(3%, -4%) scale(1.02);
          }
        }
        
        @keyframes bg-pulse {
          0% {
            opacity: 0.5;
            transform: scale(1);
          }
          100% {
            opacity: 0.8;
            transform: scale(1.1);
          }
        }
        
        .grid-pattern {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: 
            linear-gradient(to right, rgba(226, 232, 240, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(226, 232, 240, 0.1) 1px, transparent 1px);
          background-size: 40px 40px;
          opacity: 0.4;
        }
      `}</style>
      
      {/* Modern Background */}
      <div className="modern-background">
        <div className="soft-blob blob-1"></div>
        <div className="soft-blob blob-2"></div>
        <div className="soft-blob blob-3"></div>
        <div className="grid-pattern"></div>
      </div>
      
      <div id="results-content" className="container mx-auto flex-1 px-4 py-5 max-w-6xl" style={{ zIndex: 100, position: 'relative', opacity: 1 }}>
        <div className="mb-4">
          <button 
            onClick={onBackToSearch}
            className="text-indigo-600 hover:text-indigo-800 flex items-center transition-colors font-medium group"
          >
            <div className="relative overflow-hidden mr-1">
              <ChevronLeft size={18} className="relative z-10" />
              <div className="absolute inset-0 bg-indigo-100 rounded-full scale-0 transition-transform group-hover:scale-100 opacity-0 group-hover:opacity-100"></div>
            </div>
            <span className="relative">
              Back to search
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-300 group-hover:w-full transition-all duration-200"></span>
            </span>
          </button>
        </div>
        
        <div className="mb-5 bg-white/90 rounded-xl shadow-lg border border-indigo-50 p-4 sticky top-[calc(4rem+1px)] z-40 transition-all duration-300 backdrop-filter backdrop-blur-md hover:shadow-indigo-100/20">
          {/* Mobile view: Compact design */}
          <div className="sm:hidden">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-medium text-indigo-700">Transfer Summary</h3>
              <button 
                onClick={onBackToSearch}
                className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium hover:bg-indigo-100 transition-colors flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 mr-1"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                Edit
              </button>
            </div>
            
            <div className="flex justify-between items-center rounded-xl bg-gradient-to-r from-indigo-50/70 to-violet-50/70 p-3 border border-indigo-100/50">
              <div className="flex flex-col items-start">
                <span className="text-xs text-indigo-500 font-medium mb-1">You send</span>
                <div className="flex items-center">
                  <CurrencyFlag currency={fromCurrency} size="sm" className="mr-4" />
                  <span className={`font-semibold text-gray-800 ${formatAmount(amount).replace(/[,.]/g, '').length > 4 ? 'text-sm' : ''}`}>
                    {getCurrencySymbol(fromCurrency)} {formatAmount(amount)}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center mx-1">
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-indigo-100">
                  <ArrowRight size={14} className="text-indigo-600" />
                </div>
              </div>
              
              <div className="flex flex-col items-end">
                <span className="text-xs text-indigo-500 font-medium mb-1">They receive</span>
                <div className="flex items-center">
                  <CurrencyFlag currency={toCurrency} size="sm" className="mr-4" />
                  <span className={`font-semibold text-gray-800 ${bestDealProvider && formatAmount(bestDealProvider.amountReceived).replace(/[,.]/g, '').length > 4 ? 'text-sm' : ''}`}>
                    {bestDealProvider 
                      ? `${getCurrencySymbol(toCurrency)} ${formatAmount(bestDealProvider.amountReceived)}`
                      : `Loading...`
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Tablet/Desktop view: Enhanced layout */}
          <div className="hidden sm:block">
            <div className="flex justify-between items-center mb-1">
              <h3 className="text-sm font-medium text-indigo-700">Transfer Summary</h3>
              {bestDealProvider && (
                <div className="hidden md:flex items-center text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 mr-1"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
                  Best rate found
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-between lg:justify-center lg:relative">
              <div className="relative flex flex-row items-center justify-center md:mx-auto p-4 rounded-xl bg-gradient-to-r from-indigo-50/80 to-violet-50/80 border border-indigo-100/40">
                <div className="flex flex-col md:flex-row items-center space-x-8">
                  <div className="text-center md:text-left">
                    <div className="text-xs text-indigo-500 font-medium mb-1">You send</div>
                    <div className="flex items-center justify-center">
                      <CurrencyFlag currency={fromCurrency} size="md" className="mr-3" />
                      <span className="text-lg font-bold text-gray-800">
                        {getCurrencySymbol(fromCurrency)} {formatAmount(amount)}
                      </span>
                      <span className="ml-2 text-gray-500">{fromCurrency}</span>
                    </div>
                  </div>
                  
                  <div className="my-4 md:my-0 flex items-center justify-center">
                    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 shadow-sm">
                      <ArrowRight size={20} className="text-indigo-600" />
                    </div>
                  </div>
                  
                  <div className="text-center md:text-left">
                    <div className="text-xs text-indigo-500 font-medium mb-1">They receive</div>
                    <div className="flex items-center justify-center">
                      <CurrencyFlag currency={toCurrency} size="md" className="mr-3" />
                      <span className="text-lg font-bold text-gray-800">
                        {bestDealProvider 
                          ? `${getCurrencySymbol(toCurrency)} ${formatAmount(bestDealProvider.amountReceived)}`
                          : `Loading...`
                        }
                      </span>
                      <span className="ml-2 text-gray-500">{toCurrency}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={onBackToSearch}
                className="absolute right-4 sm:right-6 md:right-8 px-3 py-1.5 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors text-sm font-medium flex items-center shadow-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-1"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                Edit
              </button>
            </div>
            
            {/* Exchange rate info */}
            {bestDealProvider && (
              <div className="mt-3 text-sm text-center text-gray-600">
                <span className="font-medium">Mid-market rate:</span> 1 {fromCurrency} = {bestDealProvider.baseRate.toFixed(4)} {toCurrency}
              </div>
            )}
          </div>
        </div>
        
        {/* Best Deal Card - visual and clickable */}
        {bestDealProvider && (
          <div 
            onClick={() => scrollToProvider(bestDealProvider.providerId)}
            className="mb-5 rounded-lg shadow-sm border border-indigo-200 p-3 md:p-4 cursor-pointer hover:shadow-md transition-all metal-shimmer gradient-bg relative z-10"
          >
            <div className="flex flex-col md:flex-row items-center justify-between relative z-10">
              {/* Mobile-optimized header with award icon + title + button */}
              <div className="flex items-center justify-between w-full md:w-auto md:justify-start mb-2 md:mb-0">
                <div className="flex items-center">
                  <Award size={20} className="text-indigo-600 mr-1.5" />
                  <h3 className="font-bold text-indigo-800 text-base md:text-lg">Best Deal</h3>
                </div>
                
                {/* View Provider button moved up on mobile */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    scrollToProvider(bestDealProvider.providerId);
                  }}
                  className="text-xs bg-white px-2 py-1 md:px-3 md:py-1.5 rounded-md shadow-sm border border-indigo-100 text-indigo-700 font-medium flex items-center md:hidden"
                >
                  View
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </button>
              </div>
              
              {/* Compact mobile content section */}
              <div className="flex items-center justify-between w-full md:flex-row md:items-center md:justify-center md:flex-1 md:space-x-4">
                <div className="flex items-center">
                  <img 
                    src={bestDealProvider.providerLogo} 
                    alt={`${bestDealProvider.providerName} logo`} 
                    className="w-12 h-12 md:w-16 md:h-16 object-contain md:mb-0 md:mr-4"
                    onError={(e) => {
                      // Try to fix the path if it starts with "/"
                      if ((bestDealProvider.providerLogo || '').startsWith('/')) {
                        const imgSrc = bestDealProvider.providerLogo;
                        e.target.src = imgSrc.substring(1);
                      } else {
                        // Fall back to a direct provider logo based on provider name
                        const providerName = (bestDealProvider.providerName || '').toLowerCase();
                        if (providerName.includes('wise')) {
                          e.target.src = '/images/providers/wise.png';
                          // If that fails, try without the leading slash
                          e.target.onerror = () => { e.target.src = 'images/providers/wise.png'; };
                        } else if (providerName.includes('xe')) {
                          e.target.src = '/images/providers/xe.png';
                          // If that fails, try without the leading slash
                          e.target.onerror = () => { e.target.src = 'images/providers/xe.png'; };
                        } else if (providerName.includes('western') || providerName.includes('union')) {
                          e.target.src = '/images/providers/westernunion.png';
                          // If that fails, try without the leading slash
                          e.target.onerror = () => { e.target.src = 'images/providers/westernunion.png'; };
                        } else if (providerName.includes('torfx')) { // Add specific case for TorFX
                          e.target.src = '/images/providers/torfx.png';
                          // If that fails, try without the leading slash
                          e.target.onerror = () => { e.target.src = 'images/providers/torfx.png'; };
                        } else if (providerName.includes('panda') || providerName.includes('remit')) { // Add specific case for Panda Remit
                          e.target.src = '/images/providers/pandaremit.png';
                          // If that fails, try without the leading slash
                          e.target.onerror = () => { e.target.src = 'images/providers/pandaremit.png'; };
                        } else {
                          // Default fallback
                          e.target.src = '/images/providers/default.png';
                          // If that fails, try without the leading slash
                          e.target.onerror = () => { e.target.src = 'images/providers/default.png'; };
                        }
                      }
                    }}
                  />
                  {/* Provider name removed */}
                </div>
                
                <div className="flex-shrink-0 text-right md:text-center ml-2 md:ml-0 md:mx-auto">
                  <div className="text-2xs md:text-xs uppercase font-medium text-indigo-600 mb-0 md:mb-1">They receive</div>
                  <div className="text-lg md:text-2xl font-bold">
                    <span className="text-shimmer">
                      {getCurrencySymbol(toCurrency)} {formatAmount(bestDealProvider.amountReceived)}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Desktop-only button (hidden on mobile) */}
              <button 
                onClick={() => scrollToProvider(bestDealProvider.providerId)}
                className="hidden md:flex text-xs bg-white px-3 py-1.5 rounded-md shadow-sm border border-indigo-100 text-indigo-700 font-medium items-center mt-3 md:mt-0"
              >
                View Provider
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              </button>
            </div>
          </div>
        )}
        
        {/* Guide Recommendation - below best deal and above filters */}
        <GuideRecommendation 
          fromCurrency={fromCurrency} 
          toCurrency={toCurrency} 
          amount={amount} 
        />
        
        {/* Improved Filter & Sort Bar - 2025 UI/UX Design */}
        <div className="mb-5 relative z-10">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 sm:px-5">
              {/* Desktop Layout */}
              <div className="hidden md:flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <SlidersHorizontal size={18} className="text-indigo-500" />
                  <span className="font-medium text-gray-700">Sort results by</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => {
                      setSortBy('amount');
                      setSortDirection(sortBy === 'amount' && sortDirection === 'desc' ? 'asc' : 'desc');
                    }}
                    className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition-all ${
                      sortBy === 'amount' 
                        ? 'bg-indigo-50 text-indigo-700 font-medium shadow-sm' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    Amount
                    {sortBy === 'amount' && (
                      <span className="ml-1">
                        {sortDirection === 'desc' ? (
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m19 9-7 7-7-7"/></svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 15 7-7 7 7"/></svg>
                        )}
                      </span>
                    )}
                  </button>
                  
                  <button 
                    onClick={() => {
                      setSortBy('rate');
                      setSortDirection(sortBy === 'rate' && sortDirection === 'desc' ? 'asc' : 'desc');
                    }}
                    className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition-all ${
                      sortBy === 'rate' 
                        ? 'bg-indigo-50 text-indigo-700 font-medium shadow-sm' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    Rate
                    {sortBy === 'rate' && (
                      <span className="ml-1">
                        {sortDirection === 'desc' ? (
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m19 9-7 7-7-7"/></svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 15 7-7 7 7"/></svg>
                        )}
                      </span>
                    )}
                  </button>
                  
                  <button 
                    onClick={() => {
                      setSortBy('fees');
                      setSortDirection(sortBy === 'fees' && sortDirection === 'asc' ? 'desc' : 'asc');
                    }}
                    className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition-all ${
                      sortBy === 'fees' 
                        ? 'bg-indigo-50 text-indigo-700 font-medium shadow-sm' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    Fees
                    {sortBy === 'fees' && (
                      <span className="ml-1">
                        {sortDirection === 'asc' ? (
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m19 9-7 7-7-7"/></svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 15 7-7 7 7"/></svg>
                        )}
                      </span>
                    )}
                  </button>
                  
                  <button 
                    onClick={() => {
                      setSortBy('rating');
                      setSortDirection(sortBy === 'rating' && sortDirection === 'desc' ? 'asc' : 'desc');
                    }}
                    className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition-all ${
                      sortBy === 'rating' 
                        ? 'bg-indigo-50 text-indigo-700 font-medium shadow-sm' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    Rating
                    {sortBy === 'rating' && (
                      <span className="ml-1">
                        {sortDirection === 'desc' ? (
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m19 9-7 7-7-7"/></svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 15 7-7 7 7"/></svg>
                        )}
                      </span>
                    )}
                  </button>
                </div>
                
                <div className="text-sm text-gray-500 flex items-center gap-1">
                  <span className="hidden lg:inline">Currently sorting by:</span>
                  <span className="text-indigo-600 font-medium">
                    {sortBy === 'rate' ? 'Exchange Rate' : sortBy === 'amount' ? 'Amount Received' : sortBy === 'fees' ? 'Fees' : 'User Rating'}
                  </span>
                  <span className="text-gray-400">
                    ({sortDirection === 'desc' ? 'Highest first' : 'Lowest first'})
                  </span>
                </div>
              </div>
              
              {/* Mobile Layout with Dropdown */}
              <div className="md:hidden">
                <div 
                  className="flex justify-between items-center w-full"
                  onClick={() => setShowSortOptions(!showSortOptions)}
                >
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal size={16} className="text-indigo-500" />
                    <span className="font-medium text-gray-700 text-sm">Sort by</span>
                  </div>
                  
                  <div className="flex items-center gap-1.5">
                    <span className="text-indigo-600 font-medium text-sm">
                      {sortBy === 'rate' ? 'Rate' : sortBy === 'amount' ? 'Amount' : sortBy === 'fees' ? 'Fees' : 'Rating'}
                    </span>
                    <span className="text-gray-500 text-xs">
                      ({sortDirection === 'desc' ? 'High→Low' : 'Low→High'})
                    </span>
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="16" 
                      height="16" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      className={`transition-transform duration-200 ${showSortOptions ? 'rotate-180' : ''}`}
                    >
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </div>
                </div>
                
                {/* Mobile Dropdown */}
                {showSortOptions && (
                  <div className="mt-3 transition-all animate-in fade-in slide-in-from-top-5 duration-200">
                    <div className="rounded-lg bg-gray-50 divide-y divide-gray-100">
                      <button 
                        onClick={() => {
                          setSortBy('amount');
                          setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc');
                          setShowSortOptions(false);
                        }}
                        className={`w-full px-4 py-3 text-left text-sm flex justify-between items-center transition-colors ${sortBy === 'amount' ? 'text-indigo-700 font-medium' : 'text-gray-700'}`}
                      >
                        Amount Received
                        {sortBy === 'amount' && (
                          <span className="flex items-center text-indigo-600">
                            {sortDirection === 'desc' ? 'Highest first' : 'Lowest first'}
                          </span>
                        )}
                      </button>
                      
                      <button 
                        onClick={() => {
                          setSortBy('rate');
                          setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc');
                          setShowSortOptions(false);
                        }}
                        className={`w-full px-4 py-3 text-left text-sm flex justify-between items-center transition-colors ${sortBy === 'rate' ? 'text-indigo-700 font-medium' : 'text-gray-700'}`}
                      >
                        Exchange Rate
                        {sortBy === 'rate' && (
                          <span className="flex items-center text-indigo-600">
                            {sortDirection === 'desc' ? 'Highest first' : 'Lowest first'}
                          </span>
                        )}
                      </button>
                      
                      <button 
                        onClick={() => {
                          setSortBy('fees');
                          setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                          setShowSortOptions(false);
                        }}
                        className={`w-full px-4 py-3 text-left text-sm flex justify-between items-center transition-colors ${sortBy === 'fees' ? 'text-indigo-700 font-medium' : 'text-gray-700'}`}
                      >
                        Fees
                        {sortBy === 'fees' && (
                          <span className="flex items-center text-indigo-600">
                            {sortDirection === 'asc' ? 'Lowest first' : 'Highest first'}
                          </span>
                        )}
                      </button>
                      
                      <button 
                        onClick={() => {
                          setSortBy('rating');
                          setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc');
                          setShowSortOptions(false);
                        }}
                        className={`w-full px-4 py-3 text-left text-sm flex justify-between items-center transition-colors ${sortBy === 'rating' ? 'text-indigo-700 font-medium' : 'text-gray-700'}`}
                      >
                        User Rating
                        {sortBy === 'rating' && (
                          <span className="flex items-center text-indigo-600">
                            {sortDirection === 'desc' ? 'Highest first' : 'Lowest first'}
                          </span>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Provider Cards */}
        <div className="space-y-4">
          {providerResults.map((provider) => (
            <ProviderCard
              key={provider.providerId}
              id={provider.providerId}
              provider={provider}
              name={provider.providerName}
              logo={provider.providerLogo}
              fromCurrency={fromCurrency}
              toCurrency={toCurrency}
              amount={amount}
              rate={provider.effectiveRate}
              sendAmount={amount}
              receiveAmount={provider.amountReceived}
              fee={provider.transferFee}
              marginCost={provider.marginCost}
              totalCost={provider.totalCost}
              timeHours={provider.transferTimeHours}
              transferTime={provider.transferTime}
              rating={provider.rating}
              isBestDeal={provider.providerId === bestDealProvider?.providerId}
              isRealTimeApi={provider.realTimeApi}
              code={provider.providerCode}
              trustpilotRating={trustpilotRatings[provider.providerId]}
              ratingsLoading={ratingsLoading}
              onRatingDetermined={(numericRating) => handleRatingDetermined(provider.providerId, numericRating)}
            />
          ))}
          
          {providerResults.length === 0 && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
              <h3 className="font-medium text-gray-700 mb-2">No results found</h3>
              <p className="text-gray-500">We couldn't find any providers for this currency pair. Please try a different currency pair.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default ResultsView; 