# 🏗️ INFRAESTRUCTURA COMPLETA - SINTRA AI LATAM

## 📊 ARQUITECTURA GENERAL

```
┌─────────────────────────────────────────────────────────────┐
│                     SINTRA AI LATAM                         │
│                   STACK TECNOLÓGICO                        │
└─────────────────────────────────────────────────────────────┘

FRONTEND                 BACKEND                 DATABASE
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│ Next.js 14  │────────▶│ Supabase    │────────▶│ PostgreSQL  │
│ React       │         │ Edge Funcs  │         │ + Extensions│
│ TypeScript  │         │ Real-time   │         │             │
│ Tailwind    │         │ Auth        │         │             │
│ Shadcn/UI   │         │ Storage     │         │             │
└─────────────┘         └─────────────┘         └─────────────┘
       │                        │                        │
       │                        │                        │
       ▼                        ▼                        ▼
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│ Zustand     │         │ Row Level   │         │ Real-time   │
│ State Mgmt  │         │ Security    │         │ Replication │
│ Local Store │         │ (RLS)       │         │ Triggers    │
└─────────────┘         └─────────────┘         └─────────────┘

EXTERNAL SERVICES
┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│ AI Models   │  │ WhatsApp    │  │ Email       │  │ Analytics   │
│ • HuggingF  │  │ Business    │  │ Service     │  │ • Mixpanel  │
│ • OpenAI    │  │ API         │  │ • Resend    │  │ • PostHog   │
│ • Anthropic │  │             │  │ • SendGrid  │  │             │
└─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘
```

## 🗄️ ESQUEMA DE BASE DE DATOS COMPLETO

### TABLAS PRINCIPALES

#### 1. USUARIOS Y AUTENTICACIÓN
```sql
-- Tabla de perfiles de usuario (extiende auth.users de Supabase)
profiles (
    id uuid PRIMARY KEY REFERENCES auth.users(id),
    email text UNIQUE NOT NULL,
    full_name text,
    avatar_url text,
    phone text,
    timezone text DEFAULT 'America/Mexico_City',
    language text DEFAULT 'es',
    
    -- Información empresarial
    company_name text,
    company_industry text,
    company_size company_size_enum,
    company_growth_stage growth_stage_enum,
    company_revenue_range text,
    company_website text,
    
    -- Configuraciones
    notification_preferences jsonb DEFAULT '{}',
    communication_style communication_style_enum DEFAULT 'friendly',
    working_hours jsonb DEFAULT '{"start": "09:00", "end": "18:00"}',
    
    -- Metadatos
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    last_active_at timestamptz DEFAULT now(),
    is_active boolean DEFAULT true,
    
    -- Onboarding
    onboarding_completed boolean DEFAULT false,
    onboarding_step integer DEFAULT 1,
    
    -- Business goals
    primary_goals text[],
    secondary_goals text[],
    goals_timeline text DEFAULT '6-months',
    priority_focus focus_area_enum DEFAULT 'marketing'
);

-- Organizaciones (para empresas multi-usuario)
organizations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    slug text UNIQUE NOT NULL,
    description text,
    logo_url text,
    website text,
    industry text,
    size organization_size_enum,
    
    -- Configuraciones
    settings jsonb DEFAULT '{}',
    
    -- Facturación
    billing_email text,
    billing_address jsonb,
    tax_id text,
    
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    is_active boolean DEFAULT true
);

-- Membresías de organización
organization_members (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
    user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
    role organization_role_enum DEFAULT 'member',
    permissions text[],
    invited_by uuid REFERENCES profiles(id),
    joined_at timestamptz DEFAULT now(),
    is_active boolean DEFAULT true,
    
    UNIQUE(organization_id, user_id)
);
```

