import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useSwap } from '../../hooks/useSwap';
import { useGasOptimization } from '../../hooks/useGasOptimization';
import { TokenSelector } from './TokenSelector';
import { GasOptimizationPanel } from './GasOptimizationPanel';
import { SwapButton } from './SwapButton';
import { SwapSettings } from './SwapSettings';
import { PriceImpact } from './PriceImpact';
import { ArrowDownIcon } from '@heroicons/react/24/outline';
import '../../styles/components/swap.css';

interface SwapInterfaceProps {
  className?: string;
}

export const SwapInterface: React.FC<SwapInterfaceProps> = ({ className = '' }) => {
  const [showSettings, setShowSettings] = useState(false);
  
  const {
    tokenIn,
    tokenOut,
    amountIn,
    amountOut,
    setTokenIn,
    setTokenOut,
    setAmountIn,
    setSettings,
    flipTokens,
    executeSwap,
    isLoading,
    canSwap,
    priceImpact,
    settings,
    quote
  } = useSwap();
  
  const {
    optimizationQuote,
    isOptimizing,
    shouldOptimize,
    userPreferences,
    getOptimizationQuote
  } = useGasOptimization();

  // Get optimization quote when swap parameters change
  useEffect(() => {
    if (tokenIn && tokenOut && amountIn && parseFloat(amountIn) > 0) {
      const swapParams = {
        token_in: tokenIn.address,
        token_out: tokenOut.address,
        amount_in: amountIn,
        slippage_tolerance: settings.slippageTolerance,
        deadline_minutes: settings.deadline,
      };
      getOptimizationQuote(swapParams);
    }
  }, [tokenIn, tokenOut, amountIn, settings, getOptimizationQuote]);

  const handleSwap = async () => {
    try {
      await executeSwap();
      toast.success('Swap executed successfully!');
    } catch (error: any) {
      toast.error(`Swap failed: ${error.message}`);
    }
  };

  return (
    <div className={`swap-interface ${className}`}>
      <div className="swap-card">
        <div className="swap-header">
          <h2 className="swap-title">Swap</h2>
          <SwapSettings 
            settings={settings}
            onSettingsChange={setSettings}
            isOpen={showSettings}
            onToggle={() => setShowSettings(!showSettings)}
          />
        </div>
         
        <div className="swap-body">
          {/* Token Input */}
          <div className="token-input-container">
            <TokenSelector
              token={tokenIn}
              amount={amountIn}
              onTokenSelect={setTokenIn}
              onAmountChange={setAmountIn}
              label="From"
              showBalance
            />
          </div>
          
          {/* Swap Direction Button */}
          <div className="swap-direction">
            <button 
              className="swap-flip-button" 
              onClick={flipTokens}
              disabled={!tokenIn || !tokenOut}
            >
              <ArrowDownIcon className="w-5 h-5" />
            </button>
          </div>
          
          {/* Token Output */}
          <div className="token-output-container">
            <TokenSelector
              token={tokenOut}
              amount={amountOut}
              onTokenSelect={setTokenOut}
              label="To"
              readonly
            />
          </div>

          {/* Price Impact Warning */}
          {quote && (
            <PriceImpact 
              priceImpact={priceImpact}
              className="mt-2"
            />
          )}
          
          {/* Gas Optimization Panel */}
          {shouldOptimize && optimizationQuote && (
            <GasOptimizationPanel
              quote={optimizationQuote}
              isLoading={isOptimizing}
              preferences={userPreferences}
            />
          )}
          
          {/* Swap Button */}
          <SwapButton
            onSwap={handleSwap}
            isLoading={isLoading}
            disabled={!canSwap}
            optimizationEnabled={shouldOptimize}
            tokenIn={tokenIn}
            tokenOut={tokenOut}
            amountIn={amountIn}
          />

          {/* Swap Details */}
          {quote && (
            <div className="swap-details mt-4 p-3 bg-gray-50 rounded-lg text-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Minimum received</span>
                <span className="font-medium">{quote.minimumAmountOut} {tokenOut?.symbol}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Price impact</span>
                <span className={`font-medium ${priceImpact > 5 ? 'text-red-600' : priceImpact > 2 ? 'text-yellow-600' : 'text-green-600'}`}>
                  {priceImpact.toFixed(2)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Route</span>
                <span className="font-medium">Uniswap V4</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};