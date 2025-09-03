// 🧠 CEREBRO AI - Sistema Central de Inteligencia
// Conecta todos los asistentes con memoria compartida y aprendizaje continuo

import { huggingFaceService } from './huggingface-service';
import { conversationMemory } from './conversation-memory';
import { dashboardMetrics } from './dashboard-metrics';

export interface CerebroMemory {
  userProfile: {
    name: string;
    company: string;
    industry: string;
    role: string;
    workingStyle: 'fast-paced' | 'methodical' | 'collaborative' | 'independent';
    communicationPrefs: 'direct' | 'detailed' | 'visual' | 'conversational';
    decisionMaking: 'data-driven' | 'intuitive' | 'consensus-based' | 'analytical';
  };
  
  businessContext: {
    challenges: string[];
    opportunities: string[];
    currentProjects: {
      name: string;
      status: 'planning' | 'active' | 'review' | 'completed';
      assistantsInvolved: string[];
      priority: 'low' | 'medium' | 'high' | 'critical';
    }[];
    competitiveAdvantages: string[];
    painPoints: string[];
  };

  crossAssistantInsights: {
    id: string;
    insight: string;
    discoveredBy: string;
    validatedBy: string[];
    confidence: number;
    impact: 'low' | 'medium' | 'high';
    actionable: boolean;
    timestamp: Date;
  }[];

  assistantRelationships: {
    [assistantId: string]: {
      trustLevel: number; // 0-100
      interactionCount: number;
      successfulTasks: number;
      lastInteraction: Date;
      preferredTaskTypes: string[];
      userSatisfaction: number; // 0-5
      communicationPatterns: string[];
    };
  };

  learningPatterns: {
    userBehavior: {
      mostActiveHours: string[];
      preferredAssistants: string[];
      taskCompletionStyle: string;
      feedbackPatterns: string[];
    };
    businessPatterns: {
      seasonalTrends: string[];
      successfulStrategies: string[];
      commonBottlenecks: string[];
      growthIndicators: string[];
    };
  };

  intelligentContext: {
    currentFocus: string;
    upcomingDeadlines: { task: string; date: Date; priority: string }[];
    recentAchievements: string[];
    emergingNeeds: string[];
    predictedChallenges: string[];
  };
}

interface CerebroInsight {
  type: 'pattern' | 'opportunity' | 'risk' | 'optimization';
  title: string;
  description: string;
  evidence: string[];
  recommendations: string[];
  assistantsToInvolve: string[];
  confidence: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

class CerebroAI {
  private memory: CerebroMemory;
  private isLearning: boolean = false;

  constructor() {
    this.memory = this.initializeMemory();
    this.loadFromStorage();
  }

  private initializeMemory(): CerebroMemory {
    return {
      userProfile: {
        name: 'Usuario',
        company: 'Mi Empresa',
        industry: 'Tecnología',
        role: 'Emprendedor',
        workingStyle: 'fast-paced',
        communicationPrefs: 'conversational',
        decisionMaking: 'data-driven'
      },
      businessContext: {
        challenges: [],
        opportunities: [],
        currentProjects: [],
        competitiveAdvantages: [],
        painPoints: []
      },
      crossAssistantInsights: [],
      assistantRelationships: {},
      learningPatterns: {
        userBehavior: {
          mostActiveHours: [],
          preferredAssistants: [],
          taskCompletionStyle: '',
          feedbackPatterns: []
        },
        businessPatterns: {
          seasonalTrends: [],
          successfulStrategies: [],
          commonBottlenecks: [],
          growthIndicators: []
        }
      },
      intelligentContext: {
        currentFocus: '',
        upcomingDeadlines: [],
        recentAchievements: [],
        emergingNeeds: [],
        predictedChallenges: []
      }
    };
  }

  // 🧠 ANÁLISIS INTELIGENTE CON IA
  async analyzeUserBehavior(assistantId: string, interaction: any): Promise<CerebroInsight[]> {
    this.isLearning = true;
    const insights: CerebroInsight[] = [];

    try {
      // Obtener historial de conversaciones
      const conversationHistory = conversationMemory.getRecentMessages(assistantId, 20);
      const userMessages = conversationHistory.filter(m => m.role === 'user');
      
      // Crear prompt para análisis de comportamiento
      const analysisPrompt = `
        Analiza el comportamiento del usuario basándote en estas interacciones:
        
        PERFIL ACTUAL: ${JSON.stringify(this.memory.userProfile)}
        MENSAJES RECIENTES: ${userMessages.slice(-10).map(m => m.content).join('\n')}
        MÉTRICAS: ${JSON.stringify(dashboardMetrics.getMetrics())}
        
        Identifica:
        1. Patrones de comunicación
        2. Preferencias de trabajo
        3. Objetivos implícitos
        4. Oportunidades de mejora
        
        Responde en formato JSON con insights accionables.
      `;

      // Usar IA para análisis
      const aiResponse = await huggingFaceService.generateResponse(
        { id: 'cerebro', name: 'Cerebro AI', role: 'Analyst' } as any,
        analysisPrompt,
        conversationHistory
      );

      if (aiResponse.success) {
        // Parsear respuesta de IA y convertir a insights
        const analysisResult = this.parseAIAnalysis(aiResponse.content);
        insights.push(...analysisResult);
      }

      // Análisis basado en reglas (fallback)
      const ruleBasedInsights = this.analyzeWithRules(assistantId, interaction);
      insights.push(...ruleBasedInsights);

    } catch (error) {
      console.error('Error in AI behavior analysis:', error);
    } finally {
      this.isLearning = false;
    }

    return insights;
  }

  // 🔄 COMPARTIR CONTEXTO ENTRE ASISTENTES
  async shareContextBetweenAssistants(fromAssistant: string, toAssistant: string, context: any): Promise<string> {
    try {
      const sharedContext = this.buildSharedContext(fromAssistant, toAssistant, context);
      
      // Usar IA para generar transferencia de contexto inteligente
      const transferPrompt = `
        El usuario está cambiando de ${fromAssistant} a ${toAssistant}.
        
        CONTEXTO COMPARTIDO:
        ${JSON.stringify(sharedContext)}
        
        ÚLTIMO TRABAJO CON ${fromAssistant}:
        ${context.lastTask || 'Conversación general'}
        
        PERFIL DEL USUARIO:
        ${JSON.stringify(this.memory.userProfile)}
        
        Genera un briefing para ${toAssistant} que incluya:
        1. Contexto relevante del trabajo anterior
        2. Información del usuario que debe conocer
        3. Posibles conexiones con el trabajo de ${fromAssistant}
        4. Recomendaciones para continuidad
        
        Responde como si fueras el Cerebro AI informando a ${toAssistant}.
      `;

      const aiResponse = await huggingFaceService.generateResponse(
        { id: 'cerebro', name: 'Cerebro AI', role: 'Context Manager' } as any,
        transferPrompt,
        []
      );

      if (aiResponse.success) {
        return aiResponse.content;
      }

    } catch (error) {
      console.error('Error sharing context:', error);
    }

    // Fallback: contexto básico
    return this.generateBasicContextTransfer(fromAssistant, toAssistant, context);
  }

  // 🎯 PREDICCIÓN INTELIGENTE DE NECESIDADES
  async predictUserNeeds(): Promise<{
    immediateNeeds: string[];
    upcomingOpportunities: string[];
    recommendedActions: string[];
    assistantSuggestions: { assistant: string; reason: string }[];
  }> {
    try {
      const allConversations = this.getAllRecentConversations();
      const metrics = dashboardMetrics.getMetrics();
      
      const predictionPrompt = `
        Analiza la actividad reciente del usuario para predecir necesidades:
        
        PERFIL: ${JSON.stringify(this.memory.userProfile)}
        CONVERSACIONES RECIENTES: ${JSON.stringify(allConversations.slice(-20))}
        MÉTRICAS: ${JSON.stringify(metrics)}
        PROYECTOS ACTIVOS: ${JSON.stringify(this.memory.businessContext.currentProjects)}
        
        Predice:
        1. Necesidades inmediatas (próximas 24-48h)
        2. Oportunidades emergentes (próxima semana)
        3. Acciones recomendadas
        4. Qué asistente sería más útil y por qué
        
        Responde en formato JSON estructurado.
      `;

      const aiResponse = await huggingFaceService.generateResponse(
        { id: 'cerebro', name: 'Cerebro AI', role: 'Predictor' } as any,
        predictionPrompt,
        []
      );

      if (aiResponse.success) {
        return this.parsePredictions(aiResponse.content);
      }

    } catch (error) {
      console.error('Error predicting user needs:', error);
    }

    // Fallback: predicciones basadas en reglas
    return this.generateRuleBasedPredictions();
  }

  // 🔍 ANÁLISIS CRUZADO DE ASISTENTES
  async performCrossAssistantAnalysis(): Promise<CerebroInsight[]> {
    const insights: CerebroInsight[] = [];

    try {
      // Recopilar datos de todos los asistentes
      const allData = this.gatherCrossAssistantData();
      
      const analysisPrompt = `
        Realiza un análisis cruzado de todos los asistentes del usuario:
        
        DATOS CONSOLIDADOS: ${JSON.stringify(allData)}
        RELACIONES ENTRE ASISTENTES: ${JSON.stringify(this.memory.assistantRelationships)}
        
        Identifica:
        1. Sinergias entre asistentes
        2. Oportunidades de colaboración
        3. Gaps en el servicio
        4. Optimizaciones posibles
        5. Patrones de uso inusuales
        
        Genera insights accionables para mejorar la experiencia.
      `;

      const aiResponse = await huggingFaceService.generateResponse(
        { id: 'cerebro', name: 'Cerebro AI', role: 'Cross Analyzer' } as any,
        analysisPrompt,
        []
      );

      if (aiResponse.success) {
        insights.push(...this.parseCrossAnalysis(aiResponse.content));
      }

    } catch (error) {
      console.error('Error in cross-assistant analysis:', error);
    }

    return insights;
  }

  // 📊 MÉTODOS DE UTILIDAD
  updateUserProfile(updates: Partial<CerebroMemory['userProfile']>): void {
    this.memory.userProfile = { ...this.memory.userProfile, ...updates };
    this.saveToStorage();
  }

  addInsight(insight: Omit<CerebroMemory['crossAssistantInsights'][0], 'id' | 'timestamp'>): void {
    const newInsight = {
      ...insight,
      id: `insight_${Date.now()}`,
      timestamp: new Date()
    };
    this.memory.crossAssistantInsights.push(newInsight);
    this.saveToStorage();
  }

  updateAssistantRelationship(assistantId: string, updates: Partial<CerebroMemory['assistantRelationships'][string]>): void {
    if (!this.memory.assistantRelationships[assistantId]) {
      this.memory.assistantRelationships[assistantId] = {
        trustLevel: 50,
        interactionCount: 0,
        successfulTasks: 0,
        lastInteraction: new Date(),
        preferredTaskTypes: [],
        userSatisfaction: 3,
        communicationPatterns: []
      };
    }
    
    this.memory.assistantRelationships[assistantId] = {
      ...this.memory.assistantRelationships[assistantId],
      ...updates
    };
    this.saveToStorage();
  }

  getMemory(): CerebroMemory {
    return this.memory;
  }

  // Métodos privados de análisis y parsing...
  private parseAIAnalysis(content: string): CerebroInsight[] {
    // Implementar parsing de respuesta de IA
    return [];
  }

  private analyzeWithRules(assistantId: string, interaction: any): CerebroInsight[] {
    // Implementar análisis basado en reglas
    return [];
  }

  private buildSharedContext(from: string, to: string, context: any): any {
    // Construir contexto compartido
    return {};
  }

  private generateBasicContextTransfer(from: string, to: string, context: any): string {
    return `El usuario viene de trabajar con ${from}. Último contexto: ${context.lastMessage || 'Conversación general'}`;
  }

  private getAllRecentConversations(): any[] {
    // Obtener conversaciones de todos los asistentes
    return [];
  }

  private parsePredictions(content: string): any {
    // Parsear predicciones de IA
    return {
      immediateNeeds: [],
      upcomingOpportunities: [],
      recommendedActions: [],
      assistantSuggestions: []
    };
  }

  private generateRuleBasedPredictions(): any {
    // Predicciones basadas en reglas
    return {
      immediateNeeds: ['Revisar métricas del día'],
      upcomingOpportunities: ['Optimizar estrategia de contenido'],
      recommendedActions: ['Agendar revisión semanal'],
      assistantSuggestions: [
        { assistant: 'sofia', reason: 'Necesitas actualizar contenido social' }
      ]
    };
  }

  private gatherCrossAssistantData(): any {
    // Recopilar datos cruzados
    return {};
  }

  private parseCrossAnalysis(content: string): CerebroInsight[] {
    // Parsear análisis cruzado
    return [];
  }

  private loadFromStorage(): void {
    if (typeof window === 'undefined') return;
    
    try {
      const saved = localStorage.getItem('cerebro_memory');
      if (saved) {
        const parsed = JSON.parse(saved);
        this.memory = { ...this.memory, ...parsed };
      }
    } catch (error) {
      console.error('Error loading Cerebro memory:', error);
    }
  }

  private saveToStorage(): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem('cerebro_memory', JSON.stringify(this.memory));
    } catch (error) {
      console.error('Error saving Cerebro memory:', error);
    }
  }
}

// Export singleton instance
export const cerebroAI = new CerebroAI();

// Types are already exported above
