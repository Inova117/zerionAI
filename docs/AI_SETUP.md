# 🤖 Configuración de IA - Sintra AI LATAM

Esta guía te ayuda a configurar los servicios de IA para que tus asistentes funcionen con modelos reales.

## 🎯 Estrategia de Modelos

### Fase Beta (Actual)
- **Proveedor**: Hugging Face (Gratuito/Económico)
- **Modelos**: DialoGPT-large, BlenderBot-400M
- **Costo**: ~$0.002 por 1000 tokens
- **Ideal para**: Desarrollo, testing, MVP

### Fase Producción (Futuro)
- **Proveedor**: OpenAI + Anthropic + Hugging Face
- **Modelos**: GPT-4, Claude 3.5 Sonnet, Llama 3.1
- **Costo**: ~$0.03 por 1000 tokens
- **Ideal para**: Aplicación en vivo con usuarios reales

## 🔧 Configuración Rápida

### 1. Obtener API Key de Hugging Face

1. Ve a [Hugging Face](https://huggingface.co/)
2. Crea una cuenta gratuita
3. Ve a **Settings** → **Access Tokens**
4. Crea un nuevo token con permisos de **Read**
5. Copia el token

### 2. Configurar Variables de Entorno

```bash
# En tu archivo .env.local
NEXT_PUBLIC_HUGGINGFACE_API_KEY=hf_xxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 3. Verificar Configuración

1. Inicia la aplicación: `npm run dev`
2. Ve al dashboard
3. Haz clic en el ícono 🧠 (Brain) en el header
4. Haz clic en "Test" para verificar la conexión
5. Deberías ver "✅ OK" en Hugging Face

## 🧠 Funcionamiento del Sistema

### Arquitectura Híbrida

```
Usuario envía mensaje
        ↓
    Servicio de IA
        ↓
¿Hugging Face disponible?
    ↙        ↘
   Sí         No
    ↓          ↓
IA Real   Simulación
    ↓          ↓
Respuesta inteligente
```

### Modelos Disponibles

| Modelo | Uso | Velocidad | Calidad |
|--------|-----|-----------|---------|
| **DialoGPT-large** | Principal | Media | Alta |
| **BlenderBot-400M** | Fallback 1 | Rápida | Media |
| **DialoGPT-medium** | Fallback 2 | Rápida | Media |

## 📊 Monitoring y Debugging

### Ver Status en la App

- **Icono 🧠 en el header** → Estado actual del sistema
- **Test Connection** → Verificar conectividad
- **Logs en consola** → Ver detalles de respuestas

### Logs Típicos

```bash
# ✅ Funcionando con IA
✅ AI Response from microsoft/DialoGPT-large in 1247ms

# ⚠️ Usando fallback
🔄 Using simulation fallback
AI service failed, falling back to simulation: Model loading
```

## 🎛️ Personalización Avanzada

### Cambiar Modelos

Edita `src/lib/huggingface-service.ts`:

```typescript
const MODELS = {
  primary: 'microsoft/DialoGPT-large',        // Cambia este
  fallback1: 'facebook/blenderbot-400M-distill',
  fallback2: 'microsoft/DialoGPT-medium',
};
```

### Ajustar Parámetros

```typescript
parameters: {
  max_length: 500,      // Longitud máxima de respuesta
  temperature: 0.7,     // Creatividad (0.1-1.0)
  top_p: 0.9,          // Diversidad (0.1-1.0)
  do_sample: true,     // Activar sampling
}
```

### Personalizar Prompts

Los prompts están en `src/lib/assistant-prompts.ts`:

```typescript
systemPrompt: `Eres Sofía, especialista en redes sociales...`
```

## 🚀 Optimización para Producción

### 1. Caché de Respuestas

```typescript
// TODO: Implementar Redis para caché
const cachedResponse = await redis.get(`response:${hash}`);
```

### 2. Rate Limiting

```typescript
// TODO: Implementar límites por usuario/plan
const canProceed = await checkRateLimit(userId, plan);
```

### 3. Múltiples Proveedores

```typescript
// TODO: Agregar OpenAI y Anthropic
const providers = ['huggingface', 'openai', 'anthropic'];
```

## 🔍 Troubleshooting

### Error: "API token not configured"

**Causa**: Variable de entorno no configurada
**Solución**: 
```bash
# Asegúrate de tener en .env.local:
NEXT_PUBLIC_HUGGINGFACE_API_KEY=tu_token_aqui
```

### Error: "Model loading"

**Causa**: El modelo está iniciando en Hugging Face
**Solución**: Espera 30-60 segundos, el sistema usa fallback automáticamente

### Error: "429 Too Many Requests"

**Causa**: Límite de rate de Hugging Face alcanzado
**Solución**: 
- Espera unos minutos
- Considera upgradear a Hugging Face Pro
- El sistema usa simulación como fallback

### Respuestas de Baja Calidad

**Causa**: Modelo no optimizado para español
**Solución**: 
1. Mejora los prompts en `assistant-prompts.ts`
2. Considera usar modelos específicos para español
3. Ajusta `temperature` y `top_p`

## 📈 Roadmap

### Q1 2024 - Beta
- [x] Integración Hugging Face
- [x] Sistema de fallback
- [x] Monitoring básico
- [ ] Caché de respuestas
- [ ] Rate limiting

### Q2 2024 - Producción
- [ ] Integración OpenAI GPT-4
- [ ] Integración Anthropic Claude
- [ ] Balanceador de carga entre proveedores
- [ ] Analytics avanzados

### Q3 2024 - Optimización
- [ ] Modelos fine-tuned para LATAM
- [ ] Respuestas multimodales (texto + imágenes)
- [ ] IA de voz para WhatsApp

## 💡 Tips Pro

1. **Usa el simulador para desarrollo** - Es más rápido y no consume API calls
2. **Activa IA real para demos** - Impresiona a inversores y clientes
3. **Monitorea el usage** - Hugging Face tiene límites gratuitos
4. **Optimiza prompts** - Mejores prompts = mejores respuestas
5. **Planea la migración** - OpenAI/Anthropic para producción

## 🆘 Soporte

¿Problemas con la configuración?

- **GitHub Issues**: [repo/issues](https://github.com/Inova117/zerionAI/issues)
- **Email**: soporte@sintra-latam.com
- **WhatsApp**: +52 55 1234 5678

---

**¡Tu IA ya está lista para conversar! 🎉**
