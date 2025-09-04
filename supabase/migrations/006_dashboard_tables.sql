-- 📊 TABLAS ADICIONALES PARA DASHBOARD Y MÉTRICAS
-- Reemplaza localStorage con persistencia real en Supabase

-- 1. Métricas del Dashboard por Usuario
CREATE TABLE IF NOT EXISTS dashboard_metrics (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Métricas principales
  total_tasks_completed INTEGER DEFAULT 0,
  total_time_saved DECIMAL(10,2) DEFAULT 0, -- en horas
  efficiency_score DECIMAL(5,2) DEFAULT 0, -- porcentaje 0-100
  current_streak INTEGER DEFAULT 0, -- días consecutivos activos
  weekly_goals_progress DECIMAL(5,2) DEFAULT 0, -- porcentaje 0-100
  monthly_active_assistants INTEGER DEFAULT 0,
  automation_rate DECIMAL(5,2) DEFAULT 0, -- porcentaje 0-100
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Actividades del Usuario (reemplaza localStorage activities)
CREATE TABLE IF NOT EXISTS user_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Información de la actividad
  type TEXT CHECK (type IN ('task_completed', 'automation_setup', 'file_generated', 'insight_generated')) NOT NULL,
  assistant_id TEXT NOT NULL,
  assistant_name TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  
  -- Metadata de la actividad
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamp
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Configuraciones del Usuario (reemplaza localStorage settings)
CREATE TABLE IF NOT EXISTS user_settings (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Configuraciones de UI
  audio_enabled BOOLEAN DEFAULT true,
  audio_volume DECIMAL(3,2) DEFAULT 0.5 CHECK (audio_volume >= 0 AND audio_volume <= 1),
  theme TEXT CHECK (theme IN ('light', 'dark', 'system')) DEFAULT 'system',
  language TEXT DEFAULT 'es',
  notifications_enabled BOOLEAN DEFAULT true,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Automatizaciones del Usuario (reemplaza background automations simuladas)
CREATE TABLE IF NOT EXISTS user_automations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Información de la automatización
  assistant_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  task_type TEXT NOT NULL,
  
  -- Configuración
  is_active BOOLEAN DEFAULT true,
  interval_minutes INTEGER DEFAULT 60, -- cada cuántos minutos ejecutar
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'critical')) DEFAULT 'medium',
  
  -- Métricas
  execution_count INTEGER DEFAULT 0,
  success_count INTEGER DEFAULT 0,
  time_saved_hours DECIMAL(10,2) DEFAULT 0,
  
  -- Configuración específica (JSON flexible)
  configuration JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamps
  last_executed TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Log de Ejecuciones de Automatizaciones
CREATE TABLE IF NOT EXISTS automation_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  automation_id UUID REFERENCES user_automations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Resultado de la ejecución
  status TEXT CHECK (status IN ('success', 'failed', 'partial', 'skipped')) NOT NULL,
  result_data JSONB DEFAULT '{}'::jsonb,
  error_message TEXT,
  
  -- Métricas de la ejecución
  execution_time_ms INTEGER,
  time_saved_hours DECIMAL(8,2) DEFAULT 0,
  
  executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 🔒 ROW LEVEL SECURITY
ALTER TABLE dashboard_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_automations ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_executions ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad
DROP POLICY IF EXISTS "Users can access their own dashboard metrics" ON dashboard_metrics;
CREATE POLICY "Users can access their own dashboard metrics" ON dashboard_metrics
  FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can access their own activities" ON user_activities;
CREATE POLICY "Users can access their own activities" ON user_activities
  FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can access their own settings" ON user_settings;
CREATE POLICY "Users can access their own settings" ON user_settings
  FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can access their own automations" ON user_automations;
CREATE POLICY "Users can access their own automations" ON user_automations
  FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can access their own automation executions" ON automation_executions;
CREATE POLICY "Users can access their own automation executions" ON automation_executions
  FOR ALL USING (auth.uid() = user_id);

-- 📊 ÍNDICES para performance
CREATE INDEX IF NOT EXISTS idx_dashboard_metrics_updated_at ON dashboard_metrics(updated_at);

