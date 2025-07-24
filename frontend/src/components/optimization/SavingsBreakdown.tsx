import React from 'react';
import { CostBreakdown } from '../../types/optimization';

interface SavingsBreakdownProps {
  breakdown: CostBreakdown;
}

export const SavingsBreakdown: React.FC<SavingsBreakdownProps> = ({ breakdown }) => {
  return (
    <div className="savings-breakdown">
      <h4 className="text-sm font-medium text-gray-700 mb-3">Cost Breakdown</h4>
      
      <div className="space-y-2">
        <div className="cost-item">
          <span className="cost-label">Original Gas Cost</span>
          <span className="cost-value">${breakdown.original_gas_cost.toFixed(2)}</span>
        </div>
        
        <div className="cost-item">
          <span className="cost-label">Optimized Gas Cost</span>
          <span className="cost-value">${breakdown.optimized_gas_cost.toFixed(2)}</span>
        </div>
        
        {breakdown.bridge_fee > 0 && (
          <div className="cost-item">
            <span className="cost-label">Bridge Fee</span>
            <span className="cost-value">${breakdown.bridge_fee.toFixed(2)}</span>
          </div>
        )}
        
        {breakdown.slippage_cost && (
          <div className="cost-item">
            <span className="cost-label">Est. Slippage</span>
            <span className="cost-value">${breakdown.slippage_cost.toFixed(2)}</span>
          </div>
        )}

        {breakdown.mev_protection_fee && (
          <div className="cost-item">
            <span className="cost-label">MEV Protection</span>
            <span className="cost-value">${breakdown.mev_protection_fee.toFixed(2)}</span>
          </div>
        )}
        
        <div className="border-t border-gray-200 pt-2 mt-2">
          <div className="cost-item">
            <span className="cost-label font-medium">Original Total</span>
            <span className="cost-value font-medium">${breakdown.total_original.toFixed(2)}</span>
          </div>
          
          <div className="cost-item">
            <span className="cost-label font-medium">Optimized Total</span>
            <span className="cost-value font-medium">${breakdown.total_optimized.toFixed(2)}</span>
          </div>
          
          <div className="cost-item">
            <span className="cost-label font-medium text-green-600">Total Savings</span>
            <span className="cost-savings font-semibold">
              ${(breakdown.total_original - breakdown.total_optimized).toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};