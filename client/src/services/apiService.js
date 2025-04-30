import axios from 'axios';

// Create an axios instance with base URL for API calls
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json'
  },
  // Add withCredentials to handle CORS with credentials
  withCredentials: false
});

// Add authorization header to every request if token exists
api.interceptors.request.use(
  (config) => {
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
  
  // Placeholder for fetching external provider ratings
  getProviderRating: async (providerId) => {
    console.log(`Simulating fetch rating for providerId: ${providerId}`);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, Math.random() * 500)); 
    
    // Simulate finding a rating sometimes, or returning null
    if (Math.random() > 0.3) { 
      // Return a simulated rating object (e.g., value and source)
      const ratingValue = (Math.random() * (5 - 3) + 3).toFixed(1); // Random rating between 3.0 and 5.0
      return { 
        value: parseFloat(ratingValue),
        source: Math.random() > 0.5 ? 'Trustpilot' : 'Google' 
      };
    } else {
      // Simulate rating not found
      return null; 
    }
  }
};

export default apiService;