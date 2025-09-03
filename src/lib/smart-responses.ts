import { Assistant } from './assistants';
import { conversationMemory } from './conversation-memory';
import { assistantPrompts, getContextualizedPrompt, getPersonalizedGreeting } from './assistant-prompts';

export interface SmartResponse {
  content: string;
  type: 'text' | 'task_completion' | 'file_generated' | 'link_shared' | 'list' | 'calendar_update';
  metadata?: {
    taskId?: string;
    fileName?: string;
    fileUrl?: string;
    linkUrl?: string;
    linkTitle?: string;
    items?: string[];
    calendarEvent?: {
      title: string;
      date: string;
      time: string;
    };
  };
  followUpActions?: Array<{
    label: string;
    action: string;
  }>;
  processingTime?: number; // milliseconds for realistic delay
}

class SmartResponseGenerator {
  // Enhanced responses based on conversation history and context
  generateContextualResponse(
    assistant: Assistant, 
    userMessage: string, 
    conversationHistory: any[]
  ): SmartResponse {
    const memory = conversationMemory.getMemory(assistant.id);
    const relationship = conversationMemory.getRelationshipLevel(assistant.id);
    const isFirstTime = !conversationMemory.hasInteractedBefore(assistant.id);

    // Choose response strategy based on context
    if (isFirstTime) {
      return this.generateWelcomeResponse(assistant, memory);
    }

    if (this.isFollowUpQuestion(userMessage, conversationHistory)) {
      return this.generateFollowUpResponse(assistant, userMessage, memory);
    }

    if (this.isTaskRequest(userMessage)) {
      return this.generateTaskResponse(assistant, userMessage, memory);
    }

    if (this.isStatusCheck(userMessage)) {
      return this.generateStatusResponse(assistant, memory);
    }

    // Default to enhanced contextual response
    return this.generateEnhancedResponse(assistant, userMessage, memory);
  }

  private generateWelcomeResponse(assistant: Assistant, memory: any): SmartResponse {
    const welcomeMessages = {
      sofia: {
        content: `¡Hola ${memory.userProfile.name}! 🎉 Soy Sofía, tu especialista en redes sociales. He estado analizando las tendencias de ${memory.userProfile.industry} y tengo algunas ideas geniales para ${memory.userProfile.company}. \n\n¿Te gustaría que empecemos creando una estrategia de contenido o prefieres que revise tu presencia actual en redes?`,
        type: 'text' as const,
        followUpActions: [
          { label: "Crear estrategia de contenido", action: "create_content_strategy" },
          { label: "Auditar redes actuales", action: "audit_social_media" },
          { label: "Ver tendencias del sector", action: "show_industry_trends" }
        ]
      },
      carlos: {
        content: `¡Hola ${memory.userProfile.name}! 👋 Soy Carlos, tu especialista en atención al cliente. Veo que manejas ${memory.userProfile.company} en ${memory.userProfile.industry}. \n\nEstoy listo para ayudarte a automatizar tus respuestas de WhatsApp y mejorar la experiencia de tus clientes. ¿Cuál es tu mayor desafío en atención al cliente ahora mismo?`,
        type: 'text' as const,
        followUpActions: [
          { label: "Configurar WhatsApp automático", action: "setup_whatsapp" },
          { label: "Crear FAQ inteligente", action: "create_faq" },
          { label: "Ver métricas de soporte", action: "show_support_metrics" }
        ]
      },
      paula: {
        content: `¡Hola ${memory.userProfile.name}! ✍️ Soy Paula, tu copywriter especializada. He visto que trabajas en ${memory.userProfile.industry} con ${memory.userProfile.company}. \n\nPuedo ayudarte a escribir copy que realmente convierte: desde emails de ventas hasta landing pages que generen leads. ¿Qué tipo de contenido necesitas que sea más persuasivo?`,
        type: 'text' as const,
        followUpActions: [
          { label: "Escribir email de ventas", action: "write_sales_email" },
          { label: "Crear copy para landing", action: "create_landing_copy" },
          { label: "Optimizar páginas actuales", action: "optimize_current_pages" }
        ]
      }
    };

    return welcomeMessages[assistant.id as keyof typeof welcomeMessages] || {
      content: `¡Hola ${memory.userProfile.name}! Soy ${assistant.name}, tu ${assistant.role}. ¿En qué puedo ayudarte hoy?`,
      type: 'text'
    };
  }

