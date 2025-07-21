import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaBolt, 
  FaChevronDown, 
  FaChevronUp, 
  FaClock, 
  FaChartLine,
  FaExternalLinkAlt 
} from 'react-icons/fa';
import Card from '../common/Card';
import Button from '../common/Button';
import { SUPPORTED_CHAINS, FORMATTERS } from '../../utils/constants';

const GasOptimizationPanel = ({
  quote,
  isLoading = false,
  preferences = {},
  onPreferencesUpdate = () => {},
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (isLoading) {
    return (
      <Card className={`p-4 ${className}`}>
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-purple-500 border-t-transparent"></div>
          <span className="text-gray-600">Analyzing gas costs across chains...</span>
        </div>
      </Card>
    );
  }

  if (!quote) {
    return null;
  }

  if (!quote.shouldOptimize) {
    return (
      <Card className={`p-4 bg-blue-50 border-blue-200 ${className}`}>
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <FaChartLine className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <div className="font-medium text-blue-900">Local execution recommended</div>
            <div className="text-sm text-blue-700">
              Current chain offers the best rates (savings below {preferences.minSavingsThresholdBPS / 100}% threshold)
            </div>
          </div>
        </div>
      </Card>
    );
  }

  const originalChain = SUPPORTED_CHAINS[quote.originalChainId];
  const optimizedChain = SUPPORTED_CHAINS[quote.optimizedChainId];

  return (
    <Card className={`overflow-hidden bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 ${className}`}>
      {/* Header */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
              <FaBolt className="h-4 w-4 text-white" />
            </div>
            <div>
              <div className="font-semibold text-green-900">
                Save {FORMATTERS.currency(quote.savingsUSD)}
              </div>
              <div className="text-sm text-green-700">
                {FORMATTERS.percentage(quote.savingsPercentage)} savings available
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="text-right">
              <div className="flex items-center space-x-2 text-sm text-green-700">
                <span className="text-lg">{optimizedChain?.icon}</span>
                <span>{optimizedChain?.name}</span>
              </div>
              <div className="text-xs text-green-600">Optimal Chain</div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2"
            >
              {isExpanded ? (
                <FaChevronUp className="h-4 w-4" />
              ) : (
                <FaChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-green-200"
          >
            <div className="p-4 space-y-4">
              {/* Cost Breakdown */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Cost Breakdown</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-3">
                    <div className="text-sm text-gray-600">Original ({originalChain?.name})</div>
                    <div className="font-semibold text-gray-900">
                      {FORMATTERS.currency(quote.originalCostUSD)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Gas: {FORMATTERS.currency(quote.costBreakdown?.original_gas_cost || 0)}
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-3">
                    <div className="text-sm text-gray-600">Optimized ({optimizedChain?.name})</div>
                    <div className="font-semibold text-green-600">
                      {FORMATTERS.currency(quote.optimizedCostUSD)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Gas: {FORMATTERS.currency(quote.costBreakdown?.optimized_gas_cost || 0)}
                      {quote.costBreakdown?.bridge_fee > 0 && (
                        <> + Bridge: {FORMATTERS.currency(quote.costBreakdown.bridge_fee)}</>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Execution Details */}
              <div className="flex items-center justify-between bg-white rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <FaClock className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Estimated time</span>
                </div>
                <span className="font-medium">
                  ~{FORMATTERS.time(quote.estimatedBridgeTime)}
                </span>
              </div>

              {/* Bridge Info */}
              {quote.requiresBridge && (
                <div className="bg-white rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Powered by</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">Across Protocol</span>
                      <FaExternalLinkAlt className="h-3 w-3 text-gray-400" />
                    </div>
                  </div>
                </div>
              )}

              {/* Chain Comparison */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Chain Comparison</h4>
                <div className="space-y-2">
                  {Object.entries(SUPPORTED_CHAINS).map(([chainId, chain]) => {
                    const isOriginal = parseInt(chainId) === quote.originalChainId;
                    const isOptimal = parseInt(chainId) === quote.optimizedChainId;
                    
                    return (
                      <div
                        key={chainId}
                        className={`flex items-center justify-between p-2 rounded-lg ${
                          isOptimal ? 'bg-green-100 border border-green-200' : 'bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{chain.icon}</span>
                          <span className="text-sm font-medium">{chain.name}</span>
                          {isOptimal && (
                            <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full">
                              Optimal
                            </span>
                          )}
                        </div>
                        <div className="text-sm font-medium">
                          {isOriginal ? FORMATTERS.currency(quote.originalCostUSD) : 
                           isOptimal ? FORMATTERS.currency(quote.optimizedCostUSD) : 
                           '–'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

export default GasOptimizationPanel;