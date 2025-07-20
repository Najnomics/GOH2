import React from 'react';
import { ChainComparison as ChainComparisonType } from '../../types/optimization';
import { ChainBadge } from '../common/ChainBadge';
import { motion } from 'framer-motion';
import { formatCurrency, formatTime } from '../../utils/formatters';
import { CheckCircleIcon, ClockIcon } from '@heroicons/react/24/outline';

interface ChainComparisonProps {
  comparison: ChainComparisonType[];
  currentChainId: number;
  optimalChainId: number;
  className?: string;
}

export const ChainComparison: React.FC<ChainComparisonProps> = ({
  comparison,
  currentChainId,
  optimalChainId,
  className = '',
}) => {
  const sortedComparison = [...comparison].sort((a, b) => a.totalCostUSD - b.totalCostUSD);

  return (
    <div className={`chain-comparison ${className}`}>
      <div className="comparison-header mb-4">
        <h4 className="text-lg font-semibold text-text-primary dark:text-white">
          Chain Comparison
        </h4>
        <p className="text-sm text-text-secondary dark:text-gray-400">
          Cost analysis across all supported chains
        </p>
      </div>

      <div className="comparison-list space-y-3">
        {sortedComparison.map((chain, index) => (
          <motion.div
            key={chain.chainId}
            className={`comparison-item p-4 rounded-lg border ${
              chain.chainId === optimalChainId
                ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20'
                : chain.chainId === currentChainId
                ? 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <ChainBadge chainId={chain.chainId} size="sm" />
                <div className="chain-info">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-text-primary dark:text-white">
                      {chain.chainName}
                    </span>
                    {chain.chainId === optimalChainId && (
                      <CheckCircleIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
                    )}
                    {chain.chainId === currentChainId && (
                      <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full">
                        Current
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-text-secondary dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <ClockIcon className="h-3 w-3" />
                      <span>{formatTime(chain.executionTime)}</span>
                    </div>
                    <span>Gas: {chain.gasPrice.toFixed(2)} gwei</span>
                  </div>
                </div>
              </div>

              <div className="cost-info text-right">
                <div className="total-cost font-semibold text-text-primary dark:text-white">
                  {formatCurrency(chain.totalCostUSD)}
                </div>
                {chain.savings > 0 && (
                  <div className="savings text-sm text-green-600 dark:text-green-400">
                    Save {formatCurrency(chain.savings)}
                  </div>
                )}
                {chain.savings === 0 && chain.chainId === currentChainId && (
                  <div className="baseline text-sm text-text-secondary dark:text-gray-400">
                    Baseline
                  </div>
                )}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="cost-progress mt-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-text-secondary dark:text-gray-400">
                  Cost relative to most expensive
                </span>
                <span className="text-xs text-text-secondary dark:text-gray-400">
                  {chain.savingsPercent.toFixed(0)}% savings
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    chain.chainId === optimalChainId
                      ? 'bg-green-500'
                      : chain.chainId === currentChainId
                      ? 'bg-blue-500'
                      : 'bg-gray-400'
                  }`}
                  style={{ width: `${100 - chain.savingsPercent}%` }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};