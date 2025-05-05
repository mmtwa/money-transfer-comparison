import React from 'react';
import { ExternalLink, Check, ThumbsUp, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { formatAmount, getCurrencySymbol } from '../../utils/currency';
import TrustpilotRating from './TrustpilotRating';
import './TrustpilotRating.css';
import ProviderDetailsPopup from './ProviderDetailsPopup';

// Map of provider codes to their website URLs - defined at module level
// so it persists between renders and can be updated
let websiteMap = {
  'abn-amro-bank': 'https://www.abn-amro-bank.com',
  'anz': 'https://www.anz.com',
  'anz-nz': 'https://www.anz-nz.com',
  'auckland-savings-bank-nz': 'https://www.auckland-savings-bank-nz.com',
  'azimo': 'https://www.azimo.com',
  'bank-of-america': 'https://www.bank-of-america.com',
  'bank-of-new-zealand-nz': 'https://www.bank-of-new-zealand-nz.com',
  'barclays': 'https://www.barclays.co.uk/ways-to-bank/international-payments/',
  'bbva': 'https://www.bbva.com',
  'bea': 'https://www.bea.com',
  'bendigo-bank': 'https://www.bendigo-bank.com',
  'bnc': 'https://www.bnc.com',
  'bnp': 'https://www.bnp.com',
  'ccb-hk': 'https://www.ccb-hk.com',
  'chase': 'https://www.chase.com/digital/customer-service/helpful-tips/online-banking/mobile/wire-transfer-send',
  'citibank-singapore': 'https://www.citibank-singapore.com',
  'commerzbank': 'https://www.commerzbank.com',
  'commonwealth-bank-of-australia': 'https://www.commonwealth-bank-of-australia.com',
  'currencyfair': 'https://www.currencyfair.com',
  'deutsche-bank': 'https://www.deutsche-bank.com',
  'halifax': 'https://www.halifax.co.uk/helpcentre/everyday-banking/payments-and-transfers/international-payments/send-money-guide.html',
  'hang-seng': 'https://www.hang-seng.com',
  'hsbc-hk': 'https://www.hsbc-hk.com',
  'ing-nl': 'https://www.ing-nl.com',
  'instarem': 'https://www.instarem.com',
  'kiwibank': 'https://www.kiwibank.com',
  'knab': 'https://www.knab.com',
  'la-banque-postale': 'https://www.la-banque-postale.com',
  'lacaixa': 'https://www.lacaixa.com',
  'lloyds': 'https://www.lloydsbank.com/help-guidance/everyday-banking/payments-and-transfers/international-payments.html',
  'migros': 'https://www.migros.com',
  'monese': 'https://monese.com/gb/en/money-transfers/',
  'moneygram': 'https://www.moneygram.com',
  'national-australia-bank': 'https://www.nab.com.au/personal/international-banking/transfer-money-overseas',
  'nationwide': 'https://www.nationwide.co.uk/help/payments/swift-sepa-international-payments/',
  'natwest': 'https://www.natwest.com/banking-with-natwest/how-to/send-money-abroad.html',
  'ocbc': 'https://www.ocbc.com/personal-banking/digital-banking/overseas-funds-transfer.page',
  'ocbc-whb': 'https://www.ocbc-whb.com',
  'ofx': 'https://www.ofx.com/en-gb/money-transfer/',
  'paypal': 'https://www.paypal.com/uk/digital-wallet/send-receive-money/send-money',
  'postfinance': 'https://www.postfinance.com',
  'Profee': 'https://www.profee.com', 
  'qnb-finansbank': 'https://www.qnb-finansbank.com',
  'rbc': 'https://www.rbc.com',
  'rbs': 'https://www.natwest.com/banking-with-natwest/how-to/send-money-abroad.html',
  'remitly': 'https://www.remitly.com',
  'revolut': 'https://www.revolut.com/money-transfer/',
  'ria': 'https://www.riamoneytransfer.com',
  'sabadell': 'https://www.sabadell.com',
  'scotiabank': 'https://www.scotiabank.com',
  'skrill': 'https://www.skrill.com/en/transfer-money/',
  'starling-bank': 'https://www.starlingbank.com/send-money-abroad/',
  'swedbank-ab': 'https://www.swedbank-ab.com',
  'td-bank': 'https://www.td-bank.com',
  'transfergo': 'https://www.transfergo.com/send-money-abroad',
  'torfx': 'https://www.torfx.com',
  'transferwise': 'https://www.wise.com',
  'unicredit': 'https://www.unicredit.com',
  'western-union': 'https://www.westernunion.com/gb/en/web/send-money/start',
  'westernunion': 'https://www.westernunion.com/gb/en/web/send-money/start',
  'westpac-nz': 'https://www.westpac-nz.com',
  'wise': 'https://www.wise.com',
  'world-remit': 'https://www.world-remit.com',
  'worldfirst': 'https://www.worldfirst.com',
  'worldremit': 'https://www.worldremit.com',
  'xe': 'https://www.xe.com',
  'xoom': 'https://www.xoom.com',
  'zkb': 'https://www.zkb.com'
};

// Try to load any saved providers from localStorage when the module first loads
try {
  const savedProviders = localStorage.getItem('providerWebsites');
  if (savedProviders) {
    // Change the merge order so the websiteMap (from source code) takes precedence
    // over localStorage values
    websiteMap = { ...JSON.parse(savedProviders), ...websiteMap };
    
    // Check specifically for starling-bank to ensure it has the correct URL
    if (websiteMap['starling-bank'] !== 'https://www.starlingbank.com/send-money-abroad/') {
      websiteMap['starling-bank'] = 'https://www.starlingbank.com/send-money-abroad/';
      
      // Update localStorage with the corrected URL
      const updatedProviders = JSON.parse(localStorage.getItem('providerWebsites') || '{}');
      updatedProviders['starling-bank'] = 'https://www.starlingbank.com/send-money-abroad/';
      localStorage.setItem('providerWebsites', JSON.stringify(updatedProviders));
    }
  }
} catch (error) {
  console.error('Error loading saved provider websites:', error);
}

/**
 * Component to display a provider's information in a card
 */
const ProviderCard = ({ 
  provider, 
  index, 
  fromCurrency, 
  toCurrency, 
  amount,
  id,
  name,
  logo,
  rating,
  receiveAmount,
  totalFees,
  rate,
  transferTime,
  transferFee,
  exchangeRateMargin,
  features = [],
  fetchedRating,
  trustpilotRating,
  ratingsLoading
}) => {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [showDetailsPopup, setShowDetailsPopup] = React.useState(false);

  // Debug provider data - log once when component mounts
  React.useEffect(() => {
    console.log('Provider data:', { 
      name: provider?.name || name,
      providerCode: provider?.providerCode,
      code: provider?.code,
      fullProvider: provider
    });
    
    // Set loaded state after a short delay to avoid flashing
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 150);
    
    return () => clearTimeout(timer);
  }, []);

  // The provider code to use for the Trustpilot rating
  const getProviderCode = () => {
    // First check if we have a direct code
    if (provider?.code) {
      return provider.code.toLowerCase();
    }
    
    // Then check for providerCode 
    if (provider?.providerCode) {
      return provider.providerCode.toLowerCase();
    }
    
    // Check if providerId is in the format "provider-{code}"
    if (provider?.providerId && provider.providerId.startsWith('provider-')) {
      const extractedCode = provider.providerId.split('provider-')[1];
      // Only use the extracted code if it's not numeric
      if (isNaN(extractedCode)) {
        return extractedCode.toLowerCase();
      }
    }
    
    // Fall back to formatted name if available
    if (name) {
      return name.toLowerCase().replace(/\s+/g, '-');
    }
    
    // Last resort - use index with fallback
    return `provider-${index || '0'}`;
  };
  
  const providerCode = getProviderCode();
  console.log('Using provider code for Trustpilot:', providerCode);

  // Generate rating visualization elements
  const renderRating = (ratingValue) => {
    // Check for loading state first
    if (ratingsLoading) {
      return <div className="text-xs text-gray-400 animate-pulse">Loading rating...</div>;
    }
    
    // Check if fetchedRating is available (and is an object with 'value')
    if (fetchedRating && typeof fetchedRating === 'object' && fetchedRating.value != null) {
      ratingValue = fetchedRating.value;
      const sourceText = fetchedRating.source ? `(${fetchedRating.source})` : '';
      
      const filledCircles = Math.floor(ratingValue);
      const hasHalf = ratingValue % 1 >= 0.5;
      const emptyCircles = 5 - Math.ceil(ratingValue);
      
      return (
        <div className="flex items-center">
          {[...Array(filledCircles)].map((_, i) => (
            <div key={`filled-${i}`} className="w-2 h-2 rounded-full bg-yellow-400 mr-1"></div>
          ))}
          {hasHalf && (
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-yellow-400 to-gray-200 mr-1"></div>
          )}
          {[...Array(emptyCircles)].map((_, i) => (
            <div key={`empty-${i}`} className="w-2 h-2 rounded-full bg-gray-200 mr-1"></div>
          ))}
          <div className="ml-1 flex items-center text-xs text-gray-500">
            <ThumbsUp size={10} className="mr-1" /> {ratingValue.toFixed(1)} <span className="ml-1 text-gray-400 text-[10px]">{sourceText}</span>
          </div>
        </div>
      );
    } else if (fetchedRating === null) {
      // Explicitly handle case where rating could not be fetched
      return <div className="text-xs text-gray-400">Rating N/A</div>;
    }
    
    // Fallback if fetchedRating is undefined (still loading maybe? or initial state)
    // Or keep showing the default rating if needed
    // For now, let's show N/A if not loading and no fetched rating available
    return <div className="text-xs text-gray-400">Rating N/A</div>;
  };

  // Format transfer time for display
  const formatTransferTime = () => {
    // First check if we have a formatted transferTime string
    if (provider?.transferTime || transferTime) {
      const timeValue = provider?.transferTime || transferTime;
      
      // Check if this is an ISO date string (delivered from the Wise API)
      if (timeValue && typeof timeValue === 'string' && timeValue.includes('T') && timeValue.includes('Z')) {
        try {
          // Try to parse the ISO date string
          const deliveryDate = new Date(timeValue);
          const now = new Date();
          
          // Calculate hours difference
          const diffHours = Math.round((deliveryDate - now) / (1000 * 60 * 60));
          
          // If it's the same day
          if (diffHours < 24 && deliveryDate.getDate() === now.getDate()) {
            if (diffHours <= 1) {
              return 'Within 1 hour';
            }
            return `Within ${diffHours} hours`;
          }
          
          // If it's tomorrow
          const tomorrow = new Date(now);
          tomorrow.setDate(tomorrow.getDate() + 1);
          if (deliveryDate.getDate() === tomorrow.getDate() && 
              deliveryDate.getMonth() === tomorrow.getMonth() && 
              deliveryDate.getFullYear() === tomorrow.getFullYear()) {
            return 'Tomorrow';
          }
          
          // If it's within a week
          const daysDiff = Math.round((deliveryDate - now) / (1000 * 60 * 60 * 24));
          if (daysDiff <= 7) {
            return `${daysDiff} days`;
          }
          
          // Format as date
          return deliveryDate.toLocaleDateString();
        } catch (e) {
          // If parsing fails, just return the string
          return timeValue;
        }
      }
      
      return timeValue;
    }
    
    // Fall back to hours format
    const timeHours = provider?.transferTimeHours || provider?.timeHours || { min: null, max: null };
    
    if (timeHours.min !== null && timeHours.max !== null) {
      if (timeHours.min === timeHours.max) {
        return `${timeHours.min} hours`;
      }
      return `${timeHours.min}-${timeHours.max} hours`;
    }
    
    return 'Unknown';
  };

  // Wrap icon components to prevent flashing
  const IconWrapper = ({ children }) => (
    <span className={isLoaded ? 'opacity-100' : 'opacity-0'} style={{ transition: 'opacity 0.2s ease-in-out' }}>
      {children}
    </span>
  );

  // Handle opening and closing the details popup
  const openDetailsPopup = () => {
    setShowDetailsPopup(true);
    // Prevent body scrolling when popup is open
    document.body.style.overflow = 'hidden';
  };

  const closeDetailsPopup = () => {
    setShowDetailsPopup(false);
    // Restore body scrolling
    document.body.style.overflow = '';
  };

  return (
    <>
      {/* Shimmer animation style - only rendered if not already present from ResultsView */}
      <style jsx="true" global="true">{`
        .text-shimmer {
          background: linear-gradient(
            to right,
            #3CBF7A 20%,
            #4dd88a 40%,
            #34a86b 60%,
            #3CBF7A 80%
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
      
      <div 
        id={id}
        className={`rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow 
          ${index === 0 
            ? 'border-2 border-indigo-600 bg-white' 
            : 'border border-gray-200 bg-white'} ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        style={{ transitionDelay: `${index * 50}ms` }}
      >
        {/* Card Header - Provider info and amount */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex flex-col items-start">
            <div className="mb-1">
              <img 
                src={provider?.logo || logo || '/images/providers/default.png'} 
                alt={`${provider?.name || name || 'Provider'} logo`} 
                className="h-32 w-32 object-contain"
                onError={(e) => {
                  // Add specific fallbacks for XE, TorFX, Wise, Western Union, then default
                  const code = (provider?.providerCode || '').toLowerCase();
                  let fallbackUrl = '/images/providers/default.png';
                  if (code === 'xe') {
                    fallbackUrl = '/images/providers/xe.png';
                  } else if (code === 'torfx') {
                    fallbackUrl = '/images/providers/torfx.png';
                  } else if (code === 'wise') {
                    fallbackUrl = '/images/providers/wise.png';
                  } else if (code === 'western-union' || code === 'westernunion') {
                    fallbackUrl = '/images/providers/westernunion.png';
                  }
                  // Prevent infinite onError loop
                  e.target.onerror = null;
                  // Try absolute first, then relative as fallback
                  e.target.src = fallbackUrl;
                  e.target.onerror = () => { e.target.src = fallbackUrl.startsWith('/') ? fallbackUrl.substring(1) : '/' + fallbackUrl; };
                }}
              />
            </div>
            {/* Pass the trustpilotRating prop to the TrustpilotRating component */}
            {providerCode && (
              <div className="mt-2 mb-2">
                <TrustpilotRating 
                  providerName={providerCode} 
                  preloadedRating={trustpilotRating}
                />
              </div>
            )}
            {/* Fallback to the old rating display if no providerCode is available */}
            {!providerCode && renderRating(provider?.rating || rating)}
          </div>
          
          <div className="text-right">
            {/* Add Indicative label for TorFX, XE, and Profee */}
            {(
              provider?.providerCode?.toLowerCase() === 'torfx' ||
              provider?.providerCode?.toLowerCase() === 'xe' ||
              provider?.providerCode?.toLowerCase() === 'profee' ||
              (provider?.name || name || '').toLowerCase().includes('torfx') ||
              (provider?.name || name || '').toLowerCase().includes('xe') ||
              (provider?.name || name || '').toLowerCase().includes('profee')
            ) && (
              <div className="text-xs font-medium text-amber-600 bg-amber-50 py-1 px-2 rounded-full mb-2 inline-block">
                Indicative
              </div>
            )}
            <div className="text-xs uppercase font-medium text-indigo-600">They receive</div>
            <div className="text-2xl font-bold">
              <span className="text-shimmer">
                {getCurrencySymbol(toCurrency)} {formatAmount(provider?.amountReceived || receiveAmount || 0)}
              </span>
            </div>
            <div className="text-xs text-gray-500 mt-1 bg-indigo-50 py-0.5 px-2 rounded-full inline-block">
              Fees: {getCurrencySymbol(fromCurrency)} {formatAmount(provider?.transferFee || transferFee || 0)}
            </div>
          </div>
        </div>
        
        {/* Card Body - Exchange details */}
        <div className="p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Exchange Rate */}
            <div className="flex items-start">
              <div className="w-1 h-full min-h-[40px] bg-indigo-400 mr-3 self-stretch rounded-full"></div>
              <div className="text-left">
                <div className="text-xs text-gray-500 font-medium mb-1">Exchange Rate</div>
                <div className="font-bold text-left">{`1 ${fromCurrency} = ${(provider?.rate || rate || 0).toFixed(4)} ${toCurrency}`}</div>
              </div>
            </div>
            
            {/* Delivery Time */}
            <div className="flex items-start">
              <div className="w-1 h-full min-h-[40px] bg-indigo-400 mr-3 self-stretch rounded-full"></div>
              <div className="text-left">
                <div className="text-xs text-gray-500 font-medium mb-1">Delivery Time</div>
                <div>{formatTransferTime()}</div>
              </div>
            </div>
            
            {/* Fees */}
            <div className="flex items-start">
              <div className="w-1 h-full min-h-[40px] bg-indigo-400 mr-3 self-stretch rounded-full"></div>
              <div className="text-left">
                <div className="text-xs text-gray-500 font-medium mb-1">Fee</div>
                <div>{getCurrencySymbol(fromCurrency)} {formatAmount(provider?.transferFee || transferFee || 0)}</div>
              </div>
            </div>
            
            {/* Rate Margin for all providers */}
            <div className="flex items-start">
              <div className="w-1 h-full min-h-[40px] bg-indigo-400 mr-3 self-stretch rounded-full"></div>
              <div className="text-left">
                <div className="text-xs text-gray-500 font-medium mb-1">
                  Rate Margin
                </div>
                <div>
                  {provider?.effectiveRate && provider?.baseRate ? (
                    // Compare effective rate with base rate to determine if it's above or below mid-market
                    provider.effectiveRate > provider.baseRate ? (
                      <div className="flex items-center text-green-600">
                        <ArrowUp size={16} className="mr-1" />
                        <span>{`${((provider.effectiveRate / provider.baseRate - 1) * 100).toFixed(2)}% above mid-market`}</span>
                      </div>
                    ) : provider.effectiveRate < provider.baseRate ? (
                      <div className="flex items-center text-red-600">
                        <ArrowDown size={16} className="mr-1" />
                        <span>{`${((1 - provider.effectiveRate / provider.baseRate) * 100).toFixed(2)}% below mid-market`}</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-gray-600">
                        <Minus size={16} className="mr-1" />
                        <span>Same as mid-market</span>
                      </div>
                    )
                  ) : (
                    // Fallback to the original margin percentage display
                    `${((provider?.exchangeRateMargin || exchangeRateMargin || 0) * 100).toFixed(2)}%`
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Features */}
          <div className="mt-5 flex flex-wrap items-center">
            {/* Temporarily hidden until needed
            <div className="text-xs text-gray-500 font-medium mr-2">Features:</div>
            */}
            <div className="flex flex-wrap">
              {(provider?.features || features).map((feature, idx) => (
                <span key={idx} className="flex items-center text-xs text-indigo-700 mr-3 mb-1">
                  <IconWrapper>
                    <Check className="w-4 h-4 text-green-500 mr-1.5" />
                  </IconWrapper>
                  {feature}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        {/* Card Footer - CTA */}
        <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-end">
          {/* Temporarily hidden until fetching is sorted
          <button 
            className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline flex items-center"
            onClick={openDetailsPopup}
          >
            See full details
          </button>
          */}
          
          <a 
            href={getProviderWebsite(provider?.providerCode || provider?.code || provider?.name || name || '')} 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md flex items-center justify-center font-medium transition-colors"
          >
            Get Deal
            <ExternalLink size={14} className="ml-1.5" />
          </a>
        </div>
      </div>

      {/* Provider Details Popup */}
      {showDetailsPopup && (
        <ProviderDetailsPopup 
          provider={provider || { 
            name, 
            code: name?.toLowerCase().replace(/\s+/g, '-'), 
            logo, 
            rate, 
            transferFee, 
            transferTime 
          }} 
          onClose={closeDetailsPopup}
          fromCurrency={fromCurrency}
          toCurrency={toCurrency}
        />
      )}
    </>
  );
};

// Function to generate provider website URL based on provider code
const getProviderWebsite = (providerCode) => {
  console.log('Getting website for provider:', providerCode);
  
  // Convert to lowercase for consistent matching
  const code = providerCode.toLowerCase();
  console.log('Lowercase provider code:', code);
  console.log('Current websiteMap:', websiteMap);
  
  // If the provider is not in our map, try to generate a website URL based on the code
  if (!websiteMap[code] && code) {
    console.log(`Adding new provider to websiteMap: ${code}`);
    
    // Generate a likely website URL
    const generatedUrl = `https://www.${code}.com`;
    
    // Add it to both the current map and localStorage for future use
    websiteMap[code] = generatedUrl;
    console.log('Updated websiteMap:', websiteMap);
    
    try {
      // Get existing saved providers
      const savedProviders = localStorage.getItem('providerWebsites') || '{}';
      const updatedProviders = JSON.parse(savedProviders);
      
      // Add the new provider
      updatedProviders[code] = generatedUrl;
      
      // Save back to localStorage
      localStorage.setItem('providerWebsites', JSON.stringify(updatedProviders));
      console.log(`Saved provider ${code} to localStorage:`, updatedProviders);
    } catch (error) {
      console.error('Error saving provider website:', error);
    }
  }
  
  // Return website URL if it exists in the map, otherwise default to a search
  return websiteMap[code] || `https://www.google.com/search?q=${encodeURIComponent(providerCode)}+money+transfer`;
};

export default ProviderCard; 