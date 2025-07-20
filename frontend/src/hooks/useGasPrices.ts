import { useState, useEffect, useCallback } from 'react';
import { useChainId } from 'wagmi';
import { GasPrice, ChainMetrics } from '../types/chain';
import { SUPPORTED_CHAINS } from '../utils/constants';
import { gasPricesApi } from '../services/api/gasPricesApi';

export const useGasPrices = () => {
  const chainId = useChainId();
  
  // State
  const [gasPrices, setGasPrices] = useState<Record<number, GasPrice>>({});
  const [chainMetrics, setChainMetrics] = useState<Record<number, ChainMetrics>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<number>(0);

  // Load gas prices for all supported chains
  const loadGasPrices = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const prices = await gasPricesApi.getAllChainGasPrices();
      setGasPrices(prices);
      setLastUpdated(Date.now());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load gas prices');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load chain metrics
  const loadChainMetrics = useCallback(async () => {
    try {
      const metrics = await gasPricesApi.getChainMetrics();
      setChainMetrics(metrics);
    } catch (err) {
      console.error('Failed to load chain metrics:', err);
    }
  }, []);

  // Get gas price for specific chain
  const getGasPrice = useCallback((targetChainId: number): GasPrice | null => {
    return gasPrices[targetChainId] || null;
  }, [gasPrices]);

  // Get current chain gas price
  const getCurrentGasPrice = useCallback((): GasPrice | null => {
    if (!chainId) return null;
    return getGasPrice(chainId);
  }, [chainId, getGasPrice]);

  // Get gas price in USD
  const getGasPriceUSD = useCallback((targetChainId: number, gasLimit: number = 21000): number => {
    const gasPrice = getGasPrice(targetChainId);
    const metrics = chainMetrics[targetChainId];
    
    if (!gasPrice || !metrics) return 0;
    
    const gasCostEth = (gasLimit * gasPrice.standard) / 1e18;
    return gasCostEth * metrics.gasPriceUSD;
  }, [getGasPrice, chainMetrics]);

  // Get cheapest chain
  const getCheapestChain = useCallback((): { chainId: number; gasPrice: GasPrice } | null => {
    let cheapest: { chainId: number; gasPrice: GasPrice } | null = null;
    
    Object.entries(gasPrices).forEach(([chainIdStr, gasPrice]) => {
      const chainId = parseInt(chainIdStr);
      if (!cheapest || gasPrice.standard < cheapest.gasPrice.standard) {
        cheapest = { chainId, gasPrice };
      }
    });
    
    return cheapest;
  }, [gasPrices]);

  // Get most expensive chain
  const getMostExpensiveChain = useCallback((): { chainId: number; gasPrice: GasPrice } | null => {
    let expensive: { chainId: number; gasPrice: GasPrice } | null = null;
    
    Object.entries(gasPrices).forEach(([chainIdStr, gasPrice]) => {
      const chainId = parseInt(chainIdStr);
      if (!expensive || gasPrice.standard > expensive.gasPrice.standard) {
        expensive = { chainId, gasPrice };
      }
    });
    
    return expensive;
  }, [gasPrices]);

  // Get gas price trend
  const getGasTrend = useCallback((targetChainId: number): 'up' | 'down' | 'stable' => {
    const gasPrice = getGasPrice(targetChainId);
    return gasPrice?.trend || 'stable';
  }, [getGasPrice]);

  // Get chain metrics
  const getChainMetrics = useCallback((targetChainId: number): ChainMetrics | null => {
    return chainMetrics[targetChainId] || null;
  }, [chainMetrics]);

  // Compare gas prices across chains
  const compareGasPrices = useCallback((gasLimit: number = 21000) => {
    const comparisons: {
      chainId: number;
      gasPrice: GasPrice;
      gasCostUSD: number;
      savings: number;
      savingsPercent: number;
    }[] = [];
    
    let maxCost = 0;
    
    // First pass: calculate costs
    Object.entries(gasPrices).forEach(([chainIdStr, gasPrice]) => {
      const chainId = parseInt(chainIdStr);
      const gasCostUSD = getGasPriceUSD(chainId, gasLimit);
      maxCost = Math.max(maxCost, gasCostUSD);
      
      comparisons.push({
        chainId,
        gasPrice,
        gasCostUSD,
        savings: 0,
        savingsPercent: 0,
      });
    });
    
    // Second pass: calculate savings
    return comparisons.map(comp => ({
      ...comp,
      savings: maxCost - comp.gasCostUSD,
      savingsPercent: maxCost > 0 ? ((maxCost - comp.gasCostUSD) / maxCost) * 100 : 0,
    })).sort((a, b) => a.gasCostUSD - b.gasCostUSD);
  }, [gasPrices, getGasPriceUSD]);

  // Get gas price alert thresholds
  const getGasAlerts = useCallback((targetChainId: number) => {
    const gasPrice = getGasPrice(targetChainId);
    if (!gasPrice) return null;
    
    const standard = gasPrice.standard;
    
    return {
      low: standard * 0.7,      // 30% below standard
      high: standard * 1.5,     // 50% above standard
      extreme: standard * 2.0,  // 100% above standard
    };
  }, [getGasPrice]);

  // Check if gas price is stale
  const isGasPriceStale = useCallback((targetChainId: number, maxAge: number = 300000): boolean => {
    const gasPrice = getGasPrice(targetChainId);
    if (!gasPrice) return true;
    
    return Date.now() - gasPrice.timestamp > maxAge;
  }, [getGasPrice]);

  // Get formatted gas price display
  const getFormattedGasPrice = useCallback((targetChainId: number, speed: 'slow' | 'standard' | 'fast' | 'instant' = 'standard') => {
    const gasPrice = getGasPrice(targetChainId);
    if (!gasPrice) return { gwei: '0', usd: '$0.00' };
    
    const gweiPrice = gasPrice[speed];
    const usdPrice = getGasPriceUSD(targetChainId, 21000);
    
    return {
      gwei: `${gweiPrice.toFixed(2)} gwei`,
      usd: `$${usdPrice.toFixed(2)}`,
    };
  }, [getGasPrice, getGasPriceUSD]);

  // Auto-refresh gas prices
  useEffect(() => {
    // Load initial data
    loadGasPrices();
    loadChainMetrics();
    
    // Set up auto-refresh
    const intervalId = setInterval(() => {
      loadGasPrices();
      loadChainMetrics();
    }, 30000); // Refresh every 30 seconds
    
    return () => clearInterval(intervalId);
  }, [loadGasPrices, loadChainMetrics]);

  return {
    // State
    gasPrices,
    chainMetrics,
    isLoading,
    error,
    lastUpdated,
    
    // Actions
    loadGasPrices,
    loadChainMetrics,
    
    // Getters
    getGasPrice,
    getCurrentGasPrice,
    getGasPriceUSD,
    getChainMetrics,
    getCheapestChain,
    getMostExpensiveChain,
    getGasTrend,
    getGasAlerts,
    getFormattedGasPrice,
    
    // Utilities
    compareGasPrices,
    isGasPriceStale,
  };
};