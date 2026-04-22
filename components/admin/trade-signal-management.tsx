'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/lib/supabase-client';
import {
  Plus, Play, Clock, TrendingUp, TrendingDown, Target, Users, DollarSign, Copy, Check, Zap, UserCheck
} from 'lucide-react';
import { toast } from 'sonner';

interface AdminTradeSignal {
  id: string;
  signal_name: string;
  signal_code: string;
  commodity: string;
  trade_direction: 'buy' | 'sell';
  take_profit_percentage: number;
  stop_loss_percentage: number;
  timer_duration_minutes: number;
  timer_start_time: string | null;
  execution_time: string | null;
  status: 'created' | 'active' | 'executed' | 'cancelled' | 'expired';
  win_probability: number;
  forced_outcome: 'profit' | 'loss' | null;
  total_participants: number;
  total_investment_amount: number;
  execution_result: 'profit' | 'loss' | 'break_even' | null;
  executed_at?: string;
  created_at: string;
}

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
}

const COMMODITIES = [
  { value: 'GOLD', label: 'Gold (XAU/USD)' },
  { value: 'SILVER', label: 'Silver (XAG/USD)' },
  { value: 'OIL', label: 'Crude Oil (WTI)' },
  { value: 'BTC', label: 'Bitcoin (BTC/USD)' },
  { value: 'ETH', label: 'Ethereum (ETH/USD)' },
  { value: 'EUR/USD', label: 'EUR/USD' },
  { value: 'GBP/USD', label: 'GBP/USD' },
  { value: 'AAPL', label: 'Apple Stock' },
  { value: 'TSLA', label: 'Tesla Stock' },
  { value: 'SPX500', label: 'S&P 500' },
];

function generateSignalCode() {
  return Math.floor(1000000 + Math.random() * 9000000).toString();
}

const STATUS_COLOR: Record<string, string> = {
  created: 'bg-gray-500',
  active: 'bg-blue-500',
  executed: 'bg-green-500',
  cancelled: 'bg-red-500',
  expired: 'bg-orange-500',
};

