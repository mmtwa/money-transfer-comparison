import React, { useRef, useEffect, useState } from 'react';
import { ExternalLink, Check, ThumbsUp, ArrowUp, ArrowDown, Minus, Clock, Info, Shield } from 'lucide-react';
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
  'regency fx': 'https://www.regencyfx.com',
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

// Add a helper function to extract clean provider name
const getCleanProviderName = (provider) => {
  // Extract name from provider object
  let name = '';
  
  if (provider?.name) {
    name = provider.name;
  } else if (typeof provider === 'string') {
    name = provider;
  }
  
  // Capitalize first letter of each word
  name = name.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
  
  // Remove any non-alphanumeric characters except spaces
  name = name.replace(/[^a-zA-Z0-9\s]/g, '');
  
  // Limit to first two words to keep button width reasonable
  const words = name.split(' ');
  if (words.length > 2) {
    name = words.slice(0, 2).join(' ');
  }
  
  return name || 'Provider';
};

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
  trustpilotRating,
  ratingsLoading,
  onRatingDetermined
}) => {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [showDetailsPopup, setShowDetailsPopup] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);
  const [showTooltip, setShowTooltip] = React.useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const cardRef = useRef(null);
  const mobileTooltipRef = useRef(null);
  const desktopTooltipRef = useRef(null);
  // Simple central registry for active card
  if (typeof window !== 'undefined' && !window.activeCardId) {
    window.activeCardId = null;
  }

  // Debug provider data - log once when component mounts
  React.useEffect(() => {
    // Only log for non-TorFX providers to avoid console spam
    const providerCode = provider?.providerCode?.toLowerCase();
    const providerName = (provider?.name || name || '').toLowerCase();
    
    if (providerCode !== 'torfx' && !providerName.includes('torfx')) {
      // Skip logging for TorFX to avoid console spam
      console.log('Provider data:', { 
        name: provider?.name || name,
        providerCode: provider?.providerCode,
        code: provider?.code
      });
    }
    
    // Set loaded state after a short delay to avoid flashing
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 150);
    
    return () => clearTimeout(timer);
  }, [name, provider]);

  // Create a central control system if it doesn't exist yet
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.cardController) {
      // Create a global controller for all cards
      window.cardController = {
        cards: {},
        
        // Register a card with the controller
        registerCard: function(id, ref) {
          this.cards[id] = ref;
        },
        
        // Unregister a card
        unregisterCard: function(id) {
          delete this.cards[id];
        },
        
        // Calculate and apply scaling effects based on distance from center
        updateCardEffects: function() {
          // Get viewport dimensions
          const viewportHeight = window.innerHeight;
          const viewportCenter = viewportHeight * 0.55;
          
          // Maximum distance at which the card still gets some effect
          // (approximately 70% of viewport height)
          const maxEffectDistance = viewportHeight * 0.7;
          
          // Process each card
          Object.keys(this.cards).forEach(id => {
            const cardElement = this.cards[id];
            if (cardElement) {
              const rect = cardElement.getBoundingClientRect();
              const cardCenter = rect.top + rect.height / 2;
              
              // Distance from the center of the viewport (absolute value)
              const distanceFromCenter = Math.abs(cardCenter - viewportCenter);
              
              // If the card is within our effect range
              if (distanceFromCenter <= maxEffectDistance) {
                // Calculate a factor between 0 and 1, where:
                // 0 = at maxEffectDistance or further (minimum effect)
                // 1 = at the exact center (maximum effect)
                const effectFactor = Math.max(0, 1 - (distanceFromCenter / maxEffectDistance));
                
                // Apply smooth scaling - cubic easing for a more natural feel
                // Scale ranges from 1.0 (no effect) to 1.05 (full effect)
                const scale = 1 + (0.05 * Math.pow(effectFactor, 3));
                
                // Apply smooth shadow - quartic easing for shadow intensity
                // Shadow spread ranges from 0px to 15px
                const shadowSpread = 15 * Math.pow(effectFactor, 4);
                // Shadow blur ranges from 8px to 30px
                const shadowBlur = 8 + (22 * Math.pow(effectFactor, 3));
                
                // Set z-index based on proximity to center (higher = closer to center)
                // Changed from 10-100 range to 1-5 range to prevent overlapping other UI elements
                const zIndex = Math.floor(1 + (4 * effectFactor));
                
                // Apply combined effects
                cardElement.style.transform = `scale(${scale})`;
                cardElement.style.boxShadow = `0 ${shadowSpread}px ${shadowBlur}px rgba(0, 0, 0, ${0.05 + (0.03 * effectFactor)})`;
                cardElement.style.zIndex = zIndex;
              } else {
                // Reset to default state for cards outside the effect range
                cardElement.style.transform = 'scale(1)';
                cardElement.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
                cardElement.style.zIndex = '1';
              }
            }
          });
        }
      };
    }
  }, []);

  // Register this card with the controller
  useEffect(() => {
    if (!cardRef.current || !window.cardController) return;
    
    // Register this card
    window.cardController.registerCard(id, cardRef.current);
    
    // Set up scroll handler
    const handleScroll = () => {
      if (window.cardController) {
        window.cardController.updateCardEffects();
      }
    };
    
    // Throttle to improve performance
    const throttle = (func, limit) => {
      let inThrottle;
      return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
          func.apply(context, args);
          inThrottle = true;
          setTimeout(() => inThrottle = false, limit);
        }
      };
    };
    
    const throttledScroll = throttle(handleScroll, 50); // Reduced from 150ms to 50ms for smoother effect
    
    // Add event listener
    window.addEventListener('scroll', throttledScroll);
    // Also listen for resize events to recalculate on window resize
    window.addEventListener('resize', throttledScroll);
    
    // Initial check after a delay to ensure layout is complete
    setTimeout(handleScroll, 300);
    
    // Cleanup
    return () => {
      window.removeEventListener('scroll', throttledScroll);
      window.removeEventListener('resize', throttledScroll);
      window.cardController.unregisterCard(id);
    };
  }, [id]);

  // Auto-hide tooltip after 5 seconds
  useEffect(() => {
    let timeoutId;
    if (tooltipVisible) {
      timeoutId = setTimeout(() => {
        setTooltipVisible(false);
      }, 5000);
    }
    
    // Cleanup timeout
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [tooltipVisible]);

  // Add a new useEffect to handle positioning of the tooltip relative to the card
  useEffect(() => {
    if (tooltipVisible && mobileTooltipRef.current && cardRef.current) {
      // For mobile only
      if (window.innerWidth < 640) {
        // This function will position the tooltip
        const positionTooltip = () => {
          // Position the tooltip in the center of the card
          const cardRect = cardRef.current.getBoundingClientRect();
          const cardCenterX = cardRect.left + (cardRect.width / 2);
          const cardCenterY = cardRect.top + (cardRect.height / 2);
          
          mobileTooltipRef.current.style.position = 'fixed';
          mobileTooltipRef.current.style.top = `${cardCenterY}px`;
          mobileTooltipRef.current.style.left = `${cardCenterX}px`;
          mobileTooltipRef.current.style.transform = 'translate(-50%, -50%)';
          mobileTooltipRef.current.style.maxWidth = `${Math.min(300, cardRect.width * 0.9)}px`;
        };
        
        // Position immediately and on scroll
        positionTooltip();
        
        // Add scroll listener to reposition on scroll
        window.addEventListener('scroll', positionTooltip);
        window.addEventListener('resize', positionTooltip);
        
        // Clean up
        return () => {
          window.removeEventListener('scroll', positionTooltip);
          window.removeEventListener('resize', positionTooltip);
        };
      }
    }
  }, [tooltipVisible]);

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

  // Generate rating visualization elements
  const renderRating = (ratingValue) => {
    // Check for loading state first
    if (ratingsLoading) {
      return <div className="text-xs text-gray-400 animate-pulse">Loading rating...</div>;
    }
    
    // If we have a rating value, render it
    if (ratingValue) {
      const filledCircles = Math.floor(ratingValue);
      const hasHalf = ratingValue % 1 >= 0.5;
      const emptyCircles = 5 - Math.ceil(ratingValue);
      
      // Report the rating value back to parent component for sorting purposes
      if (typeof onRatingDetermined === 'function') {
        onRatingDetermined(ratingValue);
      }
      
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
            <ThumbsUp size={10} className="mr-1" /> {ratingValue.toFixed(1)}
          </div>
        </div>
      );
    }
    
    // Fallback if no rating is available
    if (typeof onRatingDetermined === 'function') {
      onRatingDetermined(0); // Report 0 for sorting when no rating is available
    }
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
            return `Within ${daysDiff} days`;
          }
          
          // Otherwise show the date
          return deliveryDate.toLocaleDateString();
        } catch (error) {
          console.error('Error parsing delivery date:', error);
          return timeValue;
        }
      }
      
      return timeValue;
    }
    
    // Default fallback
    return 'Varies';
  };

  // Update the amount received calculation
  const calculateAmountReceived = () => {
    if (provider?.amountReceived) {
      return provider.amountReceived;
    }
    
    if (provider?.rate && amount) {
      const rate = provider.rate;
      const transferFee = provider?.transferFee || 0;
      const amountAfterFee = amount - transferFee;
      return amountAfterFee * rate;
    }
    
    return 0;
  };

  // Wrap icon components to prevent flashing
  // eslint-disable-next-line no-unused-vars
  const IconWrapper = ({ children }) => (
    <span className={isLoaded ? 'opacity-100' : 'opacity-0'} style={{ transition: 'opacity 0.2s ease-in-out' }}>
      {children}
    </span>
  );

  // Handle opening and closing the details popup
  // eslint-disable-next-line no-unused-vars
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

  // Check if provider is FCA authorized based on provider data
  const isFcaAuthorized = React.useMemo(() => {
    if (!provider) return false;
    
    // Check provider code first (direct match)
    const providerCode = (provider.providerCode || '').toLowerCase();
    
    // List of known FCA authorized providers based on the regulations data in providerScraperService
    const fcaProviders = [
      'wise', 'transferwise', 'westernunion', 'wu', 'moneygram', 'ofx',
      'worldremit', 'remitly', 'xe', 'torfx', 'instarem', 'ria', 'skrill'
    ];
    
    // Check if the provider code matches any of the known FCA authorized providers
    if (fcaProviders.includes(providerCode)) return true;
    
    // Check the provider name as fallback
    const providerName = (provider.name || name || '').toLowerCase();
    return fcaProviders.some(p => providerName.includes(p));
  }, [provider, name]);

  return (
    <>
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

        .provider-card {
          transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
          transform-origin: center;
          will-change: transform, box-shadow;
          transform: scale(1) rotate(0deg);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          z-index: 1;
        }

        .provider-card:hover {
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
          z-index: 5;
        }
        
        .glass-effect {
          background: rgba(255, 255, 255, 0.95);
        }

        .feature-tag {
          transition: all 0.2s ease;
        }

        .feature-tag:hover {
          transform: scale(1.05);
          background: rgba(79, 70, 229, 0.1);
        }

        .provider-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 120px;
          max-width: 180px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .tooltip-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.4);
          z-index: 9998;
          cursor: pointer;
          touch-action: auto;
        }

        .tooltip-popup {
          position: fixed !important;
          z-index: 9999 !important;
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2) !important;
          padding: 16px !important;
          background-color: white;
          border-radius: 8px;
          border: 1px solid #E5E7EB;
          width: 320px;
          min-width: 250px;
          left: 50% !important;
          top: 50% !important;
          transform: translate(-50%, -50%) !important;
          display: flex;
          flex-direction: column;
          max-width: 90vw;
          text-align: center;
        }

        @media (max-width: 640px) {
          .mobile-stack {
            flex-direction: column;
          }
          
          .mobile-center {
            text-align: center;
          }
          
          .mobile-compact-card .provider-img {
            height: 26vw;
            width: 26vw;
            max-height: 100px;
            max-width: 100px;
            min-height: 70px;
            min-width: 70px;
          }
          
          .mobile-compact-card .mobile-info-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 8px;
          }
          
          .mobile-compact-card .mobile-header {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            padding: 8px 12px;
          }
          
          .mobile-compact-card .mobile-provider-info {
            display: flex;
            align-items: center;
          }
          
          .mobile-compact-card .mobile-detail-item {
            padding: 8px 10px;
            background: white;
            border-radius: 6px;
            text-align: left;
          }
          
          .mobile-compact-card .mobile-detail-label {
            font-size: 13px;
            color: #6B7280;
            margin-bottom: 2px;
            text-align: left;
            font-weight: 500;
          }
          
          .mobile-compact-card .mobile-detail-value {
            font-size: 0.8rem;
            font-weight: 800;
            text-align: left;
          }
          
          .mobile-compact-card .mobile-features {
            display: flex;
            flex-wrap: wrap;
            gap: 4px;
            margin-top: 8px;
          }
          
          .mobile-compact-card .mobile-feature-tag {
            font-size: 9px;
            padding: 2px 6px;
            border-radius: 4px;
            background: #EEF2FF;
            color: #4F46E5;
            white-space: nowrap;
          }
          
          .mobile-compact-card .mobile-badge {
            font-size: 9px;
            padding: 4px 10px;
            border-radius: 4px;
            display: inline-flex;
            align-items: center;
            cursor: pointer;
            user-select: none;
            -webkit-tap-highlight-color: transparent;
            background-color: #FEF3C7;
            color: #D97706;
            border: 1px solid #FBBF24;
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
          }
          
          .mobile-compact-card .mobile-footer {
            padding: 8px 12px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-top: 1px solid #F3F4F6;
          }
          
          .mobile-compact-card .mobile-amount-container {
            text-align: right;
          }
          
          .mobile-compact-card .mobile-indicative-label {
            display: block;
            margin-bottom: 12px;
          }
          
          .mobile-compact-card .mobile-amount {
            font-size: 1.6rem;
            font-weight: 800;
            margin-top: 0;
            line-height: 1.2;
          }
          
          .mobile-compact-card .mobile-rate-margin {
            font-size: 12px;
            margin-top: 4px;
          }

          .provider-card:hover {
            transform: scale(1.005);
            box-shadow: 0 3px 10px rgba(0, 0, 0, 0.06);
          }
          
          .tooltip-backdrop {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.4);
            z-index: 2147483646;
            cursor: pointer;
            touch-action: auto;
          }

          .tooltip-popup {
            position: fixed !important;
            z-index: 2147483647 !important;
            box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2) !important;
            padding: 16px !important;
            background-color: white;
            border-radius: 8px;
            border: 1px solid #E5E7EB;
            width: auto;
            min-width: 250px;
            max-width: 90vw;
            left: 50% !important;
            top: 50% !important;
            transform: translate(-50%, -50%) !important;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
          }

          .mobile-compact-card .get-deal-btn {
            padding: 5px 12px;
            font-size: 0.88rem;
            border-radius: 8px;
            min-width: 110px;
            max-width: 150px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      `}</style>
      
      <div 
        id={id}
        ref={cardRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`rounded-xl overflow-hidden provider-card glass-effect mobile-compact-card
          ${index === 0 
            ? 'border-2 border-indigo-600' 
            : 'border border-gray-200'} 
          ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        style={{ 
          transitionDelay: `${index * 50}ms`,
          position: 'relative',
        }}
      >
        {/* Desktop Layout - Same as before */}
        <div className="hidden sm:block">
          {/* Card Header - Provider info and amount */}
          <div className="flex flex-row items-center justify-between p-4 border-b border-gray-100">
            <div className="flex flex-row items-center">
              <div className="relative group">
                <img 
                  src={provider?.logo || logo || '/images/providers/default.png'} 
                  alt={`${provider?.name || name || 'Provider'} logo`} 
                  className="h-28 w-28 object-contain transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    const code = (provider?.providerCode || '').toLowerCase();
                    let fallbackUrl = '/images/providers/default.png';
                    if (code === 'xe') fallbackUrl = '/images/providers/xe.png';
                    else if (code === 'torfx') fallbackUrl = '/images/providers/torfx.png';
                    else if (code === 'wise') fallbackUrl = '/images/providers/wise.png';
                    else if (code === 'western-union' || code === 'westernunion') fallbackUrl = '/images/providers/westernunion.png';
                    else if (code === 'ofx' || (provider?.name || name || '').toLowerCase().includes('ofx')) fallbackUrl = '/images/providers/OFX_Logo.webp';
                    e.target.onerror = null;
                    e.target.src = fallbackUrl;
                    e.target.onerror = () => { e.target.src = fallbackUrl.startsWith('/') ? fallbackUrl.substring(1) : '/' + fallbackUrl; };
                  }}
                />
              </div>
              
              <div className="ml-3">
                {providerCode && (
                  <TrustpilotRating 
                    providerName={providerCode} 
                    preloadedRating={trustpilotRating}
                    onRatingDetermined={onRatingDetermined}
                  />
                )}
                {!providerCode && renderRating(provider?.rating || rating)}
              </div>
            </div>
            
            <div className="text-right">
              {/* Desktop version indicative rate */}
              {(
                provider?.providerCode?.toLowerCase() === 'torfx' ||
                provider?.providerCode?.toLowerCase() === 'xe' ||
                provider?.providerCode?.toLowerCase() === 'profee' ||
                provider?.providerCode?.toLowerCase() === 'regencyfx' ||
                provider?.providerCode?.toLowerCase() === 'pandaremit' ||
                provider?.providerCode?.toLowerCase() === 'ofx' ||
                (provider?.name || name || '').toLowerCase().includes('torfx') ||
                (provider?.name || name || '').toLowerCase().includes('xe') ||
                (provider?.name || name || '').toLowerCase().includes('profee') ||
                (provider?.name || name || '').toLowerCase().includes('regency') ||
                (provider?.name || name || '').toLowerCase().includes('panda') ||
                (provider?.name || name || '').toLowerCase().includes('ofx')
              ) && (
                <div className="relative inline-block">
                  <div 
                    className="inline-flex items-center text-xs font-medium text-amber-600 bg-amber-50 py-1 px-2.5 rounded-full mb-1.5 cursor-pointer"
                    onClick={() => setTooltipVisible(true)}
                  >
                    <Info size={12} className="mr-1" />
                    Indicative Rate
                  </div>
                  {tooltipVisible && (
                    <>
                      <div 
                        className="tooltip-backdrop" 
                        onClick={() => setTooltipVisible(false)}
                        onTouchStart={() => setTooltipVisible(false)}
                      ></div>
                      <div 
                        ref={desktopTooltipRef}
                        className="tooltip-popup"
                      >
                        <div className="text-sm font-medium mb-2 text-gray-800">Indicative Rate</div>
                        <div className="text-xs text-gray-600 leading-relaxed">
                          While we do our best to get accurate rates from this provider, the rate shown is an indication based on current market variables and may change when you proceed with the transfer.
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
              <div className="text-xs uppercase font-medium text-indigo-600 tracking-wide">They receive</div>
              <div className="text-2xl font-bold mt-0.5">
                <span className="text-shimmer">
                  {getCurrencySymbol(toCurrency)} {formatAmount(calculateAmountReceived())}
                </span>
              </div>
              <div className="text-xs text-gray-600 mt-1 bg-indigo-50 py-0.5 px-2 rounded-full inline-flex items-center">
                <span className="mr-1">Fees:</span>
                {getCurrencySymbol(fromCurrency)} {formatAmount(provider?.transferFee || transferFee || 0)}
              </div>
            </div>
          </div>
          
          {/* Card Body - Exchange details */}
          <div className="p-4">
            <div className="grid grid-cols-2 gap-3">
              {/* Exchange Rate */}
              <div className="flex items-start group">
                <div className="w-1 h-full min-h-[30px] bg-indigo-400 mr-2 self-stretch rounded-full transition-all duration-300 group-hover:bg-indigo-500"></div>
                <div className="text-left">
                  <div className="text-xs text-gray-600 font-medium mb-0.5">Exchange Rate</div>
                  <div className="font-bold text-sm">{`1 ${fromCurrency} = ${(provider?.rate || rate || 0).toFixed(4)} ${toCurrency}`}</div>
                </div>
              </div>
              
              {/* Delivery Time */}
              <div className="flex items-start group">
                <div className="w-1 h-full min-h-[30px] bg-indigo-400 mr-2 self-stretch rounded-full transition-all duration-300 group-hover:bg-indigo-500"></div>
                <div className="text-left">
                  <div className="text-xs text-gray-600 font-medium mb-0.5 flex items-center">
                    <Clock size={12} className="mr-1" />
                    Delivery Time
                  </div>
                  <div className="font-medium text-sm">{formatTransferTime()}</div>
                </div>
              </div>
              
              {/* Fees */}
              <div className="flex items-start group">
                <div className="w-1 h-full min-h-[30px] bg-indigo-400 mr-2 self-stretch rounded-full transition-all duration-300 group-hover:bg-indigo-500"></div>
                <div className="text-left">
                  <div className="text-xs text-gray-600 font-medium mb-0.5">Fee</div>
                  <div className="font-medium text-sm">{getCurrencySymbol(fromCurrency)} {formatAmount(provider?.transferFee || transferFee || 0)}</div>
                </div>
              </div>
              
              {/* Rate Margin */}
              <div className="flex items-start group">
                <div className="w-1 h-full min-h-[30px] bg-indigo-400 mr-2 self-stretch rounded-full transition-all duration-300 group-hover:bg-indigo-500"></div>
                <div className="text-left">
                  <div className="text-xs text-gray-600 font-medium mb-0.5">Rate Margin</div>
                  <div className="text-sm">
                    {provider?.effectiveRate && provider?.baseRate ? (
                      provider.effectiveRate > provider.baseRate ? (
                        <div className="flex items-center text-green-600 font-medium">
                          <ArrowUp size={12} className="mr-1" />
                          <span>{`${((provider.effectiveRate / provider.baseRate - 1) * 100).toFixed(2)}% above mid-market`}</span>
                        </div>
                      ) : provider.effectiveRate < provider.baseRate ? (
                        <div className="flex items-center text-red-600 font-medium">
                          <ArrowDown size={12} className="mr-1" />
                          <span>{`${((1 - provider.effectiveRate / provider.baseRate) * 100).toFixed(2)}% below mid-market`}</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-gray-600 font-medium">
                          <Minus size={12} className="mr-1" />
                          <span>Same as mid-market</span>
                        </div>
                      )
                    ) : (
                      // Check if this is Wise - if so, show as 0% margin (mid-market rate)
                      (provider?.providerCode?.toLowerCase() === 'wise' || 
                       (provider?.name || '').toLowerCase() === 'wise' ||
                       (provider?.provider?.name || '').toLowerCase() === 'wise') ? (
                        <div className="flex items-center text-green-600 font-medium">
                          <Minus size={12} className="mr-1" />
                          <span>0% (Mid-Market Rate)</span>
                        </div>
                      ) : (
                        provider?.marginPercentage !== undefined ? (
                          provider.marginPercentage > 0 ? (
                            <div className="flex items-center text-green-600 font-medium">
                              <ArrowUp size={12} className="mr-1" />
                              <span>{`${provider.marginPercentage.toFixed(2)}% above mid-market`}</span>
                            </div>
                          ) : provider.marginPercentage < 0 ? (
                            <div className="flex items-center text-red-600 font-medium">
                              <ArrowDown size={12} className="mr-1" />
                              <span>{`${Math.abs(provider.marginPercentage).toFixed(2)}% below mid-market`}</span>
                            </div>
                          ) : (
                            <div className="flex items-center text-gray-600 font-medium">
                              <Minus size={12} className="mr-1" />
                              <span>Same as mid-market</span>
                            </div>
                          )
                        ) : (
                          `${((provider?.exchangeRateMargin || exchangeRateMargin || 0) * 100).toFixed(2)}%`
                        )
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Features */}
            <div className="mt-3">
              <div className="flex flex-wrap gap-1.5">
                {(provider?.features || features).map((feature, idx) => (
                  <span 
                    key={idx} 
                    className="feature-tag inline-flex items-center text-xs text-indigo-700 bg-indigo-50 py-1 px-2 rounded-full"
                  >
                    <Check className="w-3 h-3 text-green-500 mr-1" />
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          {/* Card Footer - CTA */}
          <div className="px-4 py-2 border-t border-gray-100 flex items-center justify-between">
            <div className="flex items-center">
              <Shield size={18} className="text-green-500 mr-1.5" />
              <span className="text-xs text-gray-600">We don't make an affiliate fee or commission. Zilch.</span>
            </div>
            <a 
              href={getProviderWebsite(provider?.providerCode || provider?.code || provider?.name || name || '')} 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-indigo-600 hover:bg-indigo-700 text-white py-1.5 px-4 rounded-lg flex items-center justify-center font-medium text-sm transition-all duration-300 hover:shadow-lg hover:shadow-indigo-200 provider-btn"
              title={`Goto ${getCleanProviderName(provider?.name || name || provider?.providerCode || provider?.code || '')}`}
            >
              Goto {getCleanProviderName(provider?.name || name || provider?.providerCode || provider?.code || '')}
              <ExternalLink size={14} className="ml-1.5 flex-shrink-0" />
            </a>
          </div>
        </div>

        {/* Mobile Layout - Optimized */}
        <div className="block sm:hidden">
          {/* Mobile Header - Provider info & amount */}
          <div className="mobile-header">
            <div className="mobile-provider-info">
              <div className="relative">
                <img
                  src={provider?.logo || logo || '/images/providers/default.png'}
                  alt={`${provider?.name || name || 'Provider'} logo`}
                  className="provider-img object-contain"
                  onError={(e) => {
                    const providerCode = (provider?.providerCode || '').toLowerCase();
                    const providerName = (provider?.name || name || '').toLowerCase();
                    
                    if (providerCode === 'xe' || providerName.includes('xe')) {
                      e.target.src = '/images/providers/xe.png';
                      // If that fails, try without the leading slash
                      e.target.onerror = () => { e.target.src = 'images/providers/xe.png'; };
                    } else if (providerCode === 'wise' || providerName.includes('wise') || providerName.includes('transferwise')) {
                      e.target.src = '/images/providers/wise.png';
                      // If that fails, try without the leading slash
                      e.target.onerror = () => { e.target.src = 'images/providers/wise.png'; };
                    } else if (providerCode === 'western-union' || providerCode === 'westernunion' || 
                              providerName.includes('western') || providerName.includes('union')) {
                      e.target.src = '/images/providers/westernunion.png';
                      // If that fails, try without the leading slash
                      e.target.onerror = () => { e.target.src = 'images/providers/westernunion.png'; };
                    } else if (providerCode === 'ofx' || providerName.includes('ofx')) {
                      e.target.src = '/images/providers/OFX_Logo.webp';
                      // If that fails, try without the leading slash
                      e.target.onerror = () => { e.target.src = 'images/providers/OFX_Logo.webp'; };
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
                  }}
                />
              </div>
            </div>
            
            <div className="mobile-amount-container">
              {(
                provider?.providerCode?.toLowerCase() === 'torfx' ||
                provider?.providerCode?.toLowerCase() === 'xe' ||
                provider?.providerCode?.toLowerCase() === 'profee' ||
                provider?.providerCode?.toLowerCase() === 'regencyfx' ||
                provider?.providerCode?.toLowerCase() === 'pandaremit' ||
                provider?.providerCode?.toLowerCase() === 'ofx' ||
                (provider?.name || name || '').toLowerCase().includes('torfx') ||
                (provider?.name || name || '').toLowerCase().includes('xe') ||
                (provider?.name || name || '').toLowerCase().includes('profee') ||
                (provider?.name || name || '').toLowerCase().includes('regency') ||
                (provider?.name || name || '').toLowerCase().includes('panda') ||
                (provider?.name || name || '').toLowerCase().includes('ofx')
              ) && (
                <div className="relative inline-block mb-1 mobile-indicative-label">
                  <div 
                    className="inline-flex items-center mobile-badge"
                    onClick={() => setTooltipVisible(true)}
                  >
                    <Info size={8} className="mr-0.5" />
                    Indicative
                  </div>
                  {tooltipVisible && (
                    <>
                      <div 
                        className="tooltip-backdrop" 
                        onClick={() => setTooltipVisible(false)}
                        onTouchStart={() => setTooltipVisible(false)}
                      ></div>
                      <div 
                        ref={mobileTooltipRef}
                        className="tooltip-popup"
                      >
                        <div className="text-sm font-medium mb-2 text-gray-800">Indicative Rate</div>
                        <div className="text-xs text-gray-600 leading-relaxed">
                          While we do our best to get accurate rates from this provider, the rate shown is an indication based on current market variables and may change when you proceed with the transfer.
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
              <div className="text-xs uppercase font-medium text-indigo-600 text-right">They receive</div>
              <div className="mobile-amount text-shimmer">
                {getCurrencySymbol(toCurrency)} {formatAmount(calculateAmountReceived())}
              </div>
            </div>
          </div>
          
          {/* Mobile Info Grid */}
          <div className="px-3 pb-2">
            <div className="mobile-info-grid">
              {/* Exchange Rate */}
              <div className="mobile-detail-item">
                <div className="mobile-detail-label">Exchange Rate</div>
                <div className="mobile-detail-value">{`1 ${fromCurrency} = ${(provider?.rate || rate || 0).toFixed(4)} ${toCurrency}`}</div>
              </div>
              
              {/* Delivery Time */}
              <div className="mobile-detail-item">
                <div className="mobile-detail-label flex items-center">
                  <Clock size={8} className="mr-0.5" />
                  Delivery Time
                </div>
                <div className="mobile-detail-value">{formatTransferTime()}</div>
              </div>
              
              {/* Fees */}
              <div className="mobile-detail-item">
                <div className="mobile-detail-label">Fee</div>
                <div className="mobile-detail-value">{getCurrencySymbol(fromCurrency)} {formatAmount(provider?.transferFee || transferFee || 0)}</div>
              </div>
              
              {/* Rating */}
              <div className="mobile-detail-item">
                <div className="mobile-detail-label">Rating</div>
                <div className="mobile-detail-value flex items-center scale-75 origin-left">
                  {providerCode ? (
                    <TrustpilotRating 
                      providerName={providerCode} 
                      preloadedRating={trustpilotRating}
                      onRatingDetermined={onRatingDetermined}
                      compact={true}
                    />
                  ) : (
                    renderRating(provider?.rating || rating)
                  )}
                </div>
              </div>
            </div>
            
            {/* Features - If any */}
            {(provider?.features || features).length > 0 && (
              <div className="mobile-features">
                {(provider?.features || features).slice(0, 3).map((feature, idx) => (
                  <span 
                    key={idx} 
                    className="mobile-feature-tag"
                  >
                    <Check className="w-2 h-2 text-green-500 mr-0.5 inline-block" />
                    {feature}
                  </span>
                ))}
                {(provider?.features || features).length > 3 && (
                  <span className="mobile-feature-tag">
                    +{(provider?.features || features).length - 3} more
                  </span>
                )}
              </div>
            )}
            
            {/* Commission-free message - centered at the bottom of the summary box */}
            <div className="flex items-center justify-center mt-2 border-t border-gray-100 pt-2">
              <Shield size={10} className="text-green-500 mr-1" />
              <span className="text-xs text-gray-600 whitespace-nowrap">We don't make an affiliate fee or commission. Zilch.</span>
            </div>
          </div>
          
          {/* Mobile Footer - Rate Margin & CTA */}
          <div className="mobile-footer">
            <div className="flex flex-col">
              <div className="mobile-rate-margin">
                {provider?.effectiveRate && provider?.baseRate ? (
                  provider.effectiveRate > provider.baseRate ? (
                    <div className="flex items-center text-green-600 text-xs font-medium">
                      <ArrowUp size={8} className="mr-1" />
                      <span>{`${((provider.effectiveRate / provider.baseRate - 1) * 100).toFixed(2)}% above mid-market`}</span>
                    </div>
                  ) : provider.effectiveRate < provider.baseRate ? (
                    <div className="flex items-center text-red-600 text-xs font-medium">
                      <ArrowDown size={8} className="mr-1" />
                      <span>{`${((1 - provider.effectiveRate / provider.baseRate) * 100).toFixed(2)}% below mid-market`}</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-gray-600 text-xs font-medium">
                      <Minus size={8} className="mr-1" />
                      <span>Same as mid-market</span>
                    </div>
                  )
                ) : (
                  // Check if this is Wise - if so, show as 0% margin (mid-market rate)
                  (provider?.providerCode?.toLowerCase() === 'wise' || 
                   (provider?.name || '').toLowerCase() === 'wise' ||
                   (provider?.provider?.name || '').toLowerCase() === 'wise') ? (
                    <div className="flex items-center text-green-600 text-xs font-medium">
                      <Minus size={8} className="mr-1" />
                      <span>0% (Mid-Market Rate)</span>
                    </div>
                  ) : (
                    provider?.marginPercentage !== undefined ? (
                      provider.marginPercentage > 0 ? (
                        <div className="flex items-center text-green-600 text-xs font-medium">
                          <ArrowUp size={8} className="mr-1" />
                          <span>{`${provider.marginPercentage.toFixed(2)}% above mid-market`}</span>
                        </div>
                      ) : provider.marginPercentage < 0 ? (
                        <div className="flex items-center text-red-600 text-xs font-medium">
                          <ArrowDown size={8} className="mr-1" />
                          <span>{`${Math.abs(provider.marginPercentage).toFixed(2)}% below mid-market`}</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-gray-600 text-xs font-medium">
                          <Minus size={8} className="mr-1" />
                          <span>Same as mid-market</span>
                        </div>
                      )
                    ) : (
                      <span className="text-xs">{`${((provider?.exchangeRateMargin || exchangeRateMargin || 0) * 100).toFixed(2)}% margin`}</span>
                    )
                  )
                )}
              </div>
            </div>
            
            <a 
              href={getProviderWebsite(provider?.providerCode || provider?.code || provider?.name || name || '')} 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-indigo-600 hover:bg-indigo-700 text-white get-deal-btn flex items-center justify-center font-semibold"
              title={`Goto ${getCleanProviderName(provider?.name || name || provider?.providerCode || provider?.code || '')}`}
            >
              Goto {getCleanProviderName(provider?.name || name || provider?.providerCode || provider?.code || '')}
              <ExternalLink size={14} className="ml-1 flex-shrink-0" />
            </a>
          </div>
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
  // Convert to lowercase for consistent matching
  const code = providerCode.toLowerCase();
  
  // If the provider is not in our map, try to generate a website URL based on the code
  if (!websiteMap[code] && code) {
    // Generate a likely website URL
    const generatedUrl = `https://www.${code}.com`;
    
    // Add it to both the current map and localStorage for future use
    websiteMap[code] = generatedUrl;
    
    try {
      // Get existing saved providers
      const savedProviders = localStorage.getItem('providerWebsites') || '{}';
      const updatedProviders = JSON.parse(savedProviders);
      
      // Add the new provider
      updatedProviders[code] = generatedUrl;
      
      // Save back to localStorage
      localStorage.setItem('providerWebsites', JSON.stringify(updatedProviders));
    } catch (error) {
      console.error('Error saving provider website:', error);
    }
  }
  
  // Return website URL if it exists in the map, otherwise default to a search
  return websiteMap[code] || `https://www.google.com/search?q=${encodeURIComponent(providerCode)}+money+transfer`;
};

export default ProviderCard; 