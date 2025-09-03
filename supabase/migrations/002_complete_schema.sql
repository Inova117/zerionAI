-- =====================================================
-- SINTRA AI LATAM - COMPLETE DATABASE SCHEMA
-- =====================================================

-- Drop existing tables if they exist
DROP TABLE IF EXISTS automation_executions CASCADE;
DROP TABLE IF EXISTS automation_definitions CASCADE;
DROP TABLE IF EXISTS integration_sync_logs CASCADE;
DROP TABLE IF EXISTS integrations CASCADE;
DROP TABLE IF EXISTS subscription_usage CASCADE;
DROP TABLE IF EXISTS invoices CASCADE;
DROP TABLE IF EXISTS user_subscriptions CASCADE;
DROP TABLE IF EXISTS subscription_plans CASCADE;
DROP TABLE IF EXISTS user_projects CASCADE;
DROP TABLE IF EXISTS behavior_patterns CASCADE;
DROP TABLE IF EXISTS user_insights CASCADE;
DROP TABLE IF EXISTS brain_ai_data CASCADE;
DROP TABLE IF EXISTS message_attachments CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS conversations CASCADE;
DROP TABLE IF EXISTS assistant_configurations CASCADE;
DROP TABLE IF EXISTS user_assistants CASCADE;
DROP TABLE IF EXISTS assistants_catalog CASCADE;
DROP TABLE IF EXISTS system_metrics CASCADE;
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS system_config CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;
DROP TABLE IF EXISTS organization_members CASCADE;
DROP TABLE IF EXISTS organizations CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Drop existing enums
DROP TYPE IF EXISTS admin_role_enum CASCADE;
DROP TYPE IF EXISTS execution_status_enum CASCADE;
DROP TYPE IF EXISTS automation_trigger_enum CASCADE;
DROP TYPE IF EXISTS sync_status_enum CASCADE;
DROP TYPE IF EXISTS integration_status_enum CASCADE;
DROP TYPE IF EXISTS integration_type_enum CASCADE;
DROP TYPE IF EXISTS invoice_status_enum CASCADE;
DROP TYPE IF EXISTS project_status_enum CASCADE;
DROP TYPE IF EXISTS project_priority_enum CASCADE;
DROP TYPE IF EXISTS project_category_enum CASCADE;
DROP TYPE IF EXISTS pattern_type_enum CASCADE;
DROP TYPE IF EXISTS insight_status_enum CASCADE;
DROP TYPE IF EXISTS insight_category_enum CASCADE;
DROP TYPE IF EXISTS message_status_enum CASCADE;
DROP TYPE IF EXISTS message_type_enum CASCADE;
DROP TYPE IF EXISTS message_role_enum CASCADE;
DROP TYPE IF EXISTS conversation_status_enum CASCADE;
DROP TYPE IF EXISTS support_level_enum CASCADE;
DROP TYPE IF EXISTS billing_cycle_enum CASCADE;
DROP TYPE IF EXISTS subscription_status_enum CASCADE;
DROP TYPE IF EXISTS subscription_plan_enum CASCADE;
DROP TYPE IF EXISTS organization_role_enum CASCADE;
DROP TYPE IF EXISTS organization_size_enum CASCADE;
DROP TYPE IF EXISTS focus_area_enum CASCADE;
DROP TYPE IF EXISTS communication_style_enum CASCADE;
DROP TYPE IF EXISTS growth_stage_enum CASCADE;
DROP TYPE IF EXISTS company_size_enum CASCADE;

-- =====================================================
-- CUSTOM TYPES AND ENUMS
-- =====================================================

-- Basic company and user enums
CREATE TYPE company_size_enum AS ENUM ('startup', 'small', 'medium', 'enterprise');
CREATE TYPE growth_stage_enum AS ENUM ('idea', 'mvp', 'growth', 'scale', 'mature');
CREATE TYPE communication_style_enum AS ENUM ('direct', 'friendly', 'professional', 'casual');
CREATE TYPE focus_area_enum AS ENUM ('sales', 'marketing', 'operations', 'growth');

