// 🎨 SERVICIO DE GENERACIÓN DE IMÁGENES
// Integración con Hugging Face para crear contenido visual para redes sociales

interface ImageGenerationRequest {
  prompt: string;
  style?: 'professional' | 'casual' | 'creative' | 'minimalist' | 'vibrant';
  format?: 'square' | 'landscape' | 'portrait' | 'story';
  platform?: 'instagram' | 'facebook' | 'linkedin' | 'twitter' | 'tiktok';
  brand?: {
    colors?: string[];
    fonts?: string[];
    logoUrl?: string;
  };
}

interface ImageGenerationResponse {
  success: boolean;
  imageUrl?: string;
  imageData?: string; // Base64 encoded
  prompt_used: string;
  style_applied: string;
  generation_time: number;
  error?: string;
  suggestions?: string[];
}

class ImageGenerationService {
  private readonly HF_API_URL = 'https://api-inference.huggingface.co/models';
  private readonly API_TOKEN: string;
  
  // Modelos disponibles en Hugging Face
  private readonly MODELS = {
    'stable-diffusion': 'runwayml/stable-diffusion-v1-5',
    'artistic': 'prompthero/openjourney-v4',
    'realistic': 'SG161222/Realistic_Vision_V2.0',
    'creative': 'stabilityai/stable-diffusion-2-1'
  };

  private readonly STYLE_PROMPTS = {
    professional: 'professional, clean, corporate style, high quality, modern design',
    casual: 'casual, friendly, approachable, warm colors, relaxed atmosphere',
    creative: 'creative, artistic, unique, innovative, eye-catching, vibrant',
    minimalist: 'minimalist, clean lines, simple, elegant, white space, modern',
    vibrant: 'vibrant colors, energetic, dynamic, bold, exciting, lively'
  };

  private readonly PLATFORM_SPECS = {
    instagram: { width: 1080, height: 1080, ratio: '1:1' },
    facebook: { width: 1200, height: 630, ratio: '1.91:1' },
    linkedin: { width: 1200, height: 627, ratio: '1.91:1' },
    twitter: { width: 1200, height: 675, ratio: '16:9' },
    tiktok: { width: 1080, height: 1920, ratio: '9:16' }
  };

  constructor() {
    this.API_TOKEN = process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY || process.env.HUGGINGFACE_API_KEY || '';
    
    if (!this.API_TOKEN) {
      console.warn('🎨 Image Generation: No Hugging Face API key found');
    }
  }

  async generateImage(request: ImageGenerationRequest): Promise<ImageGenerationResponse> {
    const startTime = Date.now();

    try {
      if (!this.API_TOKEN) {
        return this.createFallbackResponse(request, startTime, 'No API key configured');
      }

      // Construir prompt optimizado
      const optimizedPrompt = this.buildOptimizedPrompt(request);
      
      // Seleccionar modelo basado en estilo
      const model = this.selectModel(request.style || 'professional');
      
      console.log(`🎨 Generating image with model: ${model}`);
      console.log(`🎨 Optimized prompt: ${optimizedPrompt}`);

      // Llamar a Hugging Face
      const response = await this.callHuggingFaceAPI(model, optimizedPrompt);
      
      if (response.success) {
        const generationTime = Date.now() - startTime;
        
        return {
          success: true,
          imageData: response.imageData,
          prompt_used: optimizedPrompt,
          style_applied: request.style || 'professional',
          generation_time: generationTime,
          suggestions: this.generateImprovementSuggestions(request)
        };
      } else {
        throw new Error(response.error || 'Failed to generate image');
      }

    } catch (error) {
      console.error('🎨 Image Generation Error:', error);
      return this.createFallbackResponse(request, startTime, (error as Error).message);
    }
  }

