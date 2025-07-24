import React from 'react';
import { ChainComparison as ChainComparisonType } from '../../types/optimization';
import { ChainBadge } from '../common/ChainBadge';

interface ChainComparisonProps {
  originalChain: ChainComparisonType;
  optimizedChain: ChainComparisonType;
}

export const ChainComparison: React.FC<ChainComparisonProps> = ({
  originalChain,
  optimizedChain
}) => {
  const chains = [originalChain, optimizedChain];

  return (
    <div className="chain-comparison">
      <h4 className="text-sm font-medium text-gray-700 mb-3">Chain Comparison</h4>
      
      <div className="space-y-2">
        {chains.map((chain) => (
          <div 
            key={chain.chainId} 
            className={`chain-comparison-item ${
              chain.isOptimal ? 'ring-2 ring-green-200 bg-green-50' : ''
            }`}
          >
            <div className="chain-info">
              <ChainBadge chainId={chain.chainId} />
              <div>
                <div className="font-medium text-sm">{chain.chainName}</div>
                <div className="text-xs text-gray-500">
                  ~{Math.floor(chain.executionTime / 60)}m {chain.executionTime % 60}s
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="chain-cost">${chain.totalCostUSD.toFixed(2)}</div>
              {chain.isOptimal && chain.savingsUSD && (
                <div className="text-xs text-green-600 font-medium">
                  Save ${chain.savingsUSD.toFixed(2)} ({chain.savingsPercentage?.toFixed(1)}%)
                </div>
              )}
            </div>
            
            {chain.isOptimal && (
              <div className="absolute top-2 right-2">
                <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  Optimal
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};