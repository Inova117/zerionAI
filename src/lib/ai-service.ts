import { Assistant } from './assistants';
import { conversationMemory } from './conversation-memory';
import { smartResponseGenerator, SmartResponse } from './smart-responses';
import { dashboardMetrics } from './dashboard-metrics';
import { huggingFaceService, AIResponse } from './huggingface-service';
import { cerebroAI } from './cerebro-ai';

// Simulated responses for each assistant
const assistantResponses: Record<string, string[]> = {
  sofia: [
    "¡Hola! Soy Sofía, tu especialista en redes sociales 📱. Te ayudo a crear contenido que conecte con tu audiencia y automatizar tus publicaciones. ¿En qué plataforma quieres enfocarte hoy?",
    "Perfecto, puedo ayudarte con eso. Para crear contenido viral en Instagram, necesito conocer un poco más sobre tu marca. ¿Podrías contarme sobre tu negocio?",
    "Excelente estrategia. Te voy a crear un calendario de contenido para las próximas 2 semanas. Incluiré posts educativos, entretenimiento y promocionales en una proporción 70-20-10.",
    "He analizado las tendencias actuales y creo que deberíamos apostar por reels de transformación y behind-the-scenes. ¿Te parece que empecemos por ahí?"
  ],
  carlos: [
    "¡Hola! Soy Carlos, tu especialista en atención al cliente 🎧. Estoy aquí 24/7 para ayudarte a brindar el mejor servicio a tus clientes por WhatsApp, email y redes sociales. ¿Cómo puedo asistirte?",
    "Entiendo tu preocupación. Para manejar mejor las consultas frecuentes, voy a crear una base de conocimiento automática. ¿Cuáles son las 5 preguntas que más te hacen tus clientes?",
    "Genial, ya tengo configuradas las respuestas automáticas para esas consultas. Ahora puedo responder al 80% de las preguntas comunes en menos de 30 segundos.",
    "He notado un pico en consultas sobre devoluciones. ¿Quieres que actualice el protocolo automático para estos casos?"
  ],
  diana: [
    "¡Hola! Soy Diana, tu analista de datos 📊. Transformo números complicados en insights accionables para tu negocio. ¿Qué métricas necesitas analizar hoy?",
    "Excelente pregunta. Basándome en tus datos de ventas de los últimos 3 meses, veo que los martes son tu día más productivo. Te recomiendo concentrar tus campañas de marketing los lunes para maximizar las conversiones.",
    "He identificado 3 oportunidades clave: 1) Tu producto X tiene un 40% más de demanda en la tarde, 2) Los clientes de 25-35 años compran 2.3x más que otros segmentos, 3) Los carritos abandonados se pueden recuperar con un 15% de descuento.",
    "Tu ROI de marketing ha aumentado 23% este mes. Los canales más rentables son: Instagram Ads (340% ROI), Google Ads (280% ROI), y Email Marketing (520% ROI)."
  ],
  bruno: [
    "¡Hola! Soy Bruno, tu estratega de desarrollo empresarial 🚀. Mi misión es ayudarte a escalar tu negocio de manera inteligente y sostenible. ¿En qué área de crecimiento quieres enfocarte?",
    "Interesante desafío. Para expandirte a nuevos mercados, primero necesitamos validar la demanda. Te propongo una estrategia de 3 fases: investigación, piloto de 30 días, y escalamiento gradual.",
    "He analizado 5 oportunidades de crecimiento para tu negocio: 1) Alianzas estratégicas con complementos, 2) Marketplace B2B, 3) Suscripciones recurrentes, 4) Servicios premium, 5) Franquicias. ¿Cuál te interesa más?",
    "Basándome en tu situación actual, recomiendo enfocarte en retención de clientes antes de adquisición. Un aumento del 5% en retención puede incrementar las ganancias hasta 95%."
  ],
  elena: [
    "¡Hola! Soy Elena, tu especialista en email marketing 📧. Creo campañas que convierten y automatizan tu comunicación con clientes. ¿Qué tipo de email quieres optimizar hoy?",
    "Perfecto, las secuencias de bienvenida son cruciales. Te voy a crear una serie de 5 emails que se enviarán automáticamente: Día 1 (Bienvenida), Día 3 (Valor), Día 7 (Historia), Día 10 (Social proof), Día 14 (Oferta especial).",
    "He configurado la automatización de carrito abandonado. Los emails se enviarán a las 2 horas, 24 horas y 3 días después del abandono, con descuentos progresivos del 5%, 10% y 15%.",
    "Tus métricas de email están mejorando: Tasa de apertura subió a 28% (+12%), Click rate 4.2% (+18%), y conversiones 2.1% (+25%). ¿Quieres que A/B testee nuevos subject lines?"
  ],
  gabriel: [
    "¡Hola! Soy Gabriel, tu coach de crecimiento personal 🧘‍♂️. Te ayudo a optimizar tu productividad y equilibrar tu vida empresarial. ¿En qué aspecto de tu desarrollo personal quieres trabajar?",
    "Entiendo perfectamente esa sensación. La falta de tiempo es el enemigo #1 del emprendedor. Te voy a diseñar un sistema de gestión de tiempo basado en el método Getting Things Done adaptado para tu negocio.",
    "He creado tu rutina matutina personalizada: 6:00 AM - Meditación 10 min, 6:15 AM - Ejercicio 20 min, 6:40 AM - Desayuno saludable, 7:00 AM - Planificación del día, 7:15 AM - Tarea más importante. ¿Te parece factible?",
    "Excelente progreso esta semana. Has completado el 85% de tus objetivos diarios. Para la próxima semana, te sugiero agregar bloques de tiempo libre para evitar el burnout."
  ],
  paula: [
    "¡Hola! Soy Paula, tu copywriter especializada ✍️. Escribo textos que persuaden y convierten visitantes en clientes. ¿Qué tipo de copy necesitas que te ayude a crear?",
    "Perfecto, las landing pages son mi especialidad. Para crear copy que convierta, necesito entender: ¿Cuál es el principal dolor de tu cliente ideal? ¿Qué transformación prometes? ¿Qué objeciones suelen tener?",
    "Excelente información. Te voy a crear un headline usando la fórmula PAS: 'Automatiza tu negocio sin contratar empleados adicionales' (Problema), 'Miles de emprendedores ya lo logran' (Agitación), 'Con nuestros asistentes de IA disponibles 24/7' (Solución).",
    "He terminado tu sales letter. Incluye: Hook emocional, historia de transformación, 5 beneficios clave, prueba social, oferta irresistible, garantía de riesgo reverso, y 3 llamadas a la acción. ¿Quieres que la revise?"
  ],
  samuel: [
    "¡Hola! Soy Samuel, tu especialista en reclutamiento 🔍. Te ayudo a encontrar el talento perfecto para tu equipo y optimizar tus procesos de selección. ¿En qué posición necesitas ayuda?",
    "Excelente, un desarrollador senior es una contratación crítica. Te voy a crear una descripción de trabajo que atraiga a los mejores candidatos, incluyendo: stack técnico específico, proyectos emocionantes, crecimiento profesional y cultura de empresa.",
    "He filtrado 127 CVs y preseleccionado 8 candidatos que cumplen todos los requisitos. Todos tienen: +5 años experiencia, conocimiento en React/Node.js, experiencia en startups, y disponibilidad inmediata. ¿Programamos las entrevistas?",
    "Las entrevistas de esta semana fueron productivas. Candidato #3 (María) destaca por: excelente conocimiento técnico, experiencia en proyectos similares, soft skills sólidas, y motivación genuina por el puesto. Te recomiendo una segunda entrevista."
  ],
  sergio: [
    "¡Hola! Soy Sergio, tu especialista en SEO 🔍. Te ayudo a posicionar tu sitio web en Google y atraer tráfico orgánico de calidad. ¿En qué aspecto de SEO quieres que te ayude?",
    "Perfecto, las palabras clave son la base de todo. He investigado tu nicho y encontré 47 keywords con potencial: 15 de baja competencia para empezar, 20 de competencia media para el crecimiento, y 12 de alta competencia para el futuro.",
    "Excelente progreso. Tu sitio ha subido posiciones: 'marketing digital México' (posición 23→12), 'consultor SEO' (posición 45→28), 'agencia digital CDMX' (posición 67→35). El tráfico orgánico aumentó 34% este mes.",
    "He detectado 12 oportunidades de mejora técnica: optimizar imágenes (reducir 40% peso), mejorar Core Web Vitals, añadir schema markup, y crear más contenido para long-tail keywords. ¿Empezamos por lo más impactante?"
  ],
  marina: [
    "¡Hola! Soy Marina, tu asistente virtual personal 🗓️. Me encargo de organizar tu día, gestionar tu calendario y administrar todas esas tareas que te quitan tiempo. ¿Cómo puedo ayudarte hoy?",
    "Por supuesto, organizar reuniones es mi especialidad. He revisado las agendas de todos los participantes y las mejores opciones son: Martes 2 PM, Miércoles 10 AM, o Jueves 4 PM. Ya preparé la invitación con agenda, enlaces de videoconferencia y documentos relevantes.",
    "Tu calendario de esta semana está optimizado: bloqueé 2 horas diarias para trabajo profundo, agrupé reuniones similares, y dejé buffer time entre citas. También programé recordatorios para las 3 tareas críticas del proyecto.",
    "He completado tu lista de tareas administrativas: facturas organizadas, emails prioritarios respondidos, seguimientos programados, y documentos archivados. Tu bandeja de entrada está en cero y tienes 4 horas libres para actividades estratégicas."
  ],
  miguel: [
    "¡Hola! Soy Miguel, tu gerente de ventas 💼. Te ayudo a cerrar más deals, optimizar tu proceso de ventas y entrenar a tu equipo comercial. ¿En qué aspecto de ventas necesitas apoyo?",
    "Excelente, los cold calls pueden ser muy efectivos con la estrategia correcta. Te he creado un script personalizado usando la metodología SPIN: Situación, Problema, Implicación, Necesidad-Beneficio. ¿Quieres que practiquemos?",
    "Increíble trabajo en las llamadas de esta semana. Métricas: 34 llamadas realizadas, 18 contactos efectivos (53%), 8 reuniones agendadas (44%), 3 propuestas enviadas. Tu tasa de conversión mejoró 23% vs semana anterior.",
    "He analizado tu pipeline: $67K en oportunidades activas, 12 prospectos en etapa de consideración, 5 en negociación. Recomiendo hacer seguimiento urgente a MegaCorp ($15K) y StartupXYZ ($8K) que están cerca de decidir."
  ],
  carmen: [
    "¡Hola! Soy Carmen, tu gerente de eCommerce 🛒. Optimizo tu tienda online, gestiono inventario y automatizo todo el customer journey. ¿En qué área de tu eCommerce quieres que te ayude?",
    "Perfecto, las conversiones son clave para el éxito del eCommerce. He analizado tu funnel y encontré 3 puntos de fuga: página de producto (47% abandono), carrito (68% abandono), y checkout (23% abandono). Empezemos por el carrito.",
    "Excelente mejora en conversiones. Después de optimizar el carrito: abandono bajó de 68% a 41%, ventas aumentaron 31%, y ticket promedio subió $127. Ahora trabajemos en recuperar carritos abandonados con email automation.",
    "Tu tienda está funcionando increíble: 245 pedidos esta semana (+28%), inventario optimizado con alertas automáticas, y 87% satisfacción del cliente. He programado la campaña de Black Friday con descuentos escalonados y stock reservado."
  ]
};

