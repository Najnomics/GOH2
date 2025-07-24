import React from 'react';
import { BridgeInfo } from '../../types/optimization';
import { CheckCircleIcon, ClockIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

interface BridgeDetailsProps {
  bridgeInfo: BridgeInfo;
  estimatedTime: number;
}

export const BridgeDetails: React.FC<BridgeDetailsProps> = ({
  bridgeInfo,
  estimatedTime
}) => {
  const getStepIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="w-4 h-4 text-green-500" />;
      case 'in-progress':
        return <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent animate-spin rounded-full" />;
      default:
        return <ClockIcon className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="bridge-details p-4 bg-blue-50 rounded-lg border border-blue-200">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium text-blue-900">Cross-Chain Bridge</h4>
        <span className="text-sm font-medium text-blue-700">
          {bridgeInfo.protocol}
        </span>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-blue-700">Bridge Fee</span>
          <span className="font-medium text-blue-900">${bridgeInfo.feeUSD.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-blue-700">Estimated Time</span>
          <span className="font-medium text-blue-900">
            ~{Math.floor(bridgeInfo.estimatedTime / 60)}m {bridgeInfo.estimatedTime % 60}s
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <h5 className="text-xs font-medium text-blue-800 uppercase tracking-wide">
          Execution Steps
        </h5>
        
        {bridgeInfo.steps.map((step, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-0.5">
              {getStepIcon(step.status)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm text-blue-900">{step.description}</div>
              <div className="text-xs text-blue-600">
                ~{Math.floor(step.estimatedTime / 60)}m {step.estimatedTime % 60}s
              </div>
            </div>
            {index < bridgeInfo.steps.length - 1 && (
              <ArrowRightIcon className="w-4 h-4 text-blue-400 mt-0.5" />
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-blue-100 rounded-lg">
        <div className="flex items-start space-x-2">
          <div className="flex-shrink-0">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
          </div>
          <div className="text-xs text-blue-700">
            <p className="font-medium mb-1">Bridge Safety</p>
            <p>
              This bridge is secured by Across Protocol's optimistic security model with 
              fast withdrawals and dispute resolution.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};