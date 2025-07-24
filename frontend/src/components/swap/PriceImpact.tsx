import React from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface PriceImpactProps {
  priceImpact: number;
  className?: string;
}

export const PriceImpact: React.FC<PriceImpactProps> = ({ 
  priceImpact, 
  className = '' 
}) => {
  const getSeverity = (impact: number) => {
    if (impact < 1) return 'low';
    if (impact < 3) return 'medium';
    if (impact < 5) return 'high';
    return 'very-high';
  };

  const severity = getSeverity(priceImpact);

  const getStyles = () => {
    switch (severity) {
      case 'low':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'high':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'very-high':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getMessage = () => {
    switch (severity) {
      case 'low':
        return 'Low price impact';
      case 'medium':
        return 'Moderate price impact';
      case 'high':
        return 'High price impact';
      case 'very-high':
        return 'Very high price impact';
      default:
        return 'Price impact';
    }
  };

  if (priceImpact <= 0.1) {
    return null; // Don't show for very low impact
  }

  return (
    <div className={`flex items-center space-x-2 p-3 rounded-lg border ${getStyles()} ${className}`}>
      {(severity === 'high' || severity === 'very-high') && (
        <ExclamationTriangleIcon className="w-5 h-5 flex-shrink-0" />
      )}
      <div className="flex-1">
        <div className="text-sm font-medium">
          {getMessage()}: {priceImpact.toFixed(2)}%
        </div>
        {severity === 'very-high' && (
          <div className="text-xs mt-1">
            This swap has a very high price impact. Consider splitting into smaller trades.
          </div>
        )}
      </div>
    </div>
  );
};