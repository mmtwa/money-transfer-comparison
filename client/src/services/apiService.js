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
    // Try port 10000 first, then 10001, 10002, etc. based on what's running
    return `${protocol}//${hostname}:10000/api`;
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

// API service methods
const apiService = {
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
  
  // Fetch Google rating for a provider
  getProviderRating: async (providerId) => {
    try {
      console.log(`Fetching Google rating for provider: ${providerId}`);
      
      // Check if this is a numeric ID or starts with 'provider-'
      let providerCode;
      
      if (typeof providerId === 'number' || !isNaN(providerId)) {
        // If it's numeric, use a fallback rating
        console.log(`Provider ID is numeric: ${providerId}, using fallback`);
        return {
          value: 4.0,
          reviewCount: 100,
          source: 'Google',
          isFallback: true,
          lastUpdated: new Date()
        };
      } else if (providerId?.startsWith('provider-')) {
        // Extract code from provider ID
        providerCode = providerId.replace('provider-', '');
        
        // If the code is numeric, use fallback
        if (!isNaN(providerCode)) {
          console.log(`Extracted provider code is numeric: ${providerCode}, using fallback`);
          return {
            value: 4.0,
            reviewCount: 100,
            source: 'Google',
            isFallback: true,
            lastUpdated: new Date()
          };
        }
      } else {
        // Use providerId directly as the code
        providerCode = providerId;
      }
      
      // Known problematic providers
      const PROBLEMATIC_PROVIDERS = [
        'ofx', 'barclays', 'skrill', 'lloyds', 'halifax', 
        'nationwide', 'paypal', 'western-union', 'monese',
        'moneygram', 'natwest', 'rbs', 'remitly', 'xoom'
      ];
      
      // If it's a problematic provider, return fallback immediately
      if (PROBLEMATIC_PROVIDERS.includes(providerCode?.toLowerCase())) {
        console.log(`Using fallback for problematic provider: ${providerCode}`);
        return {
          value: 4.0,
          reviewCount: 100,
          source: 'Google',
          isFallback: true,
          lastUpdated: new Date()
        };
      }
      
      // Make the API request with proper error handling
      try {
        const response = await api.get(`/google-ratings/${providerCode}`);
        
        if (response.data.success && response.data.data) {
          return {
            value: response.data.data.googleRating,
            reviewCount: response.data.data.reviewCount,
            source: 'Google',
            lastUpdated: response.data.data.lastUpdated,
            isFallback: response.data.data.isFallback
          };
        }
      } catch (apiError) {
        console.error(`API error for ${providerCode}:`, apiError);
        // Continue to fallback
      }
      
      // Fallback if API request fails
      return {
        value: 4.0,
        reviewCount: 100,
        source: 'Google',
        isFallback: true,
        lastUpdated: new Date()
      };
    } catch (error) {
      console.error(`Error fetching Google rating for ${providerId}:`, error);
      return {
        value: 4.0,
        reviewCount: 100,
        source: 'Google',
        isFallback: true,
        lastUpdated: new Date()
      };
    }
  }
};

export default apiService;