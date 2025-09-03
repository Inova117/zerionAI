// Centralized Brain AI System - Knowledge Base and User Intelligence

export interface UserProfile {
  personal: {
    name: string;
    email?: string;
    timezone: string;
    language: 'es' | 'pt' | 'en';
  };
  business: {
    company: string;
    industry: string;
    size: 'startup' | 'small' | 'medium' | 'enterprise';
    revenue: string;
    growthStage: 'idea' | 'mvp' | 'growth' | 'scale' | 'mature';
  };
  goals: {
    primary: string[];
    secondary: string[];
    timeline: '1-month' | '3-months' | '6-months' | '1-year';
    priority: 'sales' | 'marketing' | 'operations' | 'growth';
  };
  preferences: {
    communicationStyle: 'direct' | 'friendly' | 'professional' | 'casual';
    workingHours: { start: string; end: string };
    notificationLevel: 'high' | 'medium' | 'low';
    preferredChannels: string[];
  };
}

export interface KnowledgeBase {
  insights: {
    id: string;
    content: string;
    source: string; // which assistant discovered this
    confidence: number; // 0-1
    timestamp: Date;
    category: 'behavior' | 'preference' | 'business' | 'performance';
  }[];
  patterns: {
    id: string;
    pattern: string;
    frequency: number;
    lastSeen: Date;
    assistants: string[]; // which assistants have observed this
  }[];
  successMetrics: {
    metric: string;
    baseline: number;
    current: number;
    improvement: number;
    lastUpdated: Date;
  }[];
  projects: {
    id: string;
    name: string;
    status: 'active' | 'paused' | 'completed' | 'cancelled';
    assistantsInvolved: string[];
    startDate: Date;
    targetDate?: Date;
    completionDate?: Date;
    outcomes: string[];
  }[];
}

export interface AssistantRelationship {
  assistantId: string;
  interactionCount: number;
  trustLevel: number; // 0-1
  expertiseAreas: string[];
  successfulTasks: number;
  lastInteraction: Date;
  userSatisfaction: number; // 0-5
  preferredTaskTypes: string[];
  communicationNotes: string[];
}

export interface BrainAIData {
  userProfile: UserProfile;
  knowledgeBase: KnowledgeBase;
  relationships: { [assistantId: string]: AssistantRelationship };
  globalContext: {
    currentFocus: string;
    activeProjects: string[];
    recentAchievements: string[];
    upcomingDeadlines: Array<{ task: string; date: Date; priority: 'high' | 'medium' | 'low' }>;
  };
  analytics: {
    totalTasksCompleted: number;
    averageTaskCompletionTime: number; // in hours
    mostProductiveTimeOfDay: string;
    mostEffectiveAssistant: string;
    weeklyProductivityTrend: number[];
    monthlyGoalProgress: { [goal: string]: number };
  };
  lastUpdated: Date;
}

