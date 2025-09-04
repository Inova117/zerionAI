// 🤖 AI SERVICE V2 - SOLO IA REAL, SIN MOCK DATA
// Completamente conectado a Supabase y Hugging Face

import { Assistant } from './assistants';
import { conversationMemoryV2 } from './conversation-memory-v2';
import { smartResponseGenerator, SmartResponse } from './smart-responses';
import { dashboardMetricsV2 } from './dashboard-metrics-v2';
import { huggingFaceService, AIResponse } from './huggingface-service';
import { cerebroAIV2 } from './cerebro-ai-v2';
import { imageGenerationService } from './image-generation-service';

// 🎯 FUNCIÓN PRINCIPAL DE GENERACIÓN DE RESPUESTAS IA
export async function generateAIResponse(
  assistant: Assistant,
  userMessage: string,
  conversationHistory: any[] = []
): Promise<SmartResponse> {
  
  // Agregar mensaje del usuario a memoria persistente
  await conversationMemoryV2.addMessage(assistant.id, 'user', userMessage);

  // 🧠 CEREBRO AI V2: Analizar comportamiento del usuario con persistencia real
  const cerebroInsights = await cerebroAIV2.analyzeUserBehavior(assistant.id, {
    message: userMessage,
    timestamp: new Date(),
    context: conversationHistory
  });

  // 🧠 CEREBRO AI V2: Actualizar relación con asistente (persistencia real)
  await cerebroAIV2.updateAssistantRelationship(assistant.id, {
    interaction_count: ((await cerebroAIV2.getAssistantRelationship(assistant.id))?.interaction_count || 0) + 1,
    last_interaction: new Date().toISOString()
  });

  try {
    // 🎯 SIEMPRE INTENTAR HUGGING FACE PRIMERO (IA REAL)
    console.log(`🤖 Generating AI response for ${assistant.name}...`);
    
    const aiResponse = await huggingFaceService.generateResponse(
      assistant,
      userMessage,
      conversationHistory
    );

    if (aiResponse.success && aiResponse.content.trim()) {
      // ✅ RESPUESTA EXITOSA DE IA REAL
      const smartResponse: SmartResponse = {
        content: aiResponse.content,
        type: 'text',
        processingTime: aiResponse.processing_time,
        metadata: {
          ai_generated: true,
          model: aiResponse.model,
          confidence: 0.9, // Alta confianza en IA real
          cerebro_insights: cerebroInsights.length,
          cerebro_active: true
        }
      };

      // Guardar respuesta del asistente en memoria persistente
      await conversationMemoryV2.addMessage(
        assistant.id, 
        'assistant', 
        smartResponse.content, 
        smartResponse.type,
        smartResponse.metadata
      );

      // 🧠 CEREBRO AI V2: Registrar interacción exitosa
      await cerebroAIV2.updateAssistantRelationship(assistant.id, {
        successful_tasks: ((await cerebroAIV2.getAssistantRelationship(assistant.id))?.successful_tasks || 0) + 1
      });

      // 📊 Actualizar métricas reales
      await dashboardMetricsV2.onTaskCompleted(
        assistant.id,
        assistant.name,
        'ai_response',
        {
          timeSaved: aiResponse.processing_time > 5000 ? 0.1 : 0.05, // Estimación basada en tiempo
          impact: 'medium'
        }
      );

      console.log(`✅ AI Response from ${aiResponse.model} in ${aiResponse.processing_time}ms`);
      console.log(`🧠 Cerebro AI generated ${cerebroInsights.length} insights`);
      
      return smartResponse;
    } else {
      console.warn('AI service returned empty or failed response:', aiResponse.error);
    }
  } catch (error) {
    console.error('Error calling Hugging Face service:', error);
  }

  // 🔄 FALLBACK: GENERADOR INTELIGENTE (NO RESPUESTAS HARDCODEADAS)
  console.log('🔄 Using intelligent fallback generator...');
  
  try {
    // Usar generador inteligente basado en contexto real
    const smartResponse = await generateIntelligentFallback(assistant, userMessage, conversationHistory);
    
    // Guardar respuesta en memoria persistente
    await conversationMemoryV2.addMessage(
      assistant.id,
      'assistant',
      smartResponse.content,
      smartResponse.type,
      smartResponse.metadata
    );

    // 📊 Actualizar métricas
    await dashboardMetricsV2.onTaskCompleted(
      assistant.id,
      assistant.name,
      'fallback_response',
      {
        timeSaved: 0.02,
        impact: 'low'
      }
    );

    return smartResponse;
  } catch (error) {
    console.error('Fallback generator failed:', error);
    
    // 🚨 ÚLTIMO RECURSO: RESPUESTA DE EMERGENCIA
    return generateEmergencyResponse(assistant, userMessage);
  }
}

