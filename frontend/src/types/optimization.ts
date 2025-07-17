// Optimization-related types
export interface OptimizationQuote {
  shouldOptimize: boolean;
  originalChainId: number;
  optimizedChainId: number;
  originalCostUSD: number;
  optimizedCostUSD: number;
  savingsUSD: number;
  savingsPercent: number;
  estimatedTime: number;
  requiresBridge: boolean;
  costBreakdown: CostBreakdown;
  chainComparison: ChainComparison[];
  bridgeInfo?: BridgeInfo;
  bridgeData?: string;
}

export interface CostBreakdown {
  gasCostUSD: number;
  bridgeFeeUSD: number;
  slippageCostUSD: number;
  totalCostUSD: number;
  mevProtectionFee?: number;
}

export interface ChainComparison {
  chainId: number;
  chainName: string;
  gasPrice: number;
  gasCostUSD: number;
  totalCostUSD: number;
  executionTime: number;
  savings: number;
  savingsPercent: number;
  isOptimal: boolean;
}

export interface BridgeInfo {
  provider: string;
  estimatedTime: number;
  fee: number;
  feeUSD: number;
  route: string[];
  success_rate: number;
}

export interface UserPreferences {
  minSavingsThresholdBPS: number;
  minAbsoluteSavingsUSD: number;
  maxBridgeTime: number;
  enableCrossChainOptimization: boolean;
  enableUSDDisplay: boolean;
  enableMEVProtection: boolean;
  receiveNotifications: boolean;
  preferredChains: number[];
  excludedChains: number[];
}

export interface OptimizationSettings {
  autoOptimize: boolean;
  savingsThreshold: number;
  maxBridgeTime: number;
  enableNotifications: boolean;
  preferredChains: number[];
}

export interface OptimizationAnalysis {
  isOptimal: boolean;
  currentChainCost: number;
  optimalChainCost: number;
  potentialSavings: number;
  recommendedAction: 'optimize' | 'stay' | 'wait';
  reason: string;
}