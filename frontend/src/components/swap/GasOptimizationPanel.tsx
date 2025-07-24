import React from 'react';
import { OptimizationQuote, UserPreferences } from '../../types/optimization';
import { SavingsBreakdown } from './SavingsBreakdown';
import { ChainComparison } from './ChainComparison';
import { BridgeDetails } from './BridgeDetails';
import { ChainBadge } from '../common/ChainBadge';
import { Spinner } from '../common/Spinner';
import { ClockIcon } from '@heroicons/react/24/outline';
import '../../styles/components/optimization.css';

interface GasOptimizationPanelProps {
  quote: OptimizationQuote;
  isLoading: boolean;
  preferences: UserPreferences;
}

export const GasOptimizationPanel: React.FC<GasOptimizationPanelProps> = ({
  quote,
  isLoading,
  preferences
}) => {
  if (isLoading) {
    return (
      <div className="optimization-panel loading">
        <div className="optimization-header">
          <Spinner size="sm" />
          <span>Analyzing gas costs...</span>
        </div>
      </div>
    );
  }

  if (!quote.should_optimize) {
    return null;
  }

  const getChainName = (chainId: number): string => {
    const chainNames: Record<number, string> = {
      1: 'Ethereum',
      42161: 'Arbitrum',
      10: 'Optimism',
      137: 'Polygon',
      8453: 'Base',
    };
    return chainNames[chainId] || `Chain ${chainId}`;
  };

  return (
    <div className="optimization-panel animate-slide-in">
      <div className="optimization-header">
        <div className="savings-highlight">
          <span className="savings-icon">💰</span>
          <span className="savings-text">
            Save ${quote.savings_usd.toFixed(2)} 
            ({quote.savings_percentage.toFixed(1)}%)
          </span>
        </div>
        <div className="optimal-chain">
          <ChainBadge chainId={quote.optimized_chain_id} />
          <span>Optimal Chain</span>
        </div>
      </div>
      
      <div className="optimization-body">
        <SavingsBreakdown breakdown={quote.cost_breakdown} />
        
        <div className="optimization-details">
          <ChainComparison 
            originalChain={{
              chainId: quote.original_chain_id,
              chainName: getChainName(quote.original_chain_id),
              gasCostUSD: quote.cost_breakdown.original_gas_cost,
              bridgeFeeUSD: 0,
              totalCostUSD: quote.original_cost_usd,
              executionTime: 30,
              isOptimal: false
            }}
            optimizedChain={{
              chainId: quote.optimized_chain_id,
              chainName: getChainName(quote.optimized_chain_id),
              gasCostUSD: quote.cost_breakdown.optimized_gas_cost,
              bridgeFeeUSD: quote.cost_breakdown.bridge_fee,
              totalCostUSD: quote.optimized_cost_usd,
              executionTime: quote.estimated_bridge_time,
              isOptimal: true,
              savingsUSD: quote.savings_usd,
              savingsPercentage: quote.savings_percentage
            }}
          />
          
          {quote.optimized_chain_id !== quote.original_chain_id && (
            <BridgeDetails 
              bridgeInfo={{
                protocol: 'Across Protocol',
                estimatedTime: quote.estimated_bridge_time,
                fee: quote.cost_breakdown.bridge_fee,
                feeUSD: quote.cost_breakdown.bridge_fee,
                steps: [
                  {
                    type: 'bridge',
                    description: `Bridge tokens to ${getChainName(quote.optimized_chain_id)}`,
                    estimatedTime: Math.floor(quote.estimated_bridge_time * 0.6),
                    status: 'pending'
                  },
                  {
                    type: 'swap',
                    description: `Execute swap on ${getChainName(quote.optimized_chain_id)}`,
                    estimatedTime: Math.floor(quote.estimated_bridge_time * 0.2),
                    status: 'pending'
                  },
                  {
                    type: 'bridge',
                    description: 'Bridge tokens back (if needed)',
                    estimatedTime: Math.floor(quote.estimated_bridge_time * 0.2),
                    status: 'pending'
                  }
                ]
              }}
              estimatedTime={quote.estimated_bridge_time}
            />
          )}
        </div>
      </div>
      
      <div className="optimization-footer">
        <div className="execution-time">
          <ClockIcon className="w-4 h-4" />
          <span>~{Math.floor(quote.estimated_bridge_time / 60)}m {(quote.estimated_bridge_time % 60)}s execution</span>
        </div>
        <div className="bridge-provider">
          <span>Powered by</span>
          <span className="font-semibold text-primary-blue ml-1">Across Protocol</span>
        </div>
      </div>
    </div>
  );
};