// 🧠 GENERADOR INTELIGENTE BASADO EN CONTEXTO REAL
async function generateIntelligentFallback(
  assistant: Assistant,
  userMessage: string,
  conversationHistory: any[]
): Promise<SmartResponse> {
  
  // Obtener contexto real del Cerebro AI
  const context = await cerebroAIV2.getContextForAssistant(assistant.id);
  const userProfile = context.userProfile;
  const relationship = context.relationship;
  const insights = context.recentInsights;

  // Obtener preferencias de conversación reales
  const communicationInsights = await conversationMemoryV2.getCommunicationInsights(assistant.id);
  const userPreferences = await conversationMemoryV2.getUserPreferences(assistant.id);
  const businessContext = await conversationMemoryV2.getBusinessContext(assistant.id);

  // Construir prompt contextual inteligente
  const contextualPrompt = buildContextualPrompt(
    assistant,
    userMessage,
    {
      userProfile,
      relationship,
      insights,
      communicationInsights,
      userPreferences,
      businessContext,
      conversationHistory
    }
  );

  // Intentar con el generador inteligente local
  const response = smartResponseGenerator.generateContextualResponse(
    assistant,
    contextualPrompt,
    conversationHistory
  );

  // Enriquecer con metadata real
  response.metadata = {
    ...response.metadata,
    ai_generated: false,
    confidence: 0.7,
    cerebro_insights: insights.length,
    cerebro_active: true
  };

  return response;
}

// 🏗️ CONSTRUCTOR DE PROMPT CONTEXTUAL
function buildContextualPrompt(
  assistant: Assistant,
  userMessage: string,
  context: {
    userProfile: any;
    relationship: any;
    insights: any[];
    communicationInsights: any;
    userPreferences: string[];
    businessContext: string[];
    conversationHistory: any[];
  }
): string {
  let prompt = `Como ${assistant.name} (${assistant.role}), responde de manera personalizada considerando:

USUARIO:
- Industria: ${context.userProfile?.industry || 'No especificada'}
- Rol: ${context.userProfile?.role || 'No especificado'}
- Estilo: ${context.userProfile?.working_style || 'No especificado'}
- Comunicación: ${context.userProfile?.communication_prefs || 'No especificada'}

RELACIÓN:
- Confianza: ${context.relationship?.trust_level || 0}%
- Interacciones: ${context.relationship?.interaction_count || 0}
- Satisfacción: ${context.relationship?.user_satisfaction || 3}/5

PREFERENCIAS DETECTADAS:
${context.userPreferences.length > 0 ? context.userPreferences.join(', ') : 'Ninguna detectada'}

CONTEXTO DE NEGOCIO:
${context.businessContext.length > 0 ? context.businessContext.slice(0, 2).join('. ') : 'No disponible'}

INSIGHTS RECIENTES:
${context.insights.slice(0, 3).map(i => `- ${i.content}`).join('\n') || 'Ninguno'}

ESTILO DE COMUNICACIÓN DETECTADO:
${context.communicationInsights.style || 'Conversacional'}

MENSAJE ACTUAL: "${userMessage}"

Responde de manera natural, personalizada y útil basándote en toda esta información.`;

  return prompt;
}

