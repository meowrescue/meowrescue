/**
 * Database Monitoring Service
 * 
 * This service monitors database activity for suspicious behaviors
 * without affecting the visual appearance of the application.
 */

import { getClient } from '@/utils/supabaseClient';
import { logSecurityIssue } from './errorLogging';

// Types of database operations to monitor
export enum DatabaseOperation {
  INSERT = 'insert',
  UPDATE = 'update',
  DELETE = 'delete',
  SELECT = 'select'
}

// Sensitive tables that require extra monitoring
const SENSITIVE_TABLES = [
  'profiles',
  'users',
  'donations',
  'applications',
  'expenses'
];

// Rate limiting thresholds
const RATE_LIMITS = {
  // Max operations per minute
  profiles: { [DatabaseOperation.DELETE]: 5, [DatabaseOperation.UPDATE]: 20 },
  donations: { [DatabaseOperation.DELETE]: 5, [DatabaseOperation.UPDATE]: 15 },
  applications: { [DatabaseOperation.DELETE]: 5, [DatabaseOperation.UPDATE]: 10 },
  expenses: { [DatabaseOperation.DELETE]: 5, [DatabaseOperation.UPDATE]: 15 },
  cats: { [DatabaseOperation.DELETE]: 10 }
};

// Keep track of operations for rate limiting
const operationCounts: Record<string, Record<DatabaseOperation, number[]>> = {};

/**
 * Initialize monitoring for a specific table
 */
export function initTableMonitoring(tableName: string): void {
  if (!operationCounts[tableName]) {
    operationCounts[tableName] = {
      [DatabaseOperation.INSERT]: [],
      [DatabaseOperation.UPDATE]: [],
      [DatabaseOperation.DELETE]: [],
      [DatabaseOperation.SELECT]: []
    };
  }
}

/**
 * Record a database operation and check if it exceeds rate limits
 */
export function recordOperation(
  tableName: string,
  operation: DatabaseOperation,
  userId?: string
): boolean {
  // Initialize if needed
  if (!operationCounts[tableName]) {
    initTableMonitoring(tableName);
  }

  const now = Date.now();
  const oneMinuteAgo = now - 60000;
  
  // Clean up old operations
  operationCounts[tableName][operation] = operationCounts[tableName][operation].filter(
    timestamp => timestamp > oneMinuteAgo
  );
  
  // Add current operation
  operationCounts[tableName][operation].push(now);
  
  // Check if we're exceeding rate limits
  const limit = RATE_LIMITS[tableName as keyof typeof RATE_LIMITS]?.[operation];
  
  if (limit && operationCounts[tableName][operation].length > limit) {
    // Log security issue
    logSecurityIssue(`Rate limit exceeded: ${operation} on ${tableName}`, {
      component: 'DatabaseMonitoring',
      additionalData: {
        tableName,
        operation,
        count: operationCounts[tableName][operation].length,
        limit,
        userId
      }
    });
    
    return false; // Rate limit exceeded
  }
  
  return true; // Within limits
}

/**
 * Log database access to sensitive tables
 */
export async function logSensitiveTableAccess(
  tableName: string,
  operation: DatabaseOperation,
  rowIds: string[] | number[]
): Promise<void> {
  if (SENSITIVE_TABLES.includes(tableName)) {
    try {
      const supabase = getClient();
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id;
      
      // Record the operation for rate limiting
      const withinLimits = recordOperation(tableName, operation, userId);
      
      if (!withinLimits) {
        console.warn(`Rate limit exceeded for ${operation} on ${tableName}`);
        // In a real system, you might want to block the operation here
      }
      
      // Log to database activity log if you have one
      await supabase.from('activity_logs').insert({
        user_id: userId,
        action: `${operation}_${tableName}`,
        resource_ids: rowIds,
        metadata: {
          ip: window.clientInformation?.userAgentData?.mobile
            ? 'mobile'
            : 'desktop',
          timestamp: new Date().toISOString()
        }
      }).catch(err => console.error('Failed to log activity:', err));
      
    } catch (error) {
      console.error('Error logging sensitive table access:', error);
    }
  }
}

/**
 * Initialize database monitoring for all sensitive tables
 */
export function initDatabaseMonitoring(): void {
  // Initialize monitoring for all sensitive tables
  SENSITIVE_TABLES.forEach(initTableMonitoring);
  
  // Also monitor cats table
  initTableMonitoring('cats');
  
  console.log('Database monitoring initialized for sensitive tables');
}

export default {
  initDatabaseMonitoring,
  logSensitiveTableAccess,
  recordOperation,
  DatabaseOperation
};
