'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { useTrades } from '@/hooks/use-trades';

export function OpenOrders() {
  const { trades, cancelTrade, loading } = useTrades();
  
  // Filter for open/pending orders only
  const openOrders = trades.filter(trade => 
    trade.status === 'open' || trade.status === 'pending'
  );

  const handleCancelOrder = (orderId: string) => {
    cancelTrade(orderId);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Open Orders</CardTitle>
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
        ) : openOrders.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No open orders found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {openOrders.map((order) => (
              <div key={order.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge variant={order.trade_type === 'buy' ? 'default' : 'destructive'}>
                      {order.trade_type.toUpperCase()}
                    </Badge>
                    <span className="font-medium">{order.symbol}</span>
                    <span className="text-sm text-muted-foreground">({order.order_type})</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCancelOrder(order.id)}
                    className="h-6 w-6 p-0 text-muted-foreground hover:text-red-600"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Volume</div>
                    <div className="font-medium">{order.volume}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Entry Price</div>
                    <div className="font-medium">${(order.entry_price || order.unit_worth).toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Current P&L</div>
                    <div className={`font-medium ${order.unrealized_pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${order.unrealized_pnl.toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Status</div>
                    <Badge variant={order.status === 'pending' ? 'secondary' : 'outline'}>
                      {order.status}
                    </Badge>
                  </div>
                </div>
                
                <div className="text-xs text-muted-foreground">
                  Placed: {new Date(order.created_at).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}