-- Organization enums
CREATE TYPE organization_size_enum AS ENUM ('1-10', '11-50', '51-200', '201-1000', '1000+');
CREATE TYPE organization_role_enum AS ENUM ('owner', 'admin', 'member', 'guest');

-- Subscription and billing enums
CREATE TYPE subscription_plan_enum AS ENUM ('trial', 'starter', 'professional', 'enterprise');
CREATE TYPE subscription_status_enum AS ENUM ('trial', 'active', 'past_due', 'cancelled', 'unpaid');
CREATE TYPE billing_cycle_enum AS ENUM ('monthly', 'yearly');
CREATE TYPE support_level_enum AS ENUM ('email', 'priority', 'phone', 'dedicated');

-- Conversation and message enums
CREATE TYPE conversation_status_enum AS ENUM ('active', 'paused', 'archived', 'deleted');
CREATE TYPE message_role_enum AS ENUM ('user', 'assistant', 'system');
CREATE TYPE message_type_enum AS ENUM ('text', 'task_completion', 'file_generated', 'link_shared', 'list', 'calendar_update');
CREATE TYPE message_status_enum AS ENUM ('sending', 'delivered', 'read', 'failed');

-- Brain AI enums
CREATE TYPE insight_category_enum AS ENUM ('behavior', 'preference', 'business', 'performance');
CREATE TYPE insight_status_enum AS ENUM ('discovered', 'validated', 'actionable', 'implemented', 'expired');
CREATE TYPE pattern_type_enum AS ENUM ('temporal', 'behavioral', 'contextual', 'performance');

-- Project enums
CREATE TYPE project_category_enum AS ENUM ('marketing', 'sales', 'operations', 'growth', 'product');
CREATE TYPE project_priority_enum AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE project_status_enum AS ENUM ('planning', 'active', 'paused', 'completed', 'cancelled');

-- Billing enums
CREATE TYPE invoice_status_enum AS ENUM ('draft', 'sent', 'paid', 'overdue', 'cancelled');

-- Integration enums
CREATE TYPE integration_type_enum AS ENUM ('whatsapp', 'email', 'slack', 'zapier', 'webhook');
CREATE TYPE integration_status_enum AS ENUM ('pending', 'connected', 'error', 'disconnected');
CREATE TYPE sync_status_enum AS ENUM ('success', 'partial', 'failed');

-- Automation enums
CREATE TYPE automation_trigger_enum AS ENUM ('schedule', 'event', 'condition', 'webhook');
CREATE TYPE execution_status_enum AS ENUM ('pending', 'running', 'success', 'failed', 'cancelled');

-- Admin enums
CREATE TYPE admin_role_enum AS ENUM ('super_admin', 'admin', 'support', 'analyst');

-- =====================================================
-- CORE TABLES
-- =====================================================

-- User profiles (extends Supabase auth.users)
CREATE TABLE profiles (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email text UNIQUE NOT NULL,
    full_name text,
    avatar_url text,
    phone text,
    timezone text DEFAULT 'America/Mexico_City',
    language text DEFAULT 'es',
    
    -- Company information
    company_name text,
    company_industry text,
    company_size company_size_enum,
    company_growth_stage growth_stage_enum,
    company_revenue_range text,
    company_website text,
    
    -- Preferences
    notification_preferences jsonb DEFAULT '{}',
    communication_style communication_style_enum DEFAULT 'friendly',
    working_hours jsonb DEFAULT '{"start": "09:00", "end": "18:00"}',
    
    -- Metadata
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

-- Organizations for multi-user companies
CREATE TABLE organizations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    slug text UNIQUE NOT NULL,
    description text,
    logo_url text,
    website text,
    industry text,
    size organization_size_enum,
    
    -- Configuration
    settings jsonb DEFAULT '{}',
    
    -- Billing
    billing_email text,
    billing_address jsonb,
    tax_id text,
    
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    is_active boolean DEFAULT true
);

