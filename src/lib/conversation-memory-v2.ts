// 💬 CONVERSATION MEMORY V2 - Conectado a Supabase Real
// Reemplaza localStorage con persistencia real

import { supabaseConversationService, type ConversationMessage } from './supabase-services';

interface ConversationMemory {
  assistantId: string;
  messages: ConversationMessage[];
  context: {
    userPreferences: string[];
    businessContext: string[];
    successfulInteractions: number;
    lastInteractionTime: Date;
  };
  insights: {
    communicationStyle: string;
    preferredTopics: string[];
    responsePatterns: string[];
  };
  totalInteractions: number;
}

class ConversationMemoryV2 {
  private storage: { [assistantId: string]: ConversationMemory } = {};
  private initialized = false;

  constructor() {
    this.loadFromSupabase();
  }

  private async loadFromSupabase() {
    if (this.initialized) return;

    try {
      // Por ahora inicializamos vacío - los mensajes se cargan bajo demanda
      this.initialized = true;
    } catch (error) {
      console.warn('Conversation Memory V2: Failed to initialize:', error);
    }
  }

  async initializeAssistant(assistantId: string) {
    if (this.storage[assistantId]) return;

    try {
      // Cargar mensajes recientes del asistente
      const messages = await supabaseConversationService.getRecentMessages(assistantId, 50);
      
      this.storage[assistantId] = {
        assistantId,
        messages,
        context: {
          userPreferences: [],
          businessContext: [],
          successfulInteractions: 0,
          lastInteractionTime: new Date()
        },
        insights: {
          communicationStyle: 'conversational',
          preferredTopics: [],
          responsePatterns: []
        },
        totalInteractions: messages.length
      };

      // Analizar mensajes para extraer insights
      this.analyzeConversationPatterns(assistantId);
    } catch (error) {
      console.warn(`Failed to initialize assistant ${assistantId}:`, error);
      
      // Crear memoria vacía como fallback
      this.storage[assistantId] = {
        assistantId,
        messages: [],
        context: {
          userPreferences: [],
          businessContext: [],
          successfulInteractions: 0,
          lastInteractionTime: new Date()
        },
        insights: {
          communicationStyle: 'conversational',
          preferredTopics: [],
          responsePatterns: []
        },
        totalInteractions: 0
      };
    }
  }

  async addMessage(
    assistantId: string,
    role: 'user' | 'assistant',
    content: string,
    type: string = 'text',
    metadata?: any
  ) {
    await this.initializeAssistant(assistantId);

    // Como ConversationMessage requiere user_id, pero el servicio ya lo maneja internamente,
    // pasamos el mensaje sin user_id que el servicio añadirá automáticamente
    const messageData = {
      assistant_id: assistantId,
      conversation_id: `conv_${assistantId}_${Date.now()}`,
      role,
      content,
      type,
      metadata
    };

    try {
      // Guardar en Supabase
      await supabaseConversationService.addMessage(messageData);

      // Actualizar memoria local
      const memory = this.storage[assistantId];
      if (memory) {
        // Crear mensaje completo para memoria local (user_id se añade en Supabase)
        const memoryMessage: ConversationMessage = {
          ...messageData,
          user_id: 'local_user', // Placeholder - en Supabase se usará el real
          id: `local_${Date.now()}`
        };
        memory.messages.push(memoryMessage);
        memory.totalInteractions += 1;
        memory.context.lastInteractionTime = new Date();

        // Mantener solo los últimos 100 mensajes en memoria
        if (memory.messages.length > 100) {
          memory.messages = memory.messages.slice(-100);
        }

        // Analizar patrones si es mensaje del usuario
        if (role === 'user') {
          this.updateContextFromMessage(memory, content, type);
        }
      }
    } catch (error) {
      console.error('Failed to add message to Supabase:', error);
      
      // Fallback: agregar solo a memoria local
      const memory = this.storage[assistantId];
      if (memory) {
        const fallbackMessage: ConversationMessage = {
          ...messageData,
          user_id: 'local_user',
          id: `fallback_${Date.now()}`
        };
        memory.messages.push(fallbackMessage);
        memory.totalInteractions += 1;
      }
    }
  }

