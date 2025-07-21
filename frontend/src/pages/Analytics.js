import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { FaChartLine, FaDollarSign, FaExchangeAlt, FaGasPump } from 'react-icons/fa';
import Layout from '../components/common/Layout';
import Card from '../components/common/Card';
import { getSystemAnalytics } from '../services/api';
import { FORMATTERS, COLORS } from '../utils/constants';

const StatCard = ({ icon: Icon, title, value, change, color = 'purple' }) => (
  <Card hover className="p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600 mb-1">{title}</p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        {change && (
          <p className={`text-sm mt-1 ${change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
            {change} from last month
          </p>
        )}
      </div>
      <div className={`w-12 h-12 bg-${color}-100 rounded-lg flex items-center justify-center`}>
        <Icon className={`h-6 w-6 text-${color}-600`} />
      </div>
    </div>
  </Card>
);

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await getSystemAnalytics();
        setAnalyticsData(data);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  // Mock data for charts
  const savingsOverTime = [
    { month: 'Jan', savings: 12000, volume: 850000 },
    { month: 'Feb', savings: 18500, volume: 1200000 },
    { month: 'Mar', savings: 25200, volume: 1650000 },
    { month: 'Apr', savings: 31800, volume: 2100000 },
    { month: 'May', savings: 42500, volume: 2800000 },
    { month: 'Jun', savings: 55600, volume: 3600000 }
  ];

  const chainDistribution = [
    { name: 'Arbitrum', value: 35, color: COLORS.CHAINS.ARBITRUM },
    { name: 'Optimism', value: 25, color: COLORS.CHAINS.OPTIMISM },
    { name: 'Base', value: 20, color: COLORS.CHAINS.BASE },
    { name: 'Polygon', value: 15, color: COLORS.CHAINS.POLYGON },
    { name: 'Ethereum', value: 5, color: COLORS.CHAINS.ETHEREUM }
  ];

  const gasPriceHistory = [
    { time: '00:00', ethereum: 45, arbitrum: 0.05, optimism: 0.002, polygon: 150, base: 0.01 },
    { time: '04:00', ethereum: 38, arbitrum: 0.04, optimism: 0.001, polygon: 120, base: 0.008 },
    { time: '08:00', ethereum: 52, arbitrum: 0.06, optimism: 0.003, polygon: 180, base: 0.012 },
    { time: '12:00', ethereum: 68, arbitrum: 0.08, optimism: 0.004, polygon: 220, base: 0.015 },
    { time: '16:00', ethereum: 75, arbitrum: 0.09, optimism: 0.005, polygon: 250, base: 0.018 },
    { time: '20:00', ethereum: 58, arbitrum: 0.07, optimism: 0.003, polygon: 190, base: 0.013 }
  ];

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
            <p className="text-gray-600">Track system performance and user savings across all chains</p>
          </motion.div>

          {/* Stats Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            <StatCard
              icon={FaDollarSign}
              title="Total Savings"
              value={FORMATTERS.currency(analyticsData?.totalSavingsUSD || 125000)}
              change="+23.5%"
              color="green"
            />
            <StatCard
              icon={FaExchangeAlt}
              title="Total Swaps"
              value={FORMATTERS.shortNumber(analyticsData?.totalSwapsProcessed || 1250)}
              change="+18.2%"
              color="blue"
            />
            <StatCard
              icon={FaChartLine}
              title="Cross-Chain Rate"
              value={`${analyticsData?.crossChainSwapPercentage || 65.5}%`}
              change="+5.8%"
              color="purple"
            />
            <StatCard
              icon={FaGasPump}
              title="Avg Savings"
              value={`${analyticsData?.averageSavingsPercentage || 45.2}%`}
              change="+2.3%"
              color="orange"
            />
          </motion.div>

          {/* Charts Grid */}
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Savings Over Time */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Savings Over Time</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={savingsOverTime}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => [
                        name === 'savings' ? FORMATTERS.currency(value) : FORMATTERS.currency(value),
                        name === 'savings' ? 'Savings' : 'Volume'
                      ]}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="savings" 
                      stroke={COLORS.PRIMARY.PURPLE} 
                      strokeWidth={3}
                      dot={{ fill: COLORS.PRIMARY.PURPLE, strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </motion.div>

            {/* Chain Distribution */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Usage by Chain</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={chainDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {chainDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, 'Usage']} />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </motion.div>
          </div>

          {/* Gas Price Trends */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">24h Gas Price Trends</h3>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={gasPriceHistory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [
                      `${value} gwei`,
                      name.charAt(0).toUpperCase() + name.slice(1)
                    ]}
                  />
                  <Line type="monotone" dataKey="ethereum" stroke={COLORS.CHAINS.ETHEREUM} strokeWidth={2} />
                  <Line type="monotone" dataKey="arbitrum" stroke={COLORS.CHAINS.ARBITRUM} strokeWidth={2} />
                  <Line type="monotone" dataKey="optimism" stroke={COLORS.CHAINS.OPTIMISM} strokeWidth={2} />
                  <Line type="monotone" dataKey="polygon" stroke={COLORS.CHAINS.POLYGON} strokeWidth={2} />
                  <Line type="monotone" dataKey="base" stroke={COLORS.CHAINS.BASE} strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
              
              {/* Legend */}
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                {Object.entries(COLORS.CHAINS).map(([chain, color]) => (
                  <div key={chain} className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></div>
                    <span className="text-sm text-gray-600 capitalize">{chain}</span>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Popular Chains */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8"
          >
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Most Popular Chains</h3>
              <div className="space-y-4">
                {analyticsData?.mostPopularChains?.map((chain, index) => (
                  <div key={chain.chain_id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-purple-600 font-bold text-sm">{index + 1}</span>
                      </div>
                      <span className="font-medium text-gray-900">{chain.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">{chain.usage_percentage}%</div>
                      <div className="text-sm text-gray-500">usage</div>
                    </div>
                  </div>
                )) || (
                  <div className="text-center text-gray-500 py-8">
                    No data available
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default Analytics;