CREATE INDEX IF NOT EXISTS idx_user_activities_user_created ON user_activities(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_activities_assistant ON user_activities(assistant_id);
CREATE INDEX IF NOT EXISTS idx_user_activities_type ON user_activities(type);

CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON user_settings(user_id);

CREATE INDEX IF NOT EXISTS idx_user_automations_user_active ON user_automations(user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_user_automations_assistant ON user_automations(assistant_id);
CREATE INDEX IF NOT EXISTS idx_user_automations_next_execution ON user_automations(last_executed) WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_automation_executions_automation ON automation_executions(automation_id);
CREATE INDEX IF NOT EXISTS idx_automation_executions_status ON automation_executions(status);
CREATE INDEX IF NOT EXISTS idx_automation_executions_executed_at ON automation_executions(executed_at DESC);

-- 🕐 FUNCIÓN PARA updated_at automático
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $func$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$func$ LANGUAGE plpgsql;

-- 🕐 TRIGGERS para updated_at automático
DROP TRIGGER IF EXISTS update_dashboard_metrics_updated_at ON dashboard_metrics;
CREATE TRIGGER update_dashboard_metrics_updated_at 
  BEFORE UPDATE ON dashboard_metrics 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_settings_updated_at ON user_settings;
CREATE TRIGGER update_user_settings_updated_at 
  BEFORE UPDATE ON user_settings 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_automations_updated_at ON user_automations;
CREATE TRIGGER update_user_automations_updated_at 
  BEFORE UPDATE ON user_automations 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 📊 FUNCIONES ÚTILES
CREATE OR REPLACE FUNCTION get_user_efficiency_score(user_uuid UUID)
RETURNS DECIMAL AS $score$
DECLARE
  efficiency_score DECIMAL := 0;
  total_tasks INTEGER := 0;
  total_time_saved DECIMAL := 0;
BEGIN
  -- Obtener métricas básicas
  SELECT 
    COALESCE(total_tasks_completed, 0),
    COALESCE(total_time_saved, 0)
  INTO total_tasks, total_time_saved
  FROM dashboard_metrics 
  WHERE user_id = user_uuid;
  
  -- Calcular score basado en tareas completadas y tiempo ahorrado
  IF total_tasks > 0 THEN
    efficiency_score := LEAST(100, (total_tasks * 5) + (total_time_saved * 10));
  END IF;
  
  RETURN efficiency_score;
END;
$score$ LANGUAGE plpgsql SECURITY DEFINER;

-- 🔄 FUNCIÓN PARA ACTUALIZAR MÉTRICAS AUTOMÁTICAMENTE
CREATE OR REPLACE FUNCTION update_user_metrics_on_activity()
RETURNS TRIGGER AS $metrics$
BEGIN
  -- Actualizar métricas cuando se agrega una nueva actividad
  INSERT INTO dashboard_metrics (user_id, total_tasks_completed, total_time_saved)
  VALUES (NEW.user_id, 1, COALESCE((NEW.metadata->>'time_saved')::DECIMAL, 0))
  ON CONFLICT (user_id) DO UPDATE SET
    total_tasks_completed = dashboard_metrics.total_tasks_completed + 1,
    total_time_saved = dashboard_metrics.total_time_saved + COALESCE((NEW.metadata->>'time_saved')::DECIMAL, 0),
    updated_at = NOW();
  
  RETURN NEW;
END;
$metrics$ LANGUAGE plpgsql;

-- Trigger para actualizar métricas automáticamente
DROP TRIGGER IF EXISTS update_metrics_on_new_activity ON user_activities;
CREATE TRIGGER update_metrics_on_new_activity
  AFTER INSERT ON user_activities
  FOR EACH ROW EXECUTE FUNCTION update_user_metrics_on_activity();

-- ✅ MENSAJE DE CONFIRMACIÓN
DO $final$
BEGIN
  RAISE NOTICE '📊 ========================================';
  RAISE NOTICE '📊 DASHBOARD TABLES - MIGRACIÓN COMPLETADA';
  RAISE NOTICE '📊 ========================================';
  RAISE NOTICE '✅ dashboard_metrics: Métricas de usuario';
  RAISE NOTICE '✅ user_activities: Actividades persistentes';
  RAISE NOTICE '✅ user_settings: Configuraciones de usuario';
  RAISE NOTICE '✅ user_automations: Automatizaciones reales';
  RAISE NOTICE '✅ automation_executions: Log de ejecuciones';
  RAISE NOTICE '🔒 RLS habilitado en todas las tablas';
  RAISE NOTICE '⚡ Índices optimizados para performance';
  RAISE NOTICE '🔄 Triggers automáticos configurados';
  RAISE NOTICE '📊 ¡Sistema de dashboard completamente real!';
  RAISE NOTICE '📊 ========================================';
END $final$;
