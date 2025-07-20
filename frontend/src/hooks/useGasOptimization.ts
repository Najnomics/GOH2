import { useState, useEffect, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { OptimizationQuote, UserPreferences } from '../types/optimization';
import { SwapParams } from '../types/swap';
import { DEFAULT_SETTINGS } from '../utils/constants';
import { getLocalStorageItem, setLocalStorageItem } from '../utils/helpers';
import { gasOptimizationApi } from '../services/api/gasOptimizationApi';

export const useGasOptimization = () => {
  const { address, isConnected } = useAccount();
  const [optimizationQuote, setOptimizationQuote] = useState<OptimizationQuote | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shouldOptimize, setShouldOptimize] = useState(false);
  
  // Load user preferences from localStorage
  const [userPreferences, setUserPreferences] = useState<UserPreferences>(() => {
    const stored = getLocalStorageItem('gasopt_user_preferences', null);
    return stored || {
      minSavingsThresholdBPS: DEFAULT_SETTINGS.MIN_SAVINGS_THRESHOLD * 100,
      minAbsoluteSavingsUSD: DEFAULT_SETTINGS.MIN_ABSOLUTE_SAVINGS,
      maxBridgeTime: DEFAULT_SETTINGS.MAX_BRIDGE_TIME * 60,
      enableCrossChainOptimization: DEFAULT_SETTINGS.ENABLE_CROSS_CHAIN,
      enableUSDDisplay: DEFAULT_SETTINGS.ENABLE_USD_DISPLAY,
      enableMEVProtection: DEFAULT_SETTINGS.ENABLE_MEV_PROTECTION,
      receiveNotifications: DEFAULT_SETTINGS.ENABLE_NOTIFICATIONS,
      preferredChains: [],
      excludedChains: [],
    };
  });

  // Save preferences to localStorage when they change
  useEffect(() => {
    setLocalStorageItem('gasopt_user_preferences', userPreferences);
  }, [userPreferences]);

  // Update preferences
  const updatePreferences = useCallback((newPreferences: Partial<UserPreferences>) => {
    setUserPreferences(prev => ({ ...prev, ...newPreferences }));
  }, []);

  // Get optimization quote
  const getOptimizationQuote = useCallback(async (
    swapParams: SwapParams
  ): Promise<OptimizationQuote | null> => {
    if (!isConnected || !address) {
      setError('Wallet not connected');
      return null;
    }

    if (!userPreferences.enableCrossChainOptimization) {
      return null;
    }

    setIsOptimizing(true);
    setError(null);

    try {
      const quote = await gasOptimizationApi.getOptimizationQuote({
        tokenIn: swapParams.tokenIn.address,
        tokenOut: swapParams.tokenOut.address,
        amountIn: swapParams.amountIn,
        user: address,
        preferences: userPreferences,
      });

      setOptimizationQuote(quote);
      setShouldOptimize(quote.shouldOptimize);
      return quote;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get optimization quote';
      setError(errorMessage);
      return null;
    } finally {
      setIsOptimizing(false);
    }
  }, [address, isConnected, userPreferences]);

  // Clear optimization data
  const clearOptimization = useCallback(() => {
    setOptimizationQuote(null);
    setShouldOptimize(false);
    setError(null);
  }, []);

  // Check if optimization is beneficial
  const isOptimizationBeneficial = useCallback((quote: OptimizationQuote): boolean => {
    if (!quote) return false;
    
    return (
      quote.savingsUSD >= userPreferences.minAbsoluteSavingsUSD &&
      quote.savingsPercent >= userPreferences.minSavingsThresholdBPS / 100 &&
      quote.estimatedTime <= userPreferences.maxBridgeTime
    );
  }, [userPreferences]);

  // Get savings display text
  const getSavingsDisplay = useCallback((quote: OptimizationQuote): string => {
    if (!quote || !quote.shouldOptimize) return '';
    
    const savingsUSD = quote.savingsUSD.toFixed(2);
    const savingsPercent = quote.savingsPercent.toFixed(1);
    
    return userPreferences.enableUSDDisplay 
      ? `Save $${savingsUSD} (${savingsPercent}%)`
      : `Save ${savingsPercent}%`;
  }, [userPreferences.enableUSDDisplay]);

  // Get optimization recommendation
  const getOptimizationRecommendation = useCallback((quote: OptimizationQuote): {
    action: 'optimize' | 'stay' | 'wait';
    reason: string;
  } => {
    if (!quote) return { action: 'stay', reason: 'No quote available' };
    
    if (!quote.shouldOptimize) {
      return { action: 'stay', reason: 'Current chain is optimal' };
    }
    
    if (quote.savingsUSD < userPreferences.minAbsoluteSavingsUSD) {
      return { action: 'stay', reason: 'Savings below threshold' };
    }
    
    if (quote.estimatedTime > userPreferences.maxBridgeTime) {
      return { action: 'wait', reason: 'Bridge time too long' };
    }
    
    return { action: 'optimize', reason: 'Optimization recommended' };
  }, [userPreferences]);

  // Auto-refresh optimization quote
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    if (optimizationQuote && isConnected) {
      intervalId = setInterval(() => {
        // Refresh quote every 30 seconds
        // This would typically re-run the optimization check
      }, 30000);
    }
    
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [optimizationQuote, isConnected]);

  return {
    // State
    optimizationQuote,
    isOptimizing,
    error,
    shouldOptimize,
    userPreferences,
    
    // Actions
    getOptimizationQuote,
    clearOptimization,
    updatePreferences,
    
    // Computed values
    isOptimizationBeneficial,
    getSavingsDisplay,
    getOptimizationRecommendation,
  };
};