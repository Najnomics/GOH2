import { BigNumber } from 'bignumber.js';

// Gas and cost calculation utilities
export const calculateGasCost = (
  gasLimit: number,
  gasPrice: number,
  ethPriceUSD: number
): number => {
  const gasCostEth = (gasLimit * gasPrice) / 1e18;
  return gasCostEth * ethPriceUSD;
};

export const calculateBridgeFee = (
  amount: number,
  baseFee: number,
  percentageFee: number
): number => {
  const percentageCost = (amount * percentageFee) / 10000; // Convert BPS to percentage
  return baseFee + percentageCost;
};

export const calculateTotalCost = (
  gasCost: number,
  bridgeFee: number,
  slippageCost: number = 0
): number => {
  return gasCost + bridgeFee + slippageCost;
};

export const calculateSavings = (
  originalCost: number,
  optimizedCost: number
): { savingsUSD: number; savingsPercent: number } => {
  const savingsUSD = Math.max(0, originalCost - optimizedCost);
  const savingsPercent = originalCost > 0 ? (savingsUSD / originalCost) * 100 : 0;
  
  return { savingsUSD, savingsPercent };
};

// Token amount calculations with BigNumber for precision
export const parseTokenAmount = (amount: string, decimals: number): BigNumber => {
  return new BigNumber(amount).multipliedBy(new BigNumber(10).pow(decimals));
};

export const formatTokenAmount = (amount: BigNumber, decimals: number): string => {
  return amount.dividedBy(new BigNumber(10).pow(decimals)).toFixed();
};

export const calculateTokenValue = (
  amount: string,
  decimals: number,
  priceUSD: number
): number => {
  const tokenAmount = parseTokenAmount(amount, decimals);
  const valueInUSD = tokenAmount.multipliedBy(priceUSD).dividedBy(new BigNumber(10).pow(decimals));
  return valueInUSD.toNumber();
};

// Slippage calculations
export const calculateMinimumReceived = (
  expectedAmount: string,
  slippagePercent: number,
  decimals: number
): string => {
  const expected = new BigNumber(expectedAmount);
  const slippageMultiplier = new BigNumber(100 - slippagePercent).dividedBy(100);
  const minimumReceived = expected.multipliedBy(slippageMultiplier);
  return minimumReceived.toFixed(0);
};

export const calculateMaximumSent = (
  expectedAmount: string,
  slippagePercent: number,
  decimals: number
): string => {
  const expected = new BigNumber(expectedAmount);
  const slippageMultiplier = new BigNumber(100 + slippagePercent).dividedBy(100);
  const maximumSent = expected.multipliedBy(slippageMultiplier);
  return maximumSent.toFixed(0);
};

// Price impact calculations
export const calculatePriceImpact = (
  tokenInAmount: string,
  tokenOutAmount: string,
  tokenInPrice: number,
  tokenOutPrice: number,
  tokenInDecimals: number,
  tokenOutDecimals: number
): number => {
  const amountIn = parseTokenAmount(tokenInAmount, tokenInDecimals);
  const amountOut = parseTokenAmount(tokenOutAmount, tokenOutDecimals);
  
  const expectedValueIn = amountIn.multipliedBy(tokenInPrice).dividedBy(new BigNumber(10).pow(tokenInDecimals));
  const actualValueOut = amountOut.multipliedBy(tokenOutPrice).dividedBy(new BigNumber(10).pow(tokenOutDecimals));
  
  if (expectedValueIn.isZero()) return 0;
  
  const impact = expectedValueIn.minus(actualValueOut).dividedBy(expectedValueIn).multipliedBy(100);
  return Math.max(0, impact.toNumber());
};

// Exchange rate calculations
export const calculateExchangeRate = (
  tokenInAmount: string,
  tokenOutAmount: string,
  tokenInDecimals: number,
  tokenOutDecimals: number
): number => {
  const amountIn = parseTokenAmount(tokenInAmount, tokenInDecimals);
  const amountOut = parseTokenAmount(tokenOutAmount, tokenOutDecimals);
  
  if (amountIn.isZero()) return 0;
  
  const rate = amountOut.dividedBy(amountIn);
  return rate.toNumber();
};

// APR/APY calculations
export const calculateAPR = (
  principal: number,
  earned: number,
  days: number
): number => {
  if (principal <= 0 || days <= 0) return 0;
  
  const dailyRate = earned / principal / days;
  return dailyRate * 365 * 100; // Convert to percentage
};

export const calculateAPY = (apr: number, compoundFrequency: number = 365): number => {
  const rate = apr / 100;
  const apy = Math.pow(1 + rate / compoundFrequency, compoundFrequency) - 1;
  return apy * 100;
};

