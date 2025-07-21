import React, { useState, useEffect } from 'react';
import { FaChevronDown, FaSearch } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { getSupportedTokens } from '../../services/api';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { FORMATTERS } from '../../utils/constants';

const TokenSelector = ({
  token,
  amount,
  onTokenSelect,
  onAmountChange,
  label,
  readonly = false,
  showBalance = false,
  className = ''
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tokens, setTokens] = useState([]);
  const [filteredTokens, setFilteredTokens] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch supported tokens
  useEffect(() => {
    const fetchTokens = async () => {
      try {
        setLoading(true);
        const tokenList = await getSupportedTokens();
        setTokens(tokenList);
        setFilteredTokens(tokenList);
      } catch (error) {
        console.error('Failed to fetch tokens:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTokens();
  }, []);

  // Filter tokens based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredTokens(tokens);
    } else {
      const filtered = tokens.filter(t => 
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredTokens(filtered);
    }
  }, [searchQuery, tokens]);

  const handleTokenSelect = (selectedToken) => {
    onTokenSelect(selectedToken);
    setIsModalOpen(false);
    setSearchQuery('');
  };

  const handleMaxClick = () => {
    // Mock balance for demo
    const mockBalance = '1000.0';
    onAmountChange?.(mockBalance);
  };

  return (
    <div className={`token-selector ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm font-medium text-gray-600">{label}</span>
        {showBalance && token && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">
              Balance: {FORMATTERS.number(1000.0)} {token.symbol}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMaxClick}
              className="text-xs px-2 py-1 h-6"
            >
              MAX
            </Button>
          </div>
        )}
      </div>

      {/* Input Container */}
      <div className="flex items-center space-x-3 bg-gray-50 rounded-xl p-4 border-2 border-transparent focus-within:border-purple-500 transition-colors">
        {/* Amount Input */}
        <div className="flex-1">
          <input
            type="number"
            value={amount}
            onChange={(e) => onAmountChange?.(e.target.value)}
            placeholder="0.0"
            className="w-full text-2xl font-medium bg-transparent border-none outline-none placeholder-gray-400"
            disabled={readonly}
            step="any"
            min="0"
          />
          {token && amount && (
            <div className="text-sm text-gray-500 mt-1">
              ≈ {FORMATTERS.currency(parseFloat(amount || 0) * (token.price_usd || 0))}
            </div>
          )}
        </div>

        {/* Token Button */}
        <Button
          variant="secondary"
          onClick={() => setIsModalOpen(true)}
          className="min-w-[140px] justify-between"
        >
          {token ? (
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-xs text-white font-bold">{token.symbol[0]}</span>
              </div>
              <span className="font-medium">{token.symbol}</span>
            </div>
          ) : (
            <span className="text-gray-500">Select Token</span>
          )}
          <FaChevronDown className="h-4 w-4 text-gray-400" />
        </Button>
      </div>

      {/* Token Selection Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Select Token"
        maxWidth="md"
      >
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search by name, symbol, or address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
            />
          </div>

          {/* Token List */}
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
              </div>
            ) : filteredTokens.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No tokens found
              </div>
            ) : (
              <div className="space-y-1">
                {filteredTokens.map((tokenOption) => (
                  <motion.button
                    key={tokenOption.address}
                    onClick={() => handleTokenSelect(tokenOption)}
                    className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <span className="text-xs text-white font-bold">{tokenOption.symbol[0]}</span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{tokenOption.symbol}</div>
                        <div className="text-sm text-gray-500">{tokenOption.name}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{FORMATTERS.number(1000.0)}</div>
                      <div className="text-xs text-gray-500">
                        {FORMATTERS.currency(tokenOption.price_usd || 0)}
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TokenSelector;