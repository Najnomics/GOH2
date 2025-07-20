import React, { useState, useCallback } from 'react';
import { Token } from '../../types/swap';
import { useTokens } from '../../hooks/useTokens';
import { TokenSearchModal } from './TokenSearchModal';
import { motion } from 'framer-motion';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { formatTokenAmount, formatCurrency } from '../../utils/formatters';

interface TokenSelectorProps {
  label: string;
  token: Token | null;
  amount: string;
  onTokenSelect: (token: Token) => void;
  onAmountChange?: (amount: string) => void;
  readonly?: boolean;
  showBalance?: boolean;
  className?: string;
}

export const TokenSelector: React.FC<TokenSelectorProps> = ({
  label,
  token,
  amount,
  onTokenSelect,
  onAmountChange,
  readonly = false,
  showBalance = false,
  className = '',
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { getTokenBalance, getTokenPrice } = useTokens();

  const balance = showBalance && token ? getTokenBalance(token) : null;
  const price = token ? getTokenPrice(token) : 0;
  const valueUSD = price && amount ? price * parseFloat(amount) : 0;

  const handleTokenSelect = useCallback((selectedToken: Token) => {
    onTokenSelect(selectedToken);
    setIsModalOpen(false);
  }, [onTokenSelect]);

  const handleAmountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only valid number inputs
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      onAmountChange?.(value);
    }
  }, [onAmountChange]);

  const handleMaxClick = useCallback(() => {
    if (balance && onAmountChange) {
      onAmountChange(balance.formatted);
    }
  }, [balance, onAmountChange]);

  return (
    <div className={`token-selector ${className}`}>
      {/* Header */}
      <div className="token-selector-header flex justify-between items-center mb-2">
        <span className="token-label text-sm text-text-secondary dark:text-gray-400">
          {label}
        </span>
        {balance && (
          <button
            className="token-balance text-sm text-text-secondary dark:text-gray-400 hover:text-text-primary dark:hover:text-white transition-colors"
            onClick={handleMaxClick}
          >
            Balance: {balance.formatted}
          </button>
        )}
      </div>

      {/* Main Input Area */}
      <div className="token-selector-body bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-border-primary dark:border-gray-700">
        <div className="flex items-center space-x-3">
          {/* Amount Input */}
          <div className="flex-1">
            <input
              type="text"
              value={amount}
              onChange={handleAmountChange}
              placeholder="0.0"
              className="amount-input w-full text-2xl font-medium bg-transparent border-none outline-none placeholder-gray-400 dark:placeholder-gray-500 text-text-primary dark:text-white"
              disabled={readonly}
            />
            {/* USD Value */}
            {valueUSD > 0 && (
              <div className="text-sm text-text-secondary dark:text-gray-400 mt-1">
                {formatCurrency(valueUSD)}
              </div>
            )}
          </div>

          {/* Token Button */}
          <motion.button
            className="token-button flex items-center space-x-2 px-4 py-3 bg-white dark:bg-dark-bg-card rounded-xl border border-border-primary dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors min-w-[120px]"
            onClick={() => setIsModalOpen(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {token ? (
              <>
                <img
                  src={token.logoURI}
                  alt={token.symbol}
                  className="token-logo w-6 h-6 rounded-full"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/icons/tokens/generic.svg';
                  }}
                />
                <span className="token-symbol font-medium text-text-primary dark:text-white">
                  {token.symbol}
                </span>
              </>
            ) : (
              <span className="select-token-text text-text-secondary dark:text-gray-400">
                Select Token
              </span>
            )}
            <ChevronDownIcon className="h-4 w-4 text-text-secondary dark:text-gray-400" />
          </motion.button>
        </div>
      </div>

      {/* Token Search Modal */}
      <TokenSearchModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onTokenSelect={handleTokenSelect}
        excludeToken={token}
      />
    </div>
  );
};