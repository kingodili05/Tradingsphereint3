'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/lib/supabase-client';
import { 
  Plus, 
  Play, 
  Pause, 
  Square, 
  Clock, 
  TrendingUp, 
  TrendingDown, 
  Target,
  Users,
  DollarSign,
  Timer,
  Zap,
  Settings
} from 'lucide-react';
import { toast } from 'sonner';

interface AdminTradeSignal {
  id: string;
  signal_name: string;
  commodity: string;
  trade_direction: 'buy' | 'sell';
  take_profit_percentage: number;
  stop_loss_percentage: number;
  timer_duration_minutes: number;
  timer_start_time: string | null;
  execution_time: string | null;
  status: 'created' | 'active' | 'executed' | 'cancelled' | 'expired';
  win_probability: number;
  total_participants: number;
  total_investment_amount: number;
  execution_result: 'profit' | 'loss' | 'break_even' | null;
  created_at: string;
}

export function TradeSignalManagement() {
  const { user, isAdmin } = useAuth();
  const [signals, setSignals] = useState<AdminTradeSignal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [timers, setTimers] = useState<Record<string, number>>({});
  
  const [newSignal, setNewSignal] = useState({
    signal_name: '',
    commodity: '',
    trade_direction: 'buy' as 'buy' | 'sell',
    take_profit_percentage: '',
    stop_loss_percentage: '',
    timer_duration_minutes: '30',
    win_probability: '65'
  });

  const fetchSignals = async () => {
    if (!supabase) return;
  
    try {
      const { data: signalsData, error } = await supabase
        .from('admin_trade_signals')
        .select('*')
        .order('created_at', { ascending: false });
  
      if (error) throw error;
      if (!signalsData || signalsData.length === 0) {
        setSignals([]);
        setLoading(false);
        return;
      }
  
      // Fetch all participants at once
      const signalIds = signalsData.map(s => s.id);
      const { data: participants } = await supabase
        .from('signal_participants')
        .select('signal_id, investment_amount')
        .in('signal_id', signalIds);
  
      const processedSignals = signalsData.map(signal => {
        const signalParticipants = participants?.filter(p => p.signal_id === signal.id) || [];
        const total_participants = signalParticipants.length;
        const total_investment_amount = signalParticipants.reduce((sum, p) => sum + (p.investment_amount || 0), 0);
        return { ...signal, total_participants, total_investment_amount };
      });
  
      setSignals(processedSignals);
    } catch (err: any) {
      console.error('Failed to fetch signals', err);
      toast.error('Failed to fetch signals: ' + err.message);
      setSignals([]);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    if (isAdmin) {
      fetchSignals();
      
      // Set up real-time subscription
      if (supabase) {
        const subscription = supabase
          .channel('admin-signals')
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'admin_trade_signals',
            },
            () => {
              fetchSignals();
            }
          )
          .subscribe();

        return () => {
          subscription.unsubscribe();
        };
      }
    }
  }, [isAdmin]);

  // Timer countdown effect
  useEffect(() => {
    const interval = setInterval(() => {
      setTimers(prev => {
        const updated = { ...prev };
        
        signals.forEach(signal => {
          if (signal.status === 'active' && signal.execution_time) {
            const now = new Date().getTime();
            const executionTime = new Date(signal.execution_time).getTime();
            const remaining = Math.max(0, executionTime - now);
            
            updated[signal.id] = remaining;
            
            // Auto-execute when timer reaches 0
            if (remaining === 0 && prev[signal.id] > 0) {
              executeSignal(signal.id, null);
            }
          }
        });
        
        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [signals]);

  const executeSignal = async (signalId: string, forceOutcome: 'profit' | 'loss' | null) => {
    if (!supabase || !user) {
      toast.error('Supabase not configured. Please connect to Supabase first.');
      return;
    }

    try {
      // Execute signal directly using database operations
      const { data: signal, error: signalError } = await supabase
        .from('admin_trade_signals')
        .select('*')
        .eq('id', signalId)
        .eq('status', 'active')
        .single();

      if (signalError || !signal) {
        toast.error('Signal not found or not active');
        return;
      }

      // Get participants
      const { data: participants, error: participantsError } = await supabase
        .from('signal_participants')
        .select('*')
        .eq('signal_id', signalId)
        .is('settled_at', null);

      if (participantsError) {
        toast.error('Failed to get participants: ' + participantsError.message);
        return;
      }

      const participantCount = participants?.length || 0;
      const totalVolume = participants?.reduce((sum, p) => sum + p.investment_amount, 0) || 0;

      // Determine outcome
      let outcome: 'profit' | 'loss';
      if (forceOutcome) {
        outcome = forceOutcome;
      } else {
        outcome = Math.random() < signal.win_probability ? 'profit' : 'loss';
      }

      const profitMultiplier = outcome === 'profit' ? 
        signal.take_profit_percentage / 100 : 
        -(signal.stop_loss_percentage / 100);

      // Process participants
      if (participants && participants.length > 0) {
        for (const participant of participants) {
          const profitLossAmount = participant.investment_amount * profitMultiplier;
          
          // Update participant
          await supabase
            .from('signal_participants')
            .update({
              profit_loss_amount: profitLossAmount,
              profit_loss_percentage: profitMultiplier * 100,
              settled_at: new Date().toISOString()
            })
            .eq('id', participant.id);

          // Update user balance
          const { data: currentBalance } = await supabase
            .from('balances')
            .select('*')
            .eq('user_id', participant.user_id)
            .eq('currency', 'USD')
            .single();

          if (currentBalance) {
            await supabase
              .from('balances')
              .update({
                balance: currentBalance.balance + profitLossAmount,
                available_balance: currentBalance.available_balance + participant.investment_amount + profitLossAmount,
                locked_balance: Math.max(0, currentBalance.locked_balance - participant.investment_amount),
                updated_at: new Date().toISOString()
              })
              .eq('user_id', participant.user_id)
              .eq('currency', 'USD');
          }
        }
      }

      // Mark signal as executed
      await supabase
        .from('admin_trade_signals')
        .update({
          status: 'executed',
          execution_result: outcome,
          executed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', signalId);
      
      toast.success(`Signal executed: ${outcome} with ${participantCount} participants`);
      await fetchSignals();
    } catch (error: any) {
      console.error('Failed to execute signal:', error);
      toast.error('Failed to execute signal: ' + error.message);
    }
  };

  const createSignal = async () => {
    if (!supabase) return;

    if (!newSignal.signal_name || !newSignal.commodity || !newSignal.take_profit_percentage || !newSignal.stop_loss_percentage) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const { error } = await supabase
        .from('admin_trade_signals')
        .insert({
          signal_name: newSignal.signal_name,
          commodity: newSignal.commodity,
          trade_direction: newSignal.trade_direction,
          take_profit_percentage: parseFloat(newSignal.take_profit_percentage),
          stop_loss_percentage: parseFloat(newSignal.stop_loss_percentage),
          timer_duration_minutes: parseInt(newSignal.timer_duration_minutes),
          win_probability: parseFloat(newSignal.win_probability) / 100,
          created_by: user?.id
        });

      if (error) throw error;

      toast.success('Trade signal created successfully');
      setShowCreateDialog(false);
      setNewSignal({
        signal_name: '',
        commodity: '',
        trade_direction: 'buy',
        take_profit_percentage: '',
        stop_loss_percentage: '',
        timer_duration_minutes: '30',
        win_probability: '65'
      });
      
      // Add a small delay then refresh to ensure database consistency
      setTimeout(async () => {
        await fetchSignals();
      }, 500);
      
      // Also immediate refresh
      await fetchSignals();
    } catch (error: any) {
      console.error('Signal creation error:', error);
      toast.error('Failed to create signal: ' + error.message);
    }
  };

  const startTimer = async (signalId: string, duration: number) => {
    if (!supabase) {
      toast.error('Supabase not configured. Please connect to Supabase first.');
      return;
    }

    try {
      // Fallback: Use direct database update instead of Edge Function
      const executionTime = new Date(Date.now() + duration * 60 * 1000);
      
      const { error } = await supabase
        .from('admin_trade_signals')
        .update({
          status: 'active',
          timer_start_time: new Date().toISOString(),
          execution_time: executionTime.toISOString(),
          timer_duration_minutes: duration,
          updated_at: new Date().toISOString()
        })
        .eq('id', signalId)
        .eq('status', 'created');

      if (error) throw error;

      toast.success(`Timer started for ${duration} minutes`);
      await fetchSignals();
    } catch (error: any) {
      console.error('Failed to start timer:', error);
      toast.error('Failed to start timer: ' + error.message);
    }
  };

  const formatTimeRemaining = (milliseconds: number) => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  };

  const calculateProgress = (remaining: number, totalDurationMinutes: number) => {
    if (totalDurationMinutes <= 0) return 0;
    const totalDurationMs = totalDurationMinutes * 60 * 1000;
    const elapsed = totalDurationMs - (remaining || 0);
    const percentage = (elapsed / totalDurationMs) * 100;
    return Math.max(0, Math.min(100, percentage)); // Clamp between 0 and 100
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'created': return 'bg-gray-500';
      case 'active': return 'bg-blue-500';
      case 'executed': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500';
      case 'expired': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
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
      {/* Header with Create Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Trade Signal Management</h2>
          <p className="text-muted-foreground">Create and manage automated trading signals</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          Create Signal
        </Button>
      </div>

      {/* Active Signals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : signals.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="p-12 text-center">
              <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No Trade Signals</h3>
              <p className="text-muted-foreground">Create your first trade signal to get started</p>
            </CardContent>
          </Card>
        ) : (
          signals.map((signal) => (
            <Card key={signal.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{signal.signal_name}</CardTitle>
                  <Badge className={getStatusColor(signal.status)}>
                    {signal.status.toUpperCase()}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  {signal.commodity} • {signal.trade_direction.toUpperCase()}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Take Profit</div>
                    <div className="font-semibold text-green-600">+{signal.take_profit_percentage}%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Stop Loss</div>
                    <div className="font-semibold text-red-600">-{signal.stop_loss_percentage}%</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Participants</div>
                    <div className="font-semibold">{signal.total_participants}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Total Volume</div>
                    <div className="font-semibold">${signal.total_investment_amount.toFixed(2)}</div>
                  </div>
                </div>

                {/* Timer Display */}
                {signal.status === 'active' && signal.execution_time && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Time Remaining</span>
                      <Clock className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="text-center">
                      <div className="font-mono text-lg font-bold">
                        {formatTimeRemaining(timers[signal.id] || 0)}
                      </div>
<Progress 
                        value={calculateProgress(timers[signal.id], signal.timer_duration_minutes)}
                        className="h-2 mt-2"
                      />
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-2">
                  {signal.status === 'created' && (
                    <Button
                      onClick={() => startTimer(signal.id, signal.timer_duration_minutes)}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Start Timer ({signal.timer_duration_minutes}m)
                    </Button>
                  )}

                  {signal.status === 'active' && (
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        onClick={() => executeSignal(signal.id, 'profit')}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <TrendingUp className="h-4 w-4 mr-1" />
                        Force Win
                      </Button>
                      <Button
                        onClick={() => executeSignal(signal.id, 'loss')}
                        size="sm"
                        className="bg-red-600 hover:bg-red-700"
                      >
                        <TrendingDown className="h-4 w-4 mr-1" />
                        Force Loss
                      </Button>
                    </div>
                  )}

                  {signal.status === 'executed' && (
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm font-medium">
                        Result: <span className={`${signal.execution_result === 'profit' ? 'text-green-600' : 'text-red-600'}`}>
                          {signal.execution_result?.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Executed: {signal.executed_at ? new Date(signal.executed_at).toLocaleString() : 'N/A'}
                      </div>
                    </div>
                  )}
                </div>

                <div className="text-xs text-muted-foreground">
                  Created: {new Date(signal.created_at).toLocaleString()}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Create Signal Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Trade Signal</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Signal Name</Label>
                <Input
                  placeholder="e.g., Gold Bullish Signal"
                  value={newSignal.signal_name}
                  onChange={(e) => setNewSignal({...newSignal, signal_name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Commodity</Label>
                <Select value={newSignal.commodity} onValueChange={(value) => setNewSignal({...newSignal, commodity: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select commodity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GOLD">Gold (XAU/USD)</SelectItem>
                    <SelectItem value="SILVER">Silver (XAG/USD)</SelectItem>
                    <SelectItem value="OIL">Crude Oil (WTI)</SelectItem>
                    <SelectItem value="BTC">Bitcoin (BTC/USD)</SelectItem>
                    <SelectItem value="ETH">Ethereum (ETH/USD)</SelectItem>
                    <SelectItem value="EUR/USD">EUR/USD</SelectItem>
                    <SelectItem value="GBP/USD">GBP/USD</SelectItem>
                    <SelectItem value="AAPL">Apple Stock</SelectItem>
                    <SelectItem value="TSLA">Tesla Stock</SelectItem>
                    <SelectItem value="SPX500">S&P 500</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3">
              <Label>Trade Direction</Label>
              <RadioGroup value={newSignal.trade_direction} onValueChange={(value: 'buy' | 'sell') => setNewSignal({...newSignal, trade_direction: value})}>
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="buy" id="buy" />
                    <Label htmlFor="buy" className="text-green-600 font-semibold">BUY Signal</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="sell" id="sell" />
                    <Label htmlFor="sell" className="text-red-600 font-semibold">SELL Signal</Label>
                  </div>
                </div>
              </RadioGroup>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Take Profit (%)</Label>
                <Input
                  type="number"
                  step="0.1"
                  min="0.1"
                  max="100"
                  placeholder="10.0"
                  value={newSignal.take_profit_percentage}
                  onChange={(e) => setNewSignal({...newSignal, take_profit_percentage: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Stop Loss (%)</Label>
                <Input
                  type="number"
                  step="0.1"
                  min="0.1"
                  max="100"
                  placeholder="5.0"
                  value={newSignal.stop_loss_percentage}
                  onChange={(e) => setNewSignal({...newSignal, stop_loss_percentage: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Timer Duration (minutes)</Label>
                <Select value={newSignal.timer_duration_minutes} onValueChange={(value) => setNewSignal({...newSignal, timer_duration_minutes: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
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
              <div className="space-y-2">
                <Label>Win Probability (%)</Label>
                <Input
                  type="number"
                  min="10"
                  max="90"
                  value={newSignal.win_probability}
                  onChange={(e) => setNewSignal({...newSignal, win_probability: e.target.value})}
                />
              </div>
            </div>

            <div className="flex space-x-4">
              <Button onClick={createSignal} className="flex-1">
                Create Signal
              </Button>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}