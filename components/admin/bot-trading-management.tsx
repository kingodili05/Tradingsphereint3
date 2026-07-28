'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/lib/supabase-client';
import { toast } from 'sonner';
import { Bot, TrendingUp, TrendingDown, XCircle, Clock } from 'lucide-react';

interface BotTrade {
  id: string;
  user_id: string;
  symbol: string;
  trade_direction: 'buy' | 'sell';
  investment_amount: number;
  profit_percentage: number;
  loss_percentage: number;
  outcome: 'profit' | 'loss';
  duration_minutes: number;
  expires_at: string;
  status: 'active' | 'settled' | 'cancelled';
  profit_loss_amount: number | null;
  email_sent: boolean;
  created_at: string;
  profiles?: { full_name: string; email: string } | null;
}

interface UserOption {
  id: string;
  full_name: string;
  email: string;
}

const SYMBOLS = [
  'BTC/USD', 'ETH/USD', 'XRP/USD', 'SOL/USD',
  'EUR/USD', 'GBP/USD', 'USD/JPY',
  'GOLD', 'SILVER', 'CRUDE OIL',
  'AAPL', 'TSLA', 'NVDA', 'AMZN',
];

const DURATIONS = [
  { label: '5 minutes', value: 5 },
  { label: '15 minutes', value: 15 },
  { label: '30 minutes', value: 30 },
  { label: '1 hour', value: 60 },
  { label: '4 hours', value: 240 },
  { label: '24 hours', value: 1440 },
];

function formatCountdown(expiresAt: string): string {
  const ms = new Date(expiresAt).getTime() - Date.now();
  if (ms <= 0) return 'settling…';
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h > 0) return `${h}h ${m}m ${s}s`;
  return `${m}m ${s}s`;
}

