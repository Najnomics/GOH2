import React from 'react';
import { Token } from '../../types/token';
import { Button } from '../common/Button';
import { Spinner } from '../common/Spinner';

interface SwapButtonProps {
  onSwap: () => void;
  isLoading: boolean;
  disabled: boolean;
  optimizationEnabled: boolean;
  tokenIn: Token | null;
  tokenOut: Token | null;
  amountIn: string;
}

export const SwapButton: React.FC<SwapButtonProps> = ({
  onSwap,
  isLoading,
  disabled,
  optimizationEnabled,
  tokenIn,
  tokenOut,
  amountIn
}) => {
  // Determine button text and state
  const getButtonContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center space-x-2">
          <Spinner size="sm" />
          <span>Processing...</span>
        </div>
      );
    }

    if (!tokenIn) {
      return 'Select a token';
    }

    if (!tokenOut) {
      return 'Select a token';
    }

    if (!amountIn || parseFloat(amountIn) <= 0) {
      return 'Enter an amount';
    }

    if (optimizationEnabled) {
      return 'Swap with Optimization';
    }

    return 'Swap';
  };

  const getButtonVariant = () => {
    if (disabled || isLoading) {
      return 'disabled';
    }

    if (optimizationEnabled) {
      return 'gradient';
    }

    return 'primary';
  };

  const isButtonDisabled = disabled || isLoading || !tokenIn || !tokenOut || !amountIn || parseFloat(amountIn) <= 0;

  return (
    <Button
      onClick={onSwap}
      disabled={isButtonDisabled}
      variant={getButtonVariant()}
      size="lg"
      className="w-full mt-4"
    >
      {getButtonContent()}
    </Button>
  );
};