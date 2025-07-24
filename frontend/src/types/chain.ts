export interface Chain {
  id: number;
  name: string;
  symbol: string;
  rpcUrl: string;
  blockExplorerUrl: string;
  logoURI?: string;
  isTestnet?: boolean;
}

export interface ChainGasPrice {
  chainId: number;
  gasPrice: string; // in gwei
  gasPriceUSD: string;
  timestamp: number;
}

export interface ChainInfo {
  chain_id: number;
  name: string;
  symbol: string;
  gas_price_gwei: number;
  gas_price_usd: number;
  is_active: boolean;
}

export interface ChainMetrics {
  chainId: number;
  swapsExecuted: number;
  totalVolume: string;
  averageGasPrice: string;
  successRate: number;
  averageExecutionTime: number;
}

export const SUPPORTED_CHAINS: Record<number, Chain> = {
  1: {
    id: 1,
    name: 'Ethereum',
    symbol: 'ETH',
    rpcUrl: 'https://mainnet.infura.io/v3/',
    blockExplorerUrl: 'https://etherscan.io',
    logoURI: '/icons/chains/ethereum.svg'
  },
  42161: {
    id: 42161,
    name: 'Arbitrum',
    symbol: 'ETH',
    rpcUrl: 'https://arb1.arbitrum.io/rpc',
    blockExplorerUrl: 'https://arbiscan.io',
    logoURI: '/icons/chains/arbitrum.svg'
  },
  10: {
    id: 10,
    name: 'Optimism',
    symbol: 'ETH',
    rpcUrl: 'https://mainnet.optimism.io',
    blockExplorerUrl: 'https://optimistic.etherscan.io',
    logoURI: '/icons/chains/optimism.svg'
  },
  137: {
    id: 137,
    name: 'Polygon',
    symbol: 'MATIC',
    rpcUrl: 'https://polygon-rpc.com',
    blockExplorerUrl: 'https://polygonscan.com',
    logoURI: '/icons/chains/polygon.svg'
  },
  8453: {
    id: 8453,
    name: 'Base',
    symbol: 'ETH',
    rpcUrl: 'https://mainnet.base.org',
    blockExplorerUrl: 'https://basescan.org',
    logoURI: '/icons/chains/base.svg'
  }
};