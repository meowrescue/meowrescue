/**
 * Audit Logging Service
 * 
 * This service provides comprehensive audit logging for security-relevant events
 * in the application without affecting visual appearance.
 */

import { getClient } from '@/utils/supabaseClient';
import { logSecurityIssue } from './errorLogging';

// Types of auditable actions
export enum AuditAction {
  LOGIN = 'login',
  LOGOUT = 'logout',
  PROFILE_UPDATE = 'profile_update',
  ADMIN_ACTION = 'admin_action',
  PASSWORD_CHANGE = 'password_change',
  DATA_EXPORT = 'data_export',
  PERMISSION_CHANGE = 'permission_change',
  RESOURCE_ACCESS = 'resource_access',
  DONATION = 'donation',
  APPLICATION_STATUS_CHANGE = 'application_status_change'
}

// Impact levels for audit events
export enum AuditImpact {
  LOW = 'low',       // Informational events
  MEDIUM = 'medium', // Normal security events
  HIGH = 'high',     // Important security events
  CRITICAL = 'critical' // Events requiring immediate attention
}

interface AuditEventData {
  userId?: string;
  action: AuditAction;
  resource?: string;
  resourceId?: string;
  impact: AuditImpact;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Log an audit event to the database
 */
export async function logAuditEvent(eventData: AuditEventData): Promise<void> {
  try {
    const supabase = getClient();
    
    // Get current user if not provided
    let userId = eventData.userId;
    if (!userId) {
      const { data } = await supabase.auth.getUser();
      userId = data?.user?.id;
    }
    
    // Get IP and user agent if not provided
    const ipAddress = eventData.ipAddress || 'unknown';
    const userAgent = eventData.userAgent || 
      (typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown');
    
    // Create the audit log entry
    const { error } = await supabase.from('audit_logs').insert({
      user_id: userId,
      action: eventData.action,
      resource: eventData.resource,
      resource_id: eventData.resourceId,
      impact: eventData.impact,
      details: eventData.details || {},
      ip_address: ipAddress,
      user_agent: userAgent,
      created_at: new Date().toISOString()
    });
    
    if (error) {
      console.error('Failed to create audit log entry:', error);
      
      // If this is a high or critical impact event and logging failed,
      // attempt to log it through the error logging system as backup
      if (eventData.impact === AuditImpact.HIGH || eventData.impact === AuditImpact.CRITICAL) {
        logSecurityIssue('Failed to log critical audit event', {
          component: 'AuditLogging',
          additionalData: {
            ...eventData,
            error: error.message
          }
        });
      }
    }
  } catch (error) {
    console.error('Error in audit logging:', error);
  }
}

/**
 * Log a login event
 */
export function logUserLogin(userId: string, method: string, ipAddress?: string): void {
  logAuditEvent({
    userId,
    action: AuditAction.LOGIN,
    resource: 'auth',
    impact: AuditImpact.MEDIUM,
    details: { method },
    ipAddress
  });
}

/**
 * Log a logout event
 */
export function logUserLogout(userId: string): void {
  logAuditEvent({
    userId,
    action: AuditAction.LOGOUT,
    resource: 'auth',
    impact: AuditImpact.LOW
  });
}

/**
 * Log an admin action
 */
export function logAdminAction(
  userId: string, 
  action: string,
  resource: string,
  resourceId?: string,
  details?: Record<string, any>
): void {
  logAuditEvent({
    userId,
    action: AuditAction.ADMIN_ACTION,
    resource,
    resourceId,
    impact: AuditImpact.HIGH,
    details: {
      ...details,
      adminAction: action
    }
  });
}

/**
 * Log a permission change
 */
export function logPermissionChange(
  userId: string,
  targetUserId: string,
  oldRole: string,
  newRole: string
): void {
  logAuditEvent({
    userId,
    action: AuditAction.PERMISSION_CHANGE,
    resource: 'profiles',
    resourceId: targetUserId,
    impact: AuditImpact.CRITICAL,
    details: {
      oldRole,
      newRole,
      changedBy: userId
    }
  });
}

/**
 * Log a sensitive resource access
 */
export function logResourceAccess(
  userId: string,
  resource: string,
  resourceId: string
): void {
  logAuditEvent({
    userId,
    action: AuditAction.RESOURCE_ACCESS,
    resource,
    resourceId,
    impact: AuditImpact.MEDIUM
  });
}

/**
 * Check if we need to create the audit_logs table
 * This only runs during initialization
 */
export async function ensureAuditLogsTable(): Promise<void> {
  try {
    const supabase = getClient();
    
    // Check if the table exists
    const { data, error } = await supabase
      .from('audit_logs')
      .select('id')
      .limit(1);
    
    if (error && error.code === '42P01') { // Table doesn't exist
      console.warn('Audit logs table does not exist. Consider creating it for better security.');
      
      // In a production app, you would create the table via migrations
      // rather than dynamically at runtime
    }
  } catch (error) {
    console.error('Error checking audit logs table:', error);
  }
}

export default {
  logAuditEvent,
  logUserLogin,
  logUserLogout,
  logAdminAction,
  logPermissionChange,
  logResourceAccess,
  ensureAuditLogsTable,
  AuditAction,
  AuditImpact
};
