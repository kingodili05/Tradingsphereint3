// AdminTradeManagement.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase-client';
import { Trade, Profile } from '@/lib/database.types';
import { Search, Lock, Unlock, TrendingUp, TrendingDown } from 'lucide-react';
import { toast } from 'sonner';
import { useAdminActions } from '@/hooks/use-admin-actions';


export function AdminTradeManagement() {
  const { 
    closeTrade, 
    toggleSignalLock,
    setTradeResult,
    loading: actionLoading 
  } = useAdminActions();

  const [trades, setTrades] = useState<(Trade & { profiles: Profile })[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTrades();
  }, []);

  const fetchTrades = async () => {
    if (!supabase) return;
    setLoading(true);

    const { data, error } = await supabase
      .from('trades')
      .select(`*, profiles(id, full_name, email)`)
      .order('created_at', { ascending: false });

    if (data && !error) setTrades(data as any);
    setLoading(false);
  };

  const handleToggleSignalLock = async (tradeId: string, currentLocked: boolean) => {
    const result = await toggleSignalLock(tradeId, currentLocked);
    if (result.success) await fetchTrades();
  };

  const handleCloseTrade = async (tradeId: string) => {
    const result = await closeTrade(tradeId);
    if (result.success) await fetchTrades();
  };

  const handleSetTradeResult = async (tradeId: string, result: 'profit' | 'loss') => {
    const success = await setTradeResult(tradeId, result);
    if (success) await fetchTrades();
  };

  const filteredTrades = trades.filter(trade =>
    trade.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (trade.profiles as any)?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (trade.profiles as any)?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'closed': return 'bg-blue-500';
      case 'cancelled': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const formatCurrency = (amount: number) => `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  if (loading) return <div>Loading trades...</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Trade Management</span>
          <Badge variant="secondary">{filteredTrades.length} trades</Badge>
        </CardTitle>
        <div className="relative mt-2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search trades..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {filteredTrades.map(trade => (
            <div key={trade.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${trade.trade_type === 'buy' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {trade.trade_type === 'buy' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  </div>
                  <div>
                    <div className="font-medium flex items-center space-x-2">
                      <span>{trade.symbol}</span>
                      {trade.signal_locked && <Lock className="h-4 w-4 text-orange-500" />}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {(trade.profiles as any)?.full_name} • {(trade.profiles as any)?.email}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(trade.status)}>{trade.status}</Badge>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleSignalLock(trade.id, trade.signal_locked)}
                    disabled={actionLoading}
                  >
                    {trade.signal_locked ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                  </Button>

                  {trade.status === 'open' && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCloseTrade(trade.id)}
                        disabled={actionLoading}
                      >
                        Close
                      </Button>

                      {/* New Profit / Loss Buttons */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSetTradeResult(trade.id, 'profit')}
                        disabled={actionLoading}
                        className="bg-green-100 text-green-600"
                      >
                        Profit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSetTradeResult(trade.id, 'loss')}
                        disabled={actionLoading}
                        className="bg-red-100 text-red-600"
                      >
                        Loss
                      </Button>
                    </>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground">Type</div>
                  <div className="font-medium capitalize">{trade.trade_type}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Volume</div>
                  <div className="font-medium">{trade.volume}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Entry Price</div>
                  <div className="font-medium">{formatCurrency(trade.entry_price || trade.unit_worth)}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">P&L</div>
                  <div className={`font-medium ${trade.unrealized_pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(trade.unrealized_pnl)}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">Total Value</div>
                  <div className="font-medium">{formatCurrency(trade.volume * trade.unit_worth)}</div>
                </div>
              </div>

              <div className="text-xs text-muted-foreground">
                Created: {new Date(trade.created_at).toLocaleString()}
                {trade.expire_time && (
                  <span> • Expires: {new Date(trade.expire_time).toLocaleString()}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