// 🚨 RESPUESTA DE EMERGENCIA (ÚLTIMO RECURSO)
function generateEmergencyResponse(assistant: Assistant, userMessage: string): SmartResponse {
  const emergencyResponses = {
    'sofia': `¡Hola! Soy ${assistant.name} 📱. Estoy experimentando un problema técnico temporal, pero estoy aquí para ayudarte con tu estrategia de redes sociales. ¿Podrías repetir tu consulta?`,
    'carlos': `¡Hola! Soy ${assistant.name} 🎧. Hay un pequeño problema técnico, pero sigo disponible para optimizar tu atención al cliente. ¿Cómo puedo asistirte?`,
    'paula': `¡Hola! Soy ${assistant.name} 📝. Tengo un inconveniente técnico menor, pero puedo ayudarte con tu copywriting. ¿Qué necesitas escribir?`,
    'diana': `¡Hola! Soy ${assistant.name} 📊. Experimentando problemas técnicos temporales, pero lista para analizar tus datos. ¿Qué métricas necesitas revisar?`,
    'alex': `¡Hola! Soy ${assistant.name} ⚡. Problema técnico temporal, pero disponible para optimizar tu productividad. ¿Qué proceso quieres mejorar?`
  };

  return {
    content: emergencyResponses[assistant.id as keyof typeof emergencyResponses] || 
             `¡Hola! Soy ${assistant.name}. Estoy experimentando un problema técnico temporal, pero estoy aquí para ayudarte. ¿Podrías repetir tu consulta?`,
    type: 'text',
    processingTime: 100,
    metadata: {
      ai_generated: false,
      confidence: 0.3,
      cerebro_active: false
    }
  };
}

// 🎨 FUNCIÓN ESPECIALIZADA PARA SOFÍA (SOCIAL MEDIA + IMÁGENES)
export async function generateSocialMediaContent(
  userMessage: string,
  conversationHistory: any[] = [],
  options: {
    platform?: 'instagram' | 'facebook' | 'linkedin' | 'twitter' | 'tiktok';
    includeImage?: boolean;
    style?: 'professional' | 'casual' | 'creative' | 'minimalist' | 'vibrant';
    brand?: { colors?: string[]; fonts?: string[]; logoUrl?: string; };
  } = {}
): Promise<SmartResponse & { imageData?: string; imageUrl?: string }> {
  
  // Buscar asistente Sofía
  const sofia = { 
    id: 'sofia', 
    name: 'Sofía',
    role: 'Social Media Manager',
    color: 'bg-pink-500',
    description: 'Especialista en redes sociales',
    avatar: '📱',
    specialties: ['Social Media', 'Content Creation', 'Instagram', 'TikTok'],
    examples: []
  } as Assistant;

  // Generar respuesta de IA normal
  const aiResponse = await generateAIResponse(sofia, userMessage, conversationHistory);

  // Si se solicita imagen, generarla
  if (options.includeImage) {
    try {
      console.log('🎨 Generando imagen para contenido de redes sociales...');
      
      const imageResponse = await imageGenerationService.generateSocialMediaPost({
        text: userMessage,
        platform: options.platform || 'instagram',
        style: options.style || 'professional',
        brand: options.brand
      });

      if (imageResponse.success) {
        console.log('✅ Imagen generada exitosamente');
        
        // Registrar generación de imagen como actividad
        await dashboardMetricsV2.onFileGenerated(
          'sofia',
          'Sofía',
          `imagen_${options.platform || 'instagram'}_${Date.now()}.jpg`,
          {
            fileType: 'image',
            timeSaved: 0.5, // Tiempo estimado ahorrado
            impact: 'medium'
          }
        );

        return {
          ...aiResponse,
          imageData: imageResponse.imageData,
          imageUrl: imageResponse.imageUrl,
          metadata: {
            ...aiResponse.metadata,
            image_generated: true,
            image_style: imageResponse.style_applied,
            image_prompt: imageResponse.prompt_used,
            generation_time: imageResponse.generation_time
          }
        };
      } else {
        console.warn('⚠️ Fallo en generación de imagen:', imageResponse.error);
        
        // Agregar mensaje sobre la imagen fallida
        return {
          ...aiResponse,
          content: aiResponse.content + '\n\n💡 *Nota: No pude generar la imagen solicitada, pero aquí tienes el contenido de texto optimizado.*',
          metadata: {
            ...aiResponse.metadata,
            image_generation_failed: true,
            image_error: imageResponse.error
          }
        };
      }
    } catch (error) {
      console.error('🎨 Error en generación de imagen:', error);
      
      return {
        ...aiResponse,
        content: aiResponse.content + '\n\n💡 *Nota: Hubo un problema técnico con la generación de imagen, pero el contenido está listo.*',
        metadata: {
          ...aiResponse.metadata,
          image_generation_error: (error as Error).message
        }
      };
    }
  }

  return aiResponse;
}

