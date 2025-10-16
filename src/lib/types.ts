
// This file is generated from the database schema.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      casinos: {
        Row: {
          casino_url: string | null
          created_at: string
          daily_gc: number | null
          daily_sc: number | null
          id: string
          is_priority: boolean | null
          logo_url: string | null
          name: string
          welcome_gc: number | null
          welcome_sc: number | null
        }
        Insert: {
          casino_url?: string | null
          created_at?: string
          daily_gc?: number | null
          daily_sc?: number | null
          id?: string
          is_priority?: boolean | null
          logo_url?: string | null
          name: string
          welcome_gc?: number | null
          welcome_sc?: number | null
        }
        Update: {
          casino_url?: string | null
          created_at?: string
          daily_gc?: number | null
          daily_sc?: number | null
          id?: string
          is_priority?: boolean | null
          logo_url?: string | null
          name?: string
          welcome_gc?: number | null
          welcome_sc?: number | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          body: string
          created_at: string
          created_by: string | null
          id: string
          title: string
        }
        Insert: {
          body: string
          created_at?: string
          created_by?: string | null
          id?: string
          title: string
        }
        Update: {
          body?: string
          created_at?: string
          created_by?: string | null
          id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          dismissed_notifications: string[]
          fcm_token: string | null
          id: string
          notifications_last_read_at: string | null
          role: string | null
          short_id: string | null
          username: string | null
        }
        Insert: {
          dismissed_notifications?: string[]
          fcm_token?: string | null
          id: string
          notifications_last_read_at?: string | null
          role?: string | null
          short_id?: string | null
          username?: string | null
        }
        Update: {
          dismissed_notifications?: string[]
          fcm_token?: string | null
          id?: string
          notifications_last_read_at?: string | null
          role?: string | null
          short_id?: string | null
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      referrals: {
        Row: {
          created_at: string
          id: number
          referred_id: string
          referrer_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          referred_id: string
          referrer_id: string
        }
        Update: {
          created_at?: string
          id?: number
          referred_id?: string
          referrer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "referrals_referred_id_fkey"
            columns: ["referred_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referrals_referrer_id_fkey"
            columns: ["referrer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_casinos: {
        Row: {
          casino_id: string
          id: string
          last_collected_at: string | null
          status: string
          user_id: string
        }
        Insert: {
          casino_id: string
          id?: string
          last_collected_at?: string | null
          status?: string
          user_id: string
        }
        Update: {
          casino_id?: string
          id?: string
          last_collected_at?: string | null
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_casinos_casino_id_fkey"
            columns: ["casino_id"]
            isOneToOne: false
            referencedRelation: "casinos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_casinos_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      append_to_dismissed_notifications: {
        Args: {
          user_id_input: string
          notification_id_input: string
        }
        Returns: undefined
      }
      generate_short_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      handle_new_user: {
        Args: Record<PropertyKey, never>
        Returns: unknown
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

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
        Database["public"]["Views"])
    ? (Database["public"]["Tables"] &
        Database["public"]["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
    ? Database["public"]["Enums"][PublicEnumNameOrOptions]
    : never

// Custom app types
export type Casino = Tables<'casinos'>;
export type UserCasino = Tables<'user_casinos'>;
export type Profile = Tables<'profiles'>;
export type Notification = Tables<'notifications'>;

export enum CasinoStatus {
  NotRegistered = 'not_registered',
  Registered = 'registered',
  CollectedToday = 'collected_today',
}
