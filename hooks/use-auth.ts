// hooks/use-auth.ts
'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase-client';
import { Profile } from '@/lib/database.types';
import { User } from '@supabase/supabase-js';

// --- Simple debounce helper ---
const debounce = (fn: (...args: any[]) => void, delay: number) => {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return (...args: any[]) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [initialLoaded, setInitialLoaded] = useState(false);

  const isMounted = useRef(true);
  const sessionCheckInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const initializing = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      if (sessionCheckInterval.current) clearInterval(sessionCheckInterval.current);
    };
  }, []);

  const resetAuthState = () => {
    if (!isMounted.current) return;
    setUser(null);
    setProfile(null);
    setIsAuthenticated(false);
    setIsAdmin(false);
    setLoading(false);
  };

  const loadProfile = async (userId: string) => {
    if (!isMounted.current || !userId) return;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          packages (
            id,
            name,
            display_name,
            features
          )
        `)
        .eq('id', userId)
        .single();

      if (error) {
        console.log('Profile not found or error:', error.message);
        return;
      }

      if (isMounted.current) {
        setProfile(data as Profile);
        setIsAdmin((data as any)?.is_admin || false);
      }
    } catch (err) {
      console.error('Error loading profile:', err);
    }
  };

  const refreshSession = async () => {
    if (!supabase || !isMounted.current) return;
    try {
      const { data: { session }, error } = await supabase.auth.refreshSession();
      if (error) return;
      if (session?.user && isMounted.current) {
        setUser(session.user);
        setIsAuthenticated(true);
        await loadProfile(session.user.id);
      } else {
        resetAuthState();
      }
    } catch (err) {
      console.error('Error refreshing session:', err);
    }
  };

  useEffect(() => {
    if (initializing.current) return;
    initializing.current = true;

    const init = async () => {
      if (!supabase) {
        console.error('Supabase client not available in browser.');
        setLoading(false);
        setInitialLoaded(true);
        return;
      }

      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user) {
          if (isMounted.current) {
            setUser(session.user);
            setIsAuthenticated(true);
          }
          await loadProfile(session.user.id);

          sessionCheckInterval.current = setInterval(() => refreshSession(), 50 * 60 * 1000);
        } else {
          resetAuthState();
        }
      } catch (err) {
        console.error('Error initializing session:', err);
        resetAuthState();
      } finally {
        if (isMounted.current) {
          setLoading(false);
          setInitialLoaded(true);
        }
      }
    };

    init();

    // --- Debounced auth state listener ---
    const debouncedAuthListener = debounce(async (event: string, session: any) => {
      if (!isMounted.current) return;

      if (session?.user) {
        setUser(session.user);
        setIsAuthenticated(true);
        await loadProfile(session.user.id);
      } else {
        resetAuthState();
      }
    }, 50); // 50ms debounce prevents rapid reload loops

    const { data: { subscription } } = supabase.auth.onAuthStateChange(debouncedAuthListener);

    return () => {
      subscription.unsubscribe();
      if (sessionCheckInterval.current) clearInterval(sessionCheckInterval.current);
    };
  }, []);

  const refreshProfile = async () => {
    if (!user || !supabase) return { success: false };
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          packages (
            id,
            name,
            display_name,
            features
          )
        `)
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error refreshing profile:', error);
        return { success: false };
      }

      setProfile(data as Profile);
      setIsAdmin((data as any)?.is_admin || false);
      return { success: true };
    } catch (err) {
      console.error('Failed to refresh profile:', err);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const clearCache = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user-profile-cache');
      localStorage.removeItem('user-balance-cache');
      localStorage.removeItem('dashboard-cache');
      sessionStorage.clear();
      resetAuthState();
    }
  };

  return {
    user,
    profile,
    loading,
    isAuthenticated,
    isAdmin,
    refreshProfile,
    clearCache,
    initialLoaded,
  };
}
