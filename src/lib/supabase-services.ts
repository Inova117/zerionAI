// 🗄️ SERVICIOS SUPABASE - Reemplazo completo de localStorage
// Conecta todas las funcionalidades a Supabase real

import { createClient } from '@supabase/supabase-js';

// Cliente Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// 📊 MÉTRICAS Y ACTIVIDADES DEL DASHBOARD
export interface DashboardMetrics {
  user_id: string;
  total_tasks_completed: number;
  total_time_saved: number;
  efficiency_score: number;
  current_streak: number;
  weekly_goals_progress: number;
  monthly_active_assistants: number;
  automation_rate: number;
  updated_at?: string;
}

export interface ActivityEvent {
  id?: string;
  user_id: string;
  type: 'task_completed' | 'automation_setup' | 'file_generated' | 'insight_generated';
  assistant_id: string;
  assistant_name: string;
  title: string;
  description: string;
  metadata: {
    task_type?: string;
    file_name?: string;
    time_saved?: number;
    impact?: 'low' | 'medium' | 'high' | 'critical';
    is_background?: boolean;
  };
  created_at?: string;
}

class SupabaseDashboardService {
  private userId: string | null = null;

  constructor() {
    this.initializeAuth();
  }

  private async initializeAuth() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      this.userId = user?.id || null;
    } catch (error) {
      console.warn('Dashboard Service: Failed to get user:', error);
    }
  }

  // 📊 MÉTRICAS
  async getMetrics(): Promise<DashboardMetrics | null> {
    if (!this.userId) return null;

    try {
      const { data, error } = await supabase
        .from('dashboard_metrics')
        .select('*')
        .eq('user_id', this.userId)
        .single();

      if (error && error.code !== 'PGRST116') { // No rows found is OK
        console.error('Error loading metrics:', error);
        return null;
      }

      return data || this.getDefaultMetrics();
    } catch (error) {
      console.warn('Failed to load metrics from Supabase:', error);
      return this.getDefaultMetrics();
    }
  }

  async updateMetrics(updates: Partial<DashboardMetrics>): Promise<void> {
    if (!this.userId) return;

    try {
      const { error } = await supabase
        .from('dashboard_metrics')
        .upsert({
          user_id: this.userId,
          ...updates,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error updating metrics:', error);
      }
    } catch (error) {
      console.warn('Failed to update metrics in Supabase:', error);
    }
  }

  private getDefaultMetrics(): DashboardMetrics {
    return {
      user_id: this.userId || '',
      total_tasks_completed: 0,
      total_time_saved: 0,
      efficiency_score: 0,
      current_streak: 0,
      weekly_goals_progress: 0,
      monthly_active_assistants: 0,
      automation_rate: 0
    };
  }

  // 📝 ACTIVIDADES
  async getRecentActivities(limit: number = 10): Promise<ActivityEvent[]> {
    if (!this.userId) return [];

    try {
      const { data, error } = await supabase
        .from('user_activities')
        .select('*')
        .eq('user_id', this.userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error loading activities:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.warn('Failed to load activities from Supabase:', error);
      return [];
    }
  }

  async addActivity(activity: Omit<ActivityEvent, 'id' | 'user_id' | 'created_at'>): Promise<void> {
    if (!this.userId) return;

    try {
      const { error } = await supabase
        .from('user_activities')
        .insert({
          user_id: this.userId,
          ...activity,
          created_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error adding activity:', error);
      }
    } catch (error) {
      console.warn('Failed to add activity to Supabase:', error);
    }
  }
}

// 💬 SERVICIO DE CONVERSACIONES
export interface ConversationMessage {
  id?: string;
  user_id: string;
  assistant_id: string;
  conversation_id: string;
  role: 'user' | 'assistant';
  content: string;
  type: string;
  metadata?: any;
  created_at?: string;
}

class SupabaseConversationService {
  private userId: string | null = null;

  constructor() {
    this.initializeAuth();
  }

  private async initializeAuth() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      this.userId = user?.id || null;
    } catch (error) {
      console.warn('Conversation Service: Failed to get user:', error);
    }
  }

  async getConversationHistory(assistantId: string, limit: number = 50): Promise<ConversationMessage[]> {
    if (!this.userId) return [];

    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('user_id', this.userId)
        .eq('assistant_id', assistantId)
        .order('created_at', { ascending: true })
        .limit(limit);

      if (error) {
        console.error('Error loading conversation history:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.warn('Failed to load conversation history from Supabase:', error);
      return [];
    }
  }

  async addMessage(message: Omit<ConversationMessage, 'id' | 'user_id' | 'created_at'>): Promise<void> {
    if (!this.userId) return;

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          user_id: this.userId,
          ...message,
          created_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error adding message:', error);
      }
    } catch (error) {
      console.warn('Failed to add message to Supabase:', error);
    }
  }

  async getRecentMessages(assistantId: string, limit: number = 10): Promise<ConversationMessage[]> {
    if (!this.userId) return [];

    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('user_id', this.userId)
        .eq('assistant_id', assistantId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error loading recent messages:', error);
        return [];
      }

      // Reverse to get chronological order
      return (data || []).reverse();
    } catch (error) {
      console.warn('Failed to load recent messages from Supabase:', error);
      return [];
    }
  }
}

// 🎯 SERVICIO DE CONFIGURACIONES DE USUARIO
export interface UserSettings {
  user_id: string;
  audio_enabled: boolean;
  audio_volume: number;
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications_enabled: boolean;
  updated_at?: string;
}

class SupabaseSettingsService {
  private userId: string | null = null;

  constructor() {
    this.initializeAuth();
  }

  private async initializeAuth() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      this.userId = user?.id || null;
    } catch (error) {
      console.warn('Settings Service: Failed to get user:', error);
    }
  }

  async getSettings(): Promise<UserSettings | null> {
    if (!this.userId) return null;

    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', this.userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading settings:', error);
        return null;
      }

      return data || this.getDefaultSettings();
    } catch (error) {
      console.warn('Failed to load settings from Supabase:', error);
      return this.getDefaultSettings();
    }
  }

  async updateSettings(updates: Partial<UserSettings>): Promise<void> {
    if (!this.userId) return;

    try {
      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: this.userId,
          ...updates,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error updating settings:', error);
      }
    } catch (error) {
      console.warn('Failed to update settings in Supabase:', error);
    }
  }

  private getDefaultSettings(): UserSettings {
    return {
      user_id: this.userId || '',
      audio_enabled: true,
      audio_volume: 0.5,
      theme: 'system',
      language: 'es',
      notifications_enabled: true
    };
  }
}

// 🌟 EXPORTAR INSTANCIAS SINGLETON
export const supabaseDashboardService = new SupabaseDashboardService();
export const supabaseConversationService = new SupabaseConversationService();
export const supabaseSettingsService = new SupabaseSettingsService();

// 🗄️ UTILIDADES
export async function getCurrentUserId(): Promise<string | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    return user?.id || null;
  } catch (error) {
    console.warn('Failed to get current user ID:', error);
    return null;
  }
}

export { supabase };
