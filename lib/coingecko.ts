// lib/coingecko.ts
export type BtcPriceResult = {
    usd: number;
    fetchedAt: number;
  };
  
  let cachedPrice: BtcPriceResult | null = null;
  const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in ms
  
  /**
   * Fetches BTC price in USD from CoinGecko with an in-memory cache (5 minutes).
   * Returns the USD price (number) or throws on network error.
   */
  export async function getBtcUsdPrice(): Promise<number> {
    const now = Date.now();
  
    if (cachedPrice && now - cachedPrice.fetchedAt < CACHE_TTL) {
      return cachedPrice.usd;
    }
  
    // CoinGecko simple price endpoint
    const url = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd';
  
    const res = await fetch(url, { method: 'GET' });
  
    if (!res.ok) {
      throw new Error(`CoinGecko request failed: ${res.status} ${res.statusText}`);
    }
  
    const data = await res.json();
  
    if (!data?.bitcoin?.usd || typeof data.bitcoin.usd !== 'number') {
      throw new Error('Unexpected response from CoinGecko');
    }
  
    cachedPrice = {
      usd: data.bitcoin.usd,
      fetchedAt: now,
    };
  
    return cachedPrice.usd;
  }
  
  /**
   * Helper to clear the cache (useful for tests or manual refresh).
   */
  export function clearBtcPriceCache() {
    cachedPrice = null;
  }

  export interface CoinPrice {
    usd: number;
    usd24hChange: number;
  }

  interface CoinCacheEntry {
    prices: Record<string, CoinPrice>;
    fetchedAt: number;
  }

  let coinCache: CoinCacheEntry | null = null;
  const COIN_CACHE_TTL = 30 * 1000; // 30 seconds

  /**
   * Fetches USD price + 24h change for multiple CoinGecko coin ids in one
   * request, cached in-memory for 30s. Keyed by coingecko id (e.g. "ripple"),
   * not the trading symbol.
   */
  export async function getCoinPrices(ids: string[]): Promise<Record<string, CoinPrice>> {
    if (ids.length === 0) return {};

    const now = Date.now();
    if (coinCache && now - coinCache.fetchedAt < COIN_CACHE_TTL) {
      const cached = coinCache;
      const hasAll = ids.every((id) => id in cached.prices);
      if (hasAll) return cached.prices;
    }

    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids.join(',')}&vs_currencies=usd&include_24hr_change=true`;
    const res = await fetch(url, { method: 'GET' });

    if (!res.ok) {
      throw new Error(`CoinGecko request failed: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    const prices: Record<string, CoinPrice> = {};

    for (const id of ids) {
      const entry = data?.[id];
      if (entry && typeof entry.usd === 'number') {
        prices[id] = {
          usd: entry.usd,
          usd24hChange: typeof entry.usd_24h_change === 'number' ? entry.usd_24h_change : 0,
        };
      }
    }

    coinCache = { prices, fetchedAt: now };
    return prices;
  }
