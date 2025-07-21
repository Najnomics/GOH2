import React from 'react';
import { motion } from 'framer-motion';
import { FaArrowRight, FaBolt, FaExchangeAlt } from 'react-icons/fa';
import Button from '../common/Button';
import { FORMATTERS } from '../../utils/constants';

const SwapButton = ({
  onSwap,
  isLoading = false,
  disabled = false,
  isCrossChain = false,
  savingsUSD = 0,
  className = ''
}) => {
  const getButtonContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
          <span>{isCrossChain ? 'Optimizing Swap...' : 'Swapping...'}</span>
        </div>
      );
    }

    if (isCrossChain && savingsUSD > 0) {
      return (
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-2">
            <FaBolt className="h-4 w-4 text-yellow-300" />
            <span>Optimize & Swap</span>
          </div>
          <div className="flex items-center space-x-1 text-sm">
            <span>Save {FORMATTERS.currency(savingsUSD)}</span>
            <FaArrowRight className="h-3 w-3" />
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center space-x-2">
        <FaExchangeAlt className="h-4 w-4" />
        <span>Swap</span>
      </div>
    );
  };

  const getButtonVariant = () => {
    if (disabled) return 'secondary';
    if (isCrossChain && savingsUSD > 0) return 'primary';
    return 'primary';
  };

  const getButtonClasses = () => {
    const base = 'w-full py-4 text-lg font-semibold';
    
    if (isCrossChain && savingsUSD > 0) {
      return `${base} bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl`;
    }
    
    return base;
  };

  return (
    <motion.div
      whileHover={!disabled && !isLoading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !isLoading ? { scale: 0.98 } : {}}
      className={className}
    >
      <Button
        onClick={onSwap}
        disabled={disabled}
        loading={isLoading}
        variant={getButtonVariant()}
        className={getButtonClasses()}
      >
        {getButtonContent()}
      </Button>
      
      {/* Optimization Info */}
      {isCrossChain && savingsUSD > 0 && !isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-center text-sm text-gray-600"
        >
          Cross-chain optimization enabled
        </motion.div>
      )}
    </motion.div>
  );
};

export default SwapButton;