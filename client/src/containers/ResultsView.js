import React, { useState, useEffect } from 'react';
import { ArrowUpDown, ChevronLeft, SlidersHorizontal, ArrowRight, Award } from 'lucide-react';
import ProviderCard from '../components/ui/ProviderCard';
import CurrencyFlag from '../components/ui/CurrencyFlag';
import { formatAmount, getCurrencySymbol } from '../utils/currency';
import apiService from '../services/apiService';

/**
 * Container for displaying money transfer comparison results
 */
const ResultsView = ({ searchData, onBackToSearch }) => {
  const { fromCurrency, toCurrency, amount } = searchData;
  const [sortBy, setSortBy] = useState('amount');
  const [sortDirection, setSortDirection] = useState('desc');
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showLoadingAnimation, setShowLoadingAnimation] = useState(true);
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
    // Major pairs (USD, EUR, GBP, AUD, CAD, SGD, JPY, CNY, HKD, CHF, NZD)
    const pandaMajorCurrencies = ['USD', 'EUR', 'GBP', 'AUD', 'CAD', 'SGD', 'JPY', 'CNY', 'HKD', 'CHF', 'NZD'];
    if (pandaMajorCurrencies.includes(fromCurr) && pandaMajorCurrencies.includes(toCurr)) {
      return 0.005; // 0.5%
    }
    
    // Special pairs with major sending currencies to specific receiving currencies
    const pandaSendingMajor = ['USD', 'EUR', 'GBP', 'AUD', 'CAD'];
    const pandaReceivingSpecial = ['INR', 'PHP', 'THB', 'IDR', 'VND', 'MYR', 'PKR', 'NGN', 'ZAR', 'BRL', 'MXN', 'PLN', 'SEK', 'NOK', 'DKK', 'HUF', 'CZK', 'ILS', 'KRW', 'HKD', 'CNY', 'CLP', 'COP', 'SAR', 'AED', 'QAR', 'KWD', 'RON', 'BGN', 'EGP', 'ARS'];
    
    if ((pandaSendingMajor.includes(fromCurr) && pandaReceivingSpecial.includes(toCurr)) || 
        (pandaReceivingSpecial.includes(fromCurr) && pandaSendingMajor.includes(toCurr))) {
      return 0.0085; // Average of 0.7% to 1.0% = 0.85%
    }
    
    // Exotic pairs
    const pandaExoticCurrencies = ['NGN', 'KWD', 'QAR', 'ARS', 'EGP', 'IDR', 'CLP', 'COP', 'RUB', 'BRL', 'TRY'];
    if (pandaExoticCurrencies.includes(fromCurr) || pandaExoticCurrencies.includes(toCurr)) {
      return 0.0125; // Average of 1.0% to 1.5% = 1.25%
    }
    
    // Default fallback
    return 0.01; // 1.0% as default
  };
  
  // Function to determine Panda Remit fee based on currency
  const getPandaRemitFee = (amount, currency) => {
    // Fee of $6.99 or equivalent in other currencies
    switch(currency) {
      case 'USD':
        return 6.99;
      case 'EUR':
        return 6.99; // Assuming 1:1 for simplicity
      case 'GBP':
        return 6.99; // Assuming 1:1 for simplicity
      default:
        // For other currencies, use USD equivalent
        return 6.99;
    }
  };
  
  // Function to determine Panda Remit delivery time based on currency pair
  const getPandaRemitDeliveryTime = (fromCurr, toCurr) => {
    // Major pairs (USD, EUR, GBP, AUD, CAD, SGD, JPY, CNY, HKD, CHF, NZD)
    const pandaMajorCurrencies = ['USD', 'EUR', 'GBP', 'AUD', 'CAD', 'SGD', 'JPY', 'CNY', 'HKD', 'CHF', 'NZD'];
    if (pandaMajorCurrencies.includes(fromCurr) && pandaMajorCurrencies.includes(toCurr)) {
      return {
        text: 'Instant to a few hours',
        hours: { min: 0, max: 5 }
      };
    }
    
    // All other pairs
    return {
      text: 'Minutes to 1 business day',
      hours: { min: 0, max: 24 }
    };
  };
  
  // Function to determine XE markup based on currency pair
  const getXEMarkup = (fromCurr, toCurr) => {
    // If both currencies are major, use 0.7%
    if (majorCurrencies.includes(fromCurr) && majorCurrencies.includes(toCurr)) {
      return 0.007;
    }
    
    // If either currency is in tier2 list but not in exotic, use 1.7%
    if ((majorCurrencies.includes(fromCurr) && tier2Currencies.includes(toCurr)) || 
        (tier2Currencies.includes(fromCurr) && majorCurrencies.includes(toCurr)) ||
        (tier2Currencies.includes(fromCurr) && tier2Currencies.includes(toCurr))) {
      // Check if one of the currencies is exotic, then use 2.2%
      if (exoticCurrencies.includes(fromCurr) || exoticCurrencies.includes(toCurr)) {
        return 0.022;
      }
      return 0.017;
    }
    
    // Default to exotic rate 2.2%
    return 0.022;
  };
  
  // Function to determine Profee markup based on currency pair
  const getProfeeMarkup = (fromCurr, toCurr) => {
    // Major pairs (EUR, USD, GBP, PLN, CZK, HUF, RUB, TRY)
    const majorPairs = ['EUR', 'USD', 'GBP', 'PLN', 'CZK', 'HUF', 'RUB', 'TRY'];
    if (majorPairs.includes(fromCurr) && majorPairs.includes(toCurr)) {
      return 0.007; // 0.7%
    }
    
    // Tier 2 pairs (INR, ZAR, MXN, etc.)
    const tier2Pairs = ['INR', 'ZAR', 'MXN', 'PLN', 'SEK', 'NOK', 'DKK', 'HUF', 'CZK', 'ILS', 'TRY', 'THB', 'PHP', 'MYR', 'RON', 'BGN', 'KRW', 'HKD', 'CNY', 'CLP', 'COP', 'SAR', 'AED', 'QAR', 'KWD', 'NGN', 'BRL', 'RUB', 'ARS', 'EGP', 'IDR'];
    if ((majorPairs.includes(fromCurr) && tier2Pairs.includes(toCurr)) || 
        (tier2Pairs.includes(fromCurr) && majorPairs.includes(toCurr)) ||
        (tier2Pairs.includes(fromCurr) && tier2Pairs.includes(toCurr))) {
      return 0.012; // 1.2%
    }
    
    // Exotic pairs
    return 0.017; // 1.7%
  };
  
  // Function to determine XE fee based on amount
  const getXEFee = (amt, currency) => {
    // Free above $500 equivalent
    if (amt >= 500) {
      return 0;
    }
    
    // Otherwise between 0-2.00 in the respective currency
    switch(currency) {
      case 'USD':
        return 2.00;
      case 'EUR':
        return 2.00;
      case 'GBP':
        return 2.00;
      default:
        // For other currencies, use USD equivalent
        return 2.00;
    }
  };
  
  // Function to determine Profee fee based on amount
  const getProfeeFee = (amt, currency) => {
    // Free above €100 equivalent
    if (amt >= 100) {
      return 0;
    }
    
    // Otherwise between 0-1.00 in the respective currency
    switch(currency) {
      case 'USD':
        return 1.00;
      case 'EUR':
        return 1.00;
      case 'GBP':
        return 1.00;
      default:
        // For other currencies, use EUR equivalent
        return 1.00;
    }
  };
  
  // Function to determine XE delivery time based on currency pair
  const getXEDeliveryTime = (fromCurr, toCurr) => {
    // Major pairs: Same day to 1 business day
    if (majorCurrencies.includes(fromCurr) && majorCurrencies.includes(toCurr)) {
      return {
        text: 'Same day to 1 business day',
        hours: { min: 0, max: 24 }
      };
    }
    
    // Tier 2 currencies: 1-2 business days
    if ((majorCurrencies.includes(fromCurr) && tier2Currencies.includes(toCurr)) || 
        (tier2Currencies.includes(fromCurr) && majorCurrencies.includes(toCurr)) ||
        (tier2Currencies.includes(fromCurr) && tier2Currencies.includes(toCurr))) {
      // Exotic currencies: 1-3 business days
      if (exoticCurrencies.includes(fromCurr) || exoticCurrencies.includes(toCurr)) {
        return {
          text: '1-3 business days',
          hours: { min: 24, max: 72 }
        };
      }
      return {
        text: '1-2 business days',
        hours: { min: 24, max: 48 }
      };
    }
    
    // Default to exotic timing
    return {
      text: '1-3 business days',
      hours: { min: 24, max: 72 }
    };
  };
  
  // Function to determine Profee delivery time based on currency pair
  const getProfeeDeliveryTime = (fromCurr, toCurr) => {
    // Major pairs: Instant to 1 business day
    const majorPairs = ['EUR', 'USD', 'GBP', 'PLN', 'CZK', 'HUF', 'RUB', 'TRY'];
    if (majorPairs.includes(fromCurr) && majorPairs.includes(toCurr)) {
      return {
        text: 'Instant to 1 business day',
        hours: { min: 0, max: 24 }
      };
    }
    
    // Tier 2 pairs: 1-2 business days
    const tier2Pairs = ['INR', 'ZAR', 'MXN', 'PLN', 'SEK', 'NOK', 'DKK', 'HUF', 'CZK', 'ILS', 'TRY', 'THB', 'PHP', 'MYR', 'RON', 'BGN', 'KRW', 'HKD', 'CNY', 'CLP', 'COP', 'SAR', 'AED', 'QAR', 'KWD', 'NGN', 'BRL', 'RUB', 'ARS', 'EGP', 'IDR'];
    if ((majorPairs.includes(fromCurr) && tier2Pairs.includes(toCurr)) || 
        (tier2Pairs.includes(fromCurr) && majorPairs.includes(toCurr)) ||
        (tier2Pairs.includes(fromCurr) && tier2Pairs.includes(toCurr))) {
      return {
        text: '1-2 business days',
        hours: { min: 24, max: 48 }
      };
    }
    
    // Default to exotic timing
    return {
      text: '1-3 business days',
      hours: { min: 24, max: 72 }
    };
  };
  
  // Function to determine Torfx markup based on currency pair
  const getTorfxMarkup = (fromCurr, toCurr) => {
    // Major pairs (USD, EUR, GBP, AUD, CAD, NZD, CHF, JPY, SGD)
    const majorPairs = ['USD', 'EUR', 'GBP', 'AUD', 'CAD', 'NZD', 'CHF', 'JPY', 'SGD'];
    if (majorPairs.includes(fromCurr) && majorPairs.includes(toCurr)) {
      return 0.004; // 0.4%
    }
    
    // Tier 2 pairs (INR, ZAR, MXN, etc.)
    const tier2Pairs = ['INR', 'ZAR', 'MXN', 'PLN', 'SEK', 'NOK', 'DKK', 'HUF', 'CZK', 'ILS', 'TRY', 'THB', 'PHP', 'MYR', 'RON', 'BGN', 'KRW', 'HKD', 'CNY', 'CLP', 'COP', 'SAR', 'AED', 'QAR', 'KWD', 'NGN', 'BRL', 'RUB', 'ARS', 'EGP', 'IDR'];
    if ((majorPairs.includes(fromCurr) && tier2Pairs.includes(toCurr)) || 
        (tier2Pairs.includes(fromCurr) && majorPairs.includes(toCurr)) ||
        (tier2Pairs.includes(fromCurr) && tier2Pairs.includes(toCurr))) {
      return 0.008; // 0.8%
    }
    
    // Exotic pairs
    return 0.012; // 1.2%
  };

  // Function to determine Torfx fee based on amount
  const getTorfxFee = (amount, currency) => {
    // Torfx typically has no transfer fee
    return 0;
  };

  // Function to determine Torfx delivery time based on currency pair
  const getTorfxDeliveryTime = (fromCurr, toCurr) => {
    // Major pairs: 1-2 business days
    const majorPairs = ['USD', 'EUR', 'GBP', 'AUD', 'CAD', 'NZD', 'CHF', 'JPY', 'SGD'];
    if (majorPairs.includes(fromCurr) && majorPairs.includes(toCurr)) {
      return {
        text: '1-2 business days',
        hours: { min: 24, max: 48 }
      };
    }
    
    // Tier 2 pairs: 2-3 business days
    const tier2Pairs = ['INR', 'ZAR', 'MXN', 'PLN', 'SEK', 'NOK', 'DKK', 'HUF', 'CZK', 'ILS', 'TRY', 'THB', 'PHP', 'MYR', 'RON', 'BGN', 'KRW', 'HKD', 'CNY', 'CLP', 'COP', 'SAR', 'AED', 'QAR', 'KWD', 'NGN', 'BRL', 'RUB', 'ARS', 'EGP', 'IDR'];
    if ((majorPairs.includes(fromCurr) && tier2Pairs.includes(toCurr)) || 
        (tier2Pairs.includes(fromCurr) && majorPairs.includes(toCurr)) ||
        (tier2Pairs.includes(fromCurr) && tier2Pairs.includes(toCurr))) {
      return {
        text: '2-3 business days',
        hours: { min: 48, max: 72 }
      };
    }
    
    // Default to exotic timing
    return {
      text: '2-4 business days',
      hours: { min: 48, max: 96 }
    };
  };
  
  // Fetch data from API on component mount or when search parameters change
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        console.log('Fetching exchange rates for:', { fromCurrency, toCurrency, amount });
        
        // Fetch providers and exchange rates from Wise v3 comparisons API
        try {
          console.log('Fetching data from Wise v3 comparison API');
          
          // First try accessing through our backend proxy
          let comparisonData = null;
          
          try {
            const comparisonResponse = await apiService.getWiseComparison(
              fromCurrency, 
              toCurrency, 
              amount,
              // Get source country based on currency if needed
              fromCurrency === 'GBP' ? 'GB' : null,
              toCurrency === 'EUR' ? 'DE' : null
            );
            
            if (comparisonResponse.data && comparisonResponse.data.success) {
              comparisonData = comparisonResponse.data.data;
              console.log('Wise Comparison Data from backend:', comparisonData);
            }
          } catch (backendError) {
            console.error('Error fetching from backend, trying direct API:', backendError);
            // If backend proxy fails, try direct API call as fallback
            try {
              const directResponse = await apiService.getWiseV3Comparison(
                fromCurrency,
                toCurrency,
                amount
              );
              
              if (directResponse.data) {
                comparisonData = directResponse.data;
                console.log('Wise Comparison Data from direct API:', comparisonData);
              }
            } catch (directError) {
              console.error('Error fetching from direct API:', directError);
              throw new Error('Failed to fetch comparison data from both backend and direct API');
            }
          }
          
          if (comparisonData && comparisonData.providers) {
            const allProviders = comparisonData.providers;
            console.log(`Found ${allProviders.length} providers from comparison API`);
                        // Process all providers from comparison API
            const providers = allProviders
              .filter(p => p.quotes && p.quotes.length > 0)
              // Filter out TorFX from API results since we'll add our own calculated version
              .filter(p => {
                const providerAlias = (p.alias || '').toLowerCase();
                const providerName = (p.name || '').toLowerCase();
                return !(providerAlias === 'torfx' || providerName.includes('torfx'));
              })
              .map(provider => {
                // Find the best quote for this provider
                const quote = provider.quotes.reduce((best, current) => 
                  (current.receivedAmount > best.receivedAmount) ? current : best, provider.quotes[0]);
                
                // Find or calculate markup
                const markup = quote.markup !== undefined ? quote.markup : 0;
                
                // Extract delivery time if available
                let transferTime = 'Unknown';
                let transferTimeHours = { min: 24, max: 72 };
                let hasExplicitDeliveryTime = false;
                
                if (quote.estimatedDelivery) {
                  transferTime = quote.estimatedDelivery;
                  hasExplicitDeliveryTime = true;
                  
                  // Try to estimate hours from the delivery time text
                  if (transferTime.includes('hour')) {
                    const hourMatch = transferTime.match(/(\d+).*?hour/);
                    if (hourMatch && hourMatch[1]) {
                      const hours = parseInt(hourMatch[1]);
                      transferTimeHours = { min: hours, max: hours };
                    }
                  } else if (transferTime.includes('day')) {
                    const dayMatch = transferTime.match(/(\d+).*?day/);
                    if (dayMatch && dayMatch[1]) {
                      const days = parseInt(dayMatch[1]);
                      transferTimeHours = { min: days * 24, max: days * 24 };
                    }
                  }
                }
                
                // Determine logo path - no special override needed anymore since we filter TorFX separately
                let logoUrl = provider.logos?.normal?.svgUrl || provider.logos?.normal?.pngUrl || provider.logo;
                
                // If provider doesn't have explicit delivery time data, use XE's delivery time
                // Exclude providers that have their own delivery time (Profee, XE, TorFX, etc. are already excluded or have their own)
                if (!hasExplicitDeliveryTime) {
                  const providerAlias = (provider.alias || '').toLowerCase();
                  const providerName = (provider.name || '').toLowerCase();
                  
                  // Check if this is a provider we should apply XE delivery time to
                  if (!providerName.includes('profee') && !providerAlias.includes('profee') && 
                      !providerName.includes('xe') && !providerAlias.includes('xe') && 
                      !providerName.includes('torfx') && !providerAlias.includes('torfx') && 
                      !providerName.includes('panda') && !providerAlias.includes('panda')) {
                    // Apply XE delivery time
                    const xeDeliveryTime = getXEDeliveryTime(fromCurrency, toCurrency);
                    transferTime = xeDeliveryTime.text;
                    transferTimeHours = xeDeliveryTime.hours;
                  }
                }
                
                // Basic provider object from comparison API data
                return {
                  providerId: `provider-${provider.id}`,
                  providerCode: provider.alias,
                  providerName: provider.name,
                  providerLogo: logoUrl,
                  baseRate: quote.rate,
                  effectiveRate: quote.rate,
                  transferFee: quote.fee || 0,
                  marginPercentage: markup * 100,
                  marginCost: parseFloat(amount) * quote.rate * markup,
                  totalCost: (quote.fee || 0) + (parseFloat(amount) * quote.rate * markup),
                  amountReceived: quote.receivedAmount,
                  sourceCountry: quote.sourceCountry,
                  targetCountry: quote.targetCountry,
                  transferTimeHours,
                  transferTime,
                  rating: 4.0, // Default rating when not available
                  methods: ['bank_transfer'],
                  realTimeApi: true,
                  timestamp: new Date().toISOString()
                };
              });
            
            console.log('Processed providers:', providers.length);
            
            // Find Wise provider to get mid-market rate
            const wiseProvider = providers.find(p => 
              p.providerCode?.toLowerCase() === 'wise' || 
              p.providerName?.toLowerCase()?.includes('wise'));
            
            // If Wise provider found, use its rate as mid-market rate
            let midMarketRate = null;
            if (wiseProvider) {
              midMarketRate = wiseProvider.effectiveRate;
              console.log('Found mid-market rate from Wise:', midMarketRate);
              
              // Also ensure the Wise provider itself has zero margin
              wiseProvider.marginPercentage = 0;
              wiseProvider.marginCost = 0;
              wiseProvider.totalCost = wiseProvider.transferFee;
            }
            
            // For other providers, adjust their margin calculations
            // based on the mid-market rate if available
            if (midMarketRate) {
              providers.forEach(provider => {
                // Skip Wise itself
                if (provider !== wiseProvider) {
                  provider.baseRate = midMarketRate;
                  
                  // Calculate margin as the difference between mid-market and effective rate
                  if (provider.baseRate > 0) {
                    // Use markup from quote if available, otherwise calculate
                    if (provider.marginPercentage === 0) {
                      provider.marginPercentage = ((provider.baseRate - provider.effectiveRate) / provider.baseRate) * 100;
                      provider.marginCost = parseFloat(amount) * (provider.baseRate - provider.effectiveRate);
                      provider.totalCost = provider.transferFee + provider.marginCost;
                    }
                  }
                }
              });
              
              // Add XE as a provider using the mid-market rate and our markup matrix
              // Only add if we have a valid mid-market rate
              const xeMarkupPercentage = getXEMarkup(fromCurrency, toCurrency);
              const xeFee = getXEFee(amount, fromCurrency);
              const xeDeliveryTime = getXEDeliveryTime(fromCurrency, toCurrency);
              
              // Calculate XE's effective rate using the markup
              const xeEffectiveRate = midMarketRate * (1 - xeMarkupPercentage);
              
              // Calculate amount received (amount converted at effective rate minus the fee)
              const xeAmountBeforeFee = parseFloat(amount) * xeEffectiveRate;
              const xeAmountReceived = xeAmountBeforeFee - (xeFee * xeEffectiveRate); // Convert fee to target currency
              
              // Calculate margin cost
              const xeMarginCost = parseFloat(amount) * (midMarketRate - xeEffectiveRate);
              
              // Create XE provider object
              const xeProvider = {
                providerId: 'provider-xe',
                providerCode: 'xe',
                providerName: 'XE Money Transfer',
                providerLogo: '/images/providers/xe.webp',
                baseRate: midMarketRate,
                effectiveRate: xeEffectiveRate,
                transferFee: xeFee,
                marginPercentage: xeMarkupPercentage * 100,
                marginCost: xeMarginCost,
                totalCost: xeFee + xeMarginCost,
                amountReceived: xeAmountReceived > 0 ? xeAmountReceived : 0, // Ensure amount is not negative
                sourceCountry: fromCurrency === 'GBP' ? 'GB' : fromCurrency === 'USD' ? 'US' : fromCurrency === 'EUR' ? 'EU' : null,
                targetCountry: toCurrency === 'GBP' ? 'GB' : toCurrency === 'USD' ? 'US' : toCurrency === 'EUR' ? 'EU' : null,
                transferTimeHours: xeDeliveryTime.hours,
                transferTime: xeDeliveryTime.text,
                rating: 4.5, // Default XE rating
                methods: ['bank_transfer'],
                realTimeApi: false, // Not from real-time API
                timestamp: new Date().toISOString()
              };
              
              // Add XE to providers array
              providers.push(xeProvider);
              console.log('Added XE as a provider with markup:', xeMarkupPercentage * 100 + '%');

              // Add Profee as a provider using the mid-market rate and our markup matrix
              const profeeMarkupPercentage = getProfeeMarkup(fromCurrency, toCurrency);
              const profeeFee = getProfeeFee(amount, fromCurrency);
              const profeeDeliveryTime = getProfeeDeliveryTime(fromCurrency, toCurrency);
              
              // Calculate Profee's effective rate using the markup
              const profeeEffectiveRate = midMarketRate * (1 - profeeMarkupPercentage);
              
              // Calculate amount received (amount converted at effective rate minus the fee)
              const profeeAmountBeforeFee = parseFloat(amount) * profeeEffectiveRate;
              const profeeAmountReceived = profeeAmountBeforeFee - (profeeFee * profeeEffectiveRate); // Convert fee to target currency
              
              // Calculate margin cost
              const profeeMarginCost = parseFloat(amount) * (midMarketRate - profeeEffectiveRate);
              
              // Create Profee provider object
              const profeeProvider = {
                providerId: 'provider-profee',
                providerCode: 'profee',
                providerName: 'Profee',
                providerLogo: '/images/providers/profee.svg',
                baseRate: midMarketRate,
                effectiveRate: profeeEffectiveRate,
                transferFee: profeeFee,
                marginPercentage: profeeMarkupPercentage * 100,
                marginCost: profeeMarginCost,
                totalCost: profeeFee + profeeMarginCost,
                amountReceived: profeeAmountReceived > 0 ? profeeAmountReceived : 0, // Ensure amount is not negative
                sourceCountry: fromCurrency === 'GBP' ? 'GB' : fromCurrency === 'USD' ? 'US' : fromCurrency === 'EUR' ? 'EU' : null,
                targetCountry: toCurrency === 'GBP' ? 'GB' : toCurrency === 'USD' ? 'US' : toCurrency === 'EUR' ? 'EU' : null,
                transferTimeHours: profeeDeliveryTime.hours,
                transferTime: profeeDeliveryTime.text,
                rating: 4.3, // Default Profee rating
                methods: ['bank_transfer'],
                realTimeApi: false, // Not from real-time API
                timestamp: new Date().toISOString()
              };
              
              // Add Profee to providers array
              providers.push(profeeProvider);
              console.log('Added Profee as a provider with markup:', profeeMarkupPercentage * 100 + '%');

              // Add TorFX as a provider using the mid-market rate and our markup matrix
              const torfxMarkupPercentage = getTorfxMarkup(fromCurrency, toCurrency);
              const torfxFee = getTorfxFee(amount, fromCurrency);
              const torfxDeliveryTime = getTorfxDeliveryTime(fromCurrency, toCurrency);
              
              // Calculate TorFX's effective rate using the markup
              const torfxEffectiveRate = midMarketRate * (1 - torfxMarkupPercentage);
              
              // Calculate amount received (amount converted at effective rate minus the fee)
              const torfxAmountBeforeFee = parseFloat(amount) * torfxEffectiveRate;
              const torfxAmountReceived = torfxAmountBeforeFee - (torfxFee * torfxEffectiveRate); // Convert fee to target currency
              
              // Calculate margin cost
              const torfxMarginCost = parseFloat(amount) * (midMarketRate - torfxEffectiveRate);
              
              // Create TorFX provider object
              const torfxProvider = {
                providerId: 'provider-torfx',
                providerCode: 'torfx',
                providerName: 'TorFX',
                providerLogo: '/images/providers/torfx.png',
                baseRate: midMarketRate,
                effectiveRate: torfxEffectiveRate,
                transferFee: torfxFee,
                marginPercentage: torfxMarkupPercentage * 100,
                marginCost: torfxMarginCost,
                totalCost: torfxFee + torfxMarginCost,
                amountReceived: torfxAmountReceived > 0 ? torfxAmountReceived : 0, // Ensure amount is not negative
                sourceCountry: fromCurrency === 'GBP' ? 'GB' : fromCurrency === 'USD' ? 'US' : fromCurrency === 'EUR' ? 'EU' : null,
                targetCountry: toCurrency === 'GBP' ? 'GB' : toCurrency === 'USD' ? 'US' : toCurrency === 'EUR' ? 'EU' : null,
                transferTimeHours: torfxDeliveryTime.hours,
                transferTime: torfxDeliveryTime.text,
                rating: 4.4, // Default TorFX rating
                methods: ['bank_transfer'],
                realTimeApi: false, // Not from real-time API
                isIndicative: true, // Add indicative flag
                timestamp: new Date().toISOString()
              };
              
              // Add TorFX to providers array
              providers.push(torfxProvider);
              console.log('Added TorFX as a provider with markup:', torfxMarkupPercentage * 100 + '%');

              // Add Panda Remit as a provider using the mid-market rate and our markup matrix
              const pandaRemitMarkupPercentage = getPandaRemitMarkup(fromCurrency, toCurrency);
              const pandaRemitFee = getPandaRemitFee(amount, fromCurrency);
              const pandaRemitDeliveryTime = getPandaRemitDeliveryTime(fromCurrency, toCurrency);
              
              // Calculate Panda Remit's effective rate using the markup
              const pandaRemitEffectiveRate = midMarketRate * (1 - pandaRemitMarkupPercentage);
              
              // Calculate amount received (amount converted at effective rate minus the fee)
              const pandaRemitAmountBeforeFee = parseFloat(amount) * pandaRemitEffectiveRate;
              const pandaRemitAmountReceived = pandaRemitAmountBeforeFee - (pandaRemitFee * pandaRemitEffectiveRate); // Convert fee to target currency
              
              // Calculate margin cost
              const pandaRemitMarginCost = parseFloat(amount) * (midMarketRate - pandaRemitEffectiveRate);
              
              // Create Panda Remit provider object
              const pandaRemitProvider = {
                providerId: 'provider-pandaremit',
                providerCode: 'pandaremit',
                providerName: 'Panda Remit',
                providerLogo: '/images/providers/pandaremit.png',
                baseRate: midMarketRate,
                effectiveRate: pandaRemitEffectiveRate,
                transferFee: pandaRemitFee,
                marginPercentage: pandaRemitMarkupPercentage * 100,
                marginCost: pandaRemitMarginCost,
                totalCost: pandaRemitFee + pandaRemitMarginCost,
                amountReceived: pandaRemitAmountReceived > 0 ? pandaRemitAmountReceived : 0, // Ensure amount is not negative
                sourceCountry: fromCurrency === 'GBP' ? 'GB' : fromCurrency === 'USD' ? 'US' : fromCurrency === 'EUR' ? 'EU' : null,
                targetCountry: toCurrency === 'GBP' ? 'GB' : toCurrency === 'USD' ? 'US' : toCurrency === 'EUR' ? 'EU' : null,
                transferTimeHours: pandaRemitDeliveryTime.hours,
                transferTime: pandaRemitDeliveryTime.text,
                rating: 4.6, // Default Panda Remit rating
                methods: ['bank_transfer'],
                realTimeApi: false, // Not from real-time API
                isIndicative: true, // Add indicative flag
                timestamp: new Date().toISOString()
              };
              
              // Add Panda Remit to providers array
              providers.push(pandaRemitProvider);
              console.log('Added Panda Remit as a provider with markup:', pandaRemitMarkupPercentage * 100 + '%');

              // Add Regency FX as a provider using the mid-market rate and our markup matrix
              const getRegencyFXMarkup = (fromCurr, toCurr) => {
                // Major pairs (USD, EUR, GBP, AUD, CAD, NZD, CHF, JPY, SGD, HKD)
                const majorPairs = ['USD', 'EUR', 'GBP', 'AUD', 'CAD', 'NZD', 'CHF', 'JPY', 'SGD', 'HKD'];
                if (majorPairs.includes(fromCurr) && majorPairs.includes(toCurr)) {
                  return 0.004; // 0.4%
                }
                
                // Other supported pairs (SEK, NOK, MXN, INR, ZAR, DKK, PLN, THB, HUF, CZK, ILS, AED, SAR, MYR, RON, BGN, CNY)
                const otherPairs = ['SEK', 'NOK', 'MXN', 'INR', 'ZAR', 'DKK', 'PLN', 'THB', 'HUF', 'CZK', 'ILS', 'AED', 'SAR', 'MYR', 'RON', 'BGN', 'CNY'];
                if ((majorPairs.includes(fromCurr) && otherPairs.includes(toCurr)) || 
                    (otherPairs.includes(fromCurr) && majorPairs.includes(toCurr)) ||
                    (otherPairs.includes(fromCurr) && otherPairs.includes(toCurr))) {
                  return 0.012; // 1.2%
                }
                
                // Default to higher markup for unsupported pairs
                return 0.02; // 2.0%
              };

              const getRegencyFXDeliveryTime = (fromCurr, toCurr) => {
                // Major pairs
                const majorPairs = ['USD', 'EUR', 'GBP', 'AUD', 'CAD', 'NZD', 'CHF', 'JPY', 'SGD', 'HKD'];
                if (majorPairs.includes(fromCurr) && majorPairs.includes(toCurr)) {
                  return {
                    text: 'Same day to 1 business day',
                    hours: { min: 0, max: 24 }
                  };
                }
                
                // Other supported pairs
                const otherPairs = ['SEK', 'NOK', 'MXN', 'INR', 'ZAR', 'DKK', 'PLN', 'THB', 'HUF', 'CZK', 'ILS', 'AED', 'SAR', 'MYR', 'RON', 'BGN', 'CNY'];
                if ((majorPairs.includes(fromCurr) && otherPairs.includes(toCurr)) || 
                    (otherPairs.includes(fromCurr) && majorPairs.includes(toCurr)) ||
                    (otherPairs.includes(fromCurr) && otherPairs.includes(toCurr))) {
                  return {
                    text: '1-2 business days',
                    hours: { min: 24, max: 48 }
                  };
                }
                
                // Default to longer delivery time for unsupported pairs
                return {
                  text: '1-3 business days',
                  hours: { min: 24, max: 72 }
                };
              };

              const regencyFXMarkupPercentage = getRegencyFXMarkup(fromCurrency, toCurrency);
              const regencyFXDeliveryTime = getRegencyFXDeliveryTime(fromCurrency, toCurrency);
              
              // Calculate Regency FX's effective rate using the markup
              const regencyFXEffectiveRate = midMarketRate * (1 - regencyFXMarkupPercentage);
              
              // Calculate amount received (amount converted at effective rate)
              const regencyFXAmountReceived = parseFloat(amount) * regencyFXEffectiveRate;
              
              // Calculate margin cost
              const regencyFXMarginCost = parseFloat(amount) * (midMarketRate - regencyFXEffectiveRate);
              
              // Create Regency FX provider object
              const regencyFXProvider = {
                providerId: 'provider-regencyfx',
                providerCode: 'regencyfx',
                providerName: 'Regency FX',
                providerLogo: '/images/providers/regencyfx.png',
                baseRate: midMarketRate,
                effectiveRate: regencyFXEffectiveRate,
                transferFee: 0, // Regency FX has no transfer fee
                marginPercentage: regencyFXMarkupPercentage * 100,
                marginCost: regencyFXMarginCost,
                totalCost: regencyFXMarginCost, // No transfer fee, so total cost is just margin cost
                amountReceived: regencyFXAmountReceived > 0 ? regencyFXAmountReceived : 0,
                sourceCountry: fromCurrency === 'GBP' ? 'GB' : fromCurrency === 'USD' ? 'US' : fromCurrency === 'EUR' ? 'EU' : null,
                targetCountry: toCurrency === 'GBP' ? 'GB' : toCurrency === 'USD' ? 'US' : toCurrency === 'EUR' ? 'EU' : null,
                transferTimeHours: regencyFXDeliveryTime.hours,
                transferTime: regencyFXDeliveryTime.text,
                rating: 4.7, // Default Regency FX rating
                methods: ['bank_transfer'],
                realTimeApi: false,
                isIndicative: true, // Add indicative flag
                timestamp: new Date().toISOString()
              };
              
              // Add Regency FX to providers array
              providers.push(regencyFXProvider);
              console.log('Added Regency FX as a provider with markup:', regencyFXMarkupPercentage * 100 + '%');
            }
            
            // Set the provider results and sort them
            setProviderResults(providers);
            sortResults(providers, sortBy, sortDirection);
            
          } else {
            setError('No provider data available from Wise comparison API');
          }
        } catch (comparisonError) {
          console.error('Error fetching Wise comparison data:', comparisonError);
          setError('Error fetching provider data: ' + comparisonError.message);
        }
      } catch (err) {
        console.error('Error fetching exchange rates:', err);
        setError('An error occurred while fetching exchange rates');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [fromCurrency, toCurrency, amount]);
  
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
      const fetchRatings = async () => {
        setRatingsLoading(true);
        const trustpilotRatingsMap = {};
        
        // Use Promise.allSettled to fetch all Trustpilot ratings concurrently
        const trustpilotRatingPromises = providerResults.map(provider => 
          apiService.getTrustpilotRating(provider.providerId || provider.providerCode) // Use providerId or code as identifier
            .then(rating => ({ id: provider.providerId, rating }))
            .catch(err => ({ id: provider.providerId, rating: null, error: err })) // Store null on error
        );
        
        // Wait for all rating requests to complete
        const trustpilotResults = await Promise.allSettled(trustpilotRatingPromises);
        
        // Process Trustpilot rating results
        trustpilotResults.forEach(result => {
          if (result.status === 'fulfilled' && result.value) {
            trustpilotRatingsMap[result.value.id] = result.value.rating;
          } else if (result.status === 'rejected' || (result.status === 'fulfilled' && !result.value)) {
            // Handle cases where the promise was rejected or resolved without a value
            const failedProvider = providerResults.find((p, index) => index === trustpilotResults.indexOf(result));
            if(failedProvider) {
              trustpilotRatingsMap[failedProvider.providerId] = null; // Explicitly set null for failed/missing ratings
            }
            console.error("Failed to fetch Trustpilot rating for a provider:", result.reason || 'No rating returned');
          }
        });
        
        setTrustpilotRatings(trustpilotRatingsMap);
        setRatingsLoading(false);
      };

      fetchRatings();
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
  
  // Add useEffect for loading animation timing
  useEffect(() => {
    if (!loading) {
      // Keep the animation visible for 2 seconds after data is loaded
      const timer = setTimeout(() => {
        setShowLoadingAnimation(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [loading]);
  
  // Show loading state or error
  if (loading || showLoadingAnimation) {
    return (
      <div className="container mx-auto flex-1 px-4 sm:px-6 md:px-8 py-5 max-w-6xl">
        <div className="mb-4">
          <button 
            onClick={onBackToSearch}
            className="text-indigo-600 hover:text-indigo-800 flex items-center transition-colors font-medium"
          >
            <ChevronLeft size={18} className="mr-1" /> Back to search
          </button>
        </div>
        
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 sm:px-6 md:px-8">
          {/* Main loading animation container */}
          <div className="relative w-full max-w-md mx-auto">
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 via-purple-50 to-indigo-50 rounded-3xl opacity-50 animate-gradient-x"></div>
            
            {/* Content container */}
            <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-indigo-100/50">
              {/* Animated circles */}
              <div className="relative w-32 h-32 mx-auto mb-8">
                {/* Outer rotating circle */}
                <div className="absolute inset-0 border-4 border-indigo-200 rounded-full animate-[spin_3s_linear_infinite]"></div>
                {/* Middle pulsing circle */}
                <div className="absolute inset-4 border-4 border-indigo-400 rounded-full animate-[pulse_2s_ease-in-out_infinite]"></div>
                {/* Inner rotating circle */}
                <div className="absolute inset-8 border-4 border-indigo-500 rounded-full animate-[spin_2s_linear_infinite_reverse]"></div>
                {/* Center dot with glow */}
                <div className="absolute inset-[35%] bg-indigo-600 rounded-full animate-pulse shadow-lg shadow-indigo-200"></div>
              </div>
              
              {/* Text content */}
              <div className="text-center space-y-6">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Finding the best rates
                  </h3>
                  <p className="text-gray-600 text-sm sm:text-base max-w-sm mx-auto">
                    We're comparing rates from multiple providers to find you the best deal for your transfer.
                  </p>
                </div>
                
                {/* Animated progress indicators */}
                <div className="flex justify-center items-center space-x-2">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-[bounce_1s_infinite_0ms]"></div>
                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-[bounce_1s_infinite_150ms]"></div>
                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-[bounce_1s_infinite_300ms]"></div>
                </div>
                
                {/* Progress bar */}
                <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-[progress_2s_ease-in-out_infinite]"></div>
                </div>
              </div>
            </div>
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
      `}</style>
      
      <div className="container mx-auto flex-1 px-4 py-5 max-w-6xl" style={{ zIndex: 100, position: 'relative' }}>
        <div className="mb-4">
          <button 
            onClick={onBackToSearch}
            className="text-indigo-600 hover:text-indigo-800 flex items-center transition-colors font-medium"
          >
            <ChevronLeft size={18} className="mr-1" /> Back to search
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
            className="mb-5 rounded-lg shadow-sm border border-indigo-200 p-4 cursor-pointer hover:shadow-md transition-all metal-shimmer gradient-bg relative z-10"
          >
            <div className="flex flex-col md:flex-row items-center justify-between relative z-10">
              <div className="flex items-center mb-3 md:mb-0">
                <Award size={24} className="text-indigo-600 mr-2" />
                <h3 className="font-bold text-indigo-800 text-lg">Best Deal</h3>
              </div>
              
              <div className="flex flex-col md:flex-row items-center justify-center md:flex-1">
                <img 
                  src={bestDealProvider.providerLogo} 
                  alt={`${bestDealProvider.providerName} logo`} 
                  className="w-16 h-16 object-contain mb-3 md:mb-0 md:mr-4"
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
                
                <div className="text-center">
                  <div className="text-xs uppercase font-medium text-indigo-600 mb-1">They receive</div>
                  <div className="text-2xl font-bold">
                    <span className="text-shimmer">
                      {getCurrencySymbol(toCurrency)} {formatAmount(bestDealProvider.amountReceived)}
                    </span>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => scrollToProvider(bestDealProvider.providerId)}
                className="text-xs bg-white px-3 py-1.5 rounded-md shadow-sm border border-indigo-100 text-indigo-700 font-medium flex items-center mt-3 md:mt-0"
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