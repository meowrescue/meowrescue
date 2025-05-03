
import getSupabaseClient from '@/integrations/getSupabaseClient()/client';

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
    const { data, error } = await getSupabaseClient().rpc('log_activity', {
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
    return getSupabaseClient().rpc('log_activity', {
      p_activity_type: 'login',
      p_description: `User logged in: ${email}`,
      p_metadata: JSON.stringify({ user_id: userId, email })
    }).then(({ data, error }) => {
      if (error) {
        console.error('Error logging activity:', error);
        return null;
      }
      return data;
    });
  },
  
  logout: async (userId: string, email: string) => {
    return getSupabaseClient().rpc('log_activity', {
      p_activity_type: 'logout',
      p_description: `User logged out: ${email}`,
      p_metadata: JSON.stringify({ user_id: userId, email })
    }).then(({ data, error }) => {
      if (error) {
        console.error('Error logging activity:', error);
        return null;
      }
      return data;
    });
  },
  
  register: async (userId: string, email: string) => {
    return getSupabaseClient().rpc('log_activity', {
      p_activity_type: 'create',
      p_description: `New user registered: ${email}`,
      p_metadata: JSON.stringify({ user_id: userId, email })
    }).then(({ data, error }) => {
      if (error) {
        console.error('Error logging activity:', error);
        return null;
      }
      return data;
    });
  }
};

/**
 * Utility to log data management events
 */
export const logData = {
  create: async (entity: string, id: string, name: string) => {
    return getSupabaseClient().rpc('log_activity', {
      p_activity_type: 'create',
      p_description: `Created ${entity}: ${name}`,
      p_metadata: JSON.stringify({ entity, id, name })
    }).then(({ data, error }) => {
      if (error) {
        console.error('Error logging activity:', error);
        return null;
      }
      return data;
    });
  },
  
  update: async (entity: string, id: string, name: string) => {
    return getSupabaseClient().rpc('log_activity', {
      p_activity_type: 'update',
      p_description: `Updated ${entity}: ${name}`,
      p_metadata: JSON.stringify({ entity, id, name })
    }).then(({ data, error }) => {
      if (error) {
        console.error('Error logging activity:', error);
        return null;
      }
      return data;
    });
  },
  
  delete: async (entity: string, id: string, name: string) => {
    return getSupabaseClient().rpc('log_activity', {
      p_activity_type: 'delete',
      p_description: `Deleted ${entity}: ${name}`,
      p_metadata: JSON.stringify({ entity, id, name })
    }).then(({ data, error }) => {
      if (error) {
        console.error('Error logging activity:', error);
        return null;
      }
      return data;
    });
  }
};
