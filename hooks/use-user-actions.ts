'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase-client';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/use-auth';

export function useUserActions() {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Profile management
  const updateProfile = async (userId: string, profileData: {
    first_name?: string;
    last_name?: string;
    phone_number?: string;
    country?: string;
    profile_image_url?: string;
  }) => {
    if (!supabase) return { success: false };
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          ...profileData,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;
      
      toast.success('Profile updated successfully');
      return { success: true };
    } catch (error: any) {
      toast.error('Failed to update profile: ' + error.message);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  // Password management
  const changePassword = async (currentPassword: string, newPassword: string) => {
    if (!supabase) return { success: false };
    
    setLoading(true);
    try {
      // First verify current password by attempting to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user?.email || '',
        password: currentPassword
      });

      if (signInError) {
        throw new Error('Current password is incorrect');
      }

      // Now update the password
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;
      
      toast.success('Password updated successfully');
      return { success: true };
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to update password';
      toast.error(errorMessage);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  // Deposit request
  const requestDeposit = async (userId: string, depositData: {
    amount: number;
    currency: string;
    payment_method: string;
  }) => {
    if (!supabase) return { success: false };
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('deposits')
        .insert({
          user_id: userId,
          amount: depositData.amount,
          currency: depositData.currency,
          payment_method: depositData.payment_method,
          status: 'pending',
        });

      if (error) throw error;
      
      toast.success('Deposit request submitted successfully');
      return { success: true };
    } catch (error: any) {
      toast.error('Failed to submit deposit request: ' + error.message);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  // Withdrawal request
  const requestWithdrawal = async (userId: string, withdrawalData: {
    amount: number;
    currency: string;
    withdrawal_method: string;
    destination_address?: string;
    bank_details?: any;
  }) => {
    if (!supabase) return { success: false };
    
    setLoading(true);
    try {
      // Check balance first
      const { data: balance } = await supabase
        .from('balances')
        .select('balance')
        .eq('user_id', userId)
        .eq('currency', withdrawalData.currency)
        .single();

      if (!balance || balance.balance < withdrawalData.amount) {
        toast.error('Insufficient balance for withdrawal');
        return { success: false };
      }

      const { error } = await supabase
        .from('withdrawals')
        .insert({
          user_id: userId,
          amount: withdrawalData.amount,
          currency: withdrawalData.currency,
          withdrawal_method: withdrawalData.withdrawal_method,
          destination_address: withdrawalData.destination_address,
          bank_details: withdrawalData.bank_details,
          status: 'pending',
        });

      if (error) throw error;
      
      toast.success('Withdrawal request submitted successfully');
      return { success: true };
    } catch (error: any) {
      toast.error('Failed to submit withdrawal request: ' + error.message);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  // Account verification requests
  const requestEmailVerification = async () => {
    if (!supabase) return { success: false };
    if (!user) return { success: false };
    
    setLoading(true);
    try {
      // In a real implementation, you would send a verification email
      // For demo purposes, we'll simulate email verification
      const { error } = await supabase
        .from('profiles')
        .update({
          is_email_verified: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;
      
      // Send notification message
      await supabase
        .from('messages')
        .insert({
          user_id: user.id,
          title: 'Email Verification Complete',
          content: 'Your email address has been successfully verified. You now have access to additional platform features.',
          message_type: 'system',
          is_important: true,
        });

      toast.success('Email verified successfully');
      
      // Refresh the page to show updated verification status
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
      return { success: true };
    } catch (error: any) {
      toast.error('Failed to verify email: ' + error.message);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const requestDemoAccount = async (userId: string) => {
    if (!supabase) return { success: false };
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          account_type: 'demo',
          is_demo: true,
          account_status: 'pending',
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;
      
      toast.success('Demo account request submitted');
      return { success: true };
    } catch (error: any) {
      toast.error('Failed to request demo account: ' + error.message);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const requestLiveAccount = async (userId: string) => {
    if (!supabase) return { success: false };
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          account_type: 'live',
          is_live: true,
          account_status: 'pending',
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;
      
      toast.success('Live account request submitted');
      return { success: true };
    } catch (error: any) {
      toast.error('Failed to request live account: ' + error.message);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const uploadVerificationDocument = async (userId: string, documentType: string, file: File) => {
    if (!supabase) return { success: false };
    
    setLoading(true);
    try {
      // In a real implementation, you would upload to Supabase Storage
      // For now, we'll just simulate the upload
      toast.success(`${documentType} document uploaded for verification`);
      return { success: true };
    } catch (error: any) {
      toast.error('Failed to upload document: ' + error.message);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  // Send message to admin
  const sendMessageToAdmin = async (messageData: {
    title: string;
    content: string;
    message_type?: string;
    is_important?: boolean;
  }) => {
    if (!supabase || !user) return { success: false };
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          user_id: 'admin', // This will need to be updated to actual admin user ID
          sender_id: user.id,
          title: messageData.title,
          content: messageData.content,
          message_type: messageData.message_type || 'admin',
          is_important: messageData.is_important || false,
        });

      if (error) throw error;
      
      toast.success('Message sent to admin successfully');
      return { success: true };
    } catch (error: any) {
      toast.error('Failed to send message: ' + error.message);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    updateProfile,
    changePassword,
    requestDeposit,
    requestWithdrawal,
    requestEmailVerification,
    requestDemoAccount,
    requestLiveAccount,
    uploadVerificationDocument,
    sendMessageToAdmin,
  };
}