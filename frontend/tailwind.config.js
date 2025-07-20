/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');

module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './public/index.html'
  ],
  theme: {
    extend: {
      colors: {
        // Primary colors (Uniswap-inspired)
        primary: {
          pink: '#ff007a',
          pinkHover: '#e6006e',
          pinkLight: '#ff5ba8',
          purple: '#7c3aed',
          purpleHover: '#6d28d9',
          purpleLight: '#a855f7',
          blue: '#4f46e5',
          blueHover: '#4338ca',
          blueLight: '#6366f1'
        },
        // Chain-specific colors
        chain: {
          ethereum: '#627eea',
          arbitrum: '#28a0f0',
          optimism: '#ff0420',
          polygon: '#8247e5',
          base: '#0052ff',
          avalanche: '#e84142',
          bsc: '#f0b90b'
        },
        // Status colors
        success: colors.green[500],
        warning: colors.yellow[500],
        error: colors.red[500],
        info: colors.blue[500],
        
        // Background colors
        'bg-primary': '#ffffff',
        'bg-secondary': '#f8fafc',
        'bg-tertiary': '#f1f5f9',
        'bg-modal': '#ffffff',
        'bg-card': '#ffffff',
        'bg-input': '#f8fafc',
        
        // Dark theme
        'dark-bg-primary': '#0d1421',
        'dark-bg-secondary': '#1a2332',
        'dark-bg-tertiary': '#212d3d',
        'dark-bg-modal': '#1a2332',
        'dark-bg-card': '#1a2332',
        'dark-bg-input': '#0d1421',
        
        // Text colors
        'text-primary': '#0f172a',
        'text-secondary': '#475569',
        'text-tertiary': '#64748b',
        'text-success': '#10b981',
        'text-warning': '#f59e0b',
        'text-error': '#ef4444',
        
        // Border colors
        'border-primary': '#e2e8f0',
        'border-secondary': '#cbd5e1',
        'border-focus': '#4f46e5'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'monospace']
      },
      spacing: {
        '1': '0.25rem',
        '2': '0.5rem',
        '3': '0.75rem',
        '4': '1rem',
        '5': '1.25rem',
        '6': '1.5rem',
        '8': '2rem',
        '10': '2.5rem',
        '12': '3rem',
        '16': '4rem',
        '20': '5rem'
      },
      borderRadius: {
        'sm': '0.25rem',
        'md': '0.5rem',
        'lg': '0.75rem',
        'xl': '1rem',
        '2xl': '1.5rem',
        'full': '9999px'
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'button': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'input': '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        }
      },
      gradientColorStops: {
        'gradient-primary': 'linear-gradient(135deg, #ff007a 0%, #7c3aed 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
        'gradient-success': 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio')
  ],
  darkMode: 'class'
};