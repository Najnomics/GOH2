import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaArrowDown, FaSync, FaCog } from 'react-icons/fa';
import toast from 'react-hot-toast';
import TokenSelector from './TokenSelector';
import GasOptimizationPanel from './GasOptimizationPanel';
import SwapButton from './SwapButton';
import SwapSettings from './SwapSettings';
import Card from '../common/Card';
import Button from '../common/Button';
import useGasOptimization from '../../hooks/useGasOptimization';
import { executeSwap } from '../../services/api';
import { FORMATTERS } from '../../utils/constants';

const SwapInterface = ({ className = '' }) => {
  // State
  const [tokenIn, setTokenIn] = useState(null);
  const [tokenOut, setTokenOut] = useState(null);
  const [amountIn, setAmountIn] = useState('');
  const [amountOut, setAmountOut] = useState('');
  const [isSwapping, setIsSwapping] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [slippageTolerance, setSlippageTolerance] = useState(0.5);
  const [deadlineMinutes, setDeadlineMinutes] = useState(30);

  // Gas optimization hook
  const {
    optimizationQuote,
    isOptimizing,
    shouldOptimize,
    userPreferences,
    generateOptimizationQuote,
    updateUserPreferences
  } = useGasOptimization();

  // Generate quote when swap parameters change
  useEffect(() => {
    if (tokenIn && tokenOut && amountIn && parseFloat(amountIn) > 0) {
      const swapParams = {
        token_in: tokenIn.address,
        token_out: tokenOut.address,
        amount_in: amountIn,
        slippage_tolerance: slippageTolerance,
        deadline_minutes: deadlineMinutes
      };
      generateOptimizationQuote(swapParams);
    }
  }, [tokenIn, tokenOut, amountIn, slippageTolerance, deadlineMinutes, generateOptimizationQuote]);

  // Calculate output amount (mock calculation)
  useEffect(() => {
    if (tokenIn && tokenOut && amountIn && parseFloat(amountIn) > 0) {
      // Mock calculation based on price ratio
      const priceRatio = (tokenIn.price_usd || 1) / (tokenOut.price_usd || 1);
      const outputAmount = parseFloat(amountIn) * priceRatio * 0.997; // 0.3% fee
      setAmountOut(outputAmount.toFixed(6));
    } else {
      setAmountOut('');
    }
  }, [tokenIn, tokenOut, amountIn]);

  // Flip tokens
  const flipTokens = () => {
    if (tokenIn && tokenOut) {
      setTokenIn(tokenOut);
      setTokenOut(tokenIn);
      setAmountIn(amountOut);
      setAmountOut(amountIn);
    }
  };

  // Execute swap
  const handleSwap = async () => {
    if (!tokenIn || !tokenOut || !amountIn) {
      toast.error('Please select tokens and enter amount');
      return;
    }

    setIsSwapping(true);
    try {
      const swapParams = {
        token_in: tokenIn.address,
        token_out: tokenOut.address,
        amount_in: amountIn,
        slippage_tolerance: slippageTolerance,
        deadline_minutes: deadlineMinutes
      };

      const result = await executeSwap(swapParams, userPreferences);
      
      if (result.status === 'cross_chain_initiated') {
        toast.success('Cross-chain swap initiated! Check transaction status in History.');
      } else {
        toast.success('Swap executed successfully!');
      }

      // Reset form
      setAmountIn('');
      setAmountOut('');
    } catch (error) {
      console.error('Swap failed:', error);
      toast.error('Swap failed. Please try again.');
    } finally {
      setIsSwapping(false);
    }
  };

  // Check if swap can be executed
  const canSwap = tokenIn && tokenOut && amountIn && parseFloat(amountIn) > 0 && !isSwapping;

  return (
    <div className={`swap-interface ${className}`}>
      <Card className="max-w-md mx-auto" padding="lg">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Swap</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSettings(true)}
            className="p-2"
          >
            <FaCog className="h-5 w-5" />
          </Button>
        </div>

        {/* Swap Form */}
        <div className="space-y-4">
          {/* Token Input */}
          <TokenSelector
            token={tokenIn}
            amount={amountIn}
            onTokenSelect={setTokenIn}
            onAmountChange={setAmountIn}
            label="From"
            showBalance
          />

          {/* Flip Button */}
          <div className="flex justify-center -my-2 relative z-10">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={flipTokens}
              disabled={!tokenIn || !tokenOut}
              className="w-10 h-10 bg-white rounded-full shadow-lg border-2 border-gray-200 flex items-center justify-center hover:border-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <FaArrowDown className="h-4 w-4 text-gray-600" />
            </motion.button>
          </div>

          {/* Token Output */}
          <TokenSelector
            token={tokenOut}
            amount={amountOut}
            onTokenSelect={setTokenOut}
            label="To"
            readonly
          />

          {/* Gas Optimization Panel */}
          {(optimizationQuote || isOptimizing) && tokenIn && tokenOut && amountIn && (
            <GasOptimizationPanel
              quote={optimizationQuote}
              isLoading={isOptimizing}
              preferences={userPreferences}
              onPreferencesUpdate={updateUserPreferences}
            />
          )}

          {/* Price Info */}
          {tokenIn && tokenOut && amountIn && amountOut && (
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Exchange Rate</span>
                <span className="font-medium">
                  1 {tokenIn.symbol} = {FORMATTERS.number(parseFloat(amountOut) / parseFloat(amountIn))} {tokenOut.symbol}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm mt-1">
                <span className="text-gray-600">Slippage Tolerance</span>
                <span className="font-medium">{slippageTolerance}%</span>
              </div>
            </div>
          )}

          {/* Swap Button */}
          <SwapButton
            onSwap={handleSwap}
            isLoading={isSwapping}
            disabled={!canSwap}
            isCrossChain={shouldOptimize}
            savingsUSD={optimizationQuote?.savingsUSD}
          />
        </div>
      </Card>

      {/* Settings Modal */}
      {showSettings && (
        <SwapSettings
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          slippageTolerance={slippageTolerance}
          onSlippageChange={setSlippageTolerance}
          deadlineMinutes={deadlineMinutes}
          onDeadlineChange={setDeadlineMinutes}
          userPreferences={userPreferences}
          onPreferencesChange={updateUserPreferences}
        />
      )}
    </div>
  );
};

export default SwapInterface;