export function BotTradingManagement() {
  const [users, setUsers] = useState<UserOption[]>([]);
  const [trades, setTrades] = useState<BotTrade[]>([]);
  const [loading, setLoading] = useState(false);
  const [now, setNow] = useState(Date.now());

  const [selectedUserId, setSelectedUserId] = useState('');
  const [symbol, setSymbol] = useState('BTC/USD');
  const [direction, setDirection] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [outcome, setOutcome] = useState<'profit' | 'loss'>('profit');
  const [profitPercentage, setProfitPercentage] = useState('10');
  const [lossPercentage, setLossPercentage] = useState('50');

  const fetchUsers = useCallback(async () => {
    if (!supabase) return;
    const { data } = await supabase
      .from('profiles')
      .select('id, full_name, email')
      .eq('is_admin', false)
      .order('full_name');
    setUsers((data as any) || []);
  }, []);

  const fetchTrades = useCallback(async () => {
    if (!supabase) return;
    const { data } = await supabase
      .from('bot_trades')
      .select('*, profiles!bot_trades_user_id_fkey(full_name, email)')
      .order('created_at', { ascending: false })
      .limit(50);
    setTrades((data as any) || []);
  }, []);

  const triggerSettlement = useCallback(async () => {
    try {
      const res = await fetch('/api/bot-trades/settle', { method: 'POST' });
      const data = await res.json();
      if (data.settled > 0) {
        toast.success(`${data.settled} trade(s) settled — user notified by email`);
        fetchTrades();
      }
    } catch {
      // network hiccup - next tick retries
    }
  }, [fetchTrades]);

  useEffect(() => {
    fetchUsers();
    fetchTrades();
    triggerSettlement();
  }, [fetchUsers, fetchTrades, triggerSettlement]);

  // Tick every second for countdowns; check settlement every 15s while trades active
  const hasActive = trades.some(t => t.status === 'active');
  useEffect(() => {
    const tick = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(tick);
  }, []);

  useEffect(() => {
    if (!hasActive) return;
    const poll = setInterval(triggerSettlement, 15000);
    return () => clearInterval(poll);
  }, [hasActive, triggerSettlement]);

  const handleCreate = async () => {
    if (!selectedUserId) return toast.error('Select a user');
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) return toast.error('Enter a valid amount');
    const profitPct = parseFloat(profitPercentage);
    const lossPct = parseFloat(lossPercentage);
    if (isNaN(profitPct) || profitPct <= 0) return toast.error('Enter a valid profit %');
    if (isNaN(lossPct) || lossPct <= 0 || lossPct > 100) return toast.error('Loss % must be between 1 and 100');

    setLoading(true);
    try {
      const { data: { session } } = await supabase!.auth.getSession();
      if (!session) throw new Error('No session');

      const res = await fetch('/api/bot-trades/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({
          userId: selectedUserId,
          symbol,
          direction,
          amount: amt,
          profitPercentage: profitPct,
          lossPercentage: lossPct,
          outcome,
          durationMinutes,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to start trade');

      toast.success('Bot trade started');
      setAmount('');
      await fetchTrades();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (botTradeId: string) => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase!.auth.getSession();
      if (!session) throw new Error('No session');
      const res = await fetch('/api/bot-trades/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ botTradeId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to cancel');
      toast.success('Trade cancelled, funds returned');
      await fetchTrades();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const activeTrades = trades.filter(t => t.status === 'active');
  const pastTrades = trades.filter(t => t.status !== 'active');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-blue-500" />
            Start Auto Trade for User
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>User</Label>
              <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                <SelectTrigger><SelectValue placeholder="Select user" /></SelectTrigger>
                <SelectContent>
                  {users.map(u => (
                    <SelectItem key={u.id} value={u.id}>
                      {u.full_name} ({u.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Instrument</Label>
              <Select value={symbol} onValueChange={setSymbol}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {SYMBOLS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Direction</Label>
              <Select value={direction} onValueChange={(v) => setDirection(v as 'buy' | 'sell')}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="buy">BUY (Long)</SelectItem>
                  <SelectItem value="sell">SELL (Short)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Investment Amount (USD)</Label>
              <Input type="number" min={0} placeholder="e.g. 500" value={amount} onChange={(e) => setAmount(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Duration</Label>
              <Select value={String(durationMinutes)} onValueChange={(v) => setDurationMinutes(Number(v))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {DURATIONS.map(d => <SelectItem key={d.value} value={String(d.value)}>{d.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Outcome</Label>
              <Select value={outcome} onValueChange={(v) => setOutcome(v as 'profit' | 'loss')}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="profit">Win (profit)</SelectItem>
                  <SelectItem value="loss">Lose (loss)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Profit % (if win)</Label>
              <Input type="number" min={0} value={profitPercentage} onChange={(e) => setProfitPercentage(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Loss % (if lose, max 100)</Label>
              <Input type="number" min={0} max={100} value={lossPercentage} onChange={(e) => setLossPercentage(e.target.value)} />
            </div>
          </div>

          <div className="rounded-lg bg-muted p-3 text-sm text-muted-foreground">
            {outcome === 'profit'
              ? `Trade will conclude as WIN: user gains ${profitPercentage || 0}% of the invested amount after ${durationMinutes} minutes.`
              : `Trade will conclude as LOSS: user loses ${lossPercentage || 0}% of the invested amount after ${durationMinutes} minutes.`}
            {' '}Funds are locked while the trade runs. User is emailed the result automatically.
          </div>

          <Button onClick={handleCreate} disabled={loading} className="w-full md:w-auto">
            <Bot className="h-4 w-4 mr-2" />
            {loading ? 'Working…' : 'Start Bot Trade'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-amber-500" />
            Active Trades ({activeTrades.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activeTrades.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">No active bot trades</div>
          ) : (
            <div className="space-y-3">
              {activeTrades.map(trade => (
                <div key={trade.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="min-w-0">
                      <div className="font-medium truncate">
                        {trade.profiles?.full_name || trade.user_id}
                      </div>
                      <div className="text-sm text-muted-foreground truncate">{trade.profiles?.email}</div>
                      <div className="flex flex-wrap items-center gap-2 mt-2 text-sm">
                        <Badge variant="outline">{trade.symbol}</Badge>
                        <Badge className={trade.trade_direction === 'buy' ? 'bg-green-500/15 text-green-500' : 'bg-red-500/15 text-red-500'}>
                          {trade.trade_direction === 'buy' ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                          {trade.trade_direction.toUpperCase()}
                        </Badge>
                        <span className="font-medium">${Number(trade.investment_amount).toLocaleString()}</span>
                        <Badge variant="secondary">
                          {trade.outcome === 'profit' ? `→ WIN +${trade.profit_percentage}%` : `→ LOSE −${trade.loss_percentage}%`}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-mono text-lg font-semibold" suppressHydrationWarning>
                        {formatCountdown(trade.expires_at)}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2 text-red-500"
                        disabled={loading}
                        onClick={() => handleCancel(trade.id)}
                      >
                        <XCircle className="h-4 w-4 mr-1" /> Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Trade History</CardTitle>
        </CardHeader>
        <CardContent>
          {pastTrades.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">No completed bot trades yet</div>
          ) : (
            <div className="space-y-3">
              {pastTrades.map(trade => {
                const pl = Number(trade.profit_loss_amount || 0);
                return (
                  <div key={trade.id} className="border rounded-lg p-3 flex items-center justify-between gap-3 flex-wrap">
                    <div className="min-w-0">
                      <div className="font-medium truncate">{trade.profiles?.full_name || trade.user_id}</div>
                      <div className="text-xs text-muted-foreground">
                        {trade.symbol} · {trade.trade_direction.toUpperCase()} · ${Number(trade.investment_amount).toLocaleString()} · {new Date(trade.created_at).toLocaleString()}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      {trade.status === 'cancelled' ? (
                        <Badge variant="outline">Cancelled</Badge>
                      ) : (
                        <>
                          <div className={`font-semibold ${pl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {pl >= 0 ? '+' : '−'}${Math.abs(pl).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {trade.email_sent ? 'Email sent ✓' : 'Email not sent'}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
