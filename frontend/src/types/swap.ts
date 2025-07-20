// Swap-related types for the Gas Optimization Hook
export interface Token {
  address: string;
  symbol: string;
  decimals: number;
  name: string;
  logoURI: string;
  chainId: number;
  balance?: string;
  priceUSD?: number;
}

export interface SwapParams {
  tokenIn: Token;
  tokenOut: Token;
  amountIn: string;
  amountOut: string;
  slippage: number;
  deadline: number;
  recipient: string;
}

export interface SwapQuote {
  amountIn: string;
  amountOut: string;
  priceImpact: number;
  route: string[];
  gasEstimate: string;
  gasPrice: string;
  executionTime: number;
}

export interface SwapState {
  isLoading: boolean;
  error: string | null;
  quote: SwapQuote | null;
  transaction: any | null;
  status: 'idle' | 'pending' | 'success' | 'error';
}

export interface SwapSettings {
  slippage: number;
  deadline: number;
  gasPrice: 'slow' | 'standard' | 'fast' | 'custom';
  customGasPrice?: string;
  enableMEVProtection: boolean;
}

export interface PriceImpact {
  percentage: number;
  severity: 'low' | 'medium' | 'high';
  warning?: string;
}

export interface SwapRoute {
  path: string[];
  pools: string[];
  fees: number[];
  gasEstimate: string;
  priceImpact: number;
}