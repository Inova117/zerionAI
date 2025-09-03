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

interface ActivityEvent {
  id: string;
  type: 'task_completed' | 'file_generated' | 'automation_setup' | 'milestone_reached';
  assistantId: string;
  assistantName: string;
  description: string;
  timestamp: Date;
  metadata?: {
    taskType?: string;
    fileName?: string;
    timeSaved?: number;
    impact?: 'low' | 'medium' | 'high';
  };
}

class DashboardMetricsManager {
  private metrics: DashboardMetrics;
  private activities: ActivityEvent[] = [];
  private listeners: Array<(metrics: DashboardMetrics) => void> = [];
  private activityListeners: Array<(activities: ActivityEvent[]) => void> = [];

  constructor() {
    this.metrics = this.loadMetrics();
    this.activities = this.loadActivities();
    this.startPeriodicUpdates();
  }

  private loadMetrics(): DashboardMetrics {
    try {
      if (typeof window === 'undefined') return this.getDefaultMetrics();
      const saved = localStorage.getItem('dashboard_metrics');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          lastUpdated: new Date(parsed.lastUpdated)
        };
      }
    } catch (error) {
      console.warn('Failed to load metrics:', error);
    }

    // Default metrics
    return {
      tasksCompleted: 12,
      timeSaved: 8.5,
      activeAssistants: 3,
      productivity: 87,
      weeklyGoal: 25,
      currentStreak: 3,
      totalInteractions: 47,
      lastUpdated: new Date()
    };
  }

  private loadActivities(): ActivityEvent[] {
    try {
      if (typeof window === 'undefined') return [];
      const saved = localStorage.getItem('dashboard_activities');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map((activity: any) => ({
          ...activity,
          timestamp: new Date(activity.timestamp)
        }));
      }
    } catch (error) {
      console.warn('Failed to load activities:', error);
    }

    // Default activities
    return [
      {
        id: '1',
        type: 'task_completed',
        assistantId: 'sofia',
        assistantName: 'Sofía',
        description: 'Calendario de contenido para Instagram generado',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        metadata: {
          taskType: 'content_strategy',
          fileName: 'Calendario_Contenido_Instagram.pdf',
          timeSaved: 2.5,
          impact: 'high'
        }
      },
      {
        id: '2',
        type: 'automation_setup',
        assistantId: 'carlos',
        assistantName: 'Carlos',
        description: 'WhatsApp Business configurado con respuestas automáticas',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        metadata: {
          taskType: 'automation',
          timeSaved: 5.0,
          impact: 'high'
        }
      },
      {
        id: '3',
        type: 'file_generated',
        assistantId: 'paula',
        assistantName: 'Paula',
        description: 'Email de ventas optimizado para conversión',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        metadata: {
          taskType: 'copywriting',
          fileName: 'Email_Ventas_Optimizado.docx',
          timeSaved: 1.0,
          impact: 'medium'
        }
      }
    ];
  }

  private saveMetrics() {
    try {
      if (typeof window === 'undefined') return;
      localStorage.setItem('dashboard_metrics', JSON.stringify(this.metrics));
    } catch (error) {
      console.warn('Failed to save metrics:', error);
    }
  }

  private saveActivities() {
    try {
      if (typeof window === 'undefined') return;
      // Keep only last 50 activities to avoid storage bloat
      const recentActivities = this.activities.slice(-50);
      localStorage.setItem('dashboard_activities', JSON.stringify(recentActivities));
    } catch (error) {
      console.warn('Failed to save activities:', error);
    }
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.metrics));
  }

  private notifyActivityListeners() {
    this.activityListeners.forEach(listener => listener([...this.activities]));
  }

  // Start periodic updates to simulate real-time changes
  private startPeriodicUpdates() {
    setInterval(() => {
      // Simulate gradual productivity changes
      if (Math.random() < 0.3) { // 30% chance every interval
        this.metrics.productivity = Math.min(100, this.metrics.productivity + Math.random() * 2 - 1);
        this.metrics.lastUpdated = new Date();
        this.notifyListeners();
      }

      // Simulate background assistant activity
      if (Math.random() < 0.1) { // 10% chance every interval
        this.simulateBackgroundActivity();
      }
    }, 15000); // Every 15 seconds
  }

  private simulateBackgroundActivity() {
    const backgroundActivities = [
      {
        type: 'automation_setup' as const,
        assistantId: 'carlos',
        assistantName: 'Carlos',
        description: 'Optimización automática de respuestas WhatsApp',
        metadata: {
          taskType: 'optimization',
          timeSaved: 0.5,
          impact: 'low' as const
        }
      },
      {
        type: 'task_completed' as const,
        assistantId: 'sofia',
        assistantName: 'Sofía',
        description: 'Análisis de tendencias completado automáticamente',
        metadata: {
          taskType: 'analysis',
          timeSaved: 0.3,
          impact: 'low' as const
        }
      }
    ];

    const activity = backgroundActivities[Math.floor(Math.random() * backgroundActivities.length)];
    this.addActivity(activity);
  }

  // Public methods
  subscribe(listener: (metrics: DashboardMetrics) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  subscribeToActivities(listener: (activities: ActivityEvent[]) => void) {
    this.activityListeners.push(listener);
    return () => {
      this.activityListeners = this.activityListeners.filter(l => l !== listener);
    };
  }

  getMetrics(): DashboardMetrics {
    return { ...this.metrics };
  }

  getRecentActivities(limit: number = 10): ActivityEvent[] {
    return this.activities
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  // Called when tasks are completed in chat
  onTaskCompleted(assistantId: string, assistantName: string, taskType: string, metadata?: any) {
    // Update metrics
    this.metrics.tasksCompleted += 1;
    this.metrics.timeSaved += metadata?.timeSaved || 1.5;
    this.metrics.totalInteractions += 1;
    this.metrics.productivity = Math.min(100, this.metrics.productivity + 2);
    this.metrics.lastUpdated = new Date();

    // Add activity
    this.addActivity({
      type: 'task_completed',
      assistantId,
      assistantName,
      description: this.generateTaskDescription(taskType, metadata),
      metadata: {
        taskType,
        timeSaved: metadata?.timeSaved || 1.5,
        impact: metadata?.impact || 'medium',
        fileName: metadata?.fileName
      }
    });

    // Check for milestones
    this.checkMilestones();

    this.saveMetrics();
    this.notifyListeners();
  }

  onFileGenerated(assistantId: string, assistantName: string, fileName: string, metadata?: any) {
    this.addActivity({
      type: 'file_generated',
      assistantId,
      assistantName,
      description: `Archivo generado: ${fileName}`,
      metadata: {
        fileName,
        timeSaved: metadata?.timeSaved || 1.0,
        impact: metadata?.impact || 'medium'
      }
    });

    // Update time saved
    this.metrics.timeSaved += metadata?.timeSaved || 1.0;
    this.metrics.lastUpdated = new Date();
    this.saveMetrics();
    this.notifyListeners();
  }

  onAutomationSetup(assistantId: string, assistantName: string, automationType: string, metadata?: any) {
    this.addActivity({
      type: 'automation_setup',
      assistantId,
      assistantName,
      description: `Automatización configurada: ${automationType}`,
      metadata: {
        taskType: automationType,
        timeSaved: metadata?.timeSaved || 3.0,
        impact: 'high'
      }
    });

    // Automation saves significant time
    this.metrics.timeSaved += metadata?.timeSaved || 3.0;
    this.metrics.productivity = Math.min(100, this.metrics.productivity + 5);
    this.metrics.lastUpdated = new Date();
    this.saveMetrics();
    this.notifyListeners();
  }

  private addActivity(activityData: Omit<ActivityEvent, 'id' | 'timestamp'>) {
    const activity: ActivityEvent = {
      ...activityData,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date()
    };

    this.activities.unshift(activity); // Add to beginning
    this.saveActivities();
    this.notifyActivityListeners();
  }

  private generateTaskDescription(taskType: string, metadata?: any): string {
    const descriptions: { [key: string]: string } = {
      'content_strategy': 'Estrategia de contenido creada',
      'social_media_calendar': 'Calendario de redes sociales generado',
      'hashtag_research': 'Investigación de hashtags completada',
      'whatsapp_setup': 'WhatsApp Business configurado',
      'customer_support': 'Sistema de soporte automático activado',
      'sales_email': 'Email de ventas optimizado',
      'landing_copy': 'Copy para landing page creado',
      'ab_testing': 'Pruebas A/B configuradas'
    };

    return descriptions[taskType] || 'Tarea completada exitosamente';
  }

  private checkMilestones() {
    const milestones = [
      { threshold: 10, message: '10 tareas completadas' },
      { threshold: 25, message: '25 tareas completadas' },
      { threshold: 50, message: '50 tareas completadas' },
      { threshold: 100, message: '¡100 tareas completadas!' }
    ];

    milestones.forEach(milestone => {
      if (this.metrics.tasksCompleted === milestone.threshold) {
        this.addActivity({
          type: 'milestone_reached',
          assistantId: 'system',
          assistantName: 'Sistema',
          description: `🎉 Hito alcanzado: ${milestone.message}`,
          metadata: {
            impact: 'high'
          }
        });
      }
    });
  }

  // Reset metrics (for testing)
  resetMetrics() {
    this.metrics = {
      tasksCompleted: 0,
      timeSaved: 0,
      activeAssistants: 3,
      productivity: 75,
      weeklyGoal: 25,
      currentStreak: 1,
      totalInteractions: 0,
      lastUpdated: new Date()
    };
    this.activities = [];
    this.saveMetrics();
    this.saveActivities();
    this.notifyListeners();
    this.notifyActivityListeners();
  }
}

export const dashboardMetrics = new DashboardMetricsManager();
export type { DashboardMetrics, ActivityEvent };
