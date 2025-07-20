import { SUPPORTED_CHAINS, CHAIN_INFO } from './constants';
import { Chain, Token } from '../types';

// Utility functions
export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// Validation helpers
export const isValidAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

export const isValidChainId = (chainId: number): boolean => {
  return Object.values(SUPPORTED_CHAINS).includes(chainId);
};

export const isValidAmount = (amount: string): boolean => {
  try {
    const num = parseFloat(amount);
    return !isNaN(num) && num > 0;
  } catch {
    return false;
  }
};

// Chain utilities
export const getChainInfo = (chainId: number): Chain | null => {
  const info = CHAIN_INFO[chainId as keyof typeof CHAIN_INFO];
  if (!info) return null;
  
  return {
    id: chainId,
    name: info.name,
    symbol: info.symbol,
    rpcUrl: info.rpcUrl,
    explorerUrl: info.explorerUrl,
    logoURI: info.logo,
    isL2: info.isL2,
    blockTime: info.blockTime,
    finalityTime: info.finalityTime,
    gasPrice: 0, // Will be fetched from API
    gasPriceUSD: 0, // Will be fetched from API
    status: 'active',
    color: info.color,
  };
};

export const getSupportedChains = (): Chain[] => {
  return Object.values(SUPPORTED_CHAINS).map(chainId => getChainInfo(chainId)).filter(Boolean) as Chain[];
};

export const getChainColor = (chainId: number): string => {
  const info = CHAIN_INFO[chainId as keyof typeof CHAIN_INFO];
  return info?.color || '#64748b';
};

export const getChainName = (chainId: number): string => {
  const info = CHAIN_INFO[chainId as keyof typeof CHAIN_INFO];
  return info?.name || `Chain ${chainId}`;
};

// Token utilities
export const getTokenLogoUrl = (token: Token): string => {
  if (token.logoURI) return token.logoURI;
  return '/icons/tokens/generic.svg';
};

export const isNativeToken = (token: Token): boolean => {
  return token.address === '0x0000000000000000000000000000000000000000' || 
         token.symbol === 'ETH' || 
         token.symbol === 'MATIC';
};

export const getTokenDisplayName = (token: Token): string => {
  if (isNativeToken(token)) {
    return getChainInfo(token.chainId)?.symbol || token.symbol;
  }
  return token.symbol;
};

// Price utilities
export const calculatePriceImpact = (
  inputAmount: number,
  outputAmount: number,
  inputPrice: number,
  outputPrice: number
): number => {
  const expectedOutput = (inputAmount * inputPrice) / outputPrice;
  const impact = ((expectedOutput - outputAmount) / expectedOutput) * 100;
  return Math.max(0, impact);
};

export const calculateSlippage = (
  expectedAmount: number,
  actualAmount: number
): number => {
  return ((expectedAmount - actualAmount) / expectedAmount) * 100;
};

// Time utilities
export const getTimeUntilDeadline = (deadline: number): number => {
  return Math.max(0, deadline - Date.now());
};

export const isDeadlineExpired = (deadline: number): boolean => {
  return Date.now() > deadline;
};

// Local storage utilities
export const getLocalStorageItem = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
};

export const setLocalStorageItem = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn('Failed to save to localStorage:', error);
  }
};

export const removeLocalStorageItem = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.warn('Failed to remove from localStorage:', error);
  }
};

// URL utilities
export const getExplorerUrl = (chainId: number, hash: string, type: 'tx' | 'address' = 'tx'): string => {
  const info = CHAIN_INFO[chainId as keyof typeof CHAIN_INFO];
  if (!info) return '';
  
  const baseUrl = info.explorerUrl;
  const endpoint = type === 'tx' ? 'tx' : 'address';
  
  return `${baseUrl}/${endpoint}/${hash}`;
};

export const openInNewTab = (url: string): void => {
  window.open(url, '_blank', 'noopener,noreferrer');
};

// Array utilities
export const uniqueBy = <T>(array: T[], key: keyof T): T[] => {
  const seen = new Set();
  return array.filter(item => {
    const value = item[key];
    if (seen.has(value)) return false;
    seen.add(value);
    return true;
  });
};

export const groupBy = <T>(array: T[], key: keyof T): Record<string, T[]> => {
  return array.reduce((groups, item) => {
    const value = String(item[key]);
    if (!groups[value]) groups[value] = [];
    groups[value].push(item);
    return groups;
  }, {} as Record<string, T[]>);
};

// Debounce utility
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void => {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// Throttle utility
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Error handling utilities
export const getErrorMessage = (error: any): string => {
  if (typeof error === 'string') return error;
  if (error?.message) return error.message;
  if (error?.reason) return error.reason;
  return 'An unknown error occurred';
};

export const isNetworkError = (error: any): boolean => {
  const message = getErrorMessage(error).toLowerCase();
  return message.includes('network') || 
         message.includes('connection') || 
         message.includes('timeout') ||
         message.includes('fetch');
};

// Math utilities
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

export const lerp = (start: number, end: number, factor: number): number => {
  return start + (end - start) * factor;
};

export const roundToDecimals = (value: number, decimals: number): number => {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
};

// Color utilities
export const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

export const rgbToHex = (r: number, g: number, b: number): string => {
  return `#${[r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')}`;
};

export const adjustColorOpacity = (color: string, opacity: number): string => {
  const rgb = hexToRgb(color);
  if (!rgb) return color;
  
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
};

// Copy to clipboard utility
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      return true;
    } catch {
      return false;
    } finally {
      document.body.removeChild(textArea);
    }
  }
};

// Generate random ID
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Check if mobile device
export const isMobile = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// Check if dark mode preferred
export const prefersDarkMode = (): boolean => {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
};