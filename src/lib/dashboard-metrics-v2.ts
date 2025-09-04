// 📊 DASHBOARD METRICS V2 - Conectado a Supabase Real
// Reemplaza localStorage con persistencia real

import { supabaseDashboardService, type DashboardMetrics as SupabaseMetrics, type ActivityEvent } from './supabase-services';

// Interfaz compatible con la versión anterior
interface DashboardMetrics {
  tasksCompleted: number;
  timeSaved: number; // in hours
  activeAssistants: number;
  productivity: number; // percentage
  weeklyGoal: number;
  currentStreak: number;
  totalInteractions: number;
  lastUpdated: Date;
}

class DashboardMetricsV2 {
  private metrics: DashboardMetrics | null = null;
  private activities: ActivityEvent[] = [];
  private listeners: Array<(metrics: DashboardMetrics) => void> = [];
  private isInitialized = false;

  constructor() {
    this.initialize();
  }

  private async initialize() {
    if (this.isInitialized) return;
    
    try {
      await this.loadFromSupabase();
      this.isInitialized = true;
      this.startPeriodicSync();
    } catch (error) {
      console.warn('Dashboard Metrics V2: Failed to initialize:', error);
      // Fallback a métricas por defecto
      this.metrics = this.getDefaultMetrics();
    }
  }

  private async loadFromSupabase() {
    try {
      // Cargar métricas
      const supabaseMetrics = await supabaseDashboardService.getMetrics();
      
      if (supabaseMetrics) {
        this.metrics = this.convertFromSupabaseMetrics(supabaseMetrics);
      } else {
        this.metrics = this.getDefaultMetrics();
        // Crear métricas iniciales en Supabase
        await this.saveToSupabase();
      }

      // Cargar actividades recientes
      this.activities = await supabaseDashboardService.getRecentActivities(20);
      
      this.notifyListeners();
    } catch (error) {
      console.error('Failed to load from Supabase:', error);
      this.metrics = this.getDefaultMetrics();
    }
  }

  private async saveToSupabase() {
    if (!this.metrics) return;

    try {
      const supabaseMetrics = this.convertToSupabaseMetrics(this.metrics);
      await supabaseDashboardService.updateMetrics(supabaseMetrics);
    } catch (error) {
      console.warn('Failed to save to Supabase:', error);
    }
  }

  private convertFromSupabaseMetrics(supabaseMetrics: SupabaseMetrics): DashboardMetrics {
    return {
      tasksCompleted: supabaseMetrics.total_tasks_completed,
      timeSaved: supabaseMetrics.total_time_saved,
      activeAssistants: supabaseMetrics.monthly_active_assistants,
      productivity: supabaseMetrics.efficiency_score,
      weeklyGoal: supabaseMetrics.weekly_goals_progress,
      currentStreak: supabaseMetrics.current_streak,
      totalInteractions: supabaseMetrics.total_tasks_completed, // Aproximación
      lastUpdated: supabaseMetrics.updated_at ? new Date(supabaseMetrics.updated_at) : new Date()
    };
  }

  private convertToSupabaseMetrics(metrics: DashboardMetrics): Partial<SupabaseMetrics> {
    return {
      total_tasks_completed: metrics.tasksCompleted,
      total_time_saved: metrics.timeSaved,
      monthly_active_assistants: metrics.activeAssistants,
      efficiency_score: metrics.productivity,
      weekly_goals_progress: metrics.weeklyGoal,
      current_streak: metrics.currentStreak,
      automation_rate: Math.min(100, metrics.productivity * 0.8) // Estimación
    };
  }

  private getDefaultMetrics(): DashboardMetrics {
    return {
      tasksCompleted: 0,
      timeSaved: 0,
      activeAssistants: 0,
      productivity: 0,
      weeklyGoal: 0,
      currentStreak: 0,
      totalInteractions: 0,
      lastUpdated: new Date()
    };
  }

  private startPeriodicSync() {
    // Sincronizar con Supabase cada 30 segundos
    setInterval(async () => {
      try {
        await this.loadFromSupabase();
      } catch (error) {
        console.warn('Periodic sync failed:', error);
      }
    }, 30000);
  }

  private notifyListeners() {
    if (this.metrics) {
      this.listeners.forEach(listener => {
        try {
          listener(this.metrics!);
        } catch (error) {
          console.warn('Error notifying listener:', error);
        }
      });
    }
  }

  // 📊 MÉTODOS PÚBLICOS (compatibles con versión anterior)

