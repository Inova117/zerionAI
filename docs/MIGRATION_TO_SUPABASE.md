# 🚀 MIGRACIÓN COMPLETA A SUPABASE - GUÍA PASO A PASO

## 🎯 **OBJETIVO**
Eliminar completamente el mock data y localStorage, conectando todo a Supabase real.

---

## 📋 **PASOS DE MIGRACIÓN**

### **1. 🗄️ EJECUTAR MIGRACIONES DE BASE DE DATOS**

**Ejecuta en tu Supabase SQL Editor:**

```sql
-- Paso 1: Migración del Cerebro AI (si no la has ejecutado)
-- Ejecutar: supabase/migrations/005_cerebro_ai_schema_final.sql

-- Paso 2: Migración de Dashboard y Métricas
-- Ejecutar: supabase/migrations/006_dashboard_tables.sql
```

### **2. 🔄 ACTUALIZAR IMPORTACIONES**

**Archivos que necesitan actualización:**

#### **`src/hooks/useChat.ts`**
```typescript
// ANTES
import { conversationMemory } from '@/lib/conversation-memory';

// DESPUÉS  
import { conversationMemoryV2 as conversationMemory } from '@/lib/conversation-memory-v2';
```

#### **`src/components/dashboard/dashboard-stats.tsx`**
```typescript
// ANTES
import { dashboardMetrics } from '@/lib/dashboard-metrics';

// DESPUÉS
import { dashboardMetricsV2 as dashboardMetrics } from '@/lib/dashboard-metrics-v2';
```

#### **`src/components/dashboard/recent-activity.tsx`**
```typescript
// ANTES
import { dashboardMetrics } from '@/lib/dashboard-metrics';

// DESPUÉS
import { dashboardMetricsV2 as dashboardMetrics } from '@/lib/dashboard-metrics-v2';
```

#### **`src/hooks/useDashboardMetrics.ts`**
```typescript
// ANTES
import { dashboardMetrics } from '@/lib/dashboard-metrics';

// DESPUÉS
import { dashboardMetricsV2 as dashboardMetrics } from '@/lib/dashboard-metrics-v2';
```

#### **`src/app/dashboard/analytics/page.tsx`**
```typescript
// ANTES
import { dashboardMetrics } from '@/lib/dashboard-metrics';

// DESPUÉS
import { dashboardMetricsV2 as dashboardMetrics } from '@/lib/dashboard-metrics-v2';
```

#### **Todos los archivos que usen AI Service:**
```typescript
// ANTES
import { generateAIResponse } from '@/lib/ai-service';

// DESPUÉS
import { generateAIResponse } from '@/lib/ai-service-v2';
```

### **3. 🧠 ACTUALIZAR CEREBRO AI**

**En todos los archivos que usen Cerebro AI:**

```typescript
// ANTES
import { cerebroAI } from '@/lib/cerebro-ai';

// DESPUÉS - Ya está actualizado en ai-service-v2.ts
// No necesitas cambiar nada más, el Cerebro AI V2 ya está integrado
```

### **4. ⚙️ CONFIGURACIONES DE AUDIO**

**`src/lib/audio-system.ts`** - Actualizar para usar Supabase:

```typescript
// ANTES
localStorage.setItem('audio_enabled', this.isEnabled.toString());

// DESPUÉS
import { supabaseSettingsService } from '@/lib/supabase-services';
await supabaseSettingsService.updateSettings({ 
  audio_enabled: this.isEnabled,
  audio_volume: this.volume 
});
```

---

## 🔧 **ARCHIVOS QUE CREAR/ACTUALIZAR**

### **Crear `src/hooks/useDashboardMetrics.ts` actualizado:**
```typescript
import { useEffect, useState } from 'react';
import { dashboardMetricsV2, type DashboardMetrics } from '@/lib/dashboard-metrics-v2';

export function useDashboardMetrics() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = dashboardMetricsV2.subscribe((newMetrics) => {
      setMetrics(newMetrics);
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  return {
    metrics,
    isLoading,
    refresh: () => dashboardMetricsV2.refresh(),
    onTaskCompleted: dashboardMetricsV2.onTaskCompleted.bind(dashboardMetricsV2),
    onFileGenerated: dashboardMetricsV2.onFileGenerated.bind(dashboardMetricsV2),
    onAutomationSetup: dashboardMetricsV2.onAutomationSetup.bind(dashboardMetricsV2)
  };
}
```

### **Actualizar `src/components/dashboard/chat-interface.tsx`:**
```typescript
// ANTES
import { generateAIResponse } from '@/lib/ai-service';

// DESPUÉS
import { generateAIResponse } from '@/lib/ai-service-v2';
```

---

## 🗂️ **ARCHIVOS OBSOLETOS (PUEDEN ELIMINARSE)**

Una vez que confirmes que todo funciona, puedes eliminar:

- ❌ `src/lib/dashboard-metrics.ts` (reemplazado por v2)
- ❌ `src/lib/conversation-memory.ts` (reemplazado por v2) 
- ❌ `src/lib/brain-ai.ts` (reemplazado por Cerebro AI V2)
- ❌ `src/lib/cerebro-ai.ts` (reemplazado por v2)
- ❌ `src/lib/ai-service.ts` (reemplazado por v2)

**⚠️ NO ELIMINES TODAVÍA - Hazlo solo después de confirmar que todo funciona**

---

## ✅ **CHECKLIST DE VERIFICACIÓN**

### **Base de Datos:**
- [ ] Migración 005 ejecutada exitosamente
- [ ] Migración 006 ejecutada exitosamente  
- [ ] Tablas creadas: `user_profiles`, `assistant_relationships`, `cross_assistant_insights`, `conversation_memories`, `cerebro_activity_log`, `dashboard_metrics`, `user_activities`, `user_settings`, `user_automations`

### **Funcionalidad:**
- [ ] Login/Register funciona
- [ ] Chat con asistentes funciona  
- [ ] Mensajes se guardan en Supabase
- [ ] Métricas se actualizan en tiempo real
- [ ] Cerebro AI genera insights
- [ ] Generación de imágenes funciona
- [ ] Dashboard muestra datos reales

### **Performance:**
- [ ] No hay errores en consola
- [ ] No hay warnings de localStorage
- [ ] Métricas se sincronizan automáticamente
- [ ] Respuestas de IA son reales (Hugging Face)

---

## 🚨 **TROUBLESHOOTING**

### **Error: "No user found"**
```sql
-- Verificar que tienes un usuario autenticado
SELECT auth.uid();
```

### **Error: "Table doesn't exist"**
```sql
-- Verificar que las tablas se crearon
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('user_profiles', 'dashboard_metrics', 'user_activities');
```

### **Error: "Permission denied"**
```sql
-- Verificar RLS policies
SELECT * FROM pg_policies WHERE tablename = 'user_profiles';
```

### **Métricas no se actualizan**
```typescript
// Verificar en browser console
console.log('Dashboard Metrics V2 initialized:', dashboardMetricsV2);
await dashboardMetricsV2.refresh();
```

---

## 🎯 **RESULTADO ESPERADO**

### **✅ ANTES (Mock Data):**
- localStorage temporal
- Respuestas hardcodeadas
- Datos simulados
- Sin persistencia real

### **🚀 DESPUÉS (Supabase Real):**
- Base de datos persistente
- IA real con Hugging Face
- Métricas reales en tiempo real
- Cerebro AI con aprendizaje real
- Generación de imágenes real
- Sistema completamente escalable

---

**🎉 ¡Tu aplicación estará completamente libre de mock data y conectada a un backend real!**
