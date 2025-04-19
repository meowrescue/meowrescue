
import { User as SupabaseUser } from '@supabase/supabase-js';

// Extend the Supabase User type with additional properties used in the app
export interface AppUser extends SupabaseUser {
  first_name?: string | null;
  last_name?: string | null;
  avatar_url?: string | null;
  role?: string;
  unread_chat_count?: number;
  unread_message_count?: number;
}
