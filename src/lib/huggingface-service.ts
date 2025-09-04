// Hugging Face AI Service for Sintra AI LATAM
// Using the models defined in our PRD: DeepSeek V3, Llama 3.1 70B, Qwen 2.5 72B

import { Assistant } from './assistants';
import { assistantPrompts, getContextualizedPrompt } from './assistant-prompts';

// Hugging Face API configuration
const HF_API_URL = 'https://api-inference.huggingface.co/models';
const HF_API_TOKEN = process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY || process.env.HUGGINGFACE_API_KEY;

// Available models for our beta phase
const MODELS = {
  primary: 'microsoft/DialoGPT-large',       // Good for conversational AI
  fallback1: 'facebook/blenderbot-400M-distill', // Lighter fallback
  fallback2: 'microsoft/DialoGPT-medium',    // Medium fallback
} as const;

interface HuggingFaceResponse {
  generated_text?: string;
  error?: string;
}

interface AIResponse {
  content: string;
  model: string;
  processing_time: number;
  success: boolean;
  error?: string;
}

class HuggingFaceService {
  private async makeRequest(
    modelName: string, 
    prompt: string, 
    options: Record<string, any> = {}
  ): Promise<HuggingFaceResponse> {
    if (!HF_API_TOKEN) {
      throw new Error('Hugging Face API token not configured');
    }

    const response = await fetch(`${HF_API_URL}/${modelName}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HF_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_length: 500,
          temperature: 0.7,
          top_p: 0.9,
          do_sample: true,
          return_full_text: false,
          ...options
        },
        options: {
          wait_for_model: true,
          use_cache: false
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Hugging Face API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data[0] : data;
  }

  async generateResponse(
    assistant: Assistant,
    userMessage: string,
    conversationHistory: any[] = []
  ): Promise<AIResponse> {
    const startTime = Date.now();
    
    console.log('🤖 HuggingFace Service: Generating AI response for', assistant.name);
    
    if (!HF_API_TOKEN) {
      console.warn('⚠️ Hugging Face API token not found, falling back to local response');
      const processingTime = Date.now() - startTime;
      return {
        content: this.getFallbackResponse(assistant, userMessage),
        model: 'fallback',
        processing_time: processingTime,
        success: false,
        error: 'No API token configured'
      };
    }
    
    console.log('✅ HuggingFace Service: API token found, making request to HF API');

    try {
      // Get the assistant's specific prompt
      const assistantPrompt = assistantPrompts[assistant.id as keyof typeof assistantPrompts];
      
      if (!assistantPrompt) {
        throw new Error(`No prompt found for assistant: ${assistant.id}`);
      }

      // Create contextualized prompt
      const contextualizedPrompt = getContextualizedPrompt(
        assistant.id,
        {
          name: 'Usuario',
          company: 'Mi Empresa',
          industry: 'Tecnología',
          currentProject: 'Optimización de negocio',
          relationshipLevel: 'familiar'
        },
        conversationHistory
      );

      // Format the prompt for the model
      const formattedPrompt = this.formatPromptForModel(contextualizedPrompt, userMessage);

      // Try primary model first
      let response: HuggingFaceResponse;
      let usedModel: string = MODELS.primary;

      console.log('🚀 Making request to HuggingFace API with model:', MODELS.primary);
      try {
        response = await this.makeRequest(MODELS.primary, formattedPrompt);
        console.log('✅ HuggingFace API response received successfully');
      } catch (primaryError) {
        console.warn('Primary model failed, trying fallback:', primaryError);
        
        try {
          response = await this.makeRequest(MODELS.fallback1, formattedPrompt);
          usedModel = MODELS.fallback1;
        } catch (fallback1Error) {
          console.warn('Fallback 1 failed, trying fallback 2:', fallback1Error);
          
          response = await this.makeRequest(MODELS.fallback2, formattedPrompt);
          usedModel = MODELS.fallback2;
        }
      }

      if (response.error) {
        throw new Error(response.error);
      }

      const processingTime = Date.now() - startTime;
      
      // Clean and format the response
      const cleanedContent = this.cleanResponse(
        response.generated_text || 'Lo siento, no pude generar una respuesta en este momento.',
        assistant
      );

      return {
        content: cleanedContent,
        model: usedModel,
        processing_time: processingTime,
        success: true
      };

    } catch (error) {
      console.error('Hugging Face service error:', error);
      
      const processingTime = Date.now() - startTime;
      
      // Return fallback response
      return {
        content: this.getFallbackResponse(assistant, userMessage),
        model: 'fallback',
        processing_time: processingTime,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private formatPromptForModel(systemPrompt: string, userMessage: string): string {
    // Format the prompt for DialoGPT-style models
    return `${systemPrompt}\n\nUsuario: ${userMessage}\nAsistente:`;
  }

  private cleanResponse(response: string, assistant: Assistant): string {
    // Remove common artifacts from model responses
    let cleaned = response
      .trim()
      .replace(/^(Usuario:|Asistente:|Human:|AI:|Assistant:)/i, '')
      .replace(/\n\s*\n/g, '\n')
      .trim();

    // Ensure response is not empty
    if (!cleaned || cleaned.length < 10) {
      return this.getFallbackResponse(assistant, '');
    }

    // Ensure response matches assistant's personality
    if (!cleaned.includes(assistant.name) && Math.random() > 0.7) {
      cleaned = `¡Hola! Soy ${assistant.name}. ${cleaned}`;
    }

    return cleaned;
  }

  private getFallbackResponse(assistant: Assistant, userMessage: string): string {
    // Fallback responses when AI fails
    const fallbacks = {
      sofia: "¡Hola! Soy Sofía 📱. Estoy aquí para ayudarte con tu estrategia de redes sociales. ¿En qué plataforma quieres enfocarte hoy?",
      carlos: "¡Hola! Soy Carlos 💬. Estoy disponible 24/7 para optimizar tu atención al cliente. ¿Cómo puedo ayudarte a mejorar tu servicio?",
      paula: "¡Hola! Soy Paula ✍️. Te ayudo a crear copy que convierte. ¿Qué tipo de contenido necesitas que escriba para ti?"
    };

    return fallbacks[assistant.id as keyof typeof fallbacks] || 
           `¡Hola! Soy ${assistant.name}. ¿Cómo puedo ayudarte hoy?`;
  }

  // Test connection to Hugging Face
  async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      const testPrompt = "Hola, ¿cómo estás?";
      const response = await this.makeRequest(MODELS.fallback2, testPrompt);
      
      return {
        success: true,
        message: "Conexión exitosa con Hugging Face"
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : "Error de conexión"
      };
    }
  }

  // Get available models status
  async getModelsStatus(): Promise<Record<string, boolean>> {
    const status: Record<string, boolean> = {};
    
    for (const [key, modelName] of Object.entries(MODELS)) {
      try {
        await this.makeRequest(modelName, "test", { max_length: 10 });
        status[key] = true;
      } catch {
        status[key] = false;
      }
    }
    
    return status;
  }
}

// Export singleton instance
export const huggingFaceService = new HuggingFaceService();

// Export types
export type { AIResponse };
export { MODELS };