-- Organization membership
CREATE TABLE organization_members (
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

-- Assistants catalog
CREATE TABLE assistants_catalog (
    id text PRIMARY KEY,
    name text NOT NULL,
    role text NOT NULL,
    description text NOT NULL,
    avatar text NOT NULL,
    color text NOT NULL,
    
    -- Assistant configuration
    specialties text[],
    primary_skills text[],
    secondary_skills text[],
    tools text[],
    methodologies text[],
    
    -- Prompts and personality
    system_prompt text NOT NULL,
    personality jsonb NOT NULL,
    response_patterns jsonb NOT NULL,
    
    -- Metadata
    version text DEFAULT '1.0',
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    
    -- Plan restrictions
    required_plan subscription_plan_enum DEFAULT 'starter',
    is_premium boolean DEFAULT false
);

-- User-activated assistants
CREATE TABLE user_assistants (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
    assistant_id text REFERENCES assistants_catalog(id),
    
    -- Customization
    custom_name text,
    custom_prompt text,
    custom_settings jsonb DEFAULT '{}',
    
    -- Status
    is_active boolean DEFAULT true,
    activation_date timestamptz DEFAULT now(),
    last_interaction timestamptz,
    
    -- Statistics
    total_interactions integer DEFAULT 0,
    successful_tasks integer DEFAULT 0,
    user_satisfaction numeric(3,2) DEFAULT 3.0,
    trust_level numeric(3,2) DEFAULT 0.5,
    
    UNIQUE(user_id, assistant_id)
);

-- Assistant-specific configurations
CREATE TABLE assistant_configurations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_assistant_id uuid REFERENCES user_assistants(id) ON DELETE CASCADE,
    
    -- Specific settings
    automation_enabled boolean DEFAULT false,
    notification_enabled boolean DEFAULT true,
    response_delay integer DEFAULT 1000,
    
    -- Integrations
    integrations jsonb DEFAULT '{}',
    
    -- Schedule
    working_schedule jsonb DEFAULT '{}',
    timezone_aware boolean DEFAULT true,
    
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- =====================================================
-- CONVERSATIONS AND MESSAGING
-- =====================================================

-- Conversations
CREATE TABLE conversations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
    assistant_id text REFERENCES assistants_catalog(id),
    
    -- Conversation metadata
    title text,
    context jsonb DEFAULT '{}',
    status conversation_status_enum DEFAULT 'active',
    
    -- Timestamps
    started_at timestamptz DEFAULT now(),
    last_message_at timestamptz DEFAULT now(),
    archived_at timestamptz,
    
    -- Statistics
    message_count integer DEFAULT 0,
    total_tokens_used integer DEFAULT 0,
    cost numeric(10,4) DEFAULT 0.0000,
    
    -- Rating
    user_rating integer CHECK (user_rating >= 1 AND user_rating <= 5),
    user_feedback text
);

-- Messages
CREATE TABLE messages (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id uuid REFERENCES conversations(id) ON DELETE CASCADE,
    
    -- Message content
    role message_role_enum NOT NULL,
    content text NOT NULL,
    content_type message_type_enum DEFAULT 'text',
    
    -- Metadata
    metadata jsonb DEFAULT '{}',
    tokens_used integer,
    processing_time integer,
    model_used text,
    cost numeric(10,6) DEFAULT 0.000000,
    
    -- Status
    status message_status_enum DEFAULT 'delivered',
    error_details text,
    
    -- Timestamps
    created_at timestamptz DEFAULT now(),
    delivered_at timestamptz,
    read_at timestamptz,
    
    -- Threading
    reply_to_message_id uuid REFERENCES messages(id),
    
    -- Rating
    user_rating integer CHECK (user_rating >= 1 AND user_rating <= 5),
    is_helpful boolean
);

