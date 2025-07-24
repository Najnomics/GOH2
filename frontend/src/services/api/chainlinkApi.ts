// Chainlink price feed integration
// Note: In production, this would connect to Chainlink oracles
// For now, we'll use the backend API that aggregates prices

import { gasOptimizationApi } from './gasOptimizationApi';

export interface PriceFeed {
  symbol: string;
  price: number;
  timestamp: number;
  decimals: number;
}

export interface TokenPrice {
  address: string;
  symbol: string;
  priceUSD: number;
  timestamp: number;
}

class ChainlinkService {
  private priceCache: Map<string, { price: number; timestamp: number }> = new Map();
  private cacheValidityMs = 60000; // 1 minute cache

  async getTokenPrice(tokenAddress: string): Promise<number> {
    const cached = this.priceCache.get(tokenAddress);
    if (cached && Date.now() - cached.timestamp < this.cacheValidityMs) {
      return cached.price;
    }

    try {
      // In a real implementation, this would query Chainlink price feeds
      // For now, we'll use mock data or derive from our backend
      const tokens = await gasOptimizationApi.getSupportedTokens();
      const token = tokens.find((t: any) => t.address.toLowerCase() === tokenAddress.toLowerCase());
      
      if (token && token.price_usd) {
        const price = token.price_usd;
        this.priceCache.set(tokenAddress, { price, timestamp: Date.now() });
        return price;
      }

      throw new Error(`Price not found for token ${tokenAddress}`);
    } catch (error) {
      console.error('Error fetching token price:', error);
      throw error;
    }
  }

  async getMultipleTokenPrices(tokenAddresses: string[]): Promise<TokenPrice[]> {
    const prices = await Promise.allSettled(
      tokenAddresses.map(async (address) => ({
        address,
        symbol: '', // Would be fetched from token contract
        priceUSD: await this.getTokenPrice(address),
        timestamp: Date.now(),
      }))
    );

    return prices
      .filter((result): result is PromiseFulfilledResult<TokenPrice> => result.status === 'fulfilled')
      .map((result) => result.value);
  }

  async getETHPrice(): Promise<number> {
    // ETH price - would typically come from ETH/USD Chainlink feed
    return this.getTokenPrice('0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2');
  }

  // Convert wei to USD using current ETH price
  async convertWeiToUSD(weiAmount: string): Promise<number> {
    const ethPrice = await this.getETHPrice();
    const ethAmount = parseFloat(weiAmount) / 1e18;
    return ethAmount * ethPrice;
  }

  // Convert gas cost to USD
  async convertGasCostToUSD(gasUsed: number, gasPriceGwei: number): Promise<number> {
    const gasCostWei = gasUsed * gasPriceGwei * 1e9;
    return this.convertWeiToUSD(gasCostWei.toString());
  }

  clearCache(): void {
    this.priceCache.clear();
  }
}

export const chainlinkService = new ChainlinkService();
export default chainlinkService;