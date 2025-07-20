import { useState, useCallback, useEffect } from 'react';
import { useAccount, useChainId } from 'wagmi';
import { SwapParams, SwapQuote, SwapState, Token } from '../types/swap';
import { OptimizationQuote } from '../types/optimization';
import { DEFAULT_SETTINGS } from '../utils/constants';
import { getLocalStorageItem, setLocalStorageItem } from '../utils/helpers';
import { swapApi } from '../services/api/swapApi';
import { useGasOptimization } from './useGasOptimization';
import { useTokens } from './useTokens';

export const useSwap = () => {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { getOptimizationQuote, optimizationQuote, shouldOptimize } = useGasOptimization();
  const { getTokenBalance } = useTokens();
  
  // Swap state
  const [swapState, setSwapState] = useState<SwapState>({
    isLoading: false,
    error: null,
    quote: null,
    transaction: null,
    status: 'idle',
  });
  
  // Token selection
  const [tokenIn, setTokenIn] = useState<Token | null>(null);
  const [tokenOut, setTokenOut] = useState<Token | null>(null);
  const [amountIn, setAmountIn] = useState<string>('');
  const [amountOut, setAmountOut] = useState<string>('');
  
  // Swap settings
  const [swapSettings, setSwapSettings] = useState(() => {
    const stored = getLocalStorageItem('gasopt_swap_settings', null);
    return stored || {
      slippage: DEFAULT_SETTINGS.SLIPPAGE,
      deadline: DEFAULT_SETTINGS.DEADLINE,
      gasPrice: DEFAULT_SETTINGS.GAS_PRICE,
      customGasPrice: undefined,
      enableMEVProtection: DEFAULT_SETTINGS.ENABLE_MEV_PROTECTION,
    };
  });

  // Save settings to localStorage
  useEffect(() => {
    setLocalStorageItem('gasopt_swap_settings', swapSettings);
  }, [swapSettings]);

  // Update swap settings
  const updateSwapSettings = useCallback((newSettings: Partial<typeof swapSettings>) => {
    setSwapSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  // Flip token positions
  const flipTokens = useCallback(() => {
    if (tokenIn && tokenOut) {
      setTokenIn(tokenOut);
      setTokenOut(tokenIn);
      setAmountIn(amountOut);
      setAmountOut(amountIn);
    }
  }, [tokenIn, tokenOut, amountIn, amountOut]);

  // Get swap quote
  const getSwapQuote = useCallback(async (
    params: SwapParams
  ): Promise<SwapQuote | null> => {
    if (!isConnected || !address) {
      setSwapState(prev => ({ ...prev, error: 'Wallet not connected' }));
      return null;
    }

    setSwapState(prev => ({ 
      ...prev, 
      isLoading: true, 
      error: null,
      status: 'pending'
    }));

    try {
      const quote = await swapApi.getSwapQuote(params);
      
      setSwapState(prev => ({
        ...prev,
        quote,
        isLoading: false,
        status: 'idle'
      }));
      
      return quote;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get swap quote';
      setSwapState(prev => ({
        ...prev,
        error: errorMessage,
        isLoading: false,
        status: 'error'
      }));
      return null;
    }
  }, [address, isConnected]);

  // Execute swap
  const executeSwap = useCallback(async (
    params: SwapParams,
    optimization?: OptimizationQuote
  ) => {
    if (!isConnected || !address) {
      setSwapState(prev => ({ ...prev, error: 'Wallet not connected' }));
      return;
    }

    setSwapState(prev => ({ 
      ...prev, 
      isLoading: true, 
      error: null,
      status: 'pending'
    }));

    try {
      const transaction = optimization && optimization.shouldOptimize
        ? await swapApi.executeCrossChainSwap(params, optimization)
        : await swapApi.executeLocalSwap(params);

      setSwapState(prev => ({
        ...prev,
        transaction,
        isLoading: false,
        status: 'success'
      }));

      return transaction;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to execute swap';
      setSwapState(prev => ({
        ...prev,
        error: errorMessage,
        isLoading: false,
        status: 'error'
      }));
      throw err;
    }
  }, [address, isConnected]);

  // Auto-update amounts and quotes
  useEffect(() => {
    const updateAmounts = async () => {
      if (!tokenIn || !tokenOut || !amountIn || !isConnected) {
        setAmountOut('');
        return;
      }

      const swapParams: SwapParams = {
        tokenIn,
        tokenOut,
        amountIn,
        amountOut: '',
        slippage: swapSettings.slippage,
        deadline: Date.now() + swapSettings.deadline * 60 * 1000,
        recipient: address!,
      };

      // Get swap quote
      const quote = await getSwapQuote(swapParams);
      if (quote) {
        setAmountOut(quote.amountOut);
        
        // Get optimization quote
        await getOptimizationQuote({
          ...swapParams,
          amountOut: quote.amountOut,
        });
      }
    };

    const timeoutId = setTimeout(updateAmounts, 500); // Debounce
    return () => clearTimeout(timeoutId);
  }, [
    tokenIn,
    tokenOut,
    amountIn,
    swapSettings.slippage,
    swapSettings.deadline,
    address,
    isConnected,
    getSwapQuote,
    getOptimizationQuote,
  ]);

  // Check if swap is ready
  const canSwap = useCallback((): boolean => {
    if (!tokenIn || !tokenOut || !amountIn || !isConnected) return false;
    
    const balance = getTokenBalance(tokenIn);
    if (!balance || parseFloat(balance.formatted) < parseFloat(amountIn)) {
      return false;
    }
    
    return true;
  }, [tokenIn, tokenOut, amountIn, isConnected, getTokenBalance]);

  // Get swap summary
  const getSwapSummary = useCallback(() => {
    if (!tokenIn || !tokenOut || !amountIn || !amountOut) return null;
    
    const quote = swapState.quote;
    const optimization = optimizationQuote;
    
    return {
      tokenIn,
      tokenOut,
      amountIn,
      amountOut,
      priceImpact: quote?.priceImpact || 0,
      gasEstimate: quote?.gasEstimate || '0',
      executionTime: quote?.executionTime || 0,
      optimization,
      shouldOptimize: optimization?.shouldOptimize || false,
      savings: optimization?.savingsUSD || 0,
      savingsPercent: optimization?.savingsPercent || 0,
      estimatedTime: optimization?.estimatedTime || quote?.executionTime || 0,
    };
  }, [tokenIn, tokenOut, amountIn, amountOut, swapState.quote, optimizationQuote]);

  // Reset swap state
  const resetSwap = useCallback(() => {
    setTokenIn(null);
    setTokenOut(null);
    setAmountIn('');
    setAmountOut('');
    setSwapState({
      isLoading: false,
      error: null,
      quote: null,
      transaction: null,
      status: 'idle',
    });
  }, []);

  return {
    // State
    swapState,
    tokenIn,
    tokenOut,
    amountIn,
    amountOut,
    swapSettings,
    
    // Actions
    setTokenIn,
    setTokenOut,
    setAmountIn,
    setAmountOut,
    flipTokens,
    updateSwapSettings,
    getSwapQuote,
    executeSwap,
    resetSwap,
    
    // Computed values
    canSwap: canSwap(),
    swapSummary: getSwapSummary(),
    isCrossChain: shouldOptimize && optimizationQuote?.shouldOptimize,
  };
};