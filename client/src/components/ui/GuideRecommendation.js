import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { BookOpenIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { SparklesIcon } from '@heroicons/react/24/solid';
import CurrencyFlag from './CurrencyFlag';
import { currenciesList } from '../../utils/currency';

// Currency to region/country mapping
const currencyRegionMap = {
  // Europe
  'EUR': { region: 'Europe', countries: ['Euro countries'] },
  'GBP': { region: 'Europe', countries: ['United Kingdom'] },
  'CHF': { region: 'Europe', countries: ['Switzerland'] },
  'PLN': { region: 'Europe', countries: ['Poland'] },
  'SEK': { region: 'Europe', countries: ['Sweden'] },
  'NOK': { region: 'Europe', countries: ['Norway'] },
  'DKK': { region: 'Europe', countries: ['Denmark'] },
  'CZK': { region: 'Europe', countries: ['Czech Republic'] },
  'HUF': { region: 'Europe', countries: ['Hungary'] },
  'RON': { region: 'Europe', countries: ['Romania'] },
  'BGN': { region: 'Europe', countries: ['Bulgaria'] },
  // North America
  'USD': { region: 'Americas', countries: ['United States'] },
  'CAD': { region: 'Americas', countries: ['Canada'] },
  'MXN': { region: 'Americas', countries: ['Mexico'] },
  // South America
  'BRL': { region: 'Americas', countries: ['Brazil'] },
  'CLP': { region: 'Americas', countries: ['Chile'] },
  'COP': { region: 'Americas', countries: ['Colombia'] },
  'ARS': { region: 'Americas', countries: ['Argentina'] },
  // Asia
  'JPY': { region: 'Asia', countries: ['Japan'] },
  'CNY': { region: 'Asia', countries: ['China'] },
  'HKD': { region: 'Asia', countries: ['Hong Kong'] },
  'SGD': { region: 'Asia', countries: ['Singapore'] },
  'INR': { region: 'Asia', countries: ['India'] },
  'THB': { region: 'Asia', countries: ['Thailand'] },
  'IDR': { region: 'Asia', countries: ['Indonesia'] },
  'MYR': { region: 'Asia', countries: ['Malaysia'] },
  'KRW': { region: 'Asia', countries: ['South Korea'] },
  'PHP': { region: 'Asia', countries: ['Philippines'] },
  // Middle East
  'ILS': { region: 'Middle East', countries: ['Israel'] },
  'AED': { region: 'Middle East', countries: ['United Arab Emirates'] },
  'SAR': { region: 'Middle East', countries: ['Saudi Arabia'] },
  'QAR': { region: 'Middle East', countries: ['Qatar'] },
  'KWD': { region: 'Middle East', countries: ['Kuwait'] },
  // Africa
  'ZAR': { region: 'Africa', countries: ['South Africa'] },
  'EGP': { region: 'Africa', countries: ['Egypt'] },
  'NGN': { region: 'Africa', countries: ['Nigeria'] },
  // Oceania
  'AUD': { region: 'Oceania', countries: ['Australia'] },
  'NZD': { region: 'Oceania', countries: ['New Zealand'] },
};

// Guide data with paths and details - Only include guides that actually exist
const guideData = [
  // Country-specific guides that exist in the application
  { 
    id: 'india',
    title: 'Sending Money to India Guide',
    path: '/guides/send-money-to-india',
    currency: 'INR', 
    description: 'Find the best providers, lowest fees, and fastest ways to send money to India.'
  },
  { 
    id: 'philippines',
    title: 'Philippines Money Transfer Guide',
    path: '/guides/send-money-to-philippines',
    currency: 'PHP', 
    description: 'How to support family back home in the Philippines with optimal remittance options.'
  },
  { 
    id: 'mexico',
    title: 'Mexico Remittance Guide',
    path: '/guides/send-money-to-mexico',
    currency: 'MXN', 
    description: 'Fastest and cheapest ways to send money to Mexico from the US.'
  },
  { 
    id: 'china',
    title: 'China Money Transfer Guide',
    path: '/guides/send-money-to-china',
    currency: 'CNY', 
    description: 'Navigate China\'s unique regulations and find the best providers for sending money to China.'
  },
  { 
    id: 'canada',
    title: 'Canada Money Transfer Guide',
    path: '/guides/send-money-to-canada',
    currency: 'CAD', 
    description: 'Find the best ways to send money to Canada from the UK.'
  },
  { 
    id: 'nigeria',
    title: 'Nigeria Money Transfer Guide',
    path: '/guides/send-money-to-nigeria',
    currency: 'NGN', 
    description: 'Navigate Nigeria\'s unique financial landscape with our guide to exchange rates.'
  },
  { 
    id: 'poland',
    title: 'Poland Money Transfer Guide',
    path: '/guides/send-money-to-poland',
    currency: 'PLN', 
    description: 'Find the best ways to send money to Poland from the UK.'
  },
  { 
    id: 'romania',
    title: 'Romania Money Transfer Guide',
    path: '/guides/send-money-to-romania',
    currency: 'RON', 
    description: 'Best options for sending money to Romania, including digital transfers.'
  },
  
  // Regional guides
  { 
    id: 'europe',
    title: 'European Money Transfers Guide',
    path: '/guides/regions/europe',
    region: 'Europe', 
    description: 'Complete guide for sending money to and within European countries, including fees and regulations.'
  },
  { 
    id: 'americas',
    title: 'Americas Money Transfer Guide',
    path: '/guides/regions/americas',
    region: 'Americas', 
    description: 'How to send money across North and South America with the best rates and lowest fees.'
  },
  { 
    id: 'asia',
    title: 'Asia Money Transfer Guide',
    path: '/guides/regions/asia',
    region: 'Asia', 
    description: 'Find the best ways to send money to Asian countries, including banking alternatives and mobile options.'
  },
  { 
    id: 'africa',
    title: 'Africa Money Transfer Guide',
    path: '/guides/regions/africa',
    region: 'Africa', 
    description: 'Navigate the unique challenges and opportunities of sending money to African nations.'
  },
  
  // Value-based guides
  { 
    id: 'high-value',
    title: 'High Value Transfers Guide',
    path: '/guides/high-value',
    valueType: 'high', 
    description: 'Strategies and providers for large transfers, including bulk payments and property purchases.'
  },
  { 
    id: 'low-value',
    title: 'Low Value Transfers Guide',
    path: '/guides/low-value',
    valueType: 'low', 
    description: 'Cost-effective options for smaller transfers, focusing on minimal fees.'
  },
  
  // Corridor-specific guides
  { 
    id: 'uk-to-asia',
    title: 'UK to Asia Money Transfer Guide',
    path: '/guides/corridors/uk-asia',
    fromCurrency: 'GBP',
    toRegion: 'Asia',
    description: 'Complete guide for sending money from the UK to Asian countries, including regulations and popular services.'
  },
  { 
    id: 'us-to-latam',
    title: 'US to Latin America Transfers',
    path: '/guides/corridors/us-latam',
    fromCurrency: 'USD',
    toRegion: 'Americas',
    description: 'Best practices for sending money from the US to Latin American countries including Mexico, Colombia, and Brazil.'
  },
  { 
    id: 'eu-to-africa',
    title: 'Europe to Africa Money Transfers',
    path: '/guides/corridors/eu-africa',
    fromCurrency: 'EUR',
    toRegion: 'Africa',
    description: 'Comprehensive guide for European to African transfers, including mobile money options and local considerations.'
  },
  { 
    id: 'aus-to-pacific',
    title: 'Australia to Pacific Money Guide',
    path: '/guides/corridors/aus-pacific',
    fromCurrency: 'AUD',
    toRegion: 'Oceania',
    description: 'Solutions for sending money from Australia to Pacific nations, including island-specific considerations.'
  },
  { 
    id: 'usd-to-inr',
    title: 'USD to INR Transfers Guide',
    path: '/guides/corridors/usd-inr',
    fromCurrency: 'USD',
    toCurrency: 'INR',
    description: 'Best options for sending US dollars to Indian rupees, including specialized Indian diaspora services.'
  },
  { 
    id: 'gbp-to-eur',
    title: 'GBP to EUR Transfers Guide',
    path: '/guides/corridors/gbp-eur',
    fromCurrency: 'GBP',
    toCurrency: 'EUR',
    description: 'How to send British pounds to euros post-Brexit, with details on fees, taxes, and regulatory changes.'
  }
];

const GuideRecommendation = ({ fromCurrency, toCurrency, amount }) => {
  // Function to get relevant guides based on currency
  const getRelevantGuides = useMemo(() => {
    const result = [];
    
    // First priority: Check for currency pair specific corridor guides
    const corridorGuide = guideData.find(guide => 
      guide.fromCurrency === fromCurrency && guide.toCurrency === toCurrency
    );
    
    if (corridorGuide) {
      result.push(corridorGuide);
      
      // Add a value-based guide as a second recommendation if we have a specific corridor
      const valueBasedGuide = amount >= 5000 
        ? guideData.find(guide => guide.valueType === 'high')
        : guideData.find(guide => guide.valueType === 'low');
      
      if (valueBasedGuide) {
        result.push(valueBasedGuide);
      }
      
      return result;
    }
    
    // Second priority: Check for region corridor guides (e.g., UK to Asia)
    const destinationRegion = currencyRegionMap[toCurrency]?.region;
    const regionCorridorGuide = guideData.find(guide => 
      guide.fromCurrency === fromCurrency && guide.toRegion === destinationRegion
    );
    
    if (regionCorridorGuide) {
      result.push(regionCorridorGuide);
    }
    
    // Third priority: Country-specific guide for destination
    const countrySpecificGuide = guideData.find(guide => 
      guide.currency === toCurrency
    );
    
    if (countrySpecificGuide) {
      result.push(countrySpecificGuide);
      
      // If we have a country guide, also include a value guide
      if (result.length === 1) {
        const valueBasedGuide = amount >= 5000 
          ? guideData.find(guide => guide.valueType === 'high')
          : guideData.find(guide => guide.valueType === 'low');
        
        if (valueBasedGuide) {
          result.push(valueBasedGuide);
        }
      }
      
      return result;
    }
    
    // Fourth priority: Regional guide for destination
    if (destinationRegion && !regionCorridorGuide) {
      const regionalGuide = guideData.find(guide => guide.region === destinationRegion);
      if (regionalGuide) {
        result.push(regionalGuide);
      }
    }
    
    // Always include a value-based guide if we have space
    if (result.length < 2) {
      const valueBasedGuide = amount >= 5000 
        ? guideData.find(guide => guide.valueType === 'high')
        : guideData.find(guide => guide.valueType === 'low');
      
      if (valueBasedGuide) {
        result.push(valueBasedGuide);
      }
    }
    
    // If we still have no guides at all, return a general guide
    if (result.length === 0) {
      const fallbackGuide = guideData.find(guide => guide.id === 'high-value');
      if (fallbackGuide) {
        return [fallbackGuide];
      }
    }
    
    // Limit to 2 recommendations
    return result.slice(0, 2);
  }, [fromCurrency, toCurrency, amount]);

  // Get currency name for display
  const getCurrencyName = (code) => {
    const currency = currenciesList.find(c => c.code === code);
    return currency ? currency.name : code;
  };

  // Don't render if no guides found
  if (getRelevantGuides.length === 0) {
    return null;
  }

  // Helper to determine if a guide has any currency flags
  const hasFlags = (guide) => {
    return guide.currency || guide.fromCurrency || guide.toCurrency;
  };

  return (
    <div className="mb-5 relative z-10">
      <div className="rounded-xl overflow-hidden shadow-sm border border-gray-100">
        {/* Header with Expert Resources title */}
        <div className="bg-gradient-to-r from-indigo-500/10 to-indigo-700/10 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-indigo-100">
          <div className="flex items-center gap-2">
            <div className="bg-white/95 shadow-sm p-1.5 rounded-full">
              <BookOpenIcon className="h-4 w-4 text-indigo-600" />
            </div>
            <h3 className="text-indigo-900 font-medium text-sm">Expert Resources</h3>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-medium text-indigo-600/80 bg-indigo-50/80 py-1 px-2 rounded-full">
            <SparklesIcon className="h-3 w-3" />
            <span>Personalised</span>
          </div>
        </div>
        
        {/* Improved grid layout for guides */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 bg-white divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
          {getRelevantGuides.map((guide, index) => (
            <div 
              key={guide.id}
              className="p-3 sm:p-4 flex items-center justify-between hover:bg-indigo-50/30 transition-colors"
            >
              {/* Mobile view: All on one line with left-aligned text */}
              <div className="flex items-center flex-1 min-w-0">
                {/* Flag or icon display */}
                {hasFlags(guide) ? (
                  <div className="flex-shrink-0 mr-2">
                    <div className="flex -space-x-1.5 scale-75 transform origin-left">
                      {guide.fromCurrency && (
                        <div className="z-20 rounded-full border-2 border-white shadow-sm">
                          <CurrencyFlag currency={guide.fromCurrency} size="sm" />
                        </div>
                      )}
                      {guide.currency && (
                        <div className="z-10 rounded-full border-2 border-white shadow-sm">
                          <CurrencyFlag currency={guide.currency} size="sm" />
                        </div>
                      )}
                      {guide.toCurrency && !guide.currency && (
                        <div className="z-10 rounded-full border-2 border-white shadow-sm">
                          <CurrencyFlag currency={guide.toCurrency} size="sm" />
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center bg-indigo-100 rounded-full mr-6">
                    <BookOpenIcon className="h-3.5 w-3.5 text-indigo-500" />
                  </div>
                )}
                
                {/* Title text - left-aligned */}
                <div className="flex-1 min-w-0 text-left">
                  <h4 className="text-sm font-medium text-gray-800 truncate">
                    {guide.title}
                  </h4>
                </div>
              </div>
              
              {/* Arrow button - simplified on mobile */}
              <Link 
                to={guide.path}
                className="flex-shrink-0 ml-2 sm:ml-3 sm:px-3 px-2 py-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 rounded-md border border-indigo-100 shadow-sm transition-colors flex items-center whitespace-nowrap"
              >
                <span className="hidden sm:inline">View Guide</span>
                <ChevronRightIcon className="h-4 w-4 sm:ml-1 sm:h-3 sm:w-3" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GuideRecommendation; 