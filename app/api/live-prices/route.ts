import { NextResponse } from 'next/server';
import { ASSET_REGISTRY } from '@/lib/asset-registry';
import { getCoinPrices } from '@/lib/coingecko';
import { getFinnhubQuotes } from '@/lib/finnhub';

export interface LivePrice {
  price: number;
  change: number;
  changePercent: number;
  trend: 'up' | 'down';
}

export async function GET() {
  const cryptoAssets = ASSET_REGISTRY.filter((asset) => asset.coingeckoId);
  const equityAssets = ASSET_REGISTRY.filter((asset) => asset.finnhubSymbol);

  const [coinPrices, finnhubQuotes] = await Promise.all([
    getCoinPrices(cryptoAssets.map((asset) => asset.coingeckoId as string)).catch(() => ({})),
    getFinnhubQuotes(equityAssets.map((asset) => asset.finnhubSymbol as string)).catch(() => ({})),
  ]);

  const result: Record<string, LivePrice> = {};

  for (const asset of cryptoAssets) {
    const coin = coinPrices[asset.coingeckoId as string];
    if (coin) {
      result[asset.symbol] = {
        price: coin.usd,
        change: (coin.usd * coin.usd24hChange) / 100,
        changePercent: coin.usd24hChange,
        trend: coin.usd24hChange >= 0 ? 'up' : 'down',
      };
    }
  }

  for (const asset of equityAssets) {
    const quote = finnhubQuotes[asset.finnhubSymbol as string];
    if (quote) {
      result[asset.symbol] = {
        price: quote.price,
        change: quote.change,
        changePercent: quote.changePercent,
        trend: quote.changePercent >= 0 ? 'up' : 'down',
      };
    }
  }

  return NextResponse.json(result);
}

export const dynamic = 'force-dynamic';
