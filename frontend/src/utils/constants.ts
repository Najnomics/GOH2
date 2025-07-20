// App constants and configuration
export const SUPPORTED_CHAINS = {
  ETHEREUM: 1,
  ARBITRUM: 42161,
  OPTIMISM: 10,
  POLYGON: 137,
  BASE: 8453,
} as const;

export const CHAIN_INFO = {
  [SUPPORTED_CHAINS.ETHEREUM]: {
    name: 'Ethereum',
    symbol: 'ETH',
    color: '#627eea',
    logo: '/icons/chains/ethereum.svg',
    explorerUrl: 'https://etherscan.io',
    rpcUrl: 'https://eth-mainnet.g.alchemy.com/v2/',
    isL2: false,
    blockTime: 12,
    finalityTime: 780,
  },
  [SUPPORTED_CHAINS.ARBITRUM]: {
    name: 'Arbitrum',
    symbol: 'ARB',
    color: '#28a0f0',
    logo: '/icons/chains/arbitrum.svg',
    explorerUrl: 'https://arbiscan.io',
    rpcUrl: 'https://arb-mainnet.g.alchemy.com/v2/',
    isL2: true,
    blockTime: 1,
    finalityTime: 1200,
  },
  [SUPPORTED_CHAINS.OPTIMISM]: {
    name: 'Optimism',
    symbol: 'OP',
    color: '#ff0420',
    logo: '/icons/chains/optimism.svg',
    explorerUrl: 'https://optimistic.etherscan.io',
    rpcUrl: 'https://opt-mainnet.g.alchemy.com/v2/',
    isL2: true,
    blockTime: 2,
    finalityTime: 1200,
  },
  [SUPPORTED_CHAINS.POLYGON]: {
    name: 'Polygon',
    symbol: 'MATIC',
    color: '#8247e5',
    logo: '/icons/chains/polygon.svg',
    explorerUrl: 'https://polygonscan.com',
    rpcUrl: 'https://polygon-mainnet.g.alchemy.com/v2/',
    isL2: false,
    blockTime: 2,
    finalityTime: 256,
  },
  [SUPPORTED_CHAINS.BASE]: {
    name: 'Base',
    symbol: 'ETH',
    color: '#0052ff',
    logo: '/icons/chains/base.svg',
    explorerUrl: 'https://basescan.org',
    rpcUrl: 'https://base-mainnet.g.alchemy.com/v2/',
    isL2: true,
    blockTime: 2,
    finalityTime: 1200,
  },
} as const;

export const COMMON_TOKENS = {
  WETH: {
    symbol: 'WETH',
    name: 'Wrapped Ethereum',
    decimals: 18,
    logo: '/icons/tokens/eth.svg',
    addresses: {
      [SUPPORTED_CHAINS.ETHEREUM]: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      [SUPPORTED_CHAINS.ARBITRUM]: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
      [SUPPORTED_CHAINS.OPTIMISM]: '0x4200000000000000000000000000000000000006',
      [SUPPORTED_CHAINS.POLYGON]: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
      [SUPPORTED_CHAINS.BASE]: '0x4200000000000000000000000000000000000006',
    },
  },
  USDC: {
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    logo: '/icons/tokens/usdc.svg',
    addresses: {
      [SUPPORTED_CHAINS.ETHEREUM]: '0xA0b86a33E6c4b4C2Cc6c1c4CdbBD0d8C7B4e5d2A',
      [SUPPORTED_CHAINS.ARBITRUM]: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
      [SUPPORTED_CHAINS.OPTIMISM]: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85',
      [SUPPORTED_CHAINS.POLYGON]: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
      [SUPPORTED_CHAINS.BASE]: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    },
  },
  USDT: {
    symbol: 'USDT',
    name: 'Tether USD',
    decimals: 6,
    logo: '/icons/tokens/usdt.svg',
    addresses: {
      [SUPPORTED_CHAINS.ETHEREUM]: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      [SUPPORTED_CHAINS.ARBITRUM]: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
      [SUPPORTED_CHAINS.OPTIMISM]: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',
      [SUPPORTED_CHAINS.POLYGON]: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
      [SUPPORTED_CHAINS.BASE]: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb',
    },
  },
} as const;