// Export for backward compatibility
export { generateAIResponse as simulateAIResponse };

// Helper functions para métricas de tiempo ahorrado
function getTimeSavedForTask(taskType: string): number {
  const timeSavings: { [key: string]: number } = {
    'content': 3.5,           // Content calendar creation
    'whatsapp': 4.0,          // WhatsApp setup
    'sales': 2.5,             // Sales email writing
    'analytics': 1.5,         // Data analysis
    'automation': 8.0,        // Workflow automation
    'social_media': 2.0,      // Social media posts
    'copywriting': 1.8,       // Copy creation
    'customer_support': 3.2,  // Support optimization
    'ai_response': 0.1        // AI response generation
  };
  
  return timeSavings[taskType] || 1.0;
}

function getTimeSavedForFile(fileName: string): number {
  const extension = fileName.split('.').pop()?.toLowerCase();
  const timeSavings: { [key: string]: number } = {
    'pdf': 2.0,
    'docx': 1.5,
    'xlsx': 3.0,
    'pptx': 4.0,
    'jpg': 0.5,
    'png': 0.5,
    'mp4': 5.0,
    'csv': 1.0
  };
  
  return timeSavings[extension || 'pdf'] || 1.0;
}

// Backward compatibility - returns just the content string
export async function simulateAIResponseLegacy(
  assistant: Assistant,
  userMessage: string,
  conversationHistory: any[] = []
): Promise<string> {
  const smartResponse = await generateAIResponse(assistant, userMessage, conversationHistory);
  return smartResponse.content;
}

// Function to generate a conversation title based on the first message
export function generateConversationTitle(userMessage: string, assistant: Assistant): string {
  const words = userMessage.toLowerCase().split(' ');
  
  if (words.some(word => ['social', 'redes', 'instagram', 'facebook'].includes(word))) {
    return 'Estrategia de Redes Sociales';
  } else if (words.some(word => ['cliente', 'soporte', 'ayuda', 'whatsapp'].includes(word))) {
    return 'Optimización de Atención al Cliente';
  } else if (words.some(word => ['ventas', 'vender', 'clientes', 'deals'].includes(word))) {
    return 'Estrategia de Ventas';
  } else if (words.some(word => ['seo', 'google', 'posicionamiento', 'ranking'].includes(word))) {
    return 'Optimización SEO';
  } else if (words.some(word => ['email', 'marketing', 'campaña', 'newsletter'].includes(word))) {
    return 'Campaña de Email Marketing';
  } else if (words.some(word => ['datos', 'análisis', 'métricas', 'reportes'].includes(word))) {
    return 'Análisis de Datos';
  } else if (words.some(word => ['copy', 'contenido', 'escribir', 'texto'].includes(word))) {
    return 'Creación de Contenido';
  } else if (words.some(word => ['contratar', 'reclutamiento', 'empleado', 'equipo'].includes(word))) {
    return 'Proceso de Reclutamiento';
  } else if (words.some(word => ['calendario', 'reunión', 'organizar', 'agenda'].includes(word))) {
    return 'Gestión de Agenda';
  } else if (words.some(word => ['tienda', 'ecommerce', 'productos', 'inventario'].includes(word))) {
    return 'Optimización de eCommerce';
  } else if (words.some(word => ['negocio', 'empresa', 'crecimiento', 'estrategia'].includes(word))) {
    return 'Estrategia de Crecimiento';
  } else if (words.some(word => ['productividad', 'tiempo', 'organización', 'eficiencia'].includes(word))) {
    return 'Optimización de Productividad';
  }
  
  return `Conversación con ${assistant.name}`;
}
