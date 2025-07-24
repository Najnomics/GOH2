import { Token } from './token';

export interface SwapParams {
  token_in: string;
  token_out: string;
  amount_in: string;
  slippage_tolerance?: number;
  deadline_minutes?: number;
}

export interface SwapQuote {
  amountIn: string;
  amountOut: string;
  priceImpact: number;
  minimumAmountOut: string;
  executionPrice: string;
  route: SwapRoute[];
}

export interface SwapRoute {
  protocol: string;
  tokenIn: Token;
  tokenOut: Token;
  amountIn: string;
  amountOut: string;
  poolFee?: number;
}

export interface SwapExecution {
  swap_id: string;
  status: SwapStatus;
  transaction_hash?: string;
  estimated_completion_time?: number;
}

export enum SwapStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  FAILED = 'failed',
  LOCAL_EXECUTED = 'local_executed',
  CROSS_CHAIN_INITIATED = 'cross_chain_initiated',
  BRIDGING = 'bridging',
  SWAPPING = 'swapping',
  BRIDGING_BACK = 'bridging_back',
  COMPLETED = 'completed'
}

export interface SwapSettings {
  slippageTolerance: number; // in percentage
  deadline: number; // in minutes
  infiniteApproval: boolean;
  expertMode: boolean;
}

export interface PriceImpact {
  percentage: number;
  severity: 'low' | 'medium' | 'high' | 'very-high';
  warning?: string;
}