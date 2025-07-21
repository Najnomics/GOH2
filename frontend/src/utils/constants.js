// App constants
export const APP_NAME = 'Crosschain Gas Optimization';
export const VERSION = '1.0.0';

// API Configuration
export const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
export const API_ENDPOINTS = {
  STATUS: '/api/status',
  CHAINS: '/api/chains',
  GAS_PRICES: '/api/gas-prices',
  OPTIMIZATION_QUOTE: '/api/optimization-quote',
  EXECUTE_SWAP: '/api/execute-swap',
  SWAP_STATUS: '/api/swap-status',
  TOKENS: '/api/tokens',
  ANALYTICS_SYSTEM: '/api/analytics/system',
  ANALYTICS_USER: '/api/analytics/user'
};

// Chain Configuration
export const SUPPORTED_CHAINS = {
  1: {
    name: 'Ethereum',
    symbol: 'ETH',
    color: '#627eea',
    icon: '⟠',
    blockTime: 12,
    finalityTime: 780
  },
  42161: {
    name: 'Arbitrum',
    symbol: 'ETH',
    color: '#28a0f0',
    icon: '🔷',
    blockTime: 1,
    finalityTime: 1200
  },
  10: {
    name: 'Optimism',
    symbol: 'ETH',
    color: '#ff0420',
    icon: '🔴',
    blockTime: 2,
    finalityTime: 1200
  },
  137: {
    name: 'Polygon',
    symbol: 'MATIC',
    color: '#8247e5',
    icon: '⬟',
    blockTime: 2,
    finalityTime: 256
  },
  8453: {
    name: 'Base',
    symbol: 'ETH',
    color: '#0052ff',
    icon: '🔵',
    blockTime: 2,
    finalityTime: 1200
  }
};

// Default user preferences
export const DEFAULT_USER_PREFERENCES = {
  minSavingsThresholdBPS: 500, // 5%
  minAbsoluteSavingsUSD: 10,
  maxBridgeTimeSeconds: 1800, // 30 minutes
  enableCrossChainOptimization: true,
  enableUSDDisplay: true
};

// Gas estimation constants
export const GAS_ESTIMATES = {
  SIMPLE_SWAP: 120000,
  COMPLEX_SWAP: 180000,
  BRIDGE_DEPOSIT: 150000,
  BRIDGE_WITHDRAW: 200000
};

// Animation constants
export const ANIMATION_DURATIONS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500
};

// Color palette
export const COLORS = {
  PRIMARY: {
    PINK: '#ff007a',
    PURPLE: '#7c3aed',
    BLUE: '#4f46e5'
  },
  STATUS: {
    SUCCESS: '#10b981',
    WARNING: '#f59e0b',
    ERROR: '#ef4444',
    INFO: '#3b82f6'
  },
  CHAINS: {
    ETHEREUM: '#627eea',
    ARBITRUM: '#28a0f0',
    OPTIMISM: '#ff0420',
    POLYGON: '#8247e5',
    BASE: '#0052ff'
  }
};

// Format helpers
export const FORMATTERS = {
  currency: (value, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  },
  
  percentage: (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 2
    }).format(value / 100);
  },
  
  number: (value, decimals = 2) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(value);
  },
  
  shortNumber: (value) => {
    if (value >= 1e9) return (value / 1e9).toFixed(1) + 'B';
    if (value >= 1e6) return (value / 1e6).toFixed(1) + 'M';
    if (value >= 1e3) return (value / 1e3).toFixed(1) + 'K';
    return value.toString();
  },
  
  time: (seconds) => {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
    return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
  }
};