import { Token } from '../../types/swap';
import { COMMON_TOKENS } from '../../utils/constants';
import { apiClient } from './client';

export const tokensApi = {
  // Get token list for chain
  getTokenList: async (chainId: number): Promise<Token[]> => {
    const response = await apiClient.get<Token[]>(`/tokens/list/${chainId}`);
    return response.data;
  },

  // Get token prices
  getTokenPrices: async (chainId: number): Promise<Record<string, number>> => {
    const response = await apiClient.get<Record<string, number>>(`/tokens/prices/${chainId}`);
    return response.data;
  },

  // Get token price
  getTokenPrice: async (tokenAddress: string): Promise<number> => {
    const response = await apiClient.get<{ price: number }>(`/tokens/price/${tokenAddress}`);
    return response.data.price;
  },

  // Get token balances
  getTokenBalances: async (
    userAddress: string,
    chainId: number
  ): Promise<Record<string, { raw: string; formatted: string }>> => {
    const response = await apiClient.get(`/tokens/balances/${userAddress}/${chainId}`);
    return response.data;
  },

  // Get token info
  getTokenInfo: async (tokenAddress: string, chainId: number): Promise<Token> => {
    const response = await apiClient.get<Token>(`/tokens/info/${tokenAddress}/${chainId}`);
    return response.data;
  },

  // Search tokens
  searchTokens: async (query: string, chainId: number): Promise<Token[]> => {
    const response = await apiClient.get<Token[]>(`/tokens/search/${chainId}`, {
      params: { q: query },
    });
    return response.data;
  },
};

// Mock implementation for development
const mockTokensApi = {
  getTokenList: async (chainId: number): Promise<Token[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const tokens: Token[] = [];
    Object.entries(COMMON_TOKENS).forEach(([symbol, tokenInfo]) => {
      const address = tokenInfo.addresses[chainId as keyof typeof tokenInfo.addresses];
      if (address) {
        tokens.push({
          address,
          symbol: tokenInfo.symbol,
          name: tokenInfo.name,
          decimals: tokenInfo.decimals,
          logoURI: tokenInfo.logo,
          chainId,
        });
      }
    });
    
    return tokens;
  },

  getTokenPrices: async (chainId: number): Promise<Record<string, number>> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const prices: Record<string, number> = {};
    Object.entries(COMMON_TOKENS).forEach(([symbol, tokenInfo]) => {
      const address = tokenInfo.addresses[chainId as keyof typeof tokenInfo.addresses];
      if (address) {
        // Mock prices
        switch (symbol) {
          case 'WETH':
            prices[address] = 2000 + Math.random() * 200;
            break;
          case 'USDC':
            prices[address] = 1 + Math.random() * 0.02;
            break;
          case 'USDT':
            prices[address] = 1 + Math.random() * 0.02;
            break;
          default:
            prices[address] = Math.random() * 100;
        }
      }
    });
    
    return prices;
  },

  getTokenPrice: async (tokenAddress: string): Promise<number> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return Math.random() * 100;
  },

  getTokenBalances: async (
    userAddress: string,
    chainId: number
  ): Promise<Record<string, { raw: string; formatted: string }>> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const balances: Record<string, { raw: string; formatted: string }> = {};
    Object.entries(COMMON_TOKENS).forEach(([symbol, tokenInfo]) => {
      const address = tokenInfo.addresses[chainId as keyof typeof tokenInfo.addresses];
      if (address) {
        const balance = Math.random() * 1000;
        balances[address] = {
          raw: (balance * Math.pow(10, tokenInfo.decimals)).toString(),
          formatted: balance.toFixed(4),
        };
      }
    });
    
    return balances;
  },

  getTokenInfo: async (tokenAddress: string, chainId: number): Promise<Token> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      address: tokenAddress,
      symbol: 'CUSTOM',
      name: 'Custom Token',
      decimals: 18,
      logoURI: '/icons/tokens/generic.svg',
      chainId,
    };
  },

  searchTokens: async (query: string, chainId: number): Promise<Token[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const allTokens = await mockTokensApi.getTokenList(chainId);
    return allTokens.filter(token =>
      token.symbol.toLowerCase().includes(query.toLowerCase()) ||
      token.name.toLowerCase().includes(query.toLowerCase())
    );
  },
};

export const tokensApiService = process.env.NODE_ENV === 'development' ? mockTokensApi : tokensApi;