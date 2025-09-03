# 🤖 Sintra AI LATAM

**Automatiza tu negocio con 12 asistentes IA especializados para América Latina**

[![Next.js](https://img.shields.io/badge/Next.js-15.5.2-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Latest-green?logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

## 🌟 Características Principales

- **12 Asistentes IA Especializados** - Marketing, Ventas, Soporte, Copywriting y más
- **Cerebro AI Centralizado** - Memoria contextual que mejora con cada interacción
- **Automatizaciones 24/7** - Tareas que se ejecutan automáticamente
- **Dashboard Inteligente** - Analytics en tiempo real y métricas de productividad
- **Integración WhatsApp** - Soporte automático para tus clientes
- **Multi-idioma** - Optimizado para español y portugués (LATAM)

## 🚀 Demo en Vivo

### Credenciales de Prueba
- **Email**: `demo@sintra-latam.com`
- **Password**: `demo123456`

## 📁 Estructura del Proyecto

```
sintra-latam/
├── src/
│   ├── app/                    # App Router de Next.js
│   │   ├── (auth)/            # Páginas de autenticación
│   │   ├── dashboard/         # Dashboard principal
│   │   └── page.tsx           # Landing page
│   ├── components/            # Componentes reutilizables
│   │   ├── auth/             # Componentes de auth
│   │   ├── dashboard/        # Componentes del dashboard
│   │   └── landing/          # Componentes del landing
│   ├── lib/                  # Utilidades y configuración
│   ├── hooks/                # Custom React hooks
│   └── store/                # Estado global (Zustand)
├── supabase/
│   ├── migrations/           # Esquemas de base de datos
│   ├── seed/                 # Datos de prueba
│   └── functions/            # Edge Functions
├── docs/                     # Documentación técnica
└── public/                   # Assets estáticos
```

## 🛠️ Stack Tecnológico

### Frontend
- **Framework**: Next.js 15.5.2 (App Router, RSC)
- **UI/UX**: Tailwind CSS + Shadcn/ui + Framer Motion
- **Tipado**: TypeScript estricto
- **Estado**: Zustand + TanStack Query
- **Validación**: Zod + React Hook Form

### Backend
- **Base de Datos**: Supabase (PostgreSQL)
- **Autenticación**: Supabase Auth + Row Level Security
- **API**: Supabase Edge Functions
- **Storage**: Supabase Storage
- **Real-time**: Supabase Subscriptions

### AI & Machine Learning
- **Modelos de IA**: 
  - **Beta**: DeepSeek V3, Llama 3.1 70B, Qwen 2.5 72B (vía Hugging Face)
  - **Producción**: Híbrido (OpenAI GPT-4, Claude 3.5 Sonnet)
- **Procesamiento**: Vercel AI SDK
- **Fallback**: Múltiples modelos con graceful degradation

### Infraestructura
- **Hosting**: Vercel (Frontend) + AWS (Backend)
- **CDN**: CloudFlare
- **Monitoreo**: Supabase Analytics
- **CI/CD**: GitHub Actions

## ⚡ Instalación Rápida

### Prerrequisitos
- Node.js 18+ 
- npm/yarn/pnpm
- Cuenta de Supabase
- Git

### 1. Clonar el Repositorio
```bash
git clone https://github.com/Inova117/zerionAI.git
cd zerionAI/sintra-latam
```

### 2. Instalar Dependencias
```bash
npm install
```

### 3. Configurar Variables de Entorno
```bash
cp .env.example .env.local
```

Edita `.env.local` con tus credenciales:
```env
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
```

### 4. Configurar Base de Datos
```bash
# En tu Supabase SQL Editor:
# 1. Ejecutar: supabase/migrations/002_complete_schema.sql
# 2. Ejecutar: supabase/migrations/003_row_level_security.sql
# 3. Ejecutar: supabase/seed/safe_seed.sql
# 4. Ejecutar: supabase/seed/auth_demo_data.sql
```

### 5. Ejecutar en Desarrollo
```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 🎯 Asistentes Incluidos

### 📱 **Sofía** - Social Media Specialist
Experta en redes sociales, crea contenido viral y gestiona comunidades.

### 💬 **Carlos** - Customer Support Manager  
Especialista en atención al cliente y automatización de WhatsApp Business.

### ✍️ **Paula** - Copywriter & Content Creator
Copywriter experta que convierte palabras en ventas con copy persuasivo.

### 📊 **Ana** - Digital Marketing Manager
Estratega de marketing digital que optimiza campañas y maximiza ROI.

### 💰 **Diego** - Sales Manager
Especialista en ventas que automatiza procesos y cierra más deals.

### 🎨 **Lucía** - Content Strategist
Creadora de contenido que planifica estrategias editoriales efectivas.

### 💻 **Ricardo** - Financial Analyst
Analista financiero que optimiza presupuestos y proyecciones.

### ⚙️ **Elena** - Operations Manager
Gerente de operaciones que automatiza workflows y mejora eficiencia.

*+4 asistentes adicionales en planes Enterprise*

## 📊 Planes y Precios

| Plan | Precio | Asistentes | Mensajes/mes | Características |
|------|--------|------------|--------------|-----------------|
| **Starter** | $29/mes | 3 | 1,000 | Ideal para emprendedores |
| **Professional** | $79/mes | 6 | 10,000 | Para PyMEs con WhatsApp |
| **Enterprise** | $199/mes | 12 | Ilimitados | Para empresas grandes |

## 🔧 Configuración Avanzada

### Supabase Edge Functions
```bash
# Desplegar funciones
supabase functions deploy ai-chat
supabase functions deploy stripe-webhooks
```

### Variables de Entorno Completas
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# AI Models
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
HUGGINGFACE_API_KEY=

# Stripe
STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# WhatsApp
WHATSAPP_TOKEN=
WHATSAPP_VERIFY_TOKEN=
```

## 🧪 Testing

```bash
# Tests unitarios
npm run test

# Tests de integración
npm run test:integration

# Tests E2E
npm run test:e2e

# Coverage
npm run test:coverage
```

## 📈 Roadmap

### Q1 2024
- [x] MVP con 3 asistentes principales
- [x] Sistema de autenticación completo
- [x] Dashboard básico con métricas
- [ ] Integración WhatsApp Business
- [ ] Sistema de pagos con Stripe

### Q2 2024
- [ ] 12 asistentes completos
- [ ] Automatizaciones avanzadas
- [ ] API pública
- [ ] Integración con Zapier
- [ ] White-label para empresas

### Q3 2024
- [ ] Modelos IA propios
- [ ] Análisis de sentimientos
- [ ] Integraciones CRM
- [ ] App móvil (React Native)

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Distribuido bajo la Licencia MIT. Ver `LICENSE` para más información.

## 👥 Equipo

- **Product Lead**: [Tu Nombre]
- **Full Stack Developer**: [Tu Nombre]
- **AI Engineer**: [Tu Nombre]

## 📞 Soporte

- **Email**: soporte@sintra-latam.com
- **WhatsApp**: +52 55 1234 5678
- **Documentación**: [docs.sintra-latam.com]
- **Status Page**: [status.sintra-latam.com]

## 🌟 Reconocimientos

- Inspirado en [Sintra AI](https://sintra.ai) para el mercado de América Latina
- Construido con tecnologías open source de clase mundial
- Diseñado específicamente para las necesidades del mercado LATAM

---

**Hecho con ❤️ para América Latina**

[![GitHub stars](https://img.shields.io/github/stars/Inova117/zerionAI?style=social)](https://github.com/Inova117/zerionAI/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/Inova117/zerionAI?style=social)](https://github.com/Inova117/zerionAI/network/members)