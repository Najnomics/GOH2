import React from 'react';
import { Token } from '../../types/swap';
import { motion } from 'framer-motion';
import { 
  ArrowRightIcon, 
  SparklesIcon, 
  ExclamationTriangleIcon 
} from '@heroicons/react/24/outline';
import { formatCurrency } from '../../utils/formatters';
import { Spinner } from '../common/Spinner';

interface SwapButtonProps {
  onSwap: () => void;
  isLoading: boolean;
  disabled: boolean;
  optimizationEnabled: boolean;
  savings?: number;
  tokenIn?: Token | null;
  tokenOut?: Token | null;
  className?: string;
}

export const SwapButton: React.FC<SwapButtonProps> = ({
  onSwap,
  isLoading,
  disabled,
  optimizationEnabled,
  savings,
  tokenIn,
  tokenOut,
  className = '',
}) => {
  const getButtonText = () => {
    if (!tokenIn || !tokenOut) {
      return 'Select tokens';
    }
    
    if (isLoading) {
      return optimizationEnabled ? 'Optimizing Swap...' : 'Swapping...';
    }
    
    if (optimizationEnabled && savings) {
      return `Swap & Save ${formatCurrency(savings)}`;
    }
    
    return optimizationEnabled ? 'Cross-Chain Swap' : 'Swap';
  };

  const getButtonVariant = () => {
    if (disabled) return 'disabled';
    if (optimizationEnabled) return 'optimization';
    return 'default';
  };

  const buttonVariants = {
    default: 'bg-primary-blue hover:bg-primary-blueHover text-white',
    optimization: 'bg-gradient-to-r from-primary-pink to-primary-purple hover:from-primary-pinkHover hover:to-primary-purpleHover text-white',
    disabled: 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed',
  };

  const variant = getButtonVariant();

  return (
    <motion.button
      className={`swap-button w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 ${buttonVariants[variant]} ${className}`}
      onClick={onSwap}
      disabled={disabled || isLoading}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
    >
      <div className="flex items-center justify-center space-x-2">
        {isLoading ? (
          <>
            <Spinner size="sm" />
            <span>{getButtonText()}</span>
          </>
        ) : (
          <>
            {optimizationEnabled && !disabled && (
              <SparklesIcon className="h-5 w-5" />
            )}
            <span>{getButtonText()}</span>
            {!disabled && !isLoading && (
              <ArrowRightIcon className="h-5 w-5" />
            )}
          </>
        )}
      </div>
      
      {/* Optimization indicator */}
      {optimizationEnabled && !disabled && (
        <div className="text-xs mt-1 opacity-90">
          Cross-chain optimization enabled
        </div>
      )}
    </motion.button>
  );
};