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
  const [providerResults, setProviderResults] = useState([]);
  const [bestDealProvider, setBestDealProvider] = useState(null);
  const [error, setError] = useState(null);
  // State for fetched external ratings and loading status
  const [providerRatings, setProviderRatings] = useState({});
  const [trustpilotRatings, setTrustpilotRatings] = useState({});
  const [ratingsLoading, setRatingsLoading] = useState(false);
  
  // XE currency classifications for different markup percentages
  const majorCurrencies = ['USD', 'EUR', 'GBP', 'AUD', 'CAD', 'NZD', 'CHF', 'JPY', 'SGD'];
  const tier2Currencies = ['INR', 'ZAR', 'MXN', 'PLN', 'SEK', 'NOK', 'DKK', 'HUF', 'CZK', 'ILS', 'TRY', 'THB', 'PHP', 'MYR', 'RON', 'BGN', 'KRW', 'HKD', 'CNY', 'CLP', 'COP', 'SAR', 'AED', 'QAR', 'KWD', 'NGN', 'BRL', 'RUB', 'ARS', 'EGP', 'IDR'];
  const exoticCurrencies = ['NGN', 'KWD', 'QAR', 'ARS', 'EGP', 'IDR', 'CLP', 'COP', 'RUB', 'BRL', 'TRY'];
  
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
                
                if (quote.estimatedDelivery) {
                  transferTime = quote.estimatedDelivery;
                  
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
                
                // Determine logo path, override for TorFX if SVG is provided
                let logoUrl = provider.logos?.normal?.svgUrl || provider.logos?.normal?.pngUrl || provider.logo;
                const providerAlias = (provider.alias || '').toLowerCase();
                const providerNameCheck = (provider.name || '').toLowerCase();

                if ((providerAlias === 'torfx' || providerNameCheck.includes('torfx')) && logoUrl && logoUrl.endsWith('.svg')) {
                  console.log(`Overriding TorFX SVG logo with PNG for provider ${provider.id}`);
                  logoUrl = '/images/providers/torfx.png'; // Force PNG for TorFX
                }
                
                // Basic provider object from comparison API data
                return {
                  providerId: `provider-${provider.id}`,
                  providerCode: provider.alias,
                  providerName: provider.name,
                  providerLogo: logoUrl, // Use the potentially overridden logoUrl
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
                providerLogo: '/images/providers/XElogo.svg',
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
              const getTorFXMarkup = (fromCurr, toCurr) => {
                // Major pairs
                const majorPairs = ['USD', 'EUR', 'GBP', 'AUD', 'CAD', 'NZD', 'CHF', 'JPY', 'SGD'];
                if (majorPairs.includes(fromCurr) && majorPairs.includes(toCurr)) {
                  return 0.01; // 1.0%
                }
                
                // Tier 2 pairs
                const tier2Pairs = ['INR', 'ZAR', 'MXN', 'PLN', 'SEK', 'NOK', 'DKK', 'HUF', 'CZK', 'ILS', 'TRY', 'THB', 'PHP', 'MYR', 'RON', 'BGN', 'KRW', 'HKD', 'CNY', 'CLP', 'COP', 'SAR', 'AED', 'QAR', 'KWD', 'NGN', 'BRL', 'RUB', 'ARS', 'EGP', 'IDR'];
                if ((majorPairs.includes(fromCurr) && tier2Pairs.includes(toCurr)) || 
                    (tier2Pairs.includes(fromCurr) && majorPairs.includes(toCurr)) ||
                    (tier2Pairs.includes(fromCurr) && tier2Pairs.includes(toCurr))) {
                  return 0.015; // 1.5%
                }
                
                // Exotic pairs
                return 0.02; // 2.0%
              };

              const getTorFXDeliveryTime = (fromCurr, toCurr) => {
                // Major pairs
                const majorPairs = ['USD', 'EUR', 'GBP', 'AUD', 'CAD', 'NZD', 'CHF', 'JPY', 'SGD'];
                if (majorPairs.includes(fromCurr) && majorPairs.includes(toCurr)) {
                  return {
                    text: 'Same day to 1 business day',
                    hours: { min: 0, max: 24 }
                  };
                }
                
                // Tier 2 pairs
                const tier2Pairs = ['INR', 'ZAR', 'MXN', 'PLN', 'SEK', 'NOK', 'DKK', 'HUF', 'CZK', 'ILS', 'TRY', 'THB', 'PHP', 'MYR', 'RON', 'BGN', 'KRW', 'HKD', 'CNY', 'CLP', 'COP', 'SAR', 'AED', 'QAR', 'KWD', 'NGN', 'BRL', 'RUB', 'ARS', 'EGP', 'IDR'];
                if ((majorPairs.includes(fromCurr) && tier2Pairs.includes(toCurr)) || 
                    (tier2Pairs.includes(fromCurr) && majorPairs.includes(toCurr)) ||
                    (tier2Pairs.includes(fromCurr) && tier2Pairs.includes(toCurr))) {
                  return {
                    text: '1-2 business days',
                    hours: { min: 24, max: 48 }
                  };
                }
                
                // Exotic pairs
                return {
                  text: '1-3 business days',
                  hours: { min: 24, max: 72 }
                };
              };

              const torfxMarkupPercentage = getTorFXMarkup(fromCurrency, toCurrency);
              const torfxDeliveryTime = getTorFXDeliveryTime(fromCurrency, toCurrency);
              
              // Calculate TorFX's effective rate using the markup
              const torfxEffectiveRate = midMarketRate * (1 - torfxMarkupPercentage);
              
              // Calculate amount received (amount converted at effective rate)
              const torfxAmountReceived = parseFloat(amount) * torfxEffectiveRate;
              
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
                transferFee: 0, // TorFX typically has no transfer fee
                marginPercentage: torfxMarkupPercentage * 100,
                marginCost: torfxMarginCost,
                totalCost: torfxMarginCost, // No transfer fee, so total cost is just margin cost
                amountReceived: torfxAmountReceived > 0 ? torfxAmountReceived : 0,
                sourceCountry: fromCurrency === 'GBP' ? 'GB' : fromCurrency === 'USD' ? 'US' : fromCurrency === 'EUR' ? 'EU' : null,
                targetCountry: toCurrency === 'GBP' ? 'GB' : toCurrency === 'USD' ? 'US' : toCurrency === 'EUR' ? 'EU' : null,
                transferTimeHours: torfxDeliveryTime.hours,
                transferTime: torfxDeliveryTime.text,
                rating: 4.4, // Default TorFX rating
                methods: ['bank_transfer'],
                realTimeApi: false,
                timestamp: new Date().toISOString()
              };
              
              // Add TorFX to providers array
              providers.push(torfxProvider);
              console.log('Added TorFX as a provider with markup:', torfxMarkupPercentage * 100 + '%');
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
        const googleRatingsMap = {};
        const trustpilotRatingsMap = {};
        
        // Use Promise.allSettled to fetch all Google ratings concurrently
        const googleRatingPromises = providerResults.map(provider => 
          apiService.getProviderRating(provider.providerId || provider.providerCode) // Use providerId or code as identifier
            .then(rating => ({ id: provider.providerId, rating }))
            .catch(err => ({ id: provider.providerId, rating: null, error: err })) // Store null on error
        );
        
        // Use Promise.allSettled to fetch all Trustpilot ratings concurrently
        const trustpilotRatingPromises = providerResults.map(provider => 
          apiService.getTrustpilotRating(provider.providerId || provider.providerCode) // Use providerId or code as identifier
            .then(rating => ({ id: provider.providerId, rating }))
            .catch(err => ({ id: provider.providerId, rating: null, error: err })) // Store null on error
        );
        
        // Wait for all rating requests to complete
        const [googleResults, trustpilotResults] = await Promise.all([
          Promise.allSettled(googleRatingPromises),
          Promise.allSettled(trustpilotRatingPromises)
        ]);
        
        // Process Google rating results
        googleResults.forEach(result => {
          if (result.status === 'fulfilled' && result.value) {
            googleRatingsMap[result.value.id] = result.value.rating;
          } else if (result.status === 'rejected' || (result.status === 'fulfilled' && !result.value)) {
            // Handle cases where the promise was rejected or resolved without a value
            const failedProvider = providerResults.find((p, index) => index === googleResults.indexOf(result));
            if(failedProvider) {
              googleRatingsMap[failedProvider.providerId] = null; // Explicitly set null for failed/missing ratings
            }
            console.error("Failed to fetch Google rating for a provider:", result.reason || 'No rating returned');
          }
        });
        
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
        
        setProviderRatings(googleRatingsMap);
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
          comparison = a.rating - b.rating;
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
      <div className="container mx-auto flex-1 px-4 py-5 max-w-6xl flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse rounded-full bg-indigo-200 h-24 w-24 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading exchange rates...</p>
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
        
        {/* Sticky Summary Panel */}
        <div className="mb-5 bg-white rounded-lg shadow-md border border-gray-100 p-3 py-4 sticky top-[calc(4rem+1px)] z-40 transition-all duration-200 backdrop-blur-sm bg-white/95">
          {/* Mobile view: 2-line layout */}
          <div className="sm:hidden">
            {/* First line: labels */}
            <div className="grid grid-cols-3 gap-2 mb-2">
              <div className="text-sm font-medium text-gray-700">Summary</div>
              <div className="text-xs text-gray-500 text-center">You send</div>
              <div className="text-xs text-gray-500 text-center">They receive</div>
            </div>
            
            {/* Second line: content */}
            <div className="grid grid-cols-3 gap-2 items-center">
              <div>
                <button 
                  onClick={onBackToSearch}
                  className="px-2 py-1 bg-white border border-indigo-500 text-indigo-600 rounded-md hover:bg-indigo-50 transition-colors text-xs"
                >
                  Edit
                </button>
              </div>
              
              <div className="flex items-center justify-center">
                <CurrencyFlag currency={fromCurrency} size="sm" />
                <span className="ml-1 font-semibold text-sm whitespace-nowrap">
                  {getCurrencySymbol(fromCurrency)} {formatAmount(amount)}
                </span>
              </div>
              
              <div className="flex items-center justify-center">
                <CurrencyFlag currency={toCurrency} size="sm" />
                <span className="ml-1 font-semibold text-sm whitespace-nowrap">
                  {bestDealProvider 
                    ? `${getCurrencySymbol(toCurrency)} ${formatAmount(bestDealProvider.amountReceived)}`
                    : `Loading...`
                  }
                </span>
              </div>
            </div>
          </div>
          
          {/* Tablet/Desktop view: original layout */}
          <div className="hidden sm:block">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Summary</h3>
            <div className="flex flex-row items-center justify-between lg:justify-center lg:relative">
              <div className="flex flex-row items-center mr-4">
                <div className="text-center">
                  <div className="text-xs text-gray-500 mb-1">You send</div>
                  <div className="flex items-center justify-center">
                    <CurrencyFlag currency={fromCurrency} size="sm" />
                    <span className="ml-2 font-semibold">
                      {getCurrencySymbol(fromCurrency)} {formatAmount(amount)} {fromCurrency}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center mx-4 my-0">
                  <ArrowRight size={16} className="text-gray-400" />
                </div>
                
                <div className="text-center">
                  <div className="text-xs text-gray-500 mb-1">They receive</div>
                  <div className="flex items-center justify-center">
                    <CurrencyFlag currency={toCurrency} size="sm" />
                    <span className="ml-2 font-semibold">
                      {bestDealProvider 
                        ? `${getCurrencySymbol(toCurrency)} ${formatAmount(bestDealProvider.amountReceived)} ${toCurrency}`
                        : `Loading...`
                      }
                    </span>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={onBackToSearch}
                className="px-3 py-1.5 bg-white border border-indigo-500 text-indigo-600 rounded-md hover:bg-indigo-50 transition-colors text-sm w-auto lg:absolute lg:right-0"
              >
                Edit
              </button>
            </div>
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
        
        {/* Sorting options - Mobile friendly dropdown */}
        <div className="mb-5 relative z-10">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="p-3 flex justify-between items-center cursor-pointer" onClick={() => setShowSortOptions(!showSortOptions)}>
              <div className="font-medium flex items-center">
                <SlidersHorizontal size={16} className="mr-2 text-indigo-500" />
                Sort by: <span className="ml-2 text-indigo-600">{sortBy === 'rate' ? 'Exchange Rate' : sortBy === 'amount' ? 'Amount Received' : sortBy === 'fees' ? 'Fees' : 'User Rating'}</span>
                <span className="ml-2 text-gray-400">
                  ({sortDirection === 'desc' ? 'Highest first' : 'Lowest first'})
                </span>
              </div>
              <button className="text-gray-500">
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
              </button>
            </div>
            
            {showSortOptions && (
              <div className="p-3 pt-0 border-t border-gray-100">
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => {
                      if (sortBy === 'amount') {
                        toggleSortDirection();
                      } else {
                        setSortBy('amount');
                        setSortDirection('desc'); // Default to highest first
                      }
                    }}
                    className={`px-3 py-2 rounded text-sm flex justify-between items-center ${sortBy === 'amount' ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-gray-50'}`}
                  >
                    Amount Received
                    {sortBy === 'amount' && (
                      <span className="ml-1">
                        <ArrowUpDown size={14} />
                      </span>
                    )}
                  </button>
                  
                  <button 
                    onClick={() => {
                      if (sortBy === 'rate') {
                        toggleSortDirection();
                      } else {
                        setSortBy('rate');
                        setSortDirection('desc'); // Default to highest first
                      }
                    }}
                    className={`px-3 py-2 rounded text-sm flex justify-between items-center ${sortBy === 'rate' ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-gray-50'}`}
                  >
                    Exchange Rate
                    {sortBy === 'rate' && (
                      <span className="ml-1">
                        <ArrowUpDown size={14} />
                      </span>
                    )}
                  </button>
                  
                  <button 
                    onClick={() => {
                      if (sortBy === 'fees') {
                        toggleSortDirection();
                      } else {
                        setSortBy('fees');
                        setSortDirection('asc'); // Default to lowest first for fees
                      }
                    }}
                    className={`px-3 py-2 rounded text-sm flex justify-between items-center ${sortBy === 'fees' ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-gray-50'}`}
                  >
                    Fees
                    {sortBy === 'fees' && (
                      <span className="ml-1">
                        <ArrowUpDown size={14} />
                      </span>
                    )}
                  </button>
                  
                  <button 
                    onClick={() => {
                      if (sortBy === 'rating') {
                        toggleSortDirection();
                      } else {
                        setSortBy('rating');
                        setSortDirection('desc'); // Default to highest first
                      }
                    }}
                    className={`px-3 py-2 rounded text-sm flex justify-between items-center ${sortBy === 'rating' ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-gray-50'}`}
                  >
                    User Rating
                    {sortBy === 'rating' && (
                      <span className="ml-1">
                        <ArrowUpDown size={14} />
                      </span>
                    )}
                  </button>
                </div>
              </div>
            )}
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
              // Pass fetched rating and loading state
              fetchedRating={providerRatings[provider.providerId]}
              trustpilotRating={trustpilotRatings[provider.providerId]}
              ratingsLoading={ratingsLoading}
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