// Liquidity calculations
export const calculateLiquidityValue = (
  token0Amount: string,
  token1Amount: string,
  token0Price: number,
  token1Price: number,
  token0Decimals: number,
  token1Decimals: number
): number => {
  const value0 = calculateTokenValue(token0Amount, token0Decimals, token0Price);
  const value1 = calculateTokenValue(token1Amount, token1Decimals, token1Price);
  
  return value0 + value1;
};

// Bridge time estimation
export const estimateBridgeTime = (
  sourceChainId: number,
  destinationChainId: number,
  amount: number
): number => {
  // Base bridge times in seconds
  const baseTimes: Record<number, number> = {
    1: 900, // Ethereum: 15 minutes
    42161: 60, // Arbitrum: 1 minute
    10: 120, // Optimism: 2 minutes
    137: 300, // Polygon: 5 minutes
    8453: 60, // Base: 1 minute
  };
  
  const sourceTime = baseTimes[sourceChainId] || 300;
  const destTime = baseTimes[destinationChainId] || 300;
  
  // Add congestion factor based on amount
  const congestionFactor = amount > 10000 ? 1.5 : 1.0;
  
  return Math.round((sourceTime + destTime) * congestionFactor);
};

// Gas price prediction
export const predictGasPrice = (
  historicalPrices: number[],
  timeHorizon: number = 3600 // 1 hour in seconds
): number => {
  if (historicalPrices.length < 2) return historicalPrices[0] || 0;
  
  // Simple linear regression for prediction
  const n = historicalPrices.length;
  const x = Array.from({ length: n }, (_, i) => i);
  const y = historicalPrices;
  
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
  const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  
  // Predict for next time period
  const nextX = n;
  const prediction = slope * nextX + intercept;
  
  return Math.max(0, prediction);
};

// Volatility calculations
export const calculateVolatility = (prices: number[]): number => {
  if (prices.length < 2) return 0;
  
  const mean = prices.reduce((a, b) => a + b, 0) / prices.length;
  const variance = prices.reduce((sum, price) => sum + Math.pow(price - mean, 2), 0) / prices.length;
  const standardDeviation = Math.sqrt(variance);
  
  return (standardDeviation / mean) * 100; // Return as percentage
};

// Arbitrage calculations
export const calculateArbitrageOpportunity = (
  priceA: number,
  priceB: number,
  tradingFee: number,
  bridgeFee: number
): { profit: number; profitable: boolean } => {
  const priceDiff = Math.abs(priceA - priceB);
  const totalFees = tradingFee + bridgeFee;
  const profit = priceDiff - totalFees;
  
  return {
    profit: Math.max(0, profit),
    profitable: profit > 0,
  };
};

// Risk assessment
export const calculateRiskScore = (
  priceImpact: number,
  volatility: number,
  liquidityDepth: number,
  bridgeTime: number
): number => {
  // Normalize each factor to 0-100 scale
  const impactScore = Math.min(priceImpact * 20, 100); // 5% impact = 100 points
  const volatilityScore = Math.min(volatility * 2, 100); // 50% volatility = 100 points
  const liquidityScore = Math.max(0, 100 - liquidityDepth / 1000); // Lower liquidity = higher risk
  const timeScore = Math.min(bridgeTime / 60, 100); // 1 hour = 100 points
  
  // Weighted average
  const weights = { impact: 0.3, volatility: 0.25, liquidity: 0.25, time: 0.2 };
  const riskScore = 
    impactScore * weights.impact +
    volatilityScore * weights.volatility +
    liquidityScore * weights.liquidity +
    timeScore * weights.time;
  
  return Math.round(Math.min(100, riskScore));
};

// Compound interest calculations
export const calculateCompoundInterest = (
  principal: number,
  rate: number,
  time: number,
  compound: number = 1
): number => {
  return principal * Math.pow(1 + rate / compound, compound * time);
};

// Moving averages
export const calculateSMA = (values: number[], period: number): number[] => {
  const sma: number[] = [];
  
  for (let i = period - 1; i < values.length; i++) {
    const sum = values.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
    sma.push(sum / period);
  }
  
  return sma;
};

export const calculateEMA = (values: number[], period: number): number[] => {
  const ema: number[] = [];
  const multiplier = 2 / (period + 1);
  
  // Start with SMA for first value
  ema[0] = values.slice(0, period).reduce((a, b) => a + b, 0) / period;
  
  for (let i = 1; i < values.length; i++) {
    ema[i] = (values[i] - ema[i - 1]) * multiplier + ema[i - 1];
  }
  
  return ema;
};