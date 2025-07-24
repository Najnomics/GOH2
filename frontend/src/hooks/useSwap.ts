import { useState, useCallback, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { Token } from '../types/token';
import { SwapParams, SwapExecution, SwapQuote, SwapSettings } from '../types/swap';
import { gasOptimizationApi } from '../services/api/gasOptimizationApi';

interface UseSwapReturn {
  // State
  tokenIn: Token | null;
  tokenOut: Token | null;
  amountIn: string;
  amountOut: string;
  isLoading: boolean;
  settings: SwapSettings;
  quote: SwapQuote | null;
  
  // Actions
  setTokenIn: (token: Token) => void;
  setTokenOut: (token: Token) => void;
  setAmountIn: (amount: string) => void;
  setSettings: (settings: SwapSettings) => void;
  flipTokens: () => void;
  executeSwap: () => Promise<void>;
  refreshQuote: () => void;
  
  // Computed
  canSwap: boolean;
  priceImpact: number;
  minimumReceived: string;
  executionPrice: string;
}

const DEFAULT_SETTINGS: SwapSettings = {
  slippageTolerance: 0.5,
  deadline: 30,
  infiniteApproval: false,
  expertMode: false,
};

export const useSwap = (): UseSwapReturn => {
  const [tokenIn, setTokenIn] = useState<Token | null>(null);
  const [tokenOut, setTokenOut] = useState<Token | null>(null);
  const [amountIn, setAmountIn] = useState<string>('');
  const [amountOut, setAmountOut] = useState<string>('');
  const [settings, setSettings] = useState<SwapSettings>(DEFAULT_SETTINGS);
  const [quote, setQuote] = useState<SwapQuote | null>(null);
  
  const queryClient = useQueryClient();

  // Fetch quote when parameters change
  const { 
    data: quoteData, 
    isLoading: isQuoteLoading, 
    refetch: refetchQuote 
  } = useQuery({
    queryKey: ['swap-quote', tokenIn?.address, tokenOut?.address, amountIn],
    queryFn: async () => {
      if (!tokenIn || !tokenOut || !amountIn || parseFloat(amountIn) <= 0) {
        return null;
      }

      const swapParams: SwapParams = {
        token_in: tokenIn.address,
        token_out: tokenOut.address,
        amount_in: amountIn,
        slippage_tolerance: settings.slippageTolerance,
        deadline_minutes: settings.deadline,
      };

      // In a full implementation, this would get a detailed quote
      // For now, we'll calculate a simple quote
      const mockQuote: SwapQuote = {
        amountIn,
        amountOut: (parseFloat(amountIn) * 0.998).toString(), // Mock 0.2% price impact
        priceImpact: 0.2,
        minimumAmountOut: (parseFloat(amountIn) * 0.995).toString(),
        executionPrice: '1.0',
        route: [{
          protocol: 'Uniswap V4',
          tokenIn,
          tokenOut,
          amountIn,
          amountOut: (parseFloat(amountIn) * 0.998).toString(),
          poolFee: 3000,
        }],
      };

      return mockQuote;
    },
    enabled: !!(tokenIn && tokenOut && amountIn && parseFloat(amountIn) > 0),
    staleTime: 10000, // 10 seconds
    refetchInterval: 15000, // Refetch every 15 seconds
  });

  // Update quote and amountOut when quote data changes
  useEffect(() => {
    if (quoteData) {
      setQuote(quoteData);
      setAmountOut(quoteData.amountOut);
    } else {
      setQuote(null);
      setAmountOut('');
    }
  }, [quoteData]);

  // Execute swap mutation
  const swapMutation = useMutation({
    mutationFn: async () => {
      if (!tokenIn || !tokenOut || !amountIn) {
        throw new Error('Missing swap parameters');
      }

      const swapParams: SwapParams = {
        token_in: tokenIn.address,
        token_out: tokenOut.address,
        amount_in: amountIn,
        slippage_tolerance: settings.slippageTolerance,
        deadline_minutes: settings.deadline,
      };

      return gasOptimizationApi.executeSwap(swapParams);
    },
    onSuccess: (data: SwapExecution) => {
      toast.success(`Swap initiated! ID: ${data.swap_id}`);
      
      // Clear form
      setAmountIn('');
      setAmountOut('');
      setQuote(null);
      
      // Refresh balances and other data
      queryClient.invalidateQueries({ queryKey: ['token-balances'] });
    },
    onError: (error: any) => {
      toast.error(`Swap failed: ${error.message}`);
      console.error('Swap error:', error);
    },
  });

  const flipTokens = useCallback(() => {
    if (tokenIn && tokenOut) {
      setTokenIn(tokenOut);
      setTokenOut(tokenIn);
      setAmountIn(amountOut);
      setAmountOut('');
    }
  }, [tokenIn, tokenOut, amountOut]);

  const executeSwap = useCallback(async () => {
    if (!canSwap) return;
    await swapMutation.mutateAsync();
  }, [swapMutation, tokenIn, tokenOut, amountIn]);

  const refreshQuote = useCallback(() => {
    refetchQuote();
  }, [refetchQuote]);

  // Computed values
  const canSwap = !!(
    tokenIn && 
    tokenOut && 
    amountIn && 
    parseFloat(amountIn) > 0 && 
    quote &&
    !isQuoteLoading &&
    !swapMutation.isPending
  );

  const priceImpact = quote?.priceImpact || 0;
  const minimumReceived = quote?.minimumAmountOut || '';
  const executionPrice = quote?.executionPrice || '';

  return {
    // State
    tokenIn,
    tokenOut,
    amountIn,
    amountOut,
    isLoading: isQuoteLoading || swapMutation.isPending,
    settings,
    quote,
    
    // Actions
    setTokenIn,
    setTokenOut,
    setAmountIn,
    setSettings,
    flipTokens,
    executeSwap,
    refreshQuote,
    
    // Computed
    canSwap,
    priceImpact,
    minimumReceived,
    executionPrice,
  };
};