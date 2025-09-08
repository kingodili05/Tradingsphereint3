'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase-client';
import { Profile } from '@/lib/database.types';
import { User } from '@supabase/supabase-js';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    console.log('Initializing auth...');
    
    let isComponentMounted = true;
    let profileLoadTimeout: NodeJS.Timeout | undefined;

    const loadProfile = async (userId: string) => {
      if (!supabase) {
        console.error('❌ Supabase client not available');
        if (isComponentMounted) setLoading(false);
        return;
      }
      
      if (!userId) {
        if (isComponentMounted) setLoading(false);
        return;
      }

      // Prevent multiple simultaneous profile loads
      if (profileLoadTimeout) {
        clearTimeout(profileLoadTimeout);
      }

      try {
        console.log('🔄 Loading profile for:', userId);
        
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
          // Profile might not exist yet, that's okay
          if (isComponentMounted) setLoading(false);
          return;
        }

        console.log('✅ Profile loaded:', { 
          name: data?.full_name, 
          isAdmin: data?.is_admin,
          accountStatus: data?.account_status 
        });
        
        if (isComponentMounted) {
          setProfile(data);
          setIsAdmin(data?.is_admin || false);
          setLoading(false);
        }
      } catch (error) {
        console.error('❌ Error loading profile:', error);
        if (isComponentMounted) setLoading(false);
      }
    };

    // Get initial session
    const getInitialSession = async () => {
      if (!supabase) {
        console.log('❌ Supabase client not initialized');
        if (isComponentMounted) setLoading(false);
        return;
      }

      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          console.log('✅ Initial session found:', session.user.email);
          if (isComponentMounted) {
            setUser(session.user);
            setIsAuthenticated(true);
          }
          await loadProfile(session.user.id);
        } else {
          console.log('❌ No initial session found');
          if (isComponentMounted) setLoading(false);
        }
      } catch (error) {
        console.error('❌ Error getting session:', error);
        if (isComponentMounted) setLoading(false);
      }
    };

    // Start auth check
    getInitialSession();

    // Set up auth state listener
    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        console.log('🔄 Auth state change:', event, session?.user?.email);
        
        if (session?.user) {
          if (isComponentMounted) {
            setUser(session.user);
            setIsAuthenticated(true);
          }
          await loadProfile(session.user.id);
        } else {
          if (isComponentMounted) {
            setUser(null);
            setProfile(null);
            setIsAuthenticated(false);
            setIsAdmin(false);
            setLoading(false);
          }
        }
      });

      return () => {
        isComponentMounted = false;
        subscription.unsubscribe();
      };
    } else {
      return () => {
        isComponentMounted = false;
      };
    }
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

      setProfile(data);
      setIsAdmin(data?.is_admin || false);
      return { success: true };
    } catch (error: any) {
      console.error('Failed to refresh profile:', error);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const clearCacheAndReload = () => {
    if (typeof window !== 'undefined') {
      localStorage.clear();
      sessionStorage.clear();
      window.location.reload();
    }
  };

  return {
    user,
    profile,
    loading,
    isAuthenticated,
    isAdmin,
    refreshProfile,
    clearCacheAndReload,
  };
}