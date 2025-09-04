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
      profiles: {
        Row: {
          id: string
          full_name: string | null
          company_name: string | null
          industry: string | null
          employee_count: number | null
          plan_type: string | null
          trial_ends_at: string | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          company_name?: string | null
          industry?: string | null
          employee_count?: number | null
          plan_type?: string | null
          trial_ends_at?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          company_name?: string | null
          industry?: string | null
          employee_count?: number | null
          plan_type?: string | null
          trial_ends_at?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      conversations: {
        Row: {
          id: string
          user_id: string
          assistant_id: string
          title: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          assistant_id: string
          title?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          assistant_id?: string
          title?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          user_id: string
          assistant_id: string
          content: string
          role: 'user' | 'assistant'
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          user_id: string
          assistant_id: string
          content: string
          role: 'user' | 'assistant'
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          user_id?: string
          assistant_id?: string
          content?: string
          role?: 'user' | 'assistant'
          metadata?: Json | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      user_profiles: {
        Row: {
          id: string
          name: string
          email: string | null
          company: string | null
          industry: string | null
          role: string | null
          working_style: string | null
          communication_prefs: string | null
          goals: string[] | null
          preferences: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          email?: string | null
          company?: string | null
          industry?: string | null
          role?: string | null
          working_style?: string | null
          communication_prefs?: string | null
          goals?: string[] | null
          preferences?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string | null
          company?: string | null
          industry?: string | null
          role?: string | null
          working_style?: string | null
          communication_prefs?: string | null
          goals?: string[] | null
          preferences?: Json | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      dashboard_metrics: {
        Row: {
          id: string
          user_id: string
          total_conversations: number
          total_messages: number
          active_assistants: number
          productivity_score: number
          engagement_level: 'low' | 'medium' | 'high'
          time_saved_hours: number
          last_activity: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          total_conversations?: number
          total_messages?: number
          active_assistants?: number
          productivity_score?: number
          engagement_level?: 'low' | 'medium' | 'high'
          time_saved_hours?: number
          last_activity?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          total_conversations?: number
          total_messages?: number
          active_assistants?: number
          productivity_score?: number
          engagement_level?: 'low' | 'medium' | 'high'
          time_saved_hours?: number
          last_activity?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "dashboard_metrics_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      user_activities: {
        Row: {
          id: string
          user_id: string
          assistant_id: string
          assistant_name: string
          type: 'task_completed' | 'file_generated' | 'automation_setup' | 'milestone_reached' | 'insight_generated' | 'message_sent' | 'system_event'
          description: string
          metadata: Json | null
          impact: 'low' | 'medium' | 'high' | 'critical'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          assistant_id: string
          assistant_name: string
          type: 'task_completed' | 'file_generated' | 'automation_setup' | 'milestone_reached' | 'insight_generated' | 'message_sent' | 'system_event'
          description: string
          metadata?: Json | null
          impact?: 'low' | 'medium' | 'high' | 'critical'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          assistant_id?: string
          assistant_name?: string
          type?: 'task_completed' | 'file_generated' | 'automation_setup' | 'milestone_reached' | 'insight_generated' | 'message_sent' | 'system_event'
          description?: string
          metadata?: Json | null
          impact?: 'low' | 'medium' | 'high' | 'critical'
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_activities_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      cerebro_insights: {
        Row: {
          id: string
          user_id: string
          assistant_id: string | null
          type: 'pattern' | 'optimization' | 'opportunity' | 'risk' | 'behavior' | 'activity'
          content: string
          metadata: Json | null
          priority: number | null
          actionable: boolean
          timestamp: string
          related_insights: string[] | null
        }
        Insert: {
          id?: string
          user_id: string
          assistant_id?: string | null
          type: 'pattern' | 'optimization' | 'opportunity' | 'risk' | 'behavior' | 'activity'
          content: string
          metadata?: Json | null
          priority?: number | null
          actionable?: boolean
          timestamp?: string
          related_insights?: string[] | null
        }
        Update: {
          id?: string
          user_id?: string
          assistant_id?: string | null
          type?: 'pattern' | 'optimization' | 'opportunity' | 'risk' | 'behavior' | 'activity'
          content?: string
          metadata?: Json | null
          priority?: number | null
          actionable?: boolean
          timestamp?: string
          related_insights?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "cerebro_insights_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      project_status_enum: 'planning' | 'active' | 'review' | 'completed' | 'on_hold' | 'cancelled'
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
    : never = never
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
    : never = never
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
    : never = never
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
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never
