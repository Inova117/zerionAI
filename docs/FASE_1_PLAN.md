# 🚀 FASE 1: PLAN DE IMPLEMENTACIÓN DETALLADO
*De Simulación a Producción en 2-4 Semanas*

## 🎯 **OBJETIVO FASE 1**

**Transformar el MVP simulado actual en una aplicación completamente funcional con:**
- ✅ Autenticación real de usuarios
- ✅ Base de datos persistente
- ✅ Sistema de pagos básico
- ✅ Deploy en producción

**Success Criteria**: Aplicación funcional con primeros 10 usuarios pagos.

---

## 📋 **SPRINT BREAKDOWN**

### **SPRINT 1: AUTENTICACIÓN REAL (4-5 días)**

#### **🔐 Task 1.1: Setup Supabase Auth (Día 1)**
- [x] Configurar proyecto Supabase
- [ ] Configurar Auth settings (email confirmation, etc.)
- [ ] Setup Row Level Security básica
- [ ] Configurar OAuth providers (Google)
- [ ] Variables de entorno production

#### **🔧 Task 1.2: Auth Components (Día 2-3)**
- [ ] Refactor auth-provider.tsx para Supabase real
- [ ] Implementar login-form.tsx funcional
- [ ] Implementar register-form.tsx funcional
- [ ] Crear forgot-password-form.tsx
- [ ] Hook useAuth.ts con Supabase

#### **🛡️ Task 1.3: Route Protection (Día 3-4)**
- [ ] Middleware.ts para protección de rutas
- [ ] Loading states durante auth check
- [ ] Redirects automáticos
- [ ] Session persistence

#### **🎨 Task 1.4: Onboarding Flow (Día 4-5)**
- [ ] Wizard de 3 pasos post-registro
- [ ] Recolección de datos empresa
- [ ] Selección de plan inicial
- [ ] Welcome experience

**Deliverable**: Sistema de autenticación completamente funcional

---

### **SPRINT 2: BASE DE DATOS REAL (3-4 días)**

#### **📊 Task 2.1: Database Schema (Día 1)**
- [ ] Ejecutar migraciones Supabase existentes
- [ ] Validar schema completo
- [ ] Configurar RLS policies
- [ ] Setup indexes optimizados

#### **🔄 Task 2.2: Supabase Integration (Día 2)**
- [ ] Refactor supabase clients (browser/server)
- [ ] Real-time subscriptions setup
- [ ] Error handling y retry logic
- [ ] Connection pooling

#### **💾 Task 2.3: Data Persistence (Día 2-3)**
- [ ] CRUD conversations reales
- [ ] Persistencia de messages
- [ ] User profiles management
- [ ] Métricas reales en DB

#### **⚡ Task 2.4: Real-time Features (Día 3-4)**
- [ ] Chat real-time updates
- [ ] Live metrics updates
- [ ] Notification system
- [ ] Background sync

**Deliverable**: Frontend conectado a base de datos real

---

### **SPRINT 3: SISTEMA DE PAGOS (3-4 días)**

#### **💳 Task 3.1: Stripe Setup (Día 1)**
- [ ] Configurar cuenta Stripe
- [ ] Crear productos y precios
- [ ] Setup webhooks endpoint
- [ ] Variables de entorno

#### **🛒 Task 3.2: Checkout Flow (Día 2)**
- [ ] Billing page funcional
- [ ] Stripe Checkout integration
- [ ] Success/cancel pages
- [ ] Loading states

#### **🔔 Task 3.3: Webhook Handling (Día 2-3)**
- [ ] Procesar subscription.created
- [ ] Procesar payment.succeeded
- [ ] Procesar subscription.cancelled
- [ ] Error handling

#### **📊 Task 3.4: Subscription Management (Día 3-4)**
- [ ] Customer portal integration
- [ ] Plan upgrades/downgrades
- [ ] Trial period logic
- [ ] Usage tracking

