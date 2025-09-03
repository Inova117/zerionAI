# 🎯 MVP TEST CHECKLIST - SINTRA AI LATAM

## ✅ FUNCIONALIDADES CORE A PROBAR

### 📱 **LANDING PAGE**
- [ ] Página carga sin errores
- [ ] Botón "Ver Dashboard Demo" funciona
- [ ] Sección de asistentes muestra los 3 principales
- [ ] Enlaces de navegación funcionan

### 🏠 **DASHBOARD PRINCIPAL**
- [ ] Dashboard carga correctamente
- [ ] Métricas se muestran (tareas, tiempo ahorrado, etc.)
- [ ] Cards de asistentes aparecen animadas
- [ ] Sidebar navigation funciona
- [ ] Header muestra controles (audio, tema, notificaciones)

### 💬 **CHAT SYSTEM**
- [ ] Click en asistente abre chat
- [ ] Se puede escribir y enviar mensajes
- [ ] Asistente responde con delay realista
- [ ] Typing indicator aparece y desaparece
- [ ] Diferentes tipos de respuesta (texto, tarea, archivo)
- [ ] Follow-up actions funcionan
- [ ] Audio feedback en mensajes

### 📊 **MÉTRICAS DINÁMICAS**
- [ ] Métricas suben al completar tareas en chat
- [ ] Notificaciones aparecen cuando hay actividad
- [ ] Stream de actividad se actualiza
- [ ] Progress bars animadas funcionan

### 🤖 **AUTOMATIZACIONES**
- [ ] Página de automatizaciones carga
- [ ] Se muestran automatizaciones activas
- [ ] Trigger manual (⚡) funciona
- [ ] Control de pausar/reanudar funciona
- [ ] Actividad de background genera notificaciones

### 🎨 **CONTROLES UI**
- [ ] Toggle de tema oscuro/claro funciona
- [ ] Control de audio abre panel
- [ ] Slider de volumen funciona
- [ ] Test sounds reproducen
- [ ] Animaciones se ven suaves

### 📱 **RESPONSIVE**
- [ ] Mobile: sidebar collapsa correctamente
- [ ] Tablet: layout se adapta bien
- [ ] Desktop: todo funciona perfecto

---

## 🚨 **CRITERIOS MVP MÍNIMO**

### **DEBE FUNCIONAR:**
1. ✅ Landing → Dashboard navigation
2. ✅ Chat básico con 1 asistente
3. ✅ Métricas suben al usar chat
4. ✅ No errores de JavaScript en consola

### **NICE TO HAVE:**
1. 🎯 Todos los 3 asistentes funcionando
2. 🎯 Automatizaciones background
3. 🎯 Tema oscuro/claro
4. 🎯 Sistema de audio completo

---

## 📋 **CHECKLIST RÁPIDO (2 MINUTOS)**

**URL DE PRUEBA**: http://localhost:3001

1. [ ] ¿Landing page carga?
2. [ ] ¿Click "Ver Dashboard" funciona?
3. [ ] ¿Dashboard aparece con asistentes?
4. [ ] ¿Click en Sofía abre chat?
5. [ ] ¿Puedo enviar mensaje y recibir respuesta?
6. [ ] ¿Las métricas cambiaron después del chat?

**SI LAS 6 RESPUESTAS SON SÍ → MVP LISTO** ✅
**SI ALGUNA ES NO → Arreglar error específico** ❌

---

## 🎯 **PRIORIDAD DE BUGS**

### **P0 - CRÍTICO (Must fix):**
- Errores de JavaScript que bloquean la app
- Chat no funciona
- Navigation rota

### **P1 - ALTO (Should fix):**
- Métricas no se actualizan
- Automatizaciones no funcionan
- UI rota en móvil

### **P2 - MEDIO (Nice to fix):**
- Animaciones no fluidas
- Sonidos no reproducen
- Tema oscuro no funciona

### **P3 - BAJO (Can ignore for MVP):**
- Micro-interactions menores
- Detalles de styling
- Optimizaciones de performance
