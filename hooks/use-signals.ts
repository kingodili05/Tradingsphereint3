'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase-client';
import { Signal, SignalUsage } from '@/lib/database.types';
import { useAuth } from './use-auth';
import { toast } from 'sonner';

export function useSignals() {
  const { user } = useAuth();
  const [signals, setSignals] = useState<Signal[]>([]);
  const [userSignalUsage, setUserSignalUsage] = useState<SignalUsage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSignals();
    if (user) {
      fetchUserSignalUsage();
    }
  }, [user]);

  const fetchSignals = async () => {
    if (!supabase) return;

    setLoading(true);
    setError(null);

    // Fetch from admin_trade_signals table where admin creates signals
    const { data, error: fetchError } = await supabase
      .from('admin_trade_signals')
      .select('*')
      .eq('status', 'active') // Only show active signals to users
      .order('created_at', { ascending: false });

    if (fetchError) {
      setError(fetchError.message);
    } else {
      // Transform admin signals to match Signal interface
      const transformedSignals = (data || []).map(adminSignal => ({
        id: adminSignal.id,
        name: adminSignal.signal_name,
        description: `${adminSignal.commodity} - ${adminSignal.trade_direction.toUpperCase()} Signal`,
        profit_target: adminSignal.take_profit_percentage / 100, // Convert percentage to decimal
        loss_limit: adminSignal.stop_loss_percentage / 100,
        expiry: adminSignal.execution_time || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        status: 'open' as const,
        created_by: adminSignal.created_by,
        created_at: adminSignal.created_at,
        updated_at: adminSignal.updated_at
      }));
      setSignals(transformedSignals);
    }

    setLoading(false);
  };

  const fetchUserSignalUsage = async () => {
    if (!supabase || !user) return;

    // Fetch from signal_participants table for admin signals
    const { data, error: fetchError } = await supabase
      .from('signal_participants')
      .select('*')
      .eq('user_id', user.id)
      .order('participated_at', { ascending: false });

    if (fetchError) {
      console.error('Error fetching signal usage:', fetchError);
    } else {
      // Transform to match SignalUsage interface
      const transformedUsage = (data || []).map(participant => ({
        id: participant.id,
        signal_id: participant.signal_id,
        user_id: participant.user_id,
        amount: participant.investment_amount,
        result: participant.profit_loss_amount,
        status: participant.settled_at ? 'settled' : 'pending',
        settled_at: participant.settled_at,
        created_at: participant.participated_at
      }));
      setUserSignalUsage(transformedUsage);
    }
  };

  const createSignal = async (signalData: {
    name: string;
    description?: string;
    profit_target: number;
    loss_limit: number;
    expiry: string;
  }) => {
    if (!supabase || !user) {
      toast.error('Not authenticated');
      return { success: false };
    }

    const { data, error } = await supabase
      .from('signals')
      .insert({
        name: signalData.name,
        description: signalData.description,
        profit_target: signalData.profit_target,
        loss_limit: signalData.loss_limit,
        expiry: signalData.expiry,
        created_by: user.id,
      })
      .select()
      .single();

    if (error) {
      toast.error('Failed to create signal: ' + error.message);
      return { success: false, error };
    }

    toast.success('Signal created successfully');
    await fetchSignals();
    return { success: true, data };
  };

  const joinSignal = async (signalId: string, amount: number) => {
    if (!supabase || !user) {
      toast.error('Not authenticated');
      return { success: false };
    }

    try {
      // Use the join_trade_signal function for admin signals
      const { data, error } = await supabase.rpc('join_trade_signal', {
        p_signal_id: signalId,
        p_investment_amount: amount
      });

      if (error) {
        toast.error('Failed to join signal: ' + error.message);
        return { success: false, error };
      }

      toast.success('Successfully joined signal');
      await fetchUserSignalUsage();
      return { success: true, data };
    } catch (error: any) {
      toast.error('Failed to join signal: ' + error.message);
      return { success: false, error };
    }
  };

  const executeSignal = async (signalId: string) => {
    if (!supabase || !user) {
      toast.error('Not authenticated');
      return { success: false };
    }

    try {
      // Call the signal execution function
      const { data, error } = await supabase.rpc('execute_signal', {
        p_signal_id: signalId
      });

      if (error) throw error;

      toast.success('Signal executed successfully');
      await fetchSignals();
      await fetchUserSignalUsage();
      return { success: true, data };
    } catch (error: any) {
      toast.error('Failed to execute signal: ' + error.message);
      return { success: false, error };
    }
  };

  const cancelSignal = async (signalId: string) => {
    if (!supabase || !user) {
      toast.error('Not authenticated');
      return { success: false };
    }

    const { error } = await supabase
      .from('signals')
      .update({ 
        status: 'cancelled',
        updated_at: new Date().toISOString()
      })
      .eq('id', signalId)
      .eq('created_by', user.id);

    if (error) {
      toast.error('Failed to cancel signal: ' + error.message);
      return { success: false, error };
    }

    toast.success('Signal cancelled successfully');
    await fetchSignals();
    return { success: true };
  };

  const getActiveSignals = () => signals.filter(signal => signal.status === 'open');
  const getExpiredSignals = () => signals.filter(signal => signal.status === 'expired');
  const getUserSignalUsage = (signalId: string) => userSignalUsage.find(usage => usage.signal_id === signalId);

  return {
    signals,
    userSignalUsage,
    loading,
    error,
    refetch: fetchSignals,
    createSignal,
    joinSignal,
    executeSignal,
    cancelSignal,
    getActiveSignals,
    getExpiredSignals,
    getUserSignalUsage,
  };
}