#### 2. ASISTENTES Y CONFIGURACIÓN
```sql
-- Catálogo de asistentes disponibles
assistants_catalog (
    id text PRIMARY KEY, -- 'sofia', 'carlos', 'paula', etc.
    name text NOT NULL,
    role text NOT NULL,
    description text NOT NULL,
    avatar text NOT NULL,
    color text NOT NULL,
    
    -- Configuración del asistente
    specialties text[],
    primary_skills text[],
    secondary_skills text[],
    tools text[],
    methodologies text[],
    
    -- Prompts y personalidad
    system_prompt text NOT NULL,
    personality jsonb NOT NULL,
    response_patterns jsonb NOT NULL,
    
    -- Metadatos
    version text DEFAULT '1.0',
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    
    -- Restricciones por plan
    required_plan subscription_plan_enum DEFAULT 'starter',
    is_premium boolean DEFAULT false
);

-- Asistentes activados por usuario
user_assistants (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
    assistant_id text REFERENCES assistants_catalog(id),
    
    -- Personalización
    custom_name text, -- Nombre personalizado por el usuario
    custom_prompt text, -- Prompt personalizado
    custom_settings jsonb DEFAULT '{}',
    
    -- Estado
    is_active boolean DEFAULT true,
    activation_date timestamptz DEFAULT now(),
    last_interaction timestamptz,
    
    -- Estadísticas
    total_interactions integer DEFAULT 0,
    successful_tasks integer DEFAULT 0,
    user_satisfaction numeric(3,2) DEFAULT 3.0,
    trust_level numeric(3,2) DEFAULT 0.5,
    
    UNIQUE(user_id, assistant_id)
);

-- Configuraciones específicas por asistente-usuario
assistant_configurations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_assistant_id uuid REFERENCES user_assistants(id) ON DELETE CASCADE,
    
    -- Configuraciones específicas
    automation_enabled boolean DEFAULT false,
    notification_enabled boolean DEFAULT true,
    response_delay integer DEFAULT 1000, -- ms
    
    -- Integraciones
    integrations jsonb DEFAULT '{}', -- WhatsApp, email, etc.
    
    -- Horarios de trabajo
    working_schedule jsonb DEFAULT '{}',
    timezone_aware boolean DEFAULT true,
    
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);
```

#### 3. CONVERSACIONES Y MENSAJES
```sql
-- Conversaciones
conversations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
    assistant_id text REFERENCES assistants_catalog(id),
    
    -- Metadatos de conversación
    title text, -- Auto-generado o manual
    context jsonb DEFAULT '{}', -- Contexto específico de la conversación
    status conversation_status_enum DEFAULT 'active',
    
    -- Timestamps
    started_at timestamptz DEFAULT now(),
    last_message_at timestamptz DEFAULT now(),
    archived_at timestamptz,
    
    -- Estadísticas
    message_count integer DEFAULT 0,
    total_tokens_used integer DEFAULT 0,
    cost numeric(10,4) DEFAULT 0.0000,
    
    -- Calificación
    user_rating integer CHECK (user_rating >= 1 AND user_rating <= 5),
    user_feedback text
);

-- Mensajes
messages (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id uuid REFERENCES conversations(id) ON DELETE CASCADE,
    
    -- Contenido del mensaje
    role message_role_enum NOT NULL, -- 'user', 'assistant', 'system'
    content text NOT NULL,
    content_type message_type_enum DEFAULT 'text',
    
    -- Metadatos del mensaje
    metadata jsonb DEFAULT '{}', -- Archivos adjuntos, acciones, etc.
    tokens_used integer,
    processing_time integer, -- ms
    model_used text,
    cost numeric(10,6) DEFAULT 0.000000,
    
    -- Estados
    status message_status_enum DEFAULT 'delivered',
    error_details text,
    
    -- Timestamps
    created_at timestamptz DEFAULT now(),
    delivered_at timestamptz,
    read_at timestamptz,
    
    -- Respuesta a mensaje (threading)
    reply_to_message_id uuid REFERENCES messages(id),
    
    -- Calificación específica del mensaje
    user_rating integer CHECK (user_rating >= 1 AND user_rating <= 5),
    is_helpful boolean
);

-- Archivos adjuntos
message_attachments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id uuid REFERENCES messages(id) ON DELETE CASCADE,
    
    -- Información del archivo
    filename text NOT NULL,
    original_name text NOT NULL,
    mime_type text NOT NULL,
    file_size bigint NOT NULL,
    
    -- Storage
    storage_bucket text NOT NULL,
    storage_path text NOT NULL,
    public_url text,
    
    -- Metadatos
    metadata jsonb DEFAULT '{}',
    
    created_at timestamptz DEFAULT now()
);
```