  private buildOptimizedPrompt(request: ImageGenerationRequest): string {
    let prompt = request.prompt;

    // Agregar especificaciones de estilo
    if (request.style && this.STYLE_PROMPTS[request.style]) {
      prompt += ', ' + this.STYLE_PROMPTS[request.style];
    }

    // Agregar especificaciones de plataforma
    if (request.platform) {
      const platformSpec = this.PLATFORM_SPECS[request.platform];
      if (platformSpec) {
        prompt += `, optimized for ${request.platform}, ${platformSpec.ratio} aspect ratio`;
      }
    }

    // Agregar especificaciones de marca si están disponibles
    if (request.brand?.colors && request.brand.colors.length > 0) {
      prompt += `, using brand colors: ${request.brand.colors.join(', ')}`;
    }

    // Agregar términos de calidad
    prompt += ', high quality, detailed, professional photography, 8k resolution';

    // Filtros negativos para evitar elementos no deseados
    prompt += ' --no watermark, no text overlay, no signatures, no blurry';

    return prompt;
  }

  private selectModel(style: string): string {
    switch (style) {
      case 'creative':
      case 'artistic':
        return this.MODELS['creative'];
      case 'professional':
      case 'minimalist':
        return this.MODELS['stable-diffusion'];
      case 'casual':
      case 'vibrant':
        return this.MODELS['artistic'];
      default:
        return this.MODELS['stable-diffusion'];
    }
  }

