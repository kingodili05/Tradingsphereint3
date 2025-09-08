import { createClient } from '@supabase/supabase-js'
import { Database } from './database.types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file.')
}

export const supabase = supabaseUrl && supabaseAnonKey ? 
  createClient<Database>(supabaseUrl, supabaseAnonKey) : 
  null

// Auth helpers
export const signUp = async (email: string, password: string, userData: any) => {
  if (!supabase) {
    return { data: null, error: { message: 'Supabase not configured. Please connect to Supabase first.' } }
  }
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData
    }
  })
  return { data, error }
}

export const signIn = async (email: string, password: string) => {
  if (!supabase) {
    return { data: null, error: { message: 'Supabase not configured. Please connect to Supabase first.' } }
  }
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  return { data, error }
}

export const signOut = async () => {
  if (!supabase) {
    return { error: { message: 'Supabase not configured. Please connect to Supabase first.' } }
  }
  const { error } = await supabase.auth.signOut()
  
  // Additional cleanup for browser environment
  if (typeof window !== 'undefined') {
    // Clear any remaining auth tokens from storage
    localStorage.removeItem('supabase.auth.token');
    sessionStorage.clear();
    
    // Clear any cached user data
    localStorage.removeItem('user-profile-cache');
    localStorage.removeItem('user-balance-cache');
  }
  
  return { error }
}

export const getCurrentUser = async () => {
  if (!supabase) {
    return null
  }
  const { data: { user } } = await supabase.auth.getUser()
  return user
}