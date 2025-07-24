import { useState, useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Token, TokenBalance, TokenSearchResult } from '../types/token';
import { gasOptimizationApi } from '../services/api/gasOptimizationApi';

interface UseTokensReturn {
  // Token data
  supportedTokens: Token[];
  tokenBalances: Record<string, TokenBalance>;
  
  // Loading states
  isLoadingTokens: boolean;
  isLoadingBalances: boolean;
  
  // Actions
  refreshTokens: () => void;
  refreshBalances: () => void;
  getTokenBalance: (token: Token) => TokenBalance | null;
  searchTokens: (query: string) => TokenSearchResult[];
  
  // Popular tokens for quick access
  popularTokens: Token[];
}

const POPULAR_TOKEN_ADDRESSES = [
  '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', // WETH
  '0xA0b86a33E6c4b4C2Cc6c1c4CdbBD0d8C7B4e5d2A', // USDC
  '0xdAC17F958D2ee523a2206206994597C13D831ec7', // USDT
];

export const useTokens = (userAddress?: string): UseTokensReturn => {
  const [tokenBalances, setTokenBalances] = useState<Record<string, TokenBalance>>({});

  // Fetch supported tokens
  const { 
    data: supportedTokens = [], 
    isLoading: isLoadingTokens, 
    refetch: refetchTokens 
  } = useQuery({
    queryKey: ['supported-tokens'],
    queryFn: async () => {
      const tokens = await gasOptimizationApi.getSupportedTokens();
      return tokens.map((token: any) => ({
        address: token.address,
        symbol: token.symbol,
        name: token.name,
        decimals: token.decimals,
        logoURI: `/icons/tokens/${token.symbol.toLowerCase()}.svg`,
        price: token.price_usd,
      })) as Token[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch token balances (mock implementation)
  const { 
    isLoading: isLoadingBalances, 
    refetch: refetchBalances 
  } = useQuery({
    queryKey: ['token-balances', userAddress],
    queryFn: async () => {
      if (!userAddress) return {};

      // Mock token balances - in production, this would query the blockchain
      const mockBalances: Record<string, TokenBalance> = {};
      
      supportedTokens.forEach((token) => {
        const mockBalance = (Math.random() * 1000).toFixed(4);
        const mockBalanceUSD = (parseFloat(mockBalance) * (token.price || 1)).toFixed(2);
        
        mockBalances[token.address] = {
          token,
          balance: mockBalance,
          balanceUSD: mockBalanceUSD,
          formatted: `${mockBalance} ${token.symbol}`,
        };
      });

      setTokenBalances(mockBalances);
      return mockBalances;
    },
    enabled: !!userAddress && supportedTokens.length > 0,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refetch every minute
  });

  // Get popular tokens
  const popularTokens = useMemo(() => {
    return supportedTokens.filter(token => 
      POPULAR_TOKEN_ADDRESSES.includes(token.address)
    );
  }, [supportedTokens]);

  // Get token balance
  const getTokenBalance = useCallback((token: Token): TokenBalance | null => {
    return tokenBalances[token.address] || null;
  }, [tokenBalances]);

  // Search tokens
  const searchTokens = useCallback((query: string): TokenSearchResult[] => {
    if (!query.trim()) return [];

    const searchTerm = query.toLowerCase().trim();
    
    return supportedTokens
      .filter(token => 
        token.symbol.toLowerCase().includes(searchTerm) ||
        token.name.toLowerCase().includes(searchTerm) ||
        token.address.toLowerCase().includes(searchTerm)
      )
      .map(token => ({
        token,
        balance: tokenBalances[token.address],
        isVerified: true, // All supported tokens are verified
        tags: [], // Could add tags like 'popular', 'stablecoin', etc.
      }))
      .slice(0, 50); // Limit results
  }, [supportedTokens, tokenBalances]);

  const refreshTokens = useCallback(() => {
    refetchTokens();
  }, [refetchTokens]);

  const refreshBalances = useCallback(() => {
    refetchBalances();
  }, [refetchBalances]);

  return {
    // Token data
    supportedTokens,
    tokenBalances,
    
    // Loading states
    isLoadingTokens,
    isLoadingBalances,
    
    // Actions
    refreshTokens,
    refreshBalances,
    getTokenBalance,
    searchTokens,
    
    // Popular tokens
    popularTokens,
  };
};