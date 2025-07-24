import React, { useState, useMemo } from 'react';
import { Token } from '../../types/token';
import { useTokens } from '../../hooks/useTokens';
import { TokenListItem } from './TokenListItem';
import { MagnifyingGlassIcon, StarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

interface TokenSearchModalProps {
  onTokenSelect: (token: Token) => void;
  excludeToken?: Token | null;
}

export const TokenSearchModal: React.FC<TokenSearchModalProps> = ({
  onTokenSelect,
  excludeToken
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFavorites, setShowFavorites] = useState(false);
  
  const { supportedTokens, popularTokens, searchTokens, isLoadingTokens } = useTokens();

  // Mock favorites for now - in production, this would come from user preferences
  const [favorites, setFavorites] = useState<string[]>([
    '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', // WETH
    '0xA0b86a33E6c4b4C2Cc6c1c4CdbBD0d8C7B4e5d2A', // USDC
  ]);

  const toggleFavorite = (tokenAddress: string) => {
    setFavorites(prev => 
      prev.includes(tokenAddress)
        ? prev.filter(addr => addr !== tokenAddress)
        : [...prev, tokenAddress]
    );
  };

  const filteredTokens = useMemo(() => {
    let tokens = searchQuery ? searchTokens(searchQuery).map(result => result.token) : supportedTokens;
    
    // Filter out excluded token
    if (excludeToken) {
      tokens = tokens.filter(token => token.address !== excludeToken.address);
    }

    // Show favorites if requested
    if (showFavorites) {
      tokens = tokens.filter(token => favorites.includes(token.address));
    }

    return tokens;
  }, [searchQuery, searchTokens, supportedTokens, excludeToken, showFavorites, favorites]);

  const favoriteTokens = useMemo(() => {
    return supportedTokens.filter(token => 
      favorites.includes(token.address) && 
      token.address !== excludeToken?.address
    );
  }, [supportedTokens, favorites, excludeToken]);

  if (isLoadingTokens) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-pink"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      {/* Search Input */}
      <div className="relative mb-4">
        <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name, symbol, or address"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-pink focus:border-transparent"
          autoFocus
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-1 mb-4">
        <button
          onClick={() => setShowFavorites(false)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            !showFavorites
              ? 'bg-primary-pink text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setShowFavorites(true)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1 ${
            showFavorites
              ? 'bg-primary-pink text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <StarIcon className="w-4 h-4" />
          <span>Favorites ({favorites.length})</span>
        </button>
      </div>

      {/* Popular Tokens (only show when not searching and not showing favorites) */}
      {!searchQuery && !showFavorites && popularTokens.length > 0 && (
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Popular Tokens</h3>
          <div className="flex flex-wrap gap-2">
            {popularTokens.slice(0, 4).map(token => (
              <button
                key={token.address}
                onClick={() => onTokenSelect(token)}
                className="flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <img
                  src={token.logoURI || `/icons/tokens/${token.symbol.toLowerCase()}.svg`}
                  alt={token.symbol}
                  className="w-5 h-5 rounded-full"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/icons/tokens/generic.svg';
                  }}
                />
                <span className="text-sm font-medium">{token.symbol}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Token List */}
      <div className="max-h-80 overflow-y-auto">
        {filteredTokens.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {searchQuery ? 'No tokens found' : 'No tokens available'}
          </div>
        ) : (
          <div className="space-y-1">
            {filteredTokens.map(token => (
              <div key={token.address} className="flex items-center space-x-2">
                <button
                  onClick={() => toggleFavorite(token.address)}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  {favorites.includes(token.address) ? (
                    <StarIconSolid className="w-4 h-4 text-yellow-500" />
                  ) : (
                    <StarIcon className="w-4 h-4 text-gray-400" />
                  )}
                </button>
                <TokenListItem
                  token={token}
                  onClick={() => onTokenSelect(token)}
                  className="flex-1"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-gray-200 text-center">
        <p className="text-xs text-gray-500">
          Can't find a token? Make sure it's supported on this network.
        </p>
      </div>
    </div>
  );
};