  private updateContextFromMessage(memory: ConversationMemory, content: string, type: string) {
    const lowerContent = content.toLowerCase();

    // Detectar preferencias del usuario
    if (lowerContent.includes('prefiero') || lowerContent.includes('me gusta')) {
      const preferences = this.extractPreferences(content);
      preferences.forEach(pref => {
        if (!memory.context.userPreferences.includes(pref)) {
          memory.context.userPreferences.push(pref);
        }
      });
    }

    // Detectar contexto de negocio
    const businessKeywords = ['empresa', 'negocio', 'ventas', 'clientes', 'marketing', 'producto', 'servicio'];
    businessKeywords.forEach(keyword => {
      if (lowerContent.includes(keyword)) {
        const context = this.extractBusinessContext(content, keyword);
        if (context && !memory.context.businessContext.includes(context)) {
          memory.context.businessContext.push(context);
        }
      }
    });

    // Actualizar insights de comunicación
    this.updateCommunicationInsights(memory, content);
  }

  private extractPreferences(content: string): string[] {
    // Lógica simple para extraer preferencias
    const preferences: string[] = [];
    
    if (content.toLowerCase().includes('visual')) preferences.push('contenido_visual');
    if (content.toLowerCase().includes('rápido')) preferences.push('respuestas_rapidas');
    if (content.toLowerCase().includes('detalle')) preferences.push('explicaciones_detalladas');
    if (content.toLowerCase().includes('ejemplo')) preferences.push('ejemplos_practicos');
    
    return preferences;
  }

  private extractBusinessContext(content: string, keyword: string): string | null {
    // Extraer contexto de negocio simple
    const sentences = content.split(/[.!?]/);
    for (const sentence of sentences) {
      if (sentence.toLowerCase().includes(keyword)) {
        return sentence.trim();
      }
    }
    return null;
  }

  private updateCommunicationInsights(memory: ConversationMemory, content: string) {
    const insights = memory.insights;
    
    // Analizar estilo de comunicación
    if (content.length > 100) {
      insights.communicationStyle = 'detailed';
    } else if (content.split(' ').length < 10) {
      insights.communicationStyle = 'concise';
    }

    // Detectar temas preferidos
    const topics = this.extractTopics(content);
    topics.forEach(topic => {
      if (!insights.preferredTopics.includes(topic)) {
        insights.preferredTopics.push(topic);
      }
    });

    // Mantener solo los últimos 10 temas
    if (insights.preferredTopics.length > 10) {
      insights.preferredTopics = insights.preferredTopics.slice(-10);
    }
  }

  private extractTopics(content: string): string[] {
    const topics: string[] = [];
    const lowerContent = content.toLowerCase();

    const topicMap = {
      'redes sociales': ['instagram', 'facebook', 'twitter', 'redes sociales', 'social media'],
      'marketing': ['marketing', 'publicidad', 'promoción', 'campaña'],
      'ventas': ['ventas', 'vender', 'cliente', 'conversión'],
      'automatización': ['automatizar', 'automático', 'bot', 'workflow'],
      'contenido': ['contenido', 'post', 'artículo', 'video', 'imagen'],
      'análisis': ['análisis', 'métricas', 'datos', 'estadísticas']
    };

    Object.entries(topicMap).forEach(([topic, keywords]) => {
      if (keywords.some(keyword => lowerContent.includes(keyword))) {
        topics.push(topic);
      }
    });

    return topics;
  }

  private analyzeConversationPatterns(assistantId: string) {
    const memory = this.storage[assistantId];
    if (!memory || memory.messages.length === 0) return;

    const userMessages = memory.messages.filter(m => m.role === 'user');
    
    // Analizar patrones de respuesta
    const patterns: string[] = [];
    
    if (userMessages.length > 5) {
      const avgLength = userMessages.reduce((sum, msg) => sum + msg.content.length, 0) / userMessages.length;
      if (avgLength > 100) patterns.push('detailed_communicator');
      if (avgLength < 50) patterns.push('concise_communicator');
    }

    // Detectar horarios de actividad
    const hours = userMessages.map(msg => {
      const date = new Date(msg.created_at || new Date());
      return date.getHours();
    });

    const morningMessages = hours.filter(h => h >= 6 && h < 12).length;
    const afternoonMessages = hours.filter(h => h >= 12 && h < 18).length;
    const eveningMessages = hours.filter(h => h >= 18 || h < 6).length;

    if (morningMessages > afternoonMessages && morningMessages > eveningMessages) {
      patterns.push('morning_active');
    } else if (eveningMessages > morningMessages && eveningMessages > afternoonMessages) {
      patterns.push('evening_active');
    }

    memory.insights.responsePatterns = patterns;
  }

