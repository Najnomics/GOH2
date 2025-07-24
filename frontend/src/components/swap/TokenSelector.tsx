import React, { useState } from 'react';
import { Token } from '../../types/token';
import { useTokens } from '../../hooks/useTokens';
import { TokenSearchModal } from './TokenSearchModal';
import { Modal } from '../common/Modal';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface TokenSelectorProps {
  token: Token | null;
  amount: string;
  onTokenSelect: (token: Token) => void;
  onAmountChange?: (amount: string) => void;
  label: string;
  readonly?: boolean;
  showBalance?: boolean;
}

export const TokenSelector: React.FC<TokenSelectorProps> = ({
  token,
  amount,
  onTokenSelect,
  onAmountChange,
  label,
  readonly = false,
  showBalance = false
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { getTokenBalance } = useTokens();

  const balance = showBalance && token ? getTokenBalance(token) : null;

  const handleMaxClick = () => {
    if (balance && onAmountChange) {
      onAmountChange(balance.balance);
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow valid number inputs
    if (/^\d*\.?\d*$/.test(value) || value === '') {
      onAmountChange?.(value);
    }
  };

  return (
    <div className="token-selector">
      <div className="token-selector-header">
        <span className="token-label">{label}</span>
        {balance && (
          <div className="flex items-center space-x-2">
            <span className="token-balance">
              Balance: {balance.formatted}
            </span>
            {showBalance && onAmountChange && (
              <button
                onClick={handleMaxClick}
                className="text-xs bg-primary-pink text-white px-2 py-1 rounded hover:bg-primary-pink-hover transition-colors"
              >
                MAX
              </button>
            )}
          </div>
        )}
      </div>
      
      <div className="token-selector-body">
        <div className="token-input flex-1">
          <input
            type="text"
            value={amount}
            onChange={handleAmountChange}
            placeholder="0.0"
            className="amount-input"
            disabled={readonly}
          />
        </div>
        
        <button 
          className="token-button"
          onClick={() => setIsModalOpen(true)}
        >
          {token ? (
            <>
              <img 
                src={token.logoURI || `/icons/tokens/${token.symbol.toLowerCase()}.svg`}
                alt={token.symbol}
                className="token-logo"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/icons/tokens/generic.svg';
                }}
              />
              <span className="token-symbol">{token.symbol}</span>
            </>
          ) : (
            <span className="select-token-text">Select Token</span>
          )}
          <ChevronDownIcon className="w-4 h-4 ml-1" />
        </button>
      </div>
      
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Select Token"
      >
        <TokenSearchModal
          onTokenSelect={(selectedToken) => {
            onTokenSelect(selectedToken);
            setIsModalOpen(false);
          }}
          excludeToken={token}
        />
      </Modal>
    </div>
  );
};