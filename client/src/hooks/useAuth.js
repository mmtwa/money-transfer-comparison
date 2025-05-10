import { useState, useEffect, useContext, createContext } from 'react';
import axios from 'axios';

// Create an auth context
const AuthContext = createContext(null);

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (token) {
          // Configure axios
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Get current user
          const res = await axios.get('/api/auth/me');
          setUser(res.data.data);
        }
      } catch (err) {
        // Clear token if invalid
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        setError(err.response?.data?.message || 'Authentication error');
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Attempting login with:', { email, password: '****' });
      const res = await axios.post('/api/auth/login', { email, password });
      console.log('Login response:', res.data);
      
      // Save token - handle both response formats
      let token;
      if (res.data.data && res.data.data.token) {
        // If token is inside data object
        token = res.data.data.token;
      } else if (res.data.token) {
        // If token is directly in response
        token = res.data.token;
      } else {
        throw new Error('No token in response');
      }
      
      localStorage.setItem('token', token);
      
      // Set auth header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Get user data
      const userRes = await axios.get('/api/auth/me');
      console.log('User data response:', userRes.data);
      
      // Handle both response formats
      if (userRes.data.data) {
        setUser(userRes.data.data);
      } else {
        setUser(userRes.data);
      }
      
      return true;
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  // Register function
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await axios.post('/api/auth/register', userData);
      
      // Save token
      const { token } = res.data.data;
      localStorage.setItem('token', token);
      
      // Set auth header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Get user data
      const userRes = await axios.get('/api/auth/me');
      setUser(userRes.data.data);
      
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Value to be provided by the context
  const value = {
    user,
    loading,
    error,
    login,
    logout,
    register
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 