  private generateTaskResponse(assistant: Assistant, userMessage: string, memory: any): SmartResponse {
    const taskResponses = {
      sofia: [
        {
          trigger: ['contenido', 'posts', 'publicar', 'redes'],
          response: {
            content: `Perfecto! Voy a crear un calendario de contenido para ${memory.userProfile.company}. Dame unos segundos para analizar las mejores tendencias de ${memory.userProfile.industry}...`,
            type: 'task_completion' as const,
            metadata: {
              taskId: 'content_calendar_' + Date.now(),
              fileName: 'Calendario_Contenido_' + new Date().toLocaleDateString() + '.pdf'
            },
            processingTime: 8000,
            followUpActions: [
              { label: "Ver calendario completo", action: "view_calendar" },
              { label: "Programar posts automáticamente", action: "schedule_posts" }
            ]
          }
        },
        {
          trigger: ['hashtags', 'tags', 'tendencias'],
          response: {
            content: `¡Excelente idea! Estoy investigando los hashtags más efectivos para ${memory.userProfile.industry} en tu zona geográfica...`,
            type: 'list' as const,
            metadata: {
              items: [
                "#CaféArtesanalMX - 127K posts, engagement alto",
                "#CoffeeLoversCDMX - 89K posts, crecimiento +23%",
                "#TostadoEspecial - 45K posts, nicho específico",
                "#CaféLocalMX - 67K posts, comunidad activa",
                "#EspressoTime - 234K posts, internacional"
              ]
            },
            processingTime: 5000
          }
        }
      ],
      carlos: [
        {
          trigger: ['whatsapp', 'mensajes', 'clientes', 'responder'],
          response: {
            content: `Configurando tu sistema de respuestas automáticas para WhatsApp Business. Estoy creando respuestas inteligentes basadas en las consultas más frecuentes de ${memory.userProfile.industry}...`,
            type: 'task_completion' as const,
            metadata: {
              taskId: 'whatsapp_setup_' + Date.now(),
              fileName: 'Configuracion_WhatsApp_Business.json'
            },
            processingTime: 6000,
            followUpActions: [
              { label: "Ver respuestas configuradas", action: "view_auto_responses" },
              { label: "Probar funcionamiento", action: "test_whatsapp" }
            ]
          }
        }
      ],
      paula: [
        {
          trigger: ['email', 'copy', 'ventas', 'escribir'],
          response: {
            content: `¡Perfecto! Voy a escribir un email de ventas killer para ${memory.userProfile.company}. Utilizando la estructura AIDA y elementos de persuasión específicos para ${memory.userProfile.industry}...`,
            type: 'file_generated' as const,
            metadata: {
              taskId: 'sales_email_' + Date.now(),
              fileName: 'Email_Ventas_' + memory.userProfile.company.replace(/\s/g, '_') + '.docx',
              fileUrl: '/files/demo_sales_email.docx'
            },
            processingTime: 12000,
            followUpActions: [
              { label: "Descargar email", action: "download_email" },
              { label: "Crear variaciones A/B", action: "create_ab_versions" }
            ]
          }
        }
      ]
    };

    const assistantTasks = taskResponses[assistant.id as keyof typeof taskResponses] || [];
    
    for (const task of assistantTasks) {
      if (task.trigger.some(trigger => userMessage.toLowerCase().includes(trigger))) {
        return task.response;
      }
    }

    // Default task response
    return {
      content: `Entendido! Voy a trabajar en eso para ${memory.userProfile.company}. Dame unos momentos para preparar algo genial...`,
      type: 'task_completion',
      processingTime: 5000
    };
  }

  private generateFollowUpResponse(assistant: Assistant, userMessage: string, memory: any): SmartResponse {
    const lastMessages = memory.messages.slice(-3);
    const lastAssistantMessage = lastMessages.find((m: any) => m.role === 'assistant');
    
    if (lastAssistantMessage?.type === 'task_completion') {
      return {
        content: `¡Perfecto! He completado la tarea anterior. Los resultados están listos. ${this.getTaskCompletionDetails(assistant, lastAssistantMessage.metadata)}`,
        type: 'text',
        followUpActions: [
          { label: "Ver resultados", action: "view_results" },
          { label: "Nueva tarea", action: "new_task" }
        ]
      };
    }

    // Reference previous conversation
    const summary = conversationMemory.getConversationSummary(assistant.id);
    return {
      content: `Claro, continuando con lo que estábamos viendo sobre ${summary}...`,
      type: 'text'
    };
  }

  private generateStatusResponse(assistant: Assistant, memory: any): SmartResponse {
    const completedTasks = memory.context.completedTasks.length;
    const pendingTasks = memory.context.pendingTasks.length;

    return {
      content: `¡Aquí tienes un resumen de mi trabajo para ${memory.userProfile.company}! 📊`,
      type: 'list',
      metadata: {
        items: [
          `✅ ${completedTasks} tareas completadas esta semana`,
          `⏳ ${pendingTasks} tareas en progreso`,
          `📈 Tiempo ahorrado: ${Math.floor(completedTasks * 2.5)} horas`,
          `🎯 Eficiencia: ${Math.min(95, 85 + completedTasks)}%`,
          `💡 Próxima recomendación: ${this.getNextRecommendation(assistant, memory)}`
        ]
      },
      followUpActions: [
        { label: "Ver detalles completos", action: "view_detailed_stats" },
        { label: "Nueva tarea", action: "new_task" }
      ]
    };
  }

