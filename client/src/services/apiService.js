import axios from 'axios';

// Create an axios instance with base URL for API calls
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
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
  
  // Transfer rate comparisons
  getExchangeRates: async (fromCurrency, toCurrency, amount) => {
    return api.get('/rates/compare', {
      params: { fromCurrency, toCurrency, amount }
    });
  },
  
  getHistoricalRates: async (fromCurrency, toCurrency, days = 30) => {
    return api.get('/rates/history', {
      params: { fromCurrency, toCurrency, days }
    });
  },
  
  // Provider information
  getProviders: async () => {
    return api.get('/providers');
  },
  
  getProviderById: async (id) => {
    return api.get(`/providers/${id}`);
  },
  
  // User history
  getUserHistory: async () => {
    return api.get('/users/history');
  },
  
  deleteComparisonFromHistory: async (comparisonId) => {
    return api.delete(`/users/history/${comparisonId}`);
  }
};

export default apiService;