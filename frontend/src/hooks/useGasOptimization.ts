import { useState, useCallback, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { OptimizationQuote, UserPreferences, ChainComparison } from '../types/optimization';
import { SwapParams } from '../types/swap';
import { gasOptimizationApi } from '../services/api/gasOptimizationApi';

const DEFAULT_PREFERENCES: UserPreferences = {
  min_savings_threshold_bps: 500, // 5%
  min_absolute_savings_usd: 10.0,
  max_bridge_time_seconds: 1800, // 30 minutes
  enable_cross_chain_optimization: true,
  enable_usd_display: true,
  enable_mev_protection: true,
  receive_notifications: true,
};

interface UseGasOptimizationReturn {
  // State
  optimizationQuote: OptimizationQuote | null;
  userPreferences: UserPreferences;
  isOptimizing: boolean;
  shouldOptimize: boolean;
  chainComparison: ChainComparison[] | null;
  
  // Actions
  getOptimizationQuote: (swapParams: SwapParams) => Promise<void>;
  updateUserPreferences: (preferences: Partial<UserPreferences>) => void;
  resetPreferences: () => void;
  
  // Computed
  potentialSavingsUSD: number;
  potentialSavingsPercentage: number;
  optimalChain: number | null;
  estimatedExecutionTime: number;
}

export const useGasOptimization = (): UseGasOptimizationReturn => {
  const [optimizationQuote, setOptimizationQuote] = useState<OptimizationQuote | null>(null);
  const [userPreferences, setUserPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [currentSwapParams, setCurrentSwapParams] = useState<SwapParams | null>(null);

  // Load user preferences from localStorage
  useEffect(() => {
    const savedPreferences = localStorage.getItem('gasOptimization_userPreferences');
    if (savedPreferences) {
      try {
        const parsed = JSON.parse(savedPreferences);
        setUserPreferences({ ...DEFAULT_PREFERENCES, ...parsed });
      } catch (error) {
        console.error('Error loading user preferences:', error);
      }
    }
  }, []);

  // Save user preferences to localStorage
  useEffect(() => {
    localStorage.setItem('gasOptimization_userPreferences', JSON.stringify(userPreferences));
  }, [userPreferences]);

  // Fetch optimization quote
  const { 
    data: quoteData, 
    isLoading: isOptimizing, 
    refetch: refetchQuote 
  } = useQuery({
    queryKey: ['optimization-quote', currentSwapParams],
    queryFn: async () => {
      if (!currentSwapParams) return null;
      return gasOptimizationApi.getOptimizationQuote(currentSwapParams);
    },
    enabled: !!currentSwapParams,
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // Refetch every minute
  });

  // Update optimization quote when data changes
  useEffect(() => {
    if (quoteData) {
      setOptimizationQuote(quoteData);
    }
  }, [quoteData]);

  const getOptimizationQuote = useCallback(async (swapParams: SwapParams) => {
    setCurrentSwapParams(swapParams);
    refetchQuote();
  }, [refetchQuote]);

  const updateUserPreferences = useCallback((preferences: Partial<UserPreferences>) => {
    setUserPreferences(prev => ({ ...prev, ...preferences }));
  }, []);

  const resetPreferences = useCallback(() => {
    setUserPreferences(DEFAULT_PREFERENCES);
    localStorage.removeItem('gasOptimization_userPreferences');
  }, []);

  // Generate chain comparison data
  const chainComparison: ChainComparison[] | null = optimizationQuote ? [
    {
      chainId: optimizationQuote.original_chain_id,
      chainName: getChainName(optimizationQuote.original_chain_id),
      gasCostUSD: optimizationQuote.cost_breakdown.original_gas_cost,
      bridgeFeeUSD: 0,
      totalCostUSD: optimizationQuote.original_cost_usd,
      executionTime: 30, // seconds
      isOptimal: false,
    },
    {
      chainId: optimizationQuote.optimized_chain_id,
      chainName: getChainName(optimizationQuote.optimized_chain_id),
      gasCostUSD: optimizationQuote.cost_breakdown.optimized_gas_cost,
      bridgeFeeUSD: optimizationQuote.cost_breakdown.bridge_fee,
      totalCostUSD: optimizationQuote.optimized_cost_usd,
      executionTime: optimizationQuote.estimated_bridge_time,
      isOptimal: true,
      savingsUSD: optimizationQuote.savings_usd,
      savingsPercentage: optimizationQuote.savings_percentage,
    },
  ] : null;

  // Computed values
  const shouldOptimize = !!(
    optimizationQuote?.should_optimize &&
    userPreferences.enable_cross_chain_optimization &&
    optimizationQuote.savings_usd >= userPreferences.min_absolute_savings_usd &&
    optimizationQuote.savings_percentage >= (userPreferences.min_savings_threshold_bps / 100) &&
    optimizationQuote.estimated_bridge_time <= userPreferences.max_bridge_time_seconds
  );

  const potentialSavingsUSD = optimizationQuote?.savings_usd || 0;
  const potentialSavingsPercentage = optimizationQuote?.savings_percentage || 0;
  const optimalChain = optimizationQuote?.optimized_chain_id || null;
  const estimatedExecutionTime = optimizationQuote?.estimated_bridge_time || 0;

  return {
    // State
    optimizationQuote,
    userPreferences,
    isOptimizing,
    shouldOptimize,
    chainComparison,
    
    // Actions
    getOptimizationQuote,
    updateUserPreferences,
    resetPreferences,
    
    // Computed
    potentialSavingsUSD,
    potentialSavingsPercentage,
    optimalChain,
    estimatedExecutionTime,
  };
};

// Helper function to get chain name
function getChainName(chainId: number): string {
  const chainNames: Record<number, string> = {
    1: 'Ethereum',
    42161: 'Arbitrum',
    10: 'Optimism',
    137: 'Polygon',
    8453: 'Base',
  };
  return chainNames[chainId] || `Chain ${chainId}`;
}