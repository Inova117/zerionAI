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
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          role: string
          content: string
          message_type: string | null
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          role: string
          content: string
          message_type?: string | null
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          role?: string
          content?: string
          message_type?: string | null
          metadata?: Json | null
          created_at?: string
        }
      }
      user_metrics: {
        Row: {
          id: string
          user_id: string
          conversations_count: number | null
          tasks_completed: number | null
          time_saved_hours: number | null
          automation_triggers: number | null
          last_updated: string
        }
        Insert: {
          id?: string
          user_id: string
          conversations_count?: number | null
          tasks_completed?: number | null
          time_saved_hours?: number | null
          automation_triggers?: number | null
          last_updated?: string
        }
        Update: {
          id?: string
          user_id?: string
          conversations_count?: number | null
          tasks_completed?: number | null
          time_saved_hours?: number | null
          automation_triggers?: number | null
          last_updated?: string
        }
      }
      automations: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          trigger_type: string
          trigger_config: Json | null
          action_type: string
          action_config: Json | null
          is_active: boolean | null
          runs_count: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          trigger_type: string
          trigger_config?: Json | null
          action_type: string
          action_config?: Json | null
          is_active?: boolean | null
          runs_count?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          trigger_type?: string
          trigger_config?: Json | null
          action_type?: string
          action_config?: Json | null
          is_active?: boolean | null
          runs_count?: number | null
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
