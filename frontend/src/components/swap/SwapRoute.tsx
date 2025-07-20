import React from 'react';
import { Token } from '../../types/swap';
import { OptimizationQuote } from '../../types/optimization';
import { ChainBadge } from '../common/ChainBadge';
import { motion } from 'framer-motion';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { getChainName } from '../../utils/helpers';

interface SwapRouteProps {
  tokenIn: Token | null;
  tokenOut: Token | null;
  isCrossChain: boolean;
  optimizationQuote?: OptimizationQuote | null;
  className?: string;
}

export const SwapRoute: React.FC<SwapRouteProps> = ({
  tokenIn,
  tokenOut,
  isCrossChain,
  optimizationQuote,
  className = '',
}) => {
  if (!tokenIn || !tokenOut) return null;

  const sourceChainId = optimizationQuote?.originalChainId || tokenIn.chainId;
  const targetChainId = optimizationQuote?.optimizedChainId || tokenOut.chainId;

  return (
    <motion.div
      className={`swap-route p-3 bg-gray-50 dark:bg-gray-800 rounded-lg ${className}`}
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
    >
      <div className="route-header mb-2">
        <span className="text-sm font-medium text-text-primary dark:text-white">
          {isCrossChain ? 'Cross-Chain Route' : 'Swap Route'}
        </span>
      </div>

      <div className="route-flow">
        {isCrossChain ? (
          // Cross-chain route
          <div className="flex items-center space-x-2">
            {/* Source */}
            <div className="route-step flex items-center space-x-2">
              <img
                src={tokenIn.logoURI}
                alt={tokenIn.symbol}
                className="w-6 h-6 rounded-full"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/icons/tokens/generic.svg';
                }}
              />
              <span className="font-medium text-text-primary dark:text-white">
                {tokenIn.symbol}
              </span>
              <ChainBadge chainId={sourceChainId} size="xs" />
            </div>

            <ArrowRightIcon className="h-4 w-4 text-text-secondary dark:text-gray-400" />

            {/* Bridge */}
            <div className="route-step flex items-center space-x-2">
              <div className="bridge-indicator px-2 py-1 bg-blue-100 dark:bg-blue-900/30 rounded text-xs text-blue-800 dark:text-blue-200">
                Bridge
              </div>
            </div>

            <ArrowRightIcon className="h-4 w-4 text-text-secondary dark:text-gray-400" />

            {/* Target */}
            <div className="route-step flex items-center space-x-2">
              <ChainBadge chainId={targetChainId} size="xs" />
              <span className="font-medium text-text-primary dark:text-white">
                {tokenOut.symbol}
              </span>
              <img
                src={tokenOut.logoURI}
                alt={tokenOut.symbol}
                className="w-6 h-6 rounded-full"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/icons/tokens/generic.svg';
                }}
              />
            </div>
          </div>
        ) : (
          // Local swap route
          <div className="flex items-center space-x-2">
            <div className="route-step flex items-center space-x-2">
              <img
                src={tokenIn.logoURI}
                alt={tokenIn.symbol}
                className="w-6 h-6 rounded-full"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/icons/tokens/generic.svg';
                }}
              />
              <span className="font-medium text-text-primary dark:text-white">
                {tokenIn.symbol}
              </span>
            </div>

            <ArrowRightIcon className="h-4 w-4 text-text-secondary dark:text-gray-400" />

            <div className="route-step flex items-center space-x-2">
              <div className="swap-indicator px-2 py-1 bg-green-100 dark:bg-green-900/30 rounded text-xs text-green-800 dark:text-green-200">
                Uniswap V4
              </div>
            </div>

            <ArrowRightIcon className="h-4 w-4 text-text-secondary dark:text-gray-400" />

            <div className="route-step flex items-center space-x-2">
              <span className="font-medium text-text-primary dark:text-white">
                {tokenOut.symbol}
              </span>
              <img
                src={tokenOut.logoURI}
                alt={tokenOut.symbol}
                className="w-6 h-6 rounded-full"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/icons/tokens/generic.svg';
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Route Details */}
      <div className="route-details mt-3 text-xs text-text-secondary dark:text-gray-400">
        {isCrossChain ? (
          <div className="flex justify-between">
            <span>
              {getChainName(sourceChainId)} → {getChainName(targetChainId)}
            </span>
            <span>
              via {optimizationQuote?.bridgeInfo?.provider || 'Bridge'}
            </span>
          </div>
        ) : (
          <div className="flex justify-between">
            <span>Direct swap on {getChainName(sourceChainId)}</span>
            <span>Single transaction</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};