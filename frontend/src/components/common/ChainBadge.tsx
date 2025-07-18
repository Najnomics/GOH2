import React from 'react';
import { getChainInfo, getChainColor } from '../../utils/helpers';
import { motion } from 'framer-motion';

interface ChainBadgeProps {
  chainId: number;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showName?: boolean;
  className?: string;
}

export const ChainBadge: React.FC<ChainBadgeProps> = ({
  chainId,
  size = 'md',
  showName = true,
  className = '',
}) => {
  const chainInfo = getChainInfo(chainId);
  const color = getChainColor(chainId);

  if (!chainInfo) {
    return (
      <div className={`inline-flex items-center px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs ${className}`}>
        Chain {chainId}
      </div>
    );
  }

  const sizeClasses = {
    xs: 'text-xs px-2 py-1',
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2',
  };

  const iconSizes = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  return (
    <motion.div
      className={`inline-flex items-center space-x-1 rounded-full border ${sizeClasses[size]} ${className}`}
      style={{
        backgroundColor: `${color}20`,
        borderColor: `${color}40`,
        color: color,
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {chainInfo.logoURI && (
        <img
          src={chainInfo.logoURI}
          alt={chainInfo.name}
          className={`${iconSizes[size]} rounded-full`}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      )}
      {showName && (
        <span className="font-medium">
          {chainInfo.name}
        </span>
      )}
    </motion.div>
  );
};