'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase-client';
import { Profile, Balance, Trade, Deposit, Withdrawal, Database } from '@/lib/database.types';
import { toast } from 'sonner';

export function useAdminActions() {
  const [loading, setLoading] = useState(false);

  // User management actions
  const approveUser = async (userId: string) => {
    if (!supabase) return { success: false };
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          account_status: 'active',
          is_email_verified: true,
          updated_at: new Date().toISOString()
        } as any)
        .eq('id', userId);

      if (error) throw error;
      
      toast.success('User approved successfully');
      return { success: true };
    } catch (error: any) {
      toast.error('Failed to approve user: ' + error.message);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const lockAccount = async (userId: string) => {
    if (!supabase) return { success: false };
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          account_status: 'locked',
          updated_at: new Date().toISOString()
        } as any)
        .eq('id', userId);

      if (error) throw error;
      
      toast.success('Account locked successfully');
      return { success: true };
    } catch (error: any) {
      toast.error('Failed to lock account: ' + error.message);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const unlockAccount = async (userId: string) => {
    if (!supabase) return { success: false };
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          account_status: 'active',
          updated_at: new Date().toISOString()
        } as any)
        .eq('id', userId);

      if (error) throw error;
      
      toast.success('Account unlocked successfully');
      return { success: true };
    } catch (error: any) {
      toast.error('Failed to unlock account: ' + error.message);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const setTradeResult = async (
    tradeId: string,
    result: 'profit' | 'loss'
  ) => {
    if (!supabase) return { success: false };
    setLoading(true);
  
    try {
      // 1. Fetch the trade with user_id
      const { data: trade, error } = await supabase
        .from('trades')
        .select('*, user_id')
        .eq('id', tradeId)
        .single();
  
      if (error || !trade) throw new Error('Trade not found');
  
      // 2. Calculate P&L (10% of trade value)
      let pnl = 0;
      if (result === 'profit') pnl = (trade as any).volume * (trade as any).unit_worth * 0.1;
      else pnl = -(trade as any).volume * (trade as any).unit_worth * 0.1;
  
      // Assume exit_price = current_price when trade is closed
      const exitPrice = (trade as any).current_price ?? (trade as any).unit_worth;
  
      // 3. Update the trade with P&L and exit_price
      const { error: updateError } = await supabase
        .from('trades')
        .update({
          unrealized_pnl: pnl,
          realized_pnl: pnl,
          exit_price: exitPrice,
          status: 'closed',
          closed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } as any)
        .eq('id', tradeId);
  
      if (updateError) throw updateError;
  
      // 4. Update the user's balance in USD
      const { data: balanceRow, error: balanceFetchError } = await supabase
        .from('balances')
        .select('balance')
        .eq('user_id', (trade as any).user_id)
        .eq('currency', 'USD')
        .single();
  
      if (balanceFetchError && balanceFetchError.code !== 'PGRST116') {
        throw balanceFetchError;
      }
  
      const newBalance = ((balanceRow as any)?.balance || 0) + pnl;
  
      const { error: balanceUpdateError } = await supabase
        .from('balances')
        .upsert(
          {
            user_id: (trade as any).user_id,
            currency: 'USD',
            balance: newBalance,
            available_balance: newBalance,
            locked_balance: 0,
            updated_at: new Date().toISOString(),
          } as any,
          { onConflict: 'user_id,currency' }
        );
  
      if (balanceUpdateError) throw balanceUpdateError;
  
      toast.success(
        `Trade marked as ${result}. Balance updated to ${newBalance.toFixed(2)} USD`
      );
      return { success: true };
    } catch (err: any) {
      toast.error('Failed to set trade result: ' + err.message);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };
  
  

  const updateBalance = async (userId: string, currency: string, amount: number) => {
    if (!supabase) return { success: false };
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('balances')
        .upsert({
          user_id: userId,
          currency,
          balance: amount,
          available_balance: amount,
          locked_balance: 0,
          updated_at: new Date().toISOString()
        } as any, {
          onConflict: 'user_id,currency'
        });

      if (error) throw error;
      
      toast.success(`${currency} balance updated to ${amount}`);
      return { success: true };
    } catch (error: any) {
      toast.error('Failed to update balance: ' + error.message);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const toggleVerification = async (userId: string, field: string, currentValue: boolean) => {
    if (!supabase) return { success: false };
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          [field]: !currentValue,
          updated_at: new Date().toISOString()
        } as any)
        .eq('id', userId);

      if (error) throw error;
      
      const fieldName = field.replace('is_', '').replace('_verified', '');
      toast.success(`${fieldName} verification ${!currentValue ? 'enabled' : 'disabled'}`);
      return { success: true };
    } catch (error: any) {
      toast.error('Failed to update verification: ' + error.message);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const activateDemoAccount = async (userId: string) => {
    if (!supabase) return { success: false };
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          account_type: 'demo',
          is_demo: true,
          account_status: 'active',
          updated_at: new Date().toISOString()
        } as any)
        .eq('id', userId);

      if (error) throw error;
      
      // Create demo balance
      await supabase
        .from('balances')
        .upsert({
          user_id: userId,
          currency: 'USD',
          balance: 10000, // Demo balance
          available_balance: 10000,
          locked_balance: 0,
        } as any);
      
      toast.success('Demo account activated with $10,000');
      return { success: true };
    } catch (error: any) {
      toast.error('Failed to activate demo account: ' + error.message);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const activateLiveAccount = async (userId: string) => {
    if (!supabase) return { success: false };
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          account_type: 'live',
          is_live: true,
          account_status: 'active',
          updated_at: new Date().toISOString()
        } as any)
        .eq('id', userId);

      if (error) throw error;
      
      toast.success('Live account activated');
      return { success: true };
    } catch (error: any) {
      toast.error('Failed to activate live account: ' + error.message);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  // Deposit management
  const approveDeposit = async (depositId: string) => {
    if (!supabase) return { success: false };
    
    setLoading(true);
    try {
      // Get deposit details
      const { data: deposit, error: fetchError } = await supabase
        .from('deposits')
        .select('*')
        .eq('id', depositId)
        .single();

      if (fetchError) throw fetchError;

      // Update deposit status
      const { error: updateError } = await supabase
        .from('deposits')
        .update({ 
          status: 'completed',
          processed_at: new Date().toISOString()
        })
        .eq('id', depositId);

      if (updateError) throw updateError;

      // Update user balance
      const { error: balanceError } = await supabase.rpc('update_user_balance', {
        p_user_id: (deposit as any).user_id,
        p_currency: (deposit as any).currency,
        p_amount: (deposit as any).amount
      });

      if (balanceError) {
        // Fallback: direct balance update
        const { data: existingBalance } = await supabase
          .from('balances')
          .select('balance, available_balance')
          .eq('user_id', deposit.user_id)
          .eq('currency', deposit.currency)
          .single();

        const newBalance = ((existingBalance as any)?.balance || 0) + (deposit as any).amount;
        const newAvailableBalance = ((existingBalance as any)?.available_balance || 0) + (deposit as any).amount;

        await supabase
          .from('balances')
          .upsert({
            user_id: (deposit as any).user_id,
            currency: (deposit as any).currency,
            balance: newBalance,
            available_balance: newAvailableBalance,
            locked_balance: 0,
            updated_at: new Date().toISOString()
          } as any, {
            onConflict: 'user_id,currency'
          });
      }

      toast.success(`Deposit of ${(deposit as any).currency} ${(deposit as any).amount} approved`);
      return { success: true };
    } catch (error: any) {
      toast.error('Failed to approve deposit: ' + error.message);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const rejectDeposit = async (depositId: string) => {
    if (!supabase) return { success: false };
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('deposits')
        .update({ 
          status: 'failed',
          processed_at: new Date().toISOString()
        })
        .eq('id', depositId);

      if (error) throw error;
      
      toast.success('Deposit rejected');
      return { success: true };
    } catch (error: any) {
      toast.error('Failed to reject deposit: ' + error.message);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const approveWithdrawal = async (withdrawalId: string) => {
    if (!supabase) return { success: false };
    
    setLoading(true);
    try {
      // Get withdrawal details
      const { data: withdrawal, error: fetchError } = await supabase
        .from('withdrawals')
        .select('*')
        .eq('id', withdrawalId)
        .single();

      if (fetchError) throw fetchError;

      // Check if user has sufficient balance
      const { data: balance } = await supabase
        .from('balances')
        .select('balance')
        .eq('user_id', withdrawal.user_id)
        .eq('currency', withdrawal.currency)
        .single();

      if (!balance || balance.balance < withdrawal.amount) {
        toast.error('Insufficient balance for withdrawal');
        return { success: false };
      }

      // Update withdrawal status
      const { error: updateError } = await supabase
        .from('withdrawals')
        .update({ 
          status: 'completed',
          processed_at: new Date().toISOString()
        })
        .eq('id', withdrawalId);

      if (updateError) throw updateError;

      // Deduct from user balance
      const { error: balanceError } = await supabase
        .from('balances')
        .update({
          balance: balance.balance - withdrawal.amount,
          available_balance: balance.balance - withdrawal.amount,
        })
        .eq('user_id', withdrawal.user_id)
        .eq('currency', withdrawal.currency);

      if (balanceError) throw balanceError;

      toast.success(`Withdrawal of ${withdrawal.currency} ${withdrawal.amount} approved`);
      return { success: true };
    } catch (error: any) {
      toast.error('Failed to approve withdrawal: ' + error.message);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const rejectWithdrawal = async (withdrawalId: string) => {
    if (!supabase) return { success: false };
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('withdrawals')
        .update({ 
          status: 'failed',
          processed_at: new Date().toISOString()
        })
        .eq('id', withdrawalId);

      if (error) throw error;
      
      toast.success('Withdrawal rejected');
      return { success: true };
    } catch (error: any) {
      toast.error('Failed to reject withdrawal: ' + error.message);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  // Trade management
  const closeTrade = async (tradeId: string) => {
    if (!supabase) return { success: false };
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('trades')
        .update({ 
          status: 'closed',
          closed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', tradeId);

      if (error) throw error;
      
      toast.success('Trade closed successfully');
      return { success: true };
    } catch (error: any) {
      toast.error('Failed to close trade: ' + error.message);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const toggleSignalLock = async (tradeId: string, currentLocked: boolean) => {
    if (!supabase) return { success: false };
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('trades')
        .update({ 
          signal_locked: !currentLocked,
          updated_at: new Date().toISOString()
        })
        .eq('id', tradeId);

      if (error) throw error;
      
      toast.success(`Trade ${!currentLocked ? 'locked' : 'unlocked'} successfully`);
      return { success: true };
    } catch (error: any) {
      toast.error('Failed to toggle signal lock: ' + error.message);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  // Message management
  const sendMessage = async (messageData: {
    recipient_type: 'all' | 'specific';
    recipient_id?: string;
    title: string;
    content: string;
    message_type: string;
    is_important: boolean;
  }, users: Profile[], senderId: string) => {
    if (!supabase) return { success: false };
    
    setLoading(true);
    try {
      if (messageData.recipient_type === 'all') {
        // Send to all users
        const messages = users.map(user => ({
          user_id: user.id,
          sender_id: senderId,
          title: messageData.title,
          content: messageData.content,
          message_type: messageData.message_type,
          is_important: messageData.is_important,
        }));

        const { error } = await supabase
          .from('messages')
          .insert(messages);

        if (error) throw error;
        
        toast.success(`Message sent to ${users.length} users`);
      } else if (messageData.recipient_id) {
        // Send to specific user
        const { error } = await supabase
          .from('messages')
          .insert({
            user_id: messageData.recipient_id,
            sender_id: senderId,
            title: messageData.title,
            content: messageData.content,
            message_type: messageData.message_type,
            is_important: messageData.is_important,
          });

        if (error) throw error;
        
        toast.success('Message sent successfully');
      }

      return { success: true };
    } catch (error: any) {
      toast.error('Failed to send message: ' + error.message);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  // Package management
  const upgradeUserPackage = async (userId: string, packageId: string) => {
    if (!supabase) return { success: false };
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          package_id: packageId,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;
      
      toast.success('User package updated successfully');
      return { success: true };
    } catch (error: any) {
      toast.error('Failed to update user package: ' + error.message);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  // Balance Adjustment with Audit Trail
  const adjustUserBalance = async (params: {
    adminId: string;
    userId: string;
    amount: number;
    currency: 'USD' | 'BTC' | 'ETH';
    accountType: 'demo' | 'live';
    adjustmentType: 'increase' | 'decrease';
    adminNotes: string;
  }) => {
    const { adminId, userId, amount, currency, accountType, adjustmentType, adminNotes } = params;
    if (!supabase) return { success: false };
    
    setLoading(true);

    try {
      // Get current balance
      const { data: balanceData, error: fetchError } = await supabase
        .from('balances')
        .select('balance')
        .eq('user_id', userId)
        .eq('currency', currency)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;

      const previousBalance = Number((balanceData as any)?.balance || 0);
      const newBalance = adjustmentType === 'increase' ? previousBalance + amount : previousBalance - amount;

      if (newBalance < 0) {
        throw new Error('Cannot reduce balance below 0');
      }

      // Upsert balance
      const { error: upsertError } = await (supabase as any).from('balances').upsert({
        user_id: userId,
        currency,
        balance: newBalance,
        available_balance: newBalance,
        locked_balance: 0,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id,currency' });

      if (upsertError) throw upsertError;

      // Log audit trail (optional - don't fail if table doesn't exist)
      try {
        const { error: logError } = await (supabase as any).from('admin_balance_adjustments').insert([{
          user_id: userId,
          admin_id: adminId,
          currency,
          adjustment_type: adjustmentType,
          amount,
          previous_balance: previousBalance,
          new_balance: newBalance,
          account_type: accountType,
          admin_notes: adminNotes,
          created_at: new Date().toISOString(),
        }]);
        
        if (logError) {
          console.warn('Audit trail logging failed:', logError.message);
        }
      } catch (auditError) {
        console.warn('Audit trail table may not exist:', auditError);
      }

      toast.success(`Balance ${adjustmentType === 'increase' ? 'added' : 'reduced'} successfully`);
      return { success: true };
    } catch (err: any) {
      toast.error(err.message || 'Failed to adjust balance');
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    approveUser,
    lockAccount,
    unlockAccount,
    setTradeResult,
    updateBalance,
    adjustUserBalance,
    toggleVerification: async (userId: string, field: string, currentValue: boolean) => {
      if (!supabase) return { success: false };
      
      setLoading(true);
      try {
        const { error } = await supabase
          .from('profiles')
          .update({ 
            [field]: !currentValue,
            updated_at: new Date().toISOString()
          })
          .eq('id', userId);

        if (error) throw error;
        
        const fieldName = field.replace('is_', '').replace('_verified', '');
        toast.success(`${fieldName} verification ${!currentValue ? 'enabled' : 'disabled'}`);
        return { success: true };
      } catch (error: any) {
        toast.error('Failed to update verification: ' + error.message);
        return { success: false };
      } finally {
        setLoading(false);
      }
    },
    activateDemoAccount,
    activateLiveAccount,
    approveDeposit,
    rejectDeposit,
    approveWithdrawal,
    rejectWithdrawal,
    closeTrade,
    toggleSignalLock,
    sendMessage,
    upgradeUserPackage,
    // Signal management
    executeSignal: async (signalId: string) => {
      if (!supabase) return { success: false };
      
      setLoading(true);
      try {
        // Call the edge function to execute signal
        const apiUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/execute-signal`;
        const headers = {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        };

        const response = await fetch(apiUrl, {
          method: 'POST',
          headers,
          body: JSON.stringify({ signal_id: signalId })
        });

        const result = await response.json();
        toast.success(`Signal executed with ${result.participants} participants`);
        return { success: true, data: result };
      } catch (error: any) {
        toast.error('Failed to execute signal: ' + error.message);
        return { success: false };
      } finally {
        setLoading(false);
      }
    },
    markExpiredSignals: async () => {
      if (!supabase) return { success: false };
      
      setLoading(true);
      try {
        // Call the edge function to mark expired signals
        const apiUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/mark-expired-signals`;
        const headers = {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        };
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers
        });
        
        if (!response.ok) {
          throw new Error('Failed to mark expired signals');
        }
        
        const result = await response.json();
        toast.success(`Processed ${result.expired_count} expired signals`);
        return { success: true, data: result };
      } catch (error: any) {
        toast.error('Failed to mark expired signals: ' + error.message);
        return { success: false };
      } finally {
        setLoading(false);
      }
    },
  };
}