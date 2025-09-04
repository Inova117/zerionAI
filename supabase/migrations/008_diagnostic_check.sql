-- 🔍 DIAGNÓSTICO DEL ESTADO ACTUAL DE LA BASE DE DATOS
-- Verifica qué tablas del Cerebro AI existen y cuáles faltan

DO $diagnostic$
DECLARE
    _table_name TEXT;
    _tables_to_check TEXT[] := ARRAY[
        'user_profiles',
        'user_projects', 
        'assistant_relationships',
        'cerebro_insights',
        'learning_patterns',
        'dashboard_metrics',
        'user_activities',
        'user_settings',
        'user_automations',
        'automation_executions'
    ];
    _existing_tables TEXT[] := ARRAY[]::TEXT[];
    _missing_tables TEXT[] := ARRAY[]::TEXT[];
    _table_exists BOOLEAN;
BEGIN
    RAISE NOTICE '🔍 ========================================';
    RAISE NOTICE '🔍 DIAGNOSTICO DE BASE DE DATOS';
    RAISE NOTICE '🔍 ========================================';
    
    -- Verificar cada tabla
    FOREACH _table_name IN ARRAY _tables_to_check
    LOOP
        SELECT EXISTS (
            SELECT 1 FROM information_schema.tables 
            WHERE table_schema = 'public' AND table_name = _table_name
        ) INTO _table_exists;
        
        IF _table_exists THEN
            _existing_tables := _existing_tables || _table_name;
            RAISE NOTICE '✅ Tabla encontrada: %', _table_name;
        ELSE
            _missing_tables := _missing_tables || _table_name;
            RAISE NOTICE '❌ Tabla faltante: %', _table_name;
        END IF;
    END LOOP;
    
    -- Verificar enums
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'project_status_enum') THEN
        RAISE NOTICE '✅ Enum encontrado: project_status_enum';
        
        -- Mostrar valores del enum
        RAISE NOTICE 'Valores del enum: %', (
            SELECT array_to_string(ARRAY(
                SELECT enumlabel FROM pg_enum 
                WHERE enumtypid = 'public.project_status_enum'::regtype 
                ORDER BY enumsortorder
            ), ', ')
        );
    ELSE
        RAISE NOTICE '❌ Enum faltante: project_status_enum';
    END IF;
    
    -- Resumen
    RAISE NOTICE '🔍 ========================================';
    RAISE NOTICE '📊 RESUMEN DEL DIAGNOSTICO';
    RAISE NOTICE '🔍 ========================================';
    RAISE NOTICE '✅ Tablas existentes (%): %', array_length(_existing_tables, 1), array_to_string(_existing_tables, ', ');
    RAISE NOTICE '❌ Tablas faltantes (%): %', array_length(_missing_tables, 1), array_to_string(_missing_tables, ', ');
    
    IF array_length(_missing_tables, 1) > 0 THEN
        RAISE NOTICE '⚠️  ACCION REQUERIDA: Re-ejecutar migraciones faltantes';
        RAISE NOTICE '🔧 Migraciones a ejecutar:';
        
        -- Verificar qué migraciones faltan
        IF 'user_profiles' = ANY(_missing_tables) OR 'cerebro_insights' = ANY(_missing_tables) THEN
            RAISE NOTICE '   - 005_cerebro_ai_schema_final.sql';
        END IF;
        
        IF 'dashboard_metrics' = ANY(_missing_tables) OR 'user_activities' = ANY(_missing_tables) THEN
            RAISE NOTICE '   - 006_dashboard_tables.sql';
        END IF;
    ELSE
        RAISE NOTICE '🎉 TODAS LAS TABLAS ESTAN PRESENTES!';
        RAISE NOTICE '✅ Listo para crear indices con 007_cerebro_ai_indexes.sql';
    END IF;
    
    RAISE NOTICE '🔍 ========================================';

END $diagnostic$;
