import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaCog, FaSave, FaUndo } from 'react-icons/fa';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Card from '../common/Card';
import { DEFAULT_USER_PREFERENCES } from '../../utils/constants';

const SwapSettings = ({
  isOpen,
  onClose,
  slippageTolerance,
  onSlippageChange,
  deadlineMinutes,
  onDeadlineChange,
  userPreferences = DEFAULT_USER_PREFERENCES,
  onPreferencesChange
}) => {
  const [localSlippage, setLocalSlippage] = useState(slippageTolerance);
  const [localDeadline, setLocalDeadline] = useState(deadlineMinutes);
  const [localPrefs, setLocalPrefs] = useState(userPreferences);

  const slippagePresets = [0.1, 0.5, 1.0, 3.0];

  const handleSave = () => {
    onSlippageChange(localSlippage);
    onDeadlineChange(localDeadline);
    onPreferencesChange(localPrefs);
    onClose();
  };

  const handleReset = () => {
    setLocalSlippage(0.5);
    setLocalDeadline(30);
    setLocalPrefs(DEFAULT_USER_PREFERENCES);
  };

  const updatePreference = (key, value) => {
    setLocalPrefs(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Swap Settings"
      maxWidth="lg"
    >
      <div className="space-y-6">
        {/* Slippage Tolerance */}
        <Card padding="md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Slippage Tolerance</h3>
          <p className="text-sm text-gray-600 mb-4">
            Your transaction will revert if the price changes unfavorably by more than this percentage.
          </p>
          
          <div className="space-y-4">
            {/* Preset buttons */}
            <div className="flex space-x-2">
              {slippagePresets.map((preset) => (
                <Button
                  key={preset}
                  variant={localSlippage === preset ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setLocalSlippage(preset)}
                >
                  {preset}%
                </Button>
              ))}
            </div>
            
            {/* Custom input */}
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={localSlippage}
                onChange={(e) => setLocalSlippage(parseFloat(e.target.value) || 0)}
                placeholder="0.5"
                step="0.1"
                min="0"
                max="50"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
              />
              <span className="text-gray-500">%</span>
            </div>
          </div>
        </Card>

        {/* Transaction Deadline */}
        <Card padding="md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Transaction Deadline</h3>
          <p className="text-sm text-gray-600 mb-4">
            Your transaction will revert if it is pending for more than this long.
          </p>
          
          <div className="flex items-center space-x-2">
            <input
              type="number"
              value={localDeadline}
              onChange={(e) => setLocalDeadline(parseInt(e.target.value) || 30)}
              placeholder="30"
              min="1"
              max="180"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
            />
            <span className="text-gray-500">minutes</span>
          </div>
        </Card>

        {/* Gas Optimization Settings */}
        <Card padding="md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Gas Optimization</h3>
          
          <div className="space-y-4">
            {/* Enable Cross-Chain Optimization */}
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">Cross-Chain Optimization</div>
                <div className="text-sm text-gray-600">
                  Automatically route swaps to the most cost-effective chain
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={localPrefs.enableCrossChainOptimization}
                  onChange={(e) => updatePreference('enableCrossChainOptimization', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>

            {/* Minimum Savings Threshold */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Savings Threshold ({localPrefs.minSavingsThresholdBPS / 100}%)
              </label>
              <input
                type="range"
                min="50"
                max="2000"
                step="50"
                value={localPrefs.minSavingsThresholdBPS}
                onChange={(e) => updatePreference('minSavingsThresholdBPS', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0.5%</span>
                <span>20%</span>
              </div>
            </div>

            {/* Minimum Absolute Savings */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Absolute Savings (USD)
              </label>
              <input
                type="number"
                value={localPrefs.minAbsoluteSavingsUSD}
                onChange={(e) => updatePreference('minAbsoluteSavingsUSD', parseFloat(e.target.value) || 0)}
                placeholder="10"
                min="0"
                step="1"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
              />
            </div>

            {/* Maximum Bridge Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Bridge Time (minutes)
              </label>
              <input
                type="number"
                value={localPrefs.maxBridgeTimeSeconds / 60}
                onChange={(e) => updatePreference('maxBridgeTimeSeconds', (parseInt(e.target.value) || 30) * 60)}
                placeholder="30"
                min="1"
                max="120"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
              />
            </div>

            {/* USD Display */}
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">USD Display</div>
                <div className="text-sm text-gray-600">
                  Show savings and costs in USD
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={localPrefs.enableUSDDisplay}
                  onChange={(e) => updatePreference('enableUSDDisplay', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-between space-x-4">
          <Button
            variant="outline"
            onClick={handleReset}
            className="flex items-center space-x-2"
          >
            <FaUndo className="h-4 w-4" />
            <span>Reset to Defaults</span>
          </Button>
          
          <div className="flex space-x-2">
            <Button
              variant="secondary"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSave}
              className="flex items-center space-x-2"
            >
              <FaSave className="h-4 w-4" />
              <span>Save Settings</span>
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default SwapSettings;