class BrainAIManager {
  private data: BrainAIData;
  private storageKey = 'brain_ai_data';

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): BrainAIData {
    try {
      if (typeof window === 'undefined') return this.getDefaultData();
      
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Restore Date objects
        parsed.lastUpdated = new Date(parsed.lastUpdated);
        parsed.knowledgeBase.insights.forEach((insight: any) => {
          insight.timestamp = new Date(insight.timestamp);
        });
        parsed.knowledgeBase.patterns.forEach((pattern: any) => {
          pattern.lastSeen = new Date(pattern.lastSeen);
        });
        return parsed;
      }
    } catch (error) {
      console.warn('Failed to load Brain AI data:', error);
    }
    
    return this.getDefaultData();
  }

  private saveData(): void {
    try {
      if (typeof window === 'undefined') return;
      this.data.lastUpdated = new Date();
      localStorage.setItem(this.storageKey, JSON.stringify(this.data));
    } catch (error) {
      console.warn('Failed to save Brain AI data:', error);
    }
  }

  private getDefaultData(): BrainAIData {
    return {
      userProfile: {
        personal: {
          name: "María González",
          timezone: "America/Mexico_City",
          language: "es"
        },
        business: {
          company: "Café Luna CDMX",
          industry: "Gastronomía",
          size: "small",
          revenue: "$50K-$100K/año",
          growthStage: "growth"
        },
        goals: {
          primary: ["Aumentar ventas online 30%", "Mejorar presencia en redes sociales", "Automatizar atención al cliente"],
          secondary: ["Optimizar operaciones", "Expandir menú", "Aumentar clientela local"],
          timeline: "6-months",
          priority: "marketing"
        },
        preferences: {
          communicationStyle: "friendly",
          workingHours: { start: "09:00", end: "18:00" },
          notificationLevel: "medium",
          preferredChannels: ["whatsapp", "instagram", "email"]
        }
      },
      knowledgeBase: {
        insights: [
          {
            id: "insight_1",
            content: "María responde mejor a sugerencias con ejemplos visuales específicos",
            source: "sofia",
            confidence: 0.8,
            timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            category: "preference"
          },
          {
            id: "insight_2", 
            content: "El café Luna tiene mejor engagement en posts de behind-the-scenes",
            source: "sofia",
            confidence: 0.9,
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            category: "business"
          }
        ],
        patterns: [
          {
            id: "pattern_1",
            pattern: "María tiende a solicitar ajustes de copy después de revisar métricas",
            frequency: 4,
            lastSeen: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            assistants: ["paula", "sofia"]
          }
        ],
        successMetrics: [
          {
            metric: "Instagram Engagement Rate",
            baseline: 2.3,
            current: 4.1,
            improvement: 78.3,
            lastUpdated: new Date(Date.now() - 12 * 60 * 60 * 1000)
          }
        ],
        projects: [
          {
            id: "project_1",
            name: "Campaña Q4 Café Luna",
            status: "active",
            assistantsInvolved: ["sofia", "paula"],
            startDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
            targetDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
            outcomes: ["Aumentar ventas 25%", "Crecer seguidores 40%"]
          }
        ]
      },
      relationships: {
        sofia: {
          assistantId: "sofia",
          interactionCount: 23,
          trustLevel: 0.85,
          expertiseAreas: ["content_creation", "social_strategy", "trend_analysis"],
          successfulTasks: 18,
          lastInteraction: new Date(Date.now() - 2 * 60 * 60 * 1000),
          userSatisfaction: 4.6,
          preferredTaskTypes: ["content_creation", "strategy_planning"],
          communicationNotes: ["Prefiere ejemplos visuales", "Responde bien a propuestas creativas"]
        },
        carlos: {
          assistantId: "carlos",
          interactionCount: 12,
          trustLevel: 0.75,
          expertiseAreas: ["customer_support", "process_optimization", "automation"],
          successfulTasks: 10,
          lastInteraction: new Date(Date.now() - 8 * 60 * 60 * 1000),
          userSatisfaction: 4.3,
          preferredTaskTypes: ["automation_setup", "customer_queries"],
          communicationNotes: ["Valora soluciones escalables", "Prefiere implementación paso a paso"]
        },
        paula: {
          assistantId: "paula",
          interactionCount: 15,
          trustLevel: 0.80,
          expertiseAreas: ["copywriting", "conversion_optimization", "persuasive_writing"],
          successfulTasks: 13,
          lastInteraction: new Date(Date.now() - 4 * 60 * 60 * 1000),
          userSatisfaction: 4.4,
          preferredTaskTypes: ["copy_optimization", "landing_pages"],
          communicationNotes: ["Aprecia datos de conversión", "Prefiere copy directo y persuasivo"]
        }
      },
      globalContext: {
        currentFocus: "Optimizar campaña navideña Q4",
        activeProjects: ["project_1"],
        recentAchievements: ["Aumentó engagement 78%", "Automatizó respuestas WhatsApp", "Optimizó landing page (+23% conversión)"],
        upcomingDeadlines: [
          { task: "Lanzar campaña Black Friday", date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), priority: "high" },
          { task: "Revisar métricas Q4", date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), priority: "medium" }
        ]
      },
      analytics: {
        totalTasksCompleted: 41,
        averageTaskCompletionTime: 2.4,
        mostProductiveTimeOfDay: "10:00-12:00",
        mostEffectiveAssistant: "sofia",
        weeklyProductivityTrend: [85, 92, 78, 94, 88, 91, 87],
        monthlyGoalProgress: {
          "Aumentar ventas online": 65,
          "Mejorar presencia redes": 78,
          "Automatizar atención cliente": 45
        }
      },
      lastUpdated: new Date()
    };
  }

  // Public API methods
  getUserProfile(): UserProfile {
    return this.data.userProfile;
  }

  updateUserProfile(updates: Partial<UserProfile>): void {
    this.data.userProfile = { ...this.data.userProfile, ...updates };
    this.saveData();
  }

  addInsight(insight: Omit<KnowledgeBase['insights'][0], 'id' | 'timestamp'>): void {
    const newInsight = {
      ...insight,
      id: `insight_${Date.now()}`,
      timestamp: new Date()
    };
    this.data.knowledgeBase.insights.push(newInsight);
    this.saveData();
  }

  getContextForAssistant(assistantId: string): any {
    const relationship = this.data.relationships[assistantId];
    const relevantInsights = this.data.knowledgeBase.insights.filter(
      insight => insight.source === assistantId || insight.category === 'business'
    );
    
    return {
      userProfile: this.data.userProfile,
      relationship,
      relevantInsights,
      globalContext: this.data.globalContext,
      recentPatterns: this.data.knowledgeBase.patterns.slice(-3)
    };
  }

  updateRelationship(assistantId: string, updates: Partial<AssistantRelationship>): void {
    if (!this.data.relationships[assistantId]) {
      this.data.relationships[assistantId] = {
        assistantId,
        interactionCount: 0,
        trustLevel: 0.5,
        expertiseAreas: [],
        successfulTasks: 0,
        lastInteraction: new Date(),
        userSatisfaction: 3.0,
        preferredTaskTypes: [],
        communicationNotes: []
      };
    }
    
    this.data.relationships[assistantId] = {
      ...this.data.relationships[assistantId],
      ...updates,
      lastInteraction: new Date()
    };
    this.saveData();
  }

  getBrainAIData(): BrainAIData {
    return this.data;
  }

  getAssistantRecommendation(taskType: string): string {
    // Find the best assistant for this task type based on historical performance
    const assistants = Object.values(this.data.relationships);
    const bestAssistant = assistants
      .filter(rel => rel.preferredTaskTypes.includes(taskType))
      .sort((a, b) => (b.trustLevel * b.userSatisfaction) - (a.trustLevel * a.userSatisfaction))[0];
    
    return bestAssistant?.assistantId || 'sofia'; // default fallback
  }
}

export const brainAI = new BrainAIManager();
