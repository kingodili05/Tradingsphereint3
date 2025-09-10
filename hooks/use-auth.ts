// hooks/use-auth.ts
'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase-client';
import { Profile } from '@/lib/database.types';
import { User } from '@supabase/supabase-js';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [initialLoaded, setInitialLoaded] = useState(false); // indicates first session check done
  const isComponentMounted = useRef(true);
  const sessionCheckInterval = useRef<ReturnType<typeof setInterval>>();

  // --- Mount handling ---
  useEffect(() => {
    setMounted(true);
    return () => {
      isComponentMounted.current = false;
      if (sessionCheckInterval.current) clearInterval(sessionCheckInterval.current);
    };
  }, []);

  // --- Reset auth state safely ---
  const resetAuthState = () => {
    if (!isComponentMounted.current) return;
    setUser(null);
    setProfile(null);
    setIsAuthenticated(false);
    setIsAdmin(false);
    setLoading(false);
  };

  // --- Load user profile ---
  const loadProfile = async (userId: string) => {
    if (!isComponentMounted.current || !userId) return;
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

      if (isComponentMounted.current) {
        setProfile(data as Profile);
        setIsAdmin((data as any)?.is_admin || false);
      }
    } catch (err) {
      console.error('Error loading profile:', err);
    }
  };

  // --- Refresh Supabase session ---
  const refreshSession = async () => {
    if (!supabase || !isComponentMounted.current) return;
    try {
      const { data: { session }, error } = await supabase.auth.refreshSession();
      if (error) {
        console.log('Session refresh failed:', error.message);
        return;
      }

      if (session?.user && isComponentMounted.current) {
        setUser(session.user);
        setIsAuthenticated(true);
        await loadProfile(session.user.id);
      }
    } catch (err) {
      console.error('Error refreshing session:', err);
    }
  };

  // --- Initial session check ---
  useEffect(() => {
    if (!mounted) return;
    if (!supabase) {
      console.error('Supabase client not available in browser.');
      if (isComponentMounted.current) setLoading(false);
      return;
    }

    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user) {
          if (isComponentMounted.current) {
            setUser(session.user);
            setIsAuthenticated(true);
          }
          await loadProfile(session.user.id);
          // Set periodic refresh every 50 minutes
          sessionCheckInterval.current = setInterval(() => refreshSession(), 50 * 60 * 1000);
        } else {
          resetAuthState();
        }
      } catch (err) {
        console.error('Error getting session:', err);
        resetAuthState();
      } finally {
        if (isComponentMounted.current) setInitialLoaded(true);
        setLoading(false);
      }
    };

    getInitialSession();

    // --- Auth state listener ---
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isComponentMounted.current) return;
      if (session?.user) {
        setUser(session.user);
        setIsAuthenticated(true);
        await loadProfile(session.user.id);
      } else {
        resetAuthState();
      }
    });

    return () => {
      subscription.unsubscribe();
      if (sessionCheckInterval.current) clearInterval(sessionCheckInterval.current);
    };
  }, [mounted]);

  // --- Refresh profile manually ---
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

  // --- Clear cache safely ---
  const clearCache = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user-profile-cache');
      localStorage.removeItem('user-balance-cache');
      localStorage.removeItem('dashboard-cache');
      sessionStorage.clear();
      resetAuthState();
    }
  };

  // --- Prevent hydration mismatch ---
  if (!mounted) {
    return {
      user: null,
      profile: null,
      loading: true,
      isAuthenticated: false,
      isAdmin: false,
      refreshProfile,
      clearCache,
      initialLoaded: false,
    };
  }

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
