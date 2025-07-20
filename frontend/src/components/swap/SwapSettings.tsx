import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { motion } from 'framer-motion';
import { 
  CogIcon, 
  ShieldCheckIcon, 
  ClockIcon, 
  FireIcon 
} from '@heroicons/react/24/outline';
import { formatPercentage } from '../../utils/formatters';

interface SwapSettingsProps {
  onClose: () => void;
  settings: {
    slippage: number;
    deadline: number;
    gasPrice: 'slow' | 'standard' | 'fast' | 'custom';
    customGasPrice?: string;
    enableMEVProtection: boolean;
  };
  onSettingsChange?: (settings: any) => void;
}

export const SwapSettings: React.FC<SwapSettingsProps> = ({
  onClose,
  settings,
  onSettingsChange,
}) => {
  const [localSettings, setLocalSettings] = useState(settings);

  const handleSlippageChange = (slippage: number) => {
    setLocalSettings(prev => ({ ...prev, slippage }));
  };

  const handleDeadlineChange = (deadline: number) => {
    setLocalSettings(prev => ({ ...prev, deadline }));
  };

  const handleGasPriceChange = (gasPrice: string) => {
    setLocalSettings(prev => ({ ...prev, gasPrice: gasPrice as any }));
  };

  const handleMEVProtectionToggle = () => {
    setLocalSettings(prev => ({ ...prev, enableMEVProtection: !prev.enableMEVProtection }));
  };

  const handleSave = () => {
    onSettingsChange?.(localSettings);
    onClose();
  };

  const slippageOptions = [0.1, 0.5, 1.0, 2.0, 5.0];
  const deadlineOptions = [10, 20, 30, 60, 120];
  const gasPriceOptions = [
    { value: 'slow', label: 'Slow', icon: ClockIcon },
    { value: 'standard', label: 'Standard', icon: CogIcon },
    { value: 'fast', label: 'Fast', icon: FireIcon },
  ];

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Swap Settings"
      className="max-w-md"
    >
      <div className="swap-settings space-y-6">
        {/* Slippage Tolerance */}
        <div className="setting-section">
          <div className="setting-header mb-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Slippage Tolerance
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Maximum price movement you're willing to accept
            </p>
          </div>
          
          <div className="slippage-options grid grid-cols-3 gap-2">
            {slippageOptions.map((option) => (
              <motion.button
                key={option}
                className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                  localSettings.slippage === option
                    ? 'border-primary-blue bg-primary-blue text-white'
                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
                onClick={() => handleSlippageChange(option)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {formatPercentage(option)}
              </motion.button>
            ))}
          </div>
          
          <div className="custom-slippage mt-3">
            <div className="relative">
              <input
                type="number"
                min="0"
                max="50"
                step="0.1"
                value={localSettings.slippage}
                onChange={(e) => handleSlippageChange(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                placeholder="Custom"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
                %
              </span>
            </div>
          </div>
        </div>

        {/* Transaction Deadline */}
        <div className="setting-section">
          <div className="setting-header mb-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Transaction Deadline
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Transaction will revert if not completed within this time
            </p>
          </div>
          
          <div className="deadline-options grid grid-cols-3 gap-2">
            {deadlineOptions.map((option) => (
              <motion.button
                key={option}
                className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                  localSettings.deadline === option
                    ? 'border-primary-blue bg-primary-blue text-white'
                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
                onClick={() => handleDeadlineChange(option)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {option}m
              </motion.button>
            ))}
          </div>
        </div>

        {/* Gas Price */}
        <div className="setting-section">
          <div className="setting-header mb-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Gas Price
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Higher gas price means faster transaction confirmation
            </p>
          </div>
          
          <div className="gas-price-options space-y-2">
            {gasPriceOptions.map((option) => {
              const Icon = option.icon;
              return (
                <motion.button
                  key={option.value}
                  className={`w-full p-3 rounded-lg border text-left transition-colors ${
                    localSettings.gasPrice === option.value
                      ? 'border-primary-blue bg-primary-blue text-white'
                      : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => handleGasPriceChange(option.value)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{option.label}</span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* MEV Protection */}
        <div className="setting-section">
          <div className="setting-header mb-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              MEV Protection
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Protect against sandwich attacks and other MEV exploitation
            </p>
          </div>
          
          <motion.button
            className={`w-full p-4 rounded-lg border transition-colors ${
              localSettings.enableMEVProtection
                ? 'border-green-300 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200'
                : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
            onClick={handleMEVProtectionToggle}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <ShieldCheckIcon className="h-5 w-5" />
                <span className="font-medium">
                  {localSettings.enableMEVProtection ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <div className={`w-12 h-6 rounded-full p-1 transition-colors ${
                localSettings.enableMEVProtection ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
              }`}>
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  localSettings.enableMEVProtection ? 'translate-x-6' : 'translate-x-0'
                }`} />
              </div>
            </div>
          </motion.button>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons flex space-x-3 pt-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-3 bg-primary-blue hover:bg-primary-blueHover text-white rounded-lg transition-colors"
          >
            Save Settings
          </button>
        </div>
      </div>
    </Modal>
  );
};