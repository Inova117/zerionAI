-- =====================================================
-- SINTRA AI LATAM - ROW LEVEL SECURITY (FINAL)
-- =====================================================
-- Versión final corregida con las columnas correctas

-- =====================================================
-- HABILITAR RLS EN TABLAS EXISTENTES
-- =====================================================

-- Tablas con user_id directo
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE brain_ai_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE behavior_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_assistants ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Tablas relacionadas indirectamente
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE integration_sync_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE assistant_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_metrics ENABLE ROW LEVEL SECURITY;

-- Tablas organizacionales
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

-- Tabla de perfiles (usa id como PK, no user_id)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- DESHABILITAR RLS EN TABLAS PÚBLICAS
-- =====================================================

ALTER TABLE assistants_catalog DISABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_plans DISABLE ROW LEVEL SECURITY;
ALTER TABLE system_config DISABLE ROW LEVEL SECURITY;

-- =====================================================
-- POLICIES PARA PERFILES (usa 'id' no 'user_id')
-- =====================================================

CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- =====================================================
-- POLICIES PARA TABLAS CON user_id
-- =====================================================

-- Conversaciones
CREATE POLICY "Users can view own conversations" ON conversations
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create conversations" ON conversations
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own conversations" ON conversations
    FOR UPDATE USING (user_id = auth.uid());

-- Brain AI Data
CREATE POLICY "Users can view own brain data" ON brain_ai_data
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update own brain data" ON brain_ai_data
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can insert own brain data" ON brain_ai_data
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- User Insights
CREATE POLICY "Users can view own insights" ON user_insights
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create insights" ON user_insights
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- Behavior Patterns
CREATE POLICY "Users can view own patterns" ON behavior_patterns
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create patterns" ON behavior_patterns
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- User Projects
CREATE POLICY "Users can view own projects" ON user_projects
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can manage own projects" ON user_projects
    FOR ALL USING (user_id = auth.uid());

-- User Subscriptions
CREATE POLICY "Users can view own subscription" ON user_subscriptions
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update own subscription" ON user_subscriptions
    FOR UPDATE USING (user_id = auth.uid());

-- Integrations
CREATE POLICY "Users can view own integrations" ON integrations
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can manage own integrations" ON integrations
    FOR ALL USING (user_id = auth.uid());

-- Automation Definitions
CREATE POLICY "Users can view own automations" ON automation_definitions
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can manage own automations" ON automation_definitions
    FOR ALL USING (user_id = auth.uid());

-- User Assistants
CREATE POLICY "Users can view own assistants" ON user_assistants
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can manage own assistants" ON user_assistants
    FOR ALL USING (user_id = auth.uid());

-- =====================================================
-- POLICIES PARA TABLAS RELACIONADAS INDIRECTAMENTE
-- =====================================================

-- Messages (relacionado a través de conversations)
CREATE POLICY "Users can view own messages" ON messages
    FOR SELECT USING (
        conversation_id IN (
            SELECT id FROM conversations WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create messages" ON messages
    FOR INSERT WITH CHECK (
        conversation_id IN (
            SELECT id FROM conversations WHERE user_id = auth.uid()
        )
    );

-- Message Attachments (relacionado a través de messages)
CREATE POLICY "Users can view own message attachments" ON message_attachments
    FOR SELECT USING (
        message_id IN (
            SELECT m.id FROM messages m
            JOIN conversations c ON m.conversation_id = c.id
            WHERE c.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create message attachments" ON message_attachments
    FOR INSERT WITH CHECK (
        message_id IN (
            SELECT m.id FROM messages m
            JOIN conversations c ON m.conversation_id = c.id
            WHERE c.user_id = auth.uid()
        )
    );

-- Invoices (relacionado a través de user_subscriptions)
CREATE POLICY "Users can view own invoices" ON invoices
    FOR SELECT USING (
        user_subscription_id IN (
            SELECT id FROM user_subscriptions WHERE user_id = auth.uid()
        )
    );

-- Subscription Usage (relacionado a través de user_subscriptions)
CREATE POLICY "Users can view own subscription usage" ON subscription_usage
    FOR SELECT USING (
        user_subscription_id IN (
            SELECT id FROM user_subscriptions WHERE user_id = auth.uid()
        )
    );

-- System can create usage records
CREATE POLICY "System can create usage records" ON subscription_usage
    FOR INSERT WITH CHECK (true);

-- Integration Sync Logs (relacionado a través de integrations)
CREATE POLICY "Users can view own sync logs" ON integration_sync_logs
    FOR SELECT USING (
        integration_id IN (
            SELECT id FROM integrations WHERE user_id = auth.uid()
        )
    );

-- Automation Executions (relacionado a través de automation_definitions)
CREATE POLICY "Users can view own automation executions" ON automation_executions
    FOR SELECT USING (
        automation_id IN (
            SELECT id FROM automation_definitions WHERE user_id = auth.uid()
        )
    );

-- Assistant Configurations (relacionado a través de user_assistants)
CREATE POLICY "Users can view own assistant configs" ON assistant_configurations
    FOR SELECT USING (
        user_assistant_id IN (
            SELECT id FROM user_assistants WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can manage own assistant configs" ON assistant_configurations
    FOR ALL USING (
        user_assistant_id IN (
            SELECT id FROM user_assistants WHERE user_id = auth.uid()
        )
    );

-- =====================================================
-- POLICIES PARA ORGANIZACIONES
-- =====================================================

-- Organization Members
CREATE POLICY "Users can view own organization memberships" ON organization_members
    FOR SELECT USING (user_id = auth.uid());

-- Users can view organizations they belong to
CREATE POLICY "Users can view own organizations" ON organizations
    FOR SELECT USING (
        id IN (
            SELECT organization_id FROM organization_members 
            WHERE user_id = auth.uid()
        )
    );

-- =====================================================
-- POLICIES PARA ADMIN (SOLO SUPER ADMINS)
-- =====================================================

-- Solo super admins pueden ver audit logs
CREATE POLICY "Only super admins can view audit logs" ON audit_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE user_id = auth.uid() 
            AND is_active = true 
            AND role = 'super_admin'
        )
    );

-- Solo super admins pueden ver system metrics
CREATE POLICY "Only super admins can view system metrics" ON system_metrics
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE user_id = auth.uid() 
            AND is_active = true 
            AND role = 'super_admin'
        )
    );

-- Super admins pueden gestionar otros admins
CREATE POLICY "Super admins can manage admin users" ON admin_users
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE user_id = auth.uid() 
            AND is_active = true 
            AND role = 'super_admin'
        )
    );

-- Admins pueden ver su propio registro
CREATE POLICY "Admins can view own admin record" ON admin_users
    FOR SELECT USING (user_id = auth.uid());

-- =====================================================
-- PERMISOS BÁSICOS
-- =====================================================

-- Dar permisos a usuarios autenticados
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Dar permisos de lectura a usuarios anónimos solo en tablas públicas
GRANT SELECT ON assistants_catalog TO anon;
GRANT SELECT ON subscription_plans TO anon;
GRANT SELECT ON system_config TO anon;

-- =====================================================
-- FUNCIÓN HELPER PARA UPDATED_AT
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- CONFIRMATION MESSAGE
-- =====================================================

DO $$ 
BEGIN 
    RAISE NOTICE '🔐 RLS policies applied successfully!';
    RAISE NOTICE '📋 Protected tables: profiles, conversations, messages, brain_ai_data, etc.';
    RAISE NOTICE '🌐 Public tables: assistants_catalog, subscription_plans, system_config';
    RAISE NOTICE '🔑 Access control: Users can only see their own data';
END $$;