#### 4. CEREBRO AI - KNOWLEDGE BASE
```sql
-- Datos del cerebro AI por usuario
brain_ai_data (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
    
    -- Perfil consolidado
    consolidated_profile jsonb NOT NULL DEFAULT '{}',
    
    -- Base de conocimiento
    insights jsonb DEFAULT '[]', -- Array of insights
    patterns jsonb DEFAULT '[]', -- Array of detected patterns
    success_metrics jsonb DEFAULT '{}', -- Key metrics and improvements
    projects jsonb DEFAULT '[]', -- Active and completed projects
    
    -- Relaciones con asistentes
    assistant_relationships jsonb DEFAULT '{}',
    
    -- Contexto global
    global_context jsonb DEFAULT '{}',
    
    -- Analytics consolidado
    analytics_data jsonb DEFAULT '{}',
    
    -- Timestamps
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    last_sync_at timestamptz DEFAULT now()
);

-- Insights específicos
user_insights (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
    assistant_id text REFERENCES assistants_catalog(id),
    
    -- Contenido del insight
    content text NOT NULL,
    category insight_category_enum NOT NULL,
    confidence numeric(3,2) DEFAULT 0.5, -- 0.0 to 1.0
    
    -- Metadatos
    source text, -- Como se descubrió
    evidence jsonb DEFAULT '{}', -- Evidencia que lo respalda
    tags text[],
    
    -- Estado
    is_actionable boolean DEFAULT false,
    action_taken text,
    status insight_status_enum DEFAULT 'discovered',
    
    -- Timestamps
    discovered_at timestamptz DEFAULT now(),
    last_validated_at timestamptz,
    expires_at timestamptz
);

-- Patrones de comportamiento detectados
behavior_patterns (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
    
    -- Descripción del patrón
    pattern_description text NOT NULL,
    pattern_type pattern_type_enum NOT NULL,
    frequency integer DEFAULT 1,
    confidence numeric(3,2) DEFAULT 0.5,
    
    -- Datos del patrón
    pattern_data jsonb DEFAULT '{}',
    triggers text[],
    outcomes text[],
    
    -- Asistentes que han observado este patrón
    observed_by text[],
    
    -- Timestamps
    first_observed_at timestamptz DEFAULT now(),
    last_observed_at timestamptz DEFAULT now(),
    
    -- Predicciones
    predicted_next_occurrence timestamptz,
    prediction_confidence numeric(3,2)
);

-- Proyectos y objetivos
user_projects (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
    
    -- Información del proyecto
    name text NOT NULL,
    description text,
    category project_category_enum,
    priority project_priority_enum DEFAULT 'medium',
    
    -- Estado
    status project_status_enum DEFAULT 'planning',
    progress_percentage integer DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    
    -- Fechas
    start_date date,
    target_date date,
    completion_date date,
    
    -- Asistentes involucrados
    assistants_involved text[],
    
    -- Objetivos y resultados
    objectives text[],
    key_results text[],
    outcomes_achieved text[],
    
    -- Métricas
    success_metrics jsonb DEFAULT '{}',
    
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);
```

#### 5. SUSCRIPCIONES Y FACTURACIÓN
```sql
-- Planes de suscripción
subscription_plans (
    id text PRIMARY KEY, -- 'starter', 'professional', 'enterprise'
    name text NOT NULL,
    description text,
    
    -- Precios
    monthly_price_usd numeric(10,2) NOT NULL,
    yearly_price_usd numeric(10,2) NOT NULL,
    yearly_discount_percentage integer DEFAULT 0,
    
    -- Límites
    max_assistants integer,
    max_monthly_messages integer,
    max_automations integer,
    max_integrations integer,
    max_storage_gb integer,
    
    -- Features
    features text[],
    limitations text[],
    
    -- AI Models allowed
    allowed_ai_models text[],
    premium_models_included boolean DEFAULT false,
    
    -- Support level
    support_level support_level_enum DEFAULT 'email',
    sla_response_time interval,
    
    -- Metadatos
    is_active boolean DEFAULT true,
    is_popular boolean DEFAULT false,
    sort_order integer DEFAULT 0,
    
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Suscripciones de usuarios
user_subscriptions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
    organization_id uuid REFERENCES organizations(id),
    plan_id text REFERENCES subscription_plans(id),
    
    -- Estado de la suscripción
    status subscription_status_enum DEFAULT 'trial',
    billing_cycle billing_cycle_enum DEFAULT 'monthly',
    
    -- Fechas
    trial_start_date date,
    trial_end_date date,
    subscription_start_date date,
    current_period_start date,
    current_period_end date,
    cancelled_at timestamptz,
    ended_at timestamptz,
    
    -- Facturación
    stripe_customer_id text,
    stripe_subscription_id text,
    payment_method_id text,
    
    -- Precios (guardamos histórico)
    monthly_amount numeric(10,2),
    yearly_amount numeric(10,2),
    currency text DEFAULT 'USD',
    
    -- Uso actual del período
    current_period_usage jsonb DEFAULT '{}',
    
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Facturas
invoices (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_subscription_id uuid REFERENCES user_subscriptions(id),
    
    -- Información de la factura
    invoice_number text UNIQUE NOT NULL,
    stripe_invoice_id text,
    
    -- Montos
    subtotal numeric(10,2) NOT NULL,
    tax_amount numeric(10,2) DEFAULT 0,
    discount_amount numeric(10,2) DEFAULT 0,
    total_amount numeric(10,2) NOT NULL,
    currency text DEFAULT 'USD',
    
    -- Estado
    status invoice_status_enum DEFAULT 'draft',
    
    -- Fechas
    issue_date date NOT NULL,
    due_date date NOT NULL,
    paid_date date,
    
    -- Detalles
    line_items jsonb NOT NULL DEFAULT '[]',
    billing_address jsonb,
    
    -- Archivos
    pdf_url text,
    
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Uso y métricas por suscripción
subscription_usage (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_subscription_id uuid REFERENCES user_subscriptions(id),
    
    -- Período de medición
    period_start date NOT NULL,
    period_end date NOT NULL,
    
    -- Métricas de uso
    messages_sent integer DEFAULT 0,
    ai_tokens_used bigint DEFAULT 0,
    storage_used_gb numeric(10,3) DEFAULT 0,
    automations_executed integer DEFAULT 0,
    
    -- Costos
    ai_model_costs numeric(10,6) DEFAULT 0,
    storage_costs numeric(10,6) DEFAULT 0,
    total_costs numeric(10,4) DEFAULT 0,
    
    -- Desglose por asistente
    usage_by_assistant jsonb DEFAULT '{}',
    
    created_at timestamptz DEFAULT now()
);
```

