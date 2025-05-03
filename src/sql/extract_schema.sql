-- Schema Extraction Script for MeowRescue
-- Run this on your old database to get a complete picture of your schema

-- Get all tables in the public schema
SELECT 
    table_name
FROM 
    information_schema.tables
WHERE 
    table_schema = 'public'
ORDER BY 
    table_name;

-- For each table, get its columns and data types
SELECT 
    table_name,
    column_name,
    data_type,
    column_default,
    is_nullable,
    character_maximum_length
FROM 
    information_schema.columns
WHERE 
    table_schema = 'public'
ORDER BY 
    table_name, 
    ordinal_position;

-- Get all primary keys
SELECT
    tc.table_schema, 
    tc.table_name, 
    kc.column_name
FROM 
    information_schema.table_constraints tc
JOIN 
    information_schema.key_column_usage kc 
    ON kc.table_name = tc.table_name
    AND kc.table_schema = tc.table_schema
    AND kc.constraint_name = tc.constraint_name
WHERE 
    tc.constraint_type = 'PRIMARY KEY'
    AND tc.table_schema = 'public'
ORDER BY 
    tc.table_schema,
    tc.table_name;

-- Get all foreign keys
SELECT
    tc.table_schema, 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_schema AS foreign_table_schema,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name,
    rc.delete_rule
FROM 
    information_schema.table_constraints AS tc 
JOIN 
    information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN 
    information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
JOIN
    information_schema.referential_constraints AS rc
    ON rc.constraint_name = tc.constraint_name
    AND rc.constraint_schema = tc.table_schema
WHERE 
    tc.constraint_type = 'FOREIGN KEY' 
    AND tc.table_schema = 'public'
ORDER BY
    tc.table_schema,
    tc.table_name;

-- Get all indexes
SELECT
    tablename,
    indexname,
    indexdef
FROM
    pg_indexes
WHERE
    schemaname = 'public'
ORDER BY
    tablename,
    indexname;

-- Get all functions
SELECT
    routine_name,
    routine_type,
    data_type AS return_type
FROM
    information_schema.routines
WHERE
    routine_schema = 'public'
ORDER BY
    routine_name;

-- Get all triggers
SELECT
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement
FROM
    information_schema.triggers
WHERE
    trigger_schema = 'public'
ORDER BY
    event_object_table,
    trigger_name;

-- Get all RLS policies
SELECT
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM
    pg_policies
WHERE
    schemaname = 'public'
ORDER BY
    tablename,
    policyname;

-- Check for any tables with RLS disabled (should be none ideally)
SELECT
    tablename
FROM
    pg_tables
WHERE
    schemaname = 'public'
    AND NOT EXISTS (
        SELECT 1
        FROM pg_policies
        WHERE schemaname = 'public'
        AND tablename = pg_tables.tablename
    );

-- Check for unused columns (this is an approximation)
-- This query looks for columns that are never updated or inserted into
-- Note: This requires pg_stat_statements extension and won't be 100% accurate
-- You'll need to review the results manually
WITH column_usage AS (
    SELECT
        table_schema,
        table_name,
        column_name
    FROM
        information_schema.columns
    WHERE
        table_schema = 'public'
)
SELECT
    cu.table_name,
    cu.column_name,
    'Potentially unused' AS status
FROM
    column_usage cu
LEFT JOIN
    pg_stats ps
    ON ps.schemaname = cu.table_schema
    AND ps.tablename = cu.table_name
    AND ps.attname = cu.column_name
WHERE
    ps.null_frac = 1  -- Column is 100% NULL
    OR ps.attname IS NULL  -- Column has no statistics (might be unused)
ORDER BY
    cu.table_name,
    cu.column_name;

-- Get table usage statistics
SELECT
    relname AS table_name,
    n_tup_ins AS inserts,
    n_tup_upd AS updates,
    n_tup_del AS deletes,
    n_live_tup AS live_rows,
    n_dead_tup AS dead_rows
FROM
    pg_stat_user_tables
WHERE
    schemaname = 'public'
ORDER BY
    relname;
