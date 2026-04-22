export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      admin_trade_signals: {
        Row: {
          commodity: string
          created_at: string | null
          created_by: string
          executed_at: string | null
          execution_result: string | null
          execution_time: string | null
          id: string
          signal_name: string
          status: string | null
          stop_loss_percentage: number
          take_profit_percentage: number
          timer_duration_minutes: number
          timer_start_time: string | null
          total_investment_amount: number | null
          total_participants: number | null
          trade_direction: string
          updated_at: string | null
          win_probability: number | null
        }
        Insert: {
          commodity: string
          created_at?: string | null
          created_by: string
          executed_at?: string | null
          execution_result?: string | null
          execution_time?: string | null
          id?: string
          signal_name: string
          status?: string | null
          stop_loss_percentage: number
          take_profit_percentage: number
          timer_duration_minutes?: number
          timer_start_time?: string | null
          total_investment_amount?: number | null
          total_participants?: number | null
          trade_direction: string
          updated_at?: string | null
          win_probability?: number | null
        }
        Update: {
          commodity?: string
          created_at?: string | null
          created_by?: string
          executed_at?: string | null
          execution_result?: string | null
          execution_time?: string | null
          id?: string
          signal_name?: string
          status?: string | null
          stop_loss_percentage?: number
          take_profit_percentage?: number
          timer_duration_minutes?: number
          timer_start_time?: string | null
          total_investment_amount?: number | null
          total_participants?: number | null
          trade_direction?: string
          updated_at?: string | null
          win_probability?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_trade_signals_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      auto_trade_settings: {
        Row: {
          id: string
          setting_name: string
          setting_type: string
          setting_value: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          id?: string
          setting_name: string
          setting_type: string
          setting_value: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          id?: string
          setting_name?: string
          setting_type?: string
          setting_value?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "auto_trade_settings_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      balances: {
        Row: {
          available_balance: number | null
          balance: number | null
          created_at: string | null
          currency: string
          id: string
          locked_balance: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          available_balance?: number | null
          balance?: number | null
          created_at?: string | null
          currency?: string
          id?: string
          locked_balance?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          available_balance?: number | null
          balance?: number | null
          created_at?: string | null
          currency?: string
          id?: string
          locked_balance?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "balances_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      deposits: {
        Row: {
          admin_notes: string | null
          amount: number
          created_at: string | null
          currency: string
          external_reference: string | null
          id: string
          payment_method: string
          processed_at: string | null
          processed_by: string | null
          status: string | null
          transaction_id: string | null
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          amount: number
          created_at?: string | null
          currency?: string
          external_reference?: string | null
          id?: string
          payment_method: string
          processed_at?: string | null
          processed_by?: string | null
          status?: string | null
          transaction_id?: string | null
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          amount?: number
          created_at?: string | null
          currency?: string
          external_reference?: string | null
          id?: string
          payment_method?: string
          processed_at?: string | null
          processed_by?: string | null
          status?: string | null
          transaction_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "deposits_processed_by_fkey"
            columns: ["processed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deposits_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      historical_prices: {
        Row: {
          close_price: number
          exchange_type: string
          high_price: number
          id: string
          low_price: number
          open_price: number
          symbol: string
          timeframe: string
          timestamp: string
          volume: number | null
        }
        Insert: {
          close_price: number
          exchange_type: string
          high_price: number
          id?: string
          low_price: number
          open_price: number
          symbol: string
          timeframe: string
          timestamp: string
          volume?: number | null
        }
        Update: {
          close_price?: number
          exchange_type?: string
          high_price?: number
          id?: string
          low_price?: number
          open_price?: number
          symbol?: string
          timeframe?: string
          timestamp?: string
          volume?: number | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_important: boolean | null
          is_read: boolean | null
          message_type: string | null
          read_at: string | null
          sender_id: string | null
          title: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_important?: boolean | null
          is_read?: boolean | null
          message_type?: string | null
          read_at?: string | null
          sender_id?: string | null
          title: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_important?: boolean | null
          is_read?: boolean | null
          message_type?: string | null
          read_at?: string | null
          sender_id?: string | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      packages: {
        Row: {
          created_at: string | null
          display_name: string
          features: Json | null
          id: string
          is_active: boolean | null
          max_balance: number | null
          min_balance: number
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          display_name: string
          features?: Json | null
          id?: string
          is_active?: boolean | null
          max_balance?: number | null
          min_balance?: number
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          display_name?: string
          features?: Json | null
          id?: string
          is_active?: boolean | null
          max_balance?: number | null
          min_balance?: number
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          account_status: string | null
          account_type: string | null
          country: string | null
          created_at: string | null
          currency: string | null
          email: string
          first_name: string
          full_name: string | null
          id: string
          is_admin: boolean | null
          is_demo: boolean | null
          is_email_verified: boolean | null
          is_identity_verified: boolean | null
          is_live: boolean | null
          is_residency_verified: boolean | null
          last_name: string
          package_id: string | null
          phone_number: string | null
          profile_image_url: string | null
          referral_bonus: number | null
          total_deposits: number | null
          total_withdrawals: number | null
          updated_at: string | null
        }
        Insert: {
          account_status?: string | null
          account_type?: string | null
          country?: string | null
          created_at?: string | null
          currency?: string | null
          email: string
          first_name: string
          full_name?: string | null
          id: string
          is_admin?: boolean | null
          is_demo?: boolean | null
          is_email_verified?: boolean | null
          is_identity_verified?: boolean | null
          is_live?: boolean | null
          is_residency_verified?: boolean | null
          last_name: string
          package_id?: string | null
          phone_number?: string | null
          profile_image_url?: string | null
          referral_bonus?: number | null
          total_deposits?: number | null
          total_withdrawals?: number | null
          updated_at?: string | null
        }
        Update: {
          account_status?: string | null
          account_type?: string | null
          country?: string | null
          created_at?: string | null
          currency?: string | null
          email?: string
          first_name?: string
          full_name?: string | null
          id?: string
          is_admin?: boolean | null
          is_demo?: boolean | null
          is_email_verified?: boolean | null
          is_identity_verified?: boolean | null
          is_live?: boolean | null
          is_residency_verified?: boolean | null
          last_name?: string
          package_id?: string | null
          phone_number?: string | null
          profile_image_url?: string | null
          referral_bonus?: number | null
          total_deposits?: number | null
          total_withdrawals?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
        ]
      }
      signal_participants: {
        Row: {
          entry_balance: number
          final_balance: number | null
          id: string
          investment_amount: number
          participated_at: string | null
          profit_loss_amount: number | null
          profit_loss_percentage: number | null
          settled_at: string | null
          signal_id: string
          user_id: string
        }
        Insert: {
          entry_balance: number
          final_balance?: number | null
          id?: string
          investment_amount: number
          participated_at?: string | null
          profit_loss_amount?: number | null
          profit_loss_percentage?: number | null
          settled_at?: string | null
          signal_id: string
          user_id: string
        }
        Update: {
          entry_balance?: number
          final_balance?: number | null
          id?: string
          investment_amount?: number
          participated_at?: string | null
          profit_loss_amount?: number | null
          profit_loss_percentage?: number | null
          settled_at?: string | null
          signal_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "signal_participants_signal_id_fkey"
            columns: ["signal_id"]
            isOneToOne: false
            referencedRelation: "admin_trade_signals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "signal_participants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      signal_usage: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          result: number | null
          settled_at: string | null
          signal_id: string
          status: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          result?: number | null
          settled_at?: string | null
          signal_id: string
          status?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          result?: number | null
          settled_at?: string | null
          signal_id?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "signal_usage_signal_id_fkey"
            columns: ["signal_id"]
            isOneToOne: false
            referencedRelation: "signals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "signal_usage_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      signals: {
        Row: {
          created_at: string | null
          created_by: string
          description: string | null
          expiry: string
          id: string
          loss_limit: number
          name: string
          profit_target: number
          status: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          description?: string | null
          expiry: string
          id?: string
          loss_limit: number
          name: string
          profit_target: number
          status?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          description?: string | null
          expiry?: string
          id?: string
          loss_limit?: number
          name?: string
          profit_target?: number
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "signals_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      trade_executions: {
        Row: {
          executed_at: string | null
          executed_by: string
          execution_details: Json | null
          execution_type: string
          id: string
          outcome: string
          participants_count: number
          profit_multiplier: number
          signal_id: string
          total_volume: number
        }
        Insert: {
          executed_at?: string | null
          executed_by: string
          execution_details?: Json | null
          execution_type: string
          id?: string
          outcome: string
          participants_count: number
          profit_multiplier: number
          signal_id: string
          total_volume: number
        }
        Update: {
          executed_at?: string | null
          executed_by?: string
          execution_details?: Json | null
          execution_type?: string
          id?: string
          outcome?: string
          participants_count?: number
          profit_multiplier?: number
          signal_id?: string
          total_volume?: number
        }
        Relationships: [
          {
            foreignKeyName: "trade_executions_executed_by_fkey"
            columns: ["executed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trade_executions_signal_id_fkey"
            columns: ["signal_id"]
            isOneToOne: false
            referencedRelation: "admin_trade_signals"
            referencedColumns: ["id"]
          },
        ]
      }
      trades: {
        Row: {
          closed_at: string | null
          created_at: string | null
          current_price: number | null
          entry_price: number | null
          exchange_type: string
          expire_time: string | null
          id: string
          order_type: string
          realized_pnl: number | null
          signal_locked: boolean | null
          status: string | null
          stop_loss: number | null
          symbol: string
          take_profit: number | null
          trade_type: string
          unit_worth: number
          unrealized_pnl: number | null
          updated_at: string | null
          user_id: string
          volume: number
        }
        Insert: {
          closed_at?: string | null
          created_at?: string | null
          current_price?: number | null
          entry_price?: number | null
          exchange_type: string
          expire_time?: string | null
          id?: string
          order_type?: string
          realized_pnl?: number | null
          signal_locked?: boolean | null
          status?: string | null
          stop_loss?: number | null
          symbol: string
          take_profit?: number | null
          trade_type: string
          unit_worth: number
          unrealized_pnl?: number | null
          updated_at?: string | null
          user_id: string
          volume: number
        }
        Update: {
          closed_at?: string | null
          created_at?: string | null
          current_price?: number | null
          entry_price?: number | null
          exchange_type?: string
          expire_time?: string | null
          id?: string
          order_type?: string
          realized_pnl?: number | null
          signal_locked?: boolean | null
          status?: string | null
          stop_loss?: number | null
          symbol?: string
          take_profit?: number | null
          trade_type?: string
          unit_worth?: number
          unrealized_pnl?: number | null
          updated_at?: string | null
          user_id?: string
          volume?: number
        }
        Relationships: [
          {
            foreignKeyName: "trades_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      verification_documents: {
        Row: {
          admin_notes: string | null
          created_at: string | null
          document_type: string
          file_name: string
          file_path: string
          file_size: number
          id: string
          mime_type: string
          reviewed_at: string | null
          reviewed_by: string | null
          updated_at: string | null
          user_id: string
          verification_status: string | null
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string | null
          document_type: string
          file_name: string
          file_path: string
          file_size: number
          id?: string
          mime_type: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          updated_at?: string | null
          user_id: string
          verification_status?: string | null
        }
        Update: {
          admin_notes?: string | null
          created_at?: string | null
          document_type?: string
          file_name?: string
          file_path?: string
          file_size?: number
          id?: string
          mime_type?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          updated_at?: string | null
          user_id?: string
          verification_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "verification_documents_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "verification_documents_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      withdrawals: {
        Row: {
          admin_notes: string | null
          amount: number
          bank_details: Json | null
          created_at: string | null
          currency: string
          destination_address: string | null
          id: string
          processed_at: string | null
          processed_by: string | null
          status: string | null
          transaction_id: string | null
          user_id: string
          withdrawal_method: string
        }
        Insert: {
          admin_notes?: string | null
          amount: number
          bank_details?: Json | null
          created_at?: string | null
          currency?: string
          destination_address?: string | null
          id?: string
          processed_at?: string | null
          processed_by?: string | null
          status?: string | null
          transaction_id?: string | null
          user_id: string
          withdrawal_method: string
        }
        Update: {
          admin_notes?: string | null
          amount?: number
          bank_details?: Json | null
          created_at?: string | null
          currency?: string
          destination_address?: string | null
          id?: string
          processed_at?: string | null
          processed_by?: string | null
          status?: string | null
          transaction_id?: string | null
          user_id?: string
          withdrawal_method?: string
        }
        Relationships: [
          {
            foreignKeyName: "withdrawals_processed_by_fkey"
            columns: ["processed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "withdrawals_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      assign_package_by_balance: {
        Args: { total_balance: number; user_uuid: string }
        Returns: undefined
      }
      execute_signal: {
        Args: { p_signal_id: string }
        Returns: Json
      }
      execute_timed_signal: {
        Args: { p_force_outcome?: string; p_signal_id: string }
        Returns: Json
      }
      get_user_total_balance_usd: {
        Args: { user_uuid: string }
        Returns: number
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      join_trade_signal: {
        Args: { p_investment_amount: number; p_signal_id: string }
        Returns: Json
      }
      make_user_admin: {
        Args: { user_email: string }
        Returns: undefined
      }
      mark_expired_signals: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      process_expired_signals: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      start_signal_timer: {
        Args: { p_duration_minutes?: number; p_signal_id: string }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
