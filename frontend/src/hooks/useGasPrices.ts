import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ChainGasPrice, ChainInfo } from '../types/chain';
import { gasOptimizationApi } from '../services/api/gasOptimizationApi';

interface UseGasPricesReturn {
  // Gas price data
  gasPrices: Record<string, ChainGasPrice>;
  chainInfo: ChainInfo[];
  
  // Loading states
  isLoadingGasPrices: boolean;
  isLoadingChains: boolean;
  
  // Actions
  refreshGasPrices: () => void;
  refreshChains: () => void;
  
  // Utilities
  getGasPriceForChain: (chainId: number) => ChainGasPrice | null;
  getCheapestChain: () => ChainInfo | null;
  getMostExpensiveChain: () => ChainInfo | null;
  getGasPriceTrend: (chainId: number) => 'up' | 'down' | 'stable';
}

export const useGasPrices = (): UseGasPricesReturn => {
  const [previousGasPrices, setPreviousGasPrices] = useState<Record<string, number>>({});

  // Fetch current gas prices
  const { 
    data: gasPricesData = {}, 
    isLoading: isLoadingGasPrices, 
    refetch: refetchGasPrices 
  } = useQuery({
    queryKey: ['gas-prices'],
    queryFn: async () => {
      const data = await gasOptimizationApi.getGasPrices();
      
      // Store previous prices for trend calculation
      const currentPrices: Record<string, number> = {};
      Object.entries(data).forEach(([chainId, priceData]: [string, any]) => {
        currentPrices[chainId] = priceData.gas_price_gwei;
      });
      setPreviousGasPrices(prev => ({ ...prev, ...currentPrices }));
      
      // Convert to ChainGasPrice format
      const gasPrices: Record<string, ChainGasPrice> = {};
      Object.entries(data).forEach(([chainId, priceData]: [string, any]) => {
        gasPrices[chainId] = {
          chainId: parseInt(chainId),
          gasPrice: priceData.gas_price_gwei.toString(),
          gasPriceUSD: priceData.gas_price_usd.toString(),
          timestamp: new Date(priceData.timestamp).getTime(),
        };
      });
      
      return gasPrices;
    },
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refetch every minute
  });

  // Fetch chain information
  const { 
    data: chainInfo = [], 
    isLoading: isLoadingChains, 
    refetch: refetchChains 
  } = useQuery({
    queryKey: ['chain-info'],
    queryFn: () => gasOptimizationApi.getSupportedChains(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const getGasPriceForChain = useCallback((chainId: number): ChainGasPrice | null => {
    return gasPricesData[chainId.toString()] || null;
  }, [gasPricesData]);

  const getCheapestChain = useCallback((): ChainInfo | null => {
    if (chainInfo.length === 0) return null;
    
    return chainInfo.reduce((cheapest, chain) => 
      chain.gas_price_usd < cheapest.gas_price_usd ? chain : cheapest
    );
  }, [chainInfo]);

  const getMostExpensiveChain = useCallback((): ChainInfo | null => {
    if (chainInfo.length === 0) return null;
    
    return chainInfo.reduce((expensive, chain) => 
      chain.gas_price_usd > expensive.gas_price_usd ? chain : expensive
    );
  }, [chainInfo]);

  const getGasPriceTrend = useCallback((chainId: number): 'up' | 'down' | 'stable' => {
    const current = gasPricesData[chainId.toString()];
    const previous = previousGasPrices[chainId.toString()];
    
    if (!current || !previous) return 'stable';
    
    const currentPrice = parseFloat(current.gasPrice);
    const threshold = 0.05; // 5% threshold for trend detection
    
    if (currentPrice > previous * (1 + threshold)) return 'up';
    if (currentPrice < previous * (1 - threshold)) return 'down';
    return 'stable';
  }, [gasPricesData, previousGasPrices]);

  const refreshGasPrices = useCallback(() => {
    refetchGasPrices();
  }, [refetchGasPrices]);

  const refreshChains = useCallback(() => {
    refetchChains();
  }, [refetchChains]);

  return {
    // Gas price data
    gasPrices: gasPricesData,
    chainInfo,
    
    // Loading states
    isLoadingGasPrices,
    isLoadingChains,
    
    // Actions
    refreshGasPrices,
    refreshChains,
    
    // Utilities
    getGasPriceForChain,
    getCheapestChain,
    getMostExpensiveChain,
    getGasPriceTrend,
  };
};