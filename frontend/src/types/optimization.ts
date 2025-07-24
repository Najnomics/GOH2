export interface OptimizationQuote {
  original_chain_id: number;
  optimized_chain_id: number;
  original_cost_usd: number;
  optimized_cost_usd: number;
  savings_usd: number;
  savings_percentage: number;
  estimated_bridge_time: number;
  should_optimize: boolean;
  cost_breakdown: CostBreakdown;
}

export interface CostBreakdown {
  original_gas_cost: number;
  optimized_gas_cost: number;
  bridge_fee: number;
  total_original: number;
  total_optimized: number;
  slippage_cost?: number;
  mev_protection_fee?: number;
}

export interface UserPreferences {
  min_savings_threshold_bps: number; // basis points (500 = 5%)
  min_absolute_savings_usd: number;
  max_bridge_time_seconds: number;
  enable_cross_chain_optimization: boolean;
  enable_usd_display: boolean;
  enable_mev_protection?: boolean;
  receive_notifications?: boolean;
}

export interface ChainComparison {
  chainId: number;
  chainName: string;
  gasCostUSD: number;
  bridgeFeeUSD: number;
  totalCostUSD: number;
  executionTime: number;
  isOptimal: boolean;
  savingsUSD?: number;
  savingsPercentage?: number;
}

export interface BridgeInfo {
  protocol: string;
  estimatedTime: number;
  fee: number;
  feeUSD: number;
  steps: BridgeStep[];
}

export interface BridgeStep {
  type: 'bridge' | 'swap';
  description: string;
  estimatedTime: number;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
}

export interface OptimizationSettings {
  enableAutomaticOptimization: boolean;
  maxBridgeTime: number;
  minSavingsThreshold: number;
  preferredChains: number[];
  excludedChains: number[];
}