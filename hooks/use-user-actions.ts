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

  const sendNotification = async (endpoint: string, body: object) => {
    try {
      const { data: { session } } = await supabase!.auth.getSession();
      if (!session) return;
      await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify(body),
      });
    } catch {}
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
      const { data, error } = await supabase
        .from('deposits')
        .insert({
          user_id: userId,
          amount: depositData.amount,
          currency: depositData.currency,
          payment_method: depositData.payment_method,
          status: 'pending',
        })
        .select('id')
        .single();

      if (error) throw error;

      if (data?.id) {
        sendNotification('/api/deposit-notification', { depositId: data.id, event: 'submitted' });
      }

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

      const { data: wData, error } = await supabase
        .from('withdrawals')
        .insert({
          user_id: userId,
          amount: withdrawalData.amount,
          currency: withdrawalData.currency,
          withdrawal_method: withdrawalData.withdrawal_method,
          destination_address: withdrawalData.destination_address,
          bank_details: withdrawalData.bank_details,
          status: 'pending',
        })
        .select('id')
        .single();

      if (error) throw error;

      if (wData?.id) {
        sendNotification('/api/withdrawal-notification', { withdrawalId: wData.id, status: 'submitted' });
      }

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
    if (!supabase || !user) return { success: false };

    setLoading(true);
    try {
      // Check current verification status first
      const { data: profileData } = await supabase
        .from('profiles')
        .select('is_email_verified')
        .eq('id', user.id)
        .single();

      if (profileData?.is_email_verified) {
        toast.success('Your email is already verified ✓');
        return { success: true };
      }

      // Send real verification email via Supabase Auth
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tradingsphereint.online';
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email!,
        options: { emailRedirectTo: `${siteUrl}/auth/verify-email` },
      });

      if (error) throw error;

      toast.success('Verification email sent! Check your inbox.');
      return { success: true };
    } catch (error: any) {
      toast.error('Failed to send verification email: ' + error.message);
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
      const fileExt = file.name.split('.').pop() || 'bin';
      const storagePath = `${userId}/${documentType}/${Date.now()}.${fileExt}`;
      let filePath = storagePath;

      // Attempt storage upload — gracefully skip if bucket not yet created
      const { error: storageError } = await supabase.storage
        .from('verification-documents')
        .upload(storagePath, file, { cacheControl: '3600', upsert: false });

      if (storageError) {
        console.warn('[VerifyDoc] Storage upload skipped:', storageError.message);
        filePath = `pending-storage/${storagePath}`;
      }

      // Record in verification_documents table
      const { error: dbError } = await supabase
        .from('verification_documents')
        .insert({
          user_id: userId,
          document_type: documentType,
          file_path: filePath,
          file_name: file.name,
          file_size: file.size,
          mime_type: file.type,
          verification_status: 'pending',
        });

      if (dbError) throw dbError;

      // Notify admin via API (non-blocking)
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      if (token) {
        fetch('/api/verification-notification', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ documentType, userId }),
        }).catch(() => {});
      }

      toast.success('Document submitted! We will review it within 24–48 hours.');
      return { success: true };
    } catch (error: any) {
      toast.error('Failed to submit document: ' + error.message);
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