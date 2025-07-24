import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  SystemAnalytics, 
  UserAnalytics, 
  DashboardMetrics,
  GasPriceHistory,
  SavingsHistory,
  VolumeData
} from '../types/analytics';
import { gasOptimizationApi } from '../services/api/gasOptimizationApi';
import { analyticsService } from '../services/api/analyticsApi';

interface UseAnalyticsReturn {
  // System analytics
  systemAnalytics: SystemAnalytics | null;
  dashboardMetrics: DashboardMetrics | null;
  volumeDistribution: VolumeData[];
  
  // User analytics
  userAnalytics: UserAnalytics | null;
  userSavingsHistory: SavingsHistory | null;
  
  // Gas price history
  gasPriceHistory: Record<number, GasPriceHistory>;
  
  // Loading states
  isLoadingSystem: boolean;
  isLoadingUser: boolean;
  isLoadingHistory: boolean;
  
  // Actions
  refreshSystemAnalytics: () => void;
  refreshUserAnalytics: () => void;
  fetchGasPriceHistory: (chainId: number, timeRange: '1h' | '24h' | '7d' | '30d') => void;
  fetchSavingsHistory: (userAddress?: string) => void;
  
  // Computed values
  totalSavingsFormatted: string;
  averageSavingsFormatted: string;
  topPerformingChain: string;
  savingsGrowthRate: number;
}

export const useAnalytics = (userAddress?: string): UseAnalyticsReturn => {
  const [gasPriceHistory, setGasPriceHistory] = useState<Record<number, GasPriceHistory>>({});
  const [userSavingsHistory, setUserSavingsHistory] = useState<SavingsHistory | null>(null);

  // Fetch system analytics
  const { 
    data: systemAnalytics, 
    isLoading: isLoadingSystem, 
    refetch: refetchSystemAnalytics 
  } = useQuery({
    queryKey: ['system-analytics'],
    queryFn: () => gasOptimizationApi.getSystemAnalytics(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });

  // Fetch dashboard metrics
  const { data: dashboardMetrics } = useQuery({
    queryKey: ['dashboard-metrics'],
    queryFn: () => analyticsService.getDashboardMetrics(),
    staleTime: 60 * 1000, // 1 minute
    refetchInterval: 2 * 60 * 1000, // Refetch every 2 minutes
  });

  // Fetch volume distribution
  const { data: volumeDistribution = [] } = useQuery({
    queryKey: ['volume-distribution'],
    queryFn: () => analyticsService.getVolumeDistribution(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch user analytics
  const { 
    data: userAnalytics, 
    isLoading: isLoadingUser, 
    refetch: refetchUserAnalytics 
  } = useQuery({
    queryKey: ['user-analytics', userAddress],
    queryFn: () => gasOptimizationApi.getUserAnalytics(userAddress!),
    enabled: !!userAddress,
    staleTime: 60 * 1000, // 1 minute
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });

  // Fetch gas price history
  const fetchGasPriceHistory = useCallback(async (chainId: number, timeRange: '1h' | '24h' | '7d' | '30d') => {
    try {
      const history = await analyticsService.getGasPriceHistory(chainId, timeRange);
      setGasPriceHistory(prev => ({
        ...prev,
        [chainId]: history
      }));
    } catch (error) {
      console.error('Error fetching gas price history:', error);
    }
  }, []);

  // Fetch savings history
  const fetchSavingsHistory = useCallback(async (userAddress?: string) => {
    try {
      const history = await analyticsService.getSavingsHistory(userAddress);
      setUserSavingsHistory(history);
    } catch (error) {
      console.error('Error fetching savings history:', error);
    }
  }, []);

  const refreshSystemAnalytics = useCallback(() => {
    refetchSystemAnalytics();
  }, [refetchSystemAnalytics]);

  const refreshUserAnalytics = useCallback(() => {
    if (userAddress) {
      refetchUserAnalytics();
    }
  }, [refetchUserAnalytics, userAddress]);

  // Computed values
  const totalSavingsFormatted = systemAnalytics 
    ? `$${systemAnalytics.total_savings_usd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : '$0.00';

  const averageSavingsFormatted = systemAnalytics
    ? `${systemAnalytics.average_savings_percentage.toFixed(1)}%`
    : '0.0%';

  const topPerformingChain = systemAnalytics?.most_popular_chains[0]?.name || 'N/A';

  const savingsGrowthRate = userSavingsHistory?.daily
    ? calculateGrowthRate(userSavingsHistory.daily)
    : 0;

  return {
    // System analytics
    systemAnalytics,
    dashboardMetrics,
    volumeDistribution,
    
    // User analytics
    userAnalytics,
    userSavingsHistory,
    
    // Gas price history
    gasPriceHistory,
    
    // Loading states
    isLoadingSystem,
    isLoadingUser,
    isLoadingHistory: false, // For now, history is loaded on demand
    
    // Actions
    refreshSystemAnalytics,
    refreshUserAnalytics,
    fetchGasPriceHistory,
    fetchSavingsHistory,
    
    // Computed values
    totalSavingsFormatted,
    averageSavingsFormatted,
    topPerformingChain,
    savingsGrowthRate,
  };
};

// Helper function to calculate growth rate
function calculateGrowthRate(data: { timestamp: number; value: number }[]): number {
  if (data.length < 2) return 0;
  
  const recent = data.slice(-7); // Last 7 days
  const previous = data.slice(-14, -7); // Previous 7 days
  
  if (recent.length === 0 || previous.length === 0) return 0;
  
  const recentAvg = recent.reduce((sum, item) => sum + item.value, 0) / recent.length;
  const previousAvg = previous.reduce((sum, item) => sum + item.value, 0) / previous.length;
  
  if (previousAvg === 0) return 0;
  
  return ((recentAvg - previousAvg) / previousAvg) * 100;
}