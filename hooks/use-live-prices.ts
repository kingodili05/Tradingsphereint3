'use client';

import { useQuery } from '@tanstack/react-query';
import type { LivePrice } from '@/app/api/live-prices/route';

const REFRESH_INTERVAL = 20 * 1000; // 20 seconds

async function fetchLivePrices(): Promise<Record<string, LivePrice>> {
  const res = await fetch('/api/live-prices');
  if (!res.ok) {
    throw new Error('Failed to fetch live prices');
  }
  return res.json();
}

/**
 * Live price feed shared by every markets/trading/admin surface — same
 * source, same 20s refresh, so admin and client always see the same numbers.
 */
export function useLivePrices() {
  return useQuery({
    queryKey: ['live-prices'],
    queryFn: fetchLivePrices,
    refetchInterval: REFRESH_INTERVAL,
    staleTime: REFRESH_INTERVAL,
  });
}

export function formatUsd(value: number): string {
  if (value >= 1000) {
    return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  return `$${value.toFixed(value >= 1 ? 2 : 4)}`;
}

export function formatChangePercent(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}
