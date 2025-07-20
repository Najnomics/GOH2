import React, { useState, useEffect } from 'react';
import { useSwap } from '../../hooks/useSwap';
import { useGasOptimization } from '../../hooks/useGasOptimization';
import { TokenSelector } from './TokenSelector';
import { GasOptimizationPanel } from './GasOptimizationPanel';
import { SwapButton } from './SwapButton';
import { SwapSettings } from './SwapSettings';
import { PriceImpact } from './PriceImpact';
import { SwapRoute } from './SwapRoute';
import { motion } from 'framer-motion';
import { ArrowDownIcon, CogIcon } from '@heroicons/react/24/outline';
import { formatCurrency, formatPercentage } from '../../utils/formatters';
import toast from 'react-hot-toast';

interface SwapInterfaceProps {
  className?: string;
}

export const SwapInterface: React.FC<SwapInterfaceProps> = ({ className }) => {
  const {
    swapState,
    tokenIn,
    tokenOut,
    amountIn,
    amountOut,
    swapSettings,
    setTokenIn,
    setTokenOut,
    setAmountIn,
    flipTokens,
    executeSwap,
    canSwap,
    swapSummary,
    isCrossChain,
  } = useSwap();

  const {
    optimizationQuote,
    isOptimizing,
    shouldOptimize,
    userPreferences,
    getSavingsDisplay,
    getOptimizationRecommendation,
  } = useGasOptimization();

  const [showSettings, setShowSettings] = useState(false);
  const [showOptimizationDetails, setShowOptimizationDetails] = useState(false);

  // Handle swap execution
  const handleSwap = async () => {
    if (!canSwap) return;
    
    try {
      await executeSwap(
        {
          tokenIn: tokenIn!,
          tokenOut: tokenOut!,
          amountIn,
          amountOut,
          slippage: swapSettings.slippage,
          deadline: Date.now() + swapSettings.deadline * 60 * 1000,
          recipient: '0x123...', // Will be replaced with actual address
        },
        shouldOptimize ? optimizationQuote : undefined
      );
      
      toast.success(
        isCrossChain 
          ? 'Cross-chain swap initiated!' 
          : 'Swap executed successfully!'
      );
    } catch (error) {
      toast.error('Swap failed: ' + (error as Error).message);
    }
  };

  // Get price impact severity
  const getPriceImpactSeverity = (impact: number) => {
    if (impact < 1) return 'low';
    if (impact < 3) return 'medium';
    if (impact < 5) return 'high';
    return 'very-high';
  };

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className={`swap-interface max-w-md mx-auto p-4 ${className}`}
      initial="hidden"
      animate="visible"
      variants={cardVariants}
      transition={{ duration: 0.3 }}
    >
      <div className="swap-card bg-white dark:bg-dark-bg-card rounded-2xl shadow-card border border-border-primary dark:border-gray-700 overflow-hidden">
        {/* Header */}
        <div className="swap-header flex justify-between items-center p-6 border-b border-border-primary dark:border-gray-700">
          <h2 className="swap-title text-xl font-semibold text-text-primary dark:text-white">
            {isCrossChain ? 'Cross-Chain Swap' : 'Swap'}
          </h2>
          <button
            className="settings-button p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            onClick={() => setShowSettings(true)}
          >
            <CogIcon className="h-5 w-5 text-text-secondary dark:text-gray-400" />
          </button>
        </div>

        <div className="swap-body p-6 space-y-4">
          {/* Token Input */}
          <div className="token-input-container">
            <TokenSelector
              label="From"
              token={tokenIn}
              amount={amountIn}
              onTokenSelect={setTokenIn}
              onAmountChange={setAmountIn}
              showBalance
            />
          </div>

          {/* Swap Direction Button */}
          <div className="swap-direction flex justify-center -my-2 relative z-10">
            <motion.button
              className="swap-flip-button w-10 h-10 bg-white dark:bg-dark-bg-card rounded-full shadow-md border border-border-primary dark:border-gray-700 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              onClick={flipTokens}
              disabled={!tokenIn || !tokenOut}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowDownIcon className="h-5 w-5 text-text-secondary dark:text-gray-400" />
            </motion.button>
          </div>

          {/* Token Output */}
          <div className="token-output-container">
            <TokenSelector
              label="To"
              token={tokenOut}
              amount={amountOut}
              onTokenSelect={setTokenOut}
              readonly
            />
          </div>

          {/* Swap Details */}
          {swapSummary && (
            <div className="swap-details space-y-3">
              {/* Price Impact */}
              {swapSummary.priceImpact > 0 && (
                <PriceImpact
                  impact={swapSummary.priceImpact}
                  severity={getPriceImpactSeverity(swapSummary.priceImpact)}
                />
              )}

              {/* Swap Route */}
              <SwapRoute
                tokenIn={tokenIn}
                tokenOut={tokenOut}
                isCrossChain={isCrossChain}
                optimizationQuote={optimizationQuote}
              />

              {/* Execution Time */}
              <div className="execution-time flex justify-between items-center text-sm text-text-secondary dark:text-gray-400">
                <span>Estimated time:</span>
                <span>{Math.round(swapSummary.estimatedTime / 60)}m</span>
              </div>

              {/* Gas Estimate */}
              <div className="gas-estimate flex justify-between items-center text-sm text-text-secondary dark:text-gray-400">
                <span>Network cost:</span>
                <span>{formatCurrency(swapSummary.gasEstimate)}</span>
              </div>
            </div>
          )}

          {/* Gas Optimization Panel */}
          {tokenIn && tokenOut && amountIn && (
            <GasOptimizationPanel
              quote={optimizationQuote}
              isLoading={isOptimizing}
              preferences={userPreferences}
              onToggleDetails={() => setShowOptimizationDetails(!showOptimizationDetails)}
              showDetails={showOptimizationDetails}
            />
          )}

          {/* Swap Button */}
          <SwapButton
            onSwap={handleSwap}
            isLoading={swapState.isLoading}
            disabled={!canSwap}
            optimizationEnabled={shouldOptimize}
            savings={optimizationQuote?.savingsUSD}
            tokenIn={tokenIn}
            tokenOut={tokenOut}
          />

          {/* Error Display */}
          {swapState.error && (
            <motion.div
              className="swap-error p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <p className="text-red-600 dark:text-red-400 text-sm">
                {swapState.error}
              </p>
            </motion.div>
          )}

          {/* Optimization Recommendation */}
          {optimizationQuote && (
            <motion.div
              className="optimization-recommendation p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-800 dark:text-blue-200 font-medium text-sm">
                    {getSavingsDisplay(optimizationQuote)}
                  </p>
                  <p className="text-blue-600 dark:text-blue-400 text-xs mt-1">
                    {getOptimizationRecommendation(optimizationQuote).reason}
                  </p>
                </div>
                <button
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 text-xs font-medium"
                  onClick={() => setShowOptimizationDetails(!showOptimizationDetails)}
                >
                  Details
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <SwapSettings
          onClose={() => setShowSettings(false)}
          settings={swapSettings}
        />
      )}
    </motion.div>
  );
};