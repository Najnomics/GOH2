import React from 'react';
import { motion } from 'framer-motion';
import SwapInterface from '../components/swap/SwapInterface';
import Layout from '../components/common/Layout';
import { FaBolt, FaChartLine, FaClock } from 'react-icons/fa';

const FeatureCard = ({ icon: Icon, title, description }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
  >
    <div className="flex items-center space-x-3 mb-3">
      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
        <Icon className="h-5 w-5 text-white" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
    </div>
    <p className="text-gray-600">{description}</p>
  </motion.div>
);

const Swap = () => {
  const features = [
    {
      icon: FaBolt,
      title: 'Instant Optimization',
      description: 'Real-time analysis across 5+ chains to find the lowest gas costs automatically.'
    },
    {
      icon: FaChartLine,
      title: 'Up to 97% Savings',
      description: 'Significant cost reductions by routing swaps to the most efficient blockchain.'
    },
    {
      icon: FaClock,
      title: 'Fast Execution',
      description: 'Cross-chain swaps completed in minutes with Across Protocol integration.'
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl sm:text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-6">
              Smart Gas Optimization
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Revolutionize your DeFi experience with intelligent cross-chain routing. 
              Save up to 97% on gas fees by automatically finding the most cost-effective blockchain for your swaps.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-12 items-start">
            {/* Swap Interface */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-1"
            >
              <SwapInterface />
            </motion.div>

            {/* Features and Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="lg:col-span-2 space-y-8"
            >
              {/* Features Grid */}
              <div className="grid md:grid-cols-1 gap-6">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                  >
                    <FeatureCard {...feature} />
                  </motion.div>
                ))}
              </div>

              {/* How it Works */}
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">How It Works</h2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-purple-600 font-bold text-sm">1</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Analyze Gas Costs</h3>
                      <p className="text-gray-600">Real-time monitoring of gas prices across Ethereum, Arbitrum, Optimism, Polygon, and Base.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-purple-600 font-bold text-sm">2</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Find Optimal Chain</h3>
                      <p className="text-gray-600">Calculate total costs including gas, bridge fees, and slippage to identify the best execution chain.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-purple-600 font-bold text-sm">3</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Execute & Save</h3>
                      <p className="text-gray-600">Automatically bridge assets and execute swaps on the optimal chain, then return tokens if needed.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6">
                <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-200">
                  <div className="text-3xl font-bold text-purple-600 mb-2">97%</div>
                  <div className="text-sm text-gray-600">Max Savings</div>
                </div>
                <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-200">
                  <div className="text-3xl font-bold text-purple-600 mb-2">5+</div>
                  <div className="text-sm text-gray-600">Supported Chains</div>
                </div>
                <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-200">
                  <div className="text-3xl font-bold text-purple-600 mb-2">3min</div>
                  <div className="text-sm text-gray-600">Avg Execution</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Swap;