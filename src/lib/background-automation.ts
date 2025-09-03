import { dashboardMetrics } from './dashboard-metrics';
import { assistants } from './assistants';

interface AutomationTask {
  id: string;
  assistantId: string;
  assistantName: string;
  taskType: string;
  description: string;
  interval: number; // milliseconds
  timeSaved: number;
  impact: 'low' | 'medium' | 'high';
  lastExecuted: Date;
  isActive: boolean;
}

interface AutomationSchedule {
  hour: number;
  minute: number;
  taskId: string;
}

class BackgroundAutomationManager {
  private automationTasks: AutomationTask[] = [];
  private scheduledTasks: AutomationSchedule[] = [];
  private intervals: { [taskId: string]: NodeJS.Timeout } = {};
  private isInitialized = false;

  constructor() {
    this.initializeAutomations();
  }

  private initializeAutomations() {
    if (this.isInitialized) return;
    
    this.automationTasks = [
      // Sofía - Social Media Manager
      {
        id: 'sofia_trends_analysis',
        assistantId: 'sofia',
        assistantName: 'Sofía',
        taskType: 'trends_analysis',
        description: 'Análisis automático de tendencias en redes sociales',
        interval: 30 * 60 * 1000, // 30 minutes
        timeSaved: 0.5,
        impact: 'medium',
        lastExecuted: new Date(Date.now() - 25 * 60 * 1000), // 25 minutes ago
        isActive: true
      },
      {
        id: 'sofia_content_optimization',
        assistantId: 'sofia',
        assistantName: 'Sofía',
        taskType: 'content_optimization',
        description: 'Optimización automática del calendario de contenido',
        interval: 2 * 60 * 60 * 1000, // 2 hours
        timeSaved: 1.5,
        impact: 'high',
        lastExecuted: new Date(Date.now() - 90 * 60 * 1000), // 1.5 hours ago
        isActive: true
      },
      {
        id: 'sofia_engagement_report',
        assistantId: 'sofia',
        assistantName: 'Sofía',
        taskType: 'engagement_report',
        description: 'Reporte automático de engagement y métricas',
        interval: 6 * 60 * 60 * 1000, // 6 hours
        timeSaved: 2.0,
        impact: 'high',
        lastExecuted: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        isActive: true
      },

      // Carlos - Customer Support
      {
        id: 'carlos_whatsapp_optimization',
        assistantId: 'carlos',
        assistantName: 'Carlos',
        taskType: 'whatsapp_optimization',
        description: 'Optimización automática de respuestas de WhatsApp',
        interval: 60 * 60 * 1000, // 1 hour
        timeSaved: 0.8,
        impact: 'medium',
        lastExecuted: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
        isActive: true
      },
      {
        id: 'carlos_ticket_analysis',
        assistantId: 'carlos',
        assistantName: 'Carlos',
        taskType: 'ticket_analysis',
        description: 'Análisis automático de tickets de soporte',
        interval: 3 * 60 * 60 * 1000, // 3 hours
        timeSaved: 1.2,
        impact: 'high',
        lastExecuted: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        isActive: true
      },
      {
        id: 'carlos_faq_update',
        assistantId: 'carlos',
        assistantName: 'Carlos',
        taskType: 'faq_update',
        description: 'Actualización automática de preguntas frecuentes',
        interval: 4 * 60 * 60 * 1000, // 4 hours
        timeSaved: 1.0,
        impact: 'medium',
        lastExecuted: new Date(Date.now() - 3.5 * 60 * 60 * 1000), // 3.5 hours ago
        isActive: true
      },

      // Paula - Copywriter
      {
        id: 'paula_copy_analysis',
        assistantId: 'paula',
        assistantName: 'Paula',
        taskType: 'copy_analysis',
        description: 'Análisis automático de rendimiento de copy',
        interval: 2 * 60 * 60 * 1000, // 2 hours
        timeSaved: 1.3,
        impact: 'high',
        lastExecuted: new Date(Date.now() - 100 * 60 * 1000), // 1h 40min ago
        isActive: true
      },
      {
        id: 'paula_ab_testing',
        assistantId: 'paula',
        assistantName: 'Paula',
        taskType: 'ab_testing',
        description: 'Configuración automática de tests A/B',
        interval: 8 * 60 * 60 * 1000, // 8 hours
        timeSaved: 2.5,
        impact: 'high',
        lastExecuted: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        isActive: true
      },
      {
        id: 'paula_conversion_optimization',
        assistantId: 'paula',
        assistantName: 'Paula',
        taskType: 'conversion_optimization',
        description: 'Optimización automática de tasas de conversión',
        interval: 5 * 60 * 60 * 1000, // 5 hours
        timeSaved: 2.0,
        impact: 'high',
        lastExecuted: new Date(Date.now() - 4.5 * 60 * 60 * 1000), // 4.5 hours ago
        isActive: true
      }
    ];

    this.isInitialized = true;
    this.startAutomations();
  }

