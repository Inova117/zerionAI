-- =====================================================
-- SINTRA AI LATAM - SAFE SEED DATA
-- =====================================================
-- Este archivo es seguro para ejecutar múltiples veces
-- Usa ON CONFLICT para evitar errores de duplicados

BEGIN;

-- Limpiar datos existentes (opcional, comentar si no quieres limpiar)
-- TRUNCATE subscription_plans, assistants_catalog, system_config, organizations CASCADE;

-- =====================================================
-- PLANES DE SUSCRIPCIÓN
-- =====================================================
INSERT INTO subscription_plans (
    id, name, description, 
    monthly_price_usd, yearly_price_usd, yearly_discount_percentage,
    max_assistants, max_monthly_messages, max_automations, max_integrations, max_storage_gb,
    features, limitations, allowed_ai_models, premium_models_included,
    support_level, sla_response_time, is_active, is_popular, sort_order
) VALUES 
(
    'starter',
    'Starter',
    'Perfecto para emprendedores individuales',
    29.00, 290.00, 17,
    3, 1000, 5, 1, 1,
    ARRAY['3 Asistentes IA especializados', '1,000 mensajes por mes', 'Automatizaciones básicas', 'Soporte por email', 'Dashboard básico'],
    ARRAY['Sin integración WhatsApp', 'Sin análisis avanzado', 'Sin API access'],
    ARRAY['gpt-3.5-turbo', 'llama-2-7b'],
    false,
    'email', '24 hours',
    true, false, 1
),
(
    'professional',
    'Professional', 
    'Ideal para pequeñas y medianas empresas',
    79.00, 790.00, 17,
    6, 10000, 20, 5, 10,
    ARRAY['6 Asistentes IA especializados', '10,000 mensajes por mes', 'Automatizaciones avanzadas', 'Integración WhatsApp', 'Analytics completo', 'Soporte prioritario', 'Cerebro AI avanzado', 'Exportación de datos'],
    ARRAY['Sin modelos premium (GPT-4)', 'Sin white-label'],
    ARRAY['gpt-3.5-turbo', 'gpt-4', 'llama-2-70b', 'claude-3-haiku'],
    false,
    'priority', '12 hours',
    true, true, 2
),
(
    'enterprise',
    'Enterprise',
    'Para empresas grandes con necesidades específicas',
    199.00, 1990.00, 17,
    12, -1, -1, -1, 100,
    ARRAY['12 Asistentes IA especializados', 'Mensajes ilimitados', 'Modelos premium (GPT-4, Claude)', 'Integraciones personalizadas', 'API completa', 'White-label disponible', 'Soporte dedicado 24/7', 'Configuración empresarial', 'SLA garantizado'],
    ARRAY[]::text[],
    ARRAY['gpt-3.5-turbo', 'gpt-4', 'gpt-4-turbo', 'claude-3-opus', 'claude-3-sonnet', 'llama-2-70b'],
    true,
    'dedicated', '2 hours',
    true, false, 3
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    monthly_price_usd = EXCLUDED.monthly_price_usd,
    yearly_price_usd = EXCLUDED.yearly_price_usd,
    updated_at = NOW();

-- =====================================================
-- ASISTENTES PRINCIPALES (Solo los 3 del MVP)
-- =====================================================
INSERT INTO assistants_catalog (
    id, name, role, description, avatar, color,
    specialties, primary_skills, secondary_skills, tools, methodologies,
    system_prompt, personality, response_patterns,
    version, is_active, required_plan, is_premium
) VALUES 
(
    'sofia',
    'Sofía',
    'Social Media Specialist',
    'Experta en redes sociales que crea contenido viral, gestiona comunidades y optimiza tu presencia digital para maximizar engagement y conversiones.',
    '📱',
    'bg-pink-500',
    ARRAY['Instagram', 'TikTok', 'Facebook', 'Contenido viral'],
    ARRAY['Social Media Strategy', 'Content Creation', 'Community Management', 'Influencer Outreach'],
    ARRAY['Paid Social', 'Social Analytics', 'Trend Analysis', 'Brand Building'],
    ARRAY['Meta Business', 'Hootsuite', 'Canva', 'Later', 'Sprout Social', 'TikTok Ads'],
    ARRAY['Content Pillars', 'Social Media Funnel', 'Engagement Strategy', 'Hashtag Research'],
    'Eres Sofía, especialista en redes sociales con 8 años de experiencia. Personalidad: Creativa, entusiasta, trends-aware, orientada a resultados. Expertise: Instagram, TikTok, Facebook, YouTube, contenido viral, hashtag strategy, influencer outreach.',
    '{"tone": "entusiasta_creativa", "energy": "alta", "formality": "casual", "emojiUsage": "alto"}',
    '{"problemSolving": "Analizo audiencia → Creo contenido → Publico estratégicamente → Optimizo engagement", "taskCompletion": "Entiendo objetivos → Planifico contenido → Ejecuto publicaciones → Mido resultados"}',
    '1.0', true, 'starter', false
),
(
    'carlos',
    'Carlos',
    'Customer Support Manager',
    'Especialista en atención al cliente que optimiza tus procesos de soporte, automatiza respuestas y mejora la satisfacción del cliente 24/7.',
    '💬',
    'bg-blue-500',
    ARRAY['Atención al cliente', 'WhatsApp Business', 'Automatización', 'Resolución de problemas'],
    ARRAY['Customer Support', 'Help Desk Management', 'Live Chat', 'Ticket Resolution'],
    ARRAY['WhatsApp Automation', 'Chatbot Development', 'Customer Journey', 'Escalation Management'],
    ARRAY['WhatsApp Business', 'Zendesk', 'Intercom', 'Freshdesk', 'Slack', 'Zapier'],
    ARRAY['Support Workflow', 'SLA Management', 'Customer Success', 'Issue Tracking'],
    'Eres Carlos, especialista en atención al cliente con 7 años de experiencia. Personalidad: Empático, solucionador, paciente y orientado al servicio. Expertise: WhatsApp Business, automatización de soporte, gestión de tickets.',
    '{"tone": "empático_profesional", "energy": "media", "formality": "profesional", "emojiUsage": "moderado"}',
    '{"problemSolving": "Escucho problema → Analizo contexto → Ofrezco solución → Confirmo satisfacción", "taskCompletion": "Recibo consulta → Clasifico urgencia → Resuelvo o escalo → Documento aprendizaje"}',
    '1.0', true, 'starter', false
),
(
    'paula',
    'Paula',
    'Copywriter & Content Creator',
    'Copywriter experta que convierte palabras en ventas. Crea copy persuasivo, emails que convierten y contenido que conecta con tu audiencia.',
    '✍️',
    'bg-purple-500',
    ARRAY['Copywriting', 'Email marketing', 'Sales copy', 'Content strategy'],
    ARRAY['Copywriting', 'Email Marketing', 'Sales Funnel', 'Content Strategy'],
    ARRAY['Direct Response', 'Conversion Optimization', 'A/B Testing', 'Brand Voice'],
    ARRAY['Mailchimp', 'ConvertKit', 'Klaviyo', 'Google Docs', 'Grammarly', 'Hemingway'],
    ARRAY['AIDA Framework', 'PAS Formula', 'Storytelling', 'Customer Journey'],
    'Eres Paula, copywriter con 6 años de experiencia. Personalidad: Persuasiva, estratégica, orientada a conversiones y storyteller natural. Expertise: Email marketing, sales copy, funnels de conversión.',
    '{"tone": "persuasiva_estratégica", "energy": "media", "formality": "profesional", "emojiUsage": "bajo"}',
    '{"problemSolving": "Entiendo audiencia → Defino mensaje → Estructuro copy → Optimizo conversión", "taskCompletion": "Briefing → Research → Copy draft → Testing → Optimización"}',
    '1.0', true, 'starter', false
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    description = EXCLUDED.description,
    version = EXCLUDED.version,
    updated_at = NOW();

-- =====================================================
-- CONFIGURACIÓN DEL SISTEMA
-- =====================================================
INSERT INTO system_config (key, value, description, is_public) VALUES
('app_version', '"1.0.0"', 'Current application version', true),
('maintenance_mode', 'false', 'Whether the app is in maintenance mode', false),
('max_file_size_mb', '10', 'Maximum file upload size in MB', false),
('ai_model_default', '"gpt-3.5-turbo"', 'Default AI model for responses', false),
('ai_model_premium', '"gpt-4"', 'Premium AI model for paid users', false),
('trial_duration_days', '14', 'Trial period duration in days', false),
('max_messages_trial', '100', 'Maximum messages during trial', false),
('company_name', '"Sintra AI LATAM"', 'Company name', true),
('company_website', '"https://sintra-latam.com"', 'Company website', true),
('support_email', '"soporte@sintra-latam.com"', 'Support email address', true)
ON CONFLICT (key) DO UPDATE SET
    value = EXCLUDED.value,
    updated_at = NOW();

-- =====================================================
-- ORGANIZACIONES DE EJEMPLO
-- =====================================================
INSERT INTO organizations (id, name, slug, description, industry, size, billing_email, is_active) VALUES
('cafe-luna-org', 'Café Luna CDMX', 'cafe-luna-cdmx', 'Cafetería artesanal en el corazón de la Ciudad de México', 'Gastronomía', '1-10', 'admin@cafeluna.mx', true),
('techstart-org', 'TechStart Solutions', 'techstart-solutions', 'Consultora de tecnología para startups', 'Tecnología', '11-50', 'billing@techstart.com', true),
('verde-marketing-org', 'Verde Marketing', 'verde-marketing', 'Agencia de marketing digital sustentable', 'Marketing', '11-50', 'facturacion@verdemarketing.com', true)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    updated_at = NOW();

COMMIT;

-- =====================================================
-- VERIFICACIÓN DE DATOS
-- =====================================================
SELECT 'Seed data loaded successfully!' as status;
SELECT COUNT(*) as plans_count FROM subscription_plans;
SELECT COUNT(*) as assistants_count FROM assistants_catalog WHERE is_active = true;
SELECT COUNT(*) as config_count FROM system_config;
SELECT COUNT(*) as orgs_count FROM organizations WHERE is_active = true;
