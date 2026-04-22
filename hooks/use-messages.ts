'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase-client';
import { Message } from '@/lib/database.types';
import { useAuth } from './use-auth';
import { toast } from 'sonner';

// Global subscription manager to prevent multiple connections
let globalMessageSubscription: any = null;
let subscriptionCount = 0;

export function useMessages() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchMessages();
      
      // Set up real-time subscription only if none exists
      if (supabase && !globalMessageSubscription) {
        subscriptionCount++;
        console.log('🔄 Setting up messages subscription, count:', subscriptionCount);
        
        globalMessageSubscription = supabase
          .channel('messages-global')
          .on(
            'postgres_changes',
            {
              event: 'INSERT',
              schema: 'public',
              table: 'messages',
            },
            (payload) => {
              const newMessage = payload.new as Message;
              // Only update if message is for current user
              if (newMessage.user_id === user.id) {
                setMessages(prev => [newMessage, ...prev]);
                toast.info('New message received');
              }
            }
          )
          .subscribe();
      } else if (globalMessageSubscription) {
        subscriptionCount++;
        console.log('🔄 Reusing existing messages subscription, count:', subscriptionCount);
      }

      return () => {
        subscriptionCount--;
        console.log('🔄 Decreasing subscription count:', subscriptionCount);
        
        // Only unsubscribe when no components are using it
        if (subscriptionCount <= 0 && globalMessageSubscription) {
          console.log('🔄 Cleaning up messages subscription');
          globalMessageSubscription.unsubscribe();
          globalMessageSubscription = null;
          subscriptionCount = 0;
        }
      };
    } else {
      setMessages([]);
      setLoading(false);
    }
  }, [user]);

  const fetchMessages = async () => {
    if (!supabase || !user) return;

    setLoading(true);
    setError(null);

    const { data, error: fetchError } = await supabase
      .from('messages')
      .select(`
        *,
        profiles!messages_sender_id_fkey (
          id,
          full_name,
          email
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (fetchError) {
      setError(fetchError.message);
    } else {
      setMessages(data || []);
    }

    setLoading(false);
  };

  const markAsRead = async (messageId: string) => {
    if (!supabase) return;

    const { error } = await supabase
      .from('messages')
      .update({ 
        is_read: true,
        read_at: new Date().toISOString(),
      })
      .eq('id', messageId)
      .eq('user_id', user?.id);

    if (!error) {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === messageId 
            ? { ...msg, is_read: true, read_at: new Date().toISOString() }
            : msg
        )
      );
    }
  };

  const getUnreadCount = () => messages.filter(msg => !msg.is_read).length;

  return {
    messages,
    loading,
    error,
    refetch: fetchMessages,
    markAsRead,
    getUnreadCount,
  };
}