export const DEFAULT_SETTINGS = {
  SLIPPAGE: 0.5, // 0.5%
  DEADLINE: 30, // 30 minutes
  GAS_PRICE: 'standard',
  MIN_SAVINGS_THRESHOLD: 5, // 5%
  MIN_ABSOLUTE_SAVINGS: 10, // $10 USD
  MAX_BRIDGE_TIME: 30, // 30 minutes
  ENABLE_CROSS_CHAIN: true,
  ENABLE_USD_DISPLAY: true,
  ENABLE_MEV_PROTECTION: true,
  ENABLE_NOTIFICATIONS: true,
} as const;

export const API_ENDPOINTS = {
  GAS_PRICES: '/api/gas-prices',
  OPTIMIZATION_QUOTE: '/api/optimization/quote',
  SWAP_EXECUTE: '/api/swap/execute',
  BRIDGE_QUOTE: '/api/bridge/quote',
  BRIDGE_STATUS: '/api/bridge/status',
  USER_STATS: '/api/analytics/user',
  SYSTEM_METRICS: '/api/analytics/system',
  CHAIN_METRICS: '/api/analytics/chains',
  TOKEN_PRICES: '/api/tokens/prices',
  TOKEN_BALANCES: '/api/tokens/balances',
  USER_PREFERENCES: '/api/user/preferences',
  TRANSACTION_HISTORY: '/api/transactions/history',
} as const;

export const STORAGE_KEYS = {
  USER_PREFERENCES: 'gasopt_user_preferences',
  SWAP_SETTINGS: 'gasopt_swap_settings',
  RECENT_TOKENS: 'gasopt_recent_tokens',
  THEME: 'gasopt_theme',
  WALLET_STATE: 'gasopt_wallet_state',
  ANALYTICS_CONSENT: 'gasopt_analytics_consent',
} as const;

export const NOTIFICATION_TYPES = {
  SWAP_COMPLETED: 'swap_completed',
  OPTIMIZATION_AVAILABLE: 'optimization_available',
  BRIDGE_COMPLETED: 'bridge_completed',
  PRICE_ALERT: 'price_alert',
  SYSTEM_UPDATE: 'system_update',
} as const;

export const PRICE_IMPACT_LEVELS = {
  LOW: 1, // < 1%
  MEDIUM: 3, // 1-3%
  HIGH: 5, // 3-5%
  VERY_HIGH: 10, // > 5%
} as const;

export const BRIDGE_PROVIDERS = {
  ACROSS: 'across',
  HOP: 'hop',
  CELER: 'celer',
  MULTICHAIN: 'multichain',
} as const;

export const GAS_SPEED_LABELS = {
  slow: 'Slow',
  standard: 'Standard',
  fast: 'Fast',
  instant: 'Instant',
} as const;

export const ANALYTICS_PERIODS = {
  '1h': 'Last Hour',
  '1d': 'Last Day',
  '1w': 'Last Week',
  '1m': 'Last Month',
  '3m': 'Last 3 Months',
  '1y': 'Last Year',
} as const;

export const ERRORS = {
  NETWORK_ERROR: 'Network error occurred',
  INSUFFICIENT_BALANCE: 'Insufficient balance',
  INVALID_AMOUNT: 'Invalid amount',
  SLIPPAGE_EXCEEDED: 'Slippage exceeded',
  DEADLINE_EXCEEDED: 'Deadline exceeded',
  BRIDGE_FAILED: 'Bridge transaction failed',
  SWAP_FAILED: 'Swap transaction failed',
  WALLET_NOT_CONNECTED: 'Wallet not connected',
  CHAIN_NOT_SUPPORTED: 'Chain not supported',
  TOKEN_NOT_SUPPORTED: 'Token not supported',
} as const;