export function TradeSignalManagement() {
  const { user, isAdmin } = useAuth();
  const [signals, setSignals] = useState<AdminTradeSignal[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'signals' | 'direct'>('signals');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [timers, setTimers] = useState<Record<string, number>>({});
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);

  const [newSignal, setNewSignal] = useState({
    signal_name: '',
    commodity: '',
    trade_direction: 'buy' as 'buy' | 'sell',
    take_profit_percentage: '',
    stop_loss_percentage: '',
    timer_duration_minutes: '30',
    forced_outcome: '' as '' | 'profit' | 'loss',
  });

  // Direct trade state
  const [directTrade, setDirectTrade] = useState({
    user_id: '',
    commodity: '',
    trade_direction: 'buy' as 'buy' | 'sell',
    investment_amount: '',
    take_profit_percentage: '10',
    stop_loss_percentage: '5',
    timer_duration_minutes: '30',
    forced_outcome: 'profit' as 'profit' | 'loss',
  });
  const [directTradeLoading, setDirectTradeLoading] = useState(false);

  const fetchSignals = async () => {
    if (!supabase) return;
    try {
      const { data: signalsData, error } = await supabase
        .from('admin_trade_signals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (!signalsData?.length) { setSignals([]); setLoading(false); return; }

      const signalIds = signalsData.map(s => s.id);
      const { data: participants } = await supabase
        .from('signal_participants')
        .select('signal_id, investment_amount')
        .in('signal_id', signalIds);

      const processed = signalsData.map(signal => {
        const sp = participants?.filter(p => p.signal_id === signal.id) || [];
        return {
          ...signal,
          total_participants: sp.length,
          total_investment_amount: sp.reduce((s, p) => s + (p.investment_amount || 0), 0),
        };
      });
      setSignals(processed);
    } catch (err: any) {
      toast.error('Failed to fetch signals: ' + err.message);
      setSignals([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    if (!supabase) return;
    const { data } = await supabase
      .from('profiles')
      .select('id, full_name, email')
      .eq('is_admin', false)
      .order('full_name');
    if (data) setAllUsers(data);
  };

  useEffect(() => {
    if (isAdmin) {
      fetchSignals();
      fetchUsers();
      if (supabase) {
        const sub = supabase
          .channel('admin-signals')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'admin_trade_signals' }, fetchSignals)
          .subscribe();
        return () => { sub.unsubscribe(); };
      }
    }
  }, [isAdmin]);

  // Countdown timers
  useEffect(() => {
    const interval = setInterval(() => {
      setTimers(prev => {
        const updated = { ...prev };
        signals.forEach(signal => {
          if (signal.status === 'active' && signal.execution_time) {
            const remaining = Math.max(0, new Date(signal.execution_time).getTime() - Date.now());
            updated[signal.id] = remaining;
            if (remaining === 0 && (prev[signal.id] ?? 1) > 0) {
              executeSignal(signal.id, signal.forced_outcome ?? null);
            }
          }
        });
        return updated;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [signals]);

  const getSession = async () => {
    if (!supabase) return null;
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token ?? null;
  };

  const executeSignal = async (signalId: string, forceOutcome: 'profit' | 'loss' | null) => {
    if (!user) return;
    const token = await getSession();
    if (!token) return;
    try {
      const res = await fetch('/api/admin/execute-signal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ signalId, forceOutcome }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed');
      toast.success(`Signal executed: ${result.outcome} — ${result.participantsSettled} participant(s) settled`);
      await fetchSignals();
    } catch (err: any) {
      toast.error('Failed to execute signal: ' + err.message);
    }
  };

  const createSignal = async () => {
    if (!supabase) return;
    if (!newSignal.signal_name || !newSignal.commodity || !newSignal.take_profit_percentage || !newSignal.stop_loss_percentage) {
      toast.error('Please fill in all required fields');
      return;
    }
    try {
      const code = generateSignalCode();
      const { error } = await supabase.from('admin_trade_signals').insert({
        signal_name: newSignal.signal_name,
        signal_code: code,
        commodity: newSignal.commodity,
        trade_direction: newSignal.trade_direction,
        take_profit_percentage: parseFloat(newSignal.take_profit_percentage),
        stop_loss_percentage: parseFloat(newSignal.stop_loss_percentage),
        timer_duration_minutes: parseInt(newSignal.timer_duration_minutes),
        win_probability: 0.65,
        forced_outcome: newSignal.forced_outcome || null,
        created_by: user?.id,
      });
      if (error) throw error;
      toast.success(`Signal created! Code: ${code}`);
      setShowCreateDialog(false);
      setNewSignal({ signal_name: '', commodity: '', trade_direction: 'buy', take_profit_percentage: '', stop_loss_percentage: '', timer_duration_minutes: '30', forced_outcome: '' });
      await fetchSignals();
    } catch (err: any) {
      toast.error('Failed to create signal: ' + err.message);
    }
  };

  const startTimer = async (signalId: string, duration: number) => {
    if (!supabase) return;
    try {
      const executionTime = new Date(Date.now() + duration * 60 * 1000);
      const { error } = await supabase.from('admin_trade_signals').update({
        status: 'active',
        timer_start_time: new Date().toISOString(),
        execution_time: executionTime.toISOString(),
        updated_at: new Date().toISOString(),
      }).eq('id', signalId).eq('status', 'created');
      if (error) throw error;
      toast.success(`Timer started — ${duration} minutes`);
      await fetchSignals();
    } catch (err: any) {
      toast.error('Failed to start timer: ' + err.message);
    }
  };

  const handleDirectTrade = async () => {
    if (!user) return;
    if (!directTrade.user_id || !directTrade.commodity || !directTrade.investment_amount) {
      toast.error('Please fill in all required fields');
      return;
    }
    const amount = parseFloat(directTrade.investment_amount);
    if (isNaN(amount) || amount <= 0) { toast.error('Invalid investment amount'); return; }

    const token = await getSession();
    if (!token) return;

    setDirectTradeLoading(true);
    try {
      const res = await fetch('/api/admin/direct-trade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          userId: directTrade.user_id,
          commodity: directTrade.commodity,
          tradeDirection: directTrade.trade_direction,
          investmentAmount: amount,
          takeProfitPct: parseFloat(directTrade.take_profit_percentage),
          stopLossPct: parseFloat(directTrade.stop_loss_percentage),
          durationMinutes: parseInt(directTrade.timer_duration_minutes),
          forcedOutcome: directTrade.forced_outcome,
        }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to start trade');

      toast.success(`Direct trade started. Timer: ${directTrade.timer_duration_minutes} min. Outcome: ${directTrade.forced_outcome}`);
      setDirectTrade({ user_id: '', commodity: '', trade_direction: 'buy', investment_amount: '', take_profit_percentage: '10', stop_loss_percentage: '5', timer_duration_minutes: '30', forced_outcome: 'profit' });
      setTab('signals');
      await fetchSignals();
    } catch (err: any) {
      toast.error('Failed to create direct trade: ' + err.message);
    } finally {
      setDirectTradeLoading(false);
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    });
  };

  const formatTime = (ms: number) => {
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    const h = Math.floor(m / 60);
    if (h > 0) return `${h}h ${m % 60}m ${s % 60}s`;
    if (m > 0) return `${m}m ${s % 60}s`;
    return `${s}s`;
  };

  const calcProgress = (remaining: number, totalMin: number) => {
    if (!totalMin) return 0;
    const total = totalMin * 60 * 1000;
    return Math.min(100, Math.max(0, ((total - remaining) / total) * 100));
  };

  if (!isAdmin) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">Access denied. Admin privileges required.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold">Trade Management</h2>
          <p className="text-muted-foreground">Create signals or assign trades directly to users</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={tab === 'signals' ? 'default' : 'outline'}
            onClick={() => setTab('signals')}
          >
            <Zap className="h-4 w-4 mr-2" /> Signal Codes
          </Button>
          <Button
            variant={tab === 'direct' ? 'default' : 'outline'}
            onClick={() => setTab('direct')}
          >
            <UserCheck className="h-4 w-4 mr-2" /> Direct Trade
          </Button>
        </div>
      </div>

      {/* ── SIGNAL CODES TAB ── */}
      {tab === 'signals' && (
        <>
          <div className="flex justify-end">
            <Button onClick={() => setShowCreateDialog(true)} className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" /> New Signal
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              [...Array(3)].map((_, i) => (
                <Card key={i}><CardContent className="p-6"><div className="animate-pulse space-y-3"><div className="h-4 bg-gray-200 rounded w-3/4" /><div className="h-4 bg-gray-200 rounded w-1/2" /></div></CardContent></Card>
              ))
            ) : signals.length === 0 ? (
              <Card className="col-span-full">
                <CardContent className="p-12 text-center">
                  <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No Signals Yet</h3>
                  <p className="text-muted-foreground">Create a signal to get started</p>
                </CardContent>
              </Card>
            ) : signals.map(signal => (
              <Card key={signal.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{signal.signal_name}</CardTitle>
                    <Badge className={STATUS_COLOR[signal.status]}>{signal.status.toUpperCase()}</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">{signal.commodity} • {signal.trade_direction.toUpperCase()}</div>

                  {/* Signal Code */}
                  {signal.signal_code && (
                    <div className="flex items-center gap-2 mt-2 bg-muted rounded-lg px-3 py-2">
                      <span className="text-xs text-muted-foreground font-medium">CODE</span>
                      <span className="font-mono font-bold text-lg tracking-widest flex-1">{signal.signal_code}</span>
                      <button onClick={() => copyCode(signal.signal_code)} className="text-muted-foreground hover:text-foreground transition-colors">
                        {copiedCode === signal.signal_code ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                      </button>
                    </div>
                  )}
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="text-center bg-green-50 rounded-lg py-2">
                      <div className="text-muted-foreground text-xs">Take Profit</div>
                      <div className="font-semibold text-green-600">+{signal.take_profit_percentage}%</div>
                    </div>
                    <div className="text-center bg-red-50 rounded-lg py-2">
                      <div className="text-muted-foreground text-xs">Stop Loss</div>
                      <div className="font-semibold text-red-600">-{signal.stop_loss_percentage}%</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>{signal.total_participants} participants</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>${signal.total_investment_amount.toFixed(2)}</span>
                    </div>
                  </div>

                  {signal.forced_outcome && signal.status !== 'executed' && (
                    <div className={`text-xs px-2 py-1 rounded text-center font-medium ${signal.forced_outcome === 'profit' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      Preset outcome: {signal.forced_outcome.toUpperCase()}
                    </div>
                  )}

                  {signal.status === 'active' && signal.execution_time && (
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" /> Time left</span>
                        <span className="font-mono text-sm font-bold">{formatTime(timers[signal.id] || 0)}</span>
                      </div>
                      <Progress value={calcProgress(timers[signal.id] || 0, signal.timer_duration_minutes)} className="h-1.5" />
                    </div>
                  )}

                  <div className="space-y-2 pt-1">
                    {signal.status === 'created' && (
                      <Button onClick={() => startTimer(signal.id, signal.timer_duration_minutes)} className="w-full bg-blue-600 hover:bg-blue-700" size="sm">
                        <Play className="h-4 w-4 mr-2" /> Start Timer ({signal.timer_duration_minutes}m)
                      </Button>
                    )}
                    {signal.status === 'active' && (
                      <div className="grid grid-cols-2 gap-2">
                        <Button onClick={() => executeSignal(signal.id, 'profit')} size="sm" className="bg-green-600 hover:bg-green-700">
                          <TrendingUp className="h-4 w-4 mr-1" /> Force Win
                        </Button>
                        <Button onClick={() => executeSignal(signal.id, 'loss')} size="sm" className="bg-red-600 hover:bg-red-700">
                          <TrendingDown className="h-4 w-4 mr-1" /> Force Loss
                        </Button>
                      </div>
                    )}
                    {signal.status === 'executed' && (
                      <div className={`text-center p-3 rounded-lg ${signal.execution_result === 'profit' ? 'bg-green-50' : 'bg-red-50'}`}>
                        <div className={`font-semibold ${signal.execution_result === 'profit' ? 'text-green-600' : 'text-red-600'}`}>
                          Result: {signal.execution_result?.toUpperCase()}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {signal.executed_at ? new Date(signal.executed_at).toLocaleString() : ''}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="text-xs text-muted-foreground">
                    Created: {new Date(signal.created_at).toLocaleString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* ── DIRECT TRADE TAB ── */}
      {tab === 'direct' && (
        <Card className="max-w-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5" /> Assign Trade to User
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Directly assign a trade to a specific user. The trade starts immediately with a timer.
            </p>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label>Select User</Label>
              <Select value={directTrade.user_id} onValueChange={v => setDirectTrade({ ...directTrade, user_id: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a user account" />
                </SelectTrigger>
                <SelectContent>
                  {allUsers.map(u => (
                    <SelectItem key={u.id} value={u.id}>
                      {u.full_name} — {u.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Commodity</Label>
                <Select value={directTrade.commodity} onValueChange={v => setDirectTrade({ ...directTrade, commodity: v })}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    {COMMODITIES.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Direction</Label>
                <Select value={directTrade.trade_direction} onValueChange={v => setDirectTrade({ ...directTrade, trade_direction: v as 'buy' | 'sell' })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="buy">BUY</SelectItem>
                    <SelectItem value="sell">SELL</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Investment Amount (USD)</Label>
              <Input
                type="number"
                min={1}
                placeholder="e.g. 500"
                value={directTrade.investment_amount}
                onChange={e => setDirectTrade({ ...directTrade, investment_amount: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Take Profit (%)</Label>
                <Input type="number" value={directTrade.take_profit_percentage} onChange={e => setDirectTrade({ ...directTrade, take_profit_percentage: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Stop Loss (%)</Label>
                <Input type="number" value={directTrade.stop_loss_percentage} onChange={e => setDirectTrade({ ...directTrade, stop_loss_percentage: e.target.value })} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Timer Duration</Label>
              <Select value={directTrade.timer_duration_minutes} onValueChange={v => setDirectTrade({ ...directTrade, timer_duration_minutes: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 minutes</SelectItem>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                  <SelectItem value="240">4 hours</SelectItem>
                  <SelectItem value="480">8 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label>Trade Outcome</Label>
              <RadioGroup
                value={directTrade.forced_outcome}
                onValueChange={v => setDirectTrade({ ...directTrade, forced_outcome: v as 'profit' | 'loss' })}
                className="flex gap-6"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="profit" id="dt-profit" />
                  <Label htmlFor="dt-profit" className="text-green-600 font-semibold cursor-pointer">WIN (Profit)</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="loss" id="dt-loss" />
                  <Label htmlFor="dt-loss" className="text-red-600 font-semibold cursor-pointer">LOSS</Label>
                </div>
              </RadioGroup>
            </div>

            <Button
              onClick={handleDirectTrade}
              disabled={directTradeLoading}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {directTradeLoading ? 'Starting Trade...' : 'Start Trade Now'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Create Signal Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Signal Code</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Signal Name</Label>
                <Input placeholder="e.g. Gold Bullish" value={newSignal.signal_name} onChange={e => setNewSignal({ ...newSignal, signal_name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Commodity</Label>
                <Select value={newSignal.commodity} onValueChange={v => setNewSignal({ ...newSignal, commodity: v })}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>{COMMODITIES.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Trade Direction</Label>
              <RadioGroup value={newSignal.trade_direction} onValueChange={v => setNewSignal({ ...newSignal, trade_direction: v as 'buy' | 'sell' })} className="flex gap-6">
                <div className="flex items-center gap-2"><RadioGroupItem value="buy" id="s-buy" /><Label htmlFor="s-buy" className="text-green-600 font-semibold cursor-pointer">BUY</Label></div>
                <div className="flex items-center gap-2"><RadioGroupItem value="sell" id="s-sell" /><Label htmlFor="s-sell" className="text-red-600 font-semibold cursor-pointer">SELL</Label></div>
              </RadioGroup>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Take Profit (%)</Label>
                <Input type="number" placeholder="10.0" value={newSignal.take_profit_percentage} onChange={e => setNewSignal({ ...newSignal, take_profit_percentage: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Stop Loss (%)</Label>
                <Input type="number" placeholder="5.0" value={newSignal.stop_loss_percentage} onChange={e => setNewSignal({ ...newSignal, stop_loss_percentage: e.target.value })} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Timer Duration</Label>
                <Select value={newSignal.timer_duration_minutes} onValueChange={v => setNewSignal({ ...newSignal, timer_duration_minutes: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 minutes</SelectItem>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                    <SelectItem value="240">4 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Preset Outcome (optional)</Label>
                <Select value={newSignal.forced_outcome} onValueChange={v => setNewSignal({ ...newSignal, forced_outcome: v as '' | 'profit' | 'loss' })}>
                  <SelectTrigger><SelectValue placeholder="Random" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Random</SelectItem>
                    <SelectItem value="profit">Always Win</SelectItem>
                    <SelectItem value="loss">Always Loss</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button onClick={createSignal} className="flex-1">Create Signal</Button>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)} className="flex-1">Cancel</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
