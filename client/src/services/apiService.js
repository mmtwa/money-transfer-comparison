import axios from 'axios';

// Get API URL with correct port
const getApiBaseUrl = () => {
  // First check if REACT_APP_API_URL is set in environment
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  
  // Then try to determine from current window location
  // This helps if the server is on a different port than 3000
  const { protocol, hostname } = window.location;
  
  // Development (typically on port 3000, but API on another port)
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    // Use port 3000 instead of 10000 as the server is running on port 3000
    return `${protocol}//${hostname}:10000`;
  }
  
  // Production - API is at the same host
  return '/api';
};

// Create an axios instance with base URL for API calls
const api = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json'
  },
  // Add withCredentials to handle CORS with credentials
  withCredentials: false
});

// Add a request interceptor to log requests
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method.toUpperCase()} ${config.url}`);
    
    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
    return Promise.reject(error);
  }
);

// Add a local cache for ratings to prevent redundant requests
const ratingsCache = {
  trustpilot: new Map()
};

// Hardcoded ratings for specific providers that we don't want to fetch from API
const HARDCODED_RATINGS = {
  'torfx': {
    value: 4.4,
    source: 'Money Transfer Comparison',
    lastUpdated: new Date().toISOString(),
    isFallback: false
  }
};

// Cache expiry time - 1 hour in milliseconds
const CACHE_EXPIRY = 60 * 60 * 1000;

// Clear expired cache entries periodically
setInterval(() => {
  const now = Date.now();
  
  // Clear expired entries from Trustpilot ratings cache
  for (const [key, { timestamp }] of ratingsCache.trustpilot.entries()) {
    if (now - timestamp > CACHE_EXPIRY) {
      ratingsCache.trustpilot.delete(key);
    }
  }
}, 5 * 60 * 1000); // Run every 5 minutes

// API service methods
const apiService = {
  // Add getApiBaseUrl to the exported object
  getApiBaseUrl,
  
  // Authentication
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },
  
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },
  
  logout: () => {
    localStorage.removeItem('token');
    return api.post('/auth/logout');
  },
  
  getCurrentUser: async () => {
    return api.get('/auth/me');
  },
  
  // Price comparison API
  getWiseComparison: async (fromCurrency, toCurrency, amount, sourceCountry = null, targetCountry = null, providerType = null) => {
    return api.get('/wise/compare', {
      params: { 
        fromCurrency, 
        toCurrency, 
        amount,
        sourceCountry,
        targetCountry,
        providerType
      }
    });
  },
  
  // Direct access to the Wise v3 comparison API
  getWiseV3Comparison: async (sourceCurrency, targetCurrency, sendAmount) => {
    // This could be a direct call to the Wise API if CORS allows, or through our backend proxy
    return axios.get(`https://api.transferwise.com/v3/comparisons/`, {
      params: {
        sourceCurrency,
        targetCurrency,
        sendAmount
      }
    });
  },
  
  // Historical rates API
  getHistoricalRates: async (fromCurrency, toCurrency, fromDate = null, toDate = null, group = 'day') => {
    // Ensure we're not requesting future data
    const now = new Date();
    
    // Validate the toDate
    let validToDate = toDate;
    if (!validToDate) {
      validToDate = now.toISOString();
    } else if (new Date(validToDate) > now) {
      console.warn(`Adjusting future toDate ${validToDate} to current date`);
      validToDate = now.toISOString();
    }
    
    // Validate the fromDate
    let validFromDate = fromDate;
    if (!validFromDate) {
      const thirtyDaysAgo = new Date(now);
      thirtyDaysAgo.setDate(now.getDate() - 30);
      validFromDate = thirtyDaysAgo.toISOString();
    } else if (new Date(validFromDate) > now) {
      console.warn(`Adjusting future fromDate ${validFromDate} to 30 days before today`);
      const thirtyDaysAgo = new Date(now);
      thirtyDaysAgo.setDate(now.getDate() - 30);
      validFromDate = thirtyDaysAgo.toISOString();
    }
    
    console.log(`Making request with validated dates: from=${validFromDate}, to=${validToDate}`);
    
    return api.get('/rates/historical', {
      params: { 
        source: fromCurrency, 
        target: toCurrency, 
        from: validFromDate, 
        to: validToDate, 
        group 
      }
    });
  },
  
  // User history
  getUserHistory: async () => {
    return api.get('/users/history');
  },
  
  deleteComparisonFromHistory: async (comparisonId) => {
    return api.delete(`/users/history/${comparisonId}`);
  },
  
  // Provider information
  getProviders: async () => {
    return api.get('/providers');
  },
  
  getProviderById: async (id) => {
    return api.get(`/providers/${id}`);
  },
  
  /**
   * Submit feedback
   * @param {object} feedbackData - Feedback data
   * @returns {Promise} - API response
   */
  submitFeedback: (feedbackData) => {
    return api.post('/feedback', feedbackData);
  },
  
  // Fetch Trustpilot rating for a provider
  getTrustpilotRating: async (providerId) => {
    try {
      // Normalize the provider ID or code
      let providerCode;
      
      if (typeof providerId === 'number' || !isNaN(providerId)) {
        // If it's numeric, return no rating available
        return null;
      } else if (providerId?.startsWith('provider-')) {
        // Extract code from provider ID
        providerCode = providerId.replace('provider-', '');
        
        // If the code is numeric, return no rating available
        if (!isNaN(providerCode)) {
          return null;
        }
      } else {
        // Use providerId directly as the code
        providerCode = providerId;
      }
      
      // Clean and normalize the provider code further
      const normalizedCode = providerCode.toLowerCase()
        .replace(/[^a-z0-9]/g, '') // Remove special characters
        .trim();
      
      // Check for hardcoded ratings first
      if (HARDCODED_RATINGS[normalizedCode]) {
        return HARDCODED_RATINGS[normalizedCode];
      }
      
      // Check local cache first
      if (ratingsCache.trustpilot.has(normalizedCode)) {
        const cachedData = ratingsCache.trustpilot.get(normalizedCode);
        
        // If cache is still valid (less than 1 hour old)
        if (Date.now() - cachedData.timestamp < CACHE_EXPIRY) {
          return cachedData.rating;
        } else {
          // Cache expired, remove it
          ratingsCache.trustpilot.delete(normalizedCode);
        }
      }
      
      // Retry logic with exponential backoff for 429 errors
      const maxRetries = 3;
      let retryCount = 0;
      let lastError = null;
      
      // Helper function for exponential backoff delay
      const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
      
      // First try to get the cached rating from MongoDB
      while (retryCount <= maxRetries) {
        try {
          // If not first attempt, add delay with exponential backoff
          if (retryCount > 0) {
            const backoffTime = Math.pow(2, retryCount) * 1000; // 2s, 4s, 8s...
            await delay(backoffTime);
          }
          
          const response = await api.get(`/trustpilot-ratings/${normalizedCode}`);
          
          // If successful and has valid data with a rating value
          if (response.data.success && response.data.data && response.data.data.value) {
            const rating = {
              value: response.data.data.value,
              source: response.data.data.source || 'Trustpilot',
              lastUpdated: response.data.data.lastUpdated,
              isFallback: false
            };
            
            // Cache the rating locally
            ratingsCache.trustpilot.set(normalizedCode, {
              rating,
              timestamp: Date.now()
            });
            
            return rating;
          } else {
            // If response is success: false or doesn't have a value, it means no rating is available
            
            // Cache the null result
            ratingsCache.trustpilot.set(normalizedCode, {
              rating: null,
              timestamp: Date.now()
            });
            
            return null;
          }
        } catch (cacheError) {
          lastError = cacheError;
          
          // If it's a rate limit error (429), increment retry counter and try again
          if (cacheError.response && cacheError.response.status === 429) {
            retryCount++;
            // Continue to next iteration with backoff
          } else {
            console.error(`Error fetching cached Trustpilot rating for ${normalizedCode}:`, cacheError);
            // Break the loop for non-429 errors
            break;
          }
        }
      }
      
      // If we hit max retries with 429 errors, return null (no rating)
      if (retryCount > maxRetries) {
        // Cache the null result
        ratingsCache.trustpilot.set(normalizedCode, {
          rating: null,
          timestamp: Date.now()
        });
        
        return null;
      }
      
      // Reset retry counter for update endpoint
      retryCount = 0;
      
      // If no cached rating or error, try to create/update the rating
      while (retryCount <= maxRetries) {
        try {
          // If not first attempt, add delay with exponential backoff
          if (retryCount > 0) {
            const backoffTime = Math.pow(2, retryCount) * 1000; // 2s, 4s, 8s...
            await delay(backoffTime);
          }
          
          const updateResponse = await api.post(`/trustpilot-ratings/update/${normalizedCode}`);
          
          // If successful and has valid data with a rating value
          if (updateResponse.data.success && updateResponse.data.data && updateResponse.data.data.value) {
            const rating = {
              value: updateResponse.data.data.value,
              source: updateResponse.data.data.source || 'Trustpilot',
              lastUpdated: updateResponse.data.data.lastUpdated,
              isFallback: false
            };
            
            // Cache the rating locally
            ratingsCache.trustpilot.set(normalizedCode, {
              rating,
              timestamp: Date.now()
            });
            
            return rating;
          } else {
            // If response is success: false or doesn't have a value, it means no rating is available
            
            // Cache the null result
            ratingsCache.trustpilot.set(normalizedCode, {
              rating: null,
              timestamp: Date.now()
            });
            
            return null;
          }
        } catch (updateError) {
          lastError = updateError;
          
          // If it's a rate limit error (429), increment retry counter and try again
          if (updateError.response && updateError.response.status === 429) {
            retryCount++;
            // Continue to next iteration with backoff
          } else {
            console.error(`Error updating Trustpilot rating for ${normalizedCode}:`, updateError);
            // Break the loop for non-429 errors
            break;
          }
        }
      }
      
      // If we hit max retries with 429 errors, return null (no rating)
      if (retryCount > maxRetries) {
        // Cache the null result
        ratingsCache.trustpilot.set(normalizedCode, {
          rating: null,
          timestamp: Date.now()
        });
        
        return null;
      }
      
      // If all retries fail, return null (no rating)
      console.log(`All retries failed for ${normalizedCode}, no rating available`);
      
      // Cache the null result
      ratingsCache.trustpilot.set(normalizedCode, {
        rating: null,
        timestamp: Date.now()
      });
      
      return null;
    } catch (error) {
      console.error(`Error fetching Trustpilot rating for ${providerId}:`, error);
      return null;
    }
  }
};

export default apiService;