#### 6. AUTOMACIONES (ROADMAP FUTURO)
```sql
-- Definiciones de automatización
automation_definitions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
    assistant_id text REFERENCES assistants_catalog(id),
    
    -- Configuración
    name text NOT NULL,
    description text,
    trigger_type automation_trigger_enum NOT NULL,
    trigger_config jsonb NOT NULL DEFAULT '{}',
    
    -- Acciones
    actions jsonb NOT NULL DEFAULT '[]',
    
    -- Condiciones
    conditions jsonb DEFAULT '[]',
    
    -- Estado
    is_active boolean DEFAULT true,
    last_executed_at timestamptz,
    next_execution_at timestamptz,
    
    -- Estadísticas
    execution_count integer DEFAULT 0,
    success_count integer DEFAULT 0,
    failure_count integer DEFAULT 0,
    
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Ejecuciones de automatización
automation_executions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    automation_id uuid REFERENCES automation_definitions(id) ON DELETE CASCADE,
    
    -- Resultado
    status execution_status_enum NOT NULL,
    trigger_data jsonb,
    execution_result jsonb,
    error_message text,
    
    -- Timing
    started_at timestamptz DEFAULT now(),
    completed_at timestamptz,
    duration_ms integer,
    
    -- Costos
    ai_tokens_used integer DEFAULT 0,
    cost numeric(10,6) DEFAULT 0
);
```

#### 7. INTEGRACIONES
```sql
-- Configuraciones de integración
integrations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
    
    -- Tipo de integración
    integration_type integration_type_enum NOT NULL,
    name text NOT NULL,
    
    -- Configuración
    config jsonb NOT NULL DEFAULT '{}',
    credentials jsonb, -- Encriptado
    
    -- Estado
    is_active boolean DEFAULT true,
    status integration_status_enum DEFAULT 'pending',
    last_sync_at timestamptz,
    sync_frequency interval DEFAULT '1 hour',
    
    -- Errores
    last_error text,
    error_count integer DEFAULT 0,
    
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Log de sincronización de integraciones
integration_sync_logs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    integration_id uuid REFERENCES integrations(id) ON DELETE CASCADE,
    
    -- Resultado de la sincronización
    status sync_status_enum NOT NULL,
    records_processed integer DEFAULT 0,
    records_created integer DEFAULT 0,
    records_updated integer DEFAULT 0,
    records_failed integer DEFAULT 0,
    
    -- Detalles
    sync_details jsonb,
    error_details jsonb,
    
    -- Timing
    started_at timestamptz DEFAULT now(),
    completed_at timestamptz,
    duration_ms integer
);
```

