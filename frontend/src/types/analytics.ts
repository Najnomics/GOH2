export interface SystemAnalytics {
  total_swaps_processed: number;
  total_savings_usd: number;
  cross_chain_swap_percentage: number;
  average_savings_percentage: number;
  most_popular_chains: PopularChain[];
  last_24h_volume_usd: number;
}

export interface PopularChain {
  chain_id: number;
  name: string;
  usage_percentage: number;
  volume_usd?: number;
}

export interface UserAnalytics {
  user_address: string;
  total_swaps: number;
  total_savings_usd: number;
  average_savings_percentage: number;
  favorite_chains: string[];
  total_volume_usd: number;
  member_since: string;
}

export interface ChartData {
  timestamp: number;
  value: number;
  label?: string;
}

export interface GasPriceHistory {
  chainId: number;
  data: ChartData[];
}

export interface SavingsHistory {
  daily: ChartData[];
  weekly: ChartData[];
  monthly: ChartData[];
}

export interface VolumeData {
  chainId: number;
  chainName: string;
  volume: number;
  volumeUSD: number;
  percentage: number;
}

export interface DashboardMetrics {
  totalValueLocked: number;
  dailyVolume: number;
  totalSavings: number;
  activeUsers: number;
  averageGasPrice: number;
  systemUptime: number;
}

export interface PerformanceMetrics {
  totalSwaps: number;
  successRate: number;
  averageSavings: number;
  chainPerformance: number[];
}