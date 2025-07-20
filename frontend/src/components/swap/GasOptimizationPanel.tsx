import React, { useState } from 'react';
import { OptimizationQuote, UserPreferences } from '../../types/optimization';
import { SavingsBreakdown } from './SavingsBreakdown';
import { ChainComparison } from './ChainComparison';
import { BridgeDetails } from './BridgeDetails';
import { ChainBadge } from '../common/ChainBadge';
import { Spinner } from '../common/Spinner';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ClockIcon, 
  ChevronDownIcon, 
  SparklesIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { formatCurrency, formatPercentage, formatTime } from '../../utils/formatters';
import { getChainName } from '../../utils/helpers';

interface GasOptimizationPanelProps {
  quote: OptimizationQuote | null;
  isLoading: boolean;
  preferences: UserPreferences;
  onToggleDetails?: () => void;
  showDetails?: boolean;
}

export const GasOptimizationPanel: React.FC<GasOptimizationPanelProps> = ({
  quote,
  isLoading,
  preferences,
  onToggleDetails,
  showDetails = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (isLoading) {
    return (
      <motion.div
        className="optimization-panel loading bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-xl p-4 border border-pink-200 dark:border-pink-800"
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
      >
        <div className="optimization-header flex items-center space-x-3">
          <Spinner size="sm" />
          <span className="text-text-primary dark:text-white font-medium">
            Analyzing gas costs across chains...
          </span>
        </div>
      </motion.div>
    );
  }

  if (!quote) {
    return null;
  }

  if (!quote.shouldOptimize) {
    return (
      <motion.div
        className="optimization-panel no-optimization bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800"
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
      >
        <div className="flex items-center space-x-3">
          <CheckCircleIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
          <div>
            <p className="text-green-800 dark:text-green-200 font-medium text-sm">
              Current chain is optimal
            </p>
            <p className="text-green-600 dark:text-green-400 text-xs mt-1">
              Savings below your threshold of {formatPercentage(preferences.minSavingsThresholdBPS / 100)}
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  const getSeverityColor = () => {
    if (quote.savingsPercent >= 50) return 'text-green-600 dark:text-green-400';
    if (quote.savingsPercent >= 25) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-orange-600 dark:text-orange-400';
  };

  const getSeverityIcon = () => {
    if (quote.savingsPercent >= 50) return <SparklesIcon className="h-5 w-5" />;
    if (quote.savingsPercent >= 25) return <CheckCircleIcon className="h-5 w-5" />;
    return <ExclamationTriangleIcon className="h-5 w-5" />;
  };

  return (
    <motion.div
      className="optimization-panel bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-xl p-4 border border-pink-200 dark:border-pink-800"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
    >
      {/* Header */}
      <div className="optimization-header flex items-center justify-between">
        <div className="savings-highlight flex items-center space-x-2">
          <div className={`savings-icon ${getSeverityColor()}`}>
            {getSeverityIcon()}
          </div>
          <div>
            <p className="savings-text text-green-600 dark:text-green-400 font-semibold">
              {preferences.enableUSDDisplay 
                ? `Save ${formatCurrency(quote.savingsUSD)} (${formatPercentage(quote.savingsPercent)})`
                : `Save ${formatPercentage(quote.savingsPercent)}`
              }
            </p>
            <p className="text-xs text-text-secondary dark:text-gray-400">
              vs current chain
            </p>
          </div>
        </div>
        
        <div className="optimal-chain flex items-center space-x-2">
          <ChainBadge chainId={quote.optimizedChainId} size="sm" />
          <span className="text-sm text-text-secondary dark:text-gray-400">
            Optimal
          </span>
        </div>
      </div>

      {/* Quick Info */}
      <div className="optimization-quick-info mt-3 flex items-center justify-between text-sm">
        <div className="execution-time flex items-center space-x-1 text-text-secondary dark:text-gray-400">
          <ClockIcon className="h-4 w-4" />
          <span>~{formatTime(quote.estimatedTime)}</span>
        </div>
        
        {quote.requiresBridge && (
          <div className="bridge-info text-text-secondary dark:text-gray-400">
            <span>via {quote.bridgeInfo?.provider || 'Bridge'}</span>
          </div>
        )}
        
        <button
          className="expand-button flex items-center space-x-1 text-primary-blue hover:text-primary-blueHover transition-colors"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <span>Details</span>
          <ChevronDownIcon 
            className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
          />
        </button>
      </div>

      {/* Expanded Details */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="optimization-details mt-4 space-y-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Savings Breakdown */}
            <SavingsBreakdown
              breakdown={quote.costBreakdown}
              originalCost={quote.originalCostUSD}
              optimizedCost={quote.optimizedCostUSD}
              showUSD={preferences.enableUSDDisplay}
            />

            {/* Chain Comparison */}
            <ChainComparison
              comparison={quote.chainComparison}
              currentChainId={quote.originalChainId}
              optimalChainId={quote.optimizedChainId}
            />

            {/* Bridge Details */}
            {quote.requiresBridge && quote.bridgeInfo && (
              <BridgeDetails
                bridgeInfo={quote.bridgeInfo}
                estimatedTime={quote.estimatedTime}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <div className="optimization-footer mt-3 pt-3 border-t border-pink-200 dark:border-pink-800">
        <div className="flex items-center justify-between text-xs text-text-secondary dark:text-gray-400">
          <span>
            Powered by {quote.bridgeInfo?.provider || 'Across Protocol'}
          </span>
          <span>
            Success rate: {formatPercentage((quote.bridgeInfo?.success_rate || 0.95) * 100)}
          </span>
        </div>
      </div>
    </motion.div>
  );
};