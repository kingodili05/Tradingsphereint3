'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useTrades } from '@/hooks/use-trades';


export function TradeHistory() {
  const { trades, loading } = useTrades();
  
  // Filter for completed trades only
  const tradeHistory = trades.filter(trade => 
    trade.status === 'closed' || trade.status === 'cancelled'
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trade History</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse border rounded-lg p-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : tradeHistory.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No completed trades found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {tradeHistory.map((trade) => (
              <div key={trade.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge variant={trade.trade_type === 'buy' ? 'default' : 'destructive'}>
                      {trade.trade_type.toUpperCase()}
                    </Badge>
                    <span className="font-medium">{trade.symbol}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm font-medium ${trade.realized_pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {trade.realized_pnl >= 0 ? '+' : ''}${trade.realized_pnl.toFixed(2)}
                    </span>
                    {trade.realized_pnl >= 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Volume</div>
                    <div className="font-medium">{trade.volume}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Entry Price</div>
                    <div className="font-medium">${(trade.entry_price || trade.unit_worth).toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Total Value</div>
                    <div className="font-medium">${(trade.volume * trade.unit_worth).toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Status</div>
                    <Badge variant="outline">{trade.status}</Badge>
                  </div>
                </div>
                
                <div className="text-xs text-muted-foreground">
                  Executed: {new Date(trade.created_at).toLocaleString()}
                  {trade.closed_at && (
                    <span> • Closed: {new Date(trade.closed_at).toLocaleString()}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}