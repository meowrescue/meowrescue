import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sfrlnidbiviniuqhryyc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmcmxuaWRiaXZpbml1cWhyeXljIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDUwMzE1MSwiZXhwIjoyMDYwMDc5MTUxfQ.n954lNEqQLPbqd7YwIp-6h4EcPr9Z31ujyfyfsq6gyI';

const supabase = createClient(supabaseUrl, supabaseKey);

async function getSchema() {
    try {
        console.log('Fetching schema information...');

        // Get tables
        const { data: tables, error: tablesError } = await supabase
            .rpc('get_tables');

        if (tablesError) throw tablesError;

        // Get columns for each table
        const tableSchemas = await Promise.all(
            tables.map(async (table) => {
                const { data: columns, error: columnsError } = await supabase
                    .rpc('get_columns', { table_name: table });

                if (columnsError) throw columnsError;

                return {
                    table,
                    columns
                };
            })
        );

        console.log('Schema:', JSON.stringify(tableSchemas, null, 2));
        
        // Write to file
        const fs = require('fs');
        fs.writeFileSync('schema.json', JSON.stringify(tableSchemas, null, 2));
        console.log('Schema written to schema.json');

    } catch (error) {
        console.error('Error fetching schema:', error);
        process.exit(1);
    }
}

getSchema();
