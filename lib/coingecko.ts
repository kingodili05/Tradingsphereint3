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
  