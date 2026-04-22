'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase-client';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TrendingUp, TrendingDown, Hash, DollarSign, Clock, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface SignalInfo {
  id: string;
  signal_name: string;
  commodity: string;
  trade_direction: string;
  take_profit_percentage: number;
  stop_loss_percentage: number;
  timer_duration_minutes: number;
  execution_time: string | null;
  status: string;
}

export function SignalEntry() {
  const { user } = useAuth();
  const [code, setCode] = useState('');
  const [amount, setAmount] = useState('');
  const [signal, setSignal] = useState<SignalInfo | null>(null);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [joinLoading, setJoinLoading] = useState(false);
  const [joined, setJoined] = useState(false);

  const lookupSignal = async () => {
    if (!supabase || !code.trim()) return;
    setLookupLoading(true);
    setSignal(null);
    try {
      const { data, error } = await supabase
        .from('admin_trade_signals')
        .select('id, signal_name, commodity, trade_direction, take_profit_percentage, stop_loss_percentage, timer_duration_minutes, execution_time, status')
        .eq('signal_code', code.trim())
        .single();

      if (error || !data) { toast.error('Signal code not found'); return; }
      if (data.status !== 'active' && data.status !== 'created') {
        toast.error(`This signal is already ${data.status}`);
        return;
      }

      // Check if already joined
      if (user) {
        const { data: existing } = await supabase
          .from('signal_participants')
          .select('id')
          .eq('signal_id', data.id)
          .eq('user_id', user.id)
          .single();
        if (existing) { toast.error('You have already joined this signal'); return; }
      }

      setSignal(data);
      setJoined(false);
    } catch (err: any) {
      toast.error('Error looking up signal');
    } finally {
      setLookupLoading(false);
    }
  };

  const joinSignal = async () => {
    if (!supabase || !user || !signal) return;
    const investAmount = parseFloat(amount);
    if (isNaN(investAmount) || investAmount <= 0) { toast.error('Enter a valid amount'); return; }

    setJoinLoading(true);
    try {
      // Check balance
      const { data: bal } = await supabase
        .from('balances')
        .select('balance, available_balance')
        .eq('user_id', user.id)
        .eq('currency', 'USD')
        .single();

      if (!bal || (bal.available_balance ?? bal.balance) < investAmount) {
        toast.error('Insufficient balance');
        setJoinLoading(false);
        return;
      }

      // Add participant
      const { error } = await supabase.from('signal_participants').insert({
        signal_id: signal.id,
        user_id: user.id,
        investment_amount: investAmount,
      });
      if (error) throw error;

      // Lock balance
      await supabase.from('balances').update({
        available_balance: (bal.available_balance ?? bal.balance) - investAmount,
        locked_balance: investAmount,
        updated_at: new Date().toISOString(),
      }).eq('user_id', user.id).eq('currency', 'USD');

      toast.success(`Joined signal! $${investAmount} invested in ${signal.commodity}`);
      setJoined(true);
      setCode('');
      setAmount('');
      setSignal(null);
    } catch (err: any) {
      toast.error('Failed to join signal: ' + err.message);
    } finally {
      setJoinLoading(false);
    }
  };

  const timeUntil = signal?.execution_time
    ? Math.max(0, new Date(signal.execution_time).getTime() - Date.now())
    : null;
  const minsLeft = timeUntil !== null ? Math.ceil(timeUntil / 60000) : signal?.timer_duration_minutes;

  return (
    <div className="rounded-xl p-5 space-y-4" style={{ background: 'rgba(29,35,48,0.8)', border: '1px solid rgba(255,255,255,0.08)' }}>
      <div className="flex items-center gap-2 mb-1">
        <Hash className="h-5 w-5 text-blue-400" />
        <h3 className="text-white font-semibold">Enter Signal Code</h3>
      </div>
      <p className="text-gray-400 text-sm">Enter a 7-digit signal code provided by your account manager to join a trade.</p>

      <div className="flex gap-2">
        <Input
          value={code}
          onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 7))}
          placeholder="0000000"
          className="font-mono text-lg tracking-widest"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: 'white' }}
          maxLength={7}
          onKeyDown={e => e.key === 'Enter' && lookupSignal()}
        />
        <Button onClick={lookupSignal} disabled={lookupLoading || code.length < 7} variant="outline">
          {lookupLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Find'}
        </Button>
      </div>

      {signal && (
        <div className="rounded-lg p-4 space-y-3" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="flex items-center justify-between">
            <span className="text-white font-semibold">{signal.signal_name}</span>
            <span className={`flex items-center gap-1 text-sm font-semibold ${signal.trade_direction === 'buy' ? 'text-green-400' : 'text-red-400'}`}>
              {signal.trade_direction === 'buy' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              {signal.commodity} {signal.trade_direction.toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-sm">
            <div className="text-center rounded-lg py-2" style={{ background: 'rgba(34,197,94,0.1)' }}>
              <div className="text-gray-400 text-xs">Take Profit</div>
              <div className="text-green-400 font-semibold">+{signal.take_profit_percentage}%</div>
            </div>
            <div className="text-center rounded-lg py-2" style={{ background: 'rgba(239,68,68,0.1)' }}>
              <div className="text-gray-400 text-xs">Stop Loss</div>
              <div className="text-red-400 font-semibold">-{signal.stop_loss_percentage}%</div>
            </div>
            <div className="text-center rounded-lg py-2" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <div className="text-gray-400 text-xs flex items-center justify-center gap-1"><Clock className="h-3 w-3" /> Duration</div>
              <div className="text-white font-semibold">{minsLeft}m</div>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-gray-300 text-sm">Investment Amount (USD)</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="number"
                min={1}
                placeholder="Enter amount"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="pl-9"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: 'white' }}
              />
            </div>
          </div>

          <Button
            onClick={joinSignal}
            disabled={joinLoading || !amount}
            className="w-full bg-blue-600 hover:bg-blue-700 font-semibold"
          >
            {joinLoading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Joining...</> : 'Join Trade'}
          </Button>
        </div>
      )}
    </div>
  );
}