-- Message attachments
CREATE TABLE message_attachments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id uuid REFERENCES messages(id) ON DELETE CASCADE,
    
    -- File information
    filename text NOT NULL,
    original_name text NOT NULL,
    mime_type text NOT NULL,
    file_size bigint NOT NULL,
    
    -- Storage
    storage_bucket text NOT NULL,
    storage_path text NOT NULL,
    public_url text,
    
    -- Metadata
    metadata jsonb DEFAULT '{}',
    
    created_at timestamptz DEFAULT now()
);

-- =====================================================
-- BRAIN AI SYSTEM
-- =====================================================

-- Brain AI consolidated data
CREATE TABLE brain_ai_data (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
    
    -- Consolidated profile
    consolidated_profile jsonb NOT NULL DEFAULT '{}',
    
    -- Knowledge base
    insights jsonb DEFAULT '[]',
    patterns jsonb DEFAULT '[]',
    success_metrics jsonb DEFAULT '{}',
    projects jsonb DEFAULT '[]',
    
    -- Assistant relationships
    assistant_relationships jsonb DEFAULT '{}',
    
    -- Global context
    global_context jsonb DEFAULT '{}',
    
    -- Analytics
    analytics_data jsonb DEFAULT '{}',
    
    -- Timestamps
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    last_sync_at timestamptz DEFAULT now()
);

-- Individual insights
CREATE TABLE user_insights (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
    assistant_id text REFERENCES assistants_catalog(id),
    
    -- Insight content
    content text NOT NULL,
    category insight_category_enum NOT NULL,
    confidence numeric(3,2) DEFAULT 0.5,
    
    -- Metadata
    source text,
    evidence jsonb DEFAULT '{}',
    tags text[],
    
    -- Status
    is_actionable boolean DEFAULT false,
    action_taken text,
    status insight_status_enum DEFAULT 'discovered',
    
    -- Timestamps
    discovered_at timestamptz DEFAULT now(),
    last_validated_at timestamptz,
    expires_at timestamptz
);

-- Behavior patterns
CREATE TABLE behavior_patterns (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
    
    -- Pattern description
    pattern_description text NOT NULL,
    pattern_type pattern_type_enum NOT NULL,
    frequency integer DEFAULT 1,
    confidence numeric(3,2) DEFAULT 0.5,
    
    -- Pattern data
    pattern_data jsonb DEFAULT '{}',
    triggers text[],
    outcomes text[],
    
    -- Observers
    observed_by text[],
    
    -- Timestamps
    first_observed_at timestamptz DEFAULT now(),
    last_observed_at timestamptz DEFAULT now(),
    
    -- Predictions
    predicted_next_occurrence timestamptz,
    prediction_confidence numeric(3,2)
);

