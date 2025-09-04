-- 🧠 CEREBRO AI - Sistema Central de Memoria e Inteligencia
-- Esquema de base de datos para memoria persistente y contextual

-- 1. Perfil de Usuario y Contexto de Negocio
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Información básica
  name TEXT NOT NULL DEFAULT 'Usuario',
  company TEXT NOT NULL DEFAULT 'Mi Empresa', 
  industry TEXT NOT NULL DEFAULT 'Tecnología',
  role TEXT NOT NULL DEFAULT 'Emprendedor',
  
  -- Patrones de comportamiento
  working_style TEXT CHECK (working_style IN ('fast-paced', 'methodical', 'collaborative', 'independent')) DEFAULT 'fast-paced',
  communication_prefs TEXT CHECK (communication_prefs IN ('direct', 'detailed', 'visual', 'conversational')) DEFAULT 'conversational',
  decision_making TEXT CHECK (decision_making IN ('data-driven', 'intuitive', 'consensus-based', 'analytical')) DEFAULT 'data-driven',
  
  -- Contexto de negocio (JSONB para flexibilidad)
  business_context JSONB DEFAULT '{
    "challenges": [],
    "opportunities": [],
    "competitive_advantages": [],
    "pain_points": []
  }'::jsonb,
  
  -- Patrones de aprendizaje
  learning_patterns JSONB DEFAULT '{
    "user_behavior": {
      "most_active_hours": [],
      "preferred_assistants": [],
      "task_completion_style": "",
      "feedback_patterns": []
    },
    "business_patterns": {
      "seasonal_trends": [],
      "successful_strategies": [],
      "common_bottlenecks": [],
      "growth_indicators": []
    }
  }'::jsonb,
  
  -- Contexto inteligente
  intelligent_context JSONB DEFAULT '{
    "current_focus": "",
    "recent_achievements": [],
    "emerging_needs": [],
    "predicted_challenges": []
  }'::jsonb,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id)
);

-- 2. Proyectos y Tareas del Usuario
CREATE TABLE user_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  name TEXT NOT NULL,
  description TEXT,
  status TEXT CHECK (status IN ('planning', 'active', 'review', 'completed', 'on_hold')) DEFAULT 'planning',
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'critical')) DEFAULT 'medium',
  
  -- Asistentes involucrados
  assistants_involved TEXT[] DEFAULT '{}',
  
  -- Metadata del proyecto
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Fechas importantes
  start_date TIMESTAMP WITH TIME ZONE,
  due_date TIMESTAMP WITH TIME ZONE,
  completed_date TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Relaciones Asistente-Usuario (Memoria específica por asistente)
CREATE TABLE assistant_relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  assistant_id TEXT NOT NULL, -- 'sofia', 'carlos', 'paula', etc.
  
  -- Métricas de relación
  trust_level INTEGER DEFAULT 50 CHECK (trust_level >= 0 AND trust_level <= 100),
  interaction_count INTEGER DEFAULT 0,
  successful_tasks INTEGER DEFAULT 0,
  user_satisfaction DECIMAL(2,1) DEFAULT 3.0 CHECK (user_satisfaction >= 0 AND user_satisfaction <= 5),
  
  -- Patrones de interacción
  preferred_task_types TEXT[] DEFAULT '{}',
  communication_patterns TEXT[] DEFAULT '{}',
  
  -- Memoria específica del asistente
  assistant_memory JSONB DEFAULT '{
    "user_preferences": {},
    "completed_tasks": [],
    "failed_tasks": [],
    "learning_notes": [],
    "contextual_insights": []
  }'::jsonb,
  
  -- Timestamps
  last_interaction TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, assistant_id)
);

-- 4. Insights Cruzados entre Asistentes
CREATE TABLE cross_assistant_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Origen del insight
  discovered_by TEXT NOT NULL, -- assistant_id que descubrió el insight
  validated_by TEXT[] DEFAULT '{}', -- assistant_ids que lo validaron
  
  -- Contenido del insight
  insight_type TEXT CHECK (insight_type IN ('pattern', 'opportunity', 'risk', 'optimization', 'behavior', 'activity')) NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  
  -- Métricas
  confidence DECIMAL(3,2) CHECK (confidence >= 0 AND confidence <= 1) DEFAULT 0.5,
  impact TEXT CHECK (impact IN ('low', 'medium', 'high', 'critical')) DEFAULT 'medium',
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'critical')) DEFAULT 'medium',
  
  -- Estado
  actionable BOOLEAN DEFAULT false,
  acted_upon BOOLEAN DEFAULT false,
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  related_insights UUID[] DEFAULT '{}', -- IDs de insights relacionados
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Memoria de Conversaciones Mejorada (enlaza con cerebro)
CREATE TABLE conversation_memories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  assistant_id TEXT NOT NULL,
  
  -- Contexto de la conversación
  conversation_id TEXT NOT NULL, -- Para agrupar mensajes de una sesión
  session_context JSONB DEFAULT '{}'::jsonb,
  
  -- Extractos importantes de la conversación
  key_topics TEXT[] DEFAULT '{}',
  user_intents TEXT[] DEFAULT '{}',
  extracted_preferences JSONB DEFAULT '{}'::jsonb,
  
  -- Emociones y tono detectados
  user_mood TEXT,
  conversation_tone TEXT,
  satisfaction_level INTEGER CHECK (satisfaction_level >= 1 AND satisfaction_level <= 5),
  
  -- Timestamp y duración
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE,
  duration_minutes INTEGER,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Log de Actividades del Cerebro AI
CREATE TABLE cerebro_activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Tipo de actividad
  activity_type TEXT CHECK (activity_type IN ('insight_generated', 'pattern_detected', 'preference_learned', 'context_updated', 'relationship_updated')) NOT NULL,
  
  -- Detalles
  assistant_id TEXT, -- NULL si es actividad global
  title TEXT NOT NULL,
  description TEXT,
  
  -- Datos de la actividad
  activity_data JSONB DEFAULT '{}'::jsonb,
  
  -- Impacto
  impact_score DECIMAL(3,2) DEFAULT 0.5,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 🔒 ROW LEVEL SECURITY
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE assistant_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE cross_assistant_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE cerebro_activity_log ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad (los usuarios solo ven sus propios datos)
CREATE POLICY "Users can access their own profiles" ON user_profiles
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can access their own projects" ON user_projects
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can access their own assistant relationships" ON assistant_relationships
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can access their own insights" ON cross_assistant_insights
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can access their own conversation memories" ON conversation_memories
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can access their own activity log" ON cerebro_activity_log
  FOR ALL USING (auth.uid() = user_id);

-- 📊 ÍNDICES para performance
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_user_projects_user_id ON user_projects(user_id);
CREATE INDEX idx_user_projects_status ON user_projects(status) WHERE status IN ('active', 'review');
CREATE INDEX idx_assistant_relationships_user_assistant ON assistant_relationships(user_id, assistant_id);
CREATE INDEX idx_cross_insights_user_discovered ON cross_assistant_insights(user_id, discovered_by);
CREATE INDEX idx_conversation_memories_user_assistant ON conversation_memories(user_id, assistant_id);
CREATE INDEX idx_cerebro_activity_user_type ON cerebro_activity_log(user_id, activity_type);

-- 🕐 TRIGGERS para updated_at automático
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_projects_updated_at BEFORE UPDATE ON user_projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_assistant_relationships_updated_at BEFORE UPDATE ON assistant_relationships FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cross_assistant_insights_updated_at BEFORE UPDATE ON cross_assistant_insights FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_conversation_memories_updated_at BEFORE UPDATE ON conversation_memories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
