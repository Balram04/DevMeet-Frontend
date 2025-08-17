// Authentication utility for token management
import axios from 'axios';

const TOKEN_KEY = 'devmeet_token';

export const authUtils = {
  // Store token in localStorage
  setToken: (token) => {
    localStorage.setItem(TOKEN_KEY, token);
    // Set default authorization header for all future requests
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  },

  // Get token from localStorage
  getToken: () => {
    return localStorage.getItem(TOKEN_KEY);
  },

  // Remove token
  removeToken: () => {
    localStorage.removeItem(TOKEN_KEY);
    // Remove authorization header
    delete axios.defaults.headers.common['Authorization'];
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem(TOKEN_KEY);
    return !!token;
  },

  // Initialize auth - call this when app starts
  initializeAuth: () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }
};

// Initialize auth when this module is imported
authUtils.initializeAuth();