  // 📊 MÉTODOS PÚBLICOS (compatibles con versión anterior)

  async getRecentMessages(assistantId: string, limit: number = 20): Promise<ConversationMessage[]> {
    await this.initializeAssistant(assistantId);
    
    const memory = this.storage[assistantId];
    if (!memory) return [];

    // Si necesitamos más mensajes de los que tenemos en memoria, cargar desde Supabase
    if (memory.messages.length < limit) {
      try {
        const messages = await supabaseConversationService.getRecentMessages(assistantId, limit);
        memory.messages = messages;
        return messages;
      } catch (error) {
        console.warn(`Failed to load recent messages for ${assistantId}:`, error);
      }
    }

    return memory.messages.slice(-limit);
  }

  async getConversationHistory(assistantId: string, limit: number = 100): Promise<ConversationMessage[]> {
    try {
      return await supabaseConversationService.getConversationHistory(assistantId, limit);
    } catch (error) {
      console.warn(`Failed to load conversation history for ${assistantId}:`, error);
      
      // Fallback a memoria local
      await this.initializeAssistant(assistantId);
      const memory = this.storage[assistantId];
      return memory ? memory.messages.slice(-limit) : [];
    }
  }

  getMemoryForAssistant(assistantId: string): ConversationMemory | null {
    return this.storage[assistantId] || null;
  }

  async getUserPreferences(assistantId: string): Promise<string[]> {
    await this.initializeAssistant(assistantId);
    const memory = this.storage[assistantId];
    return memory ? memory.context.userPreferences : [];
  }

  async getBusinessContext(assistantId: string): Promise<string[]> {
    await this.initializeAssistant(assistantId);
    const memory = this.storage[assistantId];
    return memory ? memory.context.businessContext : [];
  }

  async getCommunicationInsights(assistantId: string): Promise<{
    style: string;
    preferredTopics: string[];
    patterns: string[];
  }> {
    await this.initializeAssistant(assistantId);
    const memory = this.storage[assistantId];
    
    if (!memory) {
      return {
        style: 'conversational',
        preferredTopics: [],
        patterns: []
      };
    }

    return {
      style: memory.insights.communicationStyle,
      preferredTopics: memory.insights.preferredTopics,
      patterns: memory.insights.responsePatterns
    };
  }

  // 🔄 MÉTODOS DE SINCRONIZACIÓN
  async refresh(assistantId?: string) {
    if (assistantId) {
      delete this.storage[assistantId];
      await this.initializeAssistant(assistantId);
    } else {
      this.storage = {};
      this.initialized = false;
      await this.loadFromSupabase();
    }
  }

  async clearHistory(assistantId: string) {
    // Nota: no borramos de Supabase, solo de memoria local
    // En el futuro podríamos agregar una función para borrar de Supabase también
    delete this.storage[assistantId];
    await this.initializeAssistant(assistantId);
  }

  // 📈 ESTADÍSTICAS
  getStatistics(): {
    totalAssistants: number;
    totalMessages: number;
    averageMessageLength: number;
    mostActiveAssistant: string | null;
  } {
    const assistants = Object.keys(this.storage);
    const totalMessages = assistants.reduce((sum, id) => sum + this.storage[id].messages.length, 0);
    
    let totalLength = 0;
    let mostActiveAssistant: string | null = null;
    let maxMessages = 0;

    assistants.forEach(id => {
      const memory = this.storage[id];
      totalLength += memory.messages.reduce((sum, msg) => sum + msg.content.length, 0);
      
      if (memory.messages.length > maxMessages) {
        maxMessages = memory.messages.length;
        mostActiveAssistant = id;
      }
    });

    return {
      totalAssistants: assistants.length,
      totalMessages,
      averageMessageLength: totalMessages > 0 ? Math.round(totalLength / totalMessages) : 0,
      mostActiveAssistant
    };
  }
}

// 🌟 EXPORTAR INSTANCIA SINGLETON
export const conversationMemoryV2 = new ConversationMemoryV2();

// Mantener export por defecto para compatibilidad
export { conversationMemoryV2 as conversationMemory };
export default conversationMemoryV2;