// AI response function using Hugging Face (with fallback to simulation)
export async function simulateAIResponse(
  assistant: Assistant,
  userMessage: string,
  conversationHistory: any[] = []
): Promise<SmartResponse> {
  // Add user message to memory
  conversationMemory.addMessage(assistant.id, 'user', userMessage);

  // 🧠 CEREBRO AI: Analizar comportamiento del usuario
  const cerebroInsights = await cerebroAI.analyzeUserBehavior(assistant.id, {
    message: userMessage,
    timestamp: new Date(),
    context: conversationHistory
  });

  // 🧠 CEREBRO AI: Actualizar relación con asistente
  cerebroAI.updateAssistantRelationship(assistant.id, {
    lastInteraction: new Date(),
    interactionCount: (cerebroAI.getMemory().assistantRelationships[assistant.id]?.interactionCount || 0) + 1
  });

  try {
    // Try Hugging Face first
    const aiResponse = await huggingFaceService.generateResponse(
      assistant,
      userMessage,
      conversationHistory
    );

    if (aiResponse.success) {
      // Create SmartResponse from AI response
      const smartResponse: SmartResponse = {
        content: aiResponse.content,
        type: 'text',
        processingTime: aiResponse.processing_time,
        metadata: {
          // model: aiResponse.model, // Commented for type compatibility
          ai_generated: true,
          confidence: 0.8,
          cerebro_insights: cerebroInsights.length,
          cerebro_active: true
        }
      };

      // Add assistant response to memory
      conversationMemory.addMessage(
        assistant.id, 
        'assistant', 
        smartResponse.content, 
        smartResponse.type,
        smartResponse.metadata
      );

      // 🧠 CEREBRO AI: Registrar interacción exitosa
      cerebroAI.updateAssistantRelationship(assistant.id, {
        successfulTasks: (cerebroAI.getMemory().assistantRelationships[assistant.id]?.successfulTasks || 0) + 1
      });

      console.log(`✅ AI Response from ${aiResponse.model} in ${aiResponse.processing_time}ms`);
      console.log(`🧠 Cerebro AI generated ${cerebroInsights.length} insights`);
      return smartResponse;
    } else {
      console.warn('AI service failed, falling back to simulation:', aiResponse.error);
    }
  } catch (error) {
    console.error('Error calling Hugging Face service:', error);
  }

  // Fallback to simulation if AI fails
  console.log('🔄 Using simulation fallback');
  const smartResponse = smartResponseGenerator.generateContextualResponse(
    assistant,
    userMessage,
    conversationHistory
  );

  // Simulate realistic processing time
  const processingTime = smartResponse.processingTime || (1500 + Math.random() * 2000);
  await new Promise(resolve => setTimeout(resolve, processingTime));

  // Add assistant response to memory
  conversationMemory.addMessage(
    assistant.id, 
    'assistant', 
    smartResponse.content, 
    smartResponse.type,
    smartResponse.metadata
  );

  // Update dashboard metrics based on response type
  if (smartResponse.type === 'task_completion') {
    const taskType = smartResponse.metadata?.taskId?.split('_')[0] || 'general_task';
    dashboardMetrics.onTaskCompleted(
      assistant.id,
      assistant.name,
      taskType,
      {
        timeSaved: getTimeSavedForTask(taskType),
        impact: getTaskImpact(taskType),
        fileName: smartResponse.metadata?.fileName
      }
    );
  }

  if (smartResponse.type === 'file_generated' && smartResponse.metadata?.fileName) {
    dashboardMetrics.onFileGenerated(
      assistant.id,
      assistant.name,
      smartResponse.metadata.fileName,
      {
        timeSaved: getTimeSavedForFile(smartResponse.metadata.fileName),
        impact: 'medium'
      }
    );
  }

  return smartResponse;
}

