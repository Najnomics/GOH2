import { useState, useCallback, useEffect } from 'react';
import { useAccount, useChainId } from 'wagmi';
import { Token } from '../types/swap';
import { COMMON_TOKENS, SUPPORTED_CHAINS } from '../utils/constants';
import { getLocalStorageItem, setLocalStorageItem } from '../utils/helpers';
import { tokensApi } from '../services/api/tokensApi';

export const useTokens = () => {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  
  // Token state
  const [tokens, setTokens] = useState<Token[]>([]);
  const [balances, setBalances] = useState<Record<string, { raw: string; formatted: string }>>({});
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Recent tokens from localStorage
  const [recentTokens, setRecentTokens] = useState<Token[]>(() => {
    return getLocalStorageItem('gasopt_recent_tokens', []);
  });

  // Save recent tokens to localStorage
  useEffect(() => {
    setLocalStorageItem('gasopt_recent_tokens', recentTokens);
  }, [recentTokens]);

  // Get popular tokens for current chain
  const getPopularTokens = useCallback((): Token[] => {
    if (!chainId) return [];
    
    const popularTokens: Token[] = [];
    
    Object.entries(COMMON_TOKENS).forEach(([symbol, tokenInfo]) => {
      const address = tokenInfo.addresses[chainId as keyof typeof tokenInfo.addresses];
      if (address) {
        popularTokens.push({
          address,
          symbol: tokenInfo.symbol,
          name: tokenInfo.name,
          decimals: tokenInfo.decimals,
          logoURI: tokenInfo.logo,
          chainId,
          priceUSD: prices[address] || 0,
        });
      }
    });
    
    return popularTokens;
  }, [chainId, prices]);

  // Load tokens for current chain
  const loadTokens = useCallback(async () => {
    if (!chainId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const [tokenList, tokenPrices] = await Promise.all([
        tokensApi.getTokenList(chainId),
        tokensApi.getTokenPrices(chainId),
      ]);
      
      setTokens(tokenList);
      setPrices(tokenPrices);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tokens');
    } finally {
      setIsLoading(false);
    }
  }, [chainId]);

  // Load token balances
  const loadBalances = useCallback(async () => {
    if (!isConnected || !address || !chainId) return;
    
    try {
      const tokenBalances = await tokensApi.getTokenBalances(address, chainId);
      setBalances(tokenBalances);
    } catch (err) {
      console.error('Failed to load balances:', err);
    }
  }, [address, isConnected, chainId]);

  // Get token balance
  const getTokenBalance = useCallback((token: Token) => {
    if (!token) return null;
    
    const balance = balances[token.address];
    return balance || { raw: '0', formatted: '0' };
  }, [balances]);

  // Get token price
  const getTokenPrice = useCallback((token: Token): number => {
    if (!token) return 0;
    return prices[token.address] || 0;
  }, [prices]);

  // Search tokens
  const searchTokens = useCallback((query: string): Token[] => {
    if (!query.trim()) return getPopularTokens();
    
    const searchTerm = query.toLowerCase();
    const allTokens = [...getPopularTokens(), ...tokens];
    
    return allTokens.filter(token =>
      token.symbol.toLowerCase().includes(searchTerm) ||
      token.name.toLowerCase().includes(searchTerm) ||
      token.address.toLowerCase().includes(searchTerm)
    );
  }, [tokens, getPopularTokens]);

  // Add token to recent
  const addToRecent = useCallback((token: Token) => {
    setRecentTokens(prev => {
      const filtered = prev.filter(t => t.address !== token.address);
      return [token, ...filtered].slice(0, 10); // Keep only 10 recent tokens
    });
  }, []);

  // Import custom token
  const importToken = useCallback(async (tokenAddress: string): Promise<Token | null> => {
    if (!chainId) return null;
    
    try {
      const token = await tokensApi.getTokenInfo(tokenAddress, chainId);
      
      if (token) {
        setTokens(prev => {
          const exists = prev.find(t => t.address === token.address);
          if (exists) return prev;
          return [...prev, token];
        });
        
        // Load price for imported token
        const price = await tokensApi.getTokenPrice(tokenAddress);
        setPrices(prev => ({ ...prev, [tokenAddress]: price }));
        
        return token;
      }
      
      return null;
    } catch (err) {
      console.error('Failed to import token:', err);
      return null;
    }
  }, [chainId]);

  // Get token list with balances and prices
  const getTokenList = useCallback((): Token[] => {
    const popularTokens = getPopularTokens();
    const allTokens = [...popularTokens, ...tokens];
    
    return allTokens.map(token => ({
      ...token,
      balance: getTokenBalance(token)?.formatted || '0',
      priceUSD: getTokenPrice(token),
    }));
  }, [tokens, getPopularTokens, getTokenBalance, getTokenPrice]);

  // Get filtered and sorted token list
  const getFilteredTokens = useCallback((
    query: string = '',
    sortBy: 'symbol' | 'balance' | 'value' = 'symbol'
  ): Token[] => {
    let filteredTokens = query ? searchTokens(query) : getTokenList();
    
    // Sort tokens
    filteredTokens.sort((a, b) => {
      switch (sortBy) {
        case 'balance':
          const balanceA = parseFloat(getTokenBalance(a)?.formatted || '0');
          const balanceB = parseFloat(getTokenBalance(b)?.formatted || '0');
          return balanceB - balanceA;
        
        case 'value':
          const valueA = parseFloat(getTokenBalance(a)?.formatted || '0') * getTokenPrice(a);
          const valueB = parseFloat(getTokenBalance(b)?.formatted || '0') * getTokenPrice(b);
          return valueB - valueA;
        
        case 'symbol':
        default:
          return a.symbol.localeCompare(b.symbol);
      }
    });
    
    return filteredTokens;
  }, [searchTokens, getTokenList, getTokenBalance, getTokenPrice]);

  // Auto-refresh prices
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (chainId && tokens.length > 0) {
        tokensApi.getTokenPrices(chainId).then(setPrices).catch(console.error);
      }
    }, 30000); // Refresh every 30 seconds
    
    return () => clearInterval(intervalId);
  }, [chainId, tokens.length]);

  // Auto-refresh balances
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (isConnected && address && chainId) {
        loadBalances();
      }
    }, 10000); // Refresh every 10 seconds
    
    return () => clearInterval(intervalId);
  }, [isConnected, address, chainId, loadBalances]);

  // Load tokens when chain changes
  useEffect(() => {
    loadTokens();
  }, [loadTokens]);

  // Load balances when wallet connects
  useEffect(() => {
    if (isConnected && address) {
      loadBalances();
    }
  }, [isConnected, address, loadBalances]);

  return {
    // State
    tokens,
    balances,
    prices,
    recentTokens,
    isLoading,
    error,
    
    // Actions
    loadTokens,
    loadBalances,
    searchTokens,
    importToken,
    addToRecent,
    
    // Computed values
    popularTokens: getPopularTokens(),
    tokenList: getTokenList(),
    
    // Utility functions
    getTokenBalance,
    getTokenPrice,
    getFilteredTokens,
  };
};