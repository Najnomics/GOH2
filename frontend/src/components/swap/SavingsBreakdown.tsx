import React from 'react';
import { CostBreakdown } from '../../types/optimization';
import { formatCurrency } from '../../utils/formatters';
import { motion } from 'framer-motion';
import { 
  FireIcon, 
  ArrowsRightLeftIcon, 
  ShieldCheckIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline';

interface SavingsBreakdownProps {
  breakdown: CostBreakdown;
  originalCost: number;
  optimizedCost: number;
  showUSD?: boolean;
  className?: string;
}

export const SavingsBreakdown: React.FC<SavingsBreakdownProps> = ({
  breakdown,
  originalCost,
  optimizedCost,
  showUSD = true,
  className = '',
}) => {
  const savings = originalCost - optimizedCost;
  const savingsPercent = originalCost > 0 ? (savings / originalCost) * 100 : 0;

  const costItems = [
    {
      label: 'Gas Cost',
      value: breakdown.gasCostUSD,
      icon: FireIcon,
      color: 'text-orange-600',
    },
    {
      label: 'Bridge Fee',
      value: breakdown.bridgeFeeUSD,
      icon: ArrowsRightLeftIcon,
      color: 'text-blue-600',
    },
    {
      label: 'Slippage',
      value: breakdown.slippageCostUSD,
      icon: ShieldCheckIcon,
      color: 'text-yellow-600',
    },
  ];

  if (breakdown.mevProtectionFee && breakdown.mevProtectionFee > 0) {
    costItems.push({
      label: 'MEV Protection',
      value: breakdown.mevProtectionFee,
      icon: ShieldCheckIcon,
      color: 'text-green-600',
    });
  }

  return (
    <div className={`savings-breakdown ${className}`}>
      <div className="breakdown-header mb-4">
        <h4 className="text-lg font-semibold text-text-primary dark:text-white">
          Cost Breakdown
        </h4>
        <p className="text-sm text-text-secondary dark:text-gray-400">
          Detailed analysis of optimization savings
        </p>
      </div>

      <div className="cost-comparison mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-text-secondary dark:text-gray-400">
            Original Cost
          </span>
          <span className="font-semibold text-text-primary dark:text-white">
            {formatCurrency(originalCost)}
          </span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-text-secondary dark:text-gray-400">
            Optimized Cost
          </span>
          <span className="font-semibold text-text-primary dark:text-white">
            {formatCurrency(optimizedCost)}
          </span>
        </div>
        <div className="flex justify-between items-center pt-2 border-t border-border-primary dark:border-gray-700">
          <span className="text-sm font-medium text-green-600 dark:text-green-400">
            Total Savings
          </span>
          <span className="font-bold text-green-600 dark:text-green-400">
            {formatCurrency(savings)} ({savingsPercent.toFixed(1)}%)
          </span>
        </div>
      </div>

      <div className="cost-items space-y-3">
        {costItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.label}
              className="cost-item flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`h-5 w-5 ${item.color}`} />
                <span className="text-sm font-medium text-text-primary dark:text-white">
                  {item.label}
                </span>
              </div>
              <span className="text-sm font-semibold text-text-primary dark:text-white">
                {formatCurrency(item.value)}
              </span>
            </motion.div>
          );
        })}
      </div>

      <div className="total-cost mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BanknotesIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <span className="font-medium text-blue-800 dark:text-blue-200">
              Total Cost
            </span>
          </div>
          <span className="font-bold text-blue-800 dark:text-blue-200">
            {formatCurrency(breakdown.totalCostUSD)}
          </span>
        </div>
      </div>
    </div>
  );
};