  async onTaskCompleted(
    assistantId: string,
    assistantName: string,
    taskType: string,
    metadata: {
      timeSaved?: number;
      impact?: 'low' | 'medium' | 'high' | 'critical';
      isBackground?: boolean;
    } = {}
  ) {
    await this.ensureInitialized();

    if (!this.metrics) return;

    // Actualizar métricas locales
    this.metrics.tasksCompleted += 1;
    this.metrics.timeSaved += metadata.timeSaved || 0;
    this.metrics.totalInteractions += 1;
    this.metrics.lastUpdated = new Date();

    // Actualizar productividad basada en el impacto
    const impactMultiplier = {
      low: 1,
      medium: 2,
      high: 5,
      critical: 10
    }[metadata.impact || 'medium'];

    this.metrics.productivity = Math.min(100, this.metrics.productivity + impactMultiplier);

    // Crear actividad en Supabase
    try {
      await supabaseDashboardService.addActivity({
        type: 'task_completed',
        assistant_id: assistantId,
        assistant_name: assistantName,
        title: `Tarea completada: ${taskType}`,
        description: `${assistantName} completó una tarea de tipo ${taskType}`,
        metadata: {
          task_type: taskType,
          time_saved: metadata.timeSaved,
          impact: metadata.impact,
          is_background: metadata.isBackground
        }
      });

      // Recargar actividades
      this.activities = await supabaseDashboardService.getRecentActivities(20);
    } catch (error) {
      console.warn('Failed to save activity to Supabase:', error);
    }

    // Guardar métricas actualizadas
    await this.saveToSupabase();
    this.notifyListeners();
  }

  async onFileGenerated(
    assistantId: string,
    assistantName: string,
    fileName: string,
    metadata: {
      fileType?: string;
      timeSaved?: number;
      impact?: 'low' | 'medium' | 'high' | 'critical';
    } = {}
  ) {
    await this.ensureInitialized();

    try {
      await supabaseDashboardService.addActivity({
        type: 'file_generated',
        assistant_id: assistantId,
        assistant_name: assistantName,
        title: `Archivo generado: ${fileName}`,
        description: `${assistantName} generó el archivo ${fileName}`,
        metadata: {
          file_name: fileName,
          time_saved: metadata.timeSaved,
          impact: metadata.impact
        }
      });

      // Actualizar métricas si hay tiempo ahorrado
      if (metadata.timeSaved) {
        await this.onTaskCompleted(assistantId, assistantName, 'file_generation', {
          timeSaved: metadata.timeSaved,
          impact: metadata.impact
        });
      }
    } catch (error) {
      console.warn('Failed to save file generation activity:', error);
    }
  }

  async onAutomationSetup(
    assistantId: string,
    assistantName: string,
    automationType: string,
    metadata: {
      timeSaved?: number;
      impact?: 'low' | 'medium' | 'high' | 'critical';
    } = {}
  ) {
    await this.ensureInitialized();

    try {
      await supabaseDashboardService.addActivity({
        type: 'automation_setup',
        assistant_id: assistantId,
        assistant_name: assistantName,
        title: `Automatización configurada: ${automationType}`,
        description: `${assistantName} configuró automatización de ${automationType}`,
        metadata: {
          time_saved: metadata.timeSaved,
          impact: metadata.impact
        }
      });

      // Actualizar métricas
      await this.onTaskCompleted(assistantId, assistantName, 'automation_setup', metadata);
    } catch (error) {
      console.warn('Failed to save automation setup activity:', error);
    }
  }

  // 📈 GETTERS (compatibles con versión anterior)
  getMetrics(): DashboardMetrics {
    return this.metrics || this.getDefaultMetrics();
  }

  getActivities(): ActivityEvent[] {
    return this.activities;
  }

  subscribe(listener: (metrics: DashboardMetrics) => void) {
    this.listeners.push(listener);
    
    // Notificar inmediatamente con métricas actuales
    if (this.metrics) {
      listener(this.metrics);
    }

    // Retornar función de cleanup
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  // 🔄 MÉTODOS DE SINCRONIZACIÓN
  async refresh() {
    await this.loadFromSupabase();
  }

  async reset() {
    this.metrics = this.getDefaultMetrics();
    await this.saveToSupabase();
    this.notifyListeners();
  }

  private async ensureInitialized() {
    if (!this.isInitialized) {
      await this.initialize();
    }
  }

  // 📊 MÉTODOS ADICIONALES PARA COMPATIBILIDAD
  updateMetrics(updates: Partial<DashboardMetrics>) {
    if (!this.metrics) return;

    Object.assign(this.metrics, updates);
    this.metrics.lastUpdated = new Date();
    
    // Guardar en Supabase de forma asíncrona
    this.saveToSupabase().catch(error => {
      console.warn('Failed to save metrics update:', error);
    });

    this.notifyListeners();
  }

  // 🎯 ESTADÍSTICAS AVANZADAS
  async getWeeklyStats(): Promise<{
    tasksThisWeek: number;
    timeSavedThisWeek: number;
    mostActiveAssistant: string;
    improvementRate: number;
  }> {
    await this.ensureInitialized();

    // Por ahora retornamos estimaciones basadas en métricas actuales
    // En el futuro podríamos hacer queries más específicas a Supabase
    return {
      tasksThisWeek: Math.floor(this.metrics?.tasksCompleted || 0 * 0.2), // Estimación
      timeSavedThisWeek: Math.floor((this.metrics?.timeSaved || 0) * 0.3), // Estimación
      mostActiveAssistant: 'sofia', // Habría que calcularlo real
      improvementRate: Math.max(0, (this.metrics?.productivity || 0) - 50) // Estimación
    };
  }
}

// 🌟 EXPORTAR INSTANCIA SINGLETON
export const dashboardMetricsV2 = new DashboardMetricsV2();

// Exportar también el tipo para compatibilidad
export type { DashboardMetrics };

// Mantener export por defecto para compatibilidad con código existente
export { dashboardMetricsV2 as dashboardMetrics };
export default dashboardMetricsV2;
