import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sfrlnidbiviniuqhryyc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmcmxuaWRiaXZpbml1cWhyeXljIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDUwMzE1MSwiZXhwIjoyMDYwMDc5MTUxfQ.n954lNEqQLPbqd7YwIp-6h4EcPr9Z31ujyfyfsq6gyI';

const supabase = createClient(supabaseUrl, supabaseKey);

async function listRPCFunctions() {
    try {
        // Query the system catalog to get all RPC functions
        const { data, error } = await supabase
            .rpc('get_top_donors')
            .select('function_name, function_schema');

        if (error) throw error;

        console.log('Available RPC functions:', data);
    } catch (error) {
        console.error('Error listing RPC functions:', error);
    }
}

listRPCFunctions();
