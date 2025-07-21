// Token types
export const TokenSchema = {
  address: 'string',
  symbol: 'string',
  name: 'string',
  decimals: 'number',
  logoURI: 'string',
  priceUSD: 'number'
};

// Swap types
export const SwapParamsSchema = {
  tokenIn: 'string',
  tokenOut: 'string',
  amountIn: 'string',
  slippageTolerance: 'number',
  deadlineMinutes: 'number'
};

// User preferences types
export const UserPreferencesSchema = {
  minSavingsThresholdBPS: 'number',
  minAbsoluteSavingsUSD: 'number',
  maxBridgeTimeSeconds: 'number',
  enableCrossChainOptimization: 'boolean',
  enableUSDDisplay: 'boolean'
};

// Optimization quote types
export const OptimizationQuoteSchema = {
  originalChainId: 'number',
  optimizedChainId: 'number',
  originalCostUSD: 'number',
  optimizedCostUSD: 'number',
  savingsUSD: 'number',
  savingsPercentage: 'number',
  estimatedBridgeTime: 'number',
  shouldOptimize: 'boolean',
  costBreakdown: 'object'
};

// Chain info types
export const ChainInfoSchema = {
  chainId: 'number',
  name: 'string',
  symbol: 'string',
  gasPriceGwei: 'number',
  gasPriceUSD: 'number',
  isActive: 'boolean'
};

// Swap execution types
export const SwapExecutionSchema = {
  swapId: 'string',
  status: 'string',
  transactionHash: 'string',
  estimatedCompletionTime: 'number'
};

// Analytics types
export const SystemAnalyticsSchema = {
  totalSwapsProcessed: 'number',
  totalSavingsUSD: 'number',
  crossChainSwapPercentage: 'number',
  averageSavingsPercentage: 'number',
  mostPopularChains: 'array',
  last24hVolumeUSD: 'number'
};

export const UserAnalyticsSchema = {
  userAddress: 'string',
  totalSwaps: 'number',
  totalSavingsUSD: 'number',
  averageSavingsPercentage: 'number',
  favoriteChains: 'array',
  totalVolumeUSD: 'number',
  memberSince: 'string'
};

// Swap status types
export const SWAP_STATUS = {
  PENDING: 'pending',
  BRIDGING: 'bridging',
  SWAPPING: 'swapping',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled'
};

// Error types
export const ERROR_TYPES = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  INSUFFICIENT_BALANCE: 'INSUFFICIENT_BALANCE',
  SLIPPAGE_EXCEEDED: 'SLIPPAGE_EXCEEDED',
  DEADLINE_EXCEEDED: 'DEADLINE_EXCEEDED',
  BRIDGE_FAILED: 'BRIDGE_FAILED',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR'
};

// Notification types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};