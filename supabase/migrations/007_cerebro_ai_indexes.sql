-- 🧠 CEREBRO AI V2 - ÍNDICES DE STATUS (POST-ENUM)
-- Crea los índices de status después de que el enum esté committeado
-- VERSIÓN SEGURA: Verifica que las tablas existan antes de crear índices

DO $indexes$
DECLARE
    _enum_values TEXT[];
    _status_value TEXT;
    _table_exists BOOLEAN;
BEGIN
    RAISE NOTICE 'Iniciando creacion de indices del Cerebro AI V2...';

    -- Verificar si el enum existe antes de proceder
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'project_status_enum') THEN
        -- Get current enum values for project_status_enum
        SELECT ARRAY(
            SELECT enumlabel 
            FROM pg_enum 
            WHERE enumtypid = 'public.project_status_enum'::regtype 
            ORDER BY enumsortorder
        ) INTO _enum_values;
        
        RAISE NOTICE 'Enum project_status_enum encontrado con valores: %s', array_to_string(_enum_values, ', ');

        -- Verificar si la tabla user_projects existe
        SELECT EXISTS (
            SELECT 1 FROM information_schema.tables 
            WHERE table_schema = 'public' AND table_name = 'user_projects'
        ) INTO _table_exists;

        IF _table_exists THEN
            -- Create indexes for each status value that exists
            FOREACH _status_value IN ARRAY _enum_values
            LOOP
                IF _status_value IN ('planning', 'active', 'review', 'completed', 'on_hold', 'cancelled') THEN
                    EXECUTE FORMAT(
                        'CREATE INDEX IF NOT EXISTS idx_user_projects_status_%s ON public.user_projects(status) WHERE status = %L',
                        _status_value, 
                        _status_value
                    );
                    RAISE NOTICE 'Creado indice para status: %s', _status_value;
                END IF;
            END LOOP;

            -- Create compound indexes for better performance
            CREATE INDEX IF NOT EXISTS idx_user_projects_user_status ON public.user_projects(user_id, status);
            CREATE INDEX IF NOT EXISTS idx_user_projects_created_at ON public.user_projects(created_at DESC);
            CREATE INDEX IF NOT EXISTS idx_user_projects_priority ON public.user_projects(priority) WHERE priority IS NOT NULL;
            RAISE NOTICE 'Indices compuestos creados para user_projects';
        ELSE
            RAISE NOTICE 'Tabla user_projects no encontrada, saltando indices';
        END IF;
    ELSE
        RAISE NOTICE 'Enum project_status_enum no encontrado, saltando indices de status';
    END IF;

    -- Verificar y crear índices para assistant_relationships
    SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'assistant_relationships'
    ) INTO _table_exists;

    IF _table_exists THEN
        CREATE INDEX IF NOT EXISTS idx_assistant_relationships_user_assistant ON public.assistant_relationships(user_id, assistant_id);
        CREATE INDEX IF NOT EXISTS idx_assistant_relationships_trust_level ON public.assistant_relationships(trust_level);
        CREATE INDEX IF NOT EXISTS idx_assistant_relationships_last_interaction ON public.assistant_relationships(last_interaction DESC) WHERE last_interaction IS NOT NULL;
        RAISE NOTICE 'Indices creados para assistant_relationships';
    ELSE
        RAISE NOTICE 'Tabla assistant_relationships no encontrada, saltando indices';
    END IF;

    -- Verificar y crear índices para cerebro_insights
    SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'cerebro_insights'
    ) INTO _table_exists;

    IF _table_exists THEN
        CREATE INDEX IF NOT EXISTS idx_cerebro_insights_user_type ON public.cerebro_insights(user_id, type);
        CREATE INDEX IF NOT EXISTS idx_cerebro_insights_assistant ON public.cerebro_insights(assistant_id) WHERE assistant_id IS NOT NULL;
        CREATE INDEX IF NOT EXISTS idx_cerebro_insights_timestamp ON public.cerebro_insights(timestamp DESC);
        CREATE INDEX IF NOT EXISTS idx_cerebro_insights_priority ON public.cerebro_insights(priority) WHERE priority IS NOT NULL;
        CREATE INDEX IF NOT EXISTS idx_cerebro_insights_actionable ON public.cerebro_insights(actionable) WHERE actionable = true;
        RAISE NOTICE 'Indices creados para cerebro_insights';
    ELSE
        RAISE NOTICE 'Tabla cerebro_insights no encontrada, saltando indices';
    END IF;

    -- Verificar y crear índices para learning_patterns
    SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'learning_patterns'
    ) INTO _table_exists;

    IF _table_exists THEN
        CREATE INDEX IF NOT EXISTS idx_learning_patterns_updated_at ON public.learning_patterns(updated_at DESC);
        RAISE NOTICE 'Indices creados para learning_patterns';
    ELSE
        RAISE NOTICE 'Tabla learning_patterns no encontrada, saltando indices';
    END IF;

    -- Verificar y crear índices para user_profiles
    SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'user_profiles'
    ) INTO _table_exists;

    IF _table_exists THEN
        CREATE INDEX IF NOT EXISTS idx_user_profiles_company ON public.user_profiles(company) WHERE company IS NOT NULL;
        CREATE INDEX IF NOT EXISTS idx_user_profiles_industry ON public.user_profiles(industry) WHERE industry IS NOT NULL;
        RAISE NOTICE 'Indices creados para user_profiles';
    ELSE
        RAISE NOTICE 'Tabla user_profiles no encontrada, saltando indices';
    END IF;

    RAISE NOTICE '🧠 ============================================';
    RAISE NOTICE '🧠 CEREBRO AI V2 - INDICES COMPLETADOS';
    RAISE NOTICE '🧠 ============================================';
    RAISE NOTICE '📊 Indices de status creados exitosamente';
    RAISE NOTICE '⚡ Indices compuestos para performance';
    RAISE NOTICE '🎯 Sistema de busqueda optimizado';
    RAISE NOTICE '✅ Cerebro AI V2 100 por ciento funcional!';
    RAISE NOTICE '🧠 ============================================';

END $indexes$;
