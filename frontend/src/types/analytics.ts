// Analytics-related types
export interface UserStats {
  totalSwaps: number;
  totalSavingsUSD: number;
  avgSavingsPercent: number;
  avgExecutionTime: number;
  favoriteChains: number[];
  totalVolumeUSD: number;
  crossChainSwaps: number;
  localSwaps: number;
  joinedAt: number;
}

export interface SystemMetrics {
  totalSwaps: number;
  totalSavingsUSD: number;
  totalUsers: number;
  totalVolumeUSD: number;
  avgSavingsPercent: number;
  avgExecutionTime: number;
  successRate: number;
  crossChainPercent: number;
  mostUsedChains: ChainUsage[];
}

export interface ChainUsage {
  chainId: number;
  chainName: string;
  swapCount: number;
  volumeUSD: number;
  savingsUSD: number;
  percentage: number;
}

export interface TimeSeriesData {
  timestamp: number;
  value: number;
  label?: string;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    fill?: boolean;
  }[];
}

export interface SavingsChart {
  period: '1h' | '1d' | '1w' | '1m' | '3m' | '1y';
  data: TimeSeriesData[];
  totalSavings: number;
  avgSavings: number;
  trend: 'up' | 'down' | 'stable';
}

export interface GasPriceChart {
  period: '1h' | '1d' | '1w' | '1m';
  chains: {
    chainId: number;
    data: TimeSeriesData[];
  }[];
  predictions?: {
    chainId: number;
    predicted: TimeSeriesData[];
    confidence: number;
  }[];
}

export interface VolumeChart {
  period: '1d' | '1w' | '1m' | '3m' | '1y';
  data: TimeSeriesData[];
  totalVolume: number;
  avgVolume: number;
  growth: number;
}

export interface OptimizationStats {
  optimizationRate: number;
  avgSavingsUSD: number;
  avgSavingsPercent: number;
  totalOptimizations: number;
  skippedOptimizations: number;
  topSavingPairs: {
    tokenIn: string;
    tokenOut: string;
    avgSavings: number;
    count: number;
  }[];
}