**Deliverable**: Sistema de pagos funcional con Stripe

---

### **SPRINT 4: DEPLOY PRODUCCIÓN (2-3 días)**

#### **🌐 Task 4.1: Environment Setup (Día 1)**
- [ ] Configurar Vercel proyecto
- [ ] Variables de entorno producción
- [ ] Domain setup (sintra-latam.com)
- [ ] SSL certificates

#### **🔄 Task 4.2: CI/CD Pipeline (Día 1-2)**
- [ ] GitHub Actions workflow
- [ ] Automated testing
- [ ] Deploy automático
- [ ] Rollback strategy

#### **📈 Task 4.3: Monitoring (Día 2)**
- [ ] Error tracking (Sentry)
- [ ] Performance monitoring
- [ ] Uptime monitoring
- [ ] Analytics setup

#### **🛡️ Task 4.4: Security & Compliance (Día 2-3)**
- [ ] Security headers
- [ ] Rate limiting
- [ ] GDPR compliance basics
- [ ] Backup strategy

**Deliverable**: Aplicación live en producción

---

## 🛠️ **IMPLEMENTACIÓN DETALLADA**

### **🔐 1. AUTENTICACIÓN REAL**

#### **Supabase Auth Configuration**
```sql
-- Enable email confirmations
ALTER TABLE auth.users 
ENABLE ROW LEVEL SECURITY;

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT,
  company_name TEXT,
  industry TEXT,
  employee_count INTEGER,
  plan_type TEXT DEFAULT 'trial',
  trial_ends_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);
```

#### **Auth Provider Implementation**
```typescript
// src/components/auth/auth-provider.tsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase-client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: any) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  const signUp = async (email: string, password: string, userData: any) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      },
    });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signIn,
        signUp,
        signOut,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

#### **Route Protection Middleware**
```typescript
// src/middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Protect dashboard routes
  if (req.nextUrl.pathname.startsWith('/dashboard')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  // Redirect authenticated users away from auth pages
  if (req.nextUrl.pathname.startsWith('/login') || 
      req.nextUrl.pathname.startsWith('/register')) {
    if (session) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  }

  return res;
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register'],
};
```

---

### **📊 2. BASE DE DATOS REAL**

#### **Enhanced Database Schema**
```sql
-- Conversations table
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  assistant_id TEXT NOT NULL,
  title TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages table
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'task', 'file', 'link')),
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User metrics table
CREATE TABLE user_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  conversations_count INTEGER DEFAULT 0,
  tasks_completed INTEGER DEFAULT 0,
  time_saved_hours INTEGER DEFAULT 0,
  automation_triggers INTEGER DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Automations table
CREATE TABLE automations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  trigger_type TEXT NOT NULL,
  trigger_config JSONB,
  action_type TEXT NOT NULL,
  action_config JSONB,
  is_active BOOLEAN DEFAULT true,
  runs_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies for all tables
CREATE POLICY "Users own their conversations" ON conversations
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users own their messages" ON messages
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM conversations 
      WHERE conversations.id = messages.conversation_id 
      AND conversations.user_id = auth.uid()
    )
  );

CREATE POLICY "Users own their metrics" ON user_metrics
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users own their automations" ON automations
  FOR ALL USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX idx_conversations_user_id ON conversations(user_id);
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_user_metrics_user_id ON user_metrics(user_id);
CREATE INDEX idx_automations_user_id ON automations(user_id);
```

#### **Real-time Chat Implementation**
```typescript
// src/hooks/useChat.ts
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase-client';
import { useAuth } from '@/components/auth/auth-provider';

