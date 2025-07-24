export interface Token {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
  chainId?: number;
  price?: number;
}

export interface TokenBalance {
  token: Token;
  balance: string;
  balanceUSD?: string;
  formatted: string;
}

export interface TokenList {
  name: string;
  version: string;
  tokens: Token[];
}

export interface TokenSearchResult {
  token: Token;
  balance?: TokenBalance;
  isVerified: boolean;
  tags?: string[];
}