-- User projects
CREATE TABLE user_projects (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
    
    -- Project information
    name text NOT NULL,
    description text,
    category project_category_enum,
    priority project_priority_enum DEFAULT 'medium',
    
    -- Status
    status project_status_enum DEFAULT 'planning',
    progress_percentage integer DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    
    -- Dates
    start_date date,
    target_date date,
    completion_date date,
    
    -- Assistants involved
    assistants_involved text[],
    
    -- Goals and results
    objectives text[],
    key_results text[],
    outcomes_achieved text[],
    
    -- Metrics
    success_metrics jsonb DEFAULT '{}',
    
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- =====================================================
-- SUBSCRIPTIONS AND BILLING
-- =====================================================

-- Subscription plans
CREATE TABLE subscription_plans (
    id text PRIMARY KEY,
    name text NOT NULL,
    description text,
    
    -- Pricing
    monthly_price_usd numeric(10,2) NOT NULL,
    yearly_price_usd numeric(10,2) NOT NULL,
    yearly_discount_percentage integer DEFAULT 0,
    
    -- Limits
    max_assistants integer,
    max_monthly_messages integer,
    max_automations integer,
    max_integrations integer,
    max_storage_gb integer,
    
    -- Features
    features text[],
    limitations text[],
    
    -- AI Models
    allowed_ai_models text[],
    premium_models_included boolean DEFAULT false,
    
    -- Support
    support_level support_level_enum DEFAULT 'email',
    sla_response_time interval,
    
    -- Metadata
    is_active boolean DEFAULT true,
    is_popular boolean DEFAULT false,
    sort_order integer DEFAULT 0,
    
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- User subscriptions
CREATE TABLE user_subscriptions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
    organization_id uuid REFERENCES organizations(id),
    plan_id text REFERENCES subscription_plans(id),
    
    -- Subscription status
    status subscription_status_enum DEFAULT 'trial',
    billing_cycle billing_cycle_enum DEFAULT 'monthly',
    
    -- Dates
    trial_start_date date,
    trial_end_date date,
    subscription_start_date date,
    current_period_start date,
    current_period_end date,
    cancelled_at timestamptz,
    ended_at timestamptz,
    
    -- Billing
    stripe_customer_id text,
    stripe_subscription_id text,
    payment_method_id text,
    
    -- Pricing (historical)
    monthly_amount numeric(10,2),
    yearly_amount numeric(10,2),
    currency text DEFAULT 'USD',
    
    -- Usage
    current_period_usage jsonb DEFAULT '{}',
    
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Invoices
CREATE TABLE invoices (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_subscription_id uuid REFERENCES user_subscriptions(id),
    
    -- Invoice information
    invoice_number text UNIQUE NOT NULL,
    stripe_invoice_id text,
    
    -- Amounts
    subtotal numeric(10,2) NOT NULL,
    tax_amount numeric(10,2) DEFAULT 0,
    discount_amount numeric(10,2) DEFAULT 0,
    total_amount numeric(10,2) NOT NULL,
    currency text DEFAULT 'USD',
    
    -- Status
    status invoice_status_enum DEFAULT 'draft',
    
    -- Dates
    issue_date date NOT NULL,
    due_date date NOT NULL,
    paid_date date,
    
    -- Details
    line_items jsonb NOT NULL DEFAULT '[]',
    billing_address jsonb,
    
    -- Files
    pdf_url text,
    
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Subscription usage tracking
CREATE TABLE subscription_usage (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_subscription_id uuid REFERENCES user_subscriptions(id),
    
    -- Period
    period_start date NOT NULL,
    period_end date NOT NULL,
    
    -- Usage metrics
    messages_sent integer DEFAULT 0,
    ai_tokens_used bigint DEFAULT 0,
    storage_used_gb numeric(10,3) DEFAULT 0,
    automations_executed integer DEFAULT 0,
    
    -- Costs
    ai_model_costs numeric(10,6) DEFAULT 0,
    storage_costs numeric(10,6) DEFAULT 0,
    total_costs numeric(10,4) DEFAULT 0,
    
    -- Breakdown
    usage_by_assistant jsonb DEFAULT '{}',
    
    created_at timestamptz DEFAULT now()
);

-- =====================================================
-- INTEGRATIONS
-- =====================================================

-- Integration configurations
CREATE TABLE integrations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
    
    -- Integration type
    integration_type integration_type_enum NOT NULL,
    name text NOT NULL,
    
    -- Configuration
    config jsonb NOT NULL DEFAULT '{}',
    credentials jsonb, -- Encrypted
    
    -- Status
    is_active boolean DEFAULT true,
    status integration_status_enum DEFAULT 'pending',
    last_sync_at timestamptz,
    sync_frequency interval DEFAULT '1 hour',
    
    -- Errors
    last_error text,
    error_count integer DEFAULT 0,
    
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Integration sync logs
CREATE TABLE integration_sync_logs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    integration_id uuid REFERENCES integrations(id) ON DELETE CASCADE,
    
    -- Sync result
    status sync_status_enum NOT NULL,
    records_processed integer DEFAULT 0,
    records_created integer DEFAULT 0,
    records_updated integer DEFAULT 0,
    records_failed integer DEFAULT 0,
    
    -- Details
    sync_details jsonb,
    error_details jsonb,
    
    -- Timing
    started_at timestamptz DEFAULT now(),
    completed_at timestamptz,
    duration_ms integer
);

-- =====================================================
-- AUTOMATIONS (FUTURE ROADMAP)
-- =====================================================

-- Automation definitions
CREATE TABLE automation_definitions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
    assistant_id text REFERENCES assistants_catalog(id),
    
    -- Configuration
    name text NOT NULL,
    description text,
    trigger_type automation_trigger_enum NOT NULL,
    trigger_config jsonb NOT NULL DEFAULT '{}',
    
    -- Actions
    actions jsonb NOT NULL DEFAULT '[]',
    
    -- Conditions
    conditions jsonb DEFAULT '[]',
    
    -- Status
    is_active boolean DEFAULT true,
    last_executed_at timestamptz,
    next_execution_at timestamptz,
    
    -- Statistics
    execution_count integer DEFAULT 0,
    success_count integer DEFAULT 0,
    failure_count integer DEFAULT 0,
    
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Automation executions
CREATE TABLE automation_executions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    automation_id uuid REFERENCES automation_definitions(id) ON DELETE CASCADE,
    
    -- Result
    status execution_status_enum NOT NULL,
    trigger_data jsonb,
    execution_result jsonb,
    error_message text,
    
    -- Timing
    started_at timestamptz DEFAULT now(),
    completed_at timestamptz,
    duration_ms integer,
    
    -- Costs
    ai_tokens_used integer DEFAULT 0,
    cost numeric(10,6) DEFAULT 0
);

-- =====================================================
-- SYSTEM ADMINISTRATION
-- =====================================================

-- System configuration
CREATE TABLE system_config (
    key text PRIMARY KEY,
    value jsonb NOT NULL,
    description text,
    is_public boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Audit logs
CREATE TABLE audit_logs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Actor
    user_id uuid REFERENCES profiles(id),
    user_email text,
    user_ip_address inet,
    
    -- Action
    action text NOT NULL,
    resource_type text NOT NULL,
    resource_id text,
    
    -- Details
    details jsonb DEFAULT '{}',
    old_values jsonb,
    new_values jsonb,
    
    -- Metadata
    user_agent text,
    session_id text,
    
    created_at timestamptz DEFAULT now()
);

-- System metrics
CREATE TABLE system_metrics (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Timing
    recorded_at timestamptz DEFAULT now(),
    metric_date date DEFAULT CURRENT_DATE,
    
    -- Usage metrics
    total_users integer DEFAULT 0,
    active_users_daily integer DEFAULT 0,
    active_users_weekly integer DEFAULT 0,
    active_users_monthly integer DEFAULT 0,
    
    -- Message metrics
    total_messages integer DEFAULT 0,
    messages_by_assistant jsonb DEFAULT '{}',
    
    -- Subscription metrics
    total_subscriptions integer DEFAULT 0,
    subscriptions_by_plan jsonb DEFAULT '{}',
    mrr numeric(12,2) DEFAULT 0,
    
    -- Performance metrics
    average_response_time numeric(8,3) DEFAULT 0,
    error_rate numeric(5,4) DEFAULT 0,
    
    -- Costs
    ai_model_costs numeric(10,4) DEFAULT 0,
    infrastructure_costs numeric(10,4) DEFAULT 0,
    
    -- Metadata
    calculated_at timestamptz DEFAULT now()
);

-- Admin users
CREATE TABLE admin_users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
    
    -- Permissions
    role admin_role_enum NOT NULL DEFAULT 'support',
    permissions text[],
    
    -- Access
    is_active boolean DEFAULT true,
    granted_by uuid REFERENCES profiles(id),
    granted_at timestamptz DEFAULT now(),
    last_access_at timestamptz,
    
    -- Security
    ip_whitelist inet[],
    mfa_enabled boolean DEFAULT false
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Profiles indexes
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_company_industry ON profiles(company_industry);
CREATE INDEX idx_profiles_last_active ON profiles(last_active_at DESC);
CREATE INDEX idx_profiles_onboarding ON profiles(onboarding_completed, onboarding_step);

-- Conversations indexes
CREATE INDEX idx_conversations_user_id ON conversations(user_id);
CREATE INDEX idx_conversations_assistant_id ON conversations(assistant_id);
CREATE INDEX idx_conversations_status ON conversations(status);
CREATE INDEX idx_conversations_last_message ON conversations(last_message_at DESC);

-- Messages indexes
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX idx_messages_role ON messages(role);
CREATE INDEX idx_messages_type ON messages(content_type);

-- Brain AI indexes
CREATE INDEX idx_brain_ai_user_id ON brain_ai_data(user_id);
CREATE INDEX idx_insights_user_id ON user_insights(user_id);
CREATE INDEX idx_insights_category ON user_insights(category);
CREATE INDEX idx_insights_status ON user_insights(status);
CREATE INDEX idx_patterns_user_id ON behavior_patterns(user_id);
CREATE INDEX idx_patterns_type ON behavior_patterns(pattern_type);

-- Subscription indexes
CREATE INDEX idx_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON user_subscriptions(status);
CREATE INDEX idx_subscriptions_plan_id ON user_subscriptions(plan_id);
CREATE INDEX idx_invoices_subscription_id ON invoices(user_subscription_id);
CREATE INDEX idx_invoices_status ON invoices(status);

-- System indexes
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- =====================================================
-- FUNCTIONS AND TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_assistants_catalog_updated_at BEFORE UPDATE ON assistants_catalog FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_assistant_configurations_updated_at BEFORE UPDATE ON assistant_configurations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_brain_ai_data_updated_at BEFORE UPDATE ON brain_ai_data FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_projects_updated_at BEFORE UPDATE ON user_projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subscription_plans_updated_at BEFORE UPDATE ON subscription_plans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_subscriptions_updated_at BEFORE UPDATE ON user_subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_integrations_updated_at BEFORE UPDATE ON integrations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_automation_definitions_updated_at BEFORE UPDATE ON automation_definitions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_system_config_updated_at BEFORE UPDATE ON system_config FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update last_active_at when user does anything
CREATE OR REPLACE FUNCTION update_user_last_active()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE profiles SET last_active_at = CURRENT_TIMESTAMP WHERE id = NEW.user_id;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply last_active trigger
CREATE TRIGGER update_last_active_on_message AFTER INSERT ON messages FOR EACH ROW EXECUTE FUNCTION update_user_last_active();

-- Function to update conversation statistics
CREATE OR REPLACE FUNCTION update_conversation_stats()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE conversations SET 
        message_count = (SELECT COUNT(*) FROM messages WHERE conversation_id = NEW.conversation_id),
        last_message_at = NEW.created_at,
        total_tokens_used = COALESCE((SELECT SUM(tokens_used) FROM messages WHERE conversation_id = NEW.conversation_id), 0),
        cost = COALESCE((SELECT SUM(cost) FROM messages WHERE conversation_id = NEW.conversation_id), 0)
    WHERE id = NEW.conversation_id;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply conversation stats trigger
CREATE TRIGGER update_conversation_stats_on_message AFTER INSERT ON messages FOR EACH ROW EXECUTE FUNCTION update_conversation_stats();

-- Function to update assistant interaction statistics
CREATE OR REPLACE FUNCTION update_assistant_interaction_stats()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE user_assistants SET 
        total_interactions = total_interactions + 1,
        last_interaction = NEW.created_at
    WHERE user_id = (SELECT user_id FROM conversations WHERE id = NEW.conversation_id) 
    AND assistant_id = (SELECT assistant_id FROM conversations WHERE id = NEW.conversation_id);
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply assistant stats trigger
CREATE TRIGGER update_assistant_stats_on_message AFTER INSERT ON messages FOR EACH ROW EXECUTE FUNCTION update_assistant_interaction_stats();
