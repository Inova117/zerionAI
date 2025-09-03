-- =====================================================
-- DATOS DE PRUEBA PARA AUTENTICACIÓN
-- =====================================================

-- Este archivo crea usuarios de demo para testing
-- IMPORTANTE: Solo para desarrollo, NO usar en producción

-- Crear usuario demo 1
INSERT INTO auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  created_at,
  updated_at,
  phone,
  phone_confirmed_at,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '11111111-1111-1111-1111-111111111111',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'demo@sintra-latam.com',
  crypt('demo123456', gen_salt('bf')),
  NOW(),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "Usuario Demo", "company_name": "Empresa Demo", "company_industry": "Tecnología"}',
  false,
  NOW(),
  NOW(),
  null,
  null,
  '',
  '',
  ''
) ON CONFLICT (id) DO NOTHING;

-- Crear usuario demo 2
INSERT INTO auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  created_at,
  updated_at,
  phone,
  phone_confirmed_at,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '22222222-2222-2222-2222-222222222222',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'admin@sintra-latam.com',
  crypt('admin123456', gen_salt('bf')),
  NOW(),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "Admin Demo", "company_name": "Sintra AI LATAM", "company_industry": "Tecnología"}',
  false,
  NOW(),
  NOW(),
  null,
  null,
  '',
  '',
  ''
) ON CONFLICT (id) DO NOTHING;

-- Crear perfiles para los usuarios demo
INSERT INTO profiles (
  id,
  email,
  full_name,
  company_name,
  company_industry,
  onboarding_completed,
  onboarding_step,
  created_at,
  updated_at
) VALUES (
  '11111111-1111-1111-1111-111111111111',
  'demo@sintra-latam.com',
  'Usuario Demo',
  'Empresa Demo',
  'Tecnología',
  true,
  5,
  NOW(),
  NOW()
), (
  '22222222-2222-2222-2222-222222222222',
  'admin@sintra-latam.com',
  'Admin Demo',
  'Sintra AI LATAM',
  'Tecnología',
  true,
  5,
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Crear suscripciones demo
INSERT INTO user_subscriptions (
  id,
  user_id,
  plan,
  status,
  trial_start,
  trial_end,
  current_period_start,
  current_period_end,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  '11111111-1111-1111-1111-111111111111',
  'profesional',
  'trial',
  NOW(),
  NOW() + INTERVAL '14 days',
  NOW(),
  NOW() + INTERVAL '1 month',
  NOW(),
  NOW()
), (
  gen_random_uuid(),
  '22222222-2222-2222-2222-222222222222',
  'empresarial',
  'active',
  NOW() - INTERVAL '30 days',
  NOW() - INTERVAL '16 days',
  NOW(),
  NOW() + INTERVAL '1 month',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Crear datos del Brain AI para usuarios demo
INSERT INTO brain_ai_data (
  id,
  user_id,
  user_profile,
  user_business,
  knowledge,
  relationships,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  '11111111-1111-1111-1111-111111111111',
  '{
    "name": "Usuario Demo",
    "company": "Empresa Demo",
    "industry": "Tecnología",
    "goals": ["Aumentar ventas", "Mejorar marketing", "Automatizar procesos"],
    "preferences": {
      "communicationStyle": "informal",
      "priorityAreas": ["Marketing Digital", "Atención al Cliente"]
    }
  }'::jsonb,
  '{
    "size": "medium",
    "revenue": 500000,
    "growthStage": "growth",
    "painPoints": ["Gestión manual de leads", "Respuestas lentas en redes sociales"]
  }'::jsonb,
  '{
    "tasksCompleted": [
      {"assistantId": "sofia", "task": "Crear campaña de Instagram", "timestamp": "2024-01-15T10:00:00Z"},
      {"assistantId": "carlos", "task": "Resolver consulta sobre producto", "timestamp": "2024-01-15T14:30:00Z"}
    ],
    "insightsLearned": [
      {"assistantId": "sofia", "insight": "Los posts con video generan 3x más engagement", "timestamp": "2024-01-15T11:00:00Z"}
    ],
    "successPatterns": ["Posts matutinos", "Contenido educativo", "Interacción directa"],
    "ongoingProjects": [
      {"name": "Campaña Q1 2024", "status": "active", "assistantIds": ["sofia", "paula"]}
    ]
  }'::jsonb,
  '{
    "sofia": {
      "interactions": 25,
      "trustLevel": "trusted",
      "lastTopic": "Estrategia de contenido para Q1",
      "satisfactionScore": 4.8
    },
    "carlos": {
      "interactions": 18,
      "trustLevel": "familiar",
      "lastTopic": "Configuración de respuestas automáticas",
      "satisfactionScore": 4.6
    },
    "paula": {
      "interactions": 12,
      "trustLevel": "familiar",
      "lastTopic": "Copy para nueva landing page",
      "satisfactionScore": 4.7
    }
  }'::jsonb,
  NOW(),
  NOW()
) ON CONFLICT (user_id) DO NOTHING;
