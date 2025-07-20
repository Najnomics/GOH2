import { SwapParams, SwapQuote } from '../../types/swap';
import { OptimizationQuote } from '../../types/optimization';
import { apiClient } from './client';

export interface SwapResponse {
  transaction: any;
  hash: string;
  timestamp: number;
}

export const swapApi = {
  // Get swap quote
  getSwapQuote: async (params: SwapParams): Promise<SwapQuote> => {
    const response = await apiClient.post<SwapQuote>('/swap/quote', params);
    return response.data;
  },

  // Execute local swap
  executeLocalSwap: async (params: SwapParams): Promise<SwapResponse> => {
    const response = await apiClient.post<SwapResponse>('/swap/execute', params);
    return response.data;
  },

  // Execute cross-chain swap
  executeCrossChainSwap: async (
    params: SwapParams,
    optimization: OptimizationQuote
  ): Promise<SwapResponse> => {
    const response = await apiClient.post<SwapResponse>('/swap/execute-cross-chain', {
      swapParams: params,
      optimization,
    });
    return response.data;
  },

  // Get swap status
  getSwapStatus: async (txHash: string): Promise<{
    status: 'pending' | 'success' | 'failed';
    confirmations: number;
    timestamp: number;
  }> => {
    const response = await apiClient.get(`/swap/status/${txHash}`);
    return response.data;
  },

  // Get swap history
  getSwapHistory: async (userAddress: string, limit: number = 50): Promise<any[]> => {
    const response = await apiClient.get(`/swap/history/${userAddress}`, {
      params: { limit },
    });
    return response.data;
  },
};

// Mock implementation for development
const mockSwapApi = {
  getSwapQuote: async (params: SwapParams): Promise<SwapQuote> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const amountIn = parseFloat(params.amountIn);
    const amountOut = amountIn * 0.99; // 1% slippage
    
    return {
      amountIn: params.amountIn,
      amountOut: amountOut.toString(),
      priceImpact: 0.1 + Math.random() * 2, // 0.1% to 2.1%
      route: [params.tokenIn.symbol, params.tokenOut.symbol],
      gasEstimate: (20 + Math.random() * 80).toFixed(2),
      gasPrice: (30 + Math.random() * 100).toFixed(2),
      executionTime: 30 + Math.random() * 60,
    };
  },

  executeLocalSwap: async (params: SwapParams): Promise<SwapResponse> => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return {
      transaction: {
        hash: '0x' + Math.random().toString(16).substr(2, 64),
        from: '0x123...',
        to: '0x456...',
        value: params.amountIn,
        gasLimit: '150000',
        gasPrice: '30000000000',
      },
      hash: '0x' + Math.random().toString(16).substr(2, 64),
      timestamp: Date.now(),
    };
  },

  executeCrossChainSwap: async (
    params: SwapParams,
    optimization: OptimizationQuote
  ): Promise<SwapResponse> => {
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    return {
      transaction: {
        hash: '0x' + Math.random().toString(16).substr(2, 64),
        from: '0x123...',
        to: '0x456...',
        value: params.amountIn,
        gasLimit: '250000',
        gasPrice: '30000000000',
        crossChain: true,
        targetChain: optimization.optimizedChainId,
      },
      hash: '0x' + Math.random().toString(16).substr(2, 64),
      timestamp: Date.now(),
    };
  },

  getSwapStatus: async (txHash: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      status: 'success' as const,
      confirmations: 12,
      timestamp: Date.now(),
    };
  },

  getSwapHistory: async (userAddress: string, limit: number = 50) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return Array.from({ length: Math.min(limit, 10) }, (_, i) => ({
      id: i + 1,
      hash: '0x' + Math.random().toString(16).substr(2, 64),
      timestamp: Date.now() - i * 86400000,
      tokenIn: { symbol: 'USDC', amount: '1000' },
      tokenOut: { symbol: 'ETH', amount: '0.5' },
      status: 'success',
      savings: Math.random() * 50,
    }));
  },
};

export const swapApiService = process.env.NODE_ENV === 'development' ? mockSwapApi : swapApi;