#### 8. ADMINISTRACIÓN
```sql
-- Configuración del sistema
system_config (
    key text PRIMARY KEY,
    value jsonb NOT NULL,
    description text,
    is_public boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Logs de auditoría
audit_logs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Actor
    user_id uuid REFERENCES profiles(id),
    user_email text,
    user_ip_address inet,
    
    -- Acción
    action text NOT NULL,
    resource_type text NOT NULL,
    resource_id text,
    
    -- Detalles
    details jsonb DEFAULT '{}',
    old_values jsonb,
    new_values jsonb,
    
    -- Metadatos
    user_agent text,
    session_id text,
    
    created_at timestamptz DEFAULT now()
);

-- Métricas del sistema
system_metrics (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Timing
    recorded_at timestamptz DEFAULT now(),
    metric_date date DEFAULT CURRENT_DATE,
    
    -- Métricas de uso
    total_users integer DEFAULT 0,
    active_users_daily integer DEFAULT 0,
    active_users_weekly integer DEFAULT 0,
    active_users_monthly integer DEFAULT 0,
    
    -- Métricas de mensajes
    total_messages integer DEFAULT 0,
    messages_by_assistant jsonb DEFAULT '{}',
    
    -- Métricas de suscripciones
    total_subscriptions integer DEFAULT 0,
    subscriptions_by_plan jsonb DEFAULT '{}',
    mrr numeric(12,2) DEFAULT 0, -- Monthly Recurring Revenue
    
    -- Métricas de rendimiento
    average_response_time numeric(8,3) DEFAULT 0,
    error_rate numeric(5,4) DEFAULT 0,
    
    -- Costos
    ai_model_costs numeric(10,4) DEFAULT 0,
    infrastructure_costs numeric(10,4) DEFAULT 0,
    
    -- Metadatos
    calculated_at timestamptz DEFAULT now()
);

-- Configuración de administradores
admin_users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
    
    -- Permisos
    role admin_role_enum NOT NULL DEFAULT 'support',
    permissions text[],
    
    -- Acceso
    is_active boolean DEFAULT true,
    granted_by uuid REFERENCES profiles(id),
    granted_at timestamptz DEFAULT now(),
    last_access_at timestamptz,
    
    -- Restricciones
    ip_whitelist inet[],
    mfa_enabled boolean DEFAULT false
);
```

### ENUMS Y TIPOS PERSONALIZADOS

```sql
-- Enums para el sistema
CREATE TYPE company_size_enum AS ENUM ('startup', 'small', 'medium', 'enterprise');
CREATE TYPE growth_stage_enum AS ENUM ('idea', 'mvp', 'growth', 'scale', 'mature');
CREATE TYPE communication_style_enum AS ENUM ('direct', 'friendly', 'professional', 'casual');
CREATE TYPE focus_area_enum AS ENUM ('sales', 'marketing', 'operations', 'growth');

CREATE TYPE organization_size_enum AS ENUM ('1-10', '11-50', '51-200', '201-1000', '1000+');
CREATE TYPE organization_role_enum AS ENUM ('owner', 'admin', 'member', 'guest');

CREATE TYPE subscription_plan_enum AS ENUM ('trial', 'starter', 'professional', 'enterprise');
CREATE TYPE subscription_status_enum AS ENUM ('trial', 'active', 'past_due', 'cancelled', 'unpaid');
CREATE TYPE billing_cycle_enum AS ENUM ('monthly', 'yearly');
CREATE TYPE support_level_enum AS ENUM ('email', 'priority', 'phone', 'dedicated');

CREATE TYPE conversation_status_enum AS ENUM ('active', 'paused', 'archived', 'deleted');
CREATE TYPE message_role_enum AS ENUM ('user', 'assistant', 'system');
CREATE TYPE message_type_enum AS ENUM ('text', 'task_completion', 'file_generated', 'link_shared', 'list', 'calendar_update');
CREATE TYPE message_status_enum AS ENUM ('sending', 'delivered', 'read', 'failed');

CREATE TYPE insight_category_enum AS ENUM ('behavior', 'preference', 'business', 'performance');
CREATE TYPE insight_status_enum AS ENUM ('discovered', 'validated', 'actionable', 'implemented', 'expired');
CREATE TYPE pattern_type_enum AS ENUM ('temporal', 'behavioral', 'contextual', 'performance');

CREATE TYPE project_category_enum AS ENUM ('marketing', 'sales', 'operations', 'growth', 'product');
CREATE TYPE project_priority_enum AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE project_status_enum AS ENUM ('planning', 'active', 'paused', 'completed', 'cancelled');

CREATE TYPE invoice_status_enum AS ENUM ('draft', 'sent', 'paid', 'overdue', 'cancelled');

CREATE TYPE integration_type_enum AS ENUM ('whatsapp', 'email', 'slack', 'zapier', 'webhook');
CREATE TYPE integration_status_enum AS ENUM ('pending', 'connected', 'error', 'disconnected');
CREATE TYPE sync_status_enum AS ENUM ('success', 'partial', 'failed');

CREATE TYPE automation_trigger_enum AS ENUM ('schedule', 'event', 'condition', 'webhook');
CREATE TYPE execution_status_enum AS ENUM ('pending', 'running', 'success', 'failed', 'cancelled');

CREATE TYPE admin_role_enum AS ENUM ('super_admin', 'admin', 'support', 'analyst');
```

## 🔄 FLUJOS DE TRABAJO PRINCIPALES

### 1. FLUJO DE ONBOARDING
```
Usuario Registra → Profile Creado → Selecciona Plan → 
Configura Empresa → Activa Asistentes → Primera Conversación → 
Configuración Inicial → Onboarding Completado
```

### 2. FLUJO DE CONVERSACIÓN
```
Usuario Envía Mensaje → Validación → Procesar con IA → 
Actualizar Memoria → Generar Respuesta → Guardar en DB → 
Actualizar Métricas → Enviar Respuesta → Triggers/Insights
```

### 3. FLUJO DE FACTURACIÓN
```
Inicio de Período → Calcular Uso → Generar Factura → 
Procesar Pago → Actualizar Suscripción → Enviar Recibo → 
Renovar o Cancelar
```

### 4. FLUJO DE CEREBRO AI
```
Acción del Usuario → Extraer Insights → Detectar Patrones → 
Actualizar Perfil → Sincronizar entre Asistentes → 
Generar Recomendaciones → Actualizar Analytics
```

## 📁 ESTRUCTURA COMPLETA DEL PROYECTO

```
sintra-latam/
├── 📱 FRONTEND
│   ├── src/
│   │   ├── app/                    # Next.js App Router
│   │   │   ├── (auth)/            # Rutas de autenticación
│   │   │   ├── dashboard/         # Dashboard principal
│   │   │   ├── admin/             # Panel de administración
│   │   │   └── api/               # API routes
│   │   ├── components/            # Componentes reutilizables
│   │   │   ├── ui/               # Shadcn/UI components
│   │   │   ├── forms/            # Formularios
│   │   │   ├── dashboard/        # Componentes del dashboard
│   │   │   └── admin/            # Componentes de admin
│   │   ├── lib/                  # Utilidades y configuración
│   │   │   ├── supabase/         # Cliente de Supabase
│   │   │   ├── ai/               # Servicios de IA
│   │   │   ├── integrations/     # Integraciones externas
│   │   │   └── utils/            # Utilidades generales
│   │   ├── hooks/                # Custom React hooks
│   │   ├── store/                # Estado global (Zustand)
│   │   ├── types/                # Definiciones de TypeScript
│   │   └── styles/               # Estilos globales
│   └── public/                   # Archivos estáticos
│
├── 🗄️ DATABASE
│   ├── supabase/
│   │   ├── migrations/           # Migraciones de DB
│   │   ├── functions/            # Edge Functions
│   │   ├── storage/              # Configuración de Storage
│   │   └── seed/                 # Datos de prueba
│
├── 🔧 INFRASTRUCTURE
│   ├── docker/                   # Configuración Docker
│   ├── scripts/                  # Scripts de deployment
│   ├── monitoring/               # Monitoreo y alertas
│   └── backup/                   # Scripts de respaldo
│
├── 📚 DOCUMENTATION
│   ├── api/                      # Documentación de API
│   ├── database/                 # Esquemas y diagramas
│   ├── deployment/               # Guías de deployment
│   └── user/                     # Documentación de usuario
│
└── 🧪 TESTING
    ├── e2e/                      # Tests end-to-end
    ├── integration/              # Tests de integración
    ├── unit/                     # Tests unitarios
    └── load/                     # Tests de carga
```

## 🚀 PRÓXIMOS PASOS

1. **Implementar migraciones de Supabase**
2. **Configurar Row Level Security (RLS)**
3. **Crear Edge Functions para IA**
4. **Implementar sistema de facturación**
5. **Configurar monitoreo y alertas**
6. **Implementar integraciones externas**
7. **Crear panel de administración**
8. **Sistema de automatizaciones**