// Helper functions for metrics
function getTimeSavedForTask(taskType: string): number {
  const timeSavings: { [key: string]: number } = {
    'content': 3.5,           // Content calendar creation
    'whatsapp': 4.0,          // WhatsApp setup
    'sales': 2.5,             // Sales email writing
    'hashtag': 1.5,           // Hashtag research
    'automation': 5.0,        // General automation
    'analysis': 2.0,          // Analysis tasks
    'copywriting': 2.5,       // Copywriting tasks
    'social': 3.0,            // Social media tasks
    'customer': 3.5,          // Customer support tasks
    'general': 1.5            // Default
  };
  
  return timeSavings[taskType] || 1.5;
}

function getTaskImpact(taskType: string): 'low' | 'medium' | 'high' {
  const impacts: { [key: string]: 'low' | 'medium' | 'high' } = {
    'content': 'high',
    'whatsapp': 'high',
    'sales': 'high',
    'automation': 'high',
    'hashtag': 'medium',
    'analysis': 'medium',
    'copywriting': 'high',
    'social': 'medium',
    'customer': 'high',
    'general': 'medium'
  };
  
  return impacts[taskType] || 'medium';
}

function getTimeSavedForFile(fileName: string): number {
  if (fileName.includes('Calendario') || fileName.includes('Strategy')) return 3.0;
  if (fileName.includes('Email') || fileName.includes('Copy')) return 2.0;
  if (fileName.includes('Config') || fileName.includes('Setup')) return 4.0;
  return 1.5;
}

