// Chain-related types
export interface Chain {
  id: number;
  name: string;
  symbol: string;
  rpcUrl: string;
  explorerUrl: string;
  logoURI: string;
  isL2: boolean;
  blockTime: number;
  finalityTime: number;
  gasPrice: number;
  gasPriceUSD: number;
  status: 'active' | 'maintenance' | 'deprecated';
  color: string;
}

export interface ChainMetrics {
  chainId: number;
  gasPrice: number;
  gasPriceUSD: number;
  gasTrend: 'up' | 'down' | 'stable';
  blockTime: number;
  tps: number;
  tvl: number;
  volume24h: number;
  bridgeVolume: number;
  successRate: number;
  lastUpdate: number;
}

export interface NetworkStatus {
  chainId: number;
  isOnline: boolean;
  blockNumber: number;
  gasPrice: number;
  lastBlockTime: number;
  rpcLatency: number;
  explorerStatus: boolean;
}

export interface ChainConfig {
  chainId: number;
  name: string;
  symbol: string;
  isMainnet: boolean;
  rpcUrls: string[];
  blockExplorerUrls: string[];
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  contracts: {
    hookAddress: string;
    poolManager: string;
    costCalculator: string;
    crossChainManager: string;
    spokePool: string;
  };
}

export interface GasPrice {
  slow: number;
  standard: number;
  fast: number;
  instant: number;
  timestamp: number;
  trend: 'up' | 'down' | 'stable';
}