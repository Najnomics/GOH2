import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '../utils/constants';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.config.url}`, response.data);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// API service methods
export const apiService = {
  // System endpoints
  getSystemStatus: async () => {
    const response = await api.get(API_ENDPOINTS.STATUS);
    return response.data;
  },

  // Chain endpoints
  getSupportedChains: async () => {
    const response = await api.get(API_ENDPOINTS.CHAINS);
    return response.data;
  },

  getGasPrices: async () => {
    const response = await api.get(API_ENDPOINTS.GAS_PRICES);
    return response.data;
  },

  // Token endpoints
  getSupportedTokens: async () => {
    const response = await api.get(API_ENDPOINTS.TOKENS);
    return response.data;
  },

  // Optimization endpoints
  getOptimizationQuote: async (swapParams) => {
    const response = await api.post(API_ENDPOINTS.OPTIMIZATION_QUOTE, swapParams);
    return response.data;
  },

  // Swap endpoints
  executeSwap: async (swapParams, userPreferences = null) => {
    const payload = {
      ...swapParams,
      user_preferences: userPreferences
    };
    const response = await api.post(API_ENDPOINTS.EXECUTE_SWAP, payload);
    return response.data;
  },

  getSwapStatus: async (swapId) => {
    const response = await api.get(`${API_ENDPOINTS.SWAP_STATUS}/${swapId}`);
    return response.data;
  },

  // Analytics endpoints
  getSystemAnalytics: async () => {
    const response = await api.get(API_ENDPOINTS.ANALYTICS_SYSTEM);
    return response.data;
  },

  getUserAnalytics: async (userAddress) => {
    const response = await api.get(`${API_ENDPOINTS.ANALYTICS_USER}/${userAddress}`);
    return response.data;
  }
};

// Export individual methods for convenience
export const {
  getSystemStatus,
  getSupportedChains,
  getGasPrices,
  getSupportedTokens,
  getOptimizationQuote,
  executeSwap,
  getSwapStatus,
  getSystemAnalytics,
  getUserAnalytics
} = apiService;

export default api;