// Provide fallback Supabase credentials if environment variables are missing
(function() {
  console.log('Initializing fallback Supabase credentials');
  
  // Only set if not already defined
  if (!window.ENV_SUPABASE_URL) {
    window.ENV_SUPABASE_URL = "https://sfrlnidbiviniuqhryyc.supabase.co";
    console.log('Set fallback Supabase URL');
  }
  
  if (!window.ENV_SUPABASE_ANON_KEY) {
    window.ENV_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmcmxuaWRiaXZpbml1cWhyeXljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDUxNzcyMjUsImV4cCI6MjAyMDc1MzIyNX0.oK4-UnxE2u4r5FbNfcN_R_R7l66pYPGOqI29X3AuQVs";
    console.log('Set fallback Supabase anon key');
  }
  
  // Handle compatibility issues with Supabase client initialization
  const originalCreateClient = window.createClient;
  if (typeof originalCreateClient === 'function') {
    window.createClient = function() {
      try {
        return originalCreateClient();
      } catch (e) {
        console.log('Error creating Supabase client, using fallback');
        // Create a fallback client
        return {
          auth: {
            onAuthStateChange: (callback) => {
              callback('SIGNED_OUT', null);
              return { data: { subscription: { unsubscribe: () => {} } } };
            },
            getSession: () => Promise.resolve({ data: { session: null } })
          },
          from: (table) => ({
            select: (cols) => ({
              eq: (field, value) => ({
                order: (col, direction) => ({
                  range: (from, to) => Promise.resolve({ data: [], error: null })
                }),
                limit: (n) => Promise.resolve({ data: [], error: null })
              })
            })
          }),
          storage: {
            from: (bucket) => ({
              getPublicUrl: (path) => ({ data: { publicUrl: path } })
            })
          }
        };
      }
    };
  }
})();