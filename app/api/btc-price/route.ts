import { NextResponse } from 'next/server';
import { getBtcUsdPrice } from '@/lib/coingecko';

export async function GET() {
  try {
    const price = await getBtcUsdPrice();
    return NextResponse.json({ price });
  } catch (error) {
    console.error('Error fetching BTC price:', error);
    return NextResponse.json(
      { error: 'Failed to fetch BTC price' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic'; // Ensure we get fresh data on each request
