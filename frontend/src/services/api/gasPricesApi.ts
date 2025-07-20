import { GasPrice, ChainMetrics } from '../../types/chain';
import { SUPPORTED_CHAINS } from '../../utils/constants';
import { apiClient } from './client';

export const gasPricesApi = {
  // Get gas prices for all chains
  getAllChainGasPrices: async (): Promise<Record<number, GasPrice>> => {
    const response = await apiClient.get<Record<number, GasPrice>>('/gas-prices/all');
    return response.data;
  },

  // Get gas price for specific chain
  getChainGasPrice: async (chainId: number): Promise<GasPrice> => {
    const response = await apiClient.get<GasPrice>(`/gas-prices/${chainId}`);
    return response.data;
  },

  // Get chain metrics
  getChainMetrics: async (): Promise<Record<number, ChainMetrics>> => {
    const response = await apiClient.get<Record<number, ChainMetrics>>('/gas-prices/metrics');
    return response.data;
  },

  // Get gas price history
  getGasPriceHistory: async (chainId: number, period: string = '1d'): Promise<{
    timestamp: number;
    price: number;
  }[]> => {
    const response = await apiClient.get(`/gas-prices/history/${chainId}`, {
      params: { period },
    });
    return response.data;
  },
};

// Mock implementation for development
const mockGasPricesApi = {
  getAllChainGasPrices: async (): Promise<Record<number, GasPrice>> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const gasPrices: Record<number, GasPrice> = {};
    
    Object.values(SUPPORTED_CHAINS).forEach(chainId => {
      let basePrice: number;
      switch (chainId) {
        case 1: // Ethereum
          basePrice = 30 + Math.random() * 100;
          break;
        case 42161: // Arbitrum
          basePrice = 0.1 + Math.random() * 0.5;
          break;
        case 10: // Optimism
          basePrice = 0.001 + Math.random() * 0.01;
          break;
        case 137: // Polygon
          basePrice = 100 + Math.random() * 400;
          break;
        case 8453: // Base
          basePrice = 0.01 + Math.random() * 0.1;
          break;
        default:
          basePrice = Math.random() * 50;
      }
      
      gasPrices[chainId] = {
        slow: basePrice * 0.8,
        standard: basePrice,
        fast: basePrice * 1.2,
        instant: basePrice * 1.5,
        timestamp: Date.now(),
        trend: Math.random() > 0.5 ? 'up' : Math.random() > 0.3 ? 'down' : 'stable',
      };
    });
    
    return gasPrices;
  },

  getChainGasPrice: async (chainId: number): Promise<GasPrice> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const allPrices = await mockGasPricesApi.getAllChainGasPrices();
    return allPrices[chainId];
  },

  getChainMetrics: async (): Promise<Record<number, ChainMetrics>> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const metrics: Record<number, ChainMetrics> = {};
    
    Object.values(SUPPORTED_CHAINS).forEach(chainId => {
      metrics[chainId] = {
        chainId,
        gasPrice: Math.random() * 100,
        gasPriceUSD: Math.random() * 50,
        gasTrend: Math.random() > 0.5 ? 'up' : Math.random() > 0.3 ? 'down' : 'stable',
        blockTime: chainId === 1 ? 12 : chainId === 137 ? 2 : 1,
        tps: Math.random() * 1000,
        tvl: Math.random() * 10000000000,
        volume24h: Math.random() * 1000000000,
        bridgeVolume: Math.random() * 100000000,
        successRate: 0.95 + Math.random() * 0.05,
        lastUpdate: Date.now(),
      };
    });
    
    return metrics;
  },

  getGasPriceHistory: async (chainId: number, period: string = '1d') => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const now = Date.now();
    const points = period === '1h' ? 12 : period === '1d' ? 24 : 168;
    const interval = period === '1h' ? 300000 : period === '1d' ? 3600000 : 86400000;
    
    return Array.from({ length: points }, (_, i) => ({
      timestamp: now - (points - i) * interval,
      price: Math.random() * 100,
    }));
  },
};

export const gasPricesApiService = process.env.NODE_ENV === 'development' 
  ? mockGasPricesApi 
  : gasPricesApi;