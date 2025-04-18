
import { supabase } from '@/integrations/supabase/client';

/**
 * Logs an activity to the activity_logs table
 * 
 * @param activityType Type of activity (login, logout, create, update, delete, etc.)
 * @param description Human-readable description of the activity
 * @param metadata Optional additional data related to the activity
 * @returns Promise resolving to the inserted log ID or null if error
 */
export const logActivity = async (
  activityType: string, 
  description: string, 
  metadata?: Record<string, any>
): Promise<string | null> => {
  try {
    // Call the RPC function to log activity
    const { data, error } = await supabase.rpc('log_activity', {
      p_activity_type: activityType,
      p_description: description,
      p_metadata: metadata ? JSON.stringify(metadata) : null
    });
    
    if (error) {
      console.error('Error logging activity:', error);
      return null;
    }
    
    return data;
  } catch (err) {
    console.error('Error in logActivity utility:', err);
    return null;
  }
};

/**
 * Utility to log authentication events
 */
export const logAuth = {
  login: async (userId: string, email: string) => {
    return logActivity('login', `User logged in: ${email}`, { user_id: userId, email });
  },
  
  logout: async (userId: string, email: string) => {
    return logActivity('logout', `User logged out: ${email}`, { user_id: userId, email });
  },
  
  register: async (userId: string, email: string) => {
    return logActivity('create', `New user registered: ${email}`, { user_id: userId, email });
  }
};

/**
 * Utility to log data management events
 */
export const logData = {
  create: async (entity: string, id: string, name: string) => {
    return logActivity('create', `Created ${entity}: ${name}`, { entity, id, name });
  },
  
  update: async (entity: string, id: string, name: string) => {
    return logActivity('update', `Updated ${entity}: ${name}`, { entity, id, name });
  },
  
  delete: async (entity: string, id: string, name: string) => {
    return logActivity('delete', `Deleted ${entity}: ${name}`, { entity, id, name });
  }
};
