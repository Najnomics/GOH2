import React from 'react';
import { motion } from 'framer-motion';
import { 
  ExclamationTriangleIcon, 
  InformationCircleIcon, 
  XCircleIcon 
} from '@heroicons/react/24/outline';
import { formatPercentage } from '../../utils/formatters';

interface PriceImpactProps {
  impact: number;
  severity: 'low' | 'medium' | 'high' | 'very-high';
  className?: string;
}

export const PriceImpact: React.FC<PriceImpactProps> = ({
  impact,
  severity,
  className = '',
}) => {
  const getSeverityConfig = () => {
    switch (severity) {
      case 'low':
        return {
          bgColor: 'bg-green-50 dark:bg-green-900/20',
          borderColor: 'border-green-200 dark:border-green-800',
          textColor: 'text-green-800 dark:text-green-200',
          iconColor: 'text-green-600 dark:text-green-400',
          icon: InformationCircleIcon,
          label: 'Low Impact',
          description: 'Minimal price impact on your trade',
        };
      case 'medium':
        return {
          bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
          borderColor: 'border-yellow-200 dark:border-yellow-800',
          textColor: 'text-yellow-800 dark:text-yellow-200',
          iconColor: 'text-yellow-600 dark:text-yellow-400',
          icon: ExclamationTriangleIcon,
          label: 'Medium Impact',
          description: 'Moderate price impact - consider reducing amount',
        };
      case 'high':
        return {
          bgColor: 'bg-orange-50 dark:bg-orange-900/20',
          borderColor: 'border-orange-200 dark:border-orange-800',
          textColor: 'text-orange-800 dark:text-orange-200',
          iconColor: 'text-orange-600 dark:text-orange-400',
          icon: ExclamationTriangleIcon,
          label: 'High Impact',
          description: 'High price impact - proceed with caution',
        };
      case 'very-high':
        return {
          bgColor: 'bg-red-50 dark:bg-red-900/20',
          borderColor: 'border-red-200 dark:border-red-800',
          textColor: 'text-red-800 dark:text-red-200',
          iconColor: 'text-red-600 dark:text-red-400',
          icon: XCircleIcon,
          label: 'Very High Impact',
          description: 'Extremely high price impact - not recommended',
        };
      default:
        return {
          bgColor: 'bg-gray-50 dark:bg-gray-800',
          borderColor: 'border-gray-200 dark:border-gray-700',
          textColor: 'text-gray-800 dark:text-gray-200',
          iconColor: 'text-gray-600 dark:text-gray-400',
          icon: InformationCircleIcon,
          label: 'Price Impact',
          description: 'Price impact analysis',
        };
    }
  };

  const config = getSeverityConfig();
  const Icon = config.icon;

  return (
    <motion.div
      className={`price-impact p-3 rounded-lg border ${config.bgColor} ${config.borderColor} ${className}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
    >
      <div className="flex items-center space-x-3">
        <Icon className={`h-5 w-5 ${config.iconColor}`} />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className={`font-medium ${config.textColor}`}>
              {config.label}
            </span>
            <span className={`font-semibold ${config.textColor}`}>
              {formatPercentage(impact)}
            </span>
          </div>
          <p className={`text-sm ${config.textColor} opacity-75 mt-1`}>
            {config.description}
          </p>
        </div>
      </div>

      {/* Impact Visualization */}
      <div className="mt-3">
        <div className="flex justify-between items-center mb-1">
          <span className={`text-xs ${config.textColor} opacity-75`}>
            Impact Level
          </span>
          <span className={`text-xs ${config.textColor} opacity-75`}>
            {impact.toFixed(2)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className={`h-2 rounded-full ${
              severity === 'low' ? 'bg-green-500' :
              severity === 'medium' ? 'bg-yellow-500' :
              severity === 'high' ? 'bg-orange-500' :
              'bg-red-500'
            }`}
            style={{ width: `${Math.min(impact * 20, 100)}%` }}
          />
        </div>
      </div>
    </motion.div>
  );
};