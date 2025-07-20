import { format } from 'date-fns';

// Number formatting utilities
export const formatNumber = (
  value: number | string,
  decimals: number = 2,
  compact: boolean = false
): string => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(num)) return '0';
  
  if (compact) {
    return new Intl.NumberFormat('en-US', {
      notation: 'compact',
      maximumFractionDigits: decimals,
    }).format(num);
  }
  
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
};

// Currency formatting
export const formatCurrency = (
  value: number | string,
  currency: string = 'USD',
  decimals: number = 2
): string => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(num)) return '$0.00';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
};

// Percentage formatting
export const formatPercentage = (
  value: number | string,
  decimals: number = 2
): string => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(num)) return '0%';
  
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num / 100);
};

// Token amount formatting
export const formatTokenAmount = (
  amount: string | number,
  decimals: number = 18,
  displayDecimals: number = 4
): string => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(num)) return '0';
  
  const adjustedAmount = num / Math.pow(10, decimals);
  
  if (adjustedAmount === 0) return '0';
  if (adjustedAmount < 0.0001) return '< 0.0001';
  
  return formatNumber(adjustedAmount, displayDecimals);
};

// Gas price formatting
export const formatGasPrice = (
  gasPrice: number | string,
  unit: 'wei' | 'gwei' = 'gwei'
): string => {
  const num = typeof gasPrice === 'string' ? parseFloat(gasPrice) : gasPrice;
  
  if (isNaN(num)) return '0 gwei';
  
  const gwei = unit === 'wei' ? num / 1e9 : num;
  
  return `${formatNumber(gwei, 2)} gwei`;
};

// Time formatting
export const formatTime = (seconds: number): string => {
  if (seconds < 60) return `${Math.round(seconds)}s`;
  if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.round(seconds / 3600)}h`;
  
  return `${Math.round(seconds / 86400)}d`;
};

// Date formatting
export const formatDate = (
  timestamp: number | Date,
  pattern: string = 'MMM dd, yyyy HH:mm'
): string => {
  const date = typeof timestamp === 'number' ? new Date(timestamp) : timestamp;
  return format(date, pattern);
};

// Relative time formatting
export const formatRelativeTime = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;
  
  if (diff < 60000) return 'just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  if (diff < 2592000000) return `${Math.floor(diff / 86400000)}d ago`;
  
  return formatDate(timestamp, 'MMM dd, yyyy');
};

// Address formatting
export const formatAddress = (
  address: string,
  startChars: number = 6,
  endChars: number = 4
): string => {
  if (!address || address.length < startChars + endChars) return address;
  
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
};

// Transaction hash formatting
export const formatTxHash = (hash: string): string => {
  return formatAddress(hash, 8, 6);
};

// Chain ID to name formatting
export const formatChainName = (chainId: number): string => {
  const chainNames: Record<number, string> = {
    1: 'Ethereum',
    42161: 'Arbitrum',
    10: 'Optimism',
    137: 'Polygon',
    8453: 'Base',
  };
  
  return chainNames[chainId] || `Chain ${chainId}`;
};

// Savings formatting with color
export const formatSavings = (
  savingsUSD: number,
  savingsPercent: number
): { text: string; color: string } => {
  const usdText = formatCurrency(savingsUSD);
  const percentText = formatPercentage(savingsPercent);
  
  let color = 'text-success';
  if (savingsPercent < 5) color = 'text-warning';
  if (savingsPercent < 1) color = 'text-error';
  
  return {
    text: `${usdText} (${percentText})`,
    color,
  };
};

// Price impact formatting
export const formatPriceImpact = (impact: number): {
  text: string;
  color: string;
  severity: 'low' | 'medium' | 'high' | 'very-high';
} => {
  const text = formatPercentage(impact);
  
  let color = 'text-success';
  let severity: 'low' | 'medium' | 'high' | 'very-high' = 'low';
  
  if (impact >= 1) {
    color = 'text-warning';
    severity = 'medium';
  }
  if (impact >= 3) {
    color = 'text-error';
    severity = 'high';
  }
  if (impact >= 5) {
    color = 'text-red-600';
    severity = 'very-high';
  }
  
  return { text, color, severity };
};

// File size formatting
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

// Compact number formatting for large values
export const formatCompactNumber = (value: number): string => {
  if (value >= 1e12) return `${formatNumber(value / 1e12, 1)}T`;
  if (value >= 1e9) return `${formatNumber(value / 1e9, 1)}B`;
  if (value >= 1e6) return `${formatNumber(value / 1e6, 1)}M`;
  if (value >= 1e3) return `${formatNumber(value / 1e3, 1)}K`;
  
  return formatNumber(value, 2);
};