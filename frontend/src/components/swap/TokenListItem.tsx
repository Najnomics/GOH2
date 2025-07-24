import React from 'react';
import { Token } from '../../types/token';
import { useTokens } from '../../hooks/useTokens';

interface TokenListItemProps {
  token: Token;
  onClick: () => void;
  className?: string;
}

export const TokenListItem: React.FC<TokenListItemProps> = ({
  token,
  onClick,
  className = ''
}) => {
  const { getTokenBalance } = useTokens();
  const balance = getTokenBalance(token);

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors ${className}`}
    >
      <div className="flex items-center space-x-3">
        <img
          src={token.logoURI || `/icons/tokens/${token.symbol.toLowerCase()}.svg`}
          alt={token.symbol}
          className="w-8 h-8 rounded-full"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/icons/tokens/generic.svg';
          }}
        />
        <div className="text-left">
          <div className="font-medium text-gray-900">{token.symbol}</div>
          <div className="text-sm text-gray-500">{token.name}</div>
        </div>
      </div>

      <div className="text-right">
        {balance ? (
          <>
            <div className="font-medium text-gray-900">
              {parseFloat(balance.balance).toFixed(6)}
            </div>
            {balance.balanceUSD && (
              <div className="text-sm text-gray-500">
                ${parseFloat(balance.balanceUSD).toFixed(2)}
              </div>
            )}
          </>
        ) : (
          <div className="text-sm text-gray-400">-</div>
        )}
      </div>
    </button>
  );
};