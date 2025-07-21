import { useState, useEffect, useCallback } from 'react';
import { getOptimizationQuote, getGasPrices } from '../services/api';
import { DEFAULT_USER_PREFERENCES } from '../utils/constants';

export const useGasOptimization = () => {
  const [optimizationQuote, setOptimizationQuote] = useState(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [error, setError] = useState(null);
  const [userPreferences, setUserPreferences] = useState(DEFAULT_USER_PREFERENCES);
  const [gasPrices, setGasPrices] = useState({});

  // Fetch gas prices periodically
  useEffect(() => {
    const fetchGasPrices = async () => {
      try {
        const prices = await getGasPrices();
        setGasPrices(prices);
      } catch (err) {
        console.error('Failed to fetch gas prices:', err);
      }
    };

    fetchGasPrices();
    const interval = setInterval(fetchGasPrices, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Get optimization quote
  const generateOptimizationQuote = useCallback(async (swapParams) => {
    if (!swapParams.tokenIn || !swapParams.tokenOut || !swapParams.amountIn) {
      setOptimizationQuote(null);
      return;
    }

    setIsOptimizing(true);
    setError(null);

    try {
      const quote = await getOptimizationQuote(swapParams);
      setOptimizationQuote(quote);
    } catch (err) {
      console.error('Failed to get optimization quote:', err);
      setError(err.message || 'Failed to calculate optimization');
      setOptimizationQuote(null);
    } finally {
      setIsOptimizing(false);
    }
  }, []);

  // Check if optimization should be enabled
  const shouldOptimize = optimizationQuote?.shouldOptimize && userPreferences.enableCrossChainOptimization;

  // Calculate savings metrics
  const savingsMetrics = optimizationQuote ? {
    absoluteSavings: optimizationQuote.savingsUSD,
    percentageSavings: optimizationQuote.savingsPercentage,
    originalCost: optimizationQuote.originalCostUSD,
    optimizedCost: optimizationQuote.optimizedCostUSD,
    estimatedTime: optimizationQuote.estimatedBridgeTime,
    optimalChain: optimizationQuote.optimizedChainId
  } : null;

  // Update user preferences
  const updateUserPreferences = useCallback((newPreferences) => {
    setUserPreferences(prev => ({
      ...prev,
      ...newPreferences
    }));
  }, []);

  // Get current gas price for a specific chain
  const getGasPriceForChain = useCallback((chainId) => {
    return gasPrices[chainId] || null;
  }, [gasPrices]);

  // Get gas price trend for display
  const getGasPriceTrend = useCallback((chainId) => {
    const priceData = gasPrices[chainId];
    if (!priceData) return null;

    return {
      current: priceData.gas_price_gwei,
      usd: priceData.gas_price_usd,
      trend: 'stable', // Mock trend data
      change: '+2.5%' // Mock change
    };
  }, [gasPrices]);

  return {
    // State
    optimizationQuote,
    isOptimizing,
    error,
    userPreferences,
    gasPrices,
    shouldOptimize,
    savingsMetrics,

    // Actions
    generateOptimizationQuote,
    updateUserPreferences,
    getGasPriceForChain,
    getGasPriceTrend,

    // Utils
    clearError: () => setError(null),
    clearQuote: () => setOptimizationQuote(null)
  };
};

export default useGasOptimization;