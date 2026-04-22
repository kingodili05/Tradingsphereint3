'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface OrderBookProps {
  symbol: string;
}

// Generate mock order book data
const generateOrderBookData = () => {
  const basePrice = 43250;
  const bids = Array.from({ length: 10 }, (_, i) => ({
    price: basePrice - (i + 1) * 10,
    amount: Math.random() * 5 + 0.1,
    total: 0,
  }));
  
  const asks = Array.from({ length: 10 }, (_, i) => ({
    price: basePrice + (i + 1) * 10,
    amount: Math.random() * 5 + 0.1,
    total: 0,
  }));

  // Calculate cumulative totals
  let bidTotal = 0;
  bids.forEach(bid => {
    bidTotal += bid.amount;
    bid.total = bidTotal;
  });

  let askTotal = 0;
  asks.forEach(ask => {
    askTotal += ask.amount;
    ask.total = askTotal;
  });

  return { bids, asks };
};

export function OrderBook({ symbol }: OrderBookProps) {
  const { bids, asks } = generateOrderBookData();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Book</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Asks */}
          <div>
            <div className="grid grid-cols-3 gap-2 text-xs font-semibold text-muted-foreground mb-2">
              <div>Price</div>
              <div className="text-right">Amount</div>
              <div className="text-right">Total</div>
            </div>
            <div className="space-y-1">
              {asks.reverse().map((ask, index) => (
                <div key={index} className="grid grid-cols-3 gap-2 text-xs py-1 hover:bg-red-50 dark:hover:bg-red-900/20">
                  <div className="text-red-600 font-mono">${ask.price.toLocaleString()}</div>
                  <div className="text-right font-mono">{ask.amount.toFixed(3)}</div>
                  <div className="text-right font-mono text-muted-foreground">{ask.total.toFixed(3)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Spread */}
          <div className="py-2 text-center border-y">
            <div className="text-sm font-semibold">Spread: $25.40 (0.06%)</div>
          </div>

          {/* Bids */}
          <div>
            <div className="space-y-1">
              {bids.map((bid, index) => (
                <div key={index} className="grid grid-cols-3 gap-2 text-xs py-1 hover:bg-green-50 dark:hover:bg-green-900/20">
                  <div className="text-green-600 font-mono">${bid.price.toLocaleString()}</div>
                  <div className="text-right font-mono">{bid.amount.toFixed(3)}</div>
                  <div className="text-right font-mono text-muted-foreground">{bid.total.toFixed(3)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}