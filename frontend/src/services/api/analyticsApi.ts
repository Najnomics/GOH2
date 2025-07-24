import { gasOptimizationApi } from './gasOptimizationApi';
import { 
  SystemAnalytics, 
  UserAnalytics, 
  DashboardMetrics, 
  GasPriceHistory,
  SavingsHistory,
  VolumeData
} from '../../types/analytics';

export class AnalyticsService {
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    try {
      const systemData = await gasOptimizationApi.getSystemAnalytics();
      
      return {
        totalValueLocked: 0, // Would be calculated from actual contract data
        dailyVolume: systemData.last_24h_volume_usd,
        totalSavings: systemData.total_savings_usd,
        activeUsers: 0, // Would need to track active user addresses
        averageGasPrice: 0, // Would be calculated from current gas prices
        systemUptime: 99.9, // Would be tracked by monitoring system
      };
    } catch (error) {
      console.error('Error fetching dashboard metrics:', error);
      throw error;
    }
  }

  async getGasPriceHistory(chainId: number, timeRange: '1h' | '24h' | '7d' | '30d'): Promise<GasPriceHistory> {
    try {
      // Mock implementation - in production would fetch historical data
      const now = Date.now();
      const intervals = this.getIntervals(timeRange);
      
      const data = Array.from({ length: intervals.count }, (_, i) => ({
        timestamp: now - (intervals.count - i - 1) * intervals.interval,
        value: Math.random() * 100 + 10, // Mock gas price in gwei
        label: new Date(now - (intervals.count - i - 1) * intervals.interval).toLocaleTimeString(),
      }));

      return { chainId, data };
    } catch (error) {
      console.error('Error fetching gas price history:', error);
      throw error;
    }
  }

  async getSavingsHistory(userAddress?: string): Promise<SavingsHistory> {
    try {
      // Mock implementation - would fetch actual savings data
      const now = Date.now();
      const dayMs = 24 * 60 * 60 * 1000;
      
      const daily = Array.from({ length: 30 }, (_, i) => ({
        timestamp: now - (29 - i) * dayMs,
        value: Math.random() * 100 + 20, // Mock daily savings
      }));

      const weekly = Array.from({ length: 12 }, (_, i) => ({
        timestamp: now - (11 - i) * 7 * dayMs,
        value: Math.random() * 500 + 100, // Mock weekly savings
      }));

      const monthly = Array.from({ length: 12 }, (_, i) => ({
        timestamp: now - (11 - i) * 30 * dayMs,
        value: Math.random() * 2000 + 500, // Mock monthly savings
      }));

      return { daily, weekly, monthly };
    } catch (error) {
      console.error('Error fetching savings history:', error);
      throw error;
    }
  }

  async getVolumeDistribution(): Promise<VolumeData[]> {
    try {
      const systemData = await gasOptimizationApi.getSystemAnalytics();
      
      return systemData.most_popular_chains.map(chain => ({
        chainId: chain.chain_id,
        chainName: chain.name,
        volume: 0, // Would be calculated from actual transaction data
        volumeUSD: chain.volume_usd || 0,
        percentage: chain.usage_percentage,
      }));
    } catch (error) {
      console.error('Error fetching volume distribution:', error);
      throw error;
    }
  }

  async getChainPerformanceMetrics(chainId: number) {
    try {
      // Mock implementation - would fetch real performance data
      return {
        chainId,
        averageExecutionTime: Math.random() * 300 + 30, // 30-330 seconds
        successRate: Math.random() * 0.1 + 0.9, // 90-100%
        totalTransactions: Math.floor(Math.random() * 10000 + 1000),
        averageGasPrice: Math.random() * 100 + 10,
        totalSavings: Math.random() * 100000 + 10000,
      };
    } catch (error) {
      console.error('Error fetching chain performance metrics:', error);
      throw error;
    }
  }

  private getIntervals(timeRange: string) {
    switch (timeRange) {
      case '1h':
        return { count: 60, interval: 60 * 1000 }; // 1 minute intervals
      case '24h':
        return { count: 24, interval: 60 * 60 * 1000 }; // 1 hour intervals
      case '7d':
        return { count: 7, interval: 24 * 60 * 60 * 1000 }; // 1 day intervals
      case '30d':
        return { count: 30, interval: 24 * 60 * 60 * 1000 }; // 1 day intervals
      default:
        return { count: 24, interval: 60 * 60 * 1000 };
    }
  }
}

export const analyticsService = new AnalyticsService();
export default analyticsService;