export function useChat(conversationId: string) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Load existing messages
  useEffect(() => {
    if (!conversationId || !user) return;

    const loadMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error loading messages:', error);
        return;
      }

      setMessages(data || []);
      setLoading(false);
    };

    loadMessages();
  }, [conversationId, user]);

  // Real-time subscription
  useEffect(() => {
    if (!conversationId) return;

    const subscription = supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          setMessages((current) => [...current, payload.new]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [conversationId]);

  const sendMessage = useCallback(async (content: string) => {
    if (!conversationId || !user) return;

    // Add user message
    const userMessage = {
      conversation_id: conversationId,
      role: 'user',
      content,
      message_type: 'text',
    };

    const { error } = await supabase
      .from('messages')
      .insert([userMessage]);

    if (error) {
      console.error('Error sending message:', error);
      return;
    }

    // Simulate AI response (replace with real AI later)
    setTimeout(async () => {
      const aiResponse = {
        conversation_id: conversationId,
        role: 'assistant',
        content: `Respuesta automática a: "${content}"`,
        message_type: 'text',
      };

      await supabase
        .from('messages')
        .insert([aiResponse]);
    }, 1000);
  }, [conversationId, user]);

  return {
    messages,
    loading,
    sendMessage,
  };
}
```

---

### **💳 3. SISTEMA DE PAGOS**

#### **Stripe Configuration**
```typescript
// src/lib/stripe.ts
import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export const STRIPE_PRICES = {
  starter: process.env.STRIPE_STARTER_PRICE_ID!,
  professional: process.env.STRIPE_PROFESSIONAL_PRICE_ID!,
  enterprise: process.env.STRIPE_ENTERPRISE_PRICE_ID!,
};

export const PLANS = {
  starter: {
    name: 'Starter',
    price: 29,
    features: [
      '3 asistentes especializados',
      '1,000 mensajes/mes',
      'Automatizaciones básicas',
      'Soporte por email',
    ],
  },
  professional: {
    name: 'Professional',
    price: 79,
    features: [
      '6 asistentes especializados',
      '10,000 mensajes/mes',
      'Automatizaciones avanzadas',
      'Integración WhatsApp',
      'Soporte prioritario',
    ],
  },
  enterprise: {
    name: 'Enterprise',
    price: 199,
    features: [
      '12 asistentes especializados',
      'Mensajes ilimitados',
      'Automatizaciones personalizadas',
      'Todas las integraciones',
      'Manager dedicado',
      'API access',
    ],
  },
};
```

#### **Checkout Implementation**
```typescript
// src/app/api/billing/create-checkout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { stripe, STRIPE_PRICES } from '@/lib/stripe';
import { createServerClient } from '@/lib/supabase-server';

export async function POST(req: NextRequest) {
  try {
    const { plan } = await req.json();
    const supabase = createServerClient();

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer_email: user.email,
      client_reference_id: user.id,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: STRIPE_PRICES[plan as keyof typeof STRIPE_PRICES],
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/billing?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/billing?canceled=true`,
      subscription_data: {
        trial_period_days: 14,
        metadata: {
          user_id: user.id,
          plan,
        },
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

#### **Webhook Handler**
```typescript
// src/app/api/billing/webhooks/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabase } from '@/lib/supabase-client';
import Stripe from 'stripe';

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription);
        break;
      
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;
      
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  const userId = subscription.metadata.user_id;
  const plan = subscription.metadata.plan;

  await supabase
    .from('profiles')
    .update({
      plan_type: plan,
      stripe_customer_id: subscription.customer as string,
      stripe_subscription_id: subscription.id,
      trial_ends_at: subscription.trial_end 
        ? new Date(subscription.trial_end * 1000).toISOString()
        : null,
    })
    .eq('id', userId);
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  // Update subscription status, send receipt email, etc.
  console.log('Payment succeeded:', invoice.id);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const userId = subscription.metadata.user_id;

  await supabase
    .from('profiles')
    .update({
      plan_type: 'free',
      stripe_subscription_id: null,
    })
    .eq('id', userId);
}
```

---

### **🌐 4. DEPLOY PRODUCCIÓN**

#### **GitHub Actions Workflow**
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run build
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

#### **Environment Variables**
```bash
# .env.production
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

STRIPE_STARTER_PRICE_ID=price_...
STRIPE_PROFESSIONAL_PRICE_ID=price_...
STRIPE_ENTERPRISE_PRICE_ID=price_...

NEXT_PUBLIC_SITE_URL=https://sintra-latam.com

SENTRY_DSN=https://your-sentry-dsn
```

---

## 📊 **TESTING STRATEGY**

### **🧪 Automated Testing**
```typescript
// tests/auth.test.ts
import { expect, test } from '@playwright/test';

test.describe('Authentication', () => {
  test('should login successfully', async ({ page }) => {
    await page.goto('/login');
    
    await page.fill('[data-testid=email]', 'test@example.com');
    await page.fill('[data-testid=password]', 'password123');
    await page.click('[data-testid=login-button]');
    
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('h1')).toContainText('Bienvenido');
  });

  test('should register new user', async ({ page }) => {
    await page.goto('/register');
    
    await page.fill('[data-testid=email]', 'newuser@example.com');
    await page.fill('[data-testid=password]', 'password123');
    await page.fill('[data-testid=company]', 'Test Company');
    await page.click('[data-testid=register-button]');
    
    await expect(page).toHaveURL('/dashboard/onboarding');
  });
});
```

### **📋 Manual Testing Checklist**
- [ ] **Auth Flow**: Login, register, logout, password reset
- [ ] **Chat System**: Send message, receive response, real-time updates
- [ ] **Database**: Data persistence, real-time sync
- [ ] **Payments**: Checkout flow, webhook processing
- [ ] **Mobile**: Responsive design, touch interactions

---

## ⚠️ **RISKS & MITIGATION**

### **🚨 Technical Risks**
1. **Supabase Rate Limits**: Implement connection pooling + caching
2. **Stripe Webhook Reliability**: Retry logic + idempotency keys
3. **Real-time Performance**: Optimize subscriptions + batch updates
4. **Database Migrations**: Backup strategy + rollback plan

### **📈 Business Risks**
1. **User Onboarding**: A/B testing + conversion optimization
2. **Payment Conversion**: Trial period optimization + pricing tests
3. **Churn Prevention**: Engagement tracking + intervention triggers
4. **Competition**: Feature differentiation + speed to market

### **🛡️ Security Considerations**
1. **Data Protection**: Encryption at rest + in transit
2. **API Security**: Rate limiting + input validation
3. **Auth Security**: MFA optional + session management
4. **Compliance**: GDPR basics + privacy policy

---

## 🎯 **SUCCESS METRICS FASE 1**

### **📊 Technical KPIs**
- **Uptime**: >99.5%
- **Page Load**: <2s LCP
- **Error Rate**: <1%
- **Auth Success**: >95%

### **📈 Business KPIs**
- **User Registration**: 50+ usuarios
- **Trial Conversion**: >15%
- **Payment Success**: >90%
- **Support Tickets**: <5/semana

### **💰 Financial Targets**
- **Revenue**: $500+ MRR
- **CAC**: <$50
- **LTV**: >$200
- **Churn**: <10% mensual

---

## 🚀 **KICKOFF & NEXT STEPS**

### **✅ Pre-requisitos**
1. **Supabase Account**: Setup + project creation
2. **Stripe Account**: Configuración + test mode
3. **Vercel Account**: Project setup + domain
4. **GitHub Repository**: CI/CD configuration

### **🎯 Día 1 Agenda**
1. **Morning**: Supabase setup + environment configuration
2. **Afternoon**: Auth components implementation
3. **End of Day**: Login/register functional

### **📅 Weekly Milestones**
- **Week 1**: Auth + Database integration complete
- **Week 2**: Payments + Deploy to production
- **Week 3**: Testing + optimization
- **Week 4**: Launch preparation + first users

**¡Empezamos mañana! 🚀**
