export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          first_name: string
          last_name: string
          full_name: string
          profile_image_url: string | null
          phone_number: string | null
          country: string | null
          currency: string
          account_type: string
          package_id: string | null
          account_status: string
          is_email_verified: boolean
          is_residency_verified: boolean
          is_identity_verified: boolean
          is_demo: boolean
          is_live: boolean
          is_admin: boolean
          referral_bonus: number
          total_deposits: number
          total_withdrawals: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          first_name: string
          last_name: string
          profile_image_url?: string | null
          phone_number?: string | null
          country?: string | null
          currency?: string
          account_type?: string
          package_id?: string | null
          account_status?: string
          is_email_verified?: boolean
          is_residency_verified?: boolean
          is_identity_verified?: boolean
          is_demo?: boolean
          is_live?: boolean
          is_admin?: boolean
          referral_bonus?: number
          total_deposits?: number
          total_withdrawals?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          first_name?: string
          last_name?: string
          profile_image_url?: string | null
          phone_number?: string | null
          country?: string | null
          currency?: string
          account_type?: string
          package_id?: string | null
          account_status?: string
          is_email_verified?: boolean
          is_residency_verified?: boolean
          is_identity_verified?: boolean
          is_demo?: boolean
          is_live?: boolean
          is_admin?: boolean
          referral_bonus?: number
          total_deposits?: number
          total_withdrawals?: number
          created_at?: string
          updated_at?: string
        }
      }
      packages: {
        Row: {
          id: string
          name: string
          display_name: string
          min_balance: number
          max_balance: number | null
          features: Json
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          display_name: string
          min_balance?: number
          max_balance?: number | null
          features?: Json
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          display_name?: string
          min_balance?: number
          max_balance?: number | null
          features?: Json
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      balances: {
        Row: {
          id: string
          user_id: string
          currency: string
          balance: number
          available_balance: number
          locked_balance: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          currency?: string
          balance?: number
          available_balance?: number
          locked_balance?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          currency?: string
          balance?: number
          available_balance?: number
          locked_balance?: number
          created_at?: string
          updated_at?: string
        }
      }
      trades: {
        Row: {
          id: string
          user_id: string
          exchange_type: string
          symbol: string
          trade_type: string
          order_type: string
          volume: number
          unit_worth: number
          entry_price: number | null
          current_price: number | null
          take_profit: number | null
          stop_loss: number | null
          status: string
          signal_locked: boolean
          expire_time: string | null
          unrealized_pnl: number
          realized_pnl: number
          created_at: string
          updated_at: string
          closed_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          exchange_type: string
          symbol: string
          trade_type: string
          order_type?: string
          volume: number
          unit_worth: number
          entry_price?: number | null
          current_price?: number | null
          take_profit?: number | null
          stop_loss?: number | null
          status?: string
          signal_locked?: boolean
          expire_time?: string | null
          unrealized_pnl?: number
          realized_pnl?: number
          created_at?: string
          updated_at?: string
          closed_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          exchange_type?: string
          symbol?: string
          trade_type?: string
          order_type?: string
          volume?: number
          unit_worth?: number
          entry_price?: number | null
          current_price?: number | null
          take_profit?: number | null
          stop_loss?: number | null
          status?: string
          signal_locked?: boolean
          expire_time?: string | null
          unrealized_pnl?: number
          realized_pnl?: number
          created_at?: string
          updated_at?: string
          closed_at?: string | null
        }
      }
      messages: {
        Row: {
          id: string
          user_id: string
          sender_id: string | null
          title: string
          content: string
          message_type: string
          is_read: boolean
          is_important: boolean
          created_at: string
          read_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          sender_id?: string | null
          title: string
          content: string
          message_type?: string
          is_read?: boolean
          is_important?: boolean
          created_at?: string
          read_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          sender_id?: string | null
          title?: string
          content?: string
          message_type?: string
          is_read?: boolean
          is_important?: boolean
          created_at?: string
          read_at?: string | null
        }
      }
      historical_prices: {
        Row: {
          id: string
          symbol: string
          exchange_type: string
          open_price: number
          high_price: number
          low_price: number
          close_price: number
          volume: number
          timeframe: string
          timestamp: string
        }
        Insert: {
          id?: string
          symbol: string
          exchange_type: string
          open_price: number
          high_price: number
          low_price: number
          close_price: number
          volume?: number
          timeframe: string
          timestamp: string
        }
        Update: {
          id?: string
          symbol?: string
          exchange_type?: string
          open_price?: number
          high_price?: number
          low_price?: number
          close_price?: number
          volume?: number
          timeframe?: string
          timestamp?: string
        }
      }
      deposits: {
        Row: {
          id: string
          user_id: string
          amount: number
          currency: string
          payment_method: string
          status: string
          transaction_id: string | null
          external_reference: string | null
          processed_by: string | null
          admin_notes: string | null
          created_at: string
          processed_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          amount: number
          currency?: string
          payment_method: string
          status?: string
          transaction_id?: string | null
          external_reference?: string | null
          processed_by?: string | null
          admin_notes?: string | null
          created_at?: string
          processed_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          amount?: number
          currency?: string
          payment_method?: string
          status?: string
          transaction_id?: string | null
          external_reference?: string | null
          processed_by?: string | null
          admin_notes?: string | null
          created_at?: string
          processed_at?: string | null
        }
      }
      withdrawals: {
        Row: {
          id: string
          user_id: string
          amount: number
          currency: string
          withdrawal_method: string
          destination_address: string | null
          bank_details: Json | null
          status: string
          transaction_id: string | null
          processed_by: string | null
          admin_notes: string | null
          created_at: string
          processed_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          amount: number
          currency?: string
          withdrawal_method: string
          destination_address?: string | null
          bank_details?: Json | null
          status?: string
          transaction_id?: string | null
          processed_by?: string | null
          admin_notes?: string | null
          created_at?: string
          processed_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          amount?: number
          currency?: string
          withdrawal_method?: string
          destination_address?: string | null
          bank_details?: Json | null
          status?: string
          transaction_id?: string | null
          processed_by?: string | null
          admin_notes?: string | null
          created_at?: string
          processed_at?: string | null
        }
      }
      admin_balance_adjustments: {
        Row: {
          id: string
          user_id: string
          admin_id: string
          currency: string
          adjustment_type: string
          amount: number
          previous_balance: number
          new_balance: number
          account_type: string
          admin_notes: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          admin_id: string
          currency: string
          adjustment_type: string
          amount: number
          previous_balance: number
          new_balance: number
          account_type: string
          admin_notes: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          admin_id?: string
          currency?: string
          adjustment_type?: string
          amount?: number
          previous_balance?: number
          new_balance?: number
          account_type?: string
          admin_notes?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Package = Database['public']['Tables']['packages']['Row']
export type Balance = Database['public']['Tables']['balances']['Row']
export type Trade = Database['public']['Tables']['trades']['Row']
export type Message = Database['public']['Tables']['messages']['Row']
export type HistoricalPrice = Database['public']['Tables']['historical_prices']['Row']
export type Deposit = Database['public']['Tables']['deposits']['Row']
export type Withdrawal = Database['public']['Tables']['withdrawals']['Row']
export type AdminBalanceAdjustment = Database['public']['Tables']['admin_balance_adjustments']['Row']

// Add Signal types
export interface Signal {
  id: string
  name: string
  description: string | null
  profit_target: number
  loss_limit: number
  expiry: string
  status: 'open' | 'executed' | 'expired' | 'cancelled'
  created_by: string
  created_at: string
  updated_at: string
}

export interface SignalUsage {
  id: string
  signal_id: string
  user_id: string
  amount: number
  result: number | null
  status: 'pending' | 'settled' | 'cancelled'
  settled_at: string | null
  created_at: string
}