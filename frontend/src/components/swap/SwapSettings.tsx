import React from 'react';
import { SwapSettings as SwapSettingsType } from '../../types/swap';
import { CogIcon } from '@heroicons/react/24/outline';

interface SwapSettingsProps {
  settings: SwapSettingsType;
  onSettingsChange: (settings: SwapSettingsType) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const SwapSettings: React.FC<SwapSettingsProps> = ({
  settings,
  onSettingsChange,
  isOpen,
  onToggle
}) => {
  const handleSlippageChange = (value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 50) {
      onSettingsChange({
        ...settings,
        slippageTolerance: numValue
      });
    }
  };

  const handleDeadlineChange = (value: string) => {
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue > 0 && numValue <= 4320) { // Max 3 days
      onSettingsChange({
        ...settings,
        deadline: numValue
      });
    }
  };

  const presetSlippages = [0.1, 0.5, 1.0];

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        title="Swap Settings"
      >
        <CogIcon className="w-5 h-5 text-gray-600" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 p-4 z-50">
          <div className="space-y-4">
            {/* Slippage Tolerance */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Slippage Tolerance
              </label>
              <div className="flex space-x-2 mb-3">
                {presetSlippages.map((preset) => (
                  <button
                    key={preset}
                    onClick={() => handleSlippageChange(preset.toString())}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      settings.slippageTolerance === preset
                        ? 'bg-primary-pink text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {preset}%
                  </button>
                ))}
              </div>
              <div className="relative">
                <input
                  type="number"
                  value={settings.slippageTolerance}
                  onChange={(e) => handleSlippageChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-pink focus:border-transparent"
                  placeholder="0.5"
                  min="0"
                  max="50"
                  step="0.1"
                />
                <span className="absolute right-3 top-2 text-gray-500">%</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Your transaction will revert if the price changes unfavorably by more than this percentage.
              </p>
            </div>

            {/* Transaction Deadline */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Transaction Deadline
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={settings.deadline}
                  onChange={(e) => handleDeadlineChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-pink focus:border-transparent"
                  placeholder="30"
                  min="1"
                  max="4320"
                />
                <span className="absolute right-3 top-2 text-gray-500">minutes</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Your transaction will revert if it is pending for more than this period.
              </p>
            </div>

            {/* Expert Mode */}
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Expert Mode
                </label>
                <p className="text-xs text-gray-500">
                  Bypasses confirmation modals and allows high slippage trades.
                </p>
              </div>
              <button
                onClick={() => onSettingsChange({
                  ...settings,
                  expertMode: !settings.expertMode
                })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.expertMode ? 'bg-primary-pink' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.expertMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Infinite Approval */}
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Infinite Approval
                </label>
                <p className="text-xs text-gray-500">
                  Approve unlimited token spending to save gas on future swaps.
                </p>
              </div>
              <button
                onClick={() => onSettingsChange({
                  ...settings,
                  infiniteApproval: !settings.infiniteApproval
                })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.infiniteApproval ? 'bg-primary-pink' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.infiniteApproval ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};