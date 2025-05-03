import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sfrlnidbiviniuqhryyc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmcmxuaWRiaXZpbml1cWhyeXljIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDUwMzE1MSwiZXhwIjoyMDYwMDc5MTUxfQ.n954lNEqQLPbqd7YwIp-6h4EcPr9Z31ujyfyfsq6gyI';

const supabase = createClient(supabaseUrl, supabaseKey);

async function querySchema() {
    try {
        console.log('Checking table existence and data...');

        // Check table existence and data
        const tables = ['donors', 'expenses', 'donations'];
        
        for (const table of tables) {
            console.log(`\nChecking ${table} table...`);
            
            // Check if table exists and has data
            const { data: tableData, error: tableError } = await supabase
                .from(table)
                .select('*')
                .limit(1);

            if (tableError) {
                console.log(`Error accessing ${table} table:`, tableError);
            } else {
                console.log(`${table} data:`, tableData);
            }
        }

        // Check RLS policies using the get_top_donors RPC
        console.log('\nChecking RLS policies...');
        const { data: donorData, error: donorError } = await supabase
            .rpc('get_top_donors', { limit: 1 });

        if (donorError) {
            console.log('Error calling get_top_donors RPC:', donorError);
        } else {
            console.log('Top donors data:', donorData);
        }

    } catch (error) {
        console.error('Error querying schema:', error);
    }
}

querySchema();