// Backward compatibility - returns just the content string
export async function simulateAIResponseLegacy(
  assistant: Assistant,
  userMessage: string,
  conversationHistory: any[] = []
): Promise<string> {
  const smartResponse = await simulateAIResponse(assistant, userMessage, conversationHistory);
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

// Function to check if user has reached task limits
export function checkTaskLimits(plan: string, tasksThisMonth: number): {
  canContinue: boolean;
  remaining: number;
  limit: number;
} {
  const limits = {
    emprendedor: 1000,
    profesional: 5000,
    empresarial: -1 // unlimited
  };

  const limit = limits[plan as keyof typeof limits] || 0;
  
  if (limit === -1) {
    return { canContinue: true, remaining: -1, limit: -1 };
  }

  const remaining = Math.max(0, limit - tasksThisMonth);
  const canContinue = remaining > 0;

  return { canContinue, remaining, limit };
}

// Test Hugging Face connection
export async function testAIConnection(): Promise<{
  huggingface: { success: boolean; message: string };
  models: Record<string, boolean>;
}> {
  try {
    const hfTest = await huggingFaceService.testConnection();
    const modelsStatus = await huggingFaceService.getModelsStatus();
    
    return {
      huggingface: hfTest,
      models: modelsStatus
    };
  } catch (error) {
    return {
      huggingface: {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      models: {}
    };
  }
}

// Get AI service status
export function getAIServiceStatus(): {
  mode: 'ai' | 'simulation' | 'hybrid';
  provider: string;
  fallbackEnabled: boolean;
} {
  const hasHFKey = !!process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY;
  
  return {
    mode: hasHFKey ? 'hybrid' : 'simulation',
    provider: hasHFKey ? 'Hugging Face' : 'Simulation',
    fallbackEnabled: true
  };
}