  private async callHuggingFaceAPI(model: string, prompt: string): Promise<{
    success: boolean;
    imageData?: string;
    error?: string;
  }> {
    try {
      const response = await fetch(`${this.HF_API_URL}/${model}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            guidance_scale: 7.5,
            num_inference_steps: 50,
            width: 512,
            height: 512
          }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      // Hugging Face retorna la imagen como blob
      const blob = await response.blob();
      const imageData = await this.blobToBase64(blob);

      return {
        success: true,
        imageData
      };

    } catch (error) {
      console.error('🎨 Hugging Face API Error:', error);
      return {
        success: false,
        error: (error as Error).message
      };
    }
  }

  private async blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Remover el prefijo data:image/...;base64,
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  private generateImprovementSuggestions(request: ImageGenerationRequest): string[] {
    const suggestions: string[] = [];

    if (!request.style) {
      suggestions.push('Considera especificar un estilo para obtener mejores resultados');
    }

    if (!request.platform) {
      suggestions.push('Especifica la plataforma para optimizar las dimensiones');
    }

    if (!request.brand?.colors) {
      suggestions.push('Agrega colores de marca para mayor consistencia visual');
    }

    if (request.prompt.length < 20) {
      suggestions.push('Prompts más detallados generan mejores resultados');
    }

    return suggestions;
  }

  private createFallbackResponse(request: ImageGenerationRequest, startTime: number, error: string): ImageGenerationResponse {
    return {
      success: false,
      prompt_used: request.prompt,
      style_applied: request.style || 'professional',
      generation_time: Date.now() - startTime,
      error,
      suggestions: [
        'Verifica que la API key de Hugging Face esté configurada',
        'Intenta con un prompt más simple',
        'Considera usar el modo de simulación para pruebas'
      ]
    };
  }

  // 🎨 MÉTODOS UTILITARIOS PARA SOFÍA (SOCIAL MEDIA)

  async generateSocialMediaPost(content: {
    text: string;
    platform: 'instagram' | 'facebook' | 'linkedin' | 'twitter' | 'tiktok';
    style?: 'professional' | 'casual' | 'creative' | 'minimalist' | 'vibrant';
    industry?: string;
    brand?: { colors?: string[]; fonts?: string[]; logoUrl?: string; };
  }): Promise<ImageGenerationResponse> {
    
    // Crear prompt optimizado para redes sociales
    let prompt = `Social media post image for ${content.platform}`;
    
    if (content.text) {
      // Extraer conceptos clave del texto
      const keywords = this.extractKeywords(content.text);
      if (keywords.length > 0) {
        prompt += `, featuring ${keywords.join(', ')}`;
      }
    }

    if (content.industry) {
      prompt += `, ${content.industry} industry theme`;
    }

    return this.generateImage({
      prompt,
      style: content.style || 'professional',
      platform: content.platform,
      brand: content.brand
    });
  }

  async generateProductShowcase(product: {
    name: string;
    description?: string;
    category?: string;
    style?: 'professional' | 'casual' | 'creative' | 'minimalist' | 'vibrant';
    platform?: 'instagram' | 'facebook' | 'linkedin' | 'twitter' | 'tiktok';
  }): Promise<ImageGenerationResponse> {
    
    let prompt = `Product showcase image for ${product.name}`;
    
    if (product.description) {
      prompt += `, ${product.description}`;
    }
    
    if (product.category) {
      prompt += `, ${product.category} product`;
    }
    
    prompt += ', product photography, clean background, well lit, commercial photography';

    return this.generateImage({
      prompt,
      style: product.style || 'professional',
      platform: product.platform || 'instagram'
    });
  }

  async generateBrandContent(brand: {
    name: string;
    industry: string;
    message: string;
    colors?: string[];
    style?: 'professional' | 'casual' | 'creative' | 'minimalist' | 'vibrant';
    platform?: 'instagram' | 'facebook' | 'linkedin' | 'twitter' | 'tiktok';
  }): Promise<ImageGenerationResponse> {
    
    let prompt = `Brand content image for ${brand.name}, ${brand.industry} company`;
    prompt += `, conveying: ${brand.message}`;
    prompt += ', brand identity, corporate design, marketing material';

    return this.generateImage({
      prompt,
      style: brand.style || 'professional',
      platform: brand.platform || 'instagram',
      brand: {
        colors: brand.colors
      }
    });
  }

  private extractKeywords(text: string): string[] {
    // Palabras clave comunes en español para filtrar
    const stopWords = new Set([
      'el', 'la', 'de', 'que', 'y', 'a', 'en', 'un', 'es', 'se', 'no', 'te', 'lo', 'le', 'da', 'su', 'por', 'son', 'con', 'para', 'al', 'del', 'los', 'las', 'una', 'como', 'muy', 'más', 'todo', 'pero', 'si', 'ya', 'ser', 'has', 'está', 'fue', 'han', 'hay'
    ]);

    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 3 && !stopWords.has(word));

    // Retornar las primeras 5 palabras más relevantes
    return words.slice(0, 5);
  }

  // 🧪 MÉTODO DE SIMULACIÓN PARA DESARROLLO
  async generateSimulatedImage(request: ImageGenerationRequest): Promise<ImageGenerationResponse> {
    const startTime = Date.now();
    
    // Simular tiempo de procesamiento realista
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));

    // URLs de imágenes placeholder para diferentes estilos
    const placeholderImages = {
      professional: 'https://via.placeholder.com/1080x1080/2563eb/ffffff?text=Professional+Content',
      casual: 'https://via.placeholder.com/1080x1080/10b981/ffffff?text=Casual+Content',
      creative: 'https://via.placeholder.com/1080x1080/f59e0b/ffffff?text=Creative+Content',
      minimalist: 'https://via.placeholder.com/1080x1080/6b7280/ffffff?text=Minimalist+Content',
      vibrant: 'https://via.placeholder.com/1080x1080/ec4899/ffffff?text=Vibrant+Content'
    };

    const style = request.style || 'professional';
    const imageUrl = placeholderImages[style];

    return {
      success: true,
      imageUrl,
      prompt_used: this.buildOptimizedPrompt(request),
      style_applied: style,
      generation_time: Date.now() - startTime,
      suggestions: this.generateImprovementSuggestions(request)
    };
  }
}

// 🌟 EXPORTAR INSTANCIA SINGLETON
export const imageGenerationService = new ImageGenerationService();
export default imageGenerationService;

// 🔧 TIPOS EXPORTADOS
export type { ImageGenerationRequest, ImageGenerationResponse };
