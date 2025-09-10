// lib/supabase-client.ts
import { createClient } from '@supabase/supabase-js'
import { Database } from './database.types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  // This logs in both dev and prod if env vars are missing
  console.error(
    '❌ Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file.'
  )
}

/**
 * Singleton Supabase client.
 * Created once per browser session. Returns null on server (SSR).
 */
let supabaseInstance: ReturnType<typeof createClient<Database>> | null = null

const getOrCreateClient = () => {
  if (typeof window === 'undefined') {
    return null
  }
  if (!supabaseInstance && supabaseUrl && supabaseAnonKey) {
    supabaseInstance = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        storage: window.localStorage,
        storageKey: 'supabase.auth.token',
      },
    })
  }
  return supabaseInstance
}

// 👉 Export this as a named export so all your `{ supabase }` imports work
export const supabase = getOrCreateClient()

/* ---------------------------
   Auth helpers
---------------------------- */
export const signUp = async (email: string, password: string, userData: any) => {
  if (!supabase) {
    return { data: null, error: { message: 'Supabase not available (SSR).' } }
  }
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: userData },
  })
  return { data, error }
}

export const signIn = async (email: string, password: string) => {
  if (!supabase) {
    return { data: null, error: { message: 'Supabase not available (SSR).' } }
  }
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

export const signOut = async () => {
  if (!supabase) {
    return { error: { message: 'Supabase not configured.' } }
  }

  const { error } = await supabase.auth.signOut()

  if (typeof window !== 'undefined') {
    // Clear only Supabase-related keys
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('supabase') || key.startsWith('sb-') || key === 'supabase.auth.token') {
        localStorage.removeItem(key)
      }
    })
    sessionStorage.clear()
    localStorage.removeItem('user-profile-cache')
    localStorage.removeItem('user-balance-cache')
    localStorage.removeItem('dashboard-cache')
  }

  return { error }
}

export const getCurrentUser = async () => {
  if (!supabase) return null
  const { data: { user } } = await supabase.auth.getUser()
  return user
}
