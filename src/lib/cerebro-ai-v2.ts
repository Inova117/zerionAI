// 🧠 CEREBRO AI V2 - Sistema Central de Inteligencia con Persistencia Real
// Conecta todos los asistentes con memoria compartida en Supabase + IA avanzada

import { createClient } from '@supabase/supabase-js';
import { huggingFaceService } from './huggingface-service';

// Cliente Supabase para Cerebro AI
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// 🧠 INTERFACES DEL CEREBRO AI V2
export interface UserProfileData {
  id?: string;
  user_id: string;
  name: string;
  company: string;
  industry: string;
  role: string;
  working_style: 'fast-paced' | 'methodical' | 'collaborative' | 'independent';
  communication_prefs: 'direct' | 'detailed' | 'visual' | 'conversational';
  decision_making: 'data-driven' | 'intuitive' | 'consensus-based' | 'analytical';
  business_context: {
    challenges: string[];
    opportunities: string[];
    competitive_advantages: string[];
    pain_points: string[];
  };
  learning_patterns: {
    user_behavior: {
      most_active_hours: string[];
      preferred_assistants: string[];
      task_completion_style: string;
      feedback_patterns: string[];
    };
    business_patterns: {
      seasonal_trends: string[];
      successful_strategies: string[];
      common_bottlenecks: string[];
      growth_indicators: string[];
    };
  };
  intelligent_context: {
    current_focus: string;
    recent_achievements: string[];
    emerging_needs: string[];
    predicted_challenges: string[];
  };
  created_at?: string;
  updated_at?: string;
}

export interface AssistantRelationship {
  id?: string;
  user_id: string;
  assistant_id: string;
  trust_level: number; // 0-100
  interaction_count: number;
  successful_tasks: number;
  user_satisfaction: number; // 0-5
  preferred_task_types: string[];
  communication_patterns: string[];
  assistant_memory: {
    user_preferences: Record<string, any>;
    completed_tasks: any[];
    failed_tasks: any[];
    learning_notes: string[];
    contextual_insights: any[];
  };
  last_interaction: string;
  created_at?: string;
  updated_at?: string;
}

export interface CerebroInsight {
  id?: string;
  user_id: string;
  discovered_by: string; // assistant_id
  validated_by: string[];
  insight_type: 'pattern' | 'opportunity' | 'risk' | 'optimization' | 'behavior' | 'activity';
  title: string;
  content: string;
  confidence: number; // 0-1
  impact: 'low' | 'medium' | 'high' | 'critical';
  priority: 'low' | 'medium' | 'high' | 'critical';
  actionable: boolean;
  acted_upon: boolean;
  metadata: Record<string, any>;
  related_insights: string[]; // UUIDs
  created_at?: string;
  updated_at?: string;
}

export interface ConversationMemory {
  id?: string;
  user_id: string;
  assistant_id: string;
  conversation_id: string;
  session_context: Record<string, any>;
  key_topics: string[];
  user_intents: string[];
  extracted_preferences: Record<string, any>;
  user_mood?: string;
  conversation_tone?: string;
  satisfaction_level?: number; // 1-5
  started_at: string;
  ended_at?: string;
  duration_minutes?: number;
  created_at?: string;
  updated_at?: string;
}

// 🧠 CLASE PRINCIPAL DEL CEREBRO AI V2
class CerebroAIV2 {
  private userId: string | null = null;
  private cache: {
    userProfile?: UserProfileData;
    assistantRelationships?: Map<string, AssistantRelationship>;
    lastCacheUpdate?: Date;
  } = {};

  constructor() {
    this.initializeAuth();
  }

