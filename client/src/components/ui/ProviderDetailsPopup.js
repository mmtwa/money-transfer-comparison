import React, { useState, useEffect } from 'react';
import { X, ExternalLink, Loader2, Check, AlertCircle } from 'lucide-react';
import { getCurrencySymbol } from '../../utils/currency';
import providerInfoService from '../../services/providerInfoService';

const ProviderDetailsPopup = ({ provider, onClose, fromCurrency, toCurrency }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [providerDetails, setProviderDetails] = useState(null);
  
  // Extract the provider code for fetching data
  const providerCode = provider?.providerCode || 
                       provider?.code || 
                      (provider?.name || '').toLowerCase().replace(/\s+/g, '-');
  
  useEffect(() => {
    const fetchProviderDetails = async () => {
      setLoading(true);
      try {
        // Fetch provider info from our service
        const response = await providerInfoService.getProviderInfo(providerCode);
        setProviderDetails(response);
      } catch (err) {
        console.error('Error fetching provider details:', err);
        setError('Failed to fetch provider information');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProviderDetails();
  }, [providerCode]);
  
  // Handle popup close with escape key
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) onClose();
    };
    window.addEventListener('keydown', handleEsc);
    
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  // Add a click outside handler to close the popup
  const popupRef = React.useRef(null);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    };
    
    // Add the event listener
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      // Remove the event listener on cleanup
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div 
        ref={popupRef}
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center">
            <img 
              src={provider?.logo || provider?.providerLogo || `/images/providers/${providerCode}.png`} 
              alt={`${provider?.name || providerCode} logo`} 
              className="h-10 w-10 object-contain mr-3"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/images/providers/default.png';
              }}
            />
            <h2 className="text-xl font-bold text-gray-800">{provider?.name || providerCode}</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-auto p-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64">
              <Loader2 size={32} className="text-indigo-600 animate-spin mb-4" />
              <p className="text-gray-500">Loading provider information...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-64">
              <AlertCircle size={32} className="text-red-500 mb-4" />
              <p className="text-red-500 font-medium mb-2">Error</p>
              <p className="text-gray-500">{error}</p>
            </div>
          ) : (
            <div className="space-y-6 p-6">
              {/* Transfer Details */}
              <div className="bg-indigo-50 rounded-lg p-4">
                <h3 className="text-indigo-700 font-medium mb-3 text-left">Transfer Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-left">
                    <div className="text-xs text-gray-500 mb-1">Exchange Rate</div>
                    <div className="font-medium">{`1 ${fromCurrency} = ${(provider?.rate || 0).toFixed(4)} ${toCurrency}`}</div>
                  </div>
                  <div className="text-left">
                    <div className="text-xs text-gray-500 mb-1">Transfer Fee</div>
                    <div className="font-medium">{getCurrencySymbol(fromCurrency)} {(provider?.transferFee || 0).toFixed(2)}</div>
                  </div>
                  <div className="text-left">
                    <div className="text-xs text-gray-500 mb-1">Delivery Time</div>
                    <div className="font-medium">{provider?.transferTime || '1-2 business days'}</div>
                  </div>
                </div>
              </div>
              
              {/* Company Information */}
              <div className="text-left">
                <h3 className="text-lg font-semibold mb-3">About {providerDetails?.name}</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">{providerDetails?.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  <div>
                    <div className="text-sm font-medium text-gray-700">Established</div>
                    <div className="text-gray-600">{providerDetails?.established || 'Not available'}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-700">Headquarters</div>
                    <div className="text-gray-600">{providerDetails?.headquarters || 'Not available'}</div>
                  </div>
                </div>
              </div>
              
              {/* Regulations */}
              <div className="text-left">
                <h3 className="text-lg font-semibold mb-2">Regulations & Compliance</h3>
                <ul className="text-gray-600 space-y-2">
                  {providerDetails?.regulations && providerDetails.regulations.length > 0 ? (
                    providerDetails.regulations.map((reg, index) => (
                      <li key={index} className="flex items-start">
                        <Check size={16} className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                        <span className="leading-relaxed">{reg}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-500">No regulatory information available</li>
                  )}
                </ul>
              </div>
            </div>
          )}
        </div>
        
        {/* Footer with action buttons */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            Close
          </button>
          
          <a 
            href={getProviderWebsite(providerCode)}
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md flex items-center justify-center font-medium transition-colors"
          >
            Visit Website
            <ExternalLink size={14} className="ml-1.5" />
          </a>
        </div>
      </div>
    </div>
  );
};

// Function to get provider website - reusing from ProviderCard component
const getProviderWebsite = (providerCode) => {
  // Convert to lowercase for consistent matching
  const code = providerCode.toLowerCase();
  
  // Common provider websites - simplified subset of the full map in ProviderCard
  const websiteMap = {
    'wise': 'https://www.wise.com',
    'xe': 'https://www.xe.com',
    'ofx': 'https://www.ofx.com/en-gb/money-transfer/',
    'western-union': 'https://www.westernunion.com/gb/en/web/send-money/start',
    'worldremit': 'https://www.worldremit.com',
    'remitly': 'https://www.remitly.com',
    'transfergo': 'https://www.transfergo.com/send-money-abroad',
    'moneygram': 'https://www.moneygram.com',
    'revolut': 'https://www.revolut.com/money-transfer/',
  };
  
  // Return website URL if it exists in the map, otherwise default to a search
  return websiteMap[code] || `https://www.google.com/search?q=${encodeURIComponent(providerCode)}+money+transfer`;
};

export default ProviderDetailsPopup; 