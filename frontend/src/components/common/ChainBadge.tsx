import React from 'react';
import { SUPPORTED_CHAINS } from '../../types/chain';

interface ChainBadgeProps {
  chainId: number;
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
  className?: string;
}

export const ChainBadge: React.FC<ChainBadgeProps> = ({
  chainId,
  size = 'md',
  showName = false,
  className = ''
}) => {
  const chain = SUPPORTED_CHAINS[chainId];
  
  if (!chain) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div className="w-6 h-6 bg-gray-300 rounded-full" />
        {showName && <span className="text-sm text-gray-500">Unknown Chain</span>}
      </div>
    );
  }

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <img
        src={chain.logoURI || `/icons/chains/${chain.name.toLowerCase()}.svg`}
        alt={chain.name}
        className={`${sizeClasses[size]} rounded-full`}
        onError={(e) => {
          (e.target as HTMLImageElement).src = '/icons/chains/generic.svg';
        }}
      />
      {showName && (
        <span className={`font-medium text-gray-900 ${textSizeClasses[size]}`}>
          {chain.name}
        </span>
      )}
    </div>
  );
};