  private generateEnhancedResponse(assistant: Assistant, userMessage: string, memory: any): SmartResponse {
    const relationship = conversationMemory.getRelationshipLevel(assistant.id);
    const mood = memory.context.mood;

    let personalTouch = "";
    if (relationship === 'trusted') {
      personalTouch = `Como ya hemos trabajado juntos antes, `;
    } else if (relationship === 'familiar') {
      personalTouch = `Viendo nuestras conversaciones anteriores, `;
    }

    // Enhanced responses based on assistant specialization
    const enhancedResponses = {
      sofia: this.getSofiaEnhancedResponse(userMessage, memory, personalTouch),
      carlos: this.getCarlosEnhancedResponse(userMessage, memory, personalTouch),
      paula: this.getPaulaEnhancedResponse(userMessage, memory, personalTouch)
    };

    return enhancedResponses[assistant.id as keyof typeof enhancedResponses] || {
      content: `${personalTouch}entiendo tu consulta. Déjame ayudarte con eso...`,
      type: 'text'
    };
  }

  private getSofiaEnhancedResponse(userMessage: string, memory: any, personalTouch: string): SmartResponse {
    if (userMessage.toLowerCase().includes('engagement') || userMessage.toLowerCase().includes('interacción')) {
      return {
        content: `${personalTouch}para mejorar el engagement de ${memory.userProfile.company}, te recomiendo la estrategia 70-20-10: 70% contenido educativo, 20% entretenimiento, 10% promocional. ¿Quieres que cree ejemplos específicos para ${memory.userProfile.industry}?`,
        type: 'text',
        followUpActions: [
          { label: "Crear ejemplos de contenido", action: "create_content_examples" },
          { label: "Analizar competencia", action: "analyze_competitors" }
        ]
      };
    }

    return {
      content: `${personalTouch}basándome en las tendencias actuales de ${memory.userProfile.industry}, puedo ayudarte a crear contenido que realmente conecte con tu audiencia. ¿En qué plataforma quieres enfocarte primero?`,
      type: 'text'
    };
  }

  private getCarlosEnhancedResponse(userMessage: string, memory: any, personalTouch: string): SmartResponse {
    if (userMessage.toLowerCase().includes('automatizar') || userMessage.toLowerCase().includes('automático')) {
      return {
        content: `${personalTouch}puedo automatizar hasta el 80% de las consultas típicas de ${memory.userProfile.industry}. Esto te permitirá enfocarte en casos complejos mientras yo manejo las preguntas frecuentes 24/7.`,
        type: 'text',
        processingTime: 3000,
        followUpActions: [
          { label: "Configurar automatización", action: "setup_automation" },
          { label: "Ver estadísticas de consultas", action: "view_query_stats" }
        ]
      };
    }

    return {
      content: `${personalTouch}para ${memory.userProfile.company}, es crucial tener una atención al cliente que refleje la calidad de tus productos. ¿Cuál es tu mayor desafío en atención al cliente actualmente?`,
      type: 'text'
    };
  }

  private getPaulaEnhancedResponse(userMessage: string, memory: any, personalTouch: string): SmartResponse {
    if (userMessage.toLowerCase().includes('conversión') || userMessage.toLowerCase().includes('ventas')) {
      return {
        content: `${personalTouch}para aumentar las conversiones de ${memory.userProfile.company}, necesitamos copy que hable directamente a los dolores de tu cliente ideal en ${memory.userProfile.industry}. ¿Conoces cuál es la principal objeción de tus clientes?`,
        type: 'text',
        followUpActions: [
          { label: "Analizar objeciones", action: "analyze_objections" },
          { label: "Crear copy persuasivo", action: "create_persuasive_copy" }
        ]
      };
    }

    return {
      content: `${personalTouch}el copy efectivo para ${memory.userProfile.industry} debe combinar beneficios emocionales con prueba social. ¿Qué tipo de contenido necesitas que convierta mejor?`,
      type: 'text'
    };
  }

  // Helper methods
  private isFollowUpQuestion(message: string, history: any[]): boolean {
    const followUpIndicators = ['y después', 'qué sigue', 'continuando', 'también', 'además'];
    return followUpIndicators.some(indicator => message.toLowerCase().includes(indicator));
  }

  private isTaskRequest(message: string): boolean {
    const taskIndicators = ['crea', 'haz', 'genera', 'escribe', 'analiza', 'configura', 'ayúdame a'];
    return taskIndicators.some(indicator => message.toLowerCase().includes(indicator));
  }

  private isStatusCheck(message: string): boolean {
    const statusIndicators = ['estado', 'progreso', 'avance', 'resumen', 'qué has hecho'];
    return statusIndicators.some(indicator => message.toLowerCase().includes(indicator));
  }

  private getTaskCompletionDetails(assistant: Assistant, metadata: any): string {
    if (metadata?.fileName) {
      return `He generado el archivo "${metadata.fileName}" con toda la información que necesitas.`;
    }
    return "Todo está listo y funcionando perfectamente.";
  }

  private getNextRecommendation(assistant: Assistant, memory: any): string {
    const recommendations = {
      sofia: "Crear contenido para Stories de Instagram",
      carlos: "Implementar chatbot para horarios nocturnos", 
      paula: "Optimizar email de bienvenida"
    };
    
    return recommendations[assistant.id as keyof typeof recommendations] || "Revisar métricas de rendimiento";
  }
}

export const smartResponseGenerator = new SmartResponseGenerator();
