import { OptimizationQuote, UserPreferences } from '../../types/optimization';
import { apiClient } from './client';

export interface OptimizationParams {
  tokenIn: string;
  tokenOut: string;
  amountIn: string;
  user: string;
  preferences: UserPreferences;
}

export interface OptimizationResponse {
  quote: OptimizationQuote;
  timestamp: number;
  requestId: string;
}

export const gasOptimizationApi = {
  // Get optimization quote
  getOptimizationQuote: async (params: OptimizationParams): Promise<OptimizationQuote> => {
    const response = await apiClient.post<OptimizationResponse>('/optimization/quote', params);
    return response.data.quote;
  },

  // Get user preferences
  getUserPreferences: async (userAddress: string): Promise<UserPreferences> => {
    const response = await apiClient.get<UserPreferences>(`/optimization/preferences/${userAddress}`);
    return response.data;
  },

  // Update user preferences
  updateUserPreferences: async (userAddress: string, preferences: UserPreferences): Promise<void> => {
    await apiClient.put(`/optimization/preferences/${userAddress}`, preferences);
  },

  // Get optimization history
  getOptimizationHistory: async (userAddress: string, limit: number = 50): Promise<OptimizationQuote[]> => {
    const response = await apiClient.get<OptimizationQuote[]>(`/optimization/history/${userAddress}`, {
      params: { limit },
    });
    return response.data;
  },

  // Get system optimization metrics
  getSystemMetrics: async (): Promise<{
    totalOptimizations: number;
    totalSavingsUSD: number;
    avgSavingsPercent: number;
    optimizationRate: number;
  }> => {
    const response = await apiClient.get('/optimization/metrics');
    return response.data;
  },

  // Get chain optimization statistics
  getChainOptimizationStats: async (chainId: number): Promise<{
    swapsExecuted: number;
    totalSavingsUSD: number;
    avgSavingsPercent: number;
    avgExecutionTime: number;
    successRate: number;
  }> => {
    const response = await apiClient.get(`/optimization/stats/${chainId}`);
    return response.data;
  },

  // Get optimal chain for swap
  getOptimalChain: async (params: {
    tokenIn: string;
    tokenOut: string;
    amountIn: string;
    excludeChains?: number[];
  }): Promise<{
    chainId: number;
    expectedSavings: number;
    executionTime: number;
    confidence: number;
  }> => {
    const response = await apiClient.post('/optimization/optimal-chain', params);
    return response.data;
  },

  // Submit optimization feedback
  submitFeedback: async (params: {
    optimizationId: string;
    rating: number;
    feedback?: string;
    actualSavings?: number;
    actualExecutionTime?: number;
  }): Promise<void> => {
    await apiClient.post('/optimization/feedback', params);
  },

  // Get optimization recommendations
  getRecommendations: async (userAddress: string): Promise<{
    recommendedThreshold: number;
    suggestedChains: number[];
    optimizationTips: string[];
  }> => {
    const response = await apiClient.get(`/optimization/recommendations/${userAddress}`);
    return response.data;
  },
};

// Mock implementation for development
const mockGasOptimizationApi = {
  getOptimizationQuote: async (params: OptimizationParams): Promise<OptimizationQuote> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock optimization quote
    const shouldOptimize = Math.random() > 0.3; // 70% chance to optimize
    const originalCost = 50 + Math.random() * 100;
    const optimizedCost = shouldOptimize ? originalCost * (0.2 + Math.random() * 0.6) : originalCost;
    const savingsUSD = originalCost - optimizedCost;
    const savingsPercent = (savingsUSD / originalCost) * 100;
    
    return {
      shouldOptimize,
      originalChainId: 1,
      optimizedChainId: shouldOptimize ? 42161 : 1,
      originalCostUSD: originalCost,
      optimizedCostUSD: optimizedCost,
      savingsUSD,
      savingsPercent,
      estimatedTime: shouldOptimize ? 120 + Math.random() * 300 : 30,
      requiresBridge: shouldOptimize,
      costBreakdown: {
        gasCostUSD: optimizedCost * 0.8,
        bridgeFeeUSD: shouldOptimize ? 2 + Math.random() * 5 : 0,
        slippageCostUSD: optimizedCost * 0.1,
        totalCostUSD: optimizedCost,
      },
      chainComparison: [
        {
          chainId: 1,
          chainName: 'Ethereum',
          gasPrice: 50,
          gasCostUSD: originalCost,
          totalCostUSD: originalCost,
          executionTime: 30,
          savings: 0,
          savingsPercent: 0,
          isOptimal: !shouldOptimize,
        },
        {
          chainId: 42161,
          chainName: 'Arbitrum',
          gasPrice: 0.1,
          gasCostUSD: optimizedCost,
          totalCostUSD: optimizedCost,
          executionTime: 180,
          savings: savingsUSD,
          savingsPercent,
          isOptimal: shouldOptimize,
        },
      ],
      bridgeInfo: shouldOptimize ? {
        provider: 'Across Protocol',
        estimatedTime: 120,
        fee: 2,
        feeUSD: 2,
        route: ['Ethereum', 'Arbitrum'],
        success_rate: 0.98,
      } : undefined,
    };
  },

  getUserPreferences: async (userAddress: string): Promise<UserPreferences> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      minSavingsThresholdBPS: 500,
      minAbsoluteSavingsUSD: 10,
      maxBridgeTime: 1800,
      enableCrossChainOptimization: true,
      enableUSDDisplay: true,
      enableMEVProtection: true,
      receiveNotifications: true,
      preferredChains: [42161, 10],
      excludedChains: [],
    };
  },

  updateUserPreferences: async (userAddress: string, preferences: UserPreferences): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    // Mock successful update
  },

  getOptimizationHistory: async (userAddress: string, limit: number = 50): Promise<OptimizationQuote[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return mock history
    return Array.from({ length: Math.min(limit, 10) }, (_, i) => ({
      shouldOptimize: true,
      originalChainId: 1,
      optimizedChainId: 42161,
      originalCostUSD: 50 + i * 10,
      optimizedCostUSD: 20 + i * 5,
      savingsUSD: 30 + i * 5,
      savingsPercent: 60 - i * 2,
      estimatedTime: 120 + i * 30,
      requiresBridge: true,
      costBreakdown: {
        gasCostUSD: 15 + i * 4,
        bridgeFeeUSD: 3,
        slippageCostUSD: 2 + i,
        totalCostUSD: 20 + i * 5,
      },
      chainComparison: [],
    }));
  },

  getSystemMetrics: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      totalOptimizations: 15847,
      totalSavingsUSD: 2847593,
      avgSavingsPercent: 42.7,
      optimizationRate: 0.73,
    };
  },

  getChainOptimizationStats: async (chainId: number) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      swapsExecuted: 3421,
      totalSavingsUSD: 584729,
      avgSavingsPercent: 38.5,
      avgExecutionTime: 145,
      successRate: 0.97,
    };
  },

  getOptimalChain: async (params: any) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      chainId: 42161,
      expectedSavings: 25.4,
      executionTime: 180,
      confidence: 0.92,
    };
  },

  submitFeedback: async (params: any): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
  },

  getRecommendations: async (userAddress: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      recommendedThreshold: 3.5,
      suggestedChains: [42161, 10, 8453],
      optimizationTips: [
        'Consider swapping on Arbitrum for lower gas fees',
        'Enable cross-chain optimization for better savings',
        'Set your savings threshold to 3-5% for optimal results',
      ],
    };
  },
};

// Use mock API in development
export const gasOptimizationApiService = process.env.NODE_ENV === 'development' 
  ? mockGasOptimizationApi 
  : gasOptimizationApi;