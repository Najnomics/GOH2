import axios from 'axios';
import { SwapParams, SwapExecution } from '../../types/swap';
import { OptimizationQuote, UserPreferences } from '../../types/optimization';
import { ChainInfo } from '../../types/chain';
import { SystemAnalytics, UserAnalytics } from '../../types/analytics';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const gasOptimizationApi = {
  // System status
  getSystemStatus: async () => {
    const response = await api.get('/status');
    return response.data;
  },

  // Chain information
  getSupportedChains: async (): Promise<ChainInfo[]> => {
    const response = await api.get('/chains');
    return response.data;
  },

  getGasPrices: async () => {
    const response = await api.get('/gas-prices');
    return response.data;
  },

  // Optimization
  getOptimizationQuote: async (swapParams: SwapParams): Promise<OptimizationQuote> => {
    const response = await api.post('/optimization-quote', swapParams);
    return response.data;
  },

  // Swap execution
  executeSwap: async (
    swapParams: SwapParams,
    userPreferences?: UserPreferences
  ): Promise<SwapExecution> => {
    const response = await api.post('/execute-swap', {
      ...swapParams,
      user_preferences: userPreferences,
    });
    return response.data;
  },

  getSwapStatus: async (swapId: string) => {
    const response = await api.get(`/swap-status/${swapId}`);
    return response.data;
  },

  // Tokens
  getSupportedTokens: async () => {
    const response = await api.get('/tokens');
    return response.data;
  },

  // Analytics
  getSystemAnalytics: async (): Promise<SystemAnalytics> => {
    const response = await api.get('/analytics/system');
    return response.data;
  },

  getUserAnalytics: async (userAddress: string): Promise<UserAnalytics> => {
    const response = await api.get(`/analytics/user/${userAddress}`);
    return response.data;
  },

  // Health check
  healthCheck: async () => {
    const response = await api.get('/');
    return response.data;
  },
};

export default gasOptimizationApi;