  private startAutomations() {
    this.automationTasks.forEach(task => {
      if (task.isActive) {
        this.scheduleTask(task);
      }
    });

    // Also start a general background activity simulator
    this.startBackgroundActivity();
  }

  private scheduleTask(task: AutomationTask) {
    // Clear existing interval if any
    if (this.intervals[task.id]) {
      clearInterval(this.intervals[task.id]);
    }

    // Calculate when next execution should be
    const timeSinceLastExecution = Date.now() - task.lastExecuted.getTime();
    const timeUntilNext = Math.max(0, task.interval - timeSinceLastExecution);

    // Schedule first execution
    setTimeout(() => {
      this.executeTask(task);
      
      // Then schedule recurring executions
      this.intervals[task.id] = setInterval(() => {
        this.executeTask(task);
      }, task.interval);
    }, timeUntilNext);
  }

  private executeTask(task: AutomationTask) {
    // Update last executed time
    task.lastExecuted = new Date();

    // Add some randomness to make it feel more natural
    const randomDelay = Math.random() * 5000; // 0-5 seconds

    setTimeout(() => {
      // Execute the automation task
      dashboardMetrics.onTaskCompleted(
        task.assistantId,
        task.assistantName,
        task.taskType,
        {
          timeSaved: task.timeSaved,
          impact: task.impact,
          isBackground: true
        }
      );

      console.log(`🤖 Background automation executed: ${task.description}`);
    }, randomDelay);
  }

  private startBackgroundActivity() {
    // Simulate random background activities every 20-40 seconds
    const simulateActivity = () => {
      const randomActivities = [
        {
          assistantId: 'sofia',
          assistantName: 'Sofía',
          taskType: 'social_monitoring',
          description: 'Monitoreo automático de menciones en redes',
          timeSaved: 0.2,
          impact: 'low' as const
        },
        {
          assistantId: 'carlos',
          assistantName: 'Carlos',
          taskType: 'response_optimization',
          description: 'Optimización automática de tiempos de respuesta',
          timeSaved: 0.3,
          impact: 'low' as const
        },
        {
          assistantId: 'paula',
          assistantName: 'Paula',
          taskType: 'copy_refinement',
          description: 'Refinamiento automático de copy existente',
          timeSaved: 0.25,
          impact: 'low' as const
        }
      ];

      // Random chance of activity (30% every interval)
      if (Math.random() < 0.3) {
        const activity = randomActivities[Math.floor(Math.random() * randomActivities.length)];
        
        dashboardMetrics.onTaskCompleted(
          activity.assistantId,
          activity.assistantName,
          activity.taskType,
          {
            timeSaved: activity.timeSaved,
            impact: activity.impact,
            isBackground: true
          }
        );
      }

      // Schedule next check
      const nextInterval = 20000 + Math.random() * 20000; // 20-40 seconds
      setTimeout(simulateActivity, nextInterval);
    };

    // Start the background activity simulation
    setTimeout(simulateActivity, 10000); // Start after 10 seconds
  }

  // Public methods
  pauseAutomation(taskId: string) {
    const task = this.automationTasks.find(t => t.id === taskId);
    if (task) {
      task.isActive = false;
      if (this.intervals[taskId]) {
        clearInterval(this.intervals[taskId]);
        delete this.intervals[taskId];
      }
    }
  }

  resumeAutomation(taskId: string) {
    const task = this.automationTasks.find(t => t.id === taskId);
    if (task) {
      task.isActive = true;
      this.scheduleTask(task);
    }
  }

  pauseAllAutomations() {
    this.automationTasks.forEach(task => {
      this.pauseAutomation(task.id);
    });
  }

  resumeAllAutomations() {
    this.automationTasks.forEach(task => {
      this.resumeAutomation(task.id);
    });
  }

  getAutomationStatus(): AutomationTask[] {
    return [...this.automationTasks];
  }

  getNextExecutions(): Array<{taskId: string, description: string, nextExecution: Date}> {
    return this.automationTasks
      .filter(task => task.isActive)
      .map(task => ({
        taskId: task.id,
        description: task.description,
        nextExecution: new Date(task.lastExecuted.getTime() + task.interval)
      }))
      .sort((a, b) => a.nextExecution.getTime() - b.nextExecution.getTime());
  }

  // Simulate a manual trigger of automation
  triggerAutomation(taskId: string) {
    const task = this.automationTasks.find(t => t.id === taskId);
    if (task) {
      this.executeTask(task);
    }
  }

  // Cleanup
  destroy() {
    Object.values(this.intervals).forEach(interval => {
      clearInterval(interval);
    });
    this.intervals = {};
  }
}

// Export singleton instance
export const backgroundAutomation = new BackgroundAutomationManager();
