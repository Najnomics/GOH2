import React from 'react';
import { BridgeInfo } from '../../types/optimization';
import { motion } from 'framer-motion';
import { 
  ArrowsRightLeftIcon, 
  ClockIcon, 
  CheckBadgeIcon,
  CurrencyDollarIcon 
} from '@heroicons/react/24/outline';
import { formatCurrency, formatTime, formatPercentage } from '../../utils/formatters';

interface BridgeDetailsProps {
  bridgeInfo: BridgeInfo;
  estimatedTime: number;
  className?: string;
}

export const BridgeDetails: React.FC<BridgeDetailsProps> = ({
  bridgeInfo,
  estimatedTime,
  className = '',
}) => {
  return (
    <motion.div
      className={`bridge-details ${className}`}
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
    >
      <div className="bridge-header mb-4">
        <h4 className="text-lg font-semibold text-text-primary dark:text-white">
          Bridge Details
        </h4>
        <p className="text-sm text-text-secondary dark:text-gray-400">
          Cross-chain transaction information
        </p>
      </div>

      <div className="bridge-info-grid space-y-4">
        {/* Provider */}
        <div className="provider-info p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ArrowsRightLeftIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <span className="font-medium text-text-primary dark:text-white">
                {bridgeInfo.provider}
              </span>
            </div>
            <div className="success-rate flex items-center space-x-1">
              <CheckBadgeIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
              <span className="text-sm text-green-600 dark:text-green-400">
                {formatPercentage(bridgeInfo.success_rate * 100)} success
              </span>
            </div>
          </div>
        </div>

        {/* Route */}
        <div className="route-info p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-text-primary dark:text-white">
              Bridge Route
            </span>
          </div>
          <div className="route-path flex items-center space-x-2">
            {bridgeInfo.route.map((step, index) => (
              <React.Fragment key={index}>
                <span className="text-sm text-text-secondary dark:text-gray-400">
                  {step}
                </span>
                {index < bridgeInfo.route.length - 1 && (
                  <ArrowsRightLeftIcon className="h-4 w-4 text-text-secondary dark:text-gray-400" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Timing */}
        <div className="timing-info p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ClockIcon className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              <span className="font-medium text-text-primary dark:text-white">
                Estimated Time
              </span>
            </div>
            <span className="text-sm text-text-primary dark:text-white">
              {formatTime(estimatedTime)}
            </span>
          </div>
          <div className="timing-breakdown mt-2 text-sm text-text-secondary dark:text-gray-400">
            <div className="flex justify-between">
              <span>Bridge time:</span>
              <span>{formatTime(bridgeInfo.estimatedTime)}</span>
            </div>
            <div className="flex justify-between">
              <span>Swap execution:</span>
              <span>{formatTime(estimatedTime - bridgeInfo.estimatedTime)}</span>
            </div>
          </div>
        </div>

        {/* Fees */}
        <div className="fees-info p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CurrencyDollarIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
              <span className="font-medium text-text-primary dark:text-white">
                Bridge Fee
              </span>
            </div>
            <span className="text-sm text-text-primary dark:text-white">
              {formatCurrency(bridgeInfo.feeUSD)}
            </span>
          </div>
          <div className="fee-breakdown mt-2 text-sm text-text-secondary dark:text-gray-400">
            <div className="flex justify-between">
              <span>Base fee:</span>
              <span>{formatCurrency(bridgeInfo.feeUSD * 0.7)}</span>
            </div>
            <div className="flex justify-between">
              <span>Variable fee:</span>
              <span>{formatCurrency(bridgeInfo.feeUSD * 0.3)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="bridge-progress mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
            Bridge Progress
          </span>
          <span className="text-sm text-blue-600 dark:text-blue-400">
            Ready to execute
          </span>
        </div>
        <div className="progress-bar w-full bg-blue-200 dark:bg-blue-900/40 rounded-full h-2">
          <div className="bg-blue-500 h-2 rounded-full" style={{ width: '100%' }} />
        </div>
      </div>
    </motion.div>
  );
};