  private async initializeAuth() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        this.userId = user.id;
        await this.initializeUserData();
      }
    } catch (error) {
      console.warn('Cerebro AI: Failed to initialize auth:', error);
    }
  }

  // 🎯 INICIALIZACIÓN DE DATOS DEL USUARIO
  private async initializeUserData() {
    if (!this.userId) return;

    try {
      // Verificar si el usuario ya tiene perfil
      const { data: existingProfile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', this.userId)
        .single();

      if (!existingProfile) {
        // Crear perfil inicial
        await this.createInitialProfile();
      }

      // Cargar datos en cache
      await this.refreshCache();
    } catch (error) {
      console.warn('Cerebro AI: Failed to initialize user data:', error);
    }
  }

  private async createInitialProfile() {
    if (!this.userId) return;

    const defaultProfile: Partial<UserProfileData> = {
      user_id: this.userId,
      name: 'Usuario',
      company: 'Mi Empresa',
      industry: 'Tecnología',
      role: 'Emprendedor',
      working_style: 'fast-paced',
      communication_prefs: 'conversational',
      decision_making: 'data-driven',
      business_context: {
        challenges: [],
        opportunities: [],
        competitive_advantages: [],
        pain_points: []
      },
      learning_patterns: {
        user_behavior: {
          most_active_hours: [],
          preferred_assistants: [],
          task_completion_style: '',
          feedback_patterns: []
        },
        business_patterns: {
          seasonal_trends: [],
          successful_strategies: [],
          common_bottlenecks: [],
          growth_indicators: []
        }
      },
      intelligent_context: {
        current_focus: '',
        recent_achievements: [],
        emerging_needs: [],
        predicted_challenges: []
      }
    };

    const { error } = await supabase
      .from('user_profiles')
      .insert(defaultProfile);

    if (error) {
      console.error('Cerebro AI: Failed to create initial profile:', error);
    }
  }

  // 🔄 GESTIÓN DE CACHE
  private async refreshCache() {
    if (!this.userId) return;

    try {
      // Cargar perfil del usuario
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', this.userId)
        .single();

      // Cargar relaciones con asistentes
      const { data: relationships } = await supabase
        .from('assistant_relationships')
        .select('*')
        .eq('user_id', this.userId);

      this.cache.userProfile = profile || undefined;
      this.cache.assistantRelationships = new Map();
      
      relationships?.forEach(rel => {
        this.cache.assistantRelationships!.set(rel.assistant_id, rel);
      });

      this.cache.lastCacheUpdate = new Date();
    } catch (error) {
      console.warn('Cerebro AI: Failed to refresh cache:', error);
    }
  }

  // 🤖 ANÁLISIS INTELIGENTE DE COMPORTAMIENTO DEL USUARIO
  async analyzeUserBehavior(assistantId: string, interaction: {
    message: string;
    timestamp: Date;
    context?: any;
  }): Promise<CerebroInsight[]> {
    if (!this.userId) return [];

    try {
      // Analizar el mensaje con IA
      const analysis = await this.performAIAnalysis(assistantId, interaction);
      
      // Generar insights basados en el análisis
      const insights = await this.generateInsights(assistantId, interaction, analysis);
      
      // Guardar insights en la base de datos
      if (insights.length > 0) {
        await this.saveInsights(insights);
      }

      // Actualizar memoria del asistente
      await this.updateAssistantMemory(assistantId, interaction, insights);

      return insights;
    } catch (error) {
      console.warn('Cerebro AI: Failed to analyze user behavior:', error);
      return [];
    }
  }

  private async performAIAnalysis(assistantId: string, interaction: any) {
    const userProfile = await this.getUserProfile();
    const assistantRel = await this.getAssistantRelationship(assistantId);

    // Prompt especializado para análisis contextual
    const analysisPrompt = `Analiza esta interacción del usuario con el asistente ${assistantId}:

CONTEXTO DEL USUARIO:
- Industria: ${userProfile?.industry}
- Rol: ${userProfile?.role} 
- Estilo de trabajo: ${userProfile?.working_style}
- Preferencias de comunicación: ${userProfile?.communication_prefs}

MENSAJE: "${interaction.message}"

HISTORIAL CON ASISTENTE:
- Interacciones: ${assistantRel?.interaction_count || 0}
- Satisfacción: ${assistantRel?.user_satisfaction || 3}/5
- Tareas exitosas: ${assistantRel?.successful_tasks || 0}

Analiza y responde SOLO con un JSON:
{
  "user_intent": "string",
  "urgency_level": "low|medium|high|critical", 
  "emotional_tone": "string",
  "business_context": "string",
  "preferences_detected": ["preference1", "preference2"],
  "patterns_identified": ["pattern1", "pattern2"],
  "recommended_actions": ["action1", "action2"]
}`;

    try {
      const response = await huggingFaceService.generateResponse(
        { id: 'cerebro', name: 'Cerebro AI' } as any,
        analysisPrompt,
        []
      );

      if (response.success) {
        return JSON.parse(response.content);
      }
    } catch (error) {
      console.warn('Cerebro AI: Failed to perform AI analysis:', error);
    }

    // Fallback a análisis básico
    return {
      user_intent: this.extractBasicIntent(interaction.message),
      urgency_level: this.detectUrgency(interaction.message),
      emotional_tone: 'neutral',
      business_context: userProfile?.industry || 'general',
      preferences_detected: [],
      patterns_identified: [],
      recommended_actions: []
    };
  }

  private async generateInsights(assistantId: string, interaction: any, analysis: any): Promise<CerebroInsight[]> {
    if (!this.userId) return [];

    const insights: Partial<CerebroInsight>[] = [];

    // Insight sobre urgencia
    if (analysis.urgency_level === 'high' || analysis.urgency_level === 'critical') {
      insights.push({
        user_id: this.userId,
        discovered_by: assistantId,
        validated_by: [],
        insight_type: 'behavior',
        title: 'Usuario requiere respuesta urgente',
        content: `Usuario demostró alta urgencia en su solicitud: ${analysis.user_intent}`,
        confidence: 0.8,
        impact: analysis.urgency_level === 'critical' ? 'high' : 'medium',
        priority: analysis.urgency_level === 'critical' ? 'critical' : 'high',
        actionable: true,
        acted_upon: false,
        metadata: {
          urgency_level: analysis.urgency_level,
          original_message: interaction.message,
          analysis: analysis
        },
        related_insights: []
      });
    }

    // Insight sobre preferencias detectadas
    if (analysis.preferences_detected && analysis.preferences_detected.length > 0) {
      insights.push({
        user_id: this.userId,
        discovered_by: assistantId,
        validated_by: [],
        insight_type: 'pattern',
        title: 'Nuevas preferencias detectadas',
        content: `Usuario mostró preferencias hacia: ${analysis.preferences_detected.join(', ')}`,
        confidence: 0.7,
        impact: 'medium',
        priority: 'medium',
        actionable: true,
        acted_upon: false,
        metadata: {
          preferences: analysis.preferences_detected,
          context: analysis.business_context
        },
        related_insights: []
      });
    }

    // Insight sobre patrones de comportamiento
    if (analysis.patterns_identified && analysis.patterns_identified.length > 0) {
      insights.push({
        user_id: this.userId,
        discovered_by: assistantId,
        validated_by: [],
        insight_type: 'pattern',
        title: 'Patrones de comportamiento identificados',
        content: `Patrones detectados: ${analysis.patterns_identified.join(', ')}`,
        confidence: 0.6,
        impact: 'low',
        priority: 'low',
        actionable: false,
        acted_upon: false,
        metadata: {
          patterns: analysis.patterns_identified,
          timestamp: interaction.timestamp
        },
        related_insights: []
      });
    }

    return insights as CerebroInsight[];
  }

  private async saveInsights(insights: CerebroInsight[]) {
    try {
      const { error } = await supabase
        .from('cross_assistant_insights')
        .insert(insights);

      if (error) {
        console.error('Cerebro AI: Failed to save insights:', error);
      }
    } catch (error) {
      console.warn('Cerebro AI: Failed to save insights:', error);
    }
  }

  // 🔗 ACTUALIZACIÓN DE RELACIONES CON ASISTENTES
  async updateAssistantRelationship(assistantId: string, updates: Partial<AssistantRelationship>) {
    if (!this.userId) return;

    try {
      const existing = await this.getAssistantRelationship(assistantId);
      
      if (existing) {
        // Actualizar relación existente
        const { error } = await supabase
          .from('assistant_relationships')
          .update({
            ...updates,
            last_interaction: new Date().toISOString()
          })
          .eq('user_id', this.userId)
          .eq('assistant_id', assistantId);

        if (error) {
          console.error('Cerebro AI: Failed to update assistant relationship:', error);
        }
      } else {
        // Crear nueva relación
        const newRelationship: Partial<AssistantRelationship> = {
          user_id: this.userId,
          assistant_id: assistantId,
          trust_level: 50,
          interaction_count: 1,
          successful_tasks: 0,
          user_satisfaction: 3.0,
          preferred_task_types: [],
          communication_patterns: [],
          assistant_memory: {
            user_preferences: {},
            completed_tasks: [],
            failed_tasks: [],
            learning_notes: [],
            contextual_insights: []
          },
          last_interaction: new Date().toISOString(),
          ...updates
        };

        const { error } = await supabase
          .from('assistant_relationships')
          .insert(newRelationship);

        if (error) {
          console.error('Cerebro AI: Failed to create assistant relationship:', error);
        }
      }

      // Actualizar cache
      await this.refreshCache();
    } catch (error) {
      console.warn('Cerebro AI: Failed to update assistant relationship:', error);
    }
  }

  private async updateAssistantMemory(assistantId: string, interaction: any, insights: CerebroInsight[]) {
    const relationship = await this.getAssistantRelationship(assistantId);
    
    if (relationship) {
      const updatedMemory = { ...relationship.assistant_memory };
      
      // Agregar insights a la memoria del asistente
      updatedMemory.contextual_insights.push({
        timestamp: interaction.timestamp,
        interaction: interaction.message,
        insights: insights.map(i => ({ type: i.insight_type, content: i.content }))
      });

      // Mantener solo los últimos 50 insights por asistente
      if (updatedMemory.contextual_insights.length > 50) {
        updatedMemory.contextual_insights = updatedMemory.contextual_insights.slice(-50);
      }

      await this.updateAssistantRelationship(assistantId, {
        assistant_memory: updatedMemory,
        interaction_count: relationship.interaction_count + 1
      });
    }
  }

  // 📊 MÉTODOS DE CONSULTA
  async getUserProfile(): Promise<UserProfileData | null> {
    if (this.cache.userProfile) {
      return this.cache.userProfile;
    }

    await this.refreshCache();
    return this.cache.userProfile || null;
  }

  async getAssistantRelationship(assistantId: string): Promise<AssistantRelationship | null> {
    if (this.cache.assistantRelationships?.has(assistantId)) {
      return this.cache.assistantRelationships.get(assistantId) || null;
    }

    await this.refreshCache();
    return this.cache.assistantRelationships?.get(assistantId) || null;
  }

  async getRecentInsights(limit: number = 10): Promise<CerebroInsight[]> {
    if (!this.userId) return [];

    try {
      const { data, error } = await supabase
        .from('cross_assistant_insights')
        .select('*')
        .eq('user_id', this.userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Cerebro AI: Failed to get recent insights:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.warn('Cerebro AI: Failed to get recent insights:', error);
      return [];
    }
  }

  // 🔍 MÉTODOS AUXILIARES
  private extractBasicIntent(message: string): string {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('ayuda') || lowerMessage.includes('help')) return 'solicitar_ayuda';
    if (lowerMessage.includes('crear') || lowerMessage.includes('generar')) return 'crear_contenido';
    if (lowerMessage.includes('analizar') || lowerMessage.includes('revisar')) return 'analizar_datos';
    if (lowerMessage.includes('automatizar') || lowerMessage.includes('optimizar')) return 'mejorar_proceso';
    if (lowerMessage.includes('problema') || lowerMessage.includes('error')) return 'resolver_problema';
    
    return 'consulta_general';
  }

  private detectUrgency(message: string): 'low' | 'medium' | 'high' | 'critical' {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('urgente') || lowerMessage.includes('ya') || lowerMessage.includes('ahora')) return 'high';
    if (lowerMessage.includes('crítico') || lowerMessage.includes('emergencia')) return 'critical';
    if (lowerMessage.includes('pronto') || lowerMessage.includes('rápido')) return 'medium';
    
    return 'low';
  }

  // 🌐 MÉTODOS PÚBLICOS PARA INTEGRACIÓN
  async updateUserProfile(updates: Partial<UserProfileData>) {
    if (!this.userId) return;

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('user_id', this.userId);

      if (error) {
        console.error('Cerebro AI: Failed to update user profile:', error);
      } else {
        await this.refreshCache();
      }
    } catch (error) {
      console.warn('Cerebro AI: Failed to update user profile:', error);
    }
  }

  async getContextForAssistant(assistantId: string): Promise<{
    userProfile: UserProfileData | null;
    relationship: AssistantRelationship | null;
    recentInsights: CerebroInsight[];
  }> {
    const [userProfile, relationship, recentInsights] = await Promise.all([
      this.getUserProfile(),
      this.getAssistantRelationship(assistantId),
      this.getRecentInsights(5)
    ]);

    return {
      userProfile,
      relationship,
      recentInsights: recentInsights.filter(insight => 
        insight.discovered_by === assistantId || insight.validated_by.includes(assistantId)
      )
    };
  }
}

// 🌟 EXPORTAR INSTANCIA SINGLETON
export const cerebroAIV2 = new CerebroAIV2();
export default cerebroAIV2;
