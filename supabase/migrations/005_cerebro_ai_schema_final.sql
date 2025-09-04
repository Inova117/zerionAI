-- 🧠 CEREBRO AI V2 - MIGRACIÓN FINAL ADAPTABLE
-- Crea las tablas del sistema de inteligencia artificial persistente

DO $$
DECLARE
    _enum_exists BOOLEAN;
    _enum_values TEXT[];
    _status_value TEXT;
    _sql TEXT;
BEGIN
    -- Check if project_status_enum exists
    SELECT EXISTS (
        SELECT 1
        FROM pg_type t
        JOIN pg_namespace ns ON t.typnamespace = ns.oid
        WHERE t.typname = 'project_status_enum' AND ns.nspname = 'public'
    ) INTO _enum_exists;

    IF _enum_exists THEN
        -- Get current enum values
        SELECT ARRAY(SELECT enumlabel FROM pg_enum WHERE enumtypid = 'public.project_status_enum'::regtype ORDER BY enumsortorder) INTO _enum_values;
        RAISE NOTICE 'Existing project_status_enum values: %', _enum_values;
    ELSE
        -- Create enum if it doesn't exist
        CREATE TYPE public.project_status_enum AS ENUM ('planning', 'active', 'review', 'completed', 'on_hold', 'cancelled');
        _enum_values := ARRAY['planning', 'active', 'review', 'completed', 'on_hold', 'cancelled'];
        RAISE NOTICE 'project_status_enum created with default values.';
    END IF;

    -- Add missing values to enum if it exists
    IF _enum_exists THEN
        IF NOT ('review' = ANY(_enum_values)) THEN
            ALTER TYPE public.project_status_enum ADD VALUE 'review' AFTER 'active';
            RAISE NOTICE 'Added "review" to project_status_enum.';
        END IF;
        IF NOT ('on_hold' = ANY(_enum_values)) THEN
            ALTER TYPE public.project_status_enum ADD VALUE 'on_hold' AFTER 'completed';
            RAISE NOTICE 'Added "on_hold" to project_status_enum.';
        END IF;
        IF NOT ('cancelled' = ANY(_enum_values)) THEN
            ALTER TYPE public.project_status_enum ADD VALUE 'cancelled' AFTER 'on_hold';
            RAISE NOTICE 'Added "cancelled" to project_status_enum.';
        END IF;
        -- Re-fetch updated enum values
        SELECT ARRAY(SELECT enumlabel FROM pg_enum WHERE enumtypid = 'public.project_status_enum'::regtype ORDER BY enumsortorder) INTO _enum_values;
    END IF;

    -- Table: user_profiles
    CREATE TABLE IF NOT EXISTS public.user_profiles (
        id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
        name text,
        company text,
        industry text,
        role text,
        working_style text,
        communication_prefs text,
        decision_making text,
        created_at timestamp with time zone DEFAULT now() NOT NULL
    );
    ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Users can view their own profile." ON public.user_profiles;
    CREATE POLICY "Users can view their own profile." ON public.user_profiles FOR SELECT USING (auth.uid() = id);
    DROP POLICY IF EXISTS "Users can update their own profile." ON public.user_profiles;
    CREATE POLICY "Users can update their own profile." ON public.user_profiles FOR UPDATE USING (auth.uid() = id);
    RAISE NOTICE 'Table user_profiles checked/created and RLS policies applied.';

    -- Table: user_projects
    CREATE TABLE IF NOT EXISTS public.user_projects (
        id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
        user_id uuid REFERENCES public.user_profiles ON DELETE CASCADE NOT NULL,
        name text NOT NULL,
        description text,
        status public.project_status_enum DEFAULT 'planning'::public.project_status_enum NOT NULL,
        priority text,
        start_date date,
        end_date date,
        assistants_involved text[],
        created_at timestamp with time zone DEFAULT now() NOT NULL
    );
    ALTER TABLE public.user_projects ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Users can view their own projects." ON public.user_projects;
    CREATE POLICY "Users can view their own projects." ON public.user_projects FOR SELECT USING (auth.uid() = user_id);
    DROP POLICY IF EXISTS "Users can create projects." ON public.user_projects;
    CREATE POLICY "Users can create projects." ON public.user_projects FOR INSERT WITH CHECK (auth.uid() = user_id);
    DROP POLICY IF EXISTS "Users can update their own projects." ON public.user_projects;
    CREATE POLICY "Users can update their own projects." ON public.user_projects FOR UPDATE USING (auth.uid() = user_id);
    DROP POLICY IF EXISTS "Users can delete their own projects." ON public.user_projects;
    CREATE POLICY "Users can delete their own projects." ON public.user_projects FOR DELETE USING (auth.uid() = user_id);
    RAISE NOTICE 'Table user_projects checked/created and RLS policies applied.';

    -- Indexes for user_projects
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE tablename = 'user_projects' AND indexname = 'idx_user_projects_user_id') THEN
        CREATE INDEX idx_user_projects_user_id ON public.user_projects(user_id);
        RAISE NOTICE 'Index idx_user_projects_user_id created.';
    END IF;

    -- Note: Indexes will be created in a separate migration to avoid enum transaction issues
    RAISE NOTICE 'Status indexes will be created in next migration after enum commit.';

    -- Table: assistant_relationships
    CREATE TABLE IF NOT EXISTS public.assistant_relationships (
        id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
        user_id uuid REFERENCES public.user_profiles ON DELETE CASCADE NOT NULL,
        assistant_id text NOT NULL,
        trust_level integer DEFAULT 50 NOT NULL,
        interaction_count integer DEFAULT 0 NOT NULL,
        successful_tasks integer DEFAULT 0 NOT NULL,
        last_interaction timestamp with time zone,
        preferred_task_types text[],
        user_satisfaction integer,
        communication_patterns text[],
        created_at timestamp with time zone DEFAULT now() NOT NULL,
        UNIQUE (user_id, assistant_id)
    );
    ALTER TABLE public.assistant_relationships ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Users can view their own assistant relationships." ON public.assistant_relationships;
    CREATE POLICY "Users can view their own assistant relationships." ON public.assistant_relationships FOR SELECT USING (auth.uid() = user_id);
    DROP POLICY IF EXISTS "Users can manage their own assistant relationships." ON public.assistant_relationships;
    CREATE POLICY "Users can manage their own assistant relationships." ON public.assistant_relationships FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
    RAISE NOTICE 'Table assistant_relationships checked/created and RLS policies applied.';

    -- Table: cerebro_insights
    CREATE TABLE IF NOT EXISTS public.cerebro_insights (
        id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
        user_id uuid REFERENCES public.user_profiles ON DELETE CASCADE NOT NULL,
        type text NOT NULL, -- 'pattern', 'opportunity', 'risk', 'optimization', 'behavior', 'activity'
        assistant_id text,
        title text,
        description text,
        content text,
        evidence text[],
        recommendations text[],
        assistants_to_involve text[],
        confidence numeric DEFAULT 0.5 NOT NULL,
        priority text, -- 'low', 'medium', 'high', 'critical'
        timestamp timestamp with time zone DEFAULT now() NOT NULL,
        actionable boolean DEFAULT FALSE NOT NULL,
        related_insights uuid[],
        created_at timestamp with time zone DEFAULT now() NOT NULL
    );
    ALTER TABLE public.cerebro_insights ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Users can view their own cerebro insights." ON public.cerebro_insights;
    CREATE POLICY "Users can view their own cerebro insights." ON public.cerebro_insights FOR SELECT USING (auth.uid() = user_id);
    DROP POLICY IF EXISTS "Users can create cerebro insights." ON public.cerebro_insights;
    CREATE POLICY "Users can create cerebro insights." ON public.cerebro_insights FOR INSERT WITH CHECK (auth.uid() = user_id);
    RAISE NOTICE 'Table cerebro_insights checked/created and RLS policies applied.';

    -- Table: learning_patterns
    CREATE TABLE IF NOT EXISTS public.learning_patterns (
        id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
        user_id uuid REFERENCES public.user_profiles ON DELETE CASCADE NOT NULL UNIQUE,
        most_active_hours text[],
        preferred_assistants text[],
        task_completion_style text,
        feedback_patterns text[],
        seasonal_trends text[],
        successful_strategies text[],
        common_bottlenecks text[],
        growth_indicators text[],
        current_focus text,
        upcoming_deadlines jsonb, -- e.g., [{ task: '...', date: '...', priority: '...' }]
        recent_achievements text[],
        emerging_needs text[],
        predicted_challenges text[],
        created_at timestamp with time zone DEFAULT now() NOT NULL,
        updated_at timestamp with time zone DEFAULT now() NOT NULL
    );
    ALTER TABLE public.learning_patterns ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Users can view their own learning patterns." ON public.learning_patterns;
    CREATE POLICY "Users can view their own learning patterns." ON public.learning_patterns FOR SELECT USING (auth.uid() = user_id);
    DROP POLICY IF EXISTS "Users can manage their own learning patterns." ON public.learning_patterns;
    CREATE POLICY "Users can manage their own learning patterns." ON public.learning_patterns FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
    RAISE NOTICE 'Table learning_patterns checked/created and RLS policies applied.';

    -- Function to handle new user creation in user_profiles
    CREATE OR REPLACE FUNCTION public.handle_new_user()
    RETURNS TRIGGER AS $trigger$
    BEGIN
        INSERT INTO public.user_profiles (id, name)
        VALUES (NEW.id, COALESCE(NEW.email, 'Usuario'));
        RETURN NEW;
    END;
    $trigger$ LANGUAGE plpgsql SECURITY DEFINER;

    -- Drop existing trigger if it exists
    DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

    -- Create trigger to call handle_new_user on auth.users insert
    CREATE TRIGGER on_auth_user_created
        AFTER INSERT ON auth.users
        FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
    RAISE NOTICE 'Trigger on_auth_user_created checked/created.';

    RAISE NOTICE '🧠 ============================================';
    RAISE NOTICE '🧠 CEREBRO AI V2 - MIGRACIÓN COMPLETADA  ';
    RAISE NOTICE '🧠 ============================================';
    RAISE NOTICE '📊 Tablas del Cerebro AI disponibles: 5';
    RAISE NOTICE '🔒 RLS habilitado y políticas aplicadas';
    RAISE NOTICE '⚡ Índices optimizados para performance  ';
    RAISE NOTICE '🎯 Sistema adaptado a esquema existente';
    RAISE NOTICE '✅ ¡Cerebro AI V2 listo para funcionar!';
    RAISE NOTICE '🧠 ============================================';

END;
$$ LANGUAGE plpgsql;
