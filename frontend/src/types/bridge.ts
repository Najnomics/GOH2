// Bridge-related types
export interface BridgeParams {
  tokenIn: string;
  tokenOut: string;
  amountIn: string;
  minAmountOut: string;
  sourceChainId: number;
  destinationChainId: number;
  recipient: string;
  deadline: number;
  relayerFee: number;
  message?: string;
}

export interface BridgeQuote {
  estimatedTime: number;
  fee: number;
  feeUSD: number;
  outputAmount: string;
  priceImpact: number;
  provider: string;
  route: BridgeRoute[];
  gasEstimate: string;
  success_rate: number;
}

export interface BridgeRoute {
  step: number;
  fromChain: number;
  toChain: number;
  protocol: string;
  estimatedTime: number;
  fee: number;
  gasEstimate: string;
}

export interface BridgeTransaction {
  id: string;
  status: BridgeStatus;
  sourceChain: number;
  destinationChain: number;
  tokenIn: string;
  tokenOut: string;
  amountIn: string;
  amountOut: string;
  fee: number;
  txHash: string;
  destinationTxHash?: string;
  estimatedTime: number;
  actualTime?: number;
  createdAt: number;
  completedAt?: number;
  errorMessage?: string;
}

export type BridgeStatus = 
  | 'pending'
  | 'bridging'
  | 'swapping'
  | 'bridging_back'
  | 'completed'
  | 'failed'
  | 'timeout';

export interface BridgeProvider {
  name: string;
  logo: string;
  supportedChains: number[];
  avgTime: number;
  successRate: number;
  fees: {
    base: number;
    percentage: number;
  };
  maxAmount: string;
  minAmount: string;
}