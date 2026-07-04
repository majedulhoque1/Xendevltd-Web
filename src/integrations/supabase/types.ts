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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      analytics_events: {
        Row: {
          country: string | null
          device: string | null
          event_type: string
          id: number
          occurred_at: string
          path: string
          referrer_host: string | null
          visitor_hash: string
        }
        Insert: {
          country?: string | null
          device?: string | null
          event_type?: string
          id?: never
          occurred_at?: string
          path: string
          referrer_host?: string | null
          visitor_hash: string
        }
        Update: {
          country?: string | null
          device?: string | null
          event_type?: string
          id?: never
          occurred_at?: string
          path?: string
          referrer_host?: string | null
          visitor_hash?: string
        }
        Relationships: []
      }
      availability: {
        Row: {
          active: boolean
          created_at: string
          end_time: string
          id: string
          slot_minutes: number
          start_time: string
          weekday: number
        }
        Insert: {
          active?: boolean
          created_at?: string
          end_time: string
          id?: string
          slot_minutes?: number
          start_time: string
          weekday: number
        }
        Update: {
          active?: boolean
          created_at?: string
          end_time?: string
          id?: string
          slot_minutes?: number
          start_time?: string
          weekday?: number
        }
        Relationships: []
      }
      bookings: {
        Row: {
          contact_id: string
          created_at: string
          date: string
          details: Json
          id: string
          notes: string | null
          source: string
          status: string
          time: string
          updated_at: string
        }
        Insert: {
          contact_id: string
          created_at?: string
          date: string
          details?: Json
          id?: string
          notes?: string | null
          source?: string
          status?: string
          time: string
          updated_at?: string
        }
        Update: {
          contact_id?: string
          created_at?: string
          date?: string
          details?: Json
          id?: string
          notes?: string | null
          source?: string
          status?: string
          time?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_logs: {
        Row: {
          bot_response: string | null
          created_at: string
          id: string
          source: string
          user_message: string
        }
        Insert: {
          bot_response?: string | null
          created_at?: string
          id?: string
          source?: string
          user_message: string
        }
        Update: {
          bot_response?: string | null
          created_at?: string
          id?: string
          source?: string
          user_message?: string
        }
        Relationships: []
      }
      contacts: {
        Row: {
          branch: string | null
          created_at: string
          details: Json
          email: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          source_submission_id: string | null
          updated_at: string
        }
        Insert: {
          branch?: string | null
          created_at?: string
          details?: Json
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          source_submission_id?: string | null
          updated_at?: string
        }
        Update: {
          branch?: string | null
          created_at?: string
          details?: Json
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          source_submission_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      inquiries: {
        Row: {
          created_at: string
          details: Json
          email: string | null
          id: string
          language: string
          message: string | null
          name: string
          phone: string | null
          status: string
          type: string
        }
        Insert: {
          created_at?: string
          details?: Json
          email?: string | null
          id?: string
          language?: string
          message?: string | null
          name: string
          phone?: string | null
          status?: string
          type?: string
        }
        Update: {
          created_at?: string
          details?: Json
          email?: string | null
          id?: string
          language?: string
          message?: string | null
          name?: string
          phone?: string | null
          status?: string
          type?: string
        }
        Relationships: []
      }
      kit_meta: {
        Row: {
          contract_version: number
          id: boolean
          updated_at: string
        }
        Insert: {
          contract_version: number
          id?: boolean
          updated_at?: string
        }
        Update: {
          contract_version?: number
          id?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          created_at: string
          email: string | null
          full_name: string
          id: string
          message: string | null
          phone: string
          source: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name: string
          id?: string
          message?: string | null
          phone: string
          source?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          message?: string | null
          phone?: string
          source?: string
        }
        Relationships: []
      }
      notification_outbox: {
        Row: {
          booking_id: string | null
          created_at: string
          event: string
          id: string
          payload: Json
          recipient: string
          sent_at: string | null
          status: string
          to_phone: string | null
        }
        Insert: {
          booking_id?: string | null
          created_at?: string
          event: string
          id?: string
          payload?: Json
          recipient?: string
          sent_at?: string | null
          status?: string
          to_phone?: string | null
        }
        Update: {
          booking_id?: string | null
          created_at?: string
          event?: string
          id?: string
          payload?: Json
          recipient?: string
          sent_at?: string | null
          status?: string
          to_phone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notification_outbox_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          email: string | null
          id: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          id: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          activity_status: string
          created_at: string
          description: string | null
          featured: boolean
          id: string
          image_url: string | null
          live_url: string | null
          slug: string | null
          title: string
        }
        Insert: {
          activity_status?: string
          created_at?: string
          description?: string | null
          featured?: boolean
          id?: string
          image_url?: string | null
          live_url?: string | null
          slug?: string | null
          title: string
        }
        Update: {
          activity_status?: string
          created_at?: string
          description?: string | null
          featured?: boolean
          id?: string
          image_url?: string | null
          live_url?: string | null
          slug?: string | null
          title?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          key: string
          updated_at: string
          value: string
        }
        Insert: {
          key: string
          updated_at?: string
          value?: string
        }
        Update: {
          key?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      analytics_by_country: {
        Args: { p_from: string; p_to: string }
        Returns: {
          country: string
          pageviews: number
          unique_visitors: number
        }[]
      }
      analytics_conversions: {
        Args: { p_from: string; p_to: string }
        Returns: Json
      }
      analytics_sources: {
        Args: { p_from: string; p_to: string }
        Returns: {
          pageviews: number
          referrer_host: string
          source: string
        }[]
      }
      analytics_top_pages: {
        Args: { p_from: string; p_limit?: number; p_to: string }
        Returns: {
          pageviews: number
          path: string
          unique_visitors: number
        }[]
      }
      analytics_traffic: {
        Args: { p_from: string; p_to: string }
        Returns: {
          day: string
          pageviews: number
          unique_visitors: number
        }[]
      }
      get_available_slots: {
        Args: { p_from: string; p_to: string }
        Returns: {
          slot_date: string
          slot_time: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      kit_timezone: { Args: never; Returns: string }
      request_booking: {
        Args: {
          p_name: string
          p_notes: string
          p_phone: string
          p_project: string
          p_slot_date: string
          p_slot_time: string
        }
        Returns: Json
      }
      reschedule_booking: {
        Args: { p_booking_id: string; p_slot_date: string; p_slot_time: string }
        Returns: Json
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
