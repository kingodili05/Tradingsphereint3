export interface FinnhubQuote {
  price: number;
  change: number;
  changePercent: number;
}

interface CacheEntry {
  quote: FinnhubQuote;
  fetchedAt: number;
}

const quoteCache = new Map<string, CacheEntry>();
const CACHE_TTL = 30 * 1000; // 30 seconds — stays well under Finnhub's free 60 calls/min

async function fetchQuote(symbol: string, apiKey: string): Promise<FinnhubQuote | null> {
  const url = `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(symbol)}&token=${apiKey}`;
  const res = await fetch(url, { method: 'GET' });

  if (!res.ok) {
    return null;
  }

  const data = await res.json();

  if (typeof data?.c !== 'number' || data.c === 0) {
    return null;
  }

  return {
    price: data.c,
    change: data.d ?? 0,
    changePercent: data.dp ?? 0,
  };
}

/**
 * Fetches live quotes for the given Finnhub symbols, using a 30s in-memory
 * cache per symbol so a page full of tickers doesn't blow the free-tier
 * rate limit (60 calls/min). Symbols that fail to fetch are simply omitted
 * from the result map so callers can fall back to their own defaults.
 */
export async function getFinnhubQuotes(symbols: string[]): Promise<Record<string, FinnhubQuote>> {
  const apiKey = process.env.FINNHUB_API_KEY;
  const result: Record<string, FinnhubQuote> = {};

  if (!apiKey) {
    return result;
  }

  const now = Date.now();
  const toFetch: string[] = [];

  for (const symbol of symbols) {
    const cached = quoteCache.get(symbol);
    if (cached && now - cached.fetchedAt < CACHE_TTL) {
      result[symbol] = cached.quote;
    } else {
      toFetch.push(symbol);
    }
  }

  await Promise.all(
    toFetch.map(async (symbol) => {
      const quote = await fetchQuote(symbol, apiKey);
      if (quote) {
        quoteCache.set(symbol, { quote, fetchedAt: now });
        result[symbol] = quote;
      }
    })
  );

  return result;
}
