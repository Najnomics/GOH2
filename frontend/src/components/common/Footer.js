import React from 'react';
import { FaGithub, FaTwitter, FaDiscord, FaHeart } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">G</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                Gas Optimizer
              </span>
            </div>
            <p className="text-gray-600 text-sm max-w-md">
              Intelligent cross-chain gas optimization for Uniswap V4. Save up to 97% on gas fees 
              by automatically routing your swaps to the most cost-effective blockchain.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Product
            </h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">Swap</a></li>
              <li><a href="/analytics" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">Analytics</a></li>
              <li><a href="/history" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">History</a></li>
              <li><a href="/settings" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">Settings</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Resources
            </h3>
            <ul className="space-y-2">
              <li><a href="/docs" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">Documentation</a></li>
              <li><a href="/api" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">API Reference</a></li>
              <li><a href="/support" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">Support</a></li>
              <li><a href="/security" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">Security</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-gray-200 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4 md:mb-0">
              <span>Built with</span>
              <FaHeart className="h-4 w-4 text-red-500" />
              <span>for the Uniswap Hook Incubator</span>
            </div>
            
            <div className="flex items-center space-x-6">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <FaGithub className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <FaTwitter className="h-5 w-5" />
              </a>
              <a
                href="https://discord.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <FaDiscord className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div className="text-center mt-4 text-sm text-gray-500">
            © 2024 Gas Optimizer. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;