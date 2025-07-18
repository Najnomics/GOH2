import React from 'react';
import { Token } from '../../types/swap';
import { motion } from 'framer-motion';
import { formatTokenAmount, formatCurrency } from '../../utils/formatters';

interface TokenListItemProps {
  token: Token;
  balance?: { raw: string; formatted: string } | null;
  price?: number;
  onSelect: () => void;
  className?: string;
}

export const TokenListItem: React.FC<TokenListItemProps> = ({
  token,
  balance,
  price,
  onSelect,
  className = '',
}) => {
  const balanceValue = balance && price ? parseFloat(balance.formatted) * price : 0;

  return (
    <motion.button
      className={`token-list-item w-full p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left ${className}`}
      onClick={onSelect}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* Token Logo */}
          <div className="token-logo-container">
            <img
              src={token.logoURI}
              alt={token.symbol}
              className="w-10 h-10 rounded-full"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/icons/tokens/generic.svg';
              }}
            />
          </div>

          {/* Token Info */}
          <div className="token-info">
            <div className="flex items-center space-x-2">
              <span className="token-symbol font-semibold text-gray-900 dark:text-white">
                {token.symbol}
              </span>
              {token.chainId && (
                <span className="chain-badge px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
                  {token.chainId}
                </span>
              )}
            </div>
            <div className="token-name text-sm text-gray-500 dark:text-gray-400">
              {token.name}
            </div>
          </div>
        </div>

        {/* Balance & Value */}
        <div className="token-balance-info text-right">
          {balance && (
            <div className="balance text-gray-900 dark:text-white font-medium">
              {formatTokenAmount(balance.formatted, 0, 4)}
            </div>
          )}
          {balanceValue > 0 && (
            <div className="balance-value text-sm text-gray-500 dark:text-gray-400">
              {formatCurrency(balanceValue)}
            </div>
          )}
          {price && !balance && (
            <div className="token-price text-sm text-gray-500 dark:text-gray-400">
              {formatCurrency(price)}
            </div>
          )}
        </div>
      </div>
    </motion.button>
  );
};