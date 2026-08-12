export type AssetCategory = 'crypto' | 'stocks' | 'etfs';

export interface AssetDefinition {
  symbol: string;
  name: string;
  category: AssetCategory;
  coingeckoId?: string;
  finnhubSymbol?: string;
}

export const ASSET_REGISTRY: AssetDefinition[] = [
  { symbol: 'BTC', name: 'Bitcoin', category: 'crypto', coingeckoId: 'bitcoin' },
  { symbol: 'ETH', name: 'Ethereum', category: 'crypto', coingeckoId: 'ethereum' },
  { symbol: 'ADA', name: 'Cardano', category: 'crypto', coingeckoId: 'cardano' },
  { symbol: 'SOL', name: 'Solana', category: 'crypto', coingeckoId: 'solana' },
  { symbol: 'XRP', name: 'XRP', category: 'crypto', coingeckoId: 'ripple' },
  { symbol: 'DOT', name: 'Polkadot', category: 'crypto', coingeckoId: 'polkadot' },
  { symbol: 'MATIC', name: 'Polygon', category: 'crypto', coingeckoId: 'matic-network' },
  { symbol: 'LINK', name: 'Chainlink', category: 'crypto', coingeckoId: 'chainlink' },
  { symbol: 'UNI', name: 'Uniswap', category: 'crypto', coingeckoId: 'uniswap' },

  { symbol: 'AAPL', name: 'Apple Inc.', category: 'stocks', finnhubSymbol: 'AAPL' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', category: 'stocks', finnhubSymbol: 'GOOGL' },
  { symbol: 'MSFT', name: 'Microsoft Corp.', category: 'stocks', finnhubSymbol: 'MSFT' },
  { symbol: 'TSLA', name: 'Tesla Inc.', category: 'stocks', finnhubSymbol: 'TSLA' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', category: 'stocks', finnhubSymbol: 'AMZN' },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', category: 'stocks', finnhubSymbol: 'NVDA' },
  { symbol: 'JPM', name: 'JPMorgan Chase', category: 'stocks', finnhubSymbol: 'JPM' },
  { symbol: 'JNJ', name: 'Johnson & Johnson', category: 'stocks', finnhubSymbol: 'JNJ' },
  { symbol: 'HIMS', name: 'Hims & Hers Health Inc.', category: 'stocks', finnhubSymbol: 'HIMS' },

  { symbol: 'SPY', name: 'SPDR S&P 500 ETF', category: 'etfs', finnhubSymbol: 'SPY' },
  { symbol: 'QQQ', name: 'Invesco QQQ Trust', category: 'etfs', finnhubSymbol: 'QQQ' },
  { symbol: 'DIA', name: 'SPDR Dow Jones Industrial Average ETF', category: 'etfs', finnhubSymbol: 'DIA' },
  { symbol: 'VTI', name: 'Vanguard Total Stock Market', category: 'etfs', finnhubSymbol: 'VTI' },
  { symbol: 'IWM', name: 'iShares Russell 2000', category: 'etfs', finnhubSymbol: 'IWM' },
];

export function getAssetBySymbol(symbol: string): AssetDefinition | undefined {
  return ASSET_REGISTRY.find((asset) => asset.symbol === symbol);
}
