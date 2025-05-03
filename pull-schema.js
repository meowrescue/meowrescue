import fetch from 'node-fetch';
import * as fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SUPABASE_URL = 'https://sfrlnidbiviniuqhryyc.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmcmxuaWRiaXZpbml1cWhyeXljIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDUwMzE1MSwiZXhwIjoyMDYwMDc5MTUxfQ.n954lNEqQLPbqd7YwIp-6h4EcPr9Z31ujyfyfsq6gyI';

async function pullSchema() {
    try {
        console.log('Fetching schema from Supabase...');
        const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/get_schema`, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_SERVICE_KEY,
                'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({})
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}\nResponse: ${errorText}`);
        }

        const schema = await response.text();
        console.log('Successfully pulled schema');
        
        // Write schema to file
        fs.writeFileSync('schema.sql', schema);
        console.log('Schema written to schema.sql');
        console.log('Schema has been saved. You can now check the schema.sql file for the database structure.');
    } catch (error) {
        console.error('Error pulling schema:', error);
        process.exit(1);
    }
}

pullSchema();
