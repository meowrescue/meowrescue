import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://example.supabase.co';
const supabaseAnonKey = 'example_key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const checkSupabaseConnection = async () => {
  try {
    const { error } = await supabase.auth.getSession();
    return !error;
  } catch (error) {
    console.error('Supabase connection check failed:', error);
    return false;
  }
};

export const checkFinancialData = async () => {
  try {
    const { data, error } = await supabase
      .from('financial_data')
      .select('*')
      .limit(1);
    
    if (error) throw error;
    return data.length > 0;
  } catch (error) {
    console.error('Financial data check failed:', error);
    return false;
  }
};
