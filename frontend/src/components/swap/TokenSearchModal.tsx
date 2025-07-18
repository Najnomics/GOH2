import React, { useState, useEffect, useMemo } from 'react';
import { Token } from '../../types/swap';
import { useTokens } from '../../hooks/useTokens';
import { Modal } from '../common/Modal';
import { TokenListItem } from './TokenListItem';
import { motion } from 'framer-motion';
import { 
  MagnifyingGlassIcon, 
  StarIcon, 
  ClockIcon,
  XMarkIcon 
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { debounce } from '../../utils/helpers';

interface TokenSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTokenSelect: (token: Token) => void;
  excludeToken?: Token | null;
}

export const TokenSearchModal: React.FC<TokenSearchModalProps> = ({
  isOpen,
  onClose,
  onTokenSelect,
  excludeToken,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'popular' | 'recent' | 'all'>('popular');
  const [importAddress, setImportAddress] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  
  const {
    popularTokens,
    recentTokens,
    searchTokens,
    importToken,
    addToRecent,
    getTokenBalance,
    getTokenPrice,
    isLoading,
  } = useTokens();

  // Debounced search
  const debouncedSearch = useMemo(
    () => debounce((query: string) => {
      setSearchQuery(query);
    }, 300),
    []
  );

  // Filter tokens based on search and exclude
  const filteredTokens = useMemo(() => {
    let tokens: Token[] = [];
    
    switch (activeTab) {
      case 'popular':
        tokens = popularTokens;
        break;
      case 'recent':
        tokens = recentTokens;
        break;
      case 'all':
        tokens = searchQuery ? searchTokens(searchQuery) : popularTokens;
        break;
    }
    
    // Exclude the selected token
    if (excludeToken) {
      tokens = tokens.filter(token => token.address !== excludeToken.address);
    }
    
    return tokens;
  }, [activeTab, searchQuery, popularTokens, recentTokens, searchTokens, excludeToken]);

  const handleTokenSelect = (token: Token) => {
    addToRecent(token);
    onTokenSelect(token);
  };

  const handleImportToken = async () => {
    if (!importAddress) return;
    
    setIsImporting(true);
    try {
      const token = await importToken(importAddress);
      if (token) {
        handleTokenSelect(token);
      }
    } catch (error) {
      console.error('Failed to import token:', error);
    } finally {
      setIsImporting(false);
    }
  };

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery('');
      setActiveTab('popular');
      setImportAddress('');
    }
  }, [isOpen]);

  const tabs = [
    { id: 'popular', label: 'Popular', icon: StarIcon },
    { id: 'recent', label: 'Recent', icon: ClockIcon },
    { id: 'all', label: 'All', icon: MagnifyingGlassIcon },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Select Token"
      className="max-w-md"
    >
      <div className="token-search-modal">
        {/* Search Input */}
        <div className="search-section mb-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search tokens or paste address..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent"
              onChange={(e) => debouncedSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs-section mb-4">
          <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-white dark:bg-gray-700 text-primary-blue shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                  onClick={() => setActiveTab(tab.id as any)}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Token List */}
        <div className="token-list max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-blue"></div>
            </div>
          ) : filteredTokens.length > 0 ? (
            <div className="space-y-1">
              {filteredTokens.map((token) => (
                <TokenListItem
                  key={token.address}
                  token={token}
                  balance={getTokenBalance(token)}
                  price={getTokenPrice(token)}
                  onSelect={() => handleTokenSelect(token)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              {searchQuery ? 'No tokens found' : 'No tokens available'}
            </div>
          )}
        </div>

        {/* Import Section */}
        {searchQuery && searchQuery.startsWith('0x') && (
          <div className="import-section mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={importAddress}
                onChange={(e) => setImportAddress(e.target.value)}
                placeholder="Token contract address"
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent"
              />
              <button
                onClick={handleImportToken}
                disabled={!importAddress || isImporting}
                className="px-4 py-2 bg-primary-blue hover:bg-primary-blueHover disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-lg font-medium transition-colors"
              >
                {isImporting ? 'Importing...' : 'Import'}
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Import tokens by pasting their contract address
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
};