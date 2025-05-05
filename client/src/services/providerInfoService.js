import axios from 'axios';

/**
 * Service for fetching provider information from various sources
 */
const providerInfoService = {
  // Cache for previously fetched provider information
  _cache: {},
  
  // Cache timeout in milliseconds (30 minutes)
  _cacheTimeout: 1800000,
  
  /**
   * Check if cached data is still valid
   * @param {string} key - Cache key
   * @returns {boolean} - Whether cache is valid
   */
  _isCacheValid: function(key) {
    if (!this._cache[key]) return false;
    
    const now = Date.now();
    return (now - this._cache[key].timestamp < this._cacheTimeout);
  },
  
  /**
   * Fetch detailed provider information
   * @param {string} providerCode - The provider code or name
   * @returns {Promise} - Promise with provider information
   */
  getProviderInfo: async (providerCode) => {
    try {
      if (!providerCode) {
        throw new Error('Provider code is required');
      }
      
      // Format the provider code correctly
      const normalizedCode = providerCode.toLowerCase().trim();
      
      // Return from cache if available and not expired
      if (providerInfoService._isCacheValid(normalizedCode)) {
        console.log(`Using cached provider info for ${normalizedCode}`);
        return providerInfoService._cache[normalizedCode].data;
      }
      
      // Call the real API endpoint to get provider information
      console.log(`Fetching provider info for ${normalizedCode} from API`);
      const response = await axios.get(`/api/provider-info/${normalizedCode}`);
      
      if (response.data && response.data.success) {
        // Store in cache
        providerInfoService._cache[normalizedCode] = {
          timestamp: Date.now(),
          data: response.data.data
        };
        
        return response.data.data;
      } else {
        throw new Error(response.data?.message || 'Failed to fetch provider information');
      }
    } catch (error) {
      console.error('Error fetching provider info:', error);
      
      // Return basic fallback information when API fails
      return providerInfoService._getFallbackInfo(providerCode);
    }
  },
  
  /**
   * Get a list of all supported providers
   * @returns {Promise} - Promise with provider list
   */
  getSupportedProviders: async () => {
    try {
      // Check cache first
      if (providerInfoService._isCacheValid('_providers_list')) {
        return providerInfoService._cache['_providers_list'].data;
      }
      
      const response = await axios.get('/api/provider-info/');
      
      if (response.data && response.data.success) {
        // Store in cache
        providerInfoService._cache['_providers_list'] = {
          timestamp: Date.now(),
          data: response.data.data
        };
        
        return response.data.data;
      } else {
        throw new Error('Failed to fetch provider list');
      }
    } catch (error) {
      console.error('Error fetching provider list:', error);
      
      // Return basic fallback list
      return [
        { code: 'wise', name: 'Wise' }
      ];
    }
  },
  
  /**
   * Search for providers by name or partial code
   * @param {string} query - Search query
   * @returns {Promise} - Promise with search results
   */
  searchProviders: async (query) => {
    try {
      if (!query || query.length < 2) {
        throw new Error('Search query must be at least 2 characters');
      }
      
      const response = await axios.get(`/api/provider-info/search/${encodeURIComponent(query)}`);
      
      if (response.data && response.data.success) {
        return response.data.data;
      } else {
        throw new Error('Failed to search providers');
      }
    } catch (error) {
      console.error('Error searching providers:', error);
      return null;
    }
  },
  
  /**
   * Clear the provider info cache
   * @param {string} [providerCode] - Optional provider code to clear specific cache
   */
  clearCache: (providerCode = null) => {
    if (providerCode) {
      const normalizedCode = providerCode.toLowerCase().trim();
      delete providerInfoService._cache[normalizedCode];
    } else {
      providerInfoService._cache = {};
    }
  },
  
  /**
   * Generate fallback information for a provider
   * @param {string} providerCode - Provider code
   * @returns {Object} - Basic provider information
   * @private
   */
  _getFallbackInfo: (providerCode) => {
    if (!providerCode) return { name: 'Unknown Provider' };
    
    // Format provider name from code
    let name = providerCode;
    
    // Handle special cases
    if (providerCode.toLowerCase() === 'wu') name = 'Western Union';
    else if (providerCode.toLowerCase() === 'xe') name = 'XE Money Transfer';
    else if (providerCode.toLowerCase() === 'transferwise') name = 'Wise';
    else {
      // Format other codes by capitalizing words
      name = providerCode
        .split(/[-_]/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
    }
    
    return {
      name,
      description: `${name} is an international money transfer service.`,
      established: null,
      headquarters: null,
      transferMethods: ["Bank Transfer"],
      payoutMethods: ["Bank Deposit"],
      supportedCountries: null,
      keyBenefits: ["International money transfers"],
      limitations: ["Limited information available"],
      url: null
    };
  }
};

export default providerInfoService; 