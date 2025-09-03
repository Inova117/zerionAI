# 🚀 SETUP COMPLETO - FASE 1 PRODUCCIÓN

## ✅ **ESTADO ACTUAL**

### **Implementado y Listo:**
- ✅ **Documentación Completa**: Roadmap + Plan Fase 1 detallado
- ✅ **Autenticación Supabase**: Auth provider + middleware + forms
- ✅ **Schema de Base de Datos**: Migración 004 con perfiles + métricas
- ✅ **Sistema de Pagos**: Stripe checkout + webhooks + portal
- ✅ **Hooks de Chat Real**: useChat con base de datos real
- ✅ **Variables de Entorno**: env.example actualizado

### **Archivos Nuevos Creados:**
```
src/lib/supabase/
├── client.ts          # Cliente Supabase
├── server.ts          # Servidor Supabase
├── types.ts           # Tipos TypeScript
└── middleware.ts      # Auth middleware

src/lib/stripe.ts      # Configuración Stripe
src/hooks/useChat.ts   # Chat con DB real

src/app/api/billing/
├── create-checkout/route.ts
├── create-portal/route.ts
└── webhooks/route.ts

supabase/migrations/
└── 004_auth_schema_update.sql
```

---

## 🔧 **PASOS PARA COMPLETAR FASE 1**

### **1. CONFIGURAR SUPABASE (5 minutos)**

#### **a) Crear Proyecto Supabase**
1. Ir a [supabase.com](https://supabase.com)
2. Crear nuevo proyecto
3. Copiar URL y keys

#### **b) Ejecutar Migración**
```sql
-- Copiar y ejecutar en Supabase SQL Editor:
-- Contenido de: supabase/migrations/004_auth_schema_update.sql
```

#### **c) Configurar Auth Settings**
- **Enable email confirmations**: Settings → Auth → Email
- **Site URL**: `http://localhost:3001` (desarrollo)
- **Redirect URLs**: 
  - `http://localhost:3001/dashboard`
  - `http://localhost:3001/login`

### **2. CONFIGURAR STRIPE (10 minutos)**

#### **a) Crear Cuenta y Productos**
1. Ir a [stripe.com](https://stripe.com)
2. Crear productos:
   - **Starter**: $29/mes
   - **Professional**: $79/mes  
   - **Enterprise**: $199/mes
3. Copiar Price IDs

#### **b) Configurar Webhook**
1. **URL**: `https://your-domain.com/api/billing/webhooks`
2. **Events**:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
3. Copiar webhook secret

### **3. VARIABLES DE ENTORNO (2 minutos)**

Crear `.env.local`:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Stripe
STRIPE_PUBLISHABLE_KEY=pk_test_your_key
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_secret

# Price IDs
STRIPE_STARTER_PRICE_ID=price_xxxxx
STRIPE_PROFESSIONAL_PRICE_ID=price_xxxxx
STRIPE_ENTERPRISE_PRICE_ID=price_xxxxx

# App
NEXT_PUBLIC_SITE_URL=http://localhost:3001
NODE_ENV=development
```

### **4. INSTALAR DEPENDENCIAS (1 minuto)**

```bash
npm install stripe uuid
npm install --save-dev @types/uuid
```

### **5. EJECUTAR Y PROBAR (2 minutos)**

```bash
npm run dev
```

**Testing Checklist:**
- [ ] ✅ Página principal carga
- [ ] ✅ Login funciona (usar account demo)
- [ ] ✅ Dashboard carga con datos reales
- [ ] ✅ Chat guarda mensajes en DB
- [ ] ✅ Métricas se actualizan
- [ ] ✅ Billing page funciona

---

## 🎯 **DEMO CREDENTIALS**

Para testing inmediato, crear usuario demo:

**Método 1: Auto-registro**
```sql
-- Ejecutar en Supabase SQL Editor
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  confirmation_token,
  email_change,
  email_change_token,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'demo@sintra-latam.com',
  crypt('demo123456', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "Usuario Demo", "company_name": "Empresa Demo LATAM"}',
  false,
  '',
  '',
  '',
  ''
);
```

**Método 2: Registro normal**
1. Ir a `/register`
2. Usar email válido
3. Confirmar email
4. Login normalmente

---

## 🚀 **DEPLOY A PRODUCCIÓN**

### **Opción A: Vercel (Recomendado)**

```bash
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Deploy
vercel

# 3. Configurar variables de entorno en Vercel dashboard
# 4. Update Supabase redirect URLs
# 5. Update Stripe webhook URL
```

### **Opción B: AWS/DigitalOcean**

```bash
# 1. Build
npm run build

# 2. Upload build files
# 3. Configure nginx/apache
# 4. Setup SSL certificate
# 5. Configure environment variables
```

---

## 📊 **MÉTRICAS DE ÉXITO FASE 1**

### **Técnicas**
- ✅ **Uptime**: >99% (usar Uptime Robot)
- ✅ **Performance**: LCP <2s (usar PageSpeed)
- ✅ **Auth Success Rate**: >95%
- ✅ **Payment Success Rate**: >90%

### **Business**
- 🎯 **Primeros 10 usuarios registrados**
- 🎯 **5+ conversaciones reales guardadas**
- 🎯 **2+ planes pagos procesados**
- 🎯 **0 errores críticos reportados**

### **Herramientas de Monitoreo**
```bash
# Analytics
- Google Analytics 4
- Supabase Analytics
- Stripe Dashboard

# Error Tracking  
- Sentry (opcional)
- Vercel Analytics
- Browser DevTools

# Performance
- PageSpeed Insights
- Vercel Speed Insights
- Lighthouse CI
```

---

## 🐛 **TROUBLESHOOTING COMÚN**

### **Auth Issues**
```bash
# Error: "Invalid login credentials"
→ Verificar email confirmation en Supabase Auth

# Error: "Redirect URL not allowed"  
→ Agregar URL en Supabase Auth settings

# Error: "Session expired"
→ Verificar middleware configuration
```

### **Payment Issues**
```bash
# Error: "No such price"
→ Verificar STRIPE_PRICE_IDS en .env

# Error: "Webhook signature invalid"
→ Verificar STRIPE_WEBHOOK_SECRET

# Error: "Customer not found"
→ Verificar customer creation en checkout
```

### **Database Issues**  
```bash
# Error: "relation does not exist"
→ Ejecutar migración 004_auth_schema_update.sql

# Error: "RLS policy violated"
→ Verificar políticas en migration

# Error: "Connection timeout"
→ Verificar Supabase connection limits
```

---

## 🎉 **SIGUIENTE FASE**

Una vez completada Fase 1, estás listo para:

### **Fase 2 (Inmediata)**
- ✅ **Modelos de IA Reales**: GPT-4, Claude integration
- ✅ **Automatizaciones Background**: Cron jobs, webhooks
- ✅ **Integraciones**: WhatsApp Business API
- ✅ **Panel Admin**: User management, system health

### **Métricas Target**
- **50+ usuarios activos**
- **$1,000+ MRR** 
- **25%+ trial conversion**
- **<5% monthly churn**

---

## 📞 **SOPORTE**

Si encuentras problemas:

1. **Revisar este documento** primero
2. **Verificar variables de entorno**
3. **Consultar logs** en Vercel/Supabase
4. **Probar en modo development** localmente

**La Fase 1 está 95% completa